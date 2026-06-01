export interface MonitorKpi {
  title: string;
  value: string;
  trend: string;
  trendUp: boolean;
  sparkline: number[];
}

export interface EvaluationRow {
  name: string;
  origin: 'En vivo' | 'Ficticio';
  cases: number;
  score: number;
  status: string;
  date: string;
}

export interface ReviewCase {
  id: string;
  source: 'Atomic' | 'Online';
  excerpt: string;
  author: string;
  time: string;
  selected?: boolean;
}

export interface ChatMessage {
  role: 'user' | 'bot';
  text: string;
}

export const LATENCY_CHART_LABELS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
export const LATENCY_CHART_VALUES = [1.8, 1.6, 1.7, 1.5, 1.4, 1.3, 1.4];

export const COST_BY_MODEL_LABELS = ['Claude 3.5', 'GPT-4o', 'Haiku', 'Sonnet', 'Otro'];
export const COST_BY_MODEL_VALUES = [124.5, 89.2, 42.0, 18.3, 10.5];

export const CLOSURE_REASONS = [
  { label: 'Resuelto', value: 62, color: '#00A6F5' },
  { label: 'Escalado', value: 22, color: '#FF6600' },
  { label: 'Abandonado', value: 16, color: '#71717B' },
];

export const MONITOR_KPIS: MonitorKpi[] = [
  { title: 'CONVERSACIONES', value: '12,847', trend: '+8%', trendUp: true, sparkline: [40, 55, 45, 60, 52, 70, 65] },
  { title: 'LATENCIA P50', value: '1.4s', trend: '-2%', trendUp: false, sparkline: [70, 65, 60, 58, 55, 52, 50] },
  { title: 'COSTO', value: '$284.50', trend: '+12%', trendUp: true, sparkline: [30, 35, 40, 38, 45, 50, 55] },
  { title: 'TASA DE RESOLUCIÓN', value: '78%', trend: '+3%', trendUp: true, sparkline: [60, 62, 65, 68, 70, 72, 78] },
  { title: 'SCORE PROMEDIO', value: '0.86', trend: '+1%', trendUp: true, sparkline: [80, 82, 81, 83, 84, 85, 86] },
];

export const EVALUATION_ROWS: EvaluationRow[] = [
  { name: 'Regresión saldo — v3', origin: 'Ficticio', cases: 120, score: 0.92, status: 'Completado', date: '16 may 2026' },
  { name: 'Tráfico producción — semana 19', origin: 'En vivo', cases: 450, score: 0.78, status: 'Completado', date: '14 may 2026' },
  { name: 'Tono empático — batch IA', origin: 'Ficticio', cases: 50, score: 0.85, status: 'Completado', date: '12 may 2026' },
  { name: 'Escalaciones pedidos', origin: 'En vivo', cases: 200, score: 0.71, status: 'Completado', date: '10 may 2026' },
];

export const REVIEW_CASES: ReviewCase[] = [
  {
    id: '1',
    source: 'Atomic',
    excerpt: 'El bot repitió el saldo dos veces',
    author: 'María G.',
    time: 'hace 10 min',
    selected: true,
  },
  {
    id: '2',
    source: 'Online',
    excerpt: 'Respuesta irrelevante sobre política de devoluciones',
    author: 'Carlos R.',
    time: 'hace 1 h',
  },
  {
    id: '3',
    source: 'Atomic',
    excerpt: 'No solicitó número de pedido antes de consultar estado',
    author: 'Ana L.',
    time: 'hace 3 h',
  },
];

export const REVIEW_CHAT: ChatMessage[] = [
  { role: 'user', text: '¿Cuál es el saldo de mi cuenta?' },
  { role: 'bot', text: 'Tu saldo actual es $1,240.50 USD.' },
  { role: 'user', text: '¿Y el disponible?' },
  { role: 'bot', text: 'Tu saldo actual es $1,240.50 USD. El disponible es $1,100.00.' },
  { role: 'user', text: 'Me lo dijiste dos veces igual.' },
];

export const PROMPT_CURRENT = `Eres un asistente de soporte bancario.
Cuando el usuario pregunte por saldo, responde con el monto disponible.`;

export const PROMPT_SUGGESTED = `Eres un asistente de soporte bancario.
Cuando el usuario pregunte por saldo o movimientos, solicita primero el número de pedido o cuenta verificada.
Luego responde con el monto disponible de forma concisa.`;

export const PLAYGROUND_REVIEW_CHAT: ChatMessage[] = [
  { role: 'user', text: '¿Cuál es el saldo de mi cuenta?' },
  { role: 'bot', text: 'Con gusto te ayudo. Para consultar tu saldo de forma segura, ¿me compartes tu número de pedido o los últimos 4 dígitos de tu cuenta?' },
];

export const PLAYGROUND_RUN_BOT_REPLY =
  'Gracias. Con el pedido #48291 verificado: tu saldo es $1,240.50 USD y disponible $1,100.00.';
