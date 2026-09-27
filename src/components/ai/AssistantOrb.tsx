'use client';

import { Fragment, useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowUp, MessageCircle, X } from 'lucide-react';

interface AssistantProps {
  greeting: string;
  fallbackMessage: string;
}

interface Message {
  role: 'assistant' | 'user';
  text: string;
}

const SUGGESTIONS = [
  'What did you build at Allcognix AI?',
  'How fast is SONAR, honestly?',
  'Which project shows your RAG work best?',
  'Are you open to full-time roles?',
];

export function AssistantOrb({ greeting, fallbackMessage }: AssistantProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{ role: 'assistant', text: greeting }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLTextAreaElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const feed = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener('assistant:open', onOpen);
    return () => window.removeEventListener('assistant:open', onOpen);
  }, []);

  useEffect(() => {
    if (open) field.current?.focus();
  }, [open]);

  // Stay out of the way while the hero's line is on screen.
  const [tucked, setTucked] = useState(false);
  useEffect(() => {
    const hero = document.querySelector('.network');
    if (!hero) return;
    const io = new IntersectionObserver(([e]) => setTucked(e.isIntersecting));
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    feed.current?.scrollTo({ top: feed.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  const close = () => {
    setOpen(false);
    requestAnimationFrame(() => trigger.current?.focus());
  };

  const send = async (text: string) => {
    const message = text.trim();
    if (!message || loading) return;
    setMessages((m) => [...m, { role: 'user', text: message }]);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      if (!res.ok || !data.text) throw new Error(data.error || 'No reply');
      setMessages((m) => [...m, { role: 'assistant', text: data.text }]);
    } catch {
      setMessages((m) => [...m, { role: 'assistant', text: fallbackMessage }]);
    } finally {
      setLoading(false);
    }
  };

  const asked = messages.some((m) => m.role === 'user');

  return (
    <aside aria-label="Ask about my work" className="fixed bottom-4 right-4 z-assistant sm:bottom-6 sm:right-6">
      {open ? (
        <div
          ref={panel}
          role="dialog"
          aria-label="Ask about my work"
          onKeyDown={(e) => e.key === 'Escape' && close()}
          className="assistant-panel flex h-[min(38rem,calc(100dvh-2rem))] w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-[14px] bg-paper-raised shadow-[0_24px_80px_-24px_rgb(0_0_0/0.45)] ring-1 ring-rule sm:w-[26rem]"
        >
          <header className="flex items-start gap-3 border-b border-rule px-5 py-4">
            <div className="min-w-0 flex-1">
              <h2 className="text-[1rem] font-semibold">Ask about my work</h2>
              <p className="mt-0.5 text-[0.8125rem] leading-snug text-ink-2">
                An AI that answers from this site only. The case studies are the source of truth.
              </p>
            </div>
            <button
              type="button"
              onClick={close}
              className="btn -mr-2 -mt-1 h-9 w-9 px-0 text-ink-2 hover:bg-ink/[0.06] hover:text-ink"
              aria-label="Close"
            >
              <X className="h-[1.1rem] w-[1.1rem]" strokeWidth={1.75} aria-hidden />
            </button>
          </header>

          <div ref={feed} data-lenis-prevent aria-live="polite" className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
            {messages.map((m, i) =>
              m.role === 'user' ? (
                <p
                  key={i}
                  className="ml-auto w-fit max-w-[85%] rounded-[14px] rounded-br-md bg-ink px-3.5 py-2.5 text-[0.9375rem] leading-relaxed text-paper"
                >
                  {m.text}
                </p>
              ) : (
                <div key={i} className="max-w-[92%] space-y-2 text-[0.9375rem] leading-relaxed text-ink">
                  <Markdown text={m.text} />
                </div>
              )
            )}

            {loading && (
              <p className="flex items-center gap-2 text-[0.875rem] text-ink-2" role="status">
                <span className="thinking" aria-hidden>
                  <span />
                  <span />
                  <span />
                </span>
                Thinking
              </p>
            )}

            {!asked && !loading && (
              <ul className="space-y-1 pt-1">
                {SUGGESTIONS.map((s) => (
                  <li key={s}>
                    <button
                      type="button"
                      onClick={() => send(s)}
                      className="w-full rounded-[10px] px-3 py-2 text-left text-[0.9375rem] text-ink-2 ring-1 ring-inset ring-rule transition-colors hover:bg-ink/[0.04] hover:text-ink"
                    >
                      {s}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-end gap-2 border-t border-rule p-3"
          >
            <label htmlFor="assistant-input" className="sr-only">
              Your question
            </label>
            <textarea
              id="assistant-input"
              ref={field}
              rows={1}
              value={input}
              maxLength={500}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              placeholder="Ask about a project or the stack"
              className="max-h-32 min-h-[2.75rem] flex-1 resize-none rounded-[10px] bg-paper px-3 py-2.5 text-[0.9375rem] text-ink ring-1 ring-inset ring-rule-strong placeholder:text-ink-3 focus:outline-none focus:ring-2 focus:ring-ink"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="btn-ink h-11 w-11 shrink-0 px-0 disabled:opacity-35"
              aria-label="Send"
            >
              <ArrowUp className="h-[1.1rem] w-[1.1rem]" strokeWidth={2} aria-hidden />
            </button>
          </form>
        </div>
      ) : (
        <button
          ref={trigger}
          type="button"
          onClick={() => setOpen(true)}
          className={`btn-ink h-12 gap-2.5 pl-4 pr-5 shadow-[0_10px_30px_-10px_rgb(0_0_0/0.5)] transition-[opacity,transform] duration-300 ease-out ${
            tucked ? 'pointer-events-none translate-y-3 opacity-0' : ''
          }`}
          tabIndex={tucked ? -1 : undefined}
        >
          <MessageCircle className="h-[1.1rem] w-[1.1rem]" strokeWidth={1.9} aria-hidden />
          Ask about my work
        </button>
      )}
    </aside>
  );
}

/** Just enough Markdown for chat replies: paragraphs, bullet lists, **bold** and links. */
function Markdown({ text }: { text: string }) {
  const blocks = text.trim().split(/\n{2,}/);
  return (
    <>
      {blocks.map((block, i) => {
        const lines = block.split('\n').filter((l) => l.trim());
        if (lines.every((l) => /^\s*([-*•]|\d+\.)\s+/.test(l))) {
          return (
            <ul key={i} className="list-disc space-y-1 pl-5 marker:text-ink-3">
              {lines.map((l, j) => (
                <li key={j}>{inline(l.replace(/^\s*([-*•]|\d+\.)\s+/, ''))}</li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i}>
            {lines.map((l, j) => (
              <Fragment key={j}>
                {j > 0 && <br />}
                {inline(l.replace(/^#+\s*/, ''))}
              </Fragment>
            ))}
          </p>
        );
      })}
    </>
  );
}

function inline(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /\*\*(.+?)\*\*|\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)|(https?:\/\/[^\s)]+)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[1]) out.push(<strong key={m.index} className="font-semibold">{m[1]}</strong>);
    else {
      const href = m[3] || m[4];
      out.push(
        <a key={m.index} href={href} target="_blank" rel="noopener noreferrer" className="link-quiet break-words">
          {m[2] || href.replace(/^https?:\/\//, '')}
        </a>
      );
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}
