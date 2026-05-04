import { useState } from "react";

// ─── PACKAGE DATA ──────────────────────────────────────────────────────────────

const PACKAGES = [
  {
    id: "react",
    name: "react",
    type: "dependency",
    emoji: "⚛️",
    tagline: "The UI library itself",
    accent: "#61DAFB",
    version: "^19",
    what: "React is the core library. It gives you components, JSX, hooks, and the reconciler that figures out what changed in your UI. You never import from 'react-dom' for logic — this package is your mental model.",
    sections: [
      {
        title: "Core Hooks Cheatsheet",
        snippets: [
          {
            label: "useState — local state",
            code: `import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(c => c + 1)}>
      Clicked {count} times
    </button>
  );
}`
          },
          {
            label: "useEffect — side effects",
            code: `import { useEffect, useState } from 'react';

function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetch(\`/api/users/\${userId}\`)
      .then(r => r.json())
      .then(data => { if (!cancelled) setUser(data); });
    return () => { cancelled = true; }; // cleanup!
  }, [userId]); // re-runs when userId changes

  return <div>{user?.name ?? 'Loading…'}</div>;
}`
          },
          {
            label: "useContext — consume shared state",
            code: `import { createContext, useContext, useState } from 'react';

type Theme = 'light' | 'dark';
const ThemeCtx = createContext<Theme>('light');

// Wrap your app (or a subtree) with the provider
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');
  return <ThemeCtx.Provider value={theme}>{children}</ThemeCtx.Provider>;
}

// Consume anywhere — no prop drilling
function Button() {
  const theme = useContext(ThemeCtx);
  return <button className={\`btn btn--\${theme}\`}>Click</button>;
}`
          },
          {
            label: "useRef — DOM access & stable values",
            code: `import { useRef, useEffect } from 'react';

function AutoFocus() {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus(); // direct DOM access
  }, []);

  return <input ref={inputRef} placeholder="auto-focused on mount" />;
}`
          },
          {
            label: "useMemo & useCallback — performance",
            code: `import { useMemo, useCallback } from 'react';

function ProductList({ products, onSelect }: Props) {
  // Recomputed only when products changes
  const sorted = useMemo(
    () => [...products].sort((a, b) => a.price - b.price),
    [products]
  );

  // Stable reference — prevents child re-renders
  const handleClick = useCallback(
    (id: string) => onSelect(id),
    [onSelect]
  );

  return sorted.map(p => <Item key={p.id} product={p} onClick={handleClick} />);
}`
          },
          {
            label: "Custom hook — extract reusable logic",
            code: `import { useState, useEffect } from 'react';

// Prefix with 'use' — that's what makes it a hook
function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}

// Usage
function Search() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 400);

  useEffect(() => {
    if (debouncedQuery) fetchResults(debouncedQuery);
  }, [debouncedQuery]);
}`
          },
        ],
        tips: [
          "Always use the functional update form setCount(c => c + 1) when new state depends on old state.",
          "useEffect cleanup (return a function) prevents memory leaks and stale updates.",
          "Don't call hooks inside loops, conditions, or nested functions — React depends on hook call order.",
        ]
      }
    ]
  },
  {
    id: "react-dom",
    name: "react-dom",
    type: "dependency",
    emoji: "🌐",
    tagline: "React ↔ Browser bridge",
    accent: "#61DAFB",
    version: "^19",
    what: "react-dom is the renderer that connects React's virtual tree to the real browser DOM. In Next.js you rarely touch it directly — but understanding it explains how hydration, portals, and the root work.",
    sections: [
      {
        title: "What you actually use it for",
        snippets: [
          {
            label: "createRoot — entry point (main.tsx)",
            code: `import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// This is how React attaches to the DOM
// Next.js does this for you — but understand it!
const root = createRoot(document.getElementById('root')!);
root.render(<App />);`
          },
          {
            label: "createPortal — render outside component tree",
            code: `import { createPortal } from 'react-dom';

// Renders children into a different DOM node (e.g. body)
// Perfect for modals, tooltips, popovers — avoids z-index/overflow issues
function Modal({ children, onClose }: ModalProps) {
  return createPortal(
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    document.body // mount target
  );
}`
          },
          {
            label: "useFormStatus — React 19 form hook (from react-dom)",
            code: `import { useFormStatus } from 'react-dom';

// Must be used inside a <form> component
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Saving…' : 'Save Changes'}
    </button>
  );
}

function ProfileForm() {
  return (
    <form action={updateProfileAction}>
      <input name="name" />
      <SubmitButton /> {/* knows when the form is submitting */}
    </form>
  );
}`
          },
        ],
        tips: [
          "In Next.js 14+, you never call createRoot — the framework handles it. But you will use createPortal for modals.",
          "react-dom/server exports renderToString and renderToReadableStream — used internally by Next.js for SSR.",
          "useFormStatus is a React 19 gem — replaces manual loading state in form submit handlers.",
        ]
      }
    ]
  },
  {
    id: "tailwindcss",
    name: "tailwindcss",
    type: "devDependency",
    emoji: "🎨",
    tagline: "Utility-first CSS framework",
    accent: "#38BDF8",
    version: "^3 / ^4",
    what: "Tailwind gives you composable, single-purpose CSS classes. Instead of writing .card { padding: 16px; background: white; } you write className=\"p-4 bg-white\". The result is faster iteration, zero dead CSS in production, and a design system built in.",
    sections: [
      {
        title: "Setup & Configuration",
        snippets: [
          {
            label: "tailwind.config.ts — extend the theme",
            code: `import type { Config } from 'tailwindcss';

const config: Config = {
  // Tell Tailwind where to look for class names
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Add custom design tokens
      colors: {
        brand: {
          50:  '#f0f9ff',
          500: '#0ea5e9',
          900: '#0c4a6e',
        },
      },
      fontFamily: {
        display: ['var(--font-cal)', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),  // prose classes
    require('@tailwindcss/forms'),        // form reset + styling
  ],
};

export default config;`
          },
          {
            label: "globals.css — base layer + CSS variables",
            code: `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --radius: 0.5rem;
  }

  /* Smooth font rendering */
  body {
    @apply antialiased text-gray-900 bg-white dark:bg-gray-950 dark:text-gray-100;
  }
}

/* Component layer — reusable multi-class abstractions */
@layer components {
  .btn-primary {
    @apply inline-flex items-center gap-2 px-4 py-2 rounded-lg
           bg-blue-600 text-white font-medium text-sm
           hover:bg-blue-700 active:scale-95
           transition-all duration-150 disabled:opacity-50;
  }

  .card {
    @apply bg-white dark:bg-gray-900 rounded-xl border border-gray-200
           dark:border-gray-800 shadow-sm p-6;
  }
}`
          },
          {
            label: "Responsive + dark mode + state variants",
            code: `// Tailwind's variant system is the real power
function Card({ featured }: { featured: boolean }) {
  return (
    <div
      className={\`
        p-4 rounded-xl border transition-all duration-200
        bg-white dark:bg-gray-900
        border-gray-200 dark:border-gray-700
        hover:shadow-lg hover:-translate-y-0.5
        sm:p-6 lg:p-8
        \${featured ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
      \`}
    >
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
        Card Title
      </h2>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 line-clamp-3">
        This text is clamped to 3 lines on overflow.
      </p>
      <button className="mt-4 btn-primary w-full sm:w-auto">
        Get Started
      </button>
    </div>
  );
}`
          },
          {
            label: "cn() utility — conditional classes without mess",
            code: `// Install: npm install clsx tailwind-merge
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// This is THE standard utility in every serious Next.js project
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Usage — merges correctly, removes conflicts
function Button({ className, variant = 'default', ...props }) {
  return (
    <button
      className={cn(
        'px-4 py-2 rounded-lg font-medium transition-colors',
        variant === 'default' && 'bg-gray-900 text-white hover:bg-gray-700',
        variant === 'outline' && 'border border-gray-300 hover:bg-gray-50',
        variant === 'ghost'   && 'hover:bg-gray-100',
        className // consumer can override
      )}
      {...props}
    />
  );
}`
          },
        ],
        tips: [
          "Use the cn() helper (clsx + tailwind-merge) for any dynamic className logic — it handles conflicts correctly.",
          "Group related utilities with a template literal and a line break per concern: layout / spacing / typography / color / state.",
          "Tailwind v4 drops tailwind.config.ts in favour of CSS-based config — check which version your project uses.",
        ]
      }
    ]
  },
  {
    id: "postcss",
    name: "@tailwindcss/postcss",
    type: "devDependency",
    emoji: "⚙️",
    tagline: "CSS build pipeline",
    accent: "#DD3A0A",
    version: "^4",
    what: "PostCSS is a tool that transforms CSS using JavaScript plugins. Tailwind runs as a PostCSS plugin, which means it processes your @tailwind directives and generates the utility classes at build time. You rarely edit this directly — but knowing what it does stops you from being scared of it.",
    sections: [
      {
        title: "Configuration",
        snippets: [
          {
            label: "postcss.config.mjs — standard Next.js setup",
            code: `/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    // Tailwind v3 — classic setup
    tailwindcss: {},
    autoprefixer: {},

    // Tailwind v4 uses a unified plugin
    // '@tailwindcss/postcss': {},
  },
};

export default config;`
          },
          {
            label: "Adding other PostCSS plugins",
            code: `// postcss.config.mjs
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},

    // Minify CSS in production only
    ...(process.env.NODE_ENV === 'production'
      ? { cssnano: { preset: 'default' } }
      : {}),

    // Nest CSS like Sass (optional, modern browsers support native nesting)
    // 'postcss-nesting': {},
  },
};

export default config;`
          },
        ],
        tips: [
          "You almost never need to change postcss.config.mjs in a Next.js + Tailwind project.",
          "If Tailwind classes aren't applying, check that postcss.config.mjs is at the root and the plugin name matches your Tailwind version.",
          "Tailwind v4 ships its own postcss plugin (@tailwindcss/postcss) — the setup differs from v3.",
        ]
      }
    ]
  },
  {
    id: "types-node",
    name: "@types/node",
    type: "devDependency",
    emoji: "🔷",
    tagline: "TypeScript types for Node.js",
    accent: "#68A063",
    version: "^20",
    what: "This package gives TypeScript full knowledge of Node.js built-ins: process.env, Buffer, fs, path, URL, etc. Without it, accessing process.env.MY_VAR in a Next.js API route would give a TypeScript error.",
    sections: [
      {
        title: "What it unlocks",
        snippets: [
          {
            label: "process.env — typed environment variables",
            code: `// Without @types/node: TS error "Cannot find name 'process'"
// With @types/node: fully typed

// Best practice: create a typed env helper
// lib/env.ts
function getEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(\`Missing env var: \${key}\`);
  return value;
}

export const env = {
  DATABASE_URL:    getEnv('DATABASE_URL'),
  STRIPE_SECRET:   getEnv('STRIPE_SECRET_KEY'),
  OPENAI_API_KEY:  getEnv('OPENAI_API_KEY'),
} as const;

// Usage — throws at startup if missing, never at runtime
import { env } from '@/lib/env';
const stripe = new Stripe(env.STRIPE_SECRET);`
          },
          {
            label: "Path utilities in Next.js config",
            code: `// next.config.ts — needs @types/node for path
import type { NextConfig } from 'next';
import path from 'path'; // ← needs @types/node

const config: NextConfig = {
  webpack(webpackConfig) {
    webpackConfig.resolve.alias['@'] = path.resolve(__dirname, 'src');
    return webpackConfig;
  },
};

export default config;`
          },
          {
            label: "Node globals in scripts / API routes",
            code: `// API route — Node.js globals are fully typed
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  // process, Buffer, __dirname etc. all typed
  const nodeVersion = process.version;       // string
  const platform    = process.platform;      // NodeJS.Platform
  const memUsage    = process.memoryUsage(); // NodeJS.MemoryUsage

  return NextResponse.json({ nodeVersion, platform });
}`
          },
        ],
        tips: [
          "Match @types/node version to your actual Node.js version: @types/node@20 for Node 20.",
          "You don't need to import @types/node — TypeScript picks it up automatically from tsconfig.",
          "Use the typed env pattern above instead of asserting process.env.FOO! everywhere.",
        ]
      }
    ]
  },
  {
    id: "types-react",
    name: "@types/react",
    type: "devDependency",
    emoji: "🔷",
    tagline: "TypeScript types for React",
    accent: "#61DAFB",
    version: "^19",
    what: "This package provides TypeScript definitions for everything in the react package: component types, event types, hook return types, JSX intrinsics. It's the reason you get autocomplete on onClick, onChange, and all HTML attributes.",
    sections: [
      {
        title: "Essential React TypeScript patterns",
        snippets: [
          {
            label: "Typing component props",
            code: `import type { ReactNode, HTMLAttributes } from 'react';

// ✅ Use 'type' for props — not 'interface' (either works, but type is conventional)
type ButtonProps = {
  label:     string;
  variant?:  'primary' | 'secondary' | 'ghost';
  loading?:  boolean;
  onClick?:  () => void;
  children?: ReactNode; // anything renderable
} & HTMLAttributes<HTMLButtonElement>; // forward native button attrs

function Button({ label, variant = 'primary', loading, children, ...rest }: ButtonProps) {
  return (
    <button disabled={loading} {...rest}>
      {children ?? label}
    </button>
  );
}`
          },
          {
            label: "Typing events",
            code: `import type { ChangeEvent, FormEvent, MouseEvent, KeyboardEvent } from 'react';

function Form() {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value); // string — fully typed
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    console.log(data.get('email')); // FormDataEntryValue
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') submit();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" onChange={handleChange} onKeyDown={handleKeyDown} />
    </form>
  );
}`
          },
          {
            label: "Typing refs and forwardRef",
            code: `import { forwardRef, useRef, useImperativeHandle } from 'react';
import type { Ref } from 'react';

type InputHandle = { focus: () => void; clear: () => void };
type InputProps  = { placeholder?: string };

const FancyInput = forwardRef<InputHandle, InputProps>(
  ({ placeholder }, ref) => {
    const innerRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
      focus: () => innerRef.current?.focus(),
      clear: () => { if (innerRef.current) innerRef.current.value = ''; },
    }));

    return <input ref={innerRef} placeholder={placeholder} />;
  }
);

// Parent usage
function Parent() {
  const inputRef = useRef<InputHandle>(null);
  return (
    <>
      <FancyInput ref={inputRef} placeholder="type here" />
      <button onClick={() => inputRef.current?.focus()}>Focus</button>
    </>
  );
}`
          },
          {
            label: "ComponentProps & ElementRef utilities",
            code: `import type { ComponentProps, ElementRef } from 'react';

// Extend or pick from an existing component's props
type MyButtonProps = ComponentProps<'button'> & {
  loading?: boolean;
};

// Get the ref type of any element
type DivRef   = ElementRef<'div'>;          // HTMLDivElement
type InputRef = ElementRef<'input'>;         // HTMLInputElement
type SVGRef   = ElementRef<typeof MyIcon>;   // the ref type of MyIcon`
          },
        ],
        tips: [
          "Prefer ReactNode for children — it accepts strings, JSX, null, arrays. ReactElement is more restrictive.",
          "Use ComponentProps<'button'> to inherit all native HTML button props — saves repeating type, disabled, className etc.",
          "React 19 dropped the need for explicit children in FC — but still type it explicitly for clarity.",
        ]
      }
    ]
  },
  {
    id: "types-react-dom",
    name: "@types/react-dom",
    type: "devDependency",
    emoji: "🔷",
    tagline: "TypeScript types for react-dom",
    accent: "#61DAFB",
    version: "^19",
    what: "Provides TypeScript types for the react-dom package: createRoot, createPortal, useFormStatus, flushSync. Small package but required for TypeScript to understand react-dom imports without errors.",
    sections: [
      {
        title: "When you'll use it",
        snippets: [
          {
            label: "Typed form actions with useFormState (React 19)",
            code: `'use client';
import { useActionState } from 'react'; // React 19 — moved from react-dom
import { useFormStatus } from 'react-dom';

type State = { error: string | null; success: boolean };

async function loginAction(prevState: State, formData: FormData): Promise<State> {
  const email    = formData.get('email') as string;
  const password = formData.get('password') as string;

  const res = await signIn(email, password);
  if (!res.ok) return { error: res.error, success: false };
  return { error: null, success: true };
}

function LoginForm() {
  const [state, action] = useActionState(loginAction, { error: null, success: false });

  return (
    <form action={action}>
      <input name="email"    type="email"    required />
      <input name="password" type="password" required />
      {state.error && <p className="text-red-500">{state.error}</p>}
      <SubmitBtn />
    </form>
  );
}

function SubmitBtn() {
  const { pending } = useFormStatus(); // needs @types/react-dom
  return <button type="submit" disabled={pending}>{pending ? '…' : 'Sign In'}</button>;
}`
          },
        ],
        tips: [
          "You don't configure this package — just install it. TypeScript uses it automatically.",
          "In React 19, useFormState moved to react (as useActionState). useFormStatus stayed in react-dom.",
        ]
      }
    ]
  },
  {
    id: "eslint",
    name: "eslint",
    type: "devDependency",
    emoji: "🔍",
    tagline: "JavaScript / TypeScript linter",
    accent: "#4B32C3",
    version: "^9",
    what: "ESLint statically analyses your code to find problems: unused variables, missing dependencies in useEffect, potential type errors, accessibility violations, and more. It's the difference between catching bugs in the editor vs. in production.",
    sections: [
      {
        title: "Configuration (ESLint v9 flat config)",
        snippets: [
          {
            label: "eslint.config.mjs — Next.js + TypeScript",
            code: `import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

/** @type {import('eslint').Linter.Config[]} */
const eslintConfig = [
  // Next.js recommended rules (includes React + accessibility)
  ...compat.extends('next/core-web-vitals', 'next/typescript'),

  {
    rules: {
      // Enforce consistent imports
      'import/order': ['warn', {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling'],
        'newlines-between': 'always',
      }],

      // Prevent accidental 'any'
      '@typescript-eslint/no-explicit-any': 'warn',

      // Unused vars — error on variables, warn on args
      '@typescript-eslint/no-unused-vars': ['error', {
        vars: 'all',
        args: 'after-used',
        ignoreRestSiblings: true,
      }],

      // React 17+ — no need to import React for JSX
      'react/react-in-jsx-scope': 'off',

      // Allow console.warn and console.error in production
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
];

export default eslintConfig;`
          },
          {
            label: ".eslintignore — skip generated files",
            code: `# Don't lint these
.next/
node_modules/
public/
dist/
out/
*.min.js
coverage/`
          },
          {
            label: "package.json scripts",
            code: `{
  "scripts": {
    "lint":       "next lint",
    "lint:fix":   "next lint --fix",
    "lint:check": "eslint . --max-warnings 0"
    // lint:check — fails CI if any warnings exist
  }
}`
          },
          {
            label: "Inline disable comments — use sparingly",
            code: `// Disable for one line
const data = JSON.parse(rawInput); // eslint-disable-line @typescript-eslint/no-unsafe-assignment

// Disable for a block
/* eslint-disable no-console */
console.log('debug info');
console.log('more debug');
/* eslint-enable no-console */

// Disable for a whole file (top of file)
/* eslint-disable @typescript-eslint/no-explicit-any */`
          },
        ],
        tips: [
          "ESLint v9 uses 'flat config' (eslint.config.mjs) — the old .eslintrc.json is deprecated. Next.js handles migration.",
          "Run npx eslint --print-config path/to/file.ts to see every rule active for a specific file.",
          "Install the ESLint VS Code extension and set editor.codeActionsOnSave to run eslint fix on save.",
          "next lint is a wrapper around eslint that applies Next.js-specific rules automatically.",
        ]
      }
    ]
  },
  {
    id: "eslint-config-next",
    name: "eslint-config-next",
    type: "devDependency",
    emoji: "▲",
    tagline: "Next.js ESLint ruleset",
    accent: "#FFFFFF",
    version: "^15",
    what: "This is Vercel's curated ESLint config for Next.js projects. It bundles rules for React hooks, accessibility (jsx-a11y), Next.js-specific patterns (no img tag, use next/image), and TypeScript. It's what powers next lint.",
    sections: [
      {
        title: "What rules it enforces",
        snippets: [
          {
            label: "next/core-web-vitals — strictest preset",
            code: `// These rules are enforced by 'next/core-web-vitals':

// ❌ ESLint error — use next/image instead
<img src="/hero.jpg" alt="hero" />

// ✅ Correct
import Image from 'next/image';
<Image src="/hero.jpg" alt="hero" width={1200} height={600} />

// ❌ ESLint error — use next/link
<a href="/about">About</a>

// ✅ Correct
import Link from 'next/link';
<Link href="/about">About</Link>

// ❌ ESLint error — use next/head or metadata API
import { Head } from 'next/document';

// ❌ ESLint error — sync scripts in _document
<script src="..." />

// ✅ Correct
import Script from 'next/script';
<Script src="..." strategy="lazyOnload" />`
          },
          {
            label: "React Hooks rules it enforces",
            code: `// ❌ Error — hooks can't be called conditionally
function Bad({ show }: { show: boolean }) {
  if (show) {
    const [x] = useState(0); // rules-of-hooks violation!
  }
}

// ✅ Correct — always call hooks at top level
function Good({ show }: { show: boolean }) {
  const [x] = useState(0);
  if (!show) return null;
  return <div>{x}</div>;
}

// ❌ Warning — missing dependency in useEffect
useEffect(() => {
  fetchData(userId); // userId not in deps!
}, []); // eslint will flag this

// ✅ Correct
useEffect(() => {
  fetchData(userId);
}, [userId]);`
          },
          {
            label: "Accessibility rules (jsx-a11y)",
            code: `// ❌ Error — img missing alt
<img src="/photo.jpg" />

// ✅ Correct
<img src="/photo.jpg" alt="Description of photo" />
<img src="/decorative.jpg" alt="" />  // empty alt for decorative images

// ❌ Error — click handler without keyboard support
<div onClick={handleClick}>Click me</div>

// ✅ Correct — use a button, or add role + keyboard handler
<button onClick={handleClick}>Click me</button>

// ❌ Error — anchor with no content
<a href="/page"></a>

// ✅ Correct
<a href="/page">Go to page</a>
<a href="/page" aria-label="Go to settings page"><SettingsIcon /></a>`
          },
        ],
        tips: [
          "Use 'next/core-web-vitals' (stricter) over 'next' (looser) — it catches more performance issues.",
          "The no-img-element rule exists because next/image auto-optimises, lazy-loads, and prevents layout shift.",
          "jsx-a11y rules are not optional polish — they're legal requirements (WCAG) for many businesses.",
        ]
      }
    ]
  },
  {
    id: "typescript",
    name: "typescript",
    type: "devDependency",
    emoji: "🔷",
    tagline: "Typed JavaScript superset",
    accent: "#3178C6",
    version: "^5",
    what: "TypeScript adds static types to JavaScript. It catches bugs before runtime, powers autocomplete in VS Code, and makes large codebases maintainable. In Next.js, TypeScript is first-class — tsconfig.json is auto-generated and the compiler runs with next build.",
    sections: [
      {
        title: "tsconfig.json & everyday patterns",
        snippets: [
          {
            label: "tsconfig.json — recommended Next.js setup",
            code: `{
  "compilerOptions": {
    "target":     "ES2017",
    "lib":        ["dom", "dom.iterable", "esnext"],
    "allowJs":    true,
    "skipLibCheck": true,
    "strict":     true,       // ← ALWAYS enable strict mode
    "noEmit":     true,
    "esModuleInterop": true,
    "module":        "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules":  true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]      // ← alias: import from '@/components/...'
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}`
          },
          {
            label: "Utility types — the ones you'll actually use",
            code: `// Partial — make all properties optional
type UserUpdate = Partial<User>;  // { name?: string; email?: string; ... }

// Required — make all properties required
type StrictConfig = Required<Config>;

// Pick — select specific properties
type UserPreview = Pick<User, 'id' | 'name' | 'avatar'>;

// Omit — exclude specific properties
type UserWithoutPassword = Omit<User, 'password' | 'salt'>;

// Record — typed dictionary
type RolePermissions = Record<'admin' | 'user' | 'guest', string[]>;

// ReturnType — infer the return type of a function
type ApiResponse = ReturnType<typeof fetchUser>; // Promise<User>

// Awaited — unwrap a Promise
type User = Awaited<ReturnType<typeof fetchUser>>; // User

// Parameters — get function parameter types
type FetchParams = Parameters<typeof fetch>; // [input: RequestInfo, init?: RequestInit]`
          },
          {
            label: "Discriminated unions — type-safe state",
            code: `// Model all possible states explicitly — no 'undefined' surprises
type FetchState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error';   error: string };

function DataView({ state }: { state: FetchState<User> }) {
  // TypeScript narrows the type automatically in each branch
  switch (state.status) {
    case 'idle':    return <div>Start a search</div>;
    case 'loading': return <Spinner />;
    case 'success': return <UserCard user={state.data} />; // data is typed as User ✅
    case 'error':   return <Alert message={state.error} />;
  }
}`
          },
          {
            label: "Generics — reusable typed components",
            code: `// A generic API response wrapper
type ApiResult<T> = {
  data:    T | null;
  error:   string | null;
  loading: boolean;
};

// A generic table component — works with any data shape
type Column<T> = {
  key:    keyof T;
  header: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
};

function Table<T extends { id: string | number }>({
  data,
  columns,
}: {
  data:    T[];
  columns: Column<T>[];
}) {
  return (
    <table>
      <thead>
        <tr>{columns.map(col => <th key={String(col.key)}>{col.header}</th>)}</tr>
      </thead>
      <tbody>
        {data.map(row => (
          <tr key={row.id}>
            {columns.map(col => (
              <td key={String(col.key)}>
                {col.render ? col.render(row[col.key], row) : String(row[col.key])}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}`
          },
          {
            label: "Type guards — narrow unknown types safely",
            code: `// Type guard — tells TypeScript what something is
function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id'    in value &&
    'email' in value
  );
}

// Usage
async function getUser(id: string): Promise<User> {
  const res  = await fetch(\`/api/users/\${id}\`);
  const data: unknown = await res.json();

  if (!isUser(data)) {
    throw new Error('Invalid user response from API');
  }

  return data; // TypeScript knows this is User ✅
}`
          },
        ],
        tips: [
          "Always enable strict mode — it catches null/undefined bugs that account for most runtime errors.",
          "Use 'as const' on static data objects to get literal types: const dir = ['asc', 'desc'] as const.",
          "Avoid 'as Type' assertions — they bypass the type checker. Use type guards or zod validation instead.",
          "Use 'satisfies' (TS 4.9+) to validate a value matches a type while keeping its literal type: const config = { ... } satisfies Config.",
        ]
      }
    ]
  },
];

// ─── HELPER: SYNTAX HIGHLIGHT ─────────────────────────────────────────────────

function highlight(raw) {
  return raw
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/(\/\/.*$)/gm,        '<span class="hl-cm">$1</span>')
    .replace(/(\/\*[\s\S]*?\*\/)/g,'<span class="hl-cm">$1</span>')
    .replace(/(#.*$)/gm,           '<span class="hl-cm">$1</span>')
    .replace(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/g, '<span class="hl-st">$1</span>')
    .replace(/\b(import|export|from|const|let|var|function|return|if|else|switch|case|default|break|async|await|try|catch|throw|new|class|extends|typeof|null|undefined|true|false|of|for|while|type|interface|enum|as|satisfies|keyof|infer)\b/g, '<span class="hl-kw">$1</span>')
    .replace(/\b(\d+\.?\d*)\b/g, '<span class="hl-nm">$1</span>')
    .replace(/\b(useState|useEffect|useRef|useMemo|useCallback|useContext|useReducer|useActionState|useFormStatus|forwardRef|createContext|createRoot|createPortal)\b/g, '<span class="hl-fn">$1</span>');
}

// ─── CODE BLOCK ───────────────────────────────────────────────────────────────

function CodeBlock({ label, code }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    });
  };

  return (
    <div style={{
      background: '#0E0E0E',
      borderRadius: '10px',
      overflow: 'hidden',
      marginTop: '14px',
      border: '1px solid #2A2A2A',
      boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
    }}>
      {/* Topbar */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '9px 14px',
        background: '#1A1A1A',
        borderBottom: '1px solid #2A2A2A',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '5px' }}>
            {['#FF5F57','#FEBC2E','#28C840'].map((c,i) => (
              <div key={i} style={{ width: 9, height: 9, borderRadius: '50%', background: c }} />
            ))}
          </div>
          <span style={{ color: '#555', fontSize: '11px', fontFamily: 'monospace', marginLeft: '6px' }}>
            {label}
          </span>
        </div>
        <button
          onClick={copy}
          style={{
            background: copied ? '#1C3A1C' : '#252525',
            border: `1px solid ${copied ? '#3A7A3A' : '#383838'}`,
            borderRadius: '5px',
            color: copied ? '#5CB85C' : '#666',
            padding: '3px 11px',
            fontSize: '10px',
            cursor: 'pointer',
            fontFamily: 'monospace',
            letterSpacing: '0.04em',
            transition: 'all 0.2s',
          }}
        >
          {copied ? '✓ copied' : 'copy'}
        </button>
      </div>

      {/* Code */}
      <pre style={{
        margin: 0, padding: '18px 20px', overflowX: 'auto',
        fontSize: '12.5px', lineHeight: '1.8',
        fontFamily: "'JetBrains Mono','Fira Code','Cascadia Code','Courier New',monospace",
        color: '#D4C9B0',
      }}>
        <code dangerouslySetInnerHTML={{ __html: highlight(code) }} />
      </pre>

      <style>{`
        .hl-cm { color: #5A6070; font-style: italic; }
        .hl-kw { color: #E8A87C; }
        .hl-st { color: #8EC07C; }
        .hl-nm { color: #D3869B; }
        .hl-fn { color: #83BDCA; }
      `}</style>
    </div>
  );
}

// ─── PACKAGE PAGE ────────────────────────────────────────────────────────────

function PackagePage({ pkg }) {
  const [openSection, setOpenSection] = useState(0);
  const [snippetIdx, setSnippetIdx] = useState([]);

  const getIdx = (si) => snippetIdx[si] ?? 0;
  const setIdx = (si, val) => {
    const next = [...snippetIdx];
    next[si] = val;
    setSnippetIdx(next);
  };

  return (
    <div style={{ animation: 'pkgFadeIn 0.35s ease-out' }}>
      {/* Header */}
      <div style={{ marginBottom: '36px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '32px' }}>{pkg.emoji}</span>
          <h1 style={{
            fontFamily: "'Fraunces','Georgia',serif",
            fontSize: 'clamp(24px,4vw,36px)',
            fontWeight: 900,
            color: '#F0EBE0',
            margin: 0,
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
          }}>
            {pkg.name}
          </h1>
          <span style={{
            background: pkg.type === 'dependency' ? '#1A2E1A' : '#1A1A2E',
            color: pkg.type === 'dependency' ? '#6FCF97' : '#A78BFA',
            border: `1px solid ${pkg.type === 'dependency' ? '#2E5C2E' : '#3D3580'}`,
            borderRadius: '100px',
            padding: '2px 10px',
            fontSize: '11px',
            fontFamily: 'monospace',
            fontWeight: 700,
            letterSpacing: '0.04em',
          }}>
            {pkg.type}
          </span>
        </div>
        <p style={{ color: pkg.accent, fontSize: '15px', fontWeight: 500, marginTop: '6px', marginBottom: '12px' }}>
          {pkg.tagline}
        </p>
        <div style={{
          background: '#111',
          border: '1px solid #252525',
          borderRadius: '10px',
          padding: '14px 18px',
          color: '#8A8070',
          fontSize: '14px',
          lineHeight: '1.75',
          fontStyle: 'italic',
        }}>
          {pkg.what}
        </div>

        {/* Install command */}
        <div style={{ marginTop: '14px' }}>
          <CodeBlock
            label="install"
            code={`npm install ${pkg.type === 'devDependency' ? '--save-dev ' : ''}${pkg.name}`}
          />
        </div>
      </div>

      {/* Sections */}
      {pkg.sections.map((section, si) => (
        <div key={si} style={{ marginBottom: '28px' }}>
          <button
            onClick={() => setOpenSection(openSection === si ? -1 : si)}
            style={{
              width: '100%',
              background: openSection === si ? '#181210' : '#111',
              border: `1px solid ${openSection === si ? '#3A2E1A' : '#222'}`,
              borderRadius: '10px',
              padding: '14px 18px',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: openSection === si ? '0' : '0',
              borderBottomLeftRadius: openSection === si ? '0' : '10px',
              borderBottomRightRadius: openSection === si ? '0' : '10px',
            }}
          >
            <span style={{
              color: '#D4C9B0',
              fontFamily: "'Fraunces','Georgia',serif",
              fontSize: '16px',
              fontWeight: 700,
            }}>{section.title}</span>
            <span style={{
              color: '#5A5040',
              fontSize: '18px',
              transform: openSection === si ? 'rotate(180deg)' : 'rotate(0)',
              transition: 'transform 0.25s',
            }}>⌄</span>
          </button>

          {openSection === si && (
            <div style={{
              background: '#111',
              border: '1px solid #3A2E1A',
              borderTop: 'none',
              borderRadius: '0 0 10px 10px',
              padding: '20px',
              animation: 'pkgFadeIn 0.2s ease-out',
            }}>
              {/* Snippet tabs */}
              {section.snippets && (
                <>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '4px' }}>
                    {section.snippets.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => setIdx(si, i)}
                        style={{
                          background: getIdx(si) === i ? '#2A2010' : 'transparent',
                          border: `1px solid ${getIdx(si) === i ? '#5A4A20' : '#2A2A2A'}`,
                          borderRadius: '6px',
                          padding: '4px 12px',
                          color: getIdx(si) === i ? '#D4B870' : '#4A4030',
                          fontSize: '11px',
                          cursor: 'pointer',
                          fontFamily: 'monospace',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {i + 1}. {s.label.length > 30 ? s.label.slice(0,30) + '…' : s.label}
                      </button>
                    ))}
                  </div>
                  <CodeBlock {...section.snippets[getIdx(si)]} />
                </>
              )}

              {/* Tips */}
              {section.tips && section.tips.length > 0 && (
                <div style={{ marginTop: '20px' }}>
                  <div style={{ color: '#3A3020', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px' }}>
                    Pro Tips
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {section.tips.map((tip, i) => (
                      <div key={i} style={{
                        display: 'flex', gap: '10px', alignItems: 'flex-start',
                        padding: '10px 14px',
                        background: '#0D0D0D',
                        border: '1px solid #222',
                        borderRadius: '8px',
                      }}>
                        <span style={{ color: '#D4B870', flexShrink: 0, marginTop: '1px', fontSize: '12px' }}>›</span>
                        <span style={{ color: '#6A6050', fontSize: '13px', lineHeight: '1.65' }}>{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

export default function StackGuide() {
  const [activeId, setActiveId] = useState('react');
  const contentRef = React.useRef(null);

  const pkg = PACKAGES.find(p => p.id === activeId);

  const handleNav = (id) => {
    setActiveId(id);
    if (contentRef.current) contentRef.current.scrollTop = 0;
  };

  const deps    = PACKAGES.filter(p => p.type === 'dependency');
  const devDeps = PACKAGES.filter(p => p.type === 'devDependency');

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      background: '#0A0906',
      fontFamily: "'DM Sans','Segoe UI',system-ui,sans-serif",
      color: '#D4C9B0',
      overflow: 'hidden',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,700;0,900;1,400&family=DM+Sans:wght@400;500;600&display=swap');
        @keyframes pkgFadeIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        ::-webkit-scrollbar{width:5px}
        ::-webkit-scrollbar-track{background:#080706}
        ::-webkit-scrollbar-thumb{background:#2A2520;border-radius:3px}
        .nav-pkg:hover { background: #141210 !important; }
      `}</style>

      {/* ── SIDEBAR ── */}
      <nav style={{
        width: '220px',
        minWidth: '220px',
        background: '#080706',
        borderRight: '1px solid #1E1A14',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {/* Logo */}
        <div style={{
          padding: '20px 16px 16px',
          borderBottom: '1px solid #1E1A14',
        }}>
          <div style={{
            fontFamily: "'Fraunces','Georgia',serif",
            fontSize: '18px',
            fontWeight: 900,
            color: '#F0EBE0',
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
          }}>
            Next.js Stack
          </div>
          <div style={{ color: '#3A3020', fontSize: '10px', marginTop: '3px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Reference Manual
          </div>
        </div>

        {/* Nav */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 8px' }}>
          {/* Dependencies */}
          <div style={{ color: '#3A3020', fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '6px 8px 4px' }}>
            Dependencies
          </div>
          {deps.map(p => (
            <button
              key={p.id}
              className="nav-pkg"
              onClick={() => handleNav(p.id)}
              style={{
                width: '100%',
                background: activeId === p.id ? '#181410' : 'transparent',
                border: 'none',
                borderRadius: '7px',
                padding: '8px 10px',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '2px',
                position: 'relative',
              }}
            >
              {activeId === p.id && (
                <div style={{
                  position: 'absolute', left: 0, top: '6px', bottom: '6px',
                  width: '2px', background: p.accent, borderRadius: '0 2px 2px 0',
                  boxShadow: `0 0 6px ${p.accent}88`,
                }} />
              )}
              <span style={{ fontSize: '14px' }}>{p.emoji}</span>
              <span style={{
                fontSize: '12px',
                color: activeId === p.id ? '#F0EBE0' : '#5A5040',
                fontFamily: 'monospace',
                fontWeight: activeId === p.id ? 700 : 400,
              }}>{p.name}</span>
            </button>
          ))}

          {/* Dev Dependencies */}
          <div style={{ color: '#3A3020', fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '12px 8px 4px' }}>
            Dev Dependencies
          </div>
          {devDeps.map(p => (
            <button
              key={p.id}
              className="nav-pkg"
              onClick={() => handleNav(p.id)}
              style={{
                width: '100%',
                background: activeId === p.id ? '#181410' : 'transparent',
                border: 'none',
                borderRadius: '7px',
                padding: '8px 10px',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '2px',
                position: 'relative',
              }}
            >
              {activeId === p.id && (
                <div style={{
                  position: 'absolute', left: 0, top: '6px', bottom: '6px',
                  width: '2px', background: p.accent, borderRadius: '0 2px 2px 0',
                  boxShadow: `0 0 6px ${p.accent}88`,
                }} />
              )}
              <span style={{ fontSize: '14px' }}>{p.emoji}</span>
              <span style={{
                fontSize: '12px',
                color: activeId === p.id ? '#F0EBE0' : '#5A5040',
                fontFamily: 'monospace',
                fontWeight: activeId === p.id ? 700 : 400,
              }}>{p.name}</span>
            </button>
          ))}
        </div>

        <div style={{ padding: '12px 16px', borderTop: '1px solid #1E1A14', color: '#2A2010', fontSize: '10px' }}>
          9 packages · copy-paste ready
        </div>
      </nav>

      {/* ── CONTENT ── */}
      <main
        ref={contentRef}
        key={activeId}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '40px 48px',
        }}
      >
        <PackagePage pkg={pkg} />

        {/* Prev / Next */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '48px',
          paddingTop: '20px',
          borderTop: '1px solid #1E1A14',
        }}>
          {(() => {
            const idx  = PACKAGES.findIndex(p => p.id === activeId);
            const prev = PACKAGES[idx - 1];
            const next = PACKAGES[idx + 1];
            return (
              <>
                {prev ? (
                  <button onClick={() => handleNav(prev.id)} style={{
                    background: '#111', border: '1px solid #222', borderRadius: '8px',
                    padding: '9px 16px', color: '#5A5040', cursor: 'pointer',
                    fontSize: '12px', fontFamily: 'monospace',
                  }}>← {prev.name}</button>
                ) : <div />}
                {next && (
                  <button onClick={() => handleNav(next.id)} style={{
                    background: '#181410', border: `1px solid ${next.accent}40`,
                    borderRadius: '8px', padding: '9px 16px',
                    color: next.accent, cursor: 'pointer',
                    fontSize: '12px', fontFamily: 'monospace', fontWeight: 700,
                    boxShadow: `0 0 12px ${next.accent}15`,
                  }}>{next.name} →</button>
                )}
              </>
            );
          })()}
        </div>
      </main>
    </div>
  );
}
