import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileCheck, Clock, Shield } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SignatureData {
  timestamp: string;
  hash: string;
  certificate_id: string;
  signer_id: string;
}

export function ReportSignature({ reportId }: { reportId: string }) {
  const [signature, setSignature] = useState<SignatureData | null>(null);
  const [isSigning, setIsSigning] = useState(false);

  const signReport = async () => {
    setIsSigning(true);
    try {
      const timestamp = new Date().toISOString();
      const hash = await generateHash(reportId + timestamp);
      
      const { data, error } = await supabase
        .from('report_signatures')
        .insert({
          report_id: reportId,
          timestamp,
          signature_hash: hash,
          certificate_id: `CERT-${Date.now()}`,
        })
        .select()
        .single();

      if (error) throw error;

      setSignature({
        timestamp,
        hash,
        certificate_id: data.certificate_id,
        signer_id: data.user_id,
      });

      toast.success('Rapport signé électroniquement');
    } catch (error: any) {
      toast.error('Erreur de signature: ' + error.message);
    } finally {
      setIsSigning(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Signature Électronique
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {signature ? (
          <>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-green-50">
                <FileCheck className="h-3 w-3 mr-1" />
                Signé
              </Badge>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{new Date(signature.timestamp).toLocaleString('fr-FR')}</span>
              </div>
              <div className="font-mono text-xs bg-muted p-2 rounded">
                Hash: {signature.hash.slice(0, 32)}...
              </div>
              <div>
                Certificat: <strong>{signature.certificate_id}</strong>
              </div>
            </div>
          </>
        ) : (
          <Button onClick={signReport} disabled={isSigning} className="w-full">
            <FileCheck className="h-4 w-4 mr-2" />
            {isSigning ? 'Signature en cours...' : 'Signer le rapport'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

async function generateHash(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
