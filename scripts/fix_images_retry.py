import os
import requests
import urllib.parse
import re
import time

url = "https://yzcmfepqjdybavpsjbwm.supabase.co/rest/v1/products"
headers = {
    "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6Y21mZXBxamR5YmF2cHNqYndtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTA5ODg3OSwiZXhwIjoyMDkwNjc0ODc5fQ.H71S8aDFfH9zQNMrPfnskhMqdqVlwguVUxWmXPGSyRs",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6Y21mZXBxamR5YmF2cHNqYndtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTA5ODg3OSwiZXhwIjoyMDkwNjc0ODc5fQ.H71S8aDFfH9zQNMrPfnskhMqdqVlwguVUxWmXPGSyRs",
    "Content-Type": "application/json"
}

CDN_BOTTLES = "https://vinaio-bottles.b-cdn.net"

try:
    db_res = requests.get(url + "?select=id,slug,brand,name,type,image_url,logo_url", headers=headers, timeout=10)
    db_products = db_res.json()
except Exception as e:
    print(f"Failed to fetch: {e}")
    exit(1)

assets_dir = "/Users/hectorgarcia/VinaioWebsite/assets/images"
image_files = []
for root, dirs, files in os.walk(assets_dir):
    for f in files:
        if f.lower().endswith(('.png', '.jpg', '.jpeg')):
            image_files.append(os.path.relpath(os.path.join(root, f), assets_dir))

def normalize(s):
    return re.sub(r'[^a-z0-9]', '', (s or "").lower())

updates = []
for p in db_products:
    n_brand = normalize(p.get('brand', ''))
    n_name = normalize(p.get('name', ''))
    n_type = normalize(p.get('type', ''))
    
    brand_files = [f for f in image_files if len(f.split('/')) > 1 and (n_brand in normalize(f.split('/')[0]) or normalize(f.split('/')[0]) in n_brand)]
    best_match, highest_score = None, 0
    search_pool = brand_files if brand_files else image_files
    
    for f in search_pool:
        n_file = normalize(f)
        score = sum([2 if n_name and n_name in n_file else 0, 1 if n_type and n_type in n_file else 0, 3 if 'rosado' in n_file and 'rose' in n_type else 0, 3 if 'blanco' in n_file and 'white' in n_type else 0, 3 if 'tinto' in n_file and 'red' in n_type else 0])
        if score > highest_score:
            highest_score, best_match = score, f
    
    if not best_match and brand_files: best_match = brand_files[0]
    
    if best_match:
        image_url = f"{CDN_BOTTLES}/{urllib.parse.quote(best_match)}"
        logo_url = next((f"{CDN_BOTTLES}/{urllib.parse.quote(lf)}" for lf in image_files if normalize("logo") in normalize(lf) and n_brand in normalize(lf)), None)
        if p.get('image_url') != image_url or p.get('logo_url') != logo_url:
            updates.append({"id": p['id'], "image_url": image_url, "logo_url": logo_url})
    else:
        if p.get('image_url') is not None or p.get('logo_url') is not None:
            updates.append({"id": p['id'], "image_url": None, "logo_url": None})

print(f"Need to patch {len(updates)} records.")

for u in updates:
    for attempt in range(3):
        try:
            res = requests.patch(url + f"?id=eq.{u['id']}", json={"image_url": u["image_url"], "logo_url": u["logo_url"]}, headers=headers, timeout=5)
            if res.status_code in (200, 204):
                break
        except Exception as e:
            time.sleep(1)

print("Done patching.")
