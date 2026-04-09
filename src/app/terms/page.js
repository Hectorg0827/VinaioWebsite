import { T, ff } from "@/lib/theme";
import Hr from "@/components/Hr";
import Reveal from "@/components/Reveal";

export const metadata = {
  title: "Terms of Service — Vinaio Imports",
  description: "Terms and conditions for use of the Vinaio Imports website and portal.",
};

export default function TermsPage() {
  return (
    <main style={{ background: T.ink, minHeight: "100vh", padding: "160px 48px 100px", color: T.paper }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <Reveal>
          <Hr w="32px" c={T.gold} style={{ marginBottom: "24px" }} />
          <h1 style={{ fontFamily: ff.h, fontSize: "56px", color: T.paper, marginBottom: "48px" }}>
            Terms of Service
          </h1>
        </Reveal>

        <article style={{ fontFamily: ff.b, fontSize: "16px", color: "rgba(255,255,255,0.6)", lineHeight: 1.85 }}>
          <section style={{ marginBottom: "48px" }}>
            <h2 style={{ fontFamily: ff.h, fontSize: "28px", color: T.paper, marginBottom: "20px" }}>1. Acceptance of Terms</h2>
            <p>
              By accessing or using the Vinaio Imports, Ltd. website and Customer Portal, you 
              agree to be bound by these Terms of Service. If you do not agree to these terms, 
              please refrain from using our services.
            </p>
          </section>

          <section style={{ marginBottom: "48px" }}>
            <h2 style={{ fontFamily: ff.h, fontSize: "28px", color: T.paper, marginBottom: "20px" }}>2. Age Verification & Compliance</h2>
            <p style={{ fontWeight: 600, color: T.gold, marginBottom: "12px" }}>
              Users must be of legal drinking age in their jurisdiction to use this website.
            </p>
            <p>
              By accessing this site, you certify that you are of legal drinking age. 
              Trade accounts require a valid and active liquor license issued by the 
              appropriate state authority (e.g., SLA, TTB). We reserve the right to 
              verify all licensing information before activating an account.
            </p>
          </section>

          <section style={{ marginBottom: "48px" }}>
            <h2 style={{ fontFamily: ff.h, fontSize: "28px", color: T.paper, marginBottom: "20px" }}>3. Business Use Only</h2>
            <p>
              The Vinaio Customer Portal is intended for wholesale B2B transactions between 
              Vinaio Imports, Ltd. and licensed retail, restaurant, or distribution entities. 
              Unauthorized access or use for non-business purposes is strictly prohibited.
            </p>
          </section>

          <section style={{ marginBottom: "48px" }}>
            <h2 style={{ fontFamily: ff.h, fontSize: "28px", color: T.paper, marginBottom: "20px" }}>4. Intellectual Property</h2>
            <p>
              All content on this website, including but not limited to the Vinaio wordmark, 
              logo, design, and product descriptions, are the property of Vinaio Imports, Ltd. 
              and protected by copyright and trademark laws.
            </p>
          </section>

          <footer style={{ marginTop: "80px", paddingTop: "40px", borderTop: `1px solid ${T.glassBorder}` }}>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.3)" }}>
              Last revised: April 1, 2026. For legal inquiries, please contact
              legal@vinaioimports.com.
            </p>
          </footer>
        </article>
      </div>
    </main>
  );
}
