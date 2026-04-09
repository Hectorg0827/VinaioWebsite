import { T, ff } from "@/lib/theme";
import Hr from "@/components/Hr";
import Reveal from "@/components/Reveal";

export const metadata = {
  title: "Privacy Policy — Vinaio Imports",
  description: "How we handle your data at Vinaio Imports, Ltd.",
};

export default function PrivacyPage() {
  return (
    <main style={{ background: T.ink, minHeight: "100vh", padding: "160px 48px 100px", color: T.paper }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <Reveal>
          <Hr w="32px" c={T.gold} style={{ marginBottom: "24px" }} />
          <h1 style={{ fontFamily: ff.h, fontSize: "56px", color: T.paper, marginBottom: "48px" }}>
            Privacy Policy
          </h1>
        </Reveal>

        <article style={{ fontFamily: ff.b, fontSize: "16px", color: "rgba(255,255,255,0.6)", lineHeight: 1.85 }}>
          <section style={{ marginBottom: "48px" }}>
            <h2 style={{ fontFamily: ff.h, fontSize: "28px", color: T.paper, marginBottom: "20px" }}>1. Information We Collect</h2>
            <p>
              We collect information that you provide directly to us through our contact forms, 
              customer portal registration, and trade inquiries. This may include your name, 
              email address, company name, liquor license details, and shipping address.
            </p>
          </section>

          <section style={{ marginBottom: "48px" }}>
            <h2 style={{ fontFamily: ff.h, fontSize: "28px", color: T.paper, marginBottom: "20px" }}>2. How We Use Your Information</h2>
            <p>
              Your data is used to process orders, manage your account, comply with TTB and 
              state licensing requirements, and communicate regarding products and services 
              relevant to your trade account.
            </p>
          </section>

          <section style={{ marginBottom: "48px" }}>
            <h2 style={{ fontFamily: ff.h, fontSize: "28px", color: T.paper, marginBottom: "20px" }}>3. Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your information. 
              Trade account data is stored securely via our infrastructure partners, including Supabase.
            </p>
          </section>

          <section style={{ marginBottom: "48px" }}>
            <h2 style={{ fontFamily: ff.h, fontSize: "28px", color: T.paper, marginBottom: "20px" }}>4. Compliance & Alcohol Regulation</h2>
            <p>
              As a licensed importer, we are required by law to maintain certain records of transactions 
              and license verifications. We may share information with regulatory bodies (TTB, State SLAs) 
              as required for compliance.
            </p>
          </section>

          <footer style={{ marginTop: "80px", paddingTop: "40px", borderTop: `1px solid ${T.glassBorder}` }}>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.3)" }}>
              Last updated: April 1, 2026. For inquiries regarding your data, please contact
              legal@vinaioimports.com.
            </p>
          </footer>
        </article>
      </div>
    </main>
  );
}
