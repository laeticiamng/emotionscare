export function Footer() {
  return (
    <footer style={{ padding: "16px", opacity: 0.8 }}>
      <small>
        © {new Date().getFullYear()} EmotionsCare —
        {' '}
        <a href="/legal/mentions">Mentions légales</a>
        {' · '}
        <a href="/legal/terms">Conditions d'utilisation</a>
        {' · '}
        <a href="/legal/sales">CGV</a>
        {' · '}
        <a href="/legal/privacy">Confidentialité</a>
        {' · '}
        <a href="/legal/cookies">Cookies</a>
      </small>
    </footer>
  );
}
