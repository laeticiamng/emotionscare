export function Footer() {
  return (
    <footer style={{ padding: "16px", opacity: 0.8 }}>
      <small>© {new Date().getFullYear()} EmotionsCare — <a href="/legal/privacy">Confidentialité</a> · <a href="/legal/terms">Conditions</a></small>
    </footer>
  );
}
