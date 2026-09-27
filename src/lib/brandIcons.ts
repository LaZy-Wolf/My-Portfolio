import {
  siClaude,
  siDeepgram,
  siDocker,
  siFastapi,
  siFlask,
  siGooglecloud,
  siGooglegemini,
  siLangchain,
  siLanggraph,
  siLivekit,
  siMistralai,
  siModelcontextprotocol,
  siMongodb,
  siNextdotjs,
  siNvidia,
  siOpenrouter,
  siPostgresql,
  siPython,
  siQdrant,
  siReact,
  siRedis,
  siSqlite,
  siSupabase,
  siTailwindcss,
  siTypescript,
  siWebrtc,
  type SimpleIcon,
} from 'simple-icons';

// Tool name (as written in a project's stack) to its logo. Unknown tools simply get no logo.
const BY_PREFIX: [string, SimpleIcon][] = [
  ['python', siPython],
  ['fastapi', siFastapi],
  ['next.js', siNextdotjs],
  ['docker', siDocker],
  ['langgraph', siLanggraph],
  ['langchain', siLangchain],
  ['gemini', siGooglegemini],
  ['sqlite', siSqlite],
  ['typescript', siTypescript],
  ['redis', siRedis],
  ['postgresql', siPostgresql],
  ['supabase', siSupabase],
  ['react', siReact],
  ['qdrant', siQdrant],
  ['mcp', siModelcontextprotocol],
  ['deepgram', siDeepgram],
  ['livekit', siLivekit],
  ['tailwind', siTailwindcss],
  ['flask', siFlask],
  ['claude', siClaude],
  ['mistral', siMistralai],
  ['webrtc', siWebrtc],
  ['google cloud', siGooglecloud],
  ['nvidia', siNvidia],
  ['openrouter', siOpenrouter],
  ['mongodb', siMongodb],
];

export function brandIcon(tool: string) {
  const name = tool.toLowerCase();
  const icon = BY_PREFIX.find(([p]) => name.startsWith(p))?.[1];
  if (!icon) return null;
  // Near-black and near-white marks take the text colour so they read on both maps.
  const n = parseInt(icon.hex, 16);
  const lum = (0.2126 * (n >> 16) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255)) / 255;
  return { path: icon.path, color: lum < 0.25 || lum > 0.85 ? 'currentColor' : `#${icon.hex}` };
}
