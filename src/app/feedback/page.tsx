import { PageHeader, FeedbackForm, SeoHead } from "@/COMPONENTS.reg";

export default function FeedbackPage() {
  return (
    <main className="p-4 space-y-4">
      <SeoHead title="Feedback" description="Envoyez-nous votre avis" />
      <PageHeader title="Feedback" subtitle="Nous aimerions connaître votre opinion" />
      <FeedbackForm />
    </main>
  );
}
