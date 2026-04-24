import os
import sys
import json
import requests
import datetime
import xml.etree.ElementTree as ET

# Attempt to load pywin32 for COM API access
try:
    import win32com.client
except ImportError:
    print("CRITICAL: The 'pywin32' library is missing.")
    print("Please install it by running: pip install pywin32")
    sys.exit(1)

# ── CONFIGURATION ────────────────────────────────────────────────────────────
# Set these as environment variables on the office PC, or replace the defaults
API_URL = os.getenv("VINAIO_PORTAL_URL", "https://vinaioimports.com/api/sync/qbd")
SYNC_TOKEN = os.getenv("VINAIO_SYNC_TOKEN", "your_secret_token_here")

# ── QBD CONNECTION HELPER ────────────────────────────────────────────────────
def process_qbxml(request_xml):
    """
    Connects to the running instance of QuickBooks Desktop via COM API,
    sends the qbXML request, and returns the qbXML response.
    """
    try:
        # Initialize the QuickBooks Request Processor
        rp = win32com.client.Dispatch("QBXMLRP2.RequestProcessor")
        
        # Open connection: (AppID, AppName)
        rp.OpenConnection2("", "Vinaio Sync Script", 1)  # 1 = local QBD instance
        
        # Begin Session: (CompanyFile, OpenMode)
        # Empty string means it will connect to whichever company file is currently open
        ticket = rp.BeginSession("", 2)  # 2 = multi-user mode
        
        # Process the Request
        response_xml = rp.ProcessRequest(ticket, request_xml)
        
        # Close the Session and Connection
        rp.EndSession(ticket)
        rp.CloseConnection()
        
        return response_xml

    except Exception as e:
        print(f"Failed to communicate with QuickBooks. Make sure QBD is open and running.")
        print(f"Error Details: {e}")
        return None


# ── DATA EXTRACTION & PARSING ────────────────────────────────────────────────
def extract_qbd_data():
    """
    Sends qbXML queries for Customers and Invoices, parses the XML,
    and formats the data into JSON ready to be sent to the website.
    """
    print("Querying QuickBooks for Customers...")
    customer_xml = """<?xml version="1.0" encoding="utf-8"?>
    <?qbxml version="13.0"?>
    <QBXML>
      <QBXMLMsgsRq onError="stopOnError">
        <CustomerQueryRq></CustomerQueryRq>
      </QBXMLMsgsRq>
    </QBXML>"""
    
    customer_resp = process_qbxml(customer_xml)
    
    print("Querying QuickBooks for Invoices...")
    invoice_xml = """<?xml version="1.0" encoding="utf-8"?>
    <?qbxml version="13.0"?>
    <QBXML>
      <QBXMLMsgsRq onError="stopOnError">
        <InvoiceQueryRq>
          <IncludeLineItems>true</IncludeLineItems>
        </InvoiceQueryRq>
      </QBXMLMsgsRq>
    </QBXML>"""
    
    invoice_resp = process_qbxml(invoice_xml)
    
    if not customer_resp or not invoice_resp:
        print("Aborting because we could not fetch data from QuickBooks.")
        return None

    # Parse Customer Data
    customers = []
    try:
        root = ET.fromstring(customer_resp)
        # Find all CustomerRet nodes natively returned by qbXML
        for cust in root.findall('.//CustomerRet'):
            qbd_id = cust.findtext('ListID')
            name = cust.findtext('FullName')
            balance = float(cust.findtext('Balance') or 0.0)
            customers.append({
                "qbd_id": qbd_id,
                "name": name,
                "balance": balance
            })
    except Exception as e:
        print(f"Error parsing customer XML: {e}")

    # Parse Invoice Data
    invoices = []
    try:
        root = ET.fromstring(invoice_resp)
        for inv in root.findall('.//InvoiceRet'):
            qbd_id = inv.findtext('TxnID')
            cust_id = inv.find('CustomerRef').findtext('ListID') if inv.find('CustomerRef') else None
            ref_number = inv.findtext('RefNumber')
            subtotal = float(inv.findtext('Subtotal') or 0.0)
            balance_remaining = float(inv.findtext('BalanceRemaining') or 0.0)
            due_date = inv.findtext('DueDate')
            is_paid = inv.findtext('IsPaid') == 'true'
            
            # You can also parse <InvoiceLineRet> here to get individual products
            
            invoices.append({
                "qbd_id": qbd_id,
                "qbd_customer_id": cust_id,
                "invoice_number": ref_number,
                "amount": subtotal,
                "balance": balance_remaining,
                "due_date": due_date,
                "status": "paid" if is_paid else "open"
            })
    except Exception as e:
        print(f"Error parsing invoice XML: {e}")

    return {
        "customers": customers,
        "invoices": invoices,
        # 'invoice_items' and 'payments' can be added similarly by writing qbXML queries
    }

# ── PUSH TO NEXT.JS PORTAL ───────────────────────────────────────────────────
def push_to_portal():
    print(f"[{datetime.datetime.now()}] Starting QuickBooks Desktop to Vinaio Sync...")
    
    data = extract_qbd_data()
    if not data:
        return
        
    print(f"Found {len(data['customers'])} customers and {len(data['invoices'])} invoices.")
    print("Uploading to Vinaio Portal...")

    headers = {
        "Authorization": f"Bearer {SYNC_TOKEN}",
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.post(API_URL, json=data, headers=headers)
        
        if response.status_code == 200:
            print("SUCCESS! Synced data to Vinaio Portal.")
        else:
            print(f"Sync failed. Status Code: {response.status_code}")
            print(f"Website Response: {response.text}")
            
    except Exception as e:
        print(f"A network error occurred while reaching the website: {e}")

if __name__ == "__main__":
    push_to_portal()


# ── INSTRUCTIONS FOR YOUR WINDOWS OFFICE PC ──────────────────────────────────
# 1. Download and run the QuickBooks Desktop Installer / SDK (Required to unlock COM API).
# 2. Make sure Python 3 is installed on your PC.
# 3. Open Command Prompt and run: pip install requests pywin32
# 4. Open QuickBooks Desktop as the administrator, and keep your Company File open.
# 5. Run this script once natively: python vine-sync.py
#    -> Note: The FIRST time you run this, QuickBooks will throw a popup asking:
#       "Do you want to allow this application to read and modify this company file?"
#       Select "Yes, always; allow access even if QuickBooks is not running", and click Continue.
# 6. Once approved, use Windows Task Scheduler to run this python script daily.
