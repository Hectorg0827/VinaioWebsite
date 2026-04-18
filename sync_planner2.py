import pandas as pd
import requests

url = "https://yzcmfepqjdybavpsjbwm.supabase.co/rest/v1/products?select=id,brand,name,product_code"
headers = {
    "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6Y21mZXBxamR5YmF2cHNqYndtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTA5ODg3OSwiZXhwIjoyMDkwNjc0ODc5fQ.H71S8aDFfH9zQNMrPfnskhMqdqVlwguVUxWmXPGSyRs",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6Y21mZXBxamR5YmF2cHNqYndtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTA5ODg3OSwiZXhwIjoyMDkwNjc0ODc5fQ.H71S8aDFfH9zQNMrPfnskhMqdqVlwguVUxWmXPGSyRs"
}
db_products = requests.get(url, headers=headers).json()
df = pd.read_excel('assets/data/supplier_product_cross_reference_sommelier.xlsx')

print("First 5 DB products (brand, name):")
for p in db_products[:10]:
    print(p.get('brand'), "|", p.get('name'))

print("\nFirst 5 Excel products (Supplier, Product):")
for row in df.to_dict('records')[:10]:
    print(row.get('Supplier'), "|", row.get('Product'))

