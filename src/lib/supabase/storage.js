import { createClient } from "./client";

/**
 * Uploads a file to a Supabase bucket and returns the public URL.
 * @param {File} file - The file to upload.
 * @param {string} bucket - The name of the Supabase storage bucket.
 * @param {string} path - Optional sub-path within the bucket (e.g. 'logos/').
 * @returns {Promise<string|null>} - The public URL of the uploaded file.
 */
export async function uploadFile(file, bucket, path = "") {
  const supabase = createClient();
  const filePath = `${path}${Date.now()}_${file.name.replace(/\s+/g, "_")}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error(`Upload error to ${bucket}:`, error.message);
    return null;
  }

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path);

  return publicUrl;
}
