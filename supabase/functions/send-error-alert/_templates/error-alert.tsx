import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Hr,
  Code,
} from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';

interface ErrorAlertEmailProps {
  errorMessage: string;
  severity: string;
  priority: string;
  category: string;
  analysis: string;
  suggestedFix: string;
  autoFixCode?: string | null;
  preventionTips?: string[];
  url?: string;
  timestamp: string;
  errorId: string;
  dashboardUrl: string;
}

export const ErrorAlertEmail = ({
  errorMessage,
  severity,
  priority,
  category,
  analysis,
  suggestedFix,
  autoFixCode,
  preventionTips,
  url,
  timestamp,
  errorId,
  dashboardUrl,
}: ErrorAlertEmailProps) => (
  <Html>
    <Head />
    <Preview>🚨 Erreur critique détectée - {category.toUpperCase()}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>🚨 Alerte Erreur Critique</Heading>
        
        <Section style={priorityBox}>
          <Text style={priorityText}>
            Priorité: <strong style={priorityBadge(priority)}>{priority.toUpperCase()}</strong>
          </Text>
          <Text style={categoryText}>
            Catégorie: <strong>{category}</strong> | Sévérité: <strong>{severity}</strong>
          </Text>
        </Section>

        <Hr style={divider} />

        <Section style={section}>
          <Heading style={h2}>📋 Message d'erreur</Heading>
          <Code style={code}>{errorMessage}</Code>
          {url && (
            <Text style={smallText}>
              URL: <Link href={url} style={link}>{url}</Link>
            </Text>
          )}
          <Text style={smallText}>Timestamp: {new Date(timestamp).toLocaleString('fr-FR')}</Text>
        </Section>

        <Hr style={divider} />

        <Section style={section}>
          <Heading style={h2}>🔍 Analyse AI</Heading>
          <Text style={text}>{analysis}</Text>
        </Section>

        <Hr style={divider} />

        <Section style={section}>
          <Heading style={h2}>💡 Solution suggérée</Heading>
          <Text style={text}>{suggestedFix}</Text>
        </Section>

        {autoFixCode && (
          <>
            <Hr style={divider} />
            <Section style={section}>
              <Heading style={h2}>🔧 Code de correction</Heading>
              <Code style={code}>{autoFixCode}</Code>
            </Section>
          </>
        )}

        {preventionTips && preventionTips.length > 0 && (
          <>
            <Hr style={divider} />
            <Section style={section}>
              <Heading style={h2}>🛡️ Conseils de prévention</Heading>
              {preventionTips.map((tip, i) => (
                <Text key={i} style={text}>
                  {i + 1}. {tip}
                </Text>
              ))}
            </Section>
          </>
        )}

        <Hr style={divider} />

        <Section style={ctaSection}>
          <Link
            href={`${dashboardUrl}?errorId=${errorId}`}
            target="_blank"
            style={button}
          >
            Voir dans le dashboard
          </Link>
        </Section>

        <Text style={footer}>
          Cette alerte a été générée automatiquement par le système de monitoring AI d'EmotionsCare.
          <br />
          ID de l'erreur: {errorId}
        </Text>
      </Container>
    </Body>
  </Html>
);

export default ErrorAlertEmail;

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
};

const h1 = {
  color: '#1f2937',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '40px 20px 20px',
  padding: '0',
};

const h2 = {
  color: '#374151',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '20px 0 10px',
};

const priorityBox = {
  backgroundColor: '#fef2f2',
  border: '2px solid #ef4444',
  borderRadius: '8px',
  padding: '16px',
  margin: '0 20px 20px',
};

const priorityText = {
  color: '#991b1b',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0 0 8px',
};

const priorityBadge = (priority: string) => ({
  backgroundColor: priority === 'urgent' ? '#ef4444' : priority === 'high' ? '#f59e0b' : '#3b82f6',
  color: '#ffffff',
  padding: '4px 12px',
  borderRadius: '4px',
  fontSize: '14px',
});

const categoryText = {
  color: '#6b7280',
  fontSize: '14px',
  margin: '0',
};

const section = {
  margin: '0 20px',
};

const text = {
  color: '#4b5563',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '10px 0',
};

const smallText = {
  color: '#6b7280',
  fontSize: '13px',
  lineHeight: '20px',
  margin: '5px 0',
};

const code = {
  backgroundColor: '#f3f4f6',
  border: '1px solid #e5e7eb',
  borderRadius: '4px',
  color: '#1f2937',
  fontFamily: 'monospace',
  fontSize: '13px',
  padding: '12px',
  display: 'block',
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
};

const link = {
  color: '#3b82f6',
  textDecoration: 'underline',
};

const divider = {
  borderColor: '#e5e7eb',
  margin: '20px 0',
};

const ctaSection = {
  margin: '32px 20px',
  textAlign: 'center' as const,
};

const button = {
  backgroundColor: '#3b82f6',
  borderRadius: '8px',
  color: '#ffffff',
  display: 'inline-block',
  fontSize: '16px',
  fontWeight: 'bold',
  padding: '12px 32px',
  textDecoration: 'none',
  textAlign: 'center' as const,
};

const footer = {
  color: '#9ca3af',
  fontSize: '12px',
  lineHeight: '20px',
  margin: '32px 20px 0',
  textAlign: 'center' as const,
};
