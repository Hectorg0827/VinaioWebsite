import requests
import os
import dotenv

dotenv.load_dotenv(".env.local")

URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

def check_tables():
    headers = {
        "apikey": KEY,
        "Authorization": f"Bearer {KEY}"
    }
    
    tables = ["portal_requests", "invoices", "invoice_items", "portal_orders", "portal_order_items", "payment_history"]
    
    for table in tables:
        r = requests.get(f"{URL}/rest/v1/{table}?select=id&limit=1", headers=headers)
        if r.status_code == 200:
            print(f"✅ Table '{table}' exists.")
        else:
            print(f"❌ Table '{table}' MISSING (Status: {r.status_code}).")

if __name__ == "__main__":
    check_tables()
