import { NextResponse }        from "next/server";
import { cookies }             from "next/headers";
import { createAdminClient }    from "@/lib/supabase/server";
import { isAdminAuthenticated } from "@/lib/admin/auth";
import { uploadToBunny }       from "@/lib/bunny/storage";

/**
 * POST /api/admin/upload
 * 
 * Uploads a file to Bunny.net (CDN) as primary, with Supabase Storage as fallback.
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

    // Format consistent filename: Timestamp_OriginalSafeName
    const timestamp = Date.now();
    const safeName = file.name.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9._-]/g, "");
    const fileName = `${timestamp}_${safeName}`;
    
    // Path for storage (Supabase uses bucket separately, Bunny uses full path)
    const storagePath = `${folder}${fileName}`;

    // ─── 1. Attempt Bunny.net Upload (Primary) ──────────────────────────────
    // We treat the "bucket" name as the root folder in Bunny Storage
    const bunnyUrl = await uploadToBunny(file, fileName, `${bucket}/${folder}`);
    
    if (bunnyUrl) {
      return NextResponse.json({ 
        publicUrl: bunnyUrl, 
        path: `${bucket}/${storagePath}`,
        provider: "bunny" 
      });
    }

    // ─── 2. Fallback to Supabase Storage ─────────────────────────────────────
    console.warn("Bunny upload skipped/failed, falling back to Supabase.");
    
    const supabase = await createAdminClient();
    if (!supabase) {
      throw new Error("Failed to initialize Supabase Admin client.");
    }

    // Convert to Uint8Array — some Supabase versions reject raw ArrayBuffer
    const buffer = new Uint8Array(await file.arrayBuffer());
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(storagePath, buffer, {
        contentType: file.type || "application/octet-stream",
        cacheControl: "3600",
        upsert: true,
      });

    if (error) {
      console.error(`Supabase Storage Error [bucket=${bucket}, path=${storagePath}]:`, error.message);
      throw error;
    }

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return NextResponse.json({ 
      publicUrl, 
      path: data.path, 
      provider: "supabase" 
    });

  } catch (err) {
    console.error("Admin Upload API Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
