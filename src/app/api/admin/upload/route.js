import { NextResponse }        from "next/server";
import { cookies }             from "next/headers";
import { createAdminClient }    from "@/lib/supabase/server";
import { isAdminAuthenticated } from "@/lib/admin/auth";

/**
 * POST /api/admin/upload
 * Expects FormData with:
 * - file: The actual binary file
 * - bucket: 'products' | 'logos'
 * - folder: optional sub-folder path
 */
export async function POST(req) {
  const cookieStore = await cookies();
  if (!(await isAdminAuthenticated(cookieStore))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const bucket = formData.get("bucket") || "products";
    const folder = formData.get("folder") || "";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const supabase = await createAdminClient();
    if (!supabase) {
      throw new Error("Failed to initialize Supabase Admin client.");
    }

    // Format filename for storage: Timestamp_OriginalSafeName
    const timestamp = Date.now();
    const safeName = file.name.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9._-]/g, "");
    const filePath = `${folder}${timestamp}_${safeName}`;

    // ArrayBuffer conversion for storage upload
    const buffer = await file.arrayBuffer();

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, buffer, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: false,
      });

    if (error) throw error;

    // Get the public URL for the newly uploaded file
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return NextResponse.json({ publicUrl, path: data.path });

  } catch (err) {
    console.error("Admin Upload API Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
