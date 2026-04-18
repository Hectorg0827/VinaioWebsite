import pandas as pd
import requests
import json
import re
import uuid

url = "https://yzcmfepqjdybavpsjbwm.supabase.co/rest/v1/products"
headers = {
    "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6Y21mZXBxamR5YmF2cHNqYndtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTA5ODg3OSwiZXhwIjoyMDkwNjc0ODc5fQ.H71S8aDFfH9zQNMrPfnskhMqdqVlwguVUxWmXPGSyRs",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6Y21mZXBxamR5YmF2cHNqYndtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTA5ODg3OSwiZXhwIjoyMDkwNjc0ODc5fQ.H71S8aDFfH9zQNMrPfnskhMqdqVlwguVUxWmXPGSyRs",
    "Content-Type": "application/json"
}

def to_slug(brand, name):
    s = f"{brand} {name}".lower()
    s = re.sub(r'[^a-z0-9]+', '-', s)
    return s.strip('-')

# 1. Fetch DB
db_res = requests.get(url + "?select=*", headers=headers)
if db_res.status_code != 200:
    print("Failed to fetch DB:", db_res.text)
    exit(1)
db_products = db_res.json()

# 2. Read Excel
df = pd.read_excel('assets/data/supplier_product_cross_reference_sommelier.xlsx')
# Replace NaNs with empty string
df = df.fillna("")

excel_slugs = set()
excel_data = []

CDN_BOTTLES = "https://vinaio-bottles.b-cdn.net"
CDN_LOGOS = "https://vinaioimports.b-cdn.net"

for row in df.to_dict('records'):
    brand = str(row.get('Supplier', '')).strip()
    name = str(row.get('Product', '')).strip()
    
    if not brand and not name:
        continue
        
    slug = to_slug(brand, name)
    excel_slugs.add(slug)
    
    # map
    format_size = str(row.get('Size', '')).strip()
    category = str(row.get('Category', '')).strip()
    origin = str(row.get('Proposal Country', '')).strip()
    summary = str(row.get('Brief Summary', '')).strip()
    desc = str(row.get('Full Product Description / Pairing or Cocktail', '')).strip()
    
    # image mappings based on old standards
    # fallback paths for logo and bottle
    logo_file = re.sub(r'[^a-z0-9]', '', brand.lower()) + ".png"
    bottle_file = slug + ".png"
    
    excel_data.append({
        "slug": slug,
        "brand": brand,
        "name": name,
        "format": format_size,
        "category": category,
        "categories": [category] if category else [],
        "origin": origin,
        "summary": summary,
        "description_en": desc,
        "image_url": f"{CDN_BOTTLES}/bottles/{bottle_file}",
        "logo_url": f"{CDN_LOGOS}/logos/{logo_file}",
        "in_stock": True,
        "portfolios": ["all"]
    })

print(f"Loaded {len(excel_data)} mapped items from Excel.")

# 3. Find deletions
to_delete_ids = []
for p in db_products:
    if p['slug'] not in excel_slugs:
        to_delete_ids.append(p['id'])

print(f"Deleting {len(to_delete_ids)} obsolete products...")
for i in range(0, len(to_delete_ids), 100):
    chunk = to_delete_ids[i:i+100]
    ids_str = ",".join(chunk)
    del_res = requests.delete(url + f"?id=in.({ids_str})", headers=headers)
    if del_res.status_code not in (200, 204):
         print(f"Error deleting: {del_res.text}")

# 4. Upsert
print(f"Upserting {len(excel_data)} products...")
upsert_headers = headers.copy()
upsert_headers['Prefer'] = 'resolution=merge-duplicates'

# Supabase requires an "id" field to upsert with uniqueness constraint typically
# But "slug" might have a unique constraint. If not, we have to manually check.
# Let's map existing IDs if they match the slug to prevent error if there is no unique constraint on slug.
slug_to_id = {p['slug']: p['id'] for p in db_products}

for item in excel_data:
    if item['slug'] in slug_to_id:
        item['id'] = slug_to_id[item['slug']]

for i in range(0, len(excel_data), 100):
    chunk = excel_data[i:i+100]
    up_res = requests.post(url, json=chunk, headers=upsert_headers)
    if up_res.status_code not in (200, 201):
        print(f"Error upserting: {up_res.text}")
        print("Falling back to single row loop...")
        for row in chunk:
            res = requests.post(url, json=row, headers=upsert_headers)
            if res.status_code not in (200, 201):
                # Likely meaning 'slug' is not unique and it failed. So we try PATCH instead if ID is present
                if 'id' in row:
                    patch_res = requests.patch(url + f"?id=eq.{row['id']}", json=row, headers=headers)
                else:
                    # Insert
                    row['id'] = str(uuid.uuid4())
                    post_res = requests.post(url, json=row, headers=headers)

print("Done synchronization!")

