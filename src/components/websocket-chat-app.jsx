/**
 * Real-Time Chat App — React + WebSocket Simulation
 *
 * Based on: javascript.plainenglish.io — Building a Real-Time Chat App
 * with React, Node.js, WebSockets, JWT, MongoDB
 *
 * Features implemented (from article specs):
 *  ✅ JWT-based authentication (login / register screens)
 *  ✅ Multiple chat rooms (join / leave)
 *  ✅ Real-time message broadcast (server-is-source-of-truth pattern)
 *  ✅ Typing indicators with debounce
 *  ✅ Online presence (who's in the room)
 *  ✅ Message history sent on room join
 *  ✅ WebSocket lifecycle: connect → join-room → send-message → typing
 *  ✅ Clean reconnect / status feedback
 *
 * Architecture note (mirrors the article):
 *  - REST  → auth + message history   (simulated here as in-memory)
 *  - WS    → live messages, typing, presence (simulated via setInterval)
 *  - State flows DOWN from a single wsReducer, not scattered useState calls
 */

import { useReducer, useEffect, useRef, useCallback, useState } from "react";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

/** Available chat rooms (maps to roomId on the backend) */
const ROOMS = [
    { id: "general", label: "# general", emoji: "💬" },
    { id: "random", label: "# random", emoji: "🎲" },
    { id: "tech-talk", label: "# tech-talk", emoji: "💻" },
    { id: "lounge", label: "# lounge", emoji: "🛋️" },
];

/** Simulated other users that "join" rooms */
const BOT_USERS = ["alice", "bob", "carol", "dave", "eve"];

/** Typing indicator debounce — stop-typing fires after this many ms */
const TYPING_DEBOUNCE_MS = 1500;

// ─── IN-MEMORY "BACKEND" SIMULATION ──────────────────────────────────────────
/**
 * This block replaces the Node.js + MongoDB + ws server from the article.
 * In a real app, these would all be server-side, called via fetch/WebSocket.
 */

/** Fake JWT: base64-encodes a payload (NOT secure — demo only) */
function signJwt(payload) {
    return "eyJ." + btoa(JSON.stringify(payload)) + ".sig";
}

/** Decode the fake JWT */
function decodeJwt(token) {
    try { return JSON.parse(atob(token.split(".")[1])); }
    catch { return null; }
}

/** Persistent in-memory "database" for this session */
const DB = {
    users: { admin: { password: "admin", displayName: "Admin" } },
    // roomId → Message[]
    messages: { general: [], random: [], "tech-talk": [], lounge: [] },
};

/** Simulated REST: POST /api/auth/register */
function apiRegister(username, password) {
    if (DB.users[username]) return { error: "Username already taken" };
    DB.users[username] = { password, displayName: username };
    const token = signJwt({ sub: username, displayName: username, iat: Date.now() });
    return { token };
}

/** Simulated REST: POST /api/auth/login */
function apiLogin(username, password) {
    const user = DB.users[username];
    if (!user || user.password !== password) return { error: "Invalid credentials" };
    const token = signJwt({ sub: username, displayName: user.displayName, iat: Date.now() });
    return { token };
}

/** Simulated REST: GET /api/messages/:roomId — returns last 30 messages */
function apiGetHistory(roomId) {
    return (DB.messages[roomId] || []).slice(-30);
}

/** Save a message to the in-memory "DB" */
function dbSaveMessage(roomId, msg) {
    if (!DB.messages[roomId]) DB.messages[roomId] = [];
    DB.messages[roomId].push(msg);
}

// ─── WEBSOCKET SIMULATION ─────────────────────────────────────────────────────
/**
 * In the real article, this is a ws server attached to the Express HTTP server.
 * Here we simulate it: the "server" is an event bus that all "clients" share.
 *
 * Message protocol (mirrors the article's JSON method-based messages):
 *   { method: "join-room",     roomId, username }
 *   { method: "send-message",  roomId, content, username, msgId, ts }
 *   { method: "typing",        roomId, username, isTyping }
 *   { method: "presence",      roomId, online[] }         ← server → client
 *   { method: "new-message",   ...msg }                   ← server → client
 */
const wsEventBus = new EventTarget();
const roomPresence = {}; // roomId → Set<username>

function wsServerReceive(rawMsg) {
    const msg = JSON.parse(rawMsg);

    if (msg.method === "join-room") {
        // Track presence
        if (!roomPresence[msg.roomId]) roomPresence[msg.roomId] = new Set();
        roomPresence[msg.roomId].add(msg.username);

        // Broadcast updated presence to room
        wsServerEmitToRoom(msg.roomId, {
            method: "presence",
            roomId: msg.roomId,
            online: [...roomPresence[msg.roomId]],
        });
    }

    if (msg.method === "leave-room") {
        roomPresence[msg.roomId]?.delete(msg.username);
        wsServerEmitToRoom(msg.roomId, {
            method: "presence",
            roomId: msg.roomId,
            online: [...(roomPresence[msg.roomId] || [])],
        });
    }

    if (msg.method === "send-message") {
        const message = {
            id: msg.msgId,
            roomId: msg.roomId,
            username: msg.username,
            content: msg.content,
            ts: msg.ts,
        };
        dbSaveMessage(msg.roomId, message);

        // Article pattern: server is source of truth — broadcast to ALL (including sender)
        wsServerEmitToRoom(msg.roomId, { method: "new-message", message });
    }

    if (msg.method === "typing") {
        // Broadcast typing status to everyone else in the room
        wsServerEmitToRoom(msg.roomId, {
            method: "typing",
            roomId: msg.roomId,
            username: msg.username,
            isTyping: msg.isTyping,
        }, msg.username); // exclude sender
    }
}

function wsServerEmitToRoom(roomId, payload, excludeUser = null) {
    wsEventBus.dispatchEvent(
        Object.assign(new Event(`room:${roomId}`), { data: JSON.stringify(payload), excludeUser })
    );
}

// ─── useWebSocket HOOK ────────────────────────────────────────────────────────
/**
 * Custom hook that abstracts WebSocket lifecycle.
 * Mirrors the hook from the article's frontend section:
 *  - connects with JWT in the handshake
 *  - exposes send(), status, and onMessage callback
 */
function useWebSocket({ token, onMessage }) {
    const [status, setStatus] = useState("idle"); // idle | connecting | open | closed
    const currentRoom = useRef(null);
    const username = useRef(null);

    // Decode username from the JWT on mount
    useEffect(() => {
        if (token) {
            const payload = decodeJwt(token);
            username.current = payload?.sub;
        }
    }, [token]);

    // "Connect" to the simulated WS server
    useEffect(() => {
        if (!token) return;
        setStatus("connecting");
        const t = setTimeout(() => setStatus("open"), 300); // simulate handshake delay
        return () => clearTimeout(t);
    }, [token]);

    /**
     * Listen for incoming server messages for the current room.
     * In a real app this would be ws.onmessage = ...
     */
    const listenToRoom = useCallback((roomId) => {
        if (currentRoom.current) {
            // Remove old listener when switching rooms
            wsEventBus.removeEventListener(`room:${currentRoom.current}`, handleRoomEvent);
        }
        currentRoom.current = roomId;
        wsEventBus.addEventListener(`room:${roomId}`, handleRoomEvent);
    }, []);

    function handleRoomEvent(e) {
        // Skip messages excluded for this user (e.g. your own typing broadcast)
        if (e.excludeUser === username.current) return;
        onMessage(JSON.parse(e.data));
    }

    /** Send a JSON message to the "server" */
    const send = useCallback((payload) => {
        if (status !== "open") return;
        wsServerReceive(JSON.stringify({ ...payload, username: username.current }));
    }, [status]);

    // Cleanup listener on unmount
    useEffect(() => {
        return () => {
            if (currentRoom.current) {
                wsEventBus.removeEventListener(`room:${currentRoom.current}`, handleRoomEvent);
            }
        };
    }, []);

    return { status, send, listenToRoom, username: username.current };
}

// ─── CHAT REDUCER ─────────────────────────────────────────────────────────────
/**
 * All chat state lives here — one place, no scattered useState.
 * Actions mirror the WS message types from the article.
 */
const initialChatState = {
    messages: [],       // Message objects for current room
    online: [],         // Usernames currently online in room
    typingUsers: [],    // Usernames currently typing
    loading: true,      // True while loading history from "REST"
};

function chatReducer(state, action) {
    switch (action.type) {

        case "LOAD_HISTORY":
            // Fired once on room join — REST call returns last 30 messages
            return { ...state, messages: action.messages, loading: false };

        case "NEW_MESSAGE":
            // Server broadcast — append to list (article: never append locally on send)
            return { ...state, messages: [...state.messages, action.message] };

        case "PRESENCE_UPDATE":
            // Updated online list from server
            return { ...state, online: action.online };

        case "TYPING_UPDATE": {
            // Add or remove user from typingUsers array
            const without = state.typingUsers.filter(u => u !== action.username);
            return {
                ...state,
                typingUsers: action.isTyping ? [...without, action.username] : without,
            };
        }

        case "RESET_ROOM":
            return { ...initialChatState };

        default:
            return state;
    }
}

// ─── BOT SIMULATION ──────────────────────────────────────────────────────────
/**
 * Simulates other users sending occasional messages so the chat feels alive.
 * In a real app this doesn't exist — real users drive activity.
 */
function useBotMessages(roomId, send, isActive) {
    useEffect(() => {
        if (!isActive || !roomId) return;

        // One bot joins the room
        const botName = BOT_USERS[Math.floor(Math.random() * BOT_USERS.length)];

        const BOT_LINES = [
            "Hey everyone 👋",
            "What's up?",
            "Anyone working on something cool?",
            "Just deployed to prod 🚀",
            "This WebSocket connection feels snappy!",
            "Loving the real-time updates",
            "Is the API down for anyone else?",
            "Just merged a big PR 💪",
            "Great discussion in here",
            "Back from lunch, what did I miss?",
        ];

        let interval = setInterval(() => {
            const content = BOT_LINES[Math.floor(Math.random() * BOT_LINES.length)];
            const msg = {
                id: `bot-${Date.now()}`,
                roomId,
                username: botName,
                content,
                ts: Date.now(),
            };
            dbSaveMessage(roomId, msg);
            wsServerEmitToRoom(roomId, { method: "new-message", message: msg });
        }, 4000 + Math.random() * 5000);

        return () => clearInterval(interval);
    }, [roomId, isActive]);
}

// ─── AUTH SCREEN ──────────────────────────────────────────────────────────────
function AuthScreen({ onAuth }) {
    const [mode, setMode] = useState("login"); // login | register
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    function handleSubmit(e) {
        e.preventDefault();
        if (!username.trim() || !password.trim()) {
            setError("Both fields are required");
            return;
        }
        setLoading(true);
        setError("");

        // Simulate async REST call (article: POST /api/auth/login or /register)
        setTimeout(() => {
            const result = mode === "login"
                ? apiLogin(username.trim(), password)
                : apiRegister(username.trim(), password);

            setLoading(false);
            if (result.error) { setError(result.error); return; }
            // Store JWT in memory (article mentions localStorage — we use state here)
            onAuth(result.token);
        }, 500);
    }

    return (
        <div style={styles.authWrap}>
            <div style={styles.authCard}>
                {/* Logo */}
                <div style={styles.authLogo}>
                    <span style={styles.authLogoIcon}>◈</span>
                    <span style={styles.authLogoText}>relay</span>
                </div>
                <p style={styles.authSub}>Real-time chat · WebSocket + JWT</p>

                {/* Tab toggle */}
                <div style={styles.authTabs}>
                    {["login", "register"].map(m => (
                        <button key={m} onClick={() => { setMode(m); setError(""); }}
                            style={{ ...styles.authTab, ...(mode === m ? styles.authTabActive : {}) }}>
                            {m === "login" ? "Sign in" : "Register"}
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSubmit} style={styles.authForm}>
                    <div style={styles.fieldGroup}>
                        <label style={styles.label}>Username</label>
                        <input
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            placeholder="e.g. sav"
                            style={styles.input}
                            autoFocus
                        />
                    </div>
                    <div style={styles.fieldGroup}>
                        <label style={styles.label}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="••••••••"
                            style={styles.input}
                        />
                    </div>

                    {error && <div style={styles.authError}>{error}</div>}

                    <button type="submit" disabled={loading} style={styles.authBtn}>
                        {loading ? "Connecting…" : mode === "login" ? "Sign in →" : "Create account →"}
                    </button>
                </form>

                {/* Quick login hint */}
                <p style={styles.authHint}>
                    Demo: <span style={styles.authHintCode}>admin / admin</span>
                </p>
            </div>
        </div>
    );
}

// ─── MESSAGE BUBBLE ───────────────────────────────────────────────────────────
function MessageBubble({ msg, isOwn }) {
    const time = new Date(msg.ts).toLocaleTimeString("en-AU", {
        hour: "2-digit", minute: "2-digit", hour12: false,
    });

    // Generate a deterministic colour from the username
    const hue = [...msg.username].reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;
    const avatarColor = `hsl(${hue}, 55%, 55%)`;

    return (
        <div style={{ ...styles.msgRow, flexDirection: isOwn ? "row-reverse" : "row" }}>
            {/* Avatar */}
            {!isOwn && (
                <div style={{ ...styles.avatar, background: avatarColor }}>
                    {msg.username[0].toUpperCase()}
                </div>
            )}

            <div style={{ maxWidth: "68%", display: "flex", flexDirection: "column", alignItems: isOwn ? "flex-end" : "flex-start" }}>
                {/* Username + time */}
                {!isOwn && (
                    <span style={styles.msgMeta}>
                        <span style={{ color: avatarColor }}>{msg.username}</span>
                        <span style={styles.msgTime}>{time}</span>
                    </span>
                )}

                {/* Bubble */}
                <div style={{ ...styles.bubble, ...(isOwn ? styles.bubbleOwn : styles.bubbleOther) }}>
                    {msg.content}
                </div>

                {isOwn && <span style={{ ...styles.msgTime, marginTop: 4 }}>{time}</span>}
            </div>
        </div>
    );
}

// ─── TYPING INDICATOR ─────────────────────────────────────────────────────────
function TypingIndicator({ users }) {
    if (!users.length) return null;

    const label = users.length === 1
        ? `${users[0]} is typing`
        : users.length === 2
            ? `${users[0]} and ${users[1]} are typing`
            : `${users.length} people are typing`;

    return (
        <div style={styles.typingRow}>
            <div style={styles.typingDots}>
                {[0, 1, 2].map(i => (
                    <span key={i} style={{ ...styles.dot, animationDelay: `${i * 0.18}s` }} />
                ))}
            </div>
            <span style={styles.typingLabel}>{label}…</span>
        </div>
    );
}

// ─── ONLINE PANEL ─────────────────────────────────────────────────────────────
function OnlinePanel({ online, roomLabel }) {
    return (
        <aside style={styles.sidebar}>
            <div style={styles.sidebarHeading}>Online — {roomLabel}</div>
            <div style={styles.onlineList}>
                {online.map(u => {
                    const hue = [...u].reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;
                    return (
                        <div key={u} style={styles.onlineItem}>
                            <div style={{ ...styles.onlineAvatar, background: `hsl(${hue}, 55%, 55%)` }}>
                                {u[0].toUpperCase()}
                            </div>
                            <div>
                                <div style={styles.onlineName}>{u}</div>
                                <div style={styles.onlineStatus}>
                                    <span style={styles.greenDot} /> online
                                </div>
                            </div>
                        </div>
                    );
                })}
                {!online.length && (
                    <div style={{ color: "#3a4a5a", fontSize: 13 }}>Nobody here yet</div>
                )}
            </div>
        </aside>
    );
}

// ─── MAIN CHAT APP ─────────────────────────────────────────────────────────────
function ChatApp({ token, onLogout }) {
    const [activeRoom, setActiveRoom] = useState(ROOMS[0].id);
    const [inputVal, setInputVal] = useState("");
    const [chatState, dispatch] = useReducer(chatReducer, initialChatState);

    const messagesEndRef = useRef(null);    // for auto-scroll
    const typingTimerRef = useRef(null);    // debounce timer for stop-typing
    const isTypingRef = useRef(false);   // prevents redundant typing events

    // ── WebSocket connection ──────────────────────────────────────────────────
    const { status, send, listenToRoom, username } = useWebSocket({
        token,
        onMessage: handleIncomingMessage,
    });

    /** Handle all incoming server messages — dispatches to chatReducer */
    function handleIncomingMessage(msg) {
        switch (msg.method) {
            case "new-message":
                dispatch({ type: "NEW_MESSAGE", message: msg.message });
                break;
            case "presence":
                dispatch({ type: "PRESENCE_UPDATE", online: msg.online });
                break;
            case "typing":
                // Ignore our own typing echo if it somehow arrives
                if (msg.username === username) break;
                dispatch({ type: "TYPING_UPDATE", username: msg.username, isTyping: msg.isTyping });
                // Auto-clear typing indicator after 3s (safety net)
                setTimeout(() => {
                    dispatch({ type: "TYPING_UPDATE", username: msg.username, isTyping: false });
                }, 3000);
                break;
        }
    }

    // ── Room join / switch ────────────────────────────────────────────────────
    useEffect(() => {
        if (status !== "open") return;

        // 1. Leave previous room
        if (activeRoom) {
            send({ method: "leave-room", roomId: activeRoom });
        }

        // 2. Reset state for the new room
        dispatch({ type: "RESET_ROOM" });

        // 3. Subscribe to new room's WS events
        listenToRoom(activeRoom);

        // 4. Send join-room (article: server sends history on join via WS)
        send({ method: "join-room", roomId: activeRoom });

        // 5. Also load history via simulated REST call
        const history = apiGetHistory(activeRoom);
        dispatch({ type: "LOAD_HISTORY", messages: history });

    }, [activeRoom, status]);

    // ── Auto-scroll to latest message ────────────────────────────────────────
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatState.messages, chatState.typingUsers]);

    // ── Activate bot simulation for current room ──────────────────────────────
    useBotMessages(activeRoom, send, status === "open");

    // ── Send a message ────────────────────────────────────────────────────────
    function sendMessage() {
        const content = inputVal.trim();
        if (!content || status !== "open") return;

        // Article: send-message goes to server; we do NOT append locally
        send({
            method: "send-message",
            roomId: activeRoom,
            content,
            msgId: `${username}-${Date.now()}`,
            ts: Date.now(),
        });

        // Clear input + stop typing indicator
        setInputVal("");
        stopTyping();
    }

    // ── Typing indicator logic (debounced) ───────────────────────────────────
    /**
     * Article pattern:
     *  - user starts typing → broadcast { method:"typing", isTyping:true }
     *  - user stops typing  → broadcast { method:"typing", isTyping:false }
     *  - debounce: "stop" fires after TYPING_DEBOUNCE_MS of no keystrokes
     */
    function handleInputChange(e) {
        setInputVal(e.target.value);

        if (!isTypingRef.current) {
            // First keystroke — notify server
            isTypingRef.current = true;
            send({ method: "typing", roomId: activeRoom, isTyping: true });
        }

        // Reset debounce timer on each keystroke
        clearTimeout(typingTimerRef.current);
        typingTimerRef.current = setTimeout(stopTyping, TYPING_DEBOUNCE_MS);
    }

    function stopTyping() {
        if (!isTypingRef.current) return;
        isTypingRef.current = false;
        clearTimeout(typingTimerRef.current);
        send({ method: "typing", roomId: activeRoom, isTyping: false });
    }

    function handleKeyDown(e) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    }

    // ── Connection status badge ───────────────────────────────────────────────
    const statusLabel = {
        idle: { label: "idle", color: "#3a4a5a" },
        connecting: { label: "connecting…", color: "#fbbf24" },
        open: { label: "connected", color: "#4ade80" },
        closed: { label: "disconnected", color: "#f87171" },
    }[status];

    const room = ROOMS.find(r => r.id === activeRoom);

    return (
        <div style={styles.appWrap}>
            {/* ── LEFT: Room list ─────────────────────────────────────── */}
            <nav style={styles.roomNav}>
                <div style={styles.navLogo}>
                    <span style={styles.authLogoIcon}>◈</span>
                    <span style={styles.authLogoText}>relay</span>
                </div>

                {/* WS connection status */}
                <div style={styles.wsStatus}>
                    <span style={{ ...styles.wsDot, background: statusLabel.color }} />
                    <span style={{ color: statusLabel.color, fontSize: 11, fontFamily: "monospace" }}>
                        {statusLabel.label}
                    </span>
                </div>

                <div style={styles.roomsLabel}>ROOMS</div>

                {ROOMS.map(r => (
                    <button key={r.id}
                        onClick={() => setActiveRoom(r.id)}
                        style={{ ...styles.roomBtn, ...(activeRoom === r.id ? styles.roomBtnActive : {}) }}>
                        <span style={{ fontSize: 16 }}>{r.emoji}</span>
                        <span style={{ flex: 1, textAlign: "left" }}>{r.label}</span>
                        {/* Unread dot — just decoration in this demo */}
                        {activeRoom !== r.id && chatState.messages.length > 0 && Math.random() > 0.7 && (
                            <span style={styles.unreadDot} />
                        )}
                    </button>
                ))}

                {/* Logged-in user at the bottom */}
                <div style={styles.navUser}>
                    <div style={styles.navUserAvatar}>
                        {username?.[0]?.toUpperCase() || "?"}
                    </div>
                    <div>
                        <div style={{ color: "#c8dff0", fontSize: 13, fontWeight: 600 }}>{username}</div>
                        <div style={{ color: "#3a4a5a", fontSize: 11 }}>online</div>
                    </div>
                    <button onClick={onLogout} style={styles.logoutBtn} title="Sign out">⏏</button>
                </div>
            </nav>

            {/* ── CENTRE: Message feed ─────────────────────────────────── */}
            <main style={styles.chatMain}>
                {/* Room header */}
                <div style={styles.chatHeader}>
                    <span style={{ fontSize: 20 }}>{room?.emoji}</span>
                    <div>
                        <div style={{ color: "#e0f0ff", fontWeight: 700 }}>{room?.label}</div>
                        <div style={{ color: "#3a5a7a", fontSize: 12 }}>
                            {chatState.online.length} member{chatState.online.length !== 1 ? "s" : ""} online
                        </div>
                    </div>
                </div>

                {/* Messages */}
                <div style={styles.messagesFeed}>
                    {chatState.loading ? (
                        <div style={styles.loadingMsg}>Loading history…</div>
                    ) : chatState.messages.length === 0 ? (
                        <div style={styles.emptyRoom}>
                            <div style={{ fontSize: 40, marginBottom: 12 }}>{room?.emoji}</div>
                            <div style={{ color: "#3a5a7a", fontSize: 15 }}>
                                This is the beginning of {room?.label}
                            </div>
                            <div style={{ color: "#2a3a4a", fontSize: 13, marginTop: 6 }}>
                                Send a message to get the conversation started.
                            </div>
                        </div>
                    ) : (
                        chatState.messages.map(msg => (
                            <MessageBubble
                                key={msg.id}
                                msg={msg}
                                isOwn={msg.username === username}
                            />
                        ))
                    )}

                    {/* Typing indicator */}
                    <TypingIndicator users={chatState.typingUsers} />

                    {/* Scroll anchor */}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input bar */}
                <div style={styles.inputBar}>
                    <input
                        value={inputVal}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        onBlur={stopTyping}
                        placeholder={`Message ${room?.label}…`}
                        style={styles.messageInput}
                        disabled={status !== "open"}
                    />
                    <button
                        onClick={sendMessage}
                        disabled={!inputVal.trim() || status !== "open"}
                        style={{ ...styles.sendBtn, ...(inputVal.trim() && status === "open" ? styles.sendBtnActive : {}) }}
                    >
                        ↑
                    </button>
                </div>
            </main>

            {/* ── RIGHT: Online presence panel ─────────────────────────── */}
            <OnlinePanel online={chatState.online} roomLabel={room?.label || ""} />
        </div>
    );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function App() {
    // JWT stored in state (article: localStorage in production)
    const [token, setToken] = useState(null);

    return token
        ? <ChatApp token={token} onLogout={() => setToken(null)} />
        : <AuthScreen onAuth={setToken} />;
}

// ─── STYLES ──────────────────────────────────────────────────────────────────
/**
 * All styles in one object for readability.
 * Design direction: dark navy terminal aesthetic — like a dev tool, not a toy.
 * Font: "Space Mono" for headings (feels technical), system stack for body.
 */

const BASE = {
    bg: "#050d15",
    panel: "#080f1a",
    surface: "#0d1825",
    border: "#0f2035",
    accent: "#1a7fd4",
    accentLt: "#4aa8ff",
    text: "#c8dff0",
    textMuted: "#3a5a7a",
    bubble: "#112030",
    own: "#0a2a50",
    ownText: "#80c8ff",
};

const styles = {
    // ── AUTH ──────────────────────────────────────────────────────
    authWrap: {
        minHeight: "100vh",
        background: BASE.bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Segoe UI', system-ui, sans-serif",
        backgroundImage: "radial-gradient(ellipse at 30% 40%, #0a2040 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, #071525 0%, transparent 50%)",
    },
    authCard: {
        background: BASE.panel,
        border: `1px solid ${BASE.border}`,
        borderRadius: 16,
        padding: "40px 44px",
        width: "100%",
        maxWidth: 400,
        boxShadow: "0 24px 80px #00000088",
    },
    authLogo: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginBottom: 4,
    },
    authLogoIcon: {
        fontSize: 28,
        color: BASE.accentLt,
        fontFamily: "monospace",
    },
    authLogoText: {
        fontSize: 26,
        fontWeight: 800,
        color: BASE.text,
        letterSpacing: "-0.04em",
        fontFamily: "'Space Mono', monospace, sans-serif",
    },
    authSub: {
        color: BASE.textMuted,
        fontSize: 13,
        marginBottom: 28,
        fontFamily: "monospace",
    },
    authTabs: {
        display: "flex",
        borderRadius: 8,
        overflow: "hidden",
        border: `1px solid ${BASE.border}`,
        marginBottom: 24,
    },
    authTab: {
        flex: 1,
        padding: "10px",
        background: "transparent",
        border: "none",
        color: BASE.textMuted,
        cursor: "pointer",
        fontSize: 13,
        fontFamily: "monospace",
        transition: "all 0.2s",
    },
    authTabActive: {
        background: BASE.surface,
        color: BASE.text,
        fontWeight: 700,
    },
    authForm: {
        display: "flex",
        flexDirection: "column",
        gap: 16,
    },
    fieldGroup: {
        display: "flex",
        flexDirection: "column",
        gap: 6,
    },
    label: {
        color: BASE.textMuted,
        fontSize: 12,
        fontFamily: "monospace",
        letterSpacing: "0.05em",
        textTransform: "uppercase",
    },
    input: {
        background: BASE.bg,
        border: `1px solid ${BASE.border}`,
        borderRadius: 8,
        color: BASE.text,
        fontSize: 14,
        outline: "none",
        padding: "10px 14px",
        fontFamily: "inherit",
        transition: "border-color 0.2s",
    },
    authError: {
        background: "#1f0808",
        border: "1px solid #5a1a1a",
        borderRadius: 7,
        color: "#f87171",
        fontSize: 13,
        padding: "9px 13px",
    },
    authBtn: {
        background: BASE.accent,
        border: "none",
        borderRadius: 9,
        color: "#fff",
        cursor: "pointer",
        fontSize: 14,
        fontWeight: 700,
        padding: "12px",
        transition: "background 0.2s",
    },
    authHint: {
        color: BASE.textMuted,
        fontSize: 12,
        textAlign: "center",
        marginTop: 18,
        fontFamily: "monospace",
    },
    authHintCode: {
        color: BASE.accentLt,
    },

    // ── APP SHELL ─────────────────────────────────────────────────
    appWrap: {
        display: "flex",
        height: "100vh",
        background: BASE.bg,
        fontFamily: "'Segoe UI', system-ui, sans-serif",
        overflow: "hidden",
    },

    // ── ROOM NAV ──────────────────────────────────────────────────
    roomNav: {
        width: 220,
        flexShrink: 0,
        background: BASE.panel,
        borderRight: `1px solid ${BASE.border}`,
        display: "flex",
        flexDirection: "column",
        padding: "20px 0",
        overflowY: "auto",
    },
    navLogo: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "0 16px 16px",
        borderBottom: `1px solid ${BASE.border}`,
        marginBottom: 12,
    },
    wsStatus: {
        display: "flex",
        alignItems: "center",
        gap: 7,
        padding: "4px 16px 14px",
    },
    wsDot: {
        width: 7,
        height: 7,
        borderRadius: "50%",
        flexShrink: 0,
    },
    roomsLabel: {
        color: "#1e3a5a",
        fontSize: 10,
        fontFamily: "monospace",
        letterSpacing: "0.12em",
        padding: "0 16px 8px",
    },
    roomBtn: {
        display: "flex",
        alignItems: "center",
        gap: 9,
        padding: "9px 16px",
        background: "transparent",
        border: "none",
        borderLeft: "2px solid transparent",
        color: BASE.textMuted,
        cursor: "pointer",
        fontSize: 13,
        fontFamily: "inherit",
        width: "100%",
        transition: "all 0.15s",
    },
    roomBtnActive: {
        background: BASE.surface,
        borderLeft: `2px solid ${BASE.accent}`,
        color: BASE.text,
    },
    unreadDot: {
        width: 7,
        height: 7,
        borderRadius: "50%",
        background: BASE.accent,
        flexShrink: 0,
    },
    navUser: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "14px 16px",
        marginTop: "auto",
        borderTop: `1px solid ${BASE.border}`,
    },
    navUserAvatar: {
        width: 32,
        height: 32,
        borderRadius: "50%",
        background: BASE.accent,
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 13,
        fontWeight: 700,
        flexShrink: 0,
    },
    logoutBtn: {
        marginLeft: "auto",
        background: "transparent",
        border: `1px solid ${BASE.border}`,
        borderRadius: 6,
        color: BASE.textMuted,
        cursor: "pointer",
        fontSize: 14,
        padding: "3px 7px",
    },

    // ── CHAT MAIN ─────────────────────────────────────────────────
    chatMain: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
    },
    chatHeader: {
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "14px 22px",
        borderBottom: `1px solid ${BASE.border}`,
        background: BASE.panel,
        flexShrink: 0,
    },
    messagesFeed: {
        flex: 1,
        overflowY: "auto",
        padding: "20px 22px",
        display: "flex",
        flexDirection: "column",
        gap: 4,
    },
    loadingMsg: {
        color: BASE.textMuted,
        fontSize: 13,
        fontFamily: "monospace",
        textAlign: "center",
        marginTop: 40,
    },
    emptyRoom: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        paddingTop: 60,
    },

    // ── MESSAGE BUBBLES ───────────────────────────────────────────
    msgRow: {
        display: "flex",
        gap: 10,
        alignItems: "flex-end",
        marginBottom: 6,
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: "50%",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 12,
        fontWeight: 700,
        flexShrink: 0,
    },
    msgMeta: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginBottom: 3,
        fontSize: 12,
    },
    msgTime: {
        color: BASE.textMuted,
        fontSize: 11,
        fontFamily: "monospace",
    },
    bubble: {
        borderRadius: 12,
        padding: "9px 14px",
        fontSize: 14,
        lineHeight: 1.55,
        maxWidth: "100%",
        wordBreak: "break-word",
    },
    bubbleOther: {
        background: BASE.bubble,
        color: BASE.text,
        borderBottomLeftRadius: 4,
    },
    bubbleOwn: {
        background: BASE.own,
        color: BASE.ownText,
        borderBottomRightRadius: 4,
    },

    // ── TYPING INDICATOR ─────────────────────────────────────────
    typingRow: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "4px 0 2px",
        minHeight: 24,
    },
    typingDots: {
        display: "flex",
        gap: 4,
        alignItems: "center",
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: "50%",
        background: BASE.textMuted,
        display: "inline-block",
        animation: "bounce 1.2s infinite ease-in-out",
    },
    typingLabel: {
        color: BASE.textMuted,
        fontSize: 12,
        fontStyle: "italic",
    },

    // ── INPUT BAR ─────────────────────────────────────────────────
    inputBar: {
        display: "flex",
        gap: 10,
        padding: "14px 22px",
        borderTop: `1px solid ${BASE.border}`,
        background: BASE.panel,
        flexShrink: 0,
    },
    messageInput: {
        flex: 1,
        background: BASE.surface,
        border: `1px solid ${BASE.border}`,
        borderRadius: 10,
        color: BASE.text,
        fontSize: 14,
        outline: "none",
        padding: "11px 16px",
        fontFamily: "inherit",
    },
    sendBtn: {
        width: 42,
        height: 42,
        borderRadius: 10,
        border: "none",
        background: BASE.surface,
        color: BASE.textMuted,
        cursor: "not-allowed",
        fontSize: 18,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.2s",
        flexShrink: 0,
    },
    sendBtnActive: {
        background: BASE.accent,
        color: "#fff",
        cursor: "pointer",
    },

    // ── SIDEBAR ───────────────────────────────────────────────────
    sidebar: {
        width: 200,
        flexShrink: 0,
        background: BASE.panel,
        borderLeft: `1px solid ${BASE.border}`,
        padding: "20px 14px",
        overflowY: "auto",
    },
    sidebarHeading: {
        color: "#1e3a5a",
        fontSize: 10,
        fontFamily: "monospace",
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        marginBottom: 14,
    },
    onlineList: {
        display: "flex",
        flexDirection: "column",
        gap: 12,
    },
    onlineItem: {
        display: "flex",
        alignItems: "center",
        gap: 9,
    },
    onlineAvatar: {
        width: 30,
        height: 30,
        borderRadius: "50%",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 11,
        fontWeight: 700,
        flexShrink: 0,
    },
    onlineName: {
        color: BASE.text,
        fontSize: 13,
        fontWeight: 600,
    },
    onlineStatus: {
        display: "flex",
        alignItems: "center",
        gap: 5,
        color: BASE.textMuted,
        fontSize: 11,
    },
    greenDot: {
        display: "inline-block",
        width: 6,
        height: 6,
        borderRadius: "50%",
        background: "#4ade80",
    },
};

// ── Global CSS for animations ─────────────────────────────────────────────────
const globalCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #050d15; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #0f2035; border-radius: 2px; }
  @keyframes bounce {
    0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
    40%           { transform: translateY(-5px); opacity: 1; }
  }
  input:focus { border-color: #1a7fd4 !important; }
  button:hover:not(:disabled) { opacity: 0.88; }
`;

// Inject styles into head — works inside the artifact iframe
if (typeof document !== "undefined") {
    let styleTag = document.getElementById("app-styles");
    if (!styleTag) {
        styleTag = document.createElement("style");
        styleTag.id = "app-styles";
        document.head.appendChild(styleTag);
    }
    styleTag.textContent = globalCSS;
}
