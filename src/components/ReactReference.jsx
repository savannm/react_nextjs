import React, { useState, useEffect, useRef, useCallback, useMemo, useReducer, useContext, createContext, memo, forwardRef, useImperativeHandle, useLayoutEffect, useTransition, useDeferredValue, useId, lazy, Suspense } from "react";

// ============================================================
// DATA — 200 React features grouped into categories
// ============================================================
const SECTIONS = [
  {
    id: "hooks-state",
    label: "State Hooks",
    color: "#00d4ff",
    icon: "⚡",
    items: [
      {
        id: 1,
        title: "useState – primitive",
        tag: "hook",
        code: `const [count, setCount] = useState(0);
// Update
setCount(count + 1);
// Functional update (safe for async)
setCount(prev => prev + 1);`,
        note: "Most fundamental hook. Always use functional update form when new state depends on old."
      },
      {
        id: 2,
        title: "useState – object",
        tag: "hook",
        code: `const [user, setUser] = useState({ name: '', age: 0 });
// Merge (spread required!)
setUser(prev => ({ ...prev, name: 'Sav' }));`,
        note: "useState doesn't auto-merge objects. Always spread the previous state."
      },
      {
        id: 3,
        title: "useState – array",
        tag: "hook",
        code: `const [items, setItems] = useState([]);
// Add
setItems(prev => [...prev, newItem]);
// Remove
setItems(prev => prev.filter(i => i.id !== id));
// Update
setItems(prev => prev.map(i => i.id === id ? {...i, done:true} : i));`,
        note: "Never mutate state directly. Always return a new array."
      },
      {
        id: 4,
        title: "useState – lazy initialiser",
        tag: "hook",
        code: `// Function runs ONCE on mount only
const [data, setData] = useState(() => {
  return JSON.parse(localStorage.getItem('data')) ?? [];
});`,
        note: "Pass a function (not its result) to avoid expensive recalc on every render."
      },
      {
        id: 5,
        title: "useReducer – basic",
        tag: "hook",
        code: `const reducer = (state, action) => {
  switch (action.type) {
    case 'increment': return { count: state.count + 1 };
    case 'reset':     return { count: 0 };
    default: return state;
  }
};
const [state, dispatch] = useReducer(reducer, { count: 0 });
dispatch({ type: 'increment' });`,
        note: "Prefer useReducer when state logic is complex or next state depends on previous."
      },
      {
        id: 6,
        title: "useReducer – with payload",
        tag: "hook",
        code: `const reducer = (state, action) => {
  switch (action.type) {
    case 'setName': return { ...state, name: action.payload };
  }
};
dispatch({ type: 'setName', payload: 'Sav' });`,
        note: "action.payload pattern is the Redux convention — widely understood."
      },
      {
        id: 7,
        title: "useReducer – lazy init",
        tag: "hook",
        code: `function init(initialCount) {
  return { count: initialCount };
}
const [state, dispatch] = useReducer(reducer, 0, init);`,
        note: "Third argument to useReducer allows lazy initialisation just like useState."
      },
      {
        id: 8,
        title: "Derived state (no useState)",
        tag: "pattern",
        code: `// Don't sync derived state with useEffect
// ✅ Compute directly
const fullName = \`\${firstName} \${lastName}\`;
const filteredList = items.filter(i => i.active);`,
        note: "Derived values should just be variables, not state. Avoid the sync trap."
      },
      {
        id: 9,
        title: "State reset on key change",
        tag: "pattern",
        code: `// Remount component & reset all state by changing key
<UserForm key={userId} userId={userId} />`,
        note: "Changing key completely resets a component. Useful for edit/create forms."
      },
      {
        id: 10,
        title: "useRef for stable values",
        tag: "hook",
        code: `const renderCount = useRef(0);
useEffect(() => {
  renderCount.current++;
}); // no deps — runs every render
console.log(renderCount.current); // never triggers re-render`,
        note: "useRef .current changes don't cause re-renders. Perfect for counters, timers, prev values."
      },
    ]
  },
  {
    id: "hooks-effect",
    label: "Effect Hooks",
    color: "#ff6b6b",
    icon: "🔁",
    items: [
      {
        id: 11,
        title: "useEffect – on mount",
        tag: "hook",
        code: `useEffect(() => {
  console.log('mounted');
  return () => console.log('unmounted'); // cleanup
}, []); // empty array = run once`,
        note: "[] dependency array = componentDidMount + componentWillUnmount equivalent."
      },
      {
        id: 12,
        title: "useEffect – on dep change",
        tag: "hook",
        code: `useEffect(() => {
  document.title = \`Count: \${count}\`;
}, [count]); // re-runs when count changes`,
        note: "List every reactive value used inside the effect in the dependency array."
      },
      {
        id: 13,
        title: "useEffect – fetch data",
        tag: "hook",
        code: `useEffect(() => {
  let ignore = false;
  async function load() {
    const res = await fetch(\`/api/users/\${id}\`);
    const data = await res.json();
    if (!ignore) setUser(data);
  }
  load();
  return () => { ignore = true; }; // race condition guard
}, [id]);`,
        note: "Always use an ignore flag to prevent state updates on unmounted components."
      },
      {
        id: 14,
        title: "useEffect – subscriptions",
        tag: "hook",
        code: `useEffect(() => {
  const handler = (e) => setKey(e.key);
  window.addEventListener('keydown', handler);
  return () => window.removeEventListener('keydown', handler);
}, []);`,
        note: "Always clean up subscriptions, timers, and listeners in the return function."
      },
      {
        id: 15,
        title: "useLayoutEffect",
        tag: "hook",
        code: `useLayoutEffect(() => {
  // Runs synchronously AFTER DOM mutations
  // Use for measuring DOM elements
  const height = ref.current.getBoundingClientRect().height;
  setHeight(height);
}, []);`,
        note: "Fires before the browser paints. Use for DOM measurements to prevent flicker."
      },
      {
        id: 16,
        title: "Custom hook – usePrevious",
        tag: "custom",
        code: `function usePrevious(value) {
  const ref = useRef();
  useEffect(() => { ref.current = value; });
  return ref.current;
}
const prevCount = usePrevious(count);`,
        note: "Custom hooks are just functions starting with 'use'. Extract any stateful logic."
      },
      {
        id: 17,
        title: "Custom hook – useLocalStorage",
        tag: "custom",
        code: `function useLocalStorage(key, initial) {
  const [val, setVal] = useState(
    () => JSON.parse(localStorage.getItem(key)) ?? initial
  );
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(val));
  }, [key, val]);
  return [val, setVal];
}`,
        note: "This pattern gives you all useState behaviour with automatic localStorage sync."
      },
      {
        id: 18,
        title: "Custom hook – useFetch",
        tag: "custom",
        code: `function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    fetch(url).then(r => r.json())
      .then(setData).catch(setError)
      .finally(() => setLoading(false));
  }, [url]);
  return { data, loading, error };
}`,
        note: "Encapsulate fetch logic in a custom hook to keep components clean."
      },
      {
        id: 19,
        title: "Custom hook – useDebounce",
        tag: "custom",
        code: `function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}
const debouncedSearch = useDebounce(searchTerm, 500);`,
        note: "Essential for search inputs. Prevents API call on every keystroke."
      },
      {
        id: 20,
        title: "Custom hook – useOnClickOutside",
        tag: "custom",
        code: `function useOnClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (e) => {
      if (!ref.current?.contains(e.target)) handler(e);
    };
    document.addEventListener('mousedown', listener);
    return () => document.removeEventListener('mousedown', listener);
  }, [ref, handler]);
}`,
        note: "Perfect for closing dropdowns and modals when clicking outside."
      },
    ]
  },
  {
    id: "hooks-perf",
    label: "Performance Hooks",
    color: "#ffd93d",
    icon: "🚀",
    items: [
      {
        id: 21,
        title: "useMemo",
        tag: "hook",
        code: `const sorted = useMemo(() => {
  return [...items].sort((a, b) => a.name.localeCompare(b.name));
}, [items]); // recalculates only when items changes`,
        note: "Cache expensive calculations. Don't overuse — has its own cost."
      },
      {
        id: 22,
        title: "useCallback",
        tag: "hook",
        code: `const handleClick = useCallback((id) => {
  setItems(prev => prev.filter(i => i.id !== id));
}, []); // stable function reference
// Pass to memo'd child without causing re-render
<Item onClick={handleClick} />`,
        note: "Stabilise function references passed as props to prevent unnecessary child re-renders."
      },
      {
        id: 23,
        title: "React.memo",
        tag: "perf",
        code: `const UserCard = memo(({ user }) => {
  return <div>{user.name}</div>;
});
// Only re-renders when user prop changes (shallow compare)
// Custom compare:
const UserCard = memo(UserCard, (prev, next) => {
  return prev.user.id === next.user.id;
});`,
        note: "Wraps a component to skip re-render if props haven't changed."
      },
      {
        id: 24,
        title: "useTransition",
        tag: "hook",
        code: `const [isPending, startTransition] = useTransition();
// Mark state update as non-urgent
startTransition(() => {
  setSearchResults(heavyFilter(query));
});
// UI stays responsive; isPending = true while updating
{isPending && <Spinner />}`,
        note: "Keeps the UI responsive during slow state updates. React 18+."
      },
      {
        id: 25,
        title: "useDeferredValue",
        tag: "hook",
        code: `const deferredQuery = useDeferredValue(query);
// Use deferredQuery for expensive renders
// It lags behind query intentionally
const results = useMemo(
  () => filterItems(deferredQuery),
  [deferredQuery]
);`,
        note: "Similar to useTransition but for values you receive rather than dispatch."
      },
      {
        id: 26,
        title: "Code splitting – lazy",
        tag: "perf",
        code: `const Dashboard = lazy(() => import('./Dashboard'));
// Wrap in Suspense
<Suspense fallback={<Spinner />}>
  <Dashboard />
</Suspense>`,
        note: "Splits bundle. Dashboard JS is only loaded when component is rendered."
      },
      {
        id: 27,
        title: "Suspense for data",
        tag: "perf",
        code: `// With React Query or SWR (they support Suspense)
<Suspense fallback={<Skeleton />}>
  <UserProfile id={id} />
</Suspense>
// Inside UserProfile:
const { data } = useSuspenseQuery(['user', id], fetchUser);`,
        note: "Suspense for data fetching creates declarative loading states at any level."
      },
      {
        id: 28,
        title: "useId",
        tag: "hook",
        code: `const id = useId();
// Stable, unique, SSR-safe ID
return (
  <>
    <label htmlFor={id}>Name</label>
    <input id={id} type="text" />
  </>
);`,
        note: "Generates stable IDs safe for SSR. Never use Math.random() for IDs in React."
      },
      {
        id: 29,
        title: "Windowing / virtualisation",
        tag: "perf",
        code: `// react-window example
import { FixedSizeList } from 'react-window';
<FixedSizeList height={400} itemCount={10000} itemSize={35}>
  {({ index, style }) => (
    <div style={style}>Row {index}</div>
  )}
</FixedSizeList>`,
        note: "Only renders visible rows. Critical for lists with 100+ items."
      },
      {
        id: 30,
        title: "Profiler API",
        tag: "perf",
        code: `import { Profiler } from 'react';
<Profiler id="Nav" onRender={(id, phase, duration) => {
  console.log(id, phase, duration);
}}>
  <Nav />
</Profiler>`,
        note: "Use in development to measure rendering cost of component trees."
      },
    ]
  },
  {
    id: "context",
    label: "Context & Refs",
    color: "#c77dff",
    icon: "🌐",
    items: [
      {
        id: 31,
        title: "createContext + useContext",
        tag: "hook",
        code: `const ThemeCtx = createContext('light');

function App() {
  return (
    <ThemeCtx.Provider value="dark">
      <Child />
    </ThemeCtx.Provider>
  );
}
function Child() {
  const theme = useContext(ThemeCtx);
  return <div className={theme}>...</div>;
}`,
        note: "Context avoids prop drilling. Don't overuse — it re-renders all consumers on change."
      },
      {
        id: 32,
        title: "Context with state",
        tag: "pattern",
        code: `const AuthCtx = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const login = useCallback((u) => setUser(u), []);
  const logout = useCallback(() => setUser(null), []);
  return (
    <AuthCtx.Provider value={{ user, login, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}
export const useAuth = () => useContext(AuthCtx);`,
        note: "Wrap context + state in a provider component and expose a custom hook."
      },
      {
        id: 33,
        title: "Multiple contexts",
        tag: "pattern",
        code: `<AuthProvider>
  <ThemeProvider>
    <CartProvider>
      <App />
    </CartProvider>
  </ThemeProvider>
</AuthProvider>`,
        note: "Compose providers. Consider a single AppProvider component to flatten nesting."
      },
      {
        id: 34,
        title: "useRef – DOM",
        tag: "hook",
        code: `const inputRef = useRef(null);
// Focus programmatically
inputRef.current?.focus();
// Scroll into view
inputRef.current?.scrollIntoView({ behavior: 'smooth' });
return <input ref={inputRef} />;`,
        note: "Direct DOM access without triggering re-renders."
      },
      {
        id: 35,
        title: "forwardRef",
        tag: "hook",
        code: `const Input = forwardRef((props, ref) => (
  <input ref={ref} {...props} />
));
// Parent can now ref your component
const ref = useRef();
<Input ref={ref} />
ref.current?.focus();`,
        note: "Allows parent components to access a child's DOM node."
      },
      {
        id: 36,
        title: "useImperativeHandle",
        tag: "hook",
        code: `const Modal = forwardRef((props, ref) => {
  const [open, setOpen] = useState(false);
  useImperativeHandle(ref, () => ({
    open:  () => setOpen(true),
    close: () => setOpen(false),
  }));
  return open ? <div>...</div> : null;
});
// Parent: modalRef.current.open()`,
        note: "Expose a custom imperative API from a child component."
      },
      {
        id: 37,
        title: "Callback ref",
        tag: "pattern",
        code: `function MeasuredDiv() {
  const [height, setHeight] = useState(0);
  const measuredRef = useCallback(node => {
    if (node) setHeight(node.getBoundingClientRect().height);
  }, []);
  return <div ref={measuredRef}>Height: {height}px</div>;
}`,
        note: "Callback refs fire when a node is attached/detached, unlike useRef."
      },
      {
        id: 38,
        title: "Context performance split",
        tag: "pattern",
        code: `// Split into state + dispatch contexts
const StateCtx = createContext();
const DispatchCtx = createContext();
// Components that only dispatch won't re-render on state change
function Action() {
  const dispatch = useContext(DispatchCtx); // stable ref
}`,
        note: "Splitting state and dispatch prevents consumers from re-rendering unnecessarily."
      },
      {
        id: 39,
        title: "useRef – interval",
        tag: "pattern",
        code: `function useInterval(callback, delay) {
  const savedCallback = useRef(callback);
  useEffect(() => { savedCallback.current = callback; });
  useEffect(() => {
    if (delay == null) return;
    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}`,
        note: "Stable interval hook — the callback always has access to latest closure values."
      },
      {
        id: 40,
        title: "Ref as instance variable",
        tag: "pattern",
        code: `// Track if it's the first render
const isFirstRender = useRef(true);
useEffect(() => {
  if (isFirstRender.current) {
    isFirstRender.current = false;
    return; // skip on mount
  }
  doSomething();
}, [value]);`,
        note: "useRef is the escape hatch for mutable values you don't want to trigger renders."
      },
    ]
  },
  {
    id: "rendering",
    label: "Rendering Patterns",
    color: "#06d6a0",
    icon: "🎨",
    items: [
      {
        id: 41,
        title: "Conditional rendering – &&",
        tag: "jsx",
        code: `{isLoggedIn && <Dashboard />}
// ⚠️ Gotcha: 0 renders "0"
{count > 0 && <Badge count={count} />} // safe
{count && <Badge />} // BAD — renders "0"`,
        note: "Use > 0 or Boolean() when the left side could be a falsy number."
      },
      {
        id: 42,
        title: "Conditional rendering – ternary",
        tag: "jsx",
        code: `{isLoading
  ? <Skeleton />
  : <UserList users={users} />
}`,
        note: "Ternary for binary states. Nest inside parens for readability."
      },
      {
        id: 43,
        title: "Early return",
        tag: "pattern",
        code: `function UserCard({ user }) {
  if (!user) return null;
  if (user.banned) return <BannedMessage />;
  return <div>{user.name}</div>;
}`,
        note: "Early returns keep the happy path clean and avoid deeply nested ternaries."
      },
      {
        id: 44,
        title: "List rendering – map",
        tag: "jsx",
        code: `{users.map(user => (
  <UserCard key={user.id} user={user} />
))}`,
        note: "key must be stable and unique among siblings. Never use array index as key for dynamic lists."
      },
      {
        id: 45,
        title: "List with index key (when safe)",
        tag: "jsx",
        code: `// Safe ONLY when: list is static, never reordered, items never deleted
{tabs.map((tab, i) => (
  <Tab key={i} label={tab.label} />
))}`,
        note: "Index keys cause bugs with reordering. Only safe for static, immutable lists."
      },
      {
        id: 46,
        title: "Fragments",
        tag: "jsx",
        code: `// Short syntax
<>
  <dt>Term</dt>
  <dd>Definition</dd>
</>
// With key (long form required)
{items.map(item => (
  <Fragment key={item.id}>
    <dt>{item.term}</dt>
    <dd>{item.def}</dd>
  </Fragment>
))}`,
        note: "Fragments avoid unnecessary wrapper divs. Key prop requires the long Fragment form."
      },
      {
        id: 47,
        title: "Render props",
        tag: "pattern",
        code: `<DataFetcher url="/api/users">
  {({ data, loading }) =>
    loading ? <Spinner /> : <UserList data={data} />
  }
</DataFetcher>`,
        note: "Render props share stateful logic. Largely replaced by hooks but still useful."
      },
      {
        id: 48,
        title: "Children prop",
        tag: "pattern",
        code: `function Card({ title, children }) {
  return (
    <div className="card">
      <h2>{title}</h2>
      {children}
    </div>
  );
}
<Card title="Hello"><p>World</p></Card>`,
        note: "children is any valid JSX. Enables flexible, composable component APIs."
      },
      {
        id: 49,
        title: "Portal",
        tag: "jsx",
        code: `import { createPortal } from 'react-dom';
function Modal({ children }) {
  return createPortal(
    <div className="modal">{children}</div>,
    document.body // renders outside current DOM hierarchy
  );
}`,
        note: "Portals escape overflow:hidden and z-index stacking. Essential for modals/tooltips."
      },
      {
        id: 50,
        title: "Error boundary",
        tag: "pattern",
        code: `class ErrorBoundary extends Component {
  state = { error: null };
  static getDerivedStateFromError(err) {
    return { error: err };
  }
  render() {
    if (this.state.error) return <ErrorUI />;
    return this.props.children;
  }
}
// Usage: wrap subtrees
<ErrorBoundary><RiskyComponent /></ErrorBoundary>`,
        note: "Catches runtime errors in child tree. Must be a class component (no hook equivalent yet)."
      },
    ]
  },
  {
    id: "props",
    label: "Props & Composition",
    color: "#ff9f43",
    icon: "📦",
    items: [
      {
        id: 51,
        title: "Prop spreading",
        tag: "pattern",
        code: `function Button({ variant, className, ...rest }) {
  return (
    <button
      className={\`btn btn--\${variant} \${className}\`}
      {...rest} // passes onClick, disabled, etc.
    />
  );
}`,
        note: "Destructure known props, spread the rest. Enables polymorphic/wrapper components."
      },
      {
        id: 52,
        title: "Default props",
        tag: "pattern",
        code: `function Button({ variant = 'primary', size = 'md', children }) {
  // ...
}
// Or object default:
function Chart({ options = {} }) {}`,
        note: "Default parameter values in destructuring replace the old defaultProps pattern."
      },
      {
        id: 53,
        title: "Compound components",
        tag: "pattern",
        code: `// <Select> exposes sub-components via dot notation
<Select>
  <Select.Option value="a">Alpha</Select.Option>
  <Select.Option value="b">Beta</Select.Option>
</Select>
// Implemented using Context internally`,
        note: "Compound components give consumers flexible APIs. Used in Radix, Headless UI, etc."
      },
      {
        id: 54,
        title: "Controlled component",
        tag: "pattern",
        code: `// React owns the value
const [value, setValue] = useState('');
<input
  value={value}
  onChange={e => setValue(e.target.value)}
/>`,
        note: "Controlled = React drives the UI. Single source of truth for form state."
      },
      {
        id: 55,
        title: "Uncontrolled component",
        tag: "pattern",
        code: `// DOM owns the value
const inputRef = useRef();
function handleSubmit() {
  console.log(inputRef.current.value);
}
<input ref={inputRef} defaultValue="hello" />`,
        note: "Uncontrolled = DOM drives itself. Simpler for non-critical forms."
      },
      {
        id: 56,
        title: "Prop types (runtime)",
        tag: "pattern",
        code: `import PropTypes from 'prop-types';
Button.propTypes = {
  variant: PropTypes.oneOf(['primary','secondary']),
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};`,
        note: "Runtime type checking. Prefer TypeScript for static analysis, but PropTypes works in JS."
      },
      {
        id: 57,
        title: "TypeScript props",
        tag: "typescript",
        code: `interface ButtonProps {
  variant?: 'primary' | 'secondary';
  onClick: () => void;
  children: React.ReactNode;
}
function Button({ variant = 'primary', ...props }: ButtonProps) {}`,
        note: "TypeScript gives compile-time safety. ReactNode accepts anything React can render."
      },
      {
        id: 58,
        title: "as prop (polymorphic)",
        tag: "pattern",
        code: `function Text({ as: Tag = 'p', children, ...rest }) {
  return <Tag {...rest}>{children}</Tag>;
}
<Text as="h1">Title</Text>
<Text as="span">Inline</Text>`,
        note: "Lets consumers change the underlying HTML element without recreating the component."
      },
      {
        id: 59,
        title: "Slot pattern (named children)",
        tag: "pattern",
        code: `function Layout({ header, sidebar, children }) {
  return (
    <div>
      <header>{header}</header>
      <aside>{sidebar}</aside>
      <main>{children}</main>
    </div>
  );
}
<Layout header={<Nav />} sidebar={<Filters />}>
  <Feed />
</Layout>`,
        note: "Named prop slots give layout components maximum composition flexibility."
      },
      {
        id: 60,
        title: "Higher-Order Component (HOC)",
        tag: "pattern",
        code: `function withAuth(Component) {
  return function AuthGuard(props) {
    const { user } = useAuth();
    if (!user) return <Redirect to="/login" />;
    return <Component {...props} />;
  };
}
const ProtectedDashboard = withAuth(Dashboard);`,
        note: "HOCs wrap components to add behaviour. Largely replaced by hooks but still common."
      },
    ]
  },
  {
    id: "forms",
    label: "Forms",
    color: "#48cae4",
    icon: "📝",
    items: [
      {
        id: 61,
        title: "Controlled form",
        tag: "form",
        code: `const [form, setForm] = useState({ email: '', pass: '' });
const handle = (e) =>
  setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
<input name="email" value={form.email} onChange={handle} />
<input name="pass"  value={form.pass}  onChange={handle} type="password" />`,
        note: "Single onChange handler using name attribute. Clean for multi-field forms."
      },
      {
        id: 62,
        title: "Form submission",
        tag: "form",
        code: `function handleSubmit(e) {
  e.preventDefault(); // always prevent default
  // validate, then:
  await api.post('/login', form);
}
<form onSubmit={handleSubmit}>...</form>`,
        note: "e.preventDefault() stops the browser from navigating. Always do this."
      },
      {
        id: 63,
        title: "Form validation",
        tag: "form",
        code: `const [errors, setErrors] = useState({});
function validate() {
  const errs = {};
  if (!form.email.includes('@')) errs.email = 'Invalid email';
  if (form.pass.length < 8) errs.pass = 'Min 8 chars';
  setErrors(errs);
  return Object.keys(errs).length === 0;
}`,
        note: "Validate on submit (or on blur for better UX). Return boolean for gating submission."
      },
      {
        id: 64,
        title: "React Hook Form",
        tag: "library",
        code: `import { useForm } from 'react-hook-form';
const { register, handleSubmit, formState: { errors } } = useForm();
<input {...register('email', { required: true, pattern: /^\S+@\S+$/ })} />
{errors.email && <span>Invalid email</span>}
<button type="submit">Submit</button>`,
        note: "RHF is uncontrolled by default — minimal re-renders. Most popular form library."
      },
      {
        id: 65,
        title: "Select & Checkbox",
        tag: "form",
        code: `// Select
<select value={role} onChange={e => setRole(e.target.value)}>
  <option value="admin">Admin</option>
  <option value="user">User</option>
</select>
// Checkbox (value is boolean)
<input type="checkbox"
  checked={agreed}
  onChange={e => setAgreed(e.target.checked)} />`,
        note: "Checkboxes use checked/onChange with e.target.checked, not value."
      },
      {
        id: 66,
        title: "Multi-select / checkboxes",
        tag: "form",
        code: `const [selected, setSelected] = useState([]);
const toggle = (val) => setSelected(prev =>
  prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]
);
{options.map(opt => (
  <label key={opt}>
    <input type="checkbox"
      checked={selected.includes(opt)}
      onChange={() => toggle(opt)} />
    {opt}
  </label>
))}`,
        note: "Manage array state for multi-checkbox forms. toggle helper keeps it clean."
      },
      {
        id: 67,
        title: "File input",
        tag: "form",
        code: `const [file, setFile] = useState(null);
<input
  type="file"
  accept="image/*"
  onChange={e => setFile(e.target.files[0])}
/>
// Preview
{file && <img src={URL.createObjectURL(file)} />}`,
        note: "File inputs are always uncontrolled. Access files via e.target.files."
      },
      {
        id: 68,
        title: "Zod validation",
        tag: "library",
        code: `import { z } from 'zod';
const schema = z.object({
  email: z.string().email(),
  age:   z.number().min(18),
});
const result = schema.safeParse(formData);
if (!result.success) console.log(result.error.flatten());`,
        note: "Zod gives schema-first type-safe validation. Integrates with RHF via @hookform/resolvers."
      },
      {
        id: 69,
        title: "Form with useReducer",
        tag: "form",
        code: `const formReducer = (state, { field, value }) =>
  ({ ...state, [field]: value });
const [form, dispatch] = useReducer(formReducer, initial);
const handle = e =>
  dispatch({ field: e.target.name, value: e.target.value });`,
        note: "useReducer for forms gives you a history-ready, testable approach."
      },
      {
        id: 70,
        title: "Optimistic form update",
        tag: "pattern",
        code: `async function handleSubmit() {
  const tempId = Date.now();
  // Update UI immediately
  setItems(prev => [...prev, { ...newItem, id: tempId }]);
  try {
    const saved = await api.post(newItem);
    setItems(prev => prev.map(i => i.id === tempId ? saved : i));
  } catch {
    setItems(prev => prev.filter(i => i.id !== tempId)); // rollback
  }
}`,
        note: "Show the change immediately, then confirm or rollback. Great for perceived performance."
      },
    ]
  },
  {
    id: "data",
    label: "Data & API",
    color: "#74b9ff",
    icon: "💾",
    items: [
      {
        id: 71,
        title: "fetch – GET",
        tag: "api",
        code: `const res = await fetch('/api/users');
if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
const data = await res.json();`,
        note: "fetch doesn't throw on 4xx/5xx — check res.ok manually."
      },
      {
        id: 72,
        title: "fetch – POST",
        tag: "api",
        code: `const res = await fetch('/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Sav' }),
});
const created = await res.json();`,
        note: "Always set Content-Type header for JSON bodies."
      },
      {
        id: 73,
        title: "Axios",
        tag: "library",
        code: `import axios from 'axios';
const client = axios.create({ baseURL: '/api' });
// GET
const { data } = await client.get('/users');
// POST — no JSON.stringify needed
const { data: created } = await client.post('/users', { name: 'Sav' });`,
        note: "Axios auto-serialises and deserialises JSON. Throws on 4xx/5xx by default."
      },
      {
        id: 74,
        title: "React Query – useQuery",
        tag: "library",
        code: `import { useQuery } from '@tanstack/react-query';
const { data, isLoading, error } = useQuery({
  queryKey: ['users'],
  queryFn: () => fetch('/api/users').then(r => r.json()),
});`,
        note: "TanStack Query handles caching, background refetch, deduplication, and stale-while-revalidate."
      },
      {
        id: 75,
        title: "React Query – useMutation",
        tag: "library",
        code: `const mutation = useMutation({
  mutationFn: (user) => axios.post('/api/users', user),
  onSuccess: () => queryClient.invalidateQueries(['users']),
});
mutation.mutate({ name: 'Sav' });`,
        note: "Invalidate queries after mutation to refetch fresh data automatically."
      },
      {
        id: 76,
        title: "SWR",
        tag: "library",
        code: `import useSWR from 'swr';
const fetcher = url => fetch(url).then(r => r.json());
const { data, error, isLoading } = useSWR('/api/user', fetcher);`,
        note: "Vercel's data fetching library. Simpler than React Query for basic cases."
      },
      {
        id: 77,
        title: "Abort controller",
        tag: "api",
        code: `useEffect(() => {
  const controller = new AbortController();
  fetch('/api/data', { signal: controller.signal })
    .then(r => r.json()).then(setData)
    .catch(e => { if (e.name !== 'AbortError') setError(e); });
  return () => controller.abort();
}, []);`,
        note: "Cancels in-flight requests on unmount or dependency change. Prevents memory leaks."
      },
      {
        id: 78,
        title: "Error handling pattern",
        tag: "api",
        code: `const [state, setState] = useState({
  data: null, loading: false, error: null
});
async function load() {
  setState({ data: null, loading: true, error: null });
  try {
    const data = await fetchUsers();
    setState({ data, loading: false, error: null });
  } catch(e) {
    setState({ data: null, loading: false, error: e.message });
  }
}`,
        note: "Centralise loading/error/data into a single state object to avoid stale state bugs."
      },
      {
        id: 79,
        title: "Pagination",
        tag: "pattern",
        code: `const [page, setPage] = useState(1);
const { data } = useQuery({
  queryKey: ['users', page],
  queryFn: () => fetchUsers(page),
  keepPreviousData: true, // no loading flash on page change
});`,
        note: "keepPreviousData prevents blank screen between pages. Essential for good UX."
      },
      {
        id: 80,
        title: "Infinite scroll",
        tag: "pattern",
        code: `const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
  queryKey: ['feed'],
  queryFn: ({ pageParam = 1 }) => fetchPosts(pageParam),
  getNextPageParam: (last) => last.nextPage,
});
// Trigger: use IntersectionObserver on a sentinel element`,
        note: "useInfiniteQuery manages paginated data. Combine with IntersectionObserver for auto-load."
      },
    ]
  },
  {
    id: "routing",
    label: "Routing",
    color: "#fd79a8",
    icon: "🗺️",
    items: [
      {
        id: 81,
        title: "React Router – setup",
        tag: "routing",
        code: `import { BrowserRouter, Routes, Route } from 'react-router-dom';
<BrowserRouter>
  <Routes>
    <Route path="/"         element={<Home />} />
    <Route path="/about"    element={<About />} />
    <Route path="/users/:id" element={<UserDetail />} />
    <Route path="*"         element={<NotFound />} />
  </Routes>
</BrowserRouter>`,
        note: "v6+ uses nested <Routes>/<Route> elements. * catches all unmatched paths."
      },
      {
        id: 82,
        title: "useNavigate",
        tag: "routing",
        code: `import { useNavigate } from 'react-router-dom';
const navigate = useNavigate();
navigate('/dashboard');            // push
navigate(-1);                      // go back
navigate('/login', { replace: true }); // replace history`,
        note: "Replaces useHistory from v5. Use replace: true for redirects to prevent back-nav."
      },
      {
        id: 83,
        title: "useParams",
        tag: "routing",
        code: `// Route: /users/:id/posts/:postId
import { useParams } from 'react-router-dom';
const { id, postId } = useParams();`,
        note: "Extracts dynamic segments from the URL as strings."
      },
      {
        id: 84,
        title: "useSearchParams",
        tag: "routing",
        code: `const [params, setParams] = useSearchParams();
const query = params.get('q') ?? '';
// Update URL: /search?q=react
setParams({ q: searchTerm, page: '1' });`,
        note: "Managed URL query string state. Changes are reflected in the browser URL."
      },
      {
        id: 85,
        title: "Link & NavLink",
        tag: "routing",
        code: `import { Link, NavLink } from 'react-router-dom';
<Link to="/about">About</Link>
// NavLink adds active class automatically
<NavLink to="/about"
  className={({ isActive }) => isActive ? 'active' : ''}>
  About
</NavLink>`,
        note: "Use Link instead of <a>. NavLink is for nav menus with active state styling."
      },
      {
        id: 86,
        title: "Protected routes",
        tag: "routing",
        code: `function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}
<Route path="/dashboard" element={
  <PrivateRoute><Dashboard /></PrivateRoute>
} />`,
        note: "Wrap protected routes in a guard component. <Navigate> is declarative redirect."
      },
      {
        id: 87,
        title: "Nested routes & Outlet",
        tag: "routing",
        code: `// Parent layout route
<Route path="/app" element={<AppLayout />}>
  <Route index element={<Home />} />
  <Route path="settings" element={<Settings />} />
</Route>
// AppLayout.jsx
function AppLayout() {
  return <><Sidebar /><Outlet /></>; // Outlet = child route
}`,
        note: "Outlet renders the matched child route. Enables persistent layouts."
      },
      {
        id: 88,
        title: "useLocation",
        tag: "routing",
        code: `const location = useLocation();
console.log(location.pathname); // /users/123
console.log(location.search);   // ?tab=profile
console.log(location.state);    // passed via navigate`,
        note: "Access current URL details. location.state carries data between routes."
      },
      {
        id: 89,
        title: "Lazy routes",
        tag: "routing",
        code: `const Dashboard = lazy(() => import('./pages/Dashboard'));
<Route path="/dashboard" element={
  <Suspense fallback={<PageSkeleton />}>
    <Dashboard />
  </Suspense>
} />`,
        note: "Lazy-load route components to split the bundle per page."
      },
      {
        id: 90,
        title: "Route loader (v6.4+)",
        tag: "routing",
        code: `const router = createBrowserRouter([{
  path: '/users/:id',
  element: <UserDetail />,
  loader: ({ params }) => fetch(\`/api/users/\${params.id}\`),
}]);
// Inside component:
const user = useLoaderData();`,
        note: "Loaders co-locate data fetching with routes. Data fetches in parallel with code loading."
      },
    ]
  },
  {
    id: "state-mgmt",
    label: "State Management",
    color: "#a29bfe",
    icon: "🗄️",
    items: [
      {
        id: 91,
        title: "Zustand – store",
        tag: "library",
        code: `import { create } from 'zustand';
const useStore = create((set) => ({
  count: 0,
  inc: () => set(state => ({ count: state.count + 1 })),
  reset: () => set({ count: 0 }),
}));
// Usage:
const count = useStore(state => state.count);
const inc = useStore(state => state.inc);`,
        note: "Zustand: minimal boilerplate, no provider needed. Only consumers of selected state re-render."
      },
      {
        id: 92,
        title: "Zustand – async",
        tag: "library",
        code: `const useStore = create((set) => ({
  users: [],
  fetchUsers: async () => {
    const data = await fetch('/api/users').then(r => r.json());
    set({ users: data });
  },
}));`,
        note: "Async actions in Zustand are just async functions. No middleware needed."
      },
      {
        id: 93,
        title: "Redux Toolkit – slice",
        tag: "library",
        code: `import { createSlice } from '@reduxjs/toolkit';
const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: state => { state.value++ },     // Immer!
    decrement: state => { state.value-- },
    set: (state, action) => { state.value = action.payload },
  },
});
export const { increment, decrement, set } = counterSlice.actions;`,
        note: "RTK uses Immer — you can mutate state directly. Actions are auto-generated."
      },
      {
        id: 94,
        title: "Redux Toolkit – async thunk",
        tag: "library",
        code: `import { createAsyncThunk } from '@reduxjs/toolkit';
export const fetchUsers = createAsyncThunk(
  'users/fetchAll',
  async () => fetch('/api/users').then(r => r.json())
);
// In slice extraReducers:
builder.addCase(fetchUsers.fulfilled, (state, action) => {
  state.users = action.payload;
});`,
        note: "createAsyncThunk handles pending/fulfilled/rejected automatically."
      },
      {
        id: 95,
        title: "Jotai – atoms",
        tag: "library",
        code: `import { atom, useAtom } from 'jotai';
const countAtom = atom(0);
function Counter() {
  const [count, setCount] = useAtom(countAtom);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}`,
        note: "Jotai: atomic, bottom-up state. No boilerplate. Atoms are the unit of state."
      },
      {
        id: 96,
        title: "URL as state",
        tag: "pattern",
        code: `// Instead of useState for filters:
const [params, setParams] = useSearchParams();
const category = params.get('cat') ?? 'all';
const sort = params.get('sort') ?? 'date';
// State is in the URL — shareable, bookmarkable, browser-history-aware`,
        note: "For filters, pagination, and tabs — URL state is often better than useState."
      },
      {
        id: 97,
        title: "Server state vs client state",
        tag: "pattern",
        code: `// Server state → React Query / SWR
const { data: users } = useQuery(['users'], fetchUsers);
// Client/UI state → useState / Zustand
const [modalOpen, setModalOpen] = useState(false);
// Don't put server data into useState — let the cache own it`,
        note: "Server and UI state have different needs. Don't put API data in Redux."
      },
      {
        id: 98,
        title: "Context vs Zustand",
        tag: "pattern",
        code: `// Context: good for rarely-changing global data (theme, locale, auth)
// Zustand: good for frequently-changing shared state (cart, filters, UI)
// Rule of thumb: if it changes on user interaction → Zustand`,
        note: "Context re-renders all consumers. Zustand only re-renders components that use changed state."
      },
      {
        id: 99,
        title: "Immer for immutable updates",
        tag: "library",
        code: `import { produce } from 'immer';
const next = produce(state, draft => {
  draft.users[2].profile.name = 'Sav'; // "mutate" freely
  draft.users.push({ id: 99, name: 'New' });
});
// original state untouched, next is a new object`,
        note: "Immer lets you write intuitive mutations while producing immutable updates."
      },
      {
        id: 100,
        title: "Recoil – atoms & selectors",
        tag: "library",
        code: `import { atom, selector, useRecoilState, useRecoilValue } from 'recoil';
const textAtom = atom({ key: 'text', default: '' });
const lengthSelector = selector({
  key: 'textLen',
  get: ({ get }) => get(textAtom).length,
});`,
        note: "Recoil: React-native atomic state with derived selectors. Good for complex dependency graphs."
      },
    ]
  },
  {
    id: "patterns",
    label: "Patterns & Architecture",
    color: "#55efc4",
    icon: "🏗️",
    items: [
      {
        id: 101,
        title: "Container / Presentational",
        tag: "pattern",
        code: `// Container: fetches data, has logic
function UserListContainer() {
  const { data, isLoading } = useQuery(['users'], fetchUsers);
  return <UserList users={data} loading={isLoading} />;
}
// Presentational: pure rendering, easy to test
function UserList({ users, loading }) {
  if (loading) return <Skeleton />;
  return users.map(u => <UserCard key={u.id} user={u} />);
}`,
        note: "Separates concerns. Presentational components are easy to Storybook + test."
      },
      {
        id: 102,
        title: "Feature folder structure",
        tag: "pattern",
        code: `src/
  features/
    auth/
      components/   LoginForm.jsx
      hooks/        useAuth.js
      api/          authApi.js
      store/        authSlice.js
      index.js      (public API — export selectively)
  shared/
    components/   Button.jsx
    hooks/        useDebounce.js`,
        note: "Co-locate by feature, not by type. Import from features/auth, not deep paths."
      },
      {
        id: 103,
        title: "Barrel exports",
        tag: "pattern",
        code: `// features/auth/index.js
export { LoginForm } from './components/LoginForm';
export { useAuth } from './hooks/useAuth';
// Consumer:
import { LoginForm, useAuth } from 'features/auth';`,
        note: "Barrel files (index.js) create a clean public API for each feature."
      },
      {
        id: 104,
        title: "Absolute imports",
        tag: "pattern",
        code: `// vite.config.js
resolve: { alias: { '@': path.resolve(__dirname, 'src') } }
// jsconfig.json
{ "compilerOptions": { "paths": { "@/*": ["src/*"] } } }
// Usage:
import { Button } from '@/components/Button';`,
        note: "Eliminates ../../ relative import hell. Set up in Vite or CRA."
      },
      {
        id: 105,
        title: "Index pattern for components",
        tag: "pattern",
        code: `// Button/
//   Button.jsx
//   Button.test.jsx
//   Button.module.css
//   index.js  → export { default } from './Button'
// Import stays clean:
import Button from 'components/Button';`,
        note: "Each component is a folder with co-located tests and styles."
      },
      {
        id: 106,
        title: "Data normalisation",
        tag: "pattern",
        code: `// Instead of nested arrays:
const state = {
  usersById: { 1: { id:1, name:'Sav' }, 2: { id:2, name:'Jo' } },
  allIds: [1, 2],
};
// Access O(1) instead of find()/filter()
const user = usersById[userId];`,
        note: "Normalise API data for fast lookups. Use normalizr or RTK's createEntityAdapter."
      },
      {
        id: 107,
        title: "createEntityAdapter (RTK)",
        tag: "library",
        code: `import { createEntityAdapter } from '@reduxjs/toolkit';
const adapter = createEntityAdapter();
const slice = createSlice({
  name: 'users',
  initialState: adapter.getInitialState(),
  reducers: {
    addUser: adapter.addOne,
    updateUser: adapter.updateOne,
    removeUser: adapter.removeOne,
  }
});
export const { selectAll, selectById } = adapter.getSelectors(state => state.users);`,
        note: "RTK's entity adapter auto-normalises data and provides CRUD reducers + selectors."
      },
      {
        id: 108,
        title: "Singleton service pattern",
        tag: "pattern",
        code: `// api/client.js — module-level singleton
const client = axios.create({ baseURL: import.meta.env.VITE_API_URL });
client.interceptors.request.use(config => {
  config.headers.Authorization = \`Bearer \${getToken()}\`;
  return config;
});
export default client;`,
        note: "Create one Axios instance. Add auth/refresh interceptors once. Import everywhere."
      },
      {
        id: 109,
        title: "Observer / event emitter",
        tag: "pattern",
        code: `// Simple event bus (not for everything — prefer props/context)
const bus = new EventTarget();
// Emit
bus.dispatchEvent(new CustomEvent('cart:updated', { detail: { count: 3 } }));
// Listen
bus.addEventListener('cart:updated', e => console.log(e.detail.count));`,
        note: "Useful for decoupled cross-cutting events. Use sparingly — makes data flow harder to trace."
      },
      {
        id: 110,
        title: "Storybook-driven development",
        tag: "pattern",
        code: `// Button.stories.jsx
export default { component: Button };
export const Primary = { args: { variant: 'primary', children: 'Click' } };
export const Disabled = { args: { disabled: true, children: 'Nope' } };`,
        note: "Build and document components in isolation. Catches edge cases before integration."
      },
    ]
  },
  {
    id: "styling",
    label: "Styling",
    color: "#fdcb6e",
    icon: "💅",
    items: [
      {
        id: 111,
        title: "CSS Modules",
        tag: "styling",
        code: `// Button.module.css → .btn { color: red }
import styles from './Button.module.css';
<button className={styles.btn}>Click</button>
// Conditional:
<div className={\`\${styles.card} \${active ? styles.active : ''}\`} />`,
        note: "CSS Modules scope class names locally. No class name collisions."
      },
      {
        id: 112,
        title: "Tailwind CSS",
        tag: "styling",
        code: `<button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
  Submit
</button>
// Conditional (cn utility):
import { cn } from '@/lib/utils';
<div className={cn('base', active && 'active', error && 'text-red-500')} />`,
        note: "Tailwind is utility-first. Use the cn() / clsx() helper for conditional classes."
      },
      {
        id: 113,
        title: "clsx / cn helper",
        tag: "styling",
        code: `import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
export function cn(...inputs) { return twMerge(clsx(inputs)); }
// Usage:
<div className={cn('base-class', condition && 'active', props.className)} />`,
        note: "twMerge deduplicates conflicting Tailwind classes. Standard in shadcn/ui."
      },
      {
        id: 114,
        title: "CSS-in-JS (styled-components)",
        tag: "styling",
        code: `import styled from 'styled-components';
const Button = styled.button\`
  background: \${p => p.primary ? '#007bff' : 'white'};
  color: \${p => p.primary ? 'white' : '#007bff'};
  padding: 8px 16px;
\`;
<Button primary>Submit</Button>`,
        note: "Styled-components scope styles to components and support dynamic props."
      },
      {
        id: 115,
        title: "CSS custom properties in React",
        tag: "styling",
        code: `// Set via style prop
<div style={{ '--accent': color }} />
// In CSS: color: var(--accent);
// Theme toggling
<body style={{ '--bg': dark ? '#111' : '#fff' }}>`,
        note: "CSS variables are the most performant way to do runtime theming."
      },
      {
        id: 116,
        title: "Inline styles",
        tag: "styling",
        code: `// Object, not string. camelCase properties
<div style={{
  backgroundColor: '#fff',
  marginTop: 16,    // px assumed for numbers
  transform: \`translateX(\${offset}px)\`,
}} />`,
        note: "Inline styles use camelCase. Numbers are treated as px (except unitless properties)."
      },
      {
        id: 117,
        title: "CSS animations",
        tag: "styling",
        code: `// Framer Motion
import { motion } from 'framer-motion';
<motion.div
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.3 }}
/>`,
        note: "Framer Motion is the most powerful React animation library."
      },
      {
        id: 118,
        title: "Dynamic className",
        tag: "styling",
        code: `const variants = {
  primary: 'bg-blue-600 text-white',
  danger:  'bg-red-600 text-white',
  ghost:   'bg-transparent border',
};
<button className={variants[variant]}>Click</button>`,
        note: "Map variant prop to class string. Clean, easy to extend."
      },
      {
        id: 119,
        title: "Responsive styles",
        tag: "styling",
        code: `// Tailwind responsive prefixes
<div className="flex-col md:flex-row lg:gap-8">
// CSS Modules with media query
@media (min-width: 768px) { .grid { grid-template-columns: repeat(3, 1fr); } }`,
        note: "Tailwind uses mobile-first breakpoints. Prefix any utility with sm/md/lg/xl."
      },
      {
        id: 120,
        title: "Dark mode",
        tag: "styling",
        code: `// Tailwind (class strategy)
<html className={dark ? 'dark' : ''}>
<div className="bg-white dark:bg-gray-900 text-black dark:text-white">
// CSS variables strategy:
:root { --bg: #fff; --text: #000; }
.dark { --bg: #111; --text: #fff; }`,
        note: "Class-based dark mode gives you full control. Persist user preference in localStorage."
      },
    ]
  },
  {
    id: "typescript",
    label: "TypeScript",
    color: "#3498db",
    icon: "📘",
    items: [
      {
        id: 121,
        title: "React.FC (avoid it)",
        tag: "typescript",
        code: `// ❌ Avoid React.FC — implicit children, less flexible
const Foo: React.FC<Props> = (props) => {};
// ✅ Preferred — explicit return type
function Foo(props: FooProps): JSX.Element {}
// Or just let TypeScript infer:
function Foo({ name }: { name: string }) {}`,
        note: "React.FC adds implicit children and makes generic components harder. Avoid it."
      },
      {
        id: 122,
        title: "ReactNode vs JSX.Element",
        tag: "typescript",
        code: `// ReactNode: anything React can render (most permissive)
// JSX.Element: a React element specifically
// ReactElement: same as JSX.Element
interface Props {
  children: React.ReactNode;   // for children prop
  icon?: JSX.Element;          // for explicit elements
  render: () => React.ReactNode; // for render functions
}`,
        note: "Use ReactNode for children. Use JSX.Element when you specifically need a React element."
      },
      {
        id: 123,
        title: "Event types",
        tag: "typescript",
        code: `// Common event handler types
onChange: React.ChangeEvent<HTMLInputElement>
onClick:  React.MouseEvent<HTMLButtonElement>
onSubmit: React.FormEvent<HTMLFormElement>
onKeyDown: React.KeyboardEvent<HTMLInputElement>
// Handler type:
const handle = (e: React.ChangeEvent<HTMLInputElement>) =>
  setValue(e.target.value);`,
        note: "All React synthetic events are generic over the element type."
      },
      {
        id: 124,
        title: "Discriminated unions",
        tag: "typescript",
        code: `type Status =
  | { state: 'loading' }
  | { state: 'error';   error: Error }
  | { state: 'success'; data: User[] };

function render(status: Status) {
  if (status.state === 'error') return status.error.message; // TS knows!
}`,
        note: "Discriminated unions model async states perfectly and narrow types automatically."
      },
      {
        id: 125,
        title: "Generic components",
        tag: "typescript",
        code: `function List<T>({ items, renderItem }: {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}) {
  return <>{items.map(renderItem)}</>;
}
<List items={users} renderItem={(u) => <UserCard user={u} />} />`,
        note: "Generic components preserve type through rendering logic."
      },
      {
        id: 126,
        title: "useRef types",
        tag: "typescript",
        code: `// DOM ref — initialise with null
const ref = useRef<HTMLInputElement>(null);
ref.current?.focus(); // optional chaining needed
// Mutable ref — initialise with value (no null)
const count = useRef<number>(0);
count.current++; // no optional chaining needed`,
        note: "null initial value = DOM ref (nullable). Non-null = mutable instance variable."
      },
      {
        id: 127,
        title: "Type assertions (avoid when possible)",
        tag: "typescript",
        code: `// Last resort only
const el = document.getElementById('root') as HTMLElement;
// Better — check first
const el = document.getElementById('root');
if (!el) throw new Error('Root element not found');`,
        note: "Type assertions bypass type checking. Prefer type guards when possible."
      },
      {
        id: 128,
        title: "Utility types",
        tag: "typescript",
        code: `type PartialUser = Partial<User>;       // all props optional
type RequiredUser = Required<User>;     // all props required
type ReadonlyUser = Readonly<User>;     // no mutations
type UserPreview = Pick<User, 'id' | 'name'>; // subset
type NoPassword = Omit<User, 'password'>;     // exclude
type UserOrAdmin = User | Admin;        // union`,
        note: "Utility types transform existing types. Master these and you'll rarely need duplication."
      },
      {
        id: 129,
        title: "Satisfies operator",
        tag: "typescript",
        code: `const config = {
  host: 'localhost',
  port: 5432,
} satisfies Record<string, string | number>;
// Inferred as { host: string; port: number }
// NOT Record<string, string | number>
// Best of both: validation + precise inference`,
        note: "satisfies validates a value matches a type without widening its inferred type."
      },
      {
        id: 130,
        title: "Branded types",
        tag: "typescript",
        code: `type UserId = string & { readonly __brand: 'UserId' };
type PostId = string & { readonly __brand: 'PostId' };
// Can't accidentally pass UserId where PostId expected
function getPost(id: PostId) {}
getPost(userId as PostId); // requires explicit cast`,
        note: "Branded types catch semantic errors that structural typing misses."
      },
    ]
  },
  {
    id: "testing",
    label: "Testing",
    color: "#e17055",
    icon: "🧪",
    items: [
      {
        id: 131,
        title: "React Testing Library – render",
        tag: "testing",
        code: `import { render, screen } from '@testing-library/react';
test('shows user name', () => {
  render(<UserCard name="Sav" />);
  expect(screen.getByText('Sav')).toBeInTheDocument();
});`,
        note: "RTL tests behaviour, not implementation. Query by what users see."
      },
      {
        id: 132,
        title: "RTL – user events",
        tag: "testing",
        code: `import userEvent from '@testing-library/user-event';
test('increments counter', async () => {
  const user = userEvent.setup();
  render(<Counter />);
  await user.click(screen.getByRole('button', { name: /increment/i }));
  expect(screen.getByText('1')).toBeInTheDocument();
});`,
        note: "userEvent simulates real user interactions. Prefer over fireEvent."
      },
      {
        id: 133,
        title: "RTL – async",
        tag: "testing",
        code: `test('loads users', async () => {
  render(<UserList />);
  expect(screen.getByText(/loading/i)).toBeInTheDocument();
  await screen.findByText('Sav'); // waits for element
  expect(screen.getByText('Sav')).toBeInTheDocument();
});`,
        note: "findBy* queries are async and wait up to 1s. Use for async rendering."
      },
      {
        id: 134,
        title: "Mocking fetch / axios",
        tag: "testing",
        code: `import { rest } from 'msw';
import { setupServer } from 'msw/node';
const server = setupServer(
  rest.get('/api/users', (req, res, ctx) =>
    res(ctx.json([{ id: 1, name: 'Sav' }]))
  )
);
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());`,
        note: "MSW (Mock Service Worker) intercepts network requests. Most realistic mocking approach."
      },
      {
        id: 135,
        title: "Testing hooks – renderHook",
        tag: "testing",
        code: `import { renderHook, act } from '@testing-library/react';
test('useCounter', () => {
  const { result } = renderHook(() => useCounter(0));
  act(() => result.current.increment());
  expect(result.current.count).toBe(1);
});`,
        note: "renderHook lets you test custom hooks in isolation without a component."
      },
      {
        id: 136,
        title: "Vitest setup",
        tag: "testing",
        code: `// vite.config.js
test: {
  globals: true,
  environment: 'jsdom',
  setupFiles: './src/test/setup.js',
}
// setup.js
import '@testing-library/jest-dom';`,
        note: "Vitest is the fastest test runner for Vite projects. Same API as Jest."
      },
      {
        id: 137,
        title: "Snapshot testing",
        tag: "testing",
        code: `test('renders correctly', () => {
  const { asFragment } = render(<Button>Click</Button>);
  expect(asFragment()).toMatchSnapshot();
});
// Update snapshots: npx vitest -u`,
        note: "Snapshots catch unintended UI changes. Review every diff — they can create false confidence."
      },
      {
        id: 138,
        title: "Mock module",
        tag: "testing",
        code: `// Vitest
vi.mock('../api/users', () => ({
  fetchUsers: vi.fn().mockResolvedValue([{ id: 1, name: 'Sav' }]),
}));
// Jest
jest.mock('../api/users', () => ({ fetchUsers: jest.fn() }));`,
        note: "Mock modules to isolate units under test from their dependencies."
      },
      {
        id: 139,
        title: "Accessibility testing",
        tag: "testing",
        code: `import { axe, toHaveNoViolations } from 'jest-axe';
expect.extend(toHaveNoViolations);
test('has no a11y violations', async () => {
  const { container } = render(<LoginForm />);
  expect(await axe(container)).toHaveNoViolations();
});`,
        note: "jest-axe catches a11y violations automatically in your test suite."
      },
      {
        id: 140,
        title: "Playwright E2E",
        tag: "testing",
        code: `import { test, expect } from '@playwright/test';
test('user can login', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[name=email]', 'sav@example.com');
  await page.fill('[name=password]', 'password');
  await page.click('[type=submit]');
  await expect(page).toHaveURL('/dashboard');
});`,
        note: "Playwright runs real browser tests. Essential for critical user flows."
      },
    ]
  },
  {
    id: "advanced",
    label: "Advanced Patterns",
    color: "#00b894",
    icon: "🔬",
    items: [
      {
        id: 141,
        title: "Concurrent mode – startTransition",
        tag: "advanced",
        code: `// Mark low-priority state updates
import { startTransition } from 'react';
startTransition(() => {
  setTabContent(heavyComputation());
});`,
        note: "startTransition lets React interrupt low-priority renders for high-priority updates."
      },
      {
        id: 142,
        title: "Server Components (Next.js)",
        tag: "advanced",
        code: `// app/page.jsx — Server Component by default
async function Page() {
  const data = await fetch('https://api.example.com/data'); // runs on server
  const json = await data.json();
  return <ClientComponent data={json} />;
}`,
        note: "Server Components fetch and render on the server. Zero JS sent to client."
      },
      {
        id: 143,
        title: "use() hook (React 19)",
        tag: "advanced",
        code: `import { use } from 'react';
// Unwrap a promise — works with Suspense
function UserProfile({ userPromise }) {
  const user = use(userPromise); // suspends until resolved
  return <div>{user.name}</div>;
}
// Also works with Context:
const theme = use(ThemeContext);`,
        note: "React 19's use() can unwrap promises and context inside components and if blocks."
      },
      {
        id: 144,
        title: "useOptimistic (React 19)",
        tag: "advanced",
        code: `const [optimisticLikes, addOptimisticLike] = useOptimistic(
  likes,
  (currentLikes, newLike) => [...currentLikes, newLike]
);
async function handleLike() {
  addOptimisticLike(newLike); // immediate UI update
  await saveLike(newLike);    // actual server call
}`,
        note: "React 19 built-in optimistic updates. Rolls back automatically on error."
      },
      {
        id: 145,
        title: "Server Actions (Next.js 14+)",
        tag: "advanced",
        code: `// actions.js — 'use server' makes it a server action
'use server';
export async function createUser(formData) {
  const name = formData.get('name');
  await db.users.create({ name });
}
// Component:
<form action={createUser}>
  <input name="name" />
  <button type="submit">Create</button>
</form>`,
        note: "Server Actions run on the server, called from the client. Progressive enhancement built-in."
      },
      {
        id: 146,
        title: "Streaming with Suspense",
        tag: "advanced",
        code: `// Next.js app router streams in order
export default function Page() {
  return (
    <>
      <Header />  {/* sent immediately */}
      <Suspense fallback={<Skeleton />}>
        <SlowDataComponent /> {/* streamed when ready */}
      </Suspense>
    </>
  );
}`,
        note: "Suspense boundaries let Next.js stream HTML progressively. Faster TTFB."
      },
      {
        id: 147,
        title: "Compound components with Context",
        tag: "advanced",
        code: `const TabCtx = createContext();
function Tabs({ children, defaultTab }) {
  const [active, setActive] = useState(defaultTab);
  return <TabCtx.Provider value={{ active, setActive }}>{children}</TabCtx.Provider>;
}
Tabs.List = function({ children }) { return <div role="tablist">{children}</div>; }
Tabs.Tab  = function({ value, children }) {
  const { active, setActive } = useContext(TabCtx);
  return <button role="tab" aria-selected={active===value} onClick={() => setActive(value)}>{children}</button>;
}`,
        note: "Context-powered compound components share state without prop drilling."
      },
      {
        id: 148,
        title: "Dynamic import with ternary",
        tag: "advanced",
        code: `const icons = {
  home: lazy(() => import('./icons/Home')),
  user: lazy(() => import('./icons/User')),
};
const Icon = icons[name];
return <Suspense fallback={null}><Icon /></Suspense>;`,
        note: "Dynamically choose which lazy component to render based on runtime data."
      },
      {
        id: 149,
        title: "Strict Mode",
        tag: "advanced",
        code: `// index.jsx
<React.StrictMode>
  <App />
</React.StrictMode>
// Effects run twice in dev to expose side effects
// Helps catch: impure renders, deprecated APIs, memory leaks`,
        note: "Keep StrictMode on. Double-invoking effects is intentional — it finds bugs early."
      },
      {
        id: 150,
        title: "Custom event system",
        tag: "advanced",
        code: `// Typed event bus with hooks
function useEventBus<T>(eventName: string, handler: (data: T) => void) {
  useEffect(() => {
    const listener = (e: CustomEvent<T>) => handler(e.detail);
    window.addEventListener(eventName, listener as any);
    return () => window.removeEventListener(eventName, listener as any);
  }, [eventName, handler]);
}`,
        note: "Typed custom events for decoupled, cross-component communication."
      },
    ]
  },
  {
    id: "nextjs",
    label: "Next.js",
    color: "#dfe6e9",
    icon: "▲",
    items: [
      {
        id: 151,
        title: "App Router basics",
        tag: "nextjs",
        code: `app/
  layout.jsx      // Root layout (always rendered)
  page.jsx        // Home route /
  about/
    page.jsx      // /about
  users/
    [id]/
      page.jsx    // /users/:id
  loading.jsx     // Suspense fallback
  error.jsx       // Error boundary`,
        note: "App Router uses file-system routing. layout.jsx wraps all children in the segment."
      },
      {
        id: 152,
        title: "generateMetadata",
        tag: "nextjs",
        code: `export async function generateMetadata({ params }) {
  const user = await fetchUser(params.id);
  return {
    title: user.name,
    description: \`Profile of \${user.name}\`,
    openGraph: { images: [user.avatar] },
  };
}`,
        note: "generateMetadata is async and has access to params/searchParams for dynamic meta."
      },
      {
        id: 153,
        title: "generateStaticParams",
        tag: "nextjs",
        code: `export async function generateStaticParams() {
  const users = await fetchUsers();
  return users.map(u => ({ id: String(u.id) }));
}
// Pre-generates /users/1, /users/2, etc. at build time`,
        note: "Replaces getStaticPaths from pages router. Runs at build time."
      },
      {
        id: 154,
        title: "Route handlers (API)",
        tag: "nextjs",
        code: `// app/api/users/route.js
export async function GET(request) {
  const users = await db.users.findAll();
  return Response.json(users);
}
export async function POST(request) {
  const body = await request.json();
  const user = await db.users.create(body);
  return Response.json(user, { status: 201 });
}`,
        note: "Route handlers replace /pages/api/. Each HTTP method is an exported function."
      },
      {
        id: 155,
        title: "Middleware",
        tag: "nextjs",
        code: `// middleware.js at project root
export function middleware(request) {
  const token = request.cookies.get('token');
  if (!token) return NextResponse.redirect(new URL('/login', request.url));
  return NextResponse.next();
}
export const config = { matcher: ['/dashboard/:path*'] };`,
        note: "Middleware runs at the Edge before requests reach pages. Perfect for auth guards."
      },
      {
        id: 156,
        title: "Image component",
        tag: "nextjs",
        code: `import Image from 'next/image';
<Image
  src="/avatar.jpg"
  alt="User avatar"
  width={64}
  height={64}
  priority // LCP image — don't lazy load
/>`,
        note: "next/image auto-optimises, lazy-loads, and prevents CLS. Always use it over <img>."
      },
      {
        id: 157,
        title: "Link component",
        tag: "nextjs",
        code: `import Link from 'next/link';
<Link href="/about">About</Link>
// Programmatic:
import { useRouter } from 'next/navigation';
const router = useRouter();
router.push('/dashboard');`,
        note: "next/link prefetches the linked page in the background when it enters the viewport."
      },
      {
        id: 158,
        title: "Environment variables",
        tag: "nextjs",
        code: `// .env.local
DATABASE_URL=postgres://...   // server only
NEXT_PUBLIC_API_URL=https://...  // accessible in browser
// Usage:
const url = process.env.NEXT_PUBLIC_API_URL; // client
const db  = process.env.DATABASE_URL;        // server only`,
        note: "Only NEXT_PUBLIC_ vars are exposed to the browser. Never put secrets in NEXT_PUBLIC_."
      },
      {
        id: 159,
        title: "Revalidation",
        tag: "nextjs",
        code: `// Time-based (ISR)
fetch('/api/data', { next: { revalidate: 60 } }); // revalidate every 60s
// On-demand:
import { revalidatePath, revalidateTag } from 'next/cache';
revalidatePath('/blog');
revalidateTag('posts'); // all fetches tagged with 'posts'`,
        note: "Next.js 14 caching: use revalidate for ISR, revalidateTag for on-demand purging."
      },
      {
        id: 160,
        title: "cookies() and headers()",
        tag: "nextjs",
        code: `import { cookies, headers } from 'next/headers';
// Server Component:
const token = cookies().get('token')?.value;
const userAgent = headers().get('user-agent');`,
        note: "cookies() and headers() are async-safe server-side APIs for reading request data."
      },
    ]
  },
  {
    id: "a11y",
    label: "Accessibility & Misc",
    color: "#fab1a0",
    icon: "♿",
    items: [
      {
        id: 161,
        title: "ARIA roles & labels",
        tag: "a11y",
        code: `<nav aria-label="Main navigation">
<button aria-expanded={open} aria-controls="menu">Menu</button>
<ul id="menu" role="menu">
  <li role="menuitem"><a href="/">Home</a></li>
</ul>`,
        note: "ARIA adds semantics that HTML alone can't express. Don't use ARIA to patch bad HTML."
      },
      {
        id: 162,
        title: "Focus management",
        tag: "a11y",
        code: `// Move focus to modal when it opens
useEffect(() => {
  if (isOpen) firstFocusableRef.current?.focus();
}, [isOpen]);
// Trap focus inside modal with focus-trap-react library`,
        note: "Modal focus trap is crucial for keyboard users. Return focus to trigger on close."
      },
      {
        id: 163,
        title: "Live regions",
        tag: "a11y",
        code: `// Announce dynamic content to screen readers
<div aria-live="polite">
  {message && <span>{message}</span>}
</div>
// For critical alerts:
<div aria-live="assertive" role="alert">{error}</div>`,
        note: "aria-live announces dynamic changes to screen readers. polite = wait, assertive = interrupt."
      },
      {
        id: 164,
        title: "Skip navigation link",
        tag: "a11y",
        code: `// Usually hidden, visible on focus
<a
  href="#main"
  className="sr-only focus:not-sr-only focus:fixed focus:top-0"
>
  Skip to main content
</a>
<main id="main">...</main>`,
        note: "Skip links let keyboard users bypass nav on every page. Required for WCAG AA."
      },
      {
        id: 165,
        title: "Visually hidden (sr-only)",
        tag: "a11y",
        code: `// CSS
.sr-only {
  position: absolute; width: 1px; height: 1px;
  padding: 0; margin: -1px; overflow: hidden;
  clip: rect(0,0,0,0); white-space: nowrap; border-width: 0;
}
// Use for: icon-only buttons, additional context for screen readers
<button><Icon /><span className="sr-only">Delete item</span></button>`,
        note: "Visually hidden text is read by screen readers but invisible on screen."
      },
      {
        id: 166,
        title: "useId for form labels",
        tag: "a11y",
        code: `function Field({ label, ...props }) {
  const id = useId();
  return (
    <>
      <label htmlFor={id}>{label}</label>
      <input id={id} {...props} />
    </>
  );
}`,
        note: "Always associate labels with inputs. useId generates stable SSR-safe IDs."
      },
      {
        id: 167,
        title: "Keyboard shortcuts",
        tag: "a11y",
        code: `useEffect(() => {
  const handler = (e) => {
    if (e.key === 'Escape') onClose();
    if (e.key === '/' && !e.ctrlKey) searchRef.current?.focus();
  };
  document.addEventListener('keydown', handler);
  return () => document.removeEventListener('keydown', handler);
}, [onClose]);`,
        note: "Keyboard shortcuts improve power-user experience. Escape for modals is essential."
      },
      {
        id: 168,
        title: "Environment detection",
        tag: "misc",
        code: `const isDev  = process.env.NODE_ENV === 'development';
const isProd = process.env.NODE_ENV === 'production';
const isSSR  = typeof window === 'undefined';
// Safely access browser APIs:
const isBrowser = typeof window !== 'undefined';`,
        note: "Check for window before using browser APIs — they don't exist on the server in SSR."
      },
      {
        id: 169,
        title: "React DevTools",
        tag: "misc",
        code: `// Profiler tab: record render times, why components re-rendered
// Components tab: inspect state/props/context
// Highlight updates: shows which components re-render on interaction
// Find slow renders: look for flame chart bars > 16ms`,
        note: "React DevTools Profiler is the primary tool for diagnosing performance problems."
      },
      {
        id: 170,
        title: "Why did this render?",
        tag: "misc",
        code: `import { useWhyDidYouUpdate } from 'ahooks';
// Logs which props/state changed on every render
useWhyDidYouUpdate('UserCard', props);
// Or with @welldone-software/why-did-you-render:
UserCard.whyDidYouRender = true;`,
        note: "Diagnose unexpected re-renders. Remove from production."
      },
    ]
  },
  {
    id: "patterns2",
    label: "More Patterns",
    color: "#81ecec",
    icon: "✨",
    items: [
      {
        id: 171,
        title: "Debounce API call",
        tag: "pattern",
        code: `const [query, setQuery] = useState('');
const debouncedQuery = useDebounce(query, 400);
const { data } = useQuery(
  ['search', debouncedQuery],
  () => searchAPI(debouncedQuery),
  { enabled: debouncedQuery.length > 2 }
);`,
        note: "enabled: false prevents the query from running until conditions are met."
      },
      {
        id: 172,
        title: "Intersection Observer",
        tag: "pattern",
        code: `const ref = useRef(null);
const [visible, setVisible] = useState(false);
useEffect(() => {
  const obs = new IntersectionObserver(([entry]) =>
    setVisible(entry.isIntersecting), { threshold: 0.1 }
  );
  if (ref.current) obs.observe(ref.current);
  return () => obs.disconnect();
}, []);
<div ref={ref}>{visible && <HeavyComponent />}</div>`,
        note: "IntersectionObserver drives lazy loading, infinite scroll, and animation triggers."
      },
      {
        id: 173,
        title: "Copy to clipboard",
        tag: "pattern",
        code: `async function copy(text) {
  await navigator.clipboard.writeText(text);
  setCopied(true);
  setTimeout(() => setCopied(false), 2000);
}
<button onClick={() => copy(code)}>
  {copied ? '✓ Copied' : 'Copy'}
</button>`,
        note: "navigator.clipboard requires HTTPS. Show temporary feedback after copying."
      },
      {
        id: 174,
        title: "Drag and drop",
        tag: "pattern",
        code: `// @dnd-kit/core
import { DndContext } from '@dnd-kit/core';
<DndContext onDragEnd={handleDragEnd}>
  <SortableContext items={ids}>
    {items.map(item => <SortableItem key={item.id} id={item.id} />)}
  </SortableContext>
</DndContext>`,
        note: "@dnd-kit is the modern, accessible DnD library. Works with keyboard and touch."
      },
      {
        id: 175,
        title: "Toast notifications",
        tag: "pattern",
        code: `import { toast } from 'sonner';
// Call from anywhere
toast.success('Saved!');
toast.error('Something went wrong');
toast.promise(saveUser(), {
  loading: 'Saving...', success: 'Saved!', error: 'Error',
});
// Add <Toaster /> to app root`,
        note: "Sonner is the simplest, best-looking toast library for React."
      },
      {
        id: 176,
        title: "Polling",
        tag: "pattern",
        code: `const { data } = useQuery({
  queryKey: ['status'],
  queryFn: fetchStatus,
  refetchInterval: 5000,       // every 5s
  refetchIntervalInBackground: false, // pause when tab unfocused
});`,
        note: "React Query's refetchInterval handles polling. Stop when data is in terminal state."
      },
      {
        id: 177,
        title: "WebSocket",
        tag: "pattern",
        code: `useEffect(() => {
  const ws = new WebSocket('wss://api.example.com/live');
  ws.onmessage = (e) => setMessages(prev => [...prev, JSON.parse(e.data)]);
  ws.onerror   = (e) => console.error(e);
  return () => ws.close();
}, []);`,
        note: "Always close WebSocket connections in the cleanup function."
      },
      {
        id: 178,
        title: "PWA / Service Worker",
        tag: "misc",
        code: `// vite-plugin-pwa
plugins: [VitePWA({
  registerType: 'autoUpdate',
  workbox: { globPatterns: ['**/*.{js,css,html,png}'] },
  manifest: {
    name: 'My App',
    theme_color: '#007bff',
  }
})]`,
        note: "VitePWA makes your app installable and offline-capable with minimal config."
      },
      {
        id: 179,
        title: "useSyncExternalStore",
        tag: "hook",
        code: `function useOnlineStatus() {
  return useSyncExternalStore(
    (callback) => {
      window.addEventListener('online', callback);
      window.addEventListener('offline', callback);
      return () => { /* removeEventListener */ };
    },
    () => navigator.onLine,   // client snapshot
    () => true,               // server snapshot
  );
}`,
        note: "The correct way to subscribe to external stores in React 18. Prevents tearing."
      },
      {
        id: 180,
        title: "Component composition vs inheritance",
        tag: "pattern",
        code: `// ✅ Composition (React way)
function FancyButton({ children, ...props }) {
  return <Button className="fancy" {...props}>{children}</Button>;
}
// ❌ Inheritance (avoid)
class FancyButton extends Button { ... }`,
        note: "React is built for composition. Inheritance is an anti-pattern for components."
      },
      {
        id: 181,
        title: "Object.entries mapping",
        tag: "pattern",
        code: `const statusColors = { active: 'green', paused: 'yellow', deleted: 'red' };
{Object.entries(statusColors).map(([status, color]) => (
  <Badge key={status} status={status} color={color} />
))}`,
        note: "Object.entries lets you map over objects. Always add a key."
      },
      {
        id: 182,
        title: "Group by / categorise",
        tag: "pattern",
        code: `// Group array by a property
const grouped = items.reduce((acc, item) => {
  const key = item.category;
  return { ...acc, [key]: [...(acc[key] ?? []), item] };
}, {});
// Render:
{Object.entries(grouped).map(([cat, items]) => (
  <Section key={cat} title={cat} items={items} />
))}`,
        note: "reduce into an object, then render with Object.entries. Classic grouping pattern."
      },
      {
        id: 183,
        title: "Flatten / dedup",
        tag: "pattern",
        code: `// Flatten
const flat = nested.flatMap(group => group.items);
// Deduplicate by id
const unique = [...new Map(items.map(i => [i.id, i])).values()];`,
        note: "flatMap flattens one level. Map deduplication is O(n) and preserves last occurrence."
      },
      {
        id: 184,
        title: "Sort array immutably",
        tag: "pattern",
        code: `// Always spread first — sort() mutates!
const sorted = [...items].sort((a, b) => a.name.localeCompare(b.name));
// Numeric:
const byPrice = [...items].sort((a, b) => a.price - b.price);`,
        note: "Array.sort mutates. Spread a copy first to keep state immutable."
      },
      {
        id: 185,
        title: "Nullish coalescing & optional chaining",
        tag: "pattern",
        code: `// ?? — fallback only for null/undefined (not 0 or '')
const name = user?.profile?.name ?? 'Anonymous';
const count = data?.items?.length ?? 0;
// vs || (treats 0 and '' as falsy — often wrong!)
const port = config.port ?? 3000; // safe — preserves 0`,
        note: "Prefer ?? over ||. Optional chaining (?.) prevents TypeError on deep access."
      },
      {
        id: 186,
        title: "Object destructuring with rename",
        tag: "pattern",
        code: `const { name: userName, age: userAge = 18 } = user;
// Props with rename:
function Card({ class: className, for: htmlFor }) {}`,
        note: "Rename while destructuring with colon. Default values with equals."
      },
      {
        id: 187,
        title: "Array destructuring",
        tag: "pattern",
        code: `const [first, second, ...rest] = items;
const [, secondItem] = items; // skip first with comma
// Swap values:
[a, b] = [b, a];`,
        note: "Skip elements with empty commas. Rest operator collects remaining items."
      },
      {
        id: 188,
        title: "Template literals",
        tag: "pattern",
        code: `// Multi-line
const query = \`
  SELECT * FROM users
  WHERE id = \${userId}
  AND active = true
\`;
// Tagged template (styled-components, GraphQL, SQL)
const result = sql\`SELECT * FROM \${table} WHERE id = \${id}\`;`,
        note: "Tagged templates power styled-components and SQL query builders."
      },
      {
        id: 189,
        title: "Short-circuit evaluation",
        tag: "pattern",
        code: `// Call function only if it exists
callback?.();
// Assign only if undefined
config.timeout ??= 5000;
// Logical assignment
user.role ||= 'viewer'; // assign if falsy
user.name &&= user.name.trim(); // assign if truthy`,
        note: "Logical assignment operators (??=, ||=, &&=) are ES2021 and very handy."
      },
      {
        id: 190,
        title: "Object shorthand & computed keys",
        tag: "pattern",
        code: `const name = 'Sav';
const age = 30;
// Shorthand
const user = { name, age }; // { name: 'Sav', age: 30 }
// Computed keys
const key = 'email';
const obj = { [key]: 'sav@example.com' };
// Dynamic dispatch
const handlers = { click: handleClick, hover: handleHover };
handlers[eventType]?.(event);`,
        note: "Computed property keys enable dynamic dispatch tables — great for avoiding switch statements."
      },
      {
        id: 191,
        title: "Promise.all / allSettled",
        tag: "pattern",
        code: `// All succeed or all fail
const [users, posts] = await Promise.all([fetchUsers(), fetchPosts()]);
// Handle mixed success/failure
const results = await Promise.allSettled([fetchA(), fetchB()]);
results.forEach(r => {
  if (r.status === 'fulfilled') use(r.value);
  if (r.status === 'rejected')  logError(r.reason);
});`,
        note: "allSettled never rejects — each result tells you if it succeeded or failed."
      },
      {
        id: 192,
        title: "WeakMap / WeakRef for cache",
        tag: "pattern",
        code: `const cache = new WeakMap();
function getMetadata(el) {
  if (!cache.has(el)) cache.set(el, computeMeta(el));
  return cache.get(el);
}
// GC can collect el when no other references exist`,
        note: "WeakMap caches don't prevent garbage collection of keys. Perfect for DOM-associated data."
      },
      {
        id: 193,
        title: "CSS grid layout",
        tag: "styling",
        code: `// Responsive auto-fill grid
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1rem;
}
// In Tailwind:
<div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">`,
        note: "auto-fill with minmax creates responsive grids with no media queries needed."
      },
      {
        id: 194,
        title: "CSS container queries",
        tag: "styling",
        code: `/* Component responds to its container, not viewport */
.card-wrapper { container-type: inline-size; }
@container (min-width: 400px) {
  .card { flex-direction: row; }
}`,
        note: "Container queries are the future of responsive components. Supported in all modern browsers."
      },
      {
        id: 195,
        title: "vite.config.js — common setup",
        tag: "tooling",
        code: `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  server: { port: 3000, proxy: { '/api': 'http://localhost:8000' } },
});`,
        note: "API proxy in Vite dev server avoids CORS issues during development."
      },
      {
        id: 196,
        title: "ESLint + Prettier",
        tag: "tooling",
        code: `// .eslintrc.json
{
  "extends": ["react-app", "plugin:react-hooks/recommended"],
  "rules": { "no-console": "warn" }
}
// .prettierrc
{ "semi": true, "singleQuote": true, "tabWidth": 2 }
// package.json scripts:
"lint": "eslint src --ext .js,.jsx,.ts,.tsx",
"format": "prettier --write src"`,
        note: "ESLint catches errors, Prettier formats. Run both in CI and as pre-commit hooks."
      },
      {
        id: 197,
        title: "Husky pre-commit hooks",
        tag: "tooling",
        code: `// package.json
"lint-staged": {
  "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
  "*.{css,md,json}": "prettier --write"
}
// .husky/pre-commit:
npx lint-staged`,
        note: "lint-staged only lints changed files — much faster than linting everything."
      },
      {
        id: 198,
        title: "Environment variables (Vite)",
        tag: "tooling",
        code: `// .env
VITE_API_URL=http://localhost:8000
// Access (VITE_ prefix required for client exposure)
const url = import.meta.env.VITE_API_URL;
const isDev = import.meta.env.DEV;
const mode  = import.meta.env.MODE; // 'development' | 'production'`,
        note: "Vite uses import.meta.env (not process.env). Only VITE_ prefixed vars are exposed."
      },
      {
        id: 199,
        title: "Bundle analysis",
        tag: "tooling",
        code: `// vite-bundle-visualizer
import { visualizer } from 'rollup-plugin-visualizer';
plugins: [visualizer({ open: true })]
// Run: npx vite build
// Opens treemap of bundle size — find large dependencies`,
        note: "Run bundle analysis regularly. Large deps (moment, lodash) often have lighter alternatives."
      },
      {
        id: 200,
        title: "React Query DevTools",
        tag: "tooling",
        code: `import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
// Add to app root (renders only in dev)
<QueryClientProvider client={queryClient}>
  <App />
  <ReactQueryDevtools initialIsOpen={false} />
</QueryClientProvider>`,
        note: "Inspect cache, query status, stale time, and trigger manual refetches in the UI."
      },
    ]
  }
];

const ALL_ITEMS = SECTIONS.flatMap(s => s.items.map(item => ({ ...item, sectionId: s.id, sectionLabel: s.label, color: s.color })));

// ============================================================
// SYNTAX HIGHLIGHTING (simple tokenizer)
// ============================================================
function highlight(code) {
  const escaped = code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return escaped
    .replace(/(\/\/[^\n]*)/g, '<span class="c">$1</span>')
    .replace(/\b(import|export|from|const|let|var|function|return|async|await|new|if|else|switch|case|default|class|extends|try|catch|finally|throw|typeof|instanceof|in|of|for|while|true|false|null|undefined|void|this|super|static|get|set|type|interface|enum)\b/g, '<span class="kw">$1</span>')
    .replace(/\b(useState|useEffect|useRef|useCallback|useMemo|useReducer|useContext|useId|useLayoutEffect|useTransition|useDeferredValue|useSyncExternalStore|useOptimistic|createContext|memo|forwardRef|lazy|Suspense|Fragment|useImperativeHandle)\b/g, '<span class="hook">$1</span>')
    .replace(/(`[^`]*`)/g, '<span class="str">$1</span>')
    .replace(/('[^']*')/g, '<span class="str">$1</span>')
    .replace(/("(?:[^"\\]|\\.)*")/g, '<span class="str">$1</span>')
    .replace(/\b(\d+)\b/g, '<span class="num">$1</span>');
}

// ============================================================
// CODE BLOCK
// ============================================================
function CodeBlock({ code }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <div style={{ position: 'relative', marginTop: 8 }}>
      <pre
        style={{
          background: '#0d1117',
          border: '1px solid #30363d',
          borderRadius: 8,
          padding: '12px 14px',
          fontSize: 12,
          lineHeight: 1.65,
          overflowX: 'auto',
          margin: 0,
          fontFamily: '"Fira Code", "Cascadia Code", monospace',
        }}
        dangerouslySetInnerHTML={{ __html: highlight(code) }}
      />
      <button
        onClick={copy}
        style={{
          position: 'absolute',
          top: 8,
          right: 8,
          background: copied ? '#238636' : '#21262d',
          border: '1px solid #30363d',
          color: copied ? '#fff' : '#8b949e',
          borderRadius: 6,
          padding: '3px 8px',
          fontSize: 11,
          cursor: 'pointer',
          transition: 'all 0.2s',
          fontFamily: 'inherit',
        }}
      >
        {copied ? '✓' : 'copy'}
      </button>
    </div>
  );
}

// ============================================================
// CARD
// ============================================================
function Card({ item }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      onClick={() => setOpen(o => !o)}
      style={{
        background: open ? '#161b22' : '#0d1117',
        border: `1px solid ${open ? item.color + '55' : '#21262d'}`,
        borderRadius: 10,
        padding: '12px 14px',
        cursor: 'pointer',
        transition: 'all 0.18s ease',
        borderLeft: `3px solid ${item.color}`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            background: item.color + '22',
            color: item.color,
            fontSize: 10,
            fontWeight: 700,
            padding: '2px 7px',
            borderRadius: 20,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            whiteSpace: 'nowrap',
          }}>
            {item.tag}
          </span>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#e6edf3', lineHeight: 1.3 }}>
            {item.title}
          </span>
        </div>
        <span style={{ color: '#58a6ff', fontSize: 14, flexShrink: 0 }}>{open ? '▲' : '▼'}</span>
      </div>

      {open && (
        <div onClick={e => e.stopPropagation()}>
          {item.note && (
            <p style={{
              margin: '10px 0 4px',
              fontSize: 12.5,
              color: '#8b949e',
              lineHeight: 1.55,
              borderLeft: `2px solid ${item.color}55`,
              paddingLeft: 10,
            }}>
              {item.note}
            </p>
          )}
          <CodeBlock code={item.code} />
        </div>
      )}
    </div>
  );
}

// ============================================================
// SECTION PILL NAV
// ============================================================
function SectionNav({ activeId, onSelect }) {
  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: 6,
      padding: '12px 0 4px',
    }}>
      <button
        onClick={() => onSelect(null)}
        style={{
          background: activeId === null ? '#58a6ff' : '#21262d',
          color: activeId === null ? '#fff' : '#8b949e',
          border: 'none',
          borderRadius: 20,
          padding: '5px 12px',
          fontSize: 11.5,
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.15s',
        }}
      >
        All 200
      </button>
      {SECTIONS.map(s => (
        <button
          key={s.id}
          onClick={() => onSelect(s.id)}
          style={{
            background: activeId === s.id ? s.color : '#21262d',
            color: activeId === s.id ? '#000' : '#8b949e',
            border: 'none',
            borderRadius: 20,
            padding: '5px 12px',
            fontSize: 11.5,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.15s',
            whiteSpace: 'nowrap',
          }}
        >
          {s.icon} {s.label}
        </button>
      ))}
    </div>
  );
}

// ============================================================
// MAIN APP
// ============================================================
export default function App() {
  const [search, setSearch] = useState('');
  const [activeSection, setActiveSection] = useState(null);
  const [expandAll, setExpandAll] = useState(false);

  const filtered = useMemo(() => {
    let pool = activeSection
      ? ALL_ITEMS.filter(i => i.sectionId === activeSection)
      : ALL_ITEMS;
    if (search.trim()) {
      const q = search.toLowerCase();
      pool = pool.filter(i =>
        i.title.toLowerCase().includes(q) ||
        i.tag.toLowerCase().includes(q) ||
        i.code.toLowerCase().includes(q) ||
        (i.note && i.note.toLowerCase().includes(q))
      );
    }
    return pool;
  }, [search, activeSection]);

  const grouped = useMemo(() => {
    if (activeSection) {
      const section = SECTIONS.find(s => s.id === activeSection);
      return [{ ...section, items: filtered }];
    }
    return SECTIONS.map(s => ({
      ...s,
      items: filtered.filter(i => i.sectionId === s.id),
    })).filter(s => s.items.length > 0);
  }, [filtered, activeSection]);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#010409',
      color: '#e6edf3',
      fontFamily: '"IBM Plex Sans", "Segoe UI", sans-serif',
    }}>
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; }
        ::selection { background: #58a6ff55; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #0d1117; }
        ::-webkit-scrollbar-thumb { background: #30363d; border-radius: 3px; }
        .c   { color: #8b949e; font-style: italic; }
        .kw  { color: #ff7b72; }
        .hook{ color: #79c0ff; }
        .str { color: #a5d6ff; }
        .num { color: #f0883e; }
        @keyframes fadeIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
        .card-in { animation: fadeIn 0.2s ease forwards; }
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=Fira+Code:wght@400;500&display=swap');
      `}</style>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(180deg, #0d1117 0%, #010409 100%)',
        borderBottom: '1px solid #21262d',
        padding: '28px 24px 20px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backdropFilter: 'blur(12px)',
      }}>
        <div style={{ maxWidth: 980, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 4 }}>
            <h1 style={{
              margin: 0,
              fontSize: 22,
              fontWeight: 800,
              letterSpacing: '-0.03em',
              background: 'linear-gradient(90deg, #58a6ff, #79c0ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              React Reference
            </h1>
            <span style={{
              background: '#238636',
              color: '#fff',
              fontSize: 11,
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: 20,
              letterSpacing: '0.04em',
            }}>
              200 FEATURES
            </span>
          </div>
          <p style={{ margin: '0 0 14px', fontSize: 13, color: '#8b949e' }}>
            The only React cheatsheet you'll ever need — hooks, patterns, performance, TypeScript, Next.js & more.
          </p>

          {/* Search */}
          <div style={{ position: 'relative', marginBottom: 6 }}>
            <span style={{
              position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
              color: '#484f58', fontSize: 15, pointerEvents: 'none',
            }}>⌕</span>
            <input
              type="text"
              placeholder="Search features, hooks, patterns… (e.g. 'useCallback', 'form', 'fetch')"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%',
                background: '#0d1117',
                border: '1px solid #30363d',
                borderRadius: 8,
                color: '#e6edf3',
                fontSize: 13.5,
                padding: '9px 12px 9px 36px',
                outline: 'none',
                fontFamily: 'inherit',
                transition: 'border-color 0.15s',
              }}
              onFocus={e => e.target.style.borderColor = '#58a6ff'}
              onBlur={e => e.target.style.borderColor = '#30363d'}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                style={{
                  position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', color: '#484f58', cursor: 'pointer', fontSize: 16,
                }}
              >×</button>
            )}
          </div>

          <SectionNav activeId={activeSection} onSelect={setActiveSection} />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
            <span style={{ fontSize: 12, color: '#484f58' }}>
              Showing <strong style={{ color: '#58a6ff' }}>{filtered.length}</strong> of 200 features
            </span>
            <button
              onClick={() => setExpandAll(o => !o)}
              style={{
                background: 'none', border: '1px solid #30363d',
                color: '#8b949e', borderRadius: 6, padding: '4px 10px',
                fontSize: 11.5, cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              {expandAll ? 'Collapse all' : 'Expand all'}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 980, margin: '0 auto', padding: '20px 24px 60px' }}>
        {grouped.map(section => (
          <div key={section.id} style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <span style={{ fontSize: 20 }}>{section.icon}</span>
              <h2 style={{
                margin: 0,
                fontSize: 16,
                fontWeight: 700,
                color: section.color,
                letterSpacing: '-0.01em',
              }}>
                {section.label}
              </h2>
              <span style={{
                background: section.color + '22',
                color: section.color,
                fontSize: 11,
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: 20,
              }}>
                {section.items.length}
              </span>
              <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${section.color}33, transparent)` }} />
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(440px, 1fr))',
              gap: 8,
            }}>
              {section.items.map((item, i) => (
                <div key={item.id} className="card-in" style={{ animationDelay: `${i * 20}ms` }}>
                  <ExpandableCard item={item} forceOpen={expandAll} />
                </div>
              ))}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#484f58' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
            <p style={{ margin: 0, fontSize: 15 }}>No results for "{search}"</p>
            <p style={{ margin: '6px 0 0', fontSize: 13 }}>Try a hook name, pattern type, or keyword</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// EXPANDABLE CARD (respects forceOpen)
// ============================================================
function ExpandableCard({ item, forceOpen }) {
  const [manualOpen, setManualOpen] = useState(null); // null = follow forceOpen
  const open = manualOpen !== null ? manualOpen : forceOpen;

  const toggle = () => {
    setManualOpen(o => (o !== null ? !o : !forceOpen));
  };

  useEffect(() => {
    setManualOpen(null); // reset manual override when forceOpen changes
  }, [forceOpen]);

  return (
    <div
      onClick={toggle}
      style={{
        background: open ? '#161b22' : '#0d1117',
        border: `1px solid ${open ? item.color + '44' : '#21262d'}`,
        borderRadius: 10,
        padding: '11px 13px',
        cursor: 'pointer',
        borderLeft: `3px solid ${item.color}`,
        transition: 'background 0.15s, border-color 0.15s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, minWidth: 0 }}>
          <span style={{
            background: item.color + '1a',
            color: item.color,
            fontSize: 10,
            fontWeight: 700,
            padding: '2px 6px',
            borderRadius: 20,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}>
            {item.tag}
          </span>
          <span style={{
            fontSize: 12.5,
            fontWeight: 600,
            color: '#c9d1d9',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: open ? 'normal' : 'nowrap',
          }}>
            {item.title}
          </span>
        </div>
        <span style={{ color: '#30363d', fontSize: 11, flexShrink: 0, marginLeft: 4 }}>
          {open ? '▲' : '▼'}
        </span>
      </div>

      {open && (
        <div onClick={e => e.stopPropagation()} style={{ marginTop: 8 }}>
          {item.note && (
            <p style={{
              margin: '0 0 6px',
              fontSize: 12,
              color: '#8b949e',
              lineHeight: 1.6,
              borderLeft: `2px solid ${item.color}44`,
              paddingLeft: 9,
            }}>
              💡 {item.note}
            </p>
          )}
          <CodeBlock code={item.code} />
        </div>
      )}
    </div>
  );
}
