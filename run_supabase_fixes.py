#!/usr/bin/env python3
"""
🔧 Supabase Database Fixes Script
Automatically fixes 95+ database issues
- Enables RLS on all tables
- Creates proper RLS policies
- Adds performance indexes
"""

import psycopg2
import psycopg2.extras
import sys
from pathlib import Path

# ============================================================================
# CONFIGURATION
# ============================================================================

SUPABASE_HOST = "qzvqnhbslecjjwakusva.supabase.co"
SUPABASE_PORT = "5432"
SUPABASE_DB = "postgres"
SUPABASE_USER = "postgres"

# Service Role Key (for reference, connection uses password method)
SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6dnFuaGJzbGVjamp3YWt1c3ZhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDg2ODI3MCwiZXhwIjoyMDgwNDQ0MjcwfQ.jslTDAlJE5B0Ro1cnjYipF6r5Jl_q1QQG913MPhyucU"

# ============================================================================
# MAIN SCRIPT
# ============================================================================

def main():
    print("╔════════════════════════════════════════════════════════════════╗")
    print("║        🔧 Supabase Database Fixes (95+ Issues) 🔧             ║")
    print("╚════════════════════════════════════════════════════════════════╝")
    print()
    
    # Get postgres password
    print("⚠️  To connect to Supabase, you need your PostgreSQL password.")
    print("   This is NOT your JWT token - it's your database password.")
    print()
    print("Where to find it:")
    print("1. Go to https://app.supabase.com")
    print("2. Select 'Silent Pilot Website' project")
    print("3. Go to Settings → Database")
    print("4. Look for 'Database password' section")
    print("5. Click 'Reveal' to see your password")
    print()
    
    password = input("Enter your PostgreSQL password: ").strip()
    
    if not password:
        print("❌ Error: Password required")
        sys.exit(1)
    
    print()
    print("🔌 Connecting to Supabase...")
    
    try:
        conn = psycopg2.connect(
            host=SUPABASE_HOST,
            port=SUPABASE_PORT,
            database=SUPABASE_DB,
            user=SUPABASE_USER,
            password=password,
            sslmode='require'
        )
        print("✓ Connected successfully!")
        
    except psycopg2.OperationalError as e:
        print(f"❌ Connection failed: {e}")
        print()
        print("Common issues:")
        print("- Wrong password")
        print("- User 'postgres' doesn't exist")
        print("- Connection not allowed from your IP")
        sys.exit(1)
    
    # Read the SQL script
    print()
    print("📖 Reading SQL fixes...")
    
    script_path = Path.home() / "Library/Mobile Documents/com~apple~CloudDocs/Silent Pilot Website/fix_supabase_issues.sql"
    
    if not script_path.exists():
        print(f"❌ Error: SQL script not found at {script_path}")
        sys.exit(1)
    
    with open(script_path, 'r') as f:
        sql_content = f.read()
    
    print(f"✓ Loaded {len(sql_content)} bytes of SQL")
    
    # Execute the SQL
    print()
    print("⚙️  Executing fixes...")
    print("-" * 60)
    
    try:
        cursor = conn.cursor()
        
        # Execute the entire script
        cursor.execute(sql_content)
        
        # Commit changes
        conn.commit()
        
        print("✓ All SQL commands executed successfully!")
        
        # Verify fixes
        print()
        print("🔍 Verifying fixes...")
        print("-" * 60)
        
        # Check RLS status
        cursor.execute("""
            SELECT 
              tablename,
              rowsecurity,
              CASE WHEN rowsecurity THEN '✓' ELSE '✗' END as status
            FROM pg_tables
            WHERE schemaname = 'public'
            ORDER BY tablename;
        """)
        
        results = cursor.fetchall()
        print()
        print("RLS Status on public tables:")
        print()
        
        rls_enabled = 0
        rls_disabled = 0
        
        for tablename, rowsecurity, status in results:
            print(f"  {status} {tablename}")
            if rowsecurity:
                rls_enabled += 1
            else:
                rls_disabled += 1
        
        print()
        print(f"Summary: {rls_enabled} tables with RLS ✓, {rls_disabled} without")
        
        # Check indexes
        cursor.execute("""
            SELECT COUNT(*) as index_count
            FROM pg_indexes
            WHERE schemaname = 'public';
        """)
        
        index_count = cursor.fetchone()[0]
        print(f"Total indexes created: {index_count}")
        
        cursor.close()
        conn.close()
        
        print()
        print("╔════════════════════════════════════════════════════════════════╗")
        print("║                  ✅ FIXES COMPLETED! ✅                        ║")
        print("╚════════════════════════════════════════════════════════════════╝")
        print()
        print("Next steps:")
        print("1. Go to https://app.supabase.com")
        print("2. Check 'Issues' section (should show <20 instead of 95)")
        print("3. Test your application at http://localhost:3000")
        print("4. Check browser console for any permission errors (F12)")
        print()
        
        return 0
        
    except psycopg2.Error as e:
        print(f"❌ SQL Error: {e}")
        print()
        print("This might be because:")
        print("- A table doesn't exist with the exact name")
        print("- A column name is different in your schema")
        print()
        print("Solution: Check your table names and adjust the script")
        conn.close()
        return 1
    
    except Exception as e:
        print(f"❌ Error: {e}")
        conn.close()
        return 1

if __name__ == "__main__":
    sys.exit(main())
