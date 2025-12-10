// Email Automation Engine
// Automatically generate and schedule email campaigns

import { generateContentWithGemini } from './gemini';
import { supabase } from './supabase';

/**
 * Generate automated newsletter from recent social posts
 * @param {object} businessProfile - User's business profile
 * @param {array} recentPosts - Recent social media posts
 * @returns {Promise<object>} Newsletter content
 */
export async function generateAutoNewsletter(businessProfile, recentPosts = []) {
  try {
    console.log('📧 Generating automated newsletter...');
    
    // Get best performing posts (if we have engagement data)
    const topPosts = recentPosts
      .sort((a, b) => (b.engagement || 0) - (a.engagement || 0))
      .slice(0, 5);
    
    // Generate newsletter content
    const prompt = `Create an engaging email newsletter for ${businessProfile.businessName}.

Business: ${businessProfile.businessName}
Industry: ${businessProfile.industry}
Tone: Professional yet friendly

Include:
1. Catchy subject line
2. Opening greeting
3. Brief introduction paragraph
4. Main content section highlighting recent updates/tips
5. Call to action
6. Closing

${topPosts.length > 0 ? `Recent social media highlights:\n${topPosts.map((p, i) => `${i + 1}. ${p.content?.substring(0, 100)}...`).join('\n')}` : ''}

Format as HTML email with sections clearly marked.
Subject: [Write subject line here]
Content: [Write email body here]`;

    const response = await generateContentWithGemini(prompt, 'email', businessProfile);
    
    // Parse subject and content
    const subjectMatch = response.match(/Subject:\s*(.+)/i);
    const subject = subjectMatch ? subjectMatch[1].trim() : `Newsletter from ${businessProfile.businessName}`;
    
    const contentMatch = response.match(/Content:\s*([\s\S]+)/i);
    const content = contentMatch ? contentMatch[1].trim() : response;
    
    return {
      success: true,
      subject: subject,
      content: content,
      type: 'newsletter',
      generatedAt: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('Error generating newsletter:', error);
    throw error;
  }
}

/**
 * Generate welcome email sequence
 * @param {object} businessProfile - User's business profile
 * @returns {Promise<array>} Array of welcome emails
 */
export async function generateWelcomeSequence(businessProfile) {
  try {
    console.log('📧 Generating welcome email sequence...');
    
    const emails = [];
    
    // Email 1: Welcome & Introduction (Day 0)
    const email1 = await generateWelcomeEmail(businessProfile, 1, 'introduction');
    emails.push({
      ...email1,
      sequence: 1,
      dayDelay: 0,
      title: 'Welcome Email'
    });
    
    // Email 2: Value Proposition (Day 2)
    const email2 = await generateWelcomeEmail(businessProfile, 2, 'value');
    emails.push({
      ...email2,
      sequence: 2,
      dayDelay: 2,
      title: 'Why Choose Us'
    });
    
    // Email 3: Social Proof (Day 5)
    const email3 = await generateWelcomeEmail(businessProfile, 3, 'social_proof');
    emails.push({
      ...email3,
      sequence: 3,
      dayDelay: 5,
      title: 'Customer Success Stories'
    });
    
    // Email 4: Special Offer (Day 7)
    const email4 = await generateWelcomeEmail(businessProfile, 4, 'offer');
    emails.push({
      ...email4,
      sequence: 4,
      dayDelay: 7,
      title: 'Exclusive Welcome Offer'
    });
    
    // Email 5: Call to Action (Day 10)
    const email5 = await generateWelcomeEmail(businessProfile, 5, 'cta');
    emails.push({
      ...email5,
      sequence: 5,
      dayDelay: 10,
      title: 'Ready to Get Started?'
    });
    
    console.log(`✅ Generated ${emails.length} welcome emails`);
    return emails;
    
  } catch (error) {
    console.error('Error generating welcome sequence:', error);
    throw error;
  }
}

/**
 * Generate individual welcome email
 */
async function generateWelcomeEmail(businessProfile, sequenceNumber, emailType) {
  const prompts = {
    introduction: `Create a warm welcome email (Email 1 of 5).
Subject: Welcome to ${businessProfile.businessName}!
- Thank subscriber for joining
- Brief intro to business
- What to expect from emails
- Personal, friendly tone`,
    
    value: `Create value proposition email (Email 2 of 5).
Subject: Why ${businessProfile.businessName} is different
- Unique selling points
- How you help customers
- Key benefits
- Build trust`,
    
    social_proof: `Create social proof email (Email 3 of 5).
Subject: What our customers are saying
- Customer testimonials
- Success stories
- Reviews/ratings
- Build credibility`,
    
    offer: `Create special offer email (Email 4 of 5).
Subject: Exclusive welcome offer inside!
- Special discount/offer
- Limited time
- Clear call to action
- Create urgency`,
    
    cta: `Create final call-to-action email (Email 5 of 5).
Subject: Ready to get started with ${businessProfile.businessName}?
- Recap benefits
- Strong call to action
- Contact information
- Next steps`
  };
  
  const prompt = `${prompts[emailType]}

Business: ${businessProfile.businessName}
Industry: ${businessProfile.industry}
Products/Services: ${businessProfile.productsServices}
Website: ${businessProfile.website}
Phone: ${businessProfile.phone}

Write professional HTML email with:
- Engaging subject line
- Personal greeting
- Clear structure with sections
- Call to action
- Professional signature

Format:
Subject: [subject line]
Content: [HTML email body]`;

  const response = await generateContentWithGemini(prompt, 'email', businessProfile);
  
  const subjectMatch = response.match(/Subject:\s*(.+)/i);
  const subject = subjectMatch ? subjectMatch[1].trim() : `Email ${sequenceNumber} from ${businessProfile.businessName}`;
  
  const contentMatch = response.match(/Content:\s*([\s\S]+)/i);
  const content = contentMatch ? contentMatch[1].trim() : response;
  
  return {
    subject: subject,
    content: content,
    type: emailType
  };
}

/**
 * Generate promotional email campaign
 * @param {object} businessProfile - User's business profile
 * @param {object} campaignDetails - Campaign specifics (offer, product, etc.)
 * @returns {Promise<object>} Promotional email
 */
export async function generatePromotionalEmail(businessProfile, campaignDetails) {
  try {
    console.log('📧 Generating promotional email...');
    
    const prompt = `Create a compelling promotional email campaign.

Business: ${businessProfile.businessName}
Industry: ${businessProfile.industry}
Campaign: ${campaignDetails.name || 'Special Promotion'}
Offer: ${campaignDetails.offer || 'Special discount'}
Product/Service: ${campaignDetails.product || businessProfile.productsServices}
Duration: ${campaignDetails.duration || 'Limited time'}

Create professional email with:
- Attention-grabbing subject line
- Compelling opening
- Clear value proposition
- Specific offer details
- Strong call to action
- Sense of urgency
- Professional design

Format:
Subject: [subject line]
Content: [HTML email body]`;

    const response = await generateContentWithGemini(prompt, 'email', businessProfile);
    
    const subjectMatch = response.match(/Subject:\s*(.+)/i);
    const subject = subjectMatch ? subjectMatch[1].trim() : `Special Offer from ${businessProfile.businessName}`;
    
    const contentMatch = response.match(/Content:\s*([\s\S]+)/i);
    const content = contentMatch ? contentMatch[1].trim() : response;
    
    return {
      success: true,
      subject: subject,
      content: content,
      type: 'promotional',
      campaign: campaignDetails.name,
      generatedAt: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('Error generating promotional email:', error);
    throw error;
  }
}

/**
 * Schedule automated email campaigns
 * @param {string} userId - User ID
 * @param {array} emails - Email campaigns to schedule
 * @param {string} frequency - 'weekly', 'monthly', etc.
 */
export async function scheduleAutomatedEmails(userId, emails, frequency = 'weekly') {
  try {
    console.log(`📅 Scheduling ${emails.length} automated emails...`);
    
    const scheduledEmails = [];
    
    for (let i = 0; i < emails.length; i++) {
      const email = emails[i];
      const scheduledDate = calculateScheduleDate(i, frequency, email.dayDelay);
      
      const { data, error } = await supabase
        .from('email_campaigns')
        .insert({
          user_id: userId,
          name: email.title || `Email ${i + 1}`,
          subject: email.subject,
          content: email.content,
          status: 'scheduled',
          scheduled_for: scheduledDate.toISOString(),
          campaign_type: email.type || 'automated',
          created_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;
      
      scheduledEmails.push(data);
    }
    
    console.log(`✅ Scheduled ${scheduledEmails.length} emails`);
    return scheduledEmails;
    
  } catch (error) {
    console.error('Error scheduling emails:', error);
    throw error;
  }
}

/**
 * Calculate schedule date based on frequency and delay
 */
function calculateScheduleDate(index, frequency, dayDelay = 0) {
  const now = new Date();
  
  if (dayDelay) {
    // For welcome sequences with specific day delays
    now.setDate(now.getDate() + dayDelay);
  } else {
    // For regular campaigns
    switch (frequency) {
      case 'daily':
        now.setDate(now.getDate() + index);
        break;
      case 'weekly':
        now.setDate(now.getDate() + (index * 7));
        break;
      case 'biweekly':
        now.setDate(now.getDate() + (index * 14));
        break;
      case 'monthly':
        now.setMonth(now.getMonth() + index);
        break;
      default:
        now.setDate(now.getDate() + (index * 7)); // Default to weekly
    }
  }
  
  // Set to 10 AM local time
  now.setHours(10, 0, 0, 0);
  
  return now;
}

/**
 * Auto-generate newsletter from best social posts
 * @param {string} userId - User ID
 * @param {object} businessProfile - Business profile
 */
export async function autoGenerateWeeklyNewsletter(userId, businessProfile) {
  try {
    console.log('📧 Auto-generating weekly newsletter...');
    
    // Get posts from last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const { data: recentPosts } = await supabase
      .from('scheduled_posts')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'posted')
      .gte('posted_at', sevenDaysAgo.toISOString())
      .order('created_at', { ascending: false })
      .limit(10);
    
    // Generate newsletter
    const newsletter = await generateAutoNewsletter(businessProfile, recentPosts || []);
    
    // Schedule for next Monday at 10 AM
    const nextMonday = getNextMonday();
    
    const { data, error } = await supabase
      .from('email_campaigns')
      .insert({
        user_id: userId,
        name: `Weekly Newsletter - ${nextMonday.toLocaleDateString()}`,
        subject: newsletter.subject,
        content: newsletter.content,
        status: 'scheduled',
        scheduled_for: nextMonday.toISOString(),
        campaign_type: 'newsletter',
        created_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    
    console.log('✅ Newsletter scheduled for', nextMonday);
    return data;
    
  } catch (error) {
    console.error('Error auto-generating newsletter:', error);
    throw error;
  }
}

/**
 * Get next Monday at 10 AM
 */
function getNextMonday() {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const daysUntilMonday = dayOfWeek === 0 ? 1 : (8 - dayOfWeek) % 7 || 7;
  
  const nextMonday = new Date(now);
  nextMonday.setDate(now.getDate() + daysUntilMonday);
  nextMonday.setHours(10, 0, 0, 0);
  
  return nextMonday;
}

export default {
  generateAutoNewsletter,
  generateWelcomeSequence,
  generatePromotionalEmail,
  scheduleAutomatedEmails,
  autoGenerateWeeklyNewsletter
};
