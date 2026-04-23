import requests
import os
import dotenv

dotenv.load_dotenv(".env.local")

URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

def apply_migration():
    if not URL or not KEY:
        print("Missing credentials")
        return

    with open("supabase/migrations/20260421_portal_v5_final.sql", "r") as f:
        sql = f.read()

    print("Attempting to run migration via exec_sql RPC...")
    
    headers = {
        "Content-Type": "application/json",
        "apikey": KEY,
        "Authorization": f"Bearer {KEY}"
    }
    
    # Try the exec_sql RPC
    r = requests.post(f"{URL}/rest/v1/rpc/exec_sql", headers=headers, json={"sql": sql})
    
    if r.status_code == 200:
        print("✅ Migration applied successfully via RPC!")
    else:
        print(f"❌ Failed to apply via RPC (Status: {r.status_code}).")
        print("The 'exec_sql' function might not be available. Please run the SQL manually in the Supabase Dashboard.")

if __name__ == "__main__":
    apply_migration()
