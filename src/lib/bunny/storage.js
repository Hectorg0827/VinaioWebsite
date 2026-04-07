/**
 * Uploads a file to Bunny.net Storage.
 * 
 * @param {File|Buffer|ArrayBuffer} file - The file data to upload.
 * @param {string} fileName - The desired name for the file in storage.
 * @param {string} folder - Optional subfolder path (e.g., 'products/').
 * @returns {Promise<string|null>} - The public CDN URL of the uploaded file, or null on failure.
 */
export async function uploadToBunny(file, fileName, folder = "") {
  const zone = process.env.BUNNY_STORAGE_ZONE;
  const key = process.env.BUNNY_API_KEY;
  const cdn = process.env.NEXT_PUBLIC_BUNNY_CDN_URL;

  // Safety check: fall back gracefully if credentials aren't set
  if (!zone || !key || !cdn) {
    console.warn("Bunny.net integration: Missing credentials in environment.");
    return null;
  }

  // Normalize paths: remove leading/trailing slashes
  const cleanFolder = folder.replace(/^\/+|\/+$/g, "");
  const path = cleanFolder ? `${cleanFolder}/${fileName}` : fileName;
  
  // Bunny Storage endpoint: https://storage.bunnycdn.com/{storageZoneName}/{path}
  const endpoint = `https://storage.bunnycdn.com/${zone}/${path}`;

  try {
    // Prepare the binary body
    let body;
    if (file instanceof Buffer || file instanceof ArrayBuffer) {
      body = file;
    } else if (typeof file.arrayBuffer === "function") {
      body = await file.arrayBuffer();
    } else {
      throw new Error("Unsupported file format for Bunny.net upload.");
    }

    const response = await fetch(endpoint, {
      method: "PUT",
      headers: {
        "AccessKey": key,
        "Content-Type": "application/octet-stream", // Bunny prefers binary stream
      },
      body: body,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Bunny API error (${response.status}): ${errorText}`);
    }

    // Success: return the full CDN URL
    const baseUrl = cdn.replace(/\/+$/, "");
    return `${baseUrl}/${path}`;

  } catch (err) {
    console.error("Bunny Storage Upload Failure:", err.message);
    return null;
  }
}
