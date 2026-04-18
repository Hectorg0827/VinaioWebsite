import os
import requests
from difflib import SequenceMatcher
import urllib.parse
import re

url = "https://yzcmfepqjdybavpsjbwm.supabase.co/rest/v1/products"
headers = {
    "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6Y21mZXBxamR5YmF2cHNqYndtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTA5ODg3OSwiZXhwIjoyMDkwNjc0ODc5fQ.H71S8aDFfH9zQNMrPfnskhMqdqVlwguVUxWmXPGSyRs",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6Y21mZXBxamR5YmF2cHNqYndtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTA5ODg3OSwiZXhwIjoyMDkwNjc0ODc5fQ.H71S8aDFfH9zQNMrPfnskhMqdqVlwguVUxWmXPGSyRs",
    "Content-Type": "application/json"
}

CDN_BOTTLES = "https://vinaio-bottles.b-cdn.net"

# 1. Fetch DB
db_res = requests.get(url + "?select=id,slug,brand,name,type", headers=headers)
if db_res.status_code != 200:
    print("Failed to fetch DB:", db_res.text)
    exit(1)
db_products = db_res.json()

# 2. Map local files
assets_dir = "/Users/hectorgarcia/VinaioWebsite/assets/images"
image_files = []
for root, dirs, files in os.walk(assets_dir):
    for f in files:
        if f.lower().endswith('.png') or f.lower().endswith('.jpg') or f.lower().endswith('.jpeg'):
            full_path = os.path.join(root, f)
            rel_path = os.path.relpath(full_path, assets_dir)
            image_files.append(rel_path)

print(f"Discovered {len(image_files)} local images.")

def normalize(s):
    if not s: return ""
    s = s.lower()
    return re.sub(r'[^a-z0-9]', '', s)

# 3. Match
updates = []
for p in db_products:
    n_brand = normalize(p.get('brand', ''))
    n_name = normalize(p.get('name', ''))
    n_type = normalize(p.get('type', ''))
    
    # find brand folder files
    brand_files = []
    for f in image_files:
        parts = f.split('/')
        if len(parts) > 1:
            n_folder = normalize(parts[0])
            if n_brand in n_folder or n_folder in n_brand:
                brand_files.append(f)
                
    best_match = None
    highest_score = 0
    
    # if brand files not found, search all
    search_pool = brand_files if brand_files else image_files
    
    for f in search_pool:
        n_file = normalize(f)
        score = 0
        if n_name and n_name in n_file: score += 2
        if n_type and n_type in n_file: score += 1
        
        # some exact keyword boosts
        if 'rosado' in n_file and 'rose' in n_type: score += 3
        if 'blanco' in n_file and 'white' in n_type: score += 3
        if 'tinto' in n_file and 'red' in n_type: score += 3
        
        if score > highest_score:
            highest_score = score
            best_match = f
            
    # if multiple brand files but score=0, just pick the first
    if not best_match and brand_files:
        best_match = brand_files[0]
        
    if best_match:
        image_url = f"{CDN_BOTTLES}/{urllib.parse.quote(best_match)}"
        # find logo
        logo_url = None
        for lf in image_files:
            if normalize("logo") in normalize(lf) and n_brand in normalize(lf):
                logo_url = f"{CDN_BOTTLES}/{urllib.parse.quote(lf)}"
                break
        
        updates.append({
            "id": p['id'],
            "image_url": image_url,
            "logo_url": logo_url
        })
    else:
        # no match, set null
        updates.append({
            "id": p['id'],
            "image_url": None,
            "logo_url": None
        })

print(f"Ready to patch {len(updates)} records.")

# 4. Patch
for u in updates:
    res = requests.patch(url + f"?id=eq.{u['id']}", json={"image_url": u["image_url"], "logo_url": u["logo_url"]}, headers=headers)
    if res.status_code not in (200, 204):
        print(f"Failed to update {u['id']}: {res.text}")

print("Fixed image urls!")

