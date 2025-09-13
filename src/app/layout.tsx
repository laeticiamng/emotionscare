"use client";
import { NavBar, Footer, CommandPalette } from "@/COMPONENTS.reg";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <CommandPalette>
          <NavBar />
          {children}
          <Footer />
        </CommandPalette>
      </body>
    </html>
  );
}
