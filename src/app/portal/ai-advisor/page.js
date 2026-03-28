"use client";

import { useState, useRef, useEffect } from "react";
import { T, ff } from "@/lib/theme";
import Hr from "@/components/Hr";
import { PRODUCTS } from "@/data/products";

const CATALOG_SUMMARY = PRODUCTS.map(
  (p) => `${p.name} ($${p.price}, ${p.category}, ${p.origin}${p.inStock ? "" : " - OUT OF STOCK"})`
).join("; ");

const SYSTEM_PROMPT = `You are the AI Sales Advisor for Vinaio Imports, a luxury fine wine and spirits importer and distributor. You are speaking with a licensed trade buyer.

Your role:
- Suggest products from the Vinaio catalog that fit the customer's needs
- Reference seasonal trends, upcoming promotions, and volume opportunities
- Be proactive, knowledgeable, and warm — like a great sales rep
- Keep responses concise: 2–4 sentences max unless a longer answer is clearly needed

Vinaio catalog: ${CATALOG_SUMMARY}

Vinaio services: licensed TTB importer, 26-state distribution, self-distribution in NY/NJ/FL, white label wines/spirits/beer, logistics & compliance, Vinaio Spain & Europe import program.

Always reference specific products by name when making suggestions. If a product is out of stock, offer alternatives.`;

const STARTERS = [
  "What's selling well this spring?",
  "Suggest a rum promotion package",
  "What complements my current Dominican portfolio?",
  "Tell me about your white label options",
];

export default function AISalesAdvisorPage() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! I'm your Vinaio AI Sales Advisor. I can suggest products from our catalog, help plan seasonal promotions, or walk you through our white label and distribution services. What are you working on today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (text) => {
    const q = text ?? input.trim();
    if (!q || busy) return;
    setInput("");

    const userMsg = { role: "user", content: q };
    const nextMsgs = [...messages, userMsg];
    setMessages(nextMsgs);
    setBusy(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemContext: SYSTEM_PROMPT,
          messages: nextMsgs.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.text || data.error || "Sorry, try again." },
      ]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Connection issue — please try again." }]);
    }
    setBusy(false);
  };

  return (
    <>
      <h2 style={{ fontFamily: ff.h, fontSize: "32px", color: T.ink, marginBottom: "8px" }}>AI Sales Advisor</h2>
      <p style={{ fontFamily: ff.b, fontSize: "13px", color: T.muted, marginBottom: "32px" }}>
        Personalized product recommendations and sales insights powered by Claude
      </p>

      {/* Starter chips */}
      {messages.length === 1 && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "24px" }}>
          {STARTERS.map((s) => (
            <div
              key={s}
              onClick={() => send(s)}
              style={{
                padding: "16px 20px",
                background: T.paper,
                border: `1px solid ${T.cream}`,
                borderRadius: "6px",
                cursor: "pointer",
                fontFamily: ff.b,
                fontSize: "13px",
                color: T.deep,
                transition: "border-color 0.3s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = T.wine)}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = T.cream)}
            >
              &ldquo;{s}&rdquo;
            </div>
          ))}
        </div>
      )}

      {/* Chat window */}
      <div style={{ background: T.paper, border: `1px solid ${T.cream}`, borderRadius: "10px", overflow: "hidden" }}>
        <div style={{ maxHeight: "460px", overflowY: "auto", padding: "20px 24px", display: "flex", flexDirection: "column", gap: "14px" }}>
          {messages.map((m, i) => (
            <div
              key={i}
              style={{
                alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                maxWidth: "80%",
                padding: "14px 18px",
                borderRadius: m.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                background: m.role === "user" ? T.wine : T.bg,
                fontFamily: ff.b,
                fontSize: "13px",
                color: m.role === "user" ? T.paper : T.deep,
                lineHeight: 1.7,
              }}
            >
              {m.role === "assistant" && (
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                  <span style={{ color: T.gold, fontSize: "12px" }}>✦</span>
                  <span style={{ fontFamily: ff.b, fontSize: "9px", letterSpacing: "2px", textTransform: "uppercase", color: T.warm, fontWeight: 600 }}>
                    Sales Advisor
                  </span>
                </div>
              )}
              {m.content}
            </div>
          ))}
          {busy && (
            <div style={{ padding: "14px 18px", borderRadius: "14px", background: T.bg, fontFamily: ff.b, fontSize: "13px", color: T.muted, alignSelf: "flex-start" }}>
              Thinking…
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Input */}
        <div style={{ padding: "16px 20px", borderTop: `1px solid ${T.cream}`, display: "flex", gap: "10px" }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
            placeholder="Ask for recommendations, promotions, or product info…"
            style={{
              flex: 1,
              padding: "12px 16px",
              background: T.bg,
              border: `1px solid ${T.cream}`,
              borderRadius: "6px",
              color: T.ink,
              fontFamily: ff.b,
              fontSize: "13px",
              outline: "none",
            }}
          />
          <button
            onClick={() => send()}
            disabled={busy || !input.trim()}
            style={{
              padding: "12px 24px",
              background: T.wine,
              border: "none",
              borderRadius: "6px",
              color: T.paper,
              fontFamily: ff.b,
              fontSize: "11px",
              fontWeight: 600,
              cursor: "pointer",
              opacity: busy || !input.trim() ? 0.5 : 1,
              letterSpacing: "1px",
              textTransform: "uppercase",
            }}
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
}
