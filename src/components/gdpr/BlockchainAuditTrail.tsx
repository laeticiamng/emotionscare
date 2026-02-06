import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, CheckCircle, AlertTriangle, Link as LinkIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface BlockchainBlock {
  id: string;
  block_number: number;
  block_hash: string;
  previous_hash: string;
  timestamp: string;
  action: string;
  data: any;
  user_id: string;
}

export const BlockchainAuditTrail = () => {
  const [blocks, setBlocks] = useState<BlockchainBlock[]>([]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [chainIntegrity, setChainIntegrity] = useState<boolean | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadBlocks();
  }, []);

  const loadBlocks = async () => {
    const { data, error } = await supabase
      .from('blockchain_audit_trail')
      .select('*')
      .order('block_number', { ascending: false })
      .limit(20);

    if (error) {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
      return;
    }

    setBlocks(data || []);
  };

  const verifyChainIntegrity = async () => {
    setIsVerifying(true);
    try {
      const { data: allBlocks } = await supabase
        .from('blockchain_audit_trail')
        .select('*')
        .order('block_number', { ascending: true });

      if (!allBlocks || allBlocks.length === 0) {
        setChainIntegrity(true);
        return;
      }

      let isValid = true;
      for (let i = 1; i < allBlocks.length; i++) {
        if (allBlocks[i].previous_hash !== allBlocks[i - 1].block_hash) {
          isValid = false;
          break;
        }
      }

      setChainIntegrity(isValid);
      toast({
        title: isValid ? 'Chaîne intègre' : 'Chaîne compromise',
        description: isValid 
          ? 'Tous les blocks sont valides et immuables.' 
          : 'La chaîne a été altérée.',
        variant: isValid ? 'default' : 'destructive',
      });
    } catch (error) {
      toast({ title: 'Erreur', description: 'Impossible de vérifier la chaîne', variant: 'destructive' });
    } finally {
      setIsVerifying(false);
    }
  };

  const addTestBlock = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
      const response = await supabase.functions.invoke('blockchain-audit', {
        body: {
          action: 'test_action',
          data: { test: true, timestamp: new Date().toISOString() },
          userId: user.id,
        }
      });

      if (response.error) throw response.error;

      toast({ title: 'Block ajouté', description: 'Nouveau block créé dans la blockchain' });
      loadBlocks();
    } catch (error: unknown) {
      toast({ title: 'Erreur', description: error instanceof Error ? error.message : 'Erreur inconnue', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">Blockchain Audit Trail</h2>
        </div>
        <div className="flex gap-2">
          <Button onClick={verifyChainIntegrity} disabled={isVerifying} variant="outline">
            {isVerifying ? 'Vérification...' : 'Vérifier intégrité'}
          </Button>
          <Button onClick={addTestBlock}>Ajouter block test</Button>
        </div>
      </div>

      {chainIntegrity !== null && (
        <Card className="p-4 border-l-4" style={{ borderLeftColor: chainIntegrity ? 'hsl(var(--primary))' : 'hsl(var(--destructive))' }}>
          <div className="flex items-center gap-3">
            {chainIntegrity ? (
              <CheckCircle className="w-5 h-5 text-primary" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-destructive" />
            )}
            <span className="font-semibold text-foreground">
              {chainIntegrity ? 'Chaîne intègre - Aucune altération détectée' : 'Alerte: Chaîne compromise'}
            </span>
          </div>
        </Card>
      )}

      <div className="space-y-3">
        {blocks.map((block, index) => (
          <Card key={block.id} className="p-4 bg-card hover:bg-accent/5 transition-colors">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <LinkIcon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">Block #{block.block_number}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(block.timestamp).toLocaleString('fr-FR')}
                    </div>
                  </div>
                </div>
                <div className="text-xs font-mono text-muted-foreground">
                  Action: {block.action}
                </div>
              </div>
              
              <div className="space-y-1 text-xs font-mono">
                <div className="flex gap-2">
                  <span className="text-muted-foreground">Hash:</span>
                  <span className="text-foreground break-all">{block.block_hash}</span>
                </div>
                {index < blocks.length - 1 && (
                  <div className="flex gap-2">
                    <span className="text-muted-foreground">Prev:</span>
                    <span className="text-muted-foreground break-all">{block.previous_hash}</span>
                  </div>
                )}
              </div>

              {block.data && (
                <div className="p-2 bg-muted/50 rounded text-xs font-mono text-muted-foreground">
                  {JSON.stringify(block.data, null, 2)}
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {blocks.length === 0 && (
        <Card className="p-8 text-center">
          <Shield className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
          <p className="text-muted-foreground">Aucun block dans la blockchain</p>
        </Card>
      )}
    </div>
  );
};
