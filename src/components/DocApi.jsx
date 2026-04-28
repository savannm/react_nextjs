import { useState, useRef, useEffect } from "react";

// ─── CONTENT DATA ─────────────────────────────────────────────────────────────

const TRACKS = [
  {
    id: "ai",
    number: "01",
    icon: "🧠",
    label: "AI & Agentic Workflows",
    tagline: "The Hottest Skill of 2025",
    accent: "#00FFB2",
    dim: "#00FFB215",
    border: "#00FFB230",
    intro: `Modern companies are no longer looking for simple "GPT wrappers." They want engineers who can build agentic loops — systems that can think, plan, and execute multi-step tasks autonomously. Mastering these APIs puts you in the top 5% of candidates.`,
    apis: [
      {
        name: "Anthropic Claude API",
        badge: "Preferred for Reasoning",
        badgeColor: "#00FFB2",
        logo: "⚡",
        why: "Currently the industry-preferred choice for complex reasoning, structured output, and tool use. Claude's function calling (tool use) lets you define JSON schemas that the model fills — enabling fully programmatic UI control from AI decisions.",
        architecture: {
          title: "Agentic Loop Architecture",
          nodes: [
            { label: "User Input", sub: "Prompt + context", color: "#00FFB2" },
            { label: "Claude API", sub: "Reasoning + tool calls", color: "#FFFFFF" },
            { label: "Tool Executor", sub: "Your JS/Python code", color: "#00FFB2" },
            { label: "Result", sub: "Back to Claude or UI", color: "#94A3B8" },
          ],
          flow: "loop"
        },
        setup: [
          {
            label: "Install SDK",
            lang: "bash",
            code: `npm install @anthropic-ai/sdk`
          },
          {
            label: "Basic completion",
            lang: "js",
            code: `import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const message = await client.messages.create({
  model: "claude-opus-4-5",
  max_tokens: 1024,
  messages: [{ role: "user", content: "Explain agentic AI in one paragraph." }],
});

console.log(message.content[0].text);`
          },
          {
            label: "Tool use (Function Calling) — prove you're not a GPT wrapper",
            lang: "js",
            code: `const tools = [
  {
    name: "update_ui_component",
    description: "Updates a UI component with new props based on AI decision",
    input_schema: {
      type: "object",
      properties: {
        component: { type: "string", enum: ["hero", "cta", "pricing"] },
        headline: { type: "string" },
        variant:  { type: "string", enum: ["default", "urgent", "promo"] },
      },
      required: ["component", "headline"],
    },
  },
];

const response = await client.messages.create({
  model: "claude-opus-4-5",
  max_tokens: 1024,
  tools,
  messages: [{ role: "user", content: "Make the hero section more compelling for Black Friday." }],
});

// Claude returns a tool_use block — parse and execute it
const toolCall = response.content.find(b => b.type === "tool_use");
if (toolCall) {
  applyUIUpdate(toolCall.input); // your function
  console.log("Claude decided:", toolCall.input);
}`
          },
          {
            label: "Agentic loop — multi-step reasoning",
            lang: "js",
            code: `async function agentLoop(userGoal) {
  const messages = [{ role: "user", content: userGoal }];

  while (true) {
    const response = await client.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 2048,
      tools: AVAILABLE_TOOLS,
      messages,
    });

    // If model is done, return final text
    if (response.stop_reason === "end_turn") {
      return response.content.find(b => b.type === "text")?.text;
    }

    // Otherwise, execute the tool and feed result back
    const toolUse = response.content.find(b => b.type === "tool_use");
    const result  = await executeTool(toolUse.name, toolUse.input);

    messages.push({ role: "assistant", content: response.content });
    messages.push({
      role: "user",
      content: [{ type: "tool_result", tool_use_id: toolUse.id, content: String(result) }],
    });
  }
}`
          }
        ],
        tips: [
          { icon: "🏗", text: "Always stream long responses with `stream: true` — users hate blank screens." },
          { icon: "🔐", text: "Never expose your API key client-side. Use a Next.js API route or edge function as a proxy." },
          { icon: "📐", text: "Use `system` prompt for persona/constraints; keep `messages` for the conversation turn history." },
          { icon: "💰", text: "Cache repeated system prompts with prompt caching to cut costs by up to 90%." },
        ]
      },
      {
        name: "OpenAI GPT-4o / Realtime API",
        badge: "Multimodal Champion",
        badgeColor: "#74AA9C",
        logo: "🌐",
        why: "GPT-4o's Realtime API enables genuine voice-to-voice or vision-to-action demos — perfect for interviews. Being able to show a live voice conversation or screenshot-to-code pipeline proves multimodal understanding.",
        setup: [
          {
            label: "GPT-4o vision — screenshot to action",
            lang: "js",
            code: `import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Pass a screenshot, get structured instructions back
const result = await openai.chat.completions.create({
  model: "gpt-4o",
  messages: [{
    role: "user",
    content: [
      { type: "text",      text: "What bugs do you see in this UI? Return JSON." },
      { type: "image_url", image_url: { url: screenshotBase64 } },
    ],
  }],
  response_format: { type: "json_object" },
});

const bugs = JSON.parse(result.choices[0].message.content);`
          },
          {
            label: "Realtime API — voice-to-voice skeleton",
            lang: "js",
            code: `// Client-side WebSocket connection to Realtime API
const ws = new WebSocket(
  "wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview",
  ["realtime", \`openai-insecure-api-key.\${OPENAI_API_KEY}\`]
);

ws.onopen = () => {
  ws.send(JSON.stringify({
    type: "session.update",
    session: { modalities: ["text", "audio"], voice: "alloy" },
  }));
};

// Stream microphone audio → OpenAI → receive audio back
ws.onmessage = (event) => {
  const msg = JSON.parse(event.data);
  if (msg.type === "response.audio.delta") {
    playAudioChunk(atob(msg.delta)); // play PCM16 chunk
  }
};`
          }
        ],
        tips: [
          { icon: "🎙", text: "For Realtime API demos, always go through a backend relay — never expose keys in browser JS." },
          { icon: "👁", text: "Vision-to-action (screenshot → structured JSON) is a killer portfolio demo — build it." },
          { icon: "⚖️", text: "Claude is stronger for reasoning; GPT-4o is stronger for multimodal + audio. Use both in your portfolio." },
        ]
      },
      {
        name: "LangChain / LangGraph + Tavily",
        badge: "Anti-Hallucination Stack",
        badgeColor: "#F59E0B",
        logo: "🔗",
        why: "Using Tavily for AI-optimised web search solves the hallucination problem by grounding AI in real-time data. LangGraph adds stateful, multi-agent orchestration — demonstrating you can build production-grade pipelines, not just chatbots.",
        setup: [
          {
            label: "Install",
            lang: "bash",
            code: `pip install langchain langgraph tavily-python langchain-anthropic`
          },
          {
            label: "Tavily search tool — grounded AI responses",
            lang: "python",
            code: `from tavily import TavilyClient

tavily = TavilyClient(api_key=os.environ["TAVILY_API_KEY"])

# AI-optimised search — returns clean, structured results for LLM consumption
results = tavily.search(
    query="latest Stripe pricing changes 2025",
    search_depth="advanced",   # deep crawl
    include_answer=True,        # pre-summarised answer
    max_results=5,
)

print(results["answer"])       # grounded, cited answer`
          },
          {
            label: "LangGraph agent with web search tool",
            lang: "python",
            code: `from langgraph.prebuilt import create_react_agent
from langchain_anthropic import ChatAnthropic
from langchain_community.tools.tavily_search import TavilySearchResults

llm   = ChatAnthropic(model="claude-opus-4-5")
tools = [TavilySearchResults(max_results=3)]

# One line to create a stateful, tool-using agent
agent = create_react_agent(llm, tools)

response = agent.invoke({
    "messages": [("user", "What are the current Shopify API rate limits?")]
})

# Agent automatically searches → reads results → synthesises answer
print(response["messages"][-1].content)`
          },
          {
            label: "LangGraph stateful multi-step workflow",
            lang: "python",
            code: `from langgraph.graph import StateGraph, END
from typing import TypedDict

class State(TypedDict):
    query:    str
    research: str
    draft:    str
    approved: bool

def research_node(state: State) -> State:
    results = tavily.search(state["query"], include_answer=True)
    return {**state, "research": results["answer"]}

def draft_node(state: State) -> State:
    prompt  = f"Write a report based on: {state['research']}"
    content = llm.invoke(prompt).content
    return {**state, "draft": content}

def review_node(state: State) -> State:
    # Could be human-in-the-loop or another LLM
    return {**state, "approved": len(state["draft"]) > 100}

# Build the graph
graph = StateGraph(State)
graph.add_node("research", research_node)
graph.add_node("draft",    draft_node)
graph.add_node("review",   review_node)
graph.add_edge("research", "draft")
graph.add_edge("draft",    "review")
graph.add_conditional_edges("review", lambda s: END if s["approved"] else "draft")
graph.set_entry_point("research")

app = graph.compile()
result = app.invoke({"query": "2025 headless commerce trends", "approved": False})`
          }
        ],
        tips: [
          { icon: "🔍", text: "Tavily's `search_depth: 'advanced'` is slower but much more accurate for technical queries." },
          { icon: "🗺", text: "LangGraph is to LangChain what Redux is to React — use it when you have multi-step, branching agent logic." },
          { icon: "👤", text: "Human-in-the-loop (interrupt_before) is the killer LangGraph feature for demos — show it." },
        ]
      }
    ]
  },
  {
    id: "commerce",
    number: "02",
    icon: "🛒",
    label: "Headless Commerce & Fintech",
    tagline: "Separate the Brain from the Face",
    accent: "#818CF8",
    dim: "#818CF815",
    border: "#818CF830",
    intro: `For roles in digital marketing or e-commerce, demonstrating that you can decouple the presentation layer from the commerce engine is a high-value, high-salary skill. These APIs represent the gold standard of modern commerce architecture.`,
    apis: [
      {
        name: "Shopify Storefront & Admin API",
        badge: "E-Commerce Gold Standard",
        badgeColor: "#96BF48",
        logo: "🏪",
        why: "Building a headless storefront with Next.js and Shopify's GraphQL API proves you can manage complex product state, handle cart logic, and deliver sub-second page loads — a major differentiator for e-commerce roles.",
        architecture: {
          title: "Headless Commerce Architecture",
          nodes: [
            { label: "Next.js Frontend", sub: "Your UI — any design", color: "#818CF8" },
            { label: "Storefront API", sub: "GraphQL — public, read-heavy", color: "#96BF48" },
            { label: "Admin API", sub: "REST/GraphQL — privileged", color: "#F59E0B" },
            { label: "Shopify Backend", sub: "Orders, inventory, payments", color: "#94A3B8" },
          ],
          flow: "split"
        },
        setup: [
          {
            label: "Install Shopify client",
            lang: "bash",
            code: `npm install @shopify/storefront-api-client`
          },
          {
            label: "Storefront API — fetch products",
            lang: "js",
            code: `import { createStorefrontApiClient } from "@shopify/storefront-api-client";

const client = createStorefrontApiClient({
  storeDomain: process.env.SHOPIFY_STORE_DOMAIN,
  apiVersion:  "2025-01",
  publicAccessToken: process.env.SHOPIFY_STOREFRONT_TOKEN,
});

const PRODUCTS_QUERY = \`
  query GetProducts($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          title
          handle
          priceRange { minVariantPrice { amount currencyCode } }
          featuredImage { url altText }
          variants(first: 5) {
            edges { node { id title availableForSale } }
          }
        }
      }
    }
  }
\`;

const { data } = await client.request(PRODUCTS_QUERY, { variables: { first: 12 } });
const products = data.products.edges.map(e => e.node);`
          },
          {
            label: "Cart — add item & checkout",
            lang: "js",
            code: `// Create a cart
const CREATE_CART = \`
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart { id checkoutUrl }
    }
  }
\`;

const { data } = await client.request(CREATE_CART, {
  variables: {
    input: {
      lines: [{ merchandiseId: variantId, quantity: 1 }],
      buyerIdentity: { email: user.email },
    },
  },
});

// Redirect to Shopify's hosted checkout — PCI compliant, zero effort
window.location.href = data.cartCreate.cart.checkoutUrl;`
          },
          {
            label: "Admin API — create a discount (server-side only)",
            lang: "js",
            code: `// ⚠️  Admin API — NEVER run client-side, always in a server route
const response = await fetch(
  \`https://\${SHOPIFY_STORE}/admin/api/2025-01/graphql.json\`,
  {
    method:  "POST",
    headers: {
      "X-Shopify-Access-Token": process.env.SHOPIFY_ADMIN_TOKEN,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: \`
        mutation CreateDiscount($discount: DiscountCodeBasicInput!) {
          discountCodeBasicCreate(basicCodeDiscount: $discount) {
            codeDiscountNode { id }
            userErrors { field message }
          }
        }
      \`,
      variables: {
        discount: {
          title: "LAUNCH20",
          code:   "LAUNCH20",
          customerGets: {
            value: { percentage: 0.20 },
            items: { all: true },
          },
        },
      },
    }),
  }
);`
          }
        ],
        tips: [
          { icon: "🔑", text: "Storefront token is public (safe to expose). Admin token is privileged — server-side only, always." },
          { icon: "⚡", text: "Cache product queries with Next.js `revalidate` — Shopify rate limits are per-minute, not per-day." },
          { icon: "🛡", text: "Use Shopify's hosted checkout URL for payments — never build your own payment form with Storefront API." },
          { icon: "🪝", text: "Webhooks (order/fulfillment events) complete the picture — register them via Admin API." },
        ]
      },
      {
        name: "Stripe API",
        badge: "Fintech Gold Standard",
        badgeColor: "#6772E5",
        logo: "💳",
        why: "Stripe is the gold standard for proving you can handle sensitive financial data. Demonstrating Checkout Sessions, webhook signature verification, and subscription logic separates senior from junior candidates in fintech and e-commerce roles.",
        setup: [
          {
            label: "Install",
            lang: "bash",
            code: `npm install stripe @stripe/stripe-js`
          },
          {
            label: "Checkout Session — server (Next.js API route)",
            lang: "js",
            code: `// pages/api/checkout.js  (or app/api/checkout/route.js)
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const { priceId, userId } = await req.json();

  const session = await stripe.checkout.sessions.create({
    mode:        "subscription",  // or "payment" for one-off
    line_items:  [{ price: priceId, quantity: 1 }],
    success_url: \`\${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}\`,
    cancel_url:  \`\${process.env.NEXT_PUBLIC_URL}/pricing\`,
    metadata:    { userId },     // attach your own data
    customer_email: user.email,  // pre-fill the form
  });

  return Response.json({ url: session.url });
}`
          },
          {
            label: "Webhook — verify & handle events (CRITICAL)",
            lang: "js",
            code: `// app/api/webhooks/stripe/route.js
import Stripe from "stripe";
import { headers } from "next/headers";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const body      = await req.text();
  const signature = headers().get("stripe-signature");

  let event;
  try {
    // ✅ ALWAYS verify the signature — prevents replay attacks
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return new Response(\`Webhook Error: \${err.message}\`, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed":
      await activateSubscription(event.data.object.metadata.userId);
      break;
    case "customer.subscription.deleted":
      await deactivateSubscription(event.data.object.customer);
      break;
    case "invoice.payment_failed":
      await notifyPaymentFailed(event.data.object.customer_email);
      break;
  }

  return new Response("OK", { status: 200 });
}`
          },
          {
            label: "Customer Portal — self-serve billing",
            lang: "js",
            code: `// Let customers manage their own subscriptions — zero UI needed
const portalSession = await stripe.billingPortal.sessions.create({
  customer:   stripeCustomerId,
  return_url: \`\${process.env.NEXT_PUBLIC_URL}/dashboard\`,
});

// Redirect to Stripe's hosted portal
redirect(portalSession.url);`
          }
        ],
        tips: [
          { icon: "🔒", text: "Never process raw card data — always redirect to Stripe Checkout or use Stripe Elements." },
          { icon: "🪝", text: "Webhooks are not optional. `checkout.session.completed` is how you reliably confirm payment — don't use the success_url alone." },
          { icon: "🧪", text: "Use `stripe listen --forward-to localhost:3000/api/webhooks/stripe` to test webhooks locally." },
          { icon: "🗄", text: "Always store `stripeCustomerId` in your database — you'll need it for portal sessions and lookups." },
        ]
      },
      {
        name: "BigCommerce GraphQL API",
        badge: "Enterprise Alternative",
        badgeColor: "#34C5E0",
        logo: "🏢",
        why: "BigCommerce is the enterprise-tier Shopify alternative used by Toyota, Ben & Jerry's, and Sony. Demonstrating BigCommerce proves you're not locked into one ecosystem — a major signal for agency and enterprise roles.",
        setup: [
          {
            label: "Storefront GraphQL — public token",
            lang: "js",
            code: `const BIGCOMMERCE_URL   = \`https://\${process.env.BC_STORE_HASH}.mybigcommerce.com\`;
const STOREFRONT_TOKEN = process.env.BC_STOREFRONT_TOKEN;

async function bcQuery(query, variables = {}) {
  const res = await fetch(\`\${BIGCOMMERCE_URL}/graphql\`, {
    method:  "POST",
    headers: {
      "Content-Type":  "application/json",
      Authorization:   \`Bearer \${STOREFRONT_TOKEN}\`,
    },
    body: JSON.stringify({ query, variables }),
  });
  return res.json();
}

// Fetch featured products
const { data } = await bcQuery(\`
  query FeaturedProducts {
    site {
      featuredProducts {
        edges {
          node {
            name
            path
            defaultImage { url(width: 400) altText }
            prices { price { value currencyCode } }
          }
        }
      }
    }
  }
\`);`
          }
        ],
        tips: [
          { icon: "🏗", text: "BigCommerce's GraphQL has a `site {}` root — all storefront queries nest inside it." },
          { icon: "🔄", text: "BigCommerce excels at complex B2B pricing tiers and customer groups — lean into that for enterprise demos." },
          { icon: "📊", text: "Their Management API (REST) handles orders and catalog — separate from the storefront GraphQL." },
        ]
      }
    ]
  },
  {
    id: "realtime",
    number: "03",
    icon: "⚡",
    label: "Real-Time Data & Infrastructure",
    tagline: "Live Data Without Refreshing",
    accent: "#F472B6",
    dim: "#F472B615",
    border: "#F472B630",
    intro: `Hiring managers love seeing that you can handle "live" data — dashboards that update instantly, multiplayer features, and real-time analytics. These APIs prove you understand the backend as well as the frontend.`,
    apis: [
      {
        name: "Supabase",
        badge: "Firebase Killer",
        badgeColor: "#3ECF8E",
        logo: "🟢",
        why: "Supabase proves you can manage a full backend-as-a-service: Postgres database, Row Level Security, OAuth (Google/GitHub), real-time subscriptions, and edge functions — all without running your own server.",
        architecture: {
          title: "Supabase Stack",
          nodes: [
            { label: "Your App", sub: "React / Next.js", color: "#F472B6" },
            { label: "Supabase JS", sub: "Auto-generated client", color: "#3ECF8E" },
            { label: "PostgreSQL", sub: "With RLS policies", color: "#3B82F6" },
            { label: "Realtime", sub: "WebSocket changes", color: "#F59E0B" },
          ],
          flow: "stack"
        },
        setup: [
          {
            label: "Install & initialise",
            lang: "bash",
            code: `npm install @supabase/supabase-js
npm install @supabase/ssr  # for Next.js server-side`
          },
          {
            label: "Client setup + Auth (Google OAuth)",
            lang: "js",
            code: `import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Sign in with Google — one line
await supabase.auth.signInWithOAuth({
  provider: "google",
  options: { redirectTo: \`\${window.location.origin}/auth/callback\` },
});

// Get current user
const { data: { user } } = await supabase.auth.getUser();`
          },
          {
            label: "Database queries with Row Level Security",
            lang: "js",
            code: `// SELECT — RLS automatically filters to the current user's rows
const { data: posts, error } = await supabase
  .from("posts")
  .select("id, title, created_at, profiles(username, avatar_url)")
  .eq("published", true)
  .order("created_at", { ascending: false })
  .limit(20);

// INSERT — RLS enforces user_id = auth.uid() automatically
const { data, error } = await supabase
  .from("posts")
  .insert({ title: "My Post", body: "Content here", user_id: user.id })
  .select()
  .single();

// Your RLS policy in Supabase SQL editor:
// CREATE POLICY "Users can insert own posts"
// ON posts FOR INSERT WITH CHECK (user_id = auth.uid());`
          },
          {
            label: "Realtime subscriptions — live dashboard",
            lang: "js",
            code: `import { useEffect, useState } from "react";

function LiveOrderFeed() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Initial load
    supabase.from("orders").select("*").order("created_at", { ascending: false })
      .then(({ data }) => setOrders(data));

    // Subscribe to all INSERT events on the orders table
    const channel = supabase
      .channel("orders-feed")
      .on("postgres_changes",
        { event: "INSERT", schema: "public", table: "orders" },
        (payload) => {
          setOrders(prev => [payload.new, ...prev]);
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  return (
    <ul>
      {orders.map(order => <li key={order.id}>{order.customer} — {order.total}</li>)}
    </ul>
  );
}`
          }
        ],
        tips: [
          { icon: "🔐", text: "Always enable RLS on every table — default is DENY ALL. Write explicit policies for each operation." },
          { icon: "🧩", text: "Use `supabase gen types typescript` to auto-generate TypeScript types from your schema." },
          { icon: "🌍", text: "Supabase Edge Functions (Deno) are ideal for webhook handlers and background jobs." },
          { icon: "🗂", text: "Use Supabase Storage for file uploads — it integrates with the same auth + RLS system." },
        ]
      },
      {
        name: "Pusher / Ably",
        badge: "WebSocket Specialist",
        badgeColor: "#FF6B35",
        logo: "📡",
        why: "Purpose-built WebSocket services for when you need guaranteed delivery, presence channels, or truly low-latency pub/sub. Ideal for multiplayer features, live dashboards, and collaborative tools.",
        setup: [
          {
            label: "Pusher — install",
            lang: "bash",
            code: `npm install pusher pusher-js  # pusher = server, pusher-js = client`
          },
          {
            label: "Server — publish events (Next.js API route)",
            lang: "js",
            code: `import Pusher from "pusher";

const pusher = new Pusher({
  appId:   process.env.PUSHER_APP_ID,
  key:     process.env.PUSHER_KEY,
  secret:  process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS:  true,
});

// Triggered by any server event — order placed, score updated, etc.
export async function POST(req) {
  const { orderId, status } = await req.json();

  await pusher.trigger("orders-channel", "status-update", {
    orderId,
    status,
    timestamp: new Date().toISOString(),
  });

  return Response.json({ ok: true });
}`
          },
          {
            label: "Client — subscribe to channel",
            lang: "js",
            code: `import Pusher from "pusher-js";
import { useEffect, useState } from "react";

function LiveStatusBoard() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const pusher  = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
    });

    const channel = pusher.subscribe("orders-channel");

    channel.bind("status-update", (data) => {
      setEvents(prev => [data, ...prev.slice(0, 49)]); // keep last 50
    });

    return () => {
      channel.unbind_all();
      pusher.unsubscribe("orders-channel");
    };
  }, []);

  return <Feed events={events} />;
}`
          },
          {
            label: "Presence channels — see who's online",
            lang: "js",
            code: `// Server — authenticate user for presence channel
pusher.authenticate(socketId, "presence-dashboard", {
  user_id: user.id,
  user_info: { name: user.name, avatar: user.avatarUrl },
});

// Client — subscribe to presence channel
const channel = pusher.subscribe("presence-dashboard");

channel.bind("pusher:member_added",   m => addOnlineUser(m.info));
channel.bind("pusher:member_removed", m => removeOnlineUser(m.id));

// Get everyone currently online
const members = channel.members.members; // { userId: userInfo }`
          }
        ],
        tips: [
          { icon: "🆚", text: "Pusher is simpler to start with; Ably offers more guarantees (message history, fan-out at scale). Both work." },
          { icon: "🔐", text: "Private and presence channels require server-side authentication — never skip this for user data." },
          { icon: "⚡", text: "Ably's React hooks library (`@ably/react`) is the cleanest WebSocket DX available right now." },
        ]
      },
      {
        name: "Google Analytics 4 Data API",
        badge: "Marketing Dev Green Flag",
        badgeColor: "#F9AB00",
        logo: "📊",
        why: "Pulling custom GA4 metrics into a private dashboard — without relying on the GA UI — is a massive differentiator for E-commerce Coordinator and Marketing Dev roles. It proves you can bridge the marketing/engineering gap.",
        setup: [
          {
            label: "Install GA4 Data API client",
            lang: "bash",
            code: `npm install @google-analytics/data`
          },
          {
            label: "Initialise with service account (server-side only)",
            lang: "js",
            code: `import { BetaAnalyticsDataClient } from "@google-analytics/data";

// Service account JSON key — NEVER commit this to git
const analyticsClient = new BetaAnalyticsDataClient({
  credentials: {
    client_email: process.env.GA4_CLIENT_EMAIL,
    private_key:  process.env.GA4_PRIVATE_KEY.replace(/\\\\n/g, "\\n"),
  },
});

const PROPERTY_ID = process.env.GA4_PROPERTY_ID; // e.g. "123456789"`
          },
          {
            label: "Run a report — sessions by channel this month",
            lang: "js",
            code: `// app/api/analytics/route.js
export async function GET() {
  const [response] = await analyticsClient.runReport({
    property: \`properties/\${PROPERTY_ID}\`,
    dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
    dimensions: [{ name: "sessionDefaultChannelGroup" }],
    metrics: [
      { name: "sessions" },
      { name: "conversions" },
      { name: "totalRevenue" },
    ],
    orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
    limit: 10,
  });

  const rows = response.rows.map(row => ({
    channel:    row.dimensionValues[0].value,
    sessions:   Number(row.metricValues[0].value),
    conversions:Number(row.metricValues[1].value),
    revenue:    Number(row.metricValues[2].value),
  }));

  return Response.json(rows);
}`
          },
          {
            label: "Funnel report — ecommerce conversion",
            lang: "js",
            code: `const [funnelResponse] = await analyticsClient.runFunnelReport({
  property: \`properties/\${PROPERTY_ID}\`,
  dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
  funnel: {
    steps: [
      { name: "Viewed Product", filterExpression: { funnelEventFilter: { eventName: "view_item" } } },
      { name: "Added to Cart",  filterExpression: { funnelEventFilter: { eventName: "add_to_cart" } } },
      { name: "Began Checkout", filterExpression: { funnelEventFilter: { eventName: "begin_checkout" } } },
      { name: "Purchased",      filterExpression: { funnelEventFilter: { eventName: "purchase" } } },
    ],
  },
});`
          }
        ],
        tips: [
          { icon: "🔐", text: "GA4 Data API requires a Service Account with 'Viewer' role added in GA4 property settings." },
          { icon: "💾", text: "Cache GA4 responses (e.g. with Redis or Next.js `revalidate`) — the API has quota limits." },
          { icon: "🎯", text: "The ability to build a custom marketing dashboard (not just the GA UI) is a genuine 'green flag' in interviews." },
          { icon: "📅", text: "GA4 uses relative date strings like '30daysAgo', '7daysAgo', 'today' — much cleaner than epoch timestamps." },
        ]
      }
    ]
  },
  {
    id: "triplethreat",
    number: "⭐",
    icon: "🚀",
    label: "The Triple Threat Demo",
    tagline: "Maximum Portfolio Impact",
    accent: "#FFD700",
    dim: "#FFD70015",
    border: "#FFD70030",
    intro: `Combine all three tracks into a single portfolio project. This is the "nuclear option" — a demo that shows AI reasoning, real-time commerce infrastructure, and live analytics in one coherent application.`,
    triplethreat: true,
    demo: {
      title: "AI-Powered Commerce Dashboard",
      description: "A headless storefront where Claude analyses real-time sales data and suggests actions — live.",
      stack: [
        { layer: "Frontend", tech: "Next.js 14 App Router + Tailwind", color: "#61DAFB" },
        { layer: "Commerce", tech: "Shopify Storefront API (GraphQL)", color: "#96BF48" },
        { layer: "Payments", tech: "Stripe Webhooks + Checkout", color: "#6772E5" },
        { layer: "Real-Time", tech: "Supabase Realtime + Pusher", color: "#3ECF8E" },
        { layer: "AI Brain", tech: "Claude API with Tool Use", color: "#00FFB2" },
        { layer: "Analytics", tech: "GA4 Data API + Tavily Search", color: "#F9AB00" },
      ],
      features: [
        "Live order feed (Supabase Realtime) — orders appear without refresh",
        "Claude analyses the order stream and calls update_promotion() tool",
        "Tavily searches current trends to ground Claude's recommendations",
        "GA4 funnel data displayed in a custom dashboard (not the GA UI)",
        "Stripe webhooks update order status in real-time",
        "Shopify inventory checked via Admin API before Claude acts",
      ],
      wow: "The 'wow moment': Claude watches live orders, calls a tool to read GA4 funnel data, searches Tavily for current trends, then fires a Pusher event that updates the hero banner — all without a human click."
    }
  }
];

// ─── CODE BLOCK ───────────────────────────────────────────────────────────────

function CodeBlock({ label, lang, code }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const highlight = (raw) => {
    const escaped = raw
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    const tokens = [];
    // 1. Extract comments and strings into placeholders to protect them
    let processing = escaped.replace(/(\/\/.*$)|(#.*$)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/gm, (match, c1, c2) => {
      const isComment = c1 || c2;
      const type = isComment ? "cm" : "st";
      const i = tokens.length;
      tokens.push(`<span class="${type}">${match}</span>`);
      return `__TOKEN_${i}__`;
    });

    // 2. Highlight keywords, numbers and functions in the remaining text
    processing = processing
      .replace(/\b(import|export|from|const|let|var|function|return|if|else|switch|case|default|break|async|await|try|catch|throw|new|class|extends|typeof|null|undefined|true|false|of|for|while|def|print|pass|with|as)\b/g, '<span class="kw">$1</span>')
      .replace(/\b(\d+\.?\d*)\b/g, '<span class="nm">$1</span>')
      .replace(/\b(useState|useEffect|createClient|Anthropic|Stripe|Pusher|fetch|Response|Request|console)\b/g, '<span class="fn">$1</span>');

    // 3. Restore the protected tokens
    return processing.replace(/__TOKEN_(\d+)__/g, (match, i) => tokens[i]);
  };

  const LANG_COLORS = { bash: "#A3E635", js: "#F7DF1E", python: "#60A5FA", text: "#94A3B8" };

  return (
    <div style={{
      background: "#050A12",
      borderRadius: "10px",
      overflow: "hidden",
      marginTop: "14px",
      border: "1px solid #1A2540",
      boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
    }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "9px 14px",
        background: "#0A1020",
        borderBottom: "1px solid #1A2540",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ display: "flex", gap: "5px" }}>
            {["#FF5F57", "#FEBC2E", "#28C840"].map((c, i) => (
              <div key={i} style={{ width: 9, height: 9, borderRadius: "50%", background: c }} />
            ))}
          </div>
          <span style={{ color: "#4A5568", fontSize: "11px", fontFamily: "monospace" }}>{label}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{
            background: `${LANG_COLORS[lang] || "#94A3B8"}20`,
            color: LANG_COLORS[lang] || "#94A3B8",
            border: `1px solid ${LANG_COLORS[lang] || "#94A3B8"}40`,
            borderRadius: "4px", padding: "1px 7px", fontSize: "10px",
            fontFamily: "monospace", fontWeight: 700, letterSpacing: "0.05em",
          }}>{lang}</span>
          <button onClick={copy} style={{
            background: "none", border: "1px solid #1A2540", borderRadius: "5px",
            color: copied ? "#34D399" : "#4A5568", padding: "2px 9px",
            fontSize: "10px", cursor: "pointer", fontFamily: "monospace",
          }}>
            {copied ? "✓" : "copy"}
          </button>
        </div>
      </div>
      <pre style={{
        margin: 0, padding: "18px", overflowX: "auto",
        fontSize: "12.5px", lineHeight: "1.75",
        fontFamily: "'JetBrains Mono','Fira Code','Courier New',monospace",
        color: "#CDD5E0",
      }}>
        <code dangerouslySetInnerHTML={{ __html: highlight(code) }} />
      </pre>
      <style>{`
        .cm{color:#4A5568;font-style:italic}
        .kw{color:#F472B6}
        .st{color:#86EFAC}
        .nm{color:#93C5FD}
        .fn{color:#FCD34D}
      `}</style>
    </div>
  );
}

// ─── ARCH DIAGRAM ─────────────────────────────────────────────────────────────

function ArchDiagram({ architecture }) {
  const { nodes, flow, title } = architecture;
  const isLoop = flow === "loop";

  return (
    <div style={{
      background: "#050A12",
      border: "1px solid #1A2540",
      borderRadius: "12px",
      padding: "20px",
      marginTop: "16px",
    }}>
      <div style={{ color: "#4A5568", fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "16px" }}>{title}</div>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px", justifyContent: "center" }}>
        {nodes.map((node, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{
              background: `${node.color}12`,
              border: `1px solid ${node.color}40`,
              borderRadius: "10px",
              padding: "10px 16px",
              textAlign: "center",
              minWidth: "100px",
              boxShadow: `0 0 16px ${node.color}15`,
            }}>
              <div style={{ color: node.color, fontWeight: 700, fontSize: "12px" }}>{node.label}</div>
              <div style={{ color: "#374151", fontSize: "10px", marginTop: "3px" }}>{node.sub}</div>
            </div>
            {i < nodes.length - 1 && (
              <span style={{ color: "#1E293B", fontSize: "16px" }}>{isLoop ? "⟳" : "→"}</span>
            )}
          </div>
        ))}
      </div>
      {isLoop && (
        <div style={{ textAlign: "center", color: "#1E3A5F", fontSize: "10px", marginTop: "10px", letterSpacing: "0.06em" }}>
          ↺ loop continues until stop_reason = "end_turn"
        </div>
      )}
    </div>
  );
}

// ─── API CARD ────────────────────────────────────────────────────────────────

function APICard({ api, accent }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState(0);

  return (
    <div style={{
      background: "#080F1E",
      border: "1px solid #1A2540",
      borderRadius: "14px",
      overflow: "hidden",
      marginBottom: "20px",
    }}>
      {/* Header */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: "100%",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "20px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
          textAlign: "left",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <span style={{ fontSize: "24px" }}>{api.logo}</span>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
              <span style={{ color: "#F0F4FF", fontWeight: 700, fontSize: "16px", fontFamily: "'Syne', 'Georgia', serif" }}>
                {api.name}
              </span>
              <span style={{
                background: `${api.badgeColor}18`,
                color: api.badgeColor,
                border: `1px solid ${api.badgeColor}40`,
                borderRadius: "100px",
                padding: "2px 10px",
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}>{api.badge}</span>
            </div>
            <div style={{ color: "#334155", fontSize: "12px", marginTop: "4px" }}>{api.why.slice(0, 80)}…</div>
          </div>
        </div>
        <span style={{
          color: accent,
          fontSize: "18px",
          transform: open ? "rotate(180deg)" : "rotate(0deg)",
          transition: "transform 0.25s",
          flexShrink: 0,
        }}>⌄</span>
      </button>

      {open && (
        <div style={{ padding: "0 24px 24px", borderTop: "1px solid #0D1728" }}>
          {/* Why */}
          <p style={{ color: "#64748B", fontSize: "14px", lineHeight: "1.7", margin: "16px 0 20px" }}>
            {api.why}
          </p>

          {/* Architecture */}
          {api.architecture && <ArchDiagram architecture={api.architecture} />}

          {/* Code tabs */}
          {api.setup && api.setup.length > 0 && (
            <div style={{ marginTop: "20px" }}>
              <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", marginBottom: "4px" }}>
                {api.setup.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setTab(i)}
                    style={{
                      background: tab === i ? `${accent}18` : "transparent",
                      border: `1px solid ${tab === i ? `${accent}50` : "#0D1728"}`,
                      borderRadius: "6px",
                      padding: "5px 12px",
                      color: tab === i ? accent : "#334155",
                      fontSize: "11px",
                      cursor: "pointer",
                      fontFamily: "monospace",
                    }}
                  >
                    {i + 1}. {s.label.split("—")[0].trim()}
                  </button>
                ))}
              </div>
              <CodeBlock {...api.setup[tab]} />
            </div>
          )}

          {/* Tips */}
          {api.tips && (
            <div style={{ marginTop: "20px", display: "grid", gap: "8px" }}>
              <div style={{ color: "#1E3A5F", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "4px" }}>
                Pro Tips
              </div>
              {api.tips.map((tip, i) => (
                <div key={i} style={{
                  display: "flex",
                  gap: "10px",
                  padding: "10px 14px",
                  background: "#050A12",
                  border: "1px solid #0D1728",
                  borderRadius: "8px",
                  alignItems: "flex-start",
                }}>
                  <span style={{ flexShrink: 0, fontSize: "15px" }}>{tip.icon}</span>
                  <span style={{ color: "#64748B", fontSize: "13px", lineHeight: "1.6" }}>{tip.text}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── TRIPLE THREAT ────────────────────────────────────────────────────────────

function TripleThreat({ demo }) {
  return (
    <div style={{ padding: "24px 0" }}>
      {/* Stack */}
      <div style={{ marginBottom: "32px" }}>
        <div style={{ color: "#4A5568", fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "14px" }}>
          Full Stack
        </div>
        <div style={{ display: "grid", gap: "6px" }}>
          {demo.stack.map((s, i) => (
            <div key={i} style={{
              display: "flex",
              gap: "16px",
              padding: "12px 16px",
              background: `${s.color}08`,
              borderLeft: `3px solid ${s.color}60`,
              borderRadius: "0 8px 8px 0",
              alignItems: "center",
            }}>
              <div style={{ color: s.color, fontWeight: 700, fontSize: "12px", minWidth: "90px", fontFamily: "monospace" }}>{s.layer}</div>
              <div style={{ color: "#4A5568", fontSize: "13px" }}>{s.tech}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div style={{ marginBottom: "32px" }}>
        <div style={{ color: "#4A5568", fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "14px" }}>
          What It Demonstrates
        </div>
        <div style={{ display: "grid", gap: "8px" }}>
          {demo.features.map((f, i) => (
            <div key={i} style={{
              display: "flex", gap: "10px", color: "#64748B", fontSize: "13px", lineHeight: "1.5"
            }}>
              <span style={{ color: "#FFD700", flexShrink: 0 }}>›</span>
              {f}
            </div>
          ))}
        </div>
      </div>

      {/* WOW */}
      <div style={{
        background: "#0D0A00",
        border: "1px solid #FFD70030",
        borderRadius: "12px",
        padding: "20px",
        boxShadow: "0 0 40px #FFD70010",
      }}>
        <div style={{ color: "#FFD700", fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "10px" }}>
          ⭐ The "Wow Moment"
        </div>
        <p style={{ color: "#A78B4A", fontSize: "14px", lineHeight: "1.75", margin: 0 }}>
          {demo.wow}
        </p>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

export default function APISkillsCourse() {
  const [activeId, setActiveId] = useState("ai");
  const contentRef = useRef(null);

  const track = TRACKS.find(t => t.id === activeId);

  const handleNav = (id) => {
    setActiveId(id);
    if (contentRef.current) contentRef.current.scrollTop = 0;
  };

  return (
    <div style={{
      display: "flex",
      height: "100vh",
      background: "#030810",
      fontFamily: "'DM Sans','Segoe UI',system-ui,sans-serif",
      color: "#E2E8F0",
      overflow: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@400;500;600&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse  { 0%,100%{opacity:0.4} 50%{opacity:1} }
        ::-webkit-scrollbar{width:5px}
        ::-webkit-scrollbar-track{background:#050A12}
        ::-webkit-scrollbar-thumb{background:#1A2540;border-radius:3px}
        .nav-item:hover{background:#080F1E !important}
      `}</style>

      {/* ── SIDEBAR ── */}
      <nav style={{
        width: "240px",
        minWidth: "240px",
        background: "#050A12",
        borderRight: "1px solid #0D1728",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}>
        {/* Logo */}
        <div style={{
          padding: "22px 18px 18px",
          borderBottom: "1px solid #0D1728",
        }}>
          <div style={{
            display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px"
          }}>
            <div style={{
              width: 28, height: 28,
              background: "linear-gradient(135deg, #00FFB2, #818CF8)",
              borderRadius: "7px",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "14px"
            }}>⚡</div>
            <span style={{ color: "#F0F4FF", fontWeight: 800, fontSize: "14px", fontFamily: "'Syne',serif", letterSpacing: "-0.02em" }}>
              High-Value APIs
            </span>
          </div>
          <div style={{ color: "#1E3A5F", fontSize: "10px", letterSpacing: "0.08em", textTransform: "uppercase", paddingLeft: "38px" }}>
            2025 Reference Manual
          </div>
        </div>

        {/* Nav */}
        <div style={{ flex: 1, overflowY: "auto", padding: "12px 10px" }}>
          {TRACKS.map(t => (
            <button
              key={t.id}
              className="nav-item"
              onClick={() => handleNav(t.id)}
              style={{
                width: "100%",
                background: activeId === t.id ? "#080F1E" : "transparent",
                border: "none",
                borderRadius: "8px",
                padding: "11px 12px",
                cursor: "pointer",
                textAlign: "left",
                marginBottom: "3px",
                display: "flex",
                gap: "10px",
                alignItems: "center",
                position: "relative",
              }}
            >
              {activeId === t.id && (
                <div style={{
                  position: "absolute", left: 0, top: "8px", bottom: "8px",
                  width: "3px", background: t.accent, borderRadius: "0 2px 2px 0",
                  boxShadow: `0 0 8px ${t.accent}`,
                }} />
              )}
              <span style={{ fontSize: "18px", flexShrink: 0 }}>{t.icon}</span>
              <div>
                <div style={{
                  color: activeId === t.id ? "#F0F4FF" : "#334155",
                  fontSize: "12px",
                  fontWeight: activeId === t.id ? 700 : 400,
                  lineHeight: "1.3",
                  fontFamily: "'Syne',serif"
                }}>{t.label}</div>
                <div style={{ color: "#1A2540", fontSize: "10px" }}>{t.tagline}</div>
              </div>
              <div style={{
                marginLeft: "auto",
                color: t.accent,
                fontSize: "10px",
                fontFamily: "monospace",
                opacity: activeId === t.id ? 1 : 0.3,
              }}>{t.number}</div>
            </button>
          ))}
        </div>

        <div style={{ padding: "14px 18px", borderTop: "1px solid #0D1728", color: "#1A2540", fontSize: "10px", lineHeight: "1.6" }}>
          <div>Claude API · Stripe · Shopify</div>
          <div>Supabase · GA4 · Pusher · Tavily</div>
        </div>
      </nav>

      {/* ── CONTENT ── */}
      <main
        ref={contentRef}
        key={activeId}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "44px 52px",
          animation: "fadeUp 0.3s ease-out",
          maxWidth: "880px",
        }}
      >
        {/* Track header */}
        <div style={{ marginBottom: "36px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
            <div style={{
              background: track.dim,
              border: `1px solid ${track.border}`,
              borderRadius: "100px",
              padding: "4px 14px",
              color: track.accent,
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}>
              <span style={{ animation: "pulse 2s infinite" }}>●</span>
              Track {track.number}
            </div>
          </div>

          <h1 style={{
            fontSize: "clamp(26px, 4vw, 38px)",
            fontWeight: 800,
            color: "#F0F4FF",
            margin: "0 0 6px",
            fontFamily: "'Syne',serif",
            letterSpacing: "-0.03em",
            lineHeight: "1.1"
          }}>
            {track.icon} {track.label}
          </h1>
          <div style={{ color: track.accent, fontSize: "14px", fontWeight: 500, marginBottom: "14px" }}>
            {track.tagline}
          </div>
          <p style={{ color: "#4A5568", fontSize: "14px", lineHeight: "1.75", maxWidth: "680px", margin: 0 }}>
            {track.intro}
          </p>
          <div style={{
            height: "2px",
            width: "50px",
            background: `linear-gradient(90deg, ${track.accent}, transparent)`,
            marginTop: "20px",
            borderRadius: "1px",
            boxShadow: `0 0 10px ${track.accent}`,
          }} />
        </div>

        {/* APIs */}
        {track.apis && track.apis.map((api, i) => (
          <APICard key={i} api={api} accent={track.accent} />
        ))}

        {/* Triple Threat special */}
        {track.triplethreat && <TripleThreat demo={track.demo} />}

        {/* Prev / Next */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "56px",
          paddingTop: "20px",
          borderTop: "1px solid #0D1728",
        }}>
          {(() => {
            const idx = TRACKS.findIndex(t => t.id === activeId);
            const prev = TRACKS[idx - 1];
            const next = TRACKS[idx + 1];
            return (
              <>
                {prev ? (
                  <button onClick={() => handleNav(prev.id)} style={{
                    background: "#080F1E", border: "1px solid #1A2540", borderRadius: "8px",
                    padding: "10px 18px", color: "#4A5568", cursor: "pointer",
                    fontSize: "12px", display: "flex", alignItems: "center", gap: "8px",
                    fontFamily: "'DM Sans',sans-serif",
                  }}>← {prev.label}</button>
                ) : <div />}
                {next && (
                  <button onClick={() => handleNav(next.id)} style={{
                    background: next.dim, border: `1px solid ${next.border}`,
                    borderRadius: "8px", padding: "10px 18px", color: next.accent,
                    cursor: "pointer", fontSize: "12px", fontWeight: 700,
                    display: "flex", alignItems: "center", gap: "8px",
                    fontFamily: "'DM Sans',sans-serif",
                    boxShadow: `0 0 16px ${next.accent}15`,
                  }}>
                    {next.label} →
                  </button>
                )}
              </>
            );
          })()}
        </div>
      </main>
    </div>
  );
}
