'use client';

import { useState } from 'react';
import { Bot, X, Send, Sparkles, Loader2, Copy, Check, Terminal } from 'lucide-react';

interface AssistantOrbProps {
  greeting?: string;
  fallbackMessage?: string;
}

interface Message {
  role: 'assistant' | 'user';
  text: string;
  timestamp: string;
}

const SUGGESTIONS = [
  'What are your strongest featured projects?',
  'What is your architectural tech stack?',
  'What is your availability for contract work?',
  'Tell me about your design engineering philosophy.',
];

export function AssistantOrb({
  greeting = 'Telemetry active. I am the digital twin of this portfolio. Ask me anything about systems, stack, or case studies.',
}: AssistantOrbProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      text: greeting,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const sendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = {
      role: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to get response');

      const botMsg: Message = {
        role: 'assistant',
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: unknown) {
      const errMsg: Message = {
        role: 'assistant',
        text: 'Telemetry communication failure. Please verify network status or reach out via direct email.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <aside aria-label="Digital Twin AI Assistant" className="fixed bottom-6 right-6 z-50">
      {/* Expanded Terminal Panel */}
      {isOpen ? (
        <div className="w-[92vw] sm:w-[420px] max-h-[640px] h-[80vh] border border-telemetry-border bg-substrate-surface shadow-2xl flex flex-col relative animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="p-3.5 border-b border-telemetry-border bg-substrate flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-terminal rounded-full animate-ping" />
              <div>
                <div className="font-mono text-xs font-black uppercase text-white flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-signal" />
                  DIGITAL TWIN // AI TELEMETRY
                </div>
                <div className="text-[9px] font-mono text-telemetry-muted">
                  GROUNDED IN MONGODB PORTFOLIO DATA
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 text-telemetry-muted hover:text-white border border-telemetry-border"
              title="Close chat terminal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-xs">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex flex-col ${
                  msg.role === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div className="flex items-center gap-2 mb-1 text-[10px] text-telemetry-faint">
                  <span>{msg.role === 'user' ? 'YOU' : 'DIGITAL TWIN'}</span>
                  <span>&bull;</span>
                  <span>{msg.timestamp}</span>
                </div>

                <div
                  className={`p-3 max-w-[88%] leading-relaxed border relative group ${
                    msg.role === 'user'
                      ? 'bg-substrate border-telemetry-border text-white'
                      : 'bg-substrate/60 border-telemetry-border/70 text-telemetry-muted'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {msg.role === 'assistant' && (
                    <button
                      type="button"
                      onClick={() => copyToClipboard(msg.text, i)}
                      className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity p-1 text-telemetry-faint hover:text-white"
                      title="Copy response"
                    >
                      {copiedIndex === i ? (
                        <Check className="w-3 h-3 text-terminal" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-signal text-xs font-mono py-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>RETRIEVING TELEMETRY VECTORS...</span>
              </div>
            )}
          </div>

          {/* Suggestion Chips */}
          <div className="p-3 border-t border-telemetry-border/40 bg-substrate/40 space-y-1.5">
            <span className="text-[10px] font-mono text-telemetry-faint uppercase block">
              QUICK PROMPTS:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTIONS.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  disabled={loading}
                  onClick={() => sendMessage(s)}
                  className="text-[10px] font-mono border border-telemetry-border hover:border-signal bg-substrate px-2 py-1 text-telemetry-muted hover:text-white transition-colors text-left"
                >
                  &rarr; {s}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
            className="p-3 border-t border-telemetry-border bg-substrate flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about systems, stack, projects..."
              disabled={loading}
              className="flex-1 bg-substrate-surface border border-telemetry-border px-3 py-2 text-xs font-mono text-white focus:border-signal outline-none"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="brutalist-btn brutalist-btn-accent text-xs py-2 px-3 flex items-center gap-1 disabled:opacity-40"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      ) : (
        /* Floating Tactical Orb */
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2 bg-substrate-surface border border-telemetry-border hover:border-signal px-3.5 py-2.5 shadow-2xl transition-all hover:scale-105"
          title="Open AI Digital Twin Assistant"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-signal" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-terminal animate-ping" />
          </div>
          <span className="font-mono text-xs uppercase font-bold text-white tracking-wide">
            ASK DIGITAL TWIN
          </span>
          <Sparkles className="w-3.5 h-3.5 text-signal opacity-80" />
        </button>
      )}
    </aside>
  );
}
