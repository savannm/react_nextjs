'use client';

import { useState, useRef, useEffect } from 'react';
import { useChat } from '@ai-sdk/react';
import styles from './AIChat.module.css';

export default function AiChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [files, setFiles] = useState<FileList | undefined>(undefined);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // ai v6 / @ai-sdk/react v3 API:
    // - messages: UIMessage[] — content is in `parts`, not a `content` string field
    // - sendMessage({ text }) — replaces the old append()
    // - setMessages([]) — clears the conversation for "New Chat"
    // - status: 'submitted' | 'streaming' | 'ready' | 'error'
    const { messages, sendMessage, setMessages, status } = useChat({
        api: '/api/chat',
    });

    const isLoading = status === 'submitted' || status === 'streaming';

    // --- File handling ---
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFiles(prev => {
                if (!prev) return e.target.files!;
                // Merge new files with existing ones
                const dt = new DataTransfer();
                Array.from(prev).forEach(f => dt.items.add(f));
                Array.from(e.target.files!).forEach(f => dt.items.add(f));
                return dt.files;
            });
        }
        // Reset so the same file can be re-selected
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const removeFile = (index: number) => {
        if (!files) return;
        const dt = new DataTransfer();
        Array.from(files).forEach((file, i) => {
            if (i !== index) dt.items.add(file);
        });
        setFiles(dt.files.length > 0 ? dt.files : undefined);
    };

    // --- Submit ---
    const submitMessage = () => {
        if ((!input.trim() && !files?.length) || isLoading) return;

        sendMessage({
            text: input.trim(),
            ...(files?.length ? { files } : {}),
        });

        setInput('');
        setFiles(undefined);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        submitMessage();
    };

    // Enter = submit, Shift+Enter = newline
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            submitMessage();
        }
    };

    // --- New Chat ---
    const handleNewChat = () => {
        setMessages([]);
        setInput('');
        setFiles(undefined);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    // --- Auto-scroll ---
    const messagesEndRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Helper: extract text from UIMessage parts
    const getTextFromParts = (parts: any[]): string =>
        parts.filter((p: any) => p.type === 'text').map((p: any) => p.text).join('');

    return (
        <div className={styles.chatWidget}>
            {isOpen ? (
                <div className={styles.chatContainer}>
                    {/* ── Header ── */}
                    <div className={styles.header}>
                        <div className={styles.headerLeft}>
                            {/* New Chat button — only shown when there are messages */}
                            {messages.length > 0 && (
                                <button
                                    className={styles.newChatBtn}
                                    onClick={handleNewChat}
                                    title="Start a new conversation"
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 5v14M5 12h14" />
                                    </svg>
                                    New chat
                                </button>
                            )}
                        </div>
                        <div className={styles.headerRight}>
                            <button
                                className={styles.iconBtn}
                                onClick={() => setIsOpen(false)}
                                title="Close"
                            >
                                ×
                            </button>
                        </div>
                    </div>

                    {/* ── Messages ── */}
                    <div className={styles.messages}>
                        {messages.length === 0 && (
                            <div className={styles.greetingContainer}>
                                <h1 className={styles.greetingText1}>Hi there,</h1>
                                <h1 className={styles.greetingText2}>how can I help you?</h1>
                            </div>
                        )}

                        {messages.map((m) => {
                            const text = getTextFromParts(m.parts ?? []);
                            const fileParts = (m.parts ?? []).filter((p: any) => p.type === 'file' || p.type === 'image');

                            return (
                                <div
                                    key={m.id}
                                    className={`${styles.message} ${m.role === 'user' ? styles.userMessage : styles.aiMessage}`}
                                    style={{ whiteSpace: 'pre-wrap' }}
                                >
                                    {text && <span>{text}</span>}
                                    {fileParts.map((p: any, i: number) => (
                                        <img
                                            key={i}
                                            src={p.url ?? p.image ?? ''}
                                            alt="attachment"
                                            className={styles.attachmentImage}
                                        />
                                    ))}
                                    {isLoading && m === messages[messages.length - 1] && m.role === 'assistant' && (
                                        <span className={styles.cursor}>▋</span>
                                    )}
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* ── Input Form ── */}
                    <form onSubmit={handleSubmit} className={styles.inputForm}>
                        {/* Attachment previews above the input */}
                        {files && files.length > 0 && (
                            <div className={styles.attachmentsPreview}>
                                {Array.from(files).map((file, i) => (
                                    <div key={i} className={styles.previewItem}>
                                        {file.type.startsWith('image/') ? (
                                            <img src={URL.createObjectURL(file)} alt={file.name} />
                                        ) : (
                                            <div className={styles.fileIcon}>
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                                    <polyline points="14 2 14 8 20 8" />
                                                </svg>
                                                <span className={styles.fileName}>{file.name}</span>
                                            </div>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => removeFile(i)}
                                            className={styles.removePreview}
                                            title="Remove"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className={styles.inputWrapper}>
                            <textarea
                                className={styles.input}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Ask anything…"
                                disabled={isLoading}
                                rows={3}
                            />

                            {/* Bottom action row: paperclip on left, send on right */}
                            <div className={styles.inputActions}>
                                {/* Attachment button */}
                                <button
                                    type="button"
                                    className={styles.attachBtn}
                                    onClick={() => fileInputRef.current?.click()}
                                    title="Attach files"
                                    disabled={isLoading}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                                    </svg>
                                    {files && files.length > 0 && (
                                        <span className={styles.attachBadge}>{files.length}</span>
                                    )}
                                </button>

                                {/* Hidden real file input */}
                                <input
                                    type="file"
                                    multiple
                                    hidden
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    accept="image/*,.pdf,.txt,.md,.csv"
                                />

                                {/* Send button */}
                                <button
                                    type="button"
                                    className={styles.submitBtn}
                                    onClick={submitMessage}
                                    disabled={isLoading || (!input.trim() && (!files || files.length === 0))}
                                    title="Send (Enter)"
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 20V4M12 4L5 11M12 4L19 11" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Quick actions — shown only before first message */}
                        {messages.length === 0 && (
                            <div className={styles.quickActions}>
                                <button type="button" className={styles.actionBtn} onClick={() => setInput('Summarize')}>Summarize</button>
                                <button type="button" className={styles.actionBtn} onClick={() => setInput('Create')}>Create</button>
                                <button type="button" className={styles.actionBtn} onClick={() => setInput('How do I')}>How do I</button>
                                <button type="button" className={styles.actionBtn}>
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                                    </svg>
                                    Meetings
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            ) : (
                <button className={styles.fab} onClick={() => setIsOpen(true)} suppressHydrationWarning>
                    💬
                </button>
            )}
        </div>
    );
}
