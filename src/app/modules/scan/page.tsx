import * as DS from "@/COMPONENTS.reg";
const PageHeader = DS.PageHeader || (({ title, subtitle }: any) => (
  <header><h1>{title}</h1><p>{subtitle}</p></header>
));
const Button = DS.Button || (({ children, ...props }: any) => <button {...props}>{children}</button>);

export default function ScanPage() {
  return (
    <main className="p-4 space-y-4">
      <PageHeader title="Scan" subtitle="Experience the module" />
      <p>Bienvenue dans le module Scan.</p>
      <Button>Commencer</Button>
    </main>
  );
}
