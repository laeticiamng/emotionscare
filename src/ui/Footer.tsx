import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer style={{ padding: "16px", opacity: 0.8 }}>
      <small>
        © {new Date().getFullYear()} EmotionsCare —
        {' '}
        <Link to="/legal/mentions">Mentions légales</Link>
        {' · '}
        <Link to="/legal/terms">Conditions d'utilisation</Link>
        {' · '}
        <Link to="/legal/sales">CGV</Link>
        {' · '}
        <Link to="/legal/privacy">Confidentialité</Link>
        {' · '}
        <Link to="/legal/cookies">Cookies</Link>
      </small>
    </footer>
  );
}