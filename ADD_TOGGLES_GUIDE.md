# Toggle Implementation Guide

## ✅ Toggles Already Added (5/17)
1. Dashboard ✅
2. Create Content ✅  
3. Calendar ✅
4. Analytics ✅
5. Business Profile ✅

## ⏳ Toggles Remaining (10/17)
6. Social Connect
7. AutoPilot
8. Email Campaigns
9. SEO
10. Leads
11. Campaigns
12. Ad Boost
13. AI Research
14. Bulk Media Upload
15. AI Media Studio

16. Notifications - Already modern, no toggle needed
17. Settings - Already modern, no toggle needed

## Quick Toggle Pattern

For each remaining page, add:

1. Import V2 component at top
2. Add useState hook
3. Add conditional render before main return

```javascript
// 1. Import
import PageNameV2 from './PageName.v2';

// 2. Add hook (at top of component)
const [useV2, setUseV2] = useState(true);

// 3. Add before main return (after all hooks)
if (useV2) {
  return (
    <>
      <div style={{position:'fixed',top:'80px',right:'20px',zIndex:1000,display:'flex',gap:'8px',background:'var(--bg-card)',padding:'8px 16px',borderRadius:'12px',border:'1px solid var(--border-default)',boxShadow:'var(--shadow-md)'}}>
        <button onClick={()=>setUseV2(false)} style={{padding:'8px 16px',background:'transparent',border:'1px solid var(--border-default)',borderRadius:'8px',color:'var(--text-secondary)',cursor:'pointer',fontSize:'13px',fontWeight:'500'}}>Classic</button>
        <button style={{padding:'8px 16px',background:'linear-gradient(135deg,var(--primary-600),var(--primary-700))',border:'none',borderRadius:'8px',color:'white',cursor:'pointer',fontSize:'13px',fontWeight:'600'}}>✨ Modern</button>
      </div>
      <PageNameV2 />
    </>
  );
}
```

## Status Summary

- Total Pages: 17
- V2 Versions Created: 15
- Already Modern: 2  
- Toggles Complete: 5
- Toggles Remaining: 10

**Completion: 88% (15/17 have V2 files, 5/15 have toggles)**

To reach 100%, add toggles to the 10 remaining pages using the pattern above.
