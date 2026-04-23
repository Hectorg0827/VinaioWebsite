/**
 * Vinaio Email Service (Powered by Resend)
 * This utility provides a centralized way to send transactional emails.
 */

export async function sendEmail({ to, subject, html, from = "Vinaio <portal@vinaioimports.com>" }) {
  const resendKey = process.env.RESEND_API_KEY;

  if (!resendKey) {
    console.error("❌ Email failed: RESEND_API_KEY is not defined in environment variables.");
    return { success: false, error: "Configuration missing" };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        subject,
        html,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log(`✅ Email sent successfully to ${to}: ${data.id}`);
      return { success: true, id: data.id };
    } else {
      console.error("❌ Resend API Error:", data);
      return { success: false, error: data.message || "Failed to send email" };
    }
  } catch (error) {
    console.error("❌ Network error sending email:", error);
    return { success: false, error: "Network error" };
  }
}
