const makeCSP = () => [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "style-src 'self' 'unsafe-inline'", // pour Next/app dir
  "script-src 'self' 'strict-dynamic' 'unsafe-inline'",
  "connect-src 'self' https://api.openai.com https://*.supabase.co https://*.sentry.io"
].join("; ");

module.exports = {
  async headers() {
    const csp = makeCSP();
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" }
        ],
      },
    ];
  },
};
