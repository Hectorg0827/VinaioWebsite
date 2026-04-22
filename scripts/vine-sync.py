import requests
import json
import os
import datetime

# ── CONFIGURATION ────────────────────────────────────────────────────────────
# Set these as environment variables on the office PC
API_URL = os.getenv("VINAIO_PORTAL_URL", "https://vinaioimports.com/api/sync/qbd")
SYNC_TOKEN = os.getenv("VINAIO_SYNC_TOKEN", "your_secret_token_here")

# ── LOGIC ───────────────────────────────────────────────────────────────────

def get_data_from_quickbooks():
    """
    TEMPLATE: This function should interface with your QuickBooks Desktop.
    Most businesses use QODBC (a driver for QBD) to query data like SQL.
    
    If using QODBC (pyodbc):
    import pyodbc
    conn = pyodbc.connect('DSN=QuickBooks Data;HST=Local')
    """
    
    # MOCK DATA FOR DEMONSTRATION
    # In production, replace with real SQL queries to your QBD file.
    
    customers = [
      {"qbd_id": "Acme_12345", "balance": 450.00, "credit_limit": 5000.00},
      {"qbd_id": "CornerWine_99", "balance": 120.50, "credit_limit": 2000.00}
    ]
    
    invoices = [
      {
        "qbd_id": "INV-1001",
        "qbd_customer_id": "Acme_12345",
        "invoice_number": "1001",
        "amount": 200.00,
        "balance": 200.00,
        "due_date": "2026-05-01",
        "payment_url": "https://connect.intuit.com/pay/Acme_Link_123", # From QBD Payment Links
        "status": "open"
      }
    ]
    
    invoice_items = [
      {
        "qbd_invoice_id": "INV-1001",
        "qbd_customer_id": "Acme_12345",
        "product_name": "Brunello di Montalcino 2018",
        "sku": "BDM-18",
        "qty": 12,
        "unit_price": 45.00,
        "invoice_date": "2026-04-15"
      }
    ]
    
    payments = [
      {
        "qbd_payment_id": "PAY-555",
        "qbd_customer_id": "Acme_12345",
        "amount": 100.00,
        "method": "Check",
        "payment_date": "2026-04-10",
        "memo": "Check #1234"
      }
    ]
    
    return {
        "customers": customers,
        "invoices": invoices,
        "invoice_items": invoice_items,
        "payments": payments
    }

def push_to_portal():
    print(f"[{datetime.datetime.now()}] Starting daily sync...")
    
    try:
        data = get_data_from_quickbooks()
        
        headers = {
            "Authorization": f"Bearer {SYNC_TOKEN}",
            "Content-Type": "application/json"
        }
        
        response = requests.post(API_URL, json=data, headers=headers)
        
        if response.status_code == 200:
            print("Successfully synced data to Vinaio Portal.")
            print(f"Server Response: {response.json()}")
        else:
            print(f"Sync failed. Status Code: {response.status_code}")
            print(f"Error: {response.text}")
            
    except Exception as e:
        print(f"An error occurred during sync: {e}")

if __name__ == "__main__":
    push_to_portal()

# ── INSTRUCTIONS FOR OFFICE PC ──────────────────────────────────────────────
# 1. Install Python 3
# 2. pip install requests
# 3. (Optional) Install QODBC and pyodbc if querying the QBD file directly
# 4. Set up a Windows Task Scheduler to run this script daily at 11:00 PM.
