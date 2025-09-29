// Temporary text-based icons for immediate compatibility
export const CheckCircle = () => <span style={{fontFamily: 'monospace'}}>✅</span>;
export const XCircle = () => <span style={{fontFamily: 'monospace'}}>❌</span>;
export const AlertTriangle = () => <span style={{fontFamily: 'monospace'}}>⚠️</span>;
export const Menu = () => <span style={{fontFamily: 'monospace'}}>☰</span>;
export const Search = () => <span style={{fontFamily: 'monospace'}}>🔍</span>;
export const User = () => <span style={{fontFamily: 'monospace'}}>👤</span>;
export const Settings = () => <span style={{fontFamily: 'monospace'}}>⚙️</span>;
export const Home = () => <span style={{fontFamily: 'monospace'}}>🏠</span>;
export const Heart = () => <span style={{fontFamily: 'monospace'}}>❤️</span>;
export const Shield = () => <span style={{fontFamily: 'monospace'}}>🛡️</span>;
export const Bell = () => <span style={{fontFamily: 'monospace'}}>🔔</span>;
export const Calendar = () => <span style={{fontFamily: 'monospace'}}>📅</span>;
export const Play = () => <span style={{fontFamily: 'monospace'}}>▶️</span>;
export const X = () => <span style={{fontFamily: 'monospace'}}>✕</span>;
export const RefreshCw = () => <span style={{fontFamily: 'monospace'}}>🔄</span>;
export const Eye = () => <span style={{fontFamily: 'monospace'}}>👁️</span>;
export const Brain = () => <span style={{fontFamily: 'monospace'}}>🧠</span>;
export const Zap = () => <span style={{fontFamily: 'monospace'}}>⚡</span>;
export const Monitor = () => <span style={{fontFamily: 'monospace'}}>🖥️</span>;
export const Headphones = () => <span style={{fontFamily: 'monospace'}}>🎧</span>;
export const BookOpen = () => <span style={{fontFamily: 'monospace'}}>📖</span>;
export const Gamepad2 = () => <span style={{fontFamily: 'monospace'}}>🎮</span>;
export const MoreHorizontal = () => <span style={{fontFamily: 'monospace'}}>⋯</span>;
export const Trash2 = () => <span style={{fontFamily: 'monospace'}}>🗑️</span>;
export const ExternalLink = () => <span style={{fontFamily: 'monospace'}}>🔗</span>;
export const Undo = () => <span style={{fontFamily: 'monospace'}}>↶</span>;
export const CalendarIcon = () => <span style={{fontFamily: 'monospace'}}>📅</span>;

// Export all as default fallback component for any missing icons
export const IconFallback = ({ name }: { name?: string }) => (
  <span style={{fontFamily: 'monospace'}} title={name}>❓</span>
);

// Re-export common patterns
export { CheckCircle as Check, XCircle as Close, AlertTriangle as Warning };