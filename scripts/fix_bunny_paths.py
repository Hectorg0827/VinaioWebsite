import requests

url = "https://yzcmfepqjdybavpsjbwm.supabase.co/rest/v1/products"
headers = {
    "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6Y21mZXBxamR5YmF2cHNqYndtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTA5ODg3OSwiZXhwIjoyMDkwNjc0ODc5fQ.H71S8aDFfH9zQNMrPfnskhMqdqVlwguVUxWmXPGSyRs",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6Y21mZXBxamR5YmF2cHNqYndtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTA5ODg3OSwiZXhwIjoyMDkwNjc0ODc5fQ.H71S8aDFfH9zQNMrPfnskhMqdqVlwguVUxWmXPGSyRs",
    "Content-Type": "application/json"
}

db_products = requests.get(url + "?select=id,image_url", headers=headers).json()

# Prepend the hidden bunny folder structure
for p in db_products:
    img = p.get('image_url')
    if img and "vinaio-bottles.b-cdn.net/" in img and "Fotos%20de%20Botellas" not in img and "logos" not in img:
        new_img = img.replace("vinaio-bottles.b-cdn.net/", "vinaio-bottles.b-cdn.net/Fotos%20de%20Botellas%20(6%20apr%202026)/")
        requests.patch(url + f"?id=eq.{p['id']}", json={"image_url": new_img}, headers=headers)
        
print("Updated Bunny Paths!")
