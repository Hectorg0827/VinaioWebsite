import requests
import json
import uuid

# ── CONFIG ──────────────────────────────────────────────────────────────────
BASE_URL = "http://localhost:3000"
TEST_EMAIL = f"test_{uuid.uuid4().hex[:6]}@vinaio.test"
TEST_PASS = "ProdReady_123!"
SYNC_TOKEN = "vinaio-test-2024" # Matching what I set in .env.local

def test_onboarding_flow():
    print(f"--- PORTAL E2E VERIFICATION START ({TEST_EMAIL}) ---")
    
    # 1. TEST REGISTRATION REQUEST
    print("[1/3] Testing Trade Access Request...")
    reg_payload = {
        "name": "E2E Test Agent",
        "company": "Vinaio Verification Co",
        "email": TEST_EMAIL,
        "phone": "555-000-1111",
        "license_number": "LIC-VERIFY-001",
        "message": "Automated system check."
    }
    r = requests.post(f"{BASE_URL}/api/portal/request", json=reg_payload)
    if r.status_code != 200:
        print(f"FAILED: Registration API returned {r.status_code}")
        print(r.text)
        return
    print("SUCCESS: Request received.")

    # 2. TEST ADMIN ONBOARDING
    print("[2/3] Testing Admin Onboarding (Auth + Profile)...")
    onboard_payload = {
        "requestId": None,
        "email": TEST_EMAIL,
        "password": TEST_PASS,
        "company": "Vinaio Verification Co",
        "repName": "E2E Test Agent",
        "licenseNumber": "LIC-VERIFY-001",
        "qbdId": "QBD_VERIFY_001"
    }
    r = requests.post(f"{BASE_URL}/api/admin/customers/onboard", json=onboard_payload)
    if r.status_code != 200:
        print(f"FAILED: Onboarding API returned {r.status_code}")
        print(r.text)
        return
    print("SUCCESS: Customer account created and welcome email triggered.")

    # 3. TEST QUICKBOOKS SYNC
    print("[3/3] Testing QuickBooks Pulse (Pushing mock history)...")
    sync_payload = {
        "customers": [{"qbd_id": "QBD_VERIFY_001", "balance": 1500.25, "credit_limit": 10000}],
        "invoices": [{
            "qbd_id": "INV-VERIFY-01",
            "qbd_customer_id": "QBD_VERIFY_001",
            "invoice_number": "V-001",
            "amount": 500.00,
            "balance": 500.00,
            "due_date": "2026-06-01",
            "payment_url": "https://connect.intuit.com/test-payment",
            "status": "open"
        }],
        "invoice_items": [{
            "qbd_invoice_id": "INV-VERIFY-01",
            "qbd_customer_id": "QBD_VERIFY_001",
            "product_name": "Antigravity Reserve 2021",
            "sku": "AG-RES-21",
            "qty": 24,
            "unit_price": 20.00,
            "invoice_date": "2026-04-20"
        }]
    }
    r = requests.post(f"{BASE_URL}/api/sync/qbd", json=sync_payload, headers={"Authorization": f"Bearer {SYNC_TOKEN}"})
    if r.status_code != 200:
        print(f"FAILED: QBD Sync API returned {r.status_code}")
        print(r.text)
        return
    print("SUCCESS: Data synced to portal successfully.")

    print("\n--- ALL SYSTEMS NOMINAL ---")
    print(f"User {TEST_EMAIL} is now active and ready for login.")

if __name__ == "__main__":
    test_onboarding_flow()
