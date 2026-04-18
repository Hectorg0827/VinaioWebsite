import pandas as pd
import requests

# Supabase creds
url = "https://yzcmfepqjdybavpsjbwm.supabase.co/rest/v1/products?select=id,brand,name,product_code"
headers = {
    "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6Y21mZXBxamR5YmF2cHNqYndtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTA5ODg3OSwiZXhwIjoyMDkwNjc0ODc5fQ.H71S8aDFfH9zQNMrPfnskhMqdqVlwguVUxWmXPGSyRs",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6Y21mZXBxamR5YmF2cHNqYndtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTA5ODg3OSwiZXhwIjoyMDkwNjc0ODc5fQ.H71S8aDFfH9zQNMrPfnskhMqdqVlwguVUxWmXPGSyRs"
}

res = requests.get(url, headers=headers)
db_products = res.json()

# Excel data
df = pd.read_excel('assets/data/supplier_product_cross_reference_sommelier.xlsx')
excel_products = df.to_dict('records')

print(f"DB Products: {len(db_products)}")
print(f"Excel Products: {len(excel_products)}")

# find overlaps and missing
db_names = set([f"{p.get('brand')} {p.get('name')}".strip().lower() for p in db_products])
excel_names = set([f"{p.get('Supplier')} {p.get('Product')}".strip().lower() for p in excel_products])

in_db_not_excel = db_names - excel_names
in_excel_not_db = excel_names - db_names

print(f"\nTo Remove (in DB but not in Excel): {len(in_db_not_excel)}")
if in_db_not_excel:
    print(list(in_db_not_excel)[:5])

print(f"\nTo Add (in Excel but not in DB): {len(in_excel_not_db)}")
if in_excel_not_db:
    print(list(in_excel_not_db)[:5])

