import * as DS from "@/COMPONENTS.reg";
import { recordEvent } from "@/lib/scores/events";
const PageHeader = DS.PageHeader || (({ title, subtitle }: any) => (
  <header><h1>{title}</h1><p>{subtitle}</p></header>
));
const Button = DS.Button || (({ children, ...props }: any) => <button {...props}>{children}</button>);

export default function JournalPage() {
  function handleStart() {
    recordEvent({
      module: "journal",
      startedAt: new Date().toISOString(),
      endedAt: new Date().toISOString(),
    });
  }
  return (
    <main className="p-4 space-y-4">
      <PageHeader title="Journal" subtitle="Experience the module" />
      <p>Bienvenue dans le module Journal.</p>
      <Button onClick={handleStart}>Commencer</Button>
    </main>
  );
}
