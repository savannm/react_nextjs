import { useState } from "react";

const sections = [
    { id: "overview", label: "Overview" },
    { id: "setup", label: "1. Setup" },
    { id: "stripe-lib", label: "2. Stripe Client" },
    { id: "server-action", label: "3. Server Action" },
    { id: "embedded", label: "4. Embedded Checkout" },
    { id: "webhook", label: "5. Webhooks" },
    { id: "success", label: "6. Success Page" },
    { id: "ai-llm", label: "7. AI + Stripe" },
    { id: "tips", label: "Pro Tips" },
];

const CodeBlock = ({ code, lang = "typescript" }) => {
    const [copied, setCopied] = useState(false);
    const copy = () => {
        navigator.clipboard.writeText(code.trim());
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
    };
    return (
        <div style={{ position: "relative", margin: "16px 0" }}>
            <div style={{
                background: "#0d1117",
                border: "1px solid #21262d",
                borderRadius: "10px",
                overflow: "hidden",
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            }}>
                <div style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "8px 16px", background: "#161b22", borderBottom: "1px solid #21262d"
                }}>
                    <span style={{ color: "#7d8590", fontSize: "12px", letterSpacing: "0.05em", textTransform: "uppercase" }}>{lang}</span>
                    <button onClick={copy} style={{
                        background: copied ? "#1a7f37" : "#21262d",
                        border: "1px solid #30363d", borderRadius: "6px",
                        color: copied ? "#3fb950" : "#c9d1d9", cursor: "pointer",
                        fontSize: "11px", padding: "4px 10px", transition: "all 0.2s",
                        fontFamily: "inherit"
                    }}>
                        {copied ? "✓ Copied" : "Copy"}
                    </button>
                </div>
                <pre style={{
                    margin: 0, padding: "20px", overflowX: "auto",
                    fontSize: "13px", lineHeight: "1.7", color: "#e6edf3",
                    whiteSpace: "pre", tabSize: 2
                }}>
                    <code dangerouslySetInnerHTML={{ __html: highlight(code.trim()) }} />
                </pre>
            </div>
        </div>
    );
};

function highlight(code) {
    return code
        .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
        .replace(/(\/\/.*)/g, '<span style="color:#8b949e">$1</span>')
        .replace(/("use server"|"use client")/g, '<span style="color:#d2a8ff">$1</span>')
        .replace(/\b(import|export|from|const|let|async|await|return|try|catch|if|new|default|function|type|interface)\b/g, '<span style="color:#ff7b72">$1</span>')
        .replace(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/g, '<span style="color:#a5d6ff">$1</span>')
        .replace(/\b([A-Z][a-zA-Z0-9]*)\b/g, '<span style="color:#ffa657">$1</span>')
        .replace(/\b(\d+)\b/g, '<span style="color:#79c0ff">$1</span>');
}

const Badge = ({ children, color }) => (
    <span style={{
        display: "inline-block", padding: "2px 10px", borderRadius: "20px",
        fontSize: "11px", fontWeight: 700, letterSpacing: "0.05em",
        background: color === "green" ? "#1a7f3722" : color === "blue" ? "#1158c722" : "#8b5cf622",
        color: color === "green" ? "#3fb950" : color === "blue" ? "#58a6ff" : "#c084fc",
        border: `1px solid ${color === "green" ? "#1a7f37" : color === "blue" ? "#1158c7" : "#7c3aed"}44`,
        marginRight: "6px", marginBottom: "4px"
    }}>{children}</span>
);

const Note = ({ type = "info", children }) => {
    const styles = {
        info: { bg: "#1158c711", border: "#58a6ff44", icon: "ℹ️", color: "#58a6ff" },
        warn: { bg: "#d2992211", border: "#d2992244", icon: "⚠️", color: "#e3b341" },
        success: { bg: "#1a7f3711", border: "#3fb95044", icon: "✅", color: "#3fb950" },
        danger: { bg: "#f8514922", border: "#f8514944", icon: "🚨", color: "#f85149" },
    };
    const s = styles[type];
    return (
        <div style={{
            background: s.bg, border: `1px solid ${s.border}`, borderLeft: `3px solid ${s.color}`,
            borderRadius: "8px", padding: "12px 16px", margin: "14px 0",
            fontSize: "13.5px", color: "#c9d1d9", lineHeight: 1.6
        }}>
            <span style={{ marginRight: "8px" }}>{s.icon}</span>{children}
        </div>
    );
};

const H2 = ({ children }) => (
    <h2 style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: "22px", fontWeight: 700,
        color: "#e6edf3", margin: "32px 0 16px",
        paddingBottom: "10px", borderBottom: "1px solid #21262d",
        display: "flex", alignItems: "center", gap: "10px"
    }}>{children}</h2>
);

const H3 = ({ children }) => (
    <h3 style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: "16px", fontWeight: 600,
        color: "#cdd9e5", margin: "20px 0 8px"
    }}>{children}</h3>
);

const P = ({ children }) => (
    <p style={{ color: "#8d96a0", fontSize: "14px", lineHeight: 1.75, margin: "8px 0" }}>{children}</p>
);

// ─── SECTION CONTENT ─────────────────────────────────────────────────────────

const sectionContent = {
    overview: () => (
        <div>
            <H2>🧭 Stripe + Next.js 2026 — Complete Integration Guide</H2>
            <P>
                In 2026, the Stripe integration story for Next.js has matured significantly. The latest Stripe Node SDK uses <strong style={{ color: "#ffa657" }}>new Stripe()</strong> (ES6 class syntax), the pinned API version is <code style={{ color: "#a5d6ff", background: "#21262d", padding: "2px 6px", borderRadius: 4 }}>2026-03-25.dahlia</code>, and the recommended architecture is <strong style={{ color: "#ffa657" }}>Server Actions + Embedded Checkout</strong>.
            </P>
            <P>This guide covers everything from zero to production, including integrating Stripe payment triggers with an AI LLM (Claude / GPT).</P>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", margin: "20px 0" }}>
                {[
                    { icon: "⚡", title: "Server Actions First", desc: "No more /api/checkout folders — Server Actions handle session creation directly." },
                    { icon: "🪄", title: "Embedded Checkout", desc: "Users stay on your domain. Stripe renders inside an iframe, handling PCI compliance." },
                    { icon: "🔔", title: "Webhook Handlers", desc: "Route Handlers still power webhooks — required for payment event processing." },
                    { icon: "🤖", title: "AI + Stripe", desc: "Let your LLM trigger checkout flows, explain pricing, or handle billing queries." },
                ].map(c => (
                    <div key={c.title} style={{
                        background: "#161b22", border: "1px solid #21262d", borderRadius: "10px",
                        padding: "16px", display: "flex", gap: "12px"
                    }}>
                        <span style={{ fontSize: "24px" }}>{c.icon}</span>
                        <div>
                            <div style={{ fontWeight: 700, color: "#e6edf3", fontSize: "14px", marginBottom: "4px" }}>{c.title}</div>
                            <div style={{ color: "#7d8590", fontSize: "13px", lineHeight: 1.5 }}>{c.desc}</div>
                        </div>
                    </div>
                ))}
            </div>

            <H3>Stack Overview</H3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "16px" }}>
                {["Next.js 15+", "App Router", "React 19", "stripe@17+", "@stripe/stripe-js", "@stripe/react-stripe-js", "TypeScript", "Vercel"].map(t => (
                    <Badge key={t} color="blue">{t}</Badge>
                ))}
            </div>

            <Note type="warn">
                <strong>Breaking change in 2026:</strong> The Stripe Node SDK now requires <code>new Stripe("sk_...")</code> — calling it without <code>new</code> will throw. CJS default exports also changed. Always check your import style.
            </Note>
        </div>
    ),

    setup: () => (
        <div>
            <H2>📦 1. Project Setup</H2>
            <P>Start a fresh Next.js 15 project with App Router and TypeScript, then install the Stripe packages.</P>
            <CodeBlock lang="bash" code={`# Create the project
npx create-next-app@latest my-store --typescript --tailwind --app
cd my-store

# Install Stripe (server + client SDKs)
npm install stripe @stripe/stripe-js @stripe/react-stripe-js`} />

            <H3>Environment Variables</H3>
            <P>Create <code style={{ color: "#a5d6ff" }}>/.env.local</code> at the project root. <strong style={{ color: "#f85149" }}>Never commit this file.</strong></P>
            <CodeBlock lang="env" code={`# .env.local

# Server-only — NEVER prefix with NEXT_PUBLIC_
STRIPE_SECRET_KEY="sk_test_51..."

# Client-safe publishable key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_51..."

# Webhook signing secret (from Stripe Dashboard or CLI)
STRIPE_WEBHOOK_SECRET="whsec_..."

# (Optional) For AI integration
ANTHROPIC_API_KEY="sk-ant-..."
OPENAI_API_KEY="sk-..."`} />

            <Note type="danger">
                <strong>Security rule:</strong> Only variables prefixed with <code>NEXT_PUBLIC_</code> are exposed to the browser. Your <code>STRIPE_SECRET_KEY</code> must NEVER have this prefix — keep it server-side only.
            </Note>

            <H3>Folder Structure</H3>
            <CodeBlock lang="text" code={`my-store/
├── src/
│   ├── app/
│   │   ├── actions/
│   │   │   └── stripe.ts          ← Server Actions
│   │   ├── api/
│   │   │   └── webhook/
│   │   │       └── route.ts       ← Stripe webhook handler
│   │   │   └── ai-checkout/
│   │   │       └── route.ts       ← AI-triggered checkout
│   │   ├── checkout/
│   │   │   └── page.tsx           ← Checkout page
│   │   ├── return/
│   │   │   └── page.tsx           ← Post-payment return
│   │   └── page.tsx               ← Homepage / product page
│   ├── components/
│   │   └── CheckoutForm.tsx       ← Embedded Checkout component
│   └── lib/
│       └── stripe.ts              ← Singleton Stripe client`} />
        </div>
    ),

    "stripe-lib": () => (
        <div>
            <H2>🔧 2. Stripe Client Singleton</H2>
            <P>Create a reusable Stripe instance. In 2026, the SDK is a true ES6 class — use <code style={{ color: "#a5d6ff" }}>new Stripe()</code>.</P>
            <CodeBlock lang="typescript" code={`// src/lib/stripe.ts
import Stripe from "stripe";

// ✅ 2026: new Stripe() is required — calling Stripe() directly throws
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // Pinned to the stable 2026 dahlia release
  apiVersion: "2026-03-25.dahlia",
  typescript: true,
});`} />

            <Note type="warn">
                <strong>Old (broken in 2026):</strong> <code>const stripe = Stripe("sk_...")</code> — this no longer works. The CJS <code>.default</code> export was also removed. Use named import + <code>new</code>.
            </Note>

            <H3>Client-Side Stripe.js</H3>
            <P>For the browser, load Stripe.js once via <code style={{ color: "#a5d6ff" }}>loadStripe()</code>. Do this outside your component to avoid re-loading on re-renders.</P>
            <CodeBlock lang="typescript" code={`// src/lib/stripe-client.ts  (used by Client Components)
import { loadStripe } from "@stripe/stripe-js";

// Singleton pattern — loadStripe is called once, result is cached
export const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);`} />
        </div>
    ),

    "server-action": () => (
        <div>
            <H2>⚡ 3. Server Action — Create Checkout Session</H2>
            <P>
                Server Actions (<code>"use server"</code>) run on the server without needing an API route. This is the 2026 standard — your secret key stays server-side and there's no extra fetch round-trip to <code>/api/checkout</code>.
            </P>
            <CodeBlock lang="typescript" code={`// src/app/actions/stripe.ts
"use server";

import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";

export async function createCheckoutSession(priceId: string) {
  // headers() is async in Next.js 15+
  const origin = (await headers()).get("origin");

  const session = await stripe.checkout.sessions.create({
    // Embedded mode keeps users on your domain (no redirect)
    ui_mode: "embedded",

    line_items: [{ price: priceId, quantity: 1 }],

    // "payment" for one-time | "subscription" for recurring
    mode: "payment",

    // 2026: return_url replaces success_url for embedded mode
    return_url: \`\${origin}/return?session_id={CHECKOUT_SESSION_ID}\`,

    // 2026 feature: auto-detect user's local currency
    // (enabled by default when adaptive_pricing is set)
    automatic_tax: { enabled: true },

    // 2026: collect tax IDs for B2B global compliance
    tax_id_collection: { enabled: true },
  });

  // Only return client_secret to the browser — never the full session!
  return { clientSecret: session.client_secret };
}

// ─── One-time payment with custom amount (e.g. AI-generated cart) ────────────
export async function createDynamicCheckoutSession(
  items: Array<{ name: string; price: number; quantity: number }>
) {
  const origin = (await headers()).get("origin");

  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    mode: "payment",
    line_items: items.map((item) => ({
      price_data: {
        currency: "aud", // Australian dollars 🇦🇺
        product_data: { name: item.name },
        unit_amount: item.price, // in cents! $29.99 = 2999
      },
      quantity: item.quantity,
    })),
    return_url: \`\${origin}/return?session_id={CHECKOUT_SESSION_ID}\`,
  });

  return { clientSecret: session.client_secret };
}`} />

            <Note type="info">
                <strong>Embedded vs Hosted:</strong> <code>ui_mode: "embedded"</code> renders Stripe's UI inside your page (no redirect, better conversion). Use <code>ui_mode: "hosted"</code> + <code>success_url</code> if you want the classic Stripe-hosted page redirect instead.
            </Note>
        </div>
    ),

    embedded: () => (
        <div>
            <H2>🪄 4. Embedded Checkout Component</H2>
            <P>
                This Client Component renders Stripe's full payment UI inline — card fields, Apple Pay, Google Pay, Link — without redirecting the user away.
            </P>
            <CodeBlock lang="tsx" code={`// src/components/CheckoutForm.tsx
"use client";

import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { stripePromise } from "@/lib/stripe-client";
import { createCheckoutSession } from "@/app/actions/stripe";

interface CheckoutFormProps {
  priceId: string;
}

export default function CheckoutForm({ priceId }: CheckoutFormProps) {
  // This callback is called by EmbeddedCheckoutProvider to get the clientSecret
  const fetchClientSecret = async (): Promise<string> => {
    const { clientSecret } = await createCheckoutSession(priceId);
    if (!clientSecret) throw new Error("No client secret returned");
    return clientSecret;
  };

  return (
    <div id="checkout" style={{ minHeight: "400px" }}>
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={{ fetchClientSecret }}
      >
        {/* Stripe renders its full UI here inside an iframe */}
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}`} />

            <H3>Checkout Page</H3>
            <CodeBlock lang="tsx" code={`// src/app/checkout/page.tsx
import CheckoutForm from "@/components/CheckoutForm";

export default function CheckoutPage() {
  // Replace with your real Stripe Price ID from the Dashboard
  const PRICE_ID = "price_1ABC123def456";

  return (
    <main style={{ maxWidth: "600px", margin: "60px auto", padding: "0 20px" }}>
      <h1>Complete Your Purchase</h1>
      <CheckoutForm priceId={PRICE_ID} />
    </main>
  );
}`} />

            <Note type="success">
                <strong>Link Authentication:</strong> Stripe automatically detects if the user has a Link account (1-click checkout) and pre-fills their saved details — no extra code needed. This increases conversion by ~10%.
            </Note>
        </div>
    ),

    webhook: () => (
        <div>
            <H2>🔔 5. Webhook Handler</H2>
            <P>
                Webhooks are how Stripe tells your server "payment succeeded". Even with Server Actions, you need a Route Handler for this — Stripe needs a static URL to POST to.
            </P>
            <CodeBlock lang="typescript" code={`// src/app/api/webhook/route.ts
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import type Stripe from "stripe";

// IMPORTANT: disable body parsing — Stripe needs the raw body for signature verification
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await req.text(); // raw body string
  const signature = (await headers()).get("stripe-signature");

  if (!signature) {
    return new Response("Missing stripe-signature header", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    // This verifies the webhook came from Stripe (not a spoofed request)
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("Webhook verification failed:", err.message);
    return new Response(\`Webhook Error: \${err.message}\`, { status: 400 });
  }

  // ─── Handle Events ─────────────────────────────────────────────────────────
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      // ✅ Payment confirmed — fulfill the order
      await fulfillOrder(session);
      break;
    }

    case "checkout.session.expired": {
      const session = event.data.object as Stripe.Checkout.Session;
      // 🛒 User abandoned checkout — trigger re-engagement email
      await handleAbandonedCart(session);
      break;
    }

    case "payment_intent.payment_failed": {
      const intent = event.data.object as Stripe.PaymentIntent;
      console.error("Payment failed:", intent.last_payment_error?.message);
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      await cancelUserSubscription(sub.customer as string);
      break;
    }

    default:
      console.log(\`Unhandled event type: \${event.type}\`);
  }

  return new Response(null, { status: 200 });
}

// ─── Your business logic goes here ─────────────────────────────────────────
async function fulfillOrder(session: Stripe.Checkout.Session) {
  console.log("✅ Order fulfilled for session:", session.id);
  // e.g. update database, send email, provision access, etc.
}

async function handleAbandonedCart(session: Stripe.Checkout.Session) {
  console.log("🛒 Abandoned cart:", session.id);
}

async function cancelUserSubscription(customerId: string) {
  console.log("❌ Subscription cancelled for customer:", customerId);
}`} />

            <H3>Local Testing with Stripe CLI</H3>
            <CodeBlock lang="bash" code={`# Install Stripe CLI, then:
stripe login
stripe listen --forward-to localhost:3000/api/webhook

# In another terminal, trigger a test event:
stripe trigger checkout.session.completed`} />

            <Note type="warn">
                Always use <code>req.text()</code> (raw body) for webhook signature verification. If you parse JSON first, the signature check will fail.
            </Note>
        </div>
    ),

    success: () => (
        <div>
            <H2>✅ 6. Return / Success Page</H2>
            <P>
                With Embedded Checkout, Stripe redirects to your <code>return_url</code> after payment. You retrieve the session server-side to confirm status and display order details.
            </P>
            <CodeBlock lang="tsx" code={`// src/app/return/page.tsx
import { stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";

interface ReturnPageProps {
  searchParams: Promise<{ session_id?: string }>;
}

export default async function ReturnPage({ searchParams }: ReturnPageProps) {
  const { session_id } = await searchParams;

  if (!session_id) redirect("/");

  // Retrieve the session and expand product details
  const session = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ["line_items.data.price.product", "payment_intent"],
  });

  // Guard against unpaid sessions (bookmark-spoofing, etc.)
  if (session.status !== "complete") {
    return (
      <main>
        <h1>⏳ Payment Pending</h1>
        <p>Status: {session.status}</p>
      </main>
    );
  }

  const lineItems = session.line_items?.data ?? [];

  return (
    <main style={{ maxWidth: "600px", margin: "60px auto", padding: "0 20px" }}>
      <h1>🎉 Payment Successful!</h1>
      <p>Thank you, <strong>{session.customer_details?.email}</strong></p>

      <h2>Order Summary</h2>
      <ul>
        {lineItems.map((item) => {
          const product = item.price?.product as { name: string } | null;
          return (
            <li key={item.id}>
              {product?.name} × {item.quantity} —{" "}
              {(item.amount_total! / 100).toLocaleString("en-AU", {
                style: "currency",
                currency: session.currency?.toUpperCase() ?? "AUD",
              })}
            </li>
          );
        })}
      </ul>

      <p style={{ color: "gray", fontSize: "12px" }}>
        Session ID: {session.id}
      </p>
    </main>
  );
}`} />

            <Note type="info">
                <strong>Server Component advantage:</strong> The return page fetches from Stripe directly at request time — no <code>useEffect</code>, no loading spinner, no client-side API key exposure. Pure Server Component magic.
            </Note>
        </div>
    ),

    "ai-llm": () => (
        <div>
            <H2>🤖 7. AI LLM + Stripe Integration</H2>
            <P>
                There are two main patterns for integrating an LLM with Stripe. Pattern A lets an AI agent trigger checkouts based on natural language. Pattern B uses the AI to explain pricing, answer billing questions, or help users choose a plan.
            </P>

            <H3>Pattern A — AI-Triggered Checkout (Agentic)</H3>
            <P>The LLM uses tool/function calling to invoke your Stripe Server Action when the user says "buy the Pro plan" or "checkout with 3 items".</P>
            <CodeBlock lang="typescript" code={`// src/app/api/ai-checkout/route.ts
// This Route Handler bridges your AI chatbot → Stripe checkout
import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";

const client = new Anthropic();

// Define the Stripe checkout tool for the LLM
const tools: Anthropic.Tool[] = [
  {
    name: "create_checkout_session",
    description:
      "Creates a Stripe Checkout Session for the user to complete payment. " +
      "Use this when the user wants to buy something or proceed to checkout.",
    input_schema: {
      type: "object" as const,
      properties: {
        items: {
          type: "array",
          description: "Items to purchase",
          items: {
            type: "object",
            properties: {
              name: { type: "string", description: "Product name" },
              price: { type: "number", description: "Price in cents (e.g. 2999 = $29.99)" },
              quantity: { type: "number", description: "Quantity" },
            },
            required: ["name", "price", "quantity"],
          },
        },
      },
      required: ["items"],
    },
  },
];

export async function POST(req: NextRequest) {
  const { messages } = await req.json();
  const origin = (await headers()).get("origin");

  // First LLM call — may invoke the tool
  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    tools,
    messages,
  });

  // Check if Claude wants to create a checkout session
  if (response.stop_reason === "tool_use") {
    const toolUse = response.content.find((b) => b.type === "tool_use");

    if (toolUse && toolUse.type === "tool_use" && toolUse.name === "create_checkout_session") {
      const { items } = toolUse.input as {
        items: Array<{ name: string; price: number; quantity: number }>;
      };

      // Execute the actual Stripe API call
      const session = await stripe.checkout.sessions.create({
        ui_mode: "embedded",
        mode: "payment",
        line_items: items.map((item) => ({
          price_data: {
            currency: "aud",
            product_data: { name: item.name },
            unit_amount: item.price,
          },
          quantity: item.quantity,
        })),
        return_url: \`\${origin}/return?session_id={CHECKOUT_SESSION_ID}\`,
      });

      // Second LLM call — give Claude the tool result
      const finalResponse = await client.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 512,
        tools,
        messages: [
          ...messages,
          { role: "assistant", content: response.content },
          {
            role: "user",
            content: [{
              type: "tool_result",
              tool_use_id: toolUse.id,
              content: JSON.stringify({
                success: true,
                clientSecret: session.client_secret,
                sessionId: session.id,
              }),
            }],
          },
        ],
      });

      return NextResponse.json({
        message: finalResponse.content.find((b) => b.type === "text")?.text,
        checkoutClientSecret: session.client_secret, // pass to frontend
      });
    }
  }

  // No tool call — just return Claude's text response
  const text = response.content.find((b) => b.type === "text")?.text ?? "";
  return NextResponse.json({ message: text });
}`} />

            <H3>Pattern A — Frontend AI Chat with Checkout Trigger</H3>
            <CodeBlock lang="tsx" code={`// src/components/AiCheckoutChat.tsx
"use client";

import { useState } from "react";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { stripePromise } from "@/lib/stripe-client";

export default function AiCheckoutChat() {
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [input, setInput] = useState("");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    const res = await fetch("/api/ai-checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: newMessages }),
    });

    const data = await res.json();
    setMessages([...newMessages, { role: "assistant", content: data.message }]);

    // If the AI triggered a checkout, show the Embedded Checkout
    if (data.checkoutClientSecret) {
      setClientSecret(data.checkoutClientSecret);
    }

    setLoading(false);
  };

  return (
    <div>
      <div style={{ border: "1px solid #eee", borderRadius: 8, padding: 16, minHeight: 200 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ margin: "8px 0", textAlign: m.role === "user" ? "right" : "left" }}>
            <span style={{
              display: "inline-block", padding: "8px 14px", borderRadius: 12,
              background: m.role === "user" ? "#0070f3" : "#f1f1f1",
              color: m.role === "user" ? "white" : "black", maxWidth: "80%"
            }}>
              {m.content}
            </span>
          </div>
        ))}
        {loading && <p style={{ color: "#999" }}>AI is thinking...</p>}
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder='Try: "I want to buy the Pro plan for $49"'
          style={{ flex: 1, padding: "10px 14px", borderRadius: 8, border: "1px solid #ddd" }}
        />
        <button onClick={sendMessage} style={{
          padding: "10px 20px", background: "#0070f3", color: "white",
          border: "none", borderRadius: 8, cursor: "pointer"
        }}>
          Send
        </button>
      </div>

      {/* Stripe Embedded Checkout appears here when AI triggers it */}
      {clientSecret && (
        <div style={{ marginTop: 24 }}>
          <EmbeddedCheckoutProvider
            stripe={stripePromise}
            options={{ clientSecret }}
          >
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        </div>
      )}
    </div>
  );
}`} />

            <H3>Pattern B — AI Billing Assistant (Read-Only)</H3>
            <P>Let users ask billing questions in plain English. The AI fetches their Stripe data and explains it conversationally.</P>
            <CodeBlock lang="typescript" code={`// src/app/api/billing-ai/route.ts
// AI assistant that answers billing questions using Stripe data
import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { stripe } from "@/lib/stripe";

const client = new Anthropic();

export async function POST(req: NextRequest) {
  const { customerId, question } = await req.json();

  // Fetch relevant Stripe data for the customer
  const [subscriptions, invoices, paymentMethods] = await Promise.all([
    stripe.subscriptions.list({ customer: customerId, limit: 3 }),
    stripe.invoices.list({ customer: customerId, limit: 5 }),
    stripe.paymentMethods.list({ customer: customerId, type: "card" }),
  ]);

  // Build context for the LLM
  const billingContext = {
    subscriptions: subscriptions.data.map((s) => ({
      id: s.id,
      status: s.status,
      plan: s.items.data[0]?.price.nickname,
      currentPeriodEnd: new Date(s.current_period_end * 1000).toLocaleDateString(),
    })),
    recentInvoices: invoices.data.map((inv) => ({
      id: inv.id,
      amount: (inv.amount_paid / 100).toFixed(2),
      status: inv.status,
      date: new Date(inv.created * 1000).toLocaleDateString(),
    })),
    paymentMethods: paymentMethods.data.map((pm) => ({
      brand: pm.card?.brand,
      last4: pm.card?.last4,
      expiry: \`\${pm.card?.exp_month}/\${pm.card?.exp_year}\`,
    })),
  };

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 512,
    system: \`You are a friendly billing assistant for a SaaS product.
You have access to the customer's billing data and answer questions accurately and helpfully.
Always be concise. Format currency as AUD.
Customer billing data: \${JSON.stringify(billingContext, null, 2)}\`,
    messages: [{ role: "user", content: question }],
  });

  const answer = response.content.find((b) => b.type === "text")?.text ?? "";
  return NextResponse.json({ answer });
}`} />

            <Note type="success">
                <strong>Use case examples:</strong> "When does my subscription renew?", "What was my last invoice?", "Can you upgrade me to the Business plan?", "I want to cancel my subscription." — The AI handles all of these conversationally and can trigger real Stripe actions.
            </Note>
        </div>
    ),

    tips: () => (
        <div>
            <H2>🚀 Pro Tips & 2026 Best Practices</H2>

            <div style={{ display: "grid", gap: "14px" }}>
                {[
                    {
                        icon: "🔒", title: "Never trust client-side prices",
                        body: "Always define prices in Stripe Dashboard or pass Price IDs from server. Never send amount values from the browser — they can be tampered with.",
                        type: "danger"
                    },
                    {
                        icon: "💱", title: "Adaptive Pricing (2026 feature)",
                        body: "Add adaptive_pricing: { enabled: true } to your session to let Stripe auto-convert to the user's local currency based on IP. Zero extra code.",
                        type: "info"
                    },
                    {
                        icon: "🧾", title: "Tax ID Collection for B2B",
                        body: "Add tax_id_collection: { enabled: true } to collect VAT/GST numbers globally. Stripe handles all the validation.",
                        type: "info"
                    },
                    {
                        icon: "🪝", title: "Idempotent webhooks",
                        body: "Stripe may deliver the same webhook event multiple times. Always check if you've already processed a session ID before fulfilling an order to avoid double-fulfillment.",
                        type: "warn"
                    },
                    {
                        icon: "🧪", title: "Test card numbers",
                        body: "4242 4242 4242 4242 (success) | 4000 0000 0000 9995 (declined) | 4000 0025 0000 3155 (3D Secure). Use any future expiry + any 3-digit CVC.",
                        type: "success"
                    },
                    {
                        icon: "⚡", title: "Vercel Deployment",
                        body: "Set STRIPE_SECRET_KEY, NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY, and STRIPE_WEBHOOK_SECRET in your Vercel project environment variables. Then update your webhook URL in the Stripe Dashboard to your production domain.",
                        type: "info"
                    },
                ].map(tip => (
                    <div key={tip.title} style={{
                        background: "#161b22", border: "1px solid #21262d",
                        borderRadius: "10px", padding: "16px"
                    }}>
                        <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                            <span style={{ fontSize: "22px", flexShrink: 0 }}>{tip.icon}</span>
                            <div>
                                <div style={{ fontWeight: 700, color: "#e6edf3", marginBottom: "6px", fontSize: "14px" }}>
                                    {tip.title}
                                </div>
                                <div style={{ color: "#8d96a0", fontSize: "13.5px", lineHeight: 1.6 }}>
                                    {tip.body}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <H3>Quick Reference</H3>
            <CodeBlock lang="text" code={`Architecture Summary (2026)
───────────────────────────────────────────────────────────
User clicks "Buy"
  → CheckoutForm.tsx (Client Component)
    → fetchClientSecret() callback
      → createCheckoutSession() Server Action   ← your secret key lives here
        → stripe.checkout.sessions.create()
          → returns client_secret
    → EmbeddedCheckoutProvider receives client_secret
      → Stripe renders payment form in iframe (PCI-compliant)
        → User completes payment
          → Stripe POSTs to /api/webhook/route.ts
            → Your fulfillOrder() runs ✅
          → Stripe redirects to /return?session_id=...
            → Return page retrieves session, shows confirmation ✅

AI Integration flow (Pattern A)
───────────────────────────────────────────────────────────
User chats "Buy Pro plan for $49"
  → /api/ai-checkout route handler
    → Anthropic Claude with tool: create_checkout_session
      → Claude calls tool with { items: [...] }
        → You execute stripe.checkout.sessions.create()
          → Return clientSecret to Claude
            → Claude confirms to user + clientSecret sent to frontend
              → EmbeddedCheckout renders for user to complete payment ✅`} />
        </div>
    ),
};

// ─── MAIN APP ────────────────────────────────────────────────────────────────

export default function App() {
    const [active, setActive] = useState("overview");

    return (
        <div style={{
            minHeight: "100vh",
            background: "#0d1117",
            color: "#e6edf3",
            fontFamily: "'Inter', 'Segoe UI', sans-serif",
            display: "flex",
        }}>
            {/* Sidebar */}
            <aside style={{
                width: "220px", flexShrink: 0,
                background: "#010409",
                borderRight: "1px solid #21262d",
                padding: "24px 0",
                position: "sticky", top: 0, height: "100vh", overflowY: "auto"
            }}>
                <div style={{ padding: "0 16px 20px", borderBottom: "1px solid #21262d", marginBottom: "12px" }}>
                    <div style={{ fontSize: "18px", fontWeight: 800, color: "#e6edf3", letterSpacing: "-0.02em" }}>
                        <span style={{ color: "#635bff" }}>Stripe</span> × Next.js
                    </div>
                    <div style={{ fontSize: "11px", color: "#7d8590", marginTop: "2px" }}>2026 Integration Guide</div>
                </div>
                <nav>
                    {sections.map(s => (
                        <button key={s.id} onClick={() => setActive(s.id)} style={{
                            display: "block", width: "100%", textAlign: "left",
                            padding: "8px 16px", background: active === s.id ? "#21262d" : "transparent",
                            border: "none", borderLeft: active === s.id ? "2px solid #635bff" : "2px solid transparent",
                            color: active === s.id ? "#e6edf3" : "#7d8590",
                            cursor: "pointer", fontSize: "13px",
                            fontWeight: active === s.id ? 600 : 400,
                            transition: "all 0.15s",
                        }}>
                            {s.label}
                        </button>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <main style={{
                flex: 1, padding: "40px 48px", maxWidth: "900px",
                overflowY: "auto"
            }}>
                {sectionContent[active]?.()}

                {/* Nav buttons */}
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "40px", paddingTop: "20px", borderTop: "1px solid #21262d" }}>
                    {sections.findIndex(s => s.id === active) > 0 && (
                        <button onClick={() => {
                            const i = sections.findIndex(s => s.id === active);
                            setActive(sections[i - 1].id);
                        }} style={{
                            background: "#21262d", border: "1px solid #30363d", borderRadius: "8px",
                            color: "#c9d1d9", cursor: "pointer", padding: "10px 20px", fontSize: "13px"
                        }}>
                            ← {sections[sections.findIndex(s => s.id === active) - 1]?.label}
                        </button>
                    )}
                    <div style={{ flex: 1 }} />
                    {sections.findIndex(s => s.id === active) < sections.length - 1 && (
                        <button onClick={() => {
                            const i = sections.findIndex(s => s.id === active);
                            setActive(sections[i + 1].id);
                        }} style={{
                            background: "#635bff", border: "none", borderRadius: "8px",
                            color: "white", cursor: "pointer", padding: "10px 20px", fontSize: "13px", fontWeight: 600
                        }}>
                            {sections[sections.findIndex(s => s.id === active) + 1]?.label} →
                        </button>
                    )}
                </div>
            </main>
        </div>
    );
}
