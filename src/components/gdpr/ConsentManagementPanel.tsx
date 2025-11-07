// @ts-nocheck
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Mail, MessageSquare, Bell, Phone, MapPin,
  Check, X, History, TrendingUp, Shield, Info
} from 'lucide-react';
import { useConsentManagement } from '@/hooks/useConsentManagement';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Alert, AlertDescription } from '@/components/ui/alert';

const channelIcons: Record<string, any> = {
  email: Mail,
  sms: MessageSquare,
  push: Bell,
  phone: Phone,
  postal: MapPin,
};

export const ConsentManagementPanel = () => {
  const {
    channels,
    purposes,
    consentStatus,
    history,
    campaigns,
    isLoading,
    updateConsent,
    isUpdating,
  } = useConsentManagement();

  const [activeTab, setActiveTab] = useState('preferences');

  // Organiser les consentements par canal
  const consentsByChannel = channels.reduce((acc, channel) => {
    acc[channel.channel_code] = purposes.map(purpose => {
      const status = consentStatus.find(
        cs => cs.channel_code === channel.channel_code && cs.purpose_code === purpose.purpose_code
      );
      return {
        channel,
        purpose,
        consent_given: status?.consent_given || false,
        last_updated: status?.last_updated,
      };
    });
    return acc;
  }, {} as Record<string, any[]>);

  const handleToggle = async (channelId: string, purposeId: string, currentValue: boolean) => {
    try {
      await updateConsent({
        channelId,
        purposeId,
        consentGiven: !currentValue,
      });
    } catch (error) {
      console.error('Error updating consent:', error);
    }
  };

  // Statistiques
  const totalConsents = consentStatus.length;
  const grantedConsents = consentStatus.filter(cs => cs.consent_given).length;
  const consentRate = totalConsents > 0 ? Math.round((grantedConsents / totalConsents) * 100) : 0;

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistiques globales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Taux de consentement</p>
                <p className="text-2xl font-bold">{consentRate}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Consentements actifs</p>
                <p className="text-2xl font-bold">{grantedConsents}</p>
              </div>
              <Check className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Campagnes actives</p>
                <p className="text-2xl font-bold">{campaigns.length}</p>
              </div>
              <Mail className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs principales */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="preferences">Préférences</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
          <TabsTrigger value="campaigns">Campagnes</TabsTrigger>
        </TabsList>

        {/* Onglet Préférences */}
        <TabsContent value="preferences" className="space-y-4">
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Gérez vos préférences de communication par canal et finalité. 
              Les communications de service restent actives pour le bon fonctionnement de l'application.
            </AlertDescription>
          </Alert>

          {channels.map(channel => {
            const Icon = channelIcons[channel.channel_code] || Bell;
            const channelConsents = consentsByChannel[channel.channel_code] || [];

            return (
              <Card key={channel.id}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{channel.channel_name}</CardTitle>
                      <CardDescription>{channel.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {channelConsents.map(({ purpose, consent_given, last_updated }) => (
                    <div 
                      key={purpose.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium">{purpose.purpose_name}</p>
                          {purpose.is_required && (
                            <Badge variant="secondary">Requis</Badge>
                          )}
                          <Badge variant="outline" className="text-xs">
                            {purpose.legal_basis === 'consent' ? 'Consentement' : 'Intérêt légitime'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{purpose.description}</p>
                        {last_updated && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Dernière modification : {format(new Date(last_updated), 'Pp', { locale: fr })}
                          </p>
                        )}
                      </div>
                      <Switch
                        checked={consent_given}
                        onCheckedChange={() => handleToggle(channel.id, purpose.id, consent_given)}
                        disabled={purpose.is_required || isUpdating}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        {/* Onglet Historique */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Historique des changements
              </CardTitle>
              <CardDescription>
                Tous les changements de vos préférences de consentement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-4">
                  {history.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      Aucun changement enregistré
                    </p>
                  ) : (
                    history.map(item => (
                      <div 
                        key={item.id}
                        className="flex items-start gap-4 p-4 border rounded-lg"
                      >
                        <div className={`p-2 rounded-full ${item.new_consent ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                          {item.new_consent ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <X className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">
                            {item.channel.channel_name} - {item.purpose.purpose_name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {item.new_consent ? 'Consentement accordé' : 'Consentement retiré'}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span>{format(new Date(item.created_at), 'Pp', { locale: fr })}</span>
                            <Badge variant="outline" className="text-xs">
                              {item.source}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Campagnes */}
        <TabsContent value="campaigns">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Campagnes marketing actives
              </CardTitle>
              <CardDescription>
                Campagnes pour lesquelles vous avez donné votre consentement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {campaigns.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    Aucune campagne active
                  </p>
                ) : (
                  campaigns.map(campaign => (
                    <div 
                      key={campaign.id}
                      className="p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold">{campaign.campaign_name}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {campaign.description}
                          </p>
                        </div>
                        <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'}>
                          {campaign.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-3">
                        <span>Début : {format(new Date(campaign.start_date), 'P', { locale: fr })}</span>
                        {campaign.end_date && (
                          <span>Fin : {format(new Date(campaign.end_date), 'P', { locale: fr })}</span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
