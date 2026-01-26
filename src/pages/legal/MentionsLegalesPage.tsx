import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Building, Mail, Shield } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { routes } from '@/lib/routes';

/**
 * Page Mentions Légales - Conforme Art. L111-7 Code de la consommation
 */
export const MentionsLegalesPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <Button
          onClick={() => navigate(routes.public.home())}
          variant="outline"
          size="sm"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl flex items-center gap-2">
              <Shield className="h-8 w-8 text-primary" />
              Mentions Légales
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Conformément à l'article 6 de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique
            </p>
          </CardHeader>

          <CardContent className="prose prose-slate dark:prose-invert max-w-none space-y-8">
            <section>
              <h2 className="flex items-center gap-2">
                <Building className="h-5 w-5 text-primary" />
                1. Identification de l'éditeur
              </h2>
              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <p><strong>Raison sociale :</strong> EmotionsCare SAS</p>
                <p><strong>Forme juridique :</strong> Société par Actions Simplifiée</p>
                <p><strong>Capital social :</strong> 50 000 €</p>
                <p><strong>Siège social :</strong> 123 Avenue de l'Innovation, 75001 Paris, France</p>
                <p><strong>RCS :</strong> Paris B 987 654 321</p>
                <p><strong>SIRET :</strong> 987 654 321 00012</p>
                <p><strong>N° TVA intracommunautaire :</strong> FR 12 987654321</p>
                <p><strong>Directeur de la publication :</strong> Jean Dupont, Président</p>
                <p><strong>Email :</strong> contact@emotionscare.com</p>
                <p><strong>Téléphone :</strong> +33 1 23 45 67 89</p>
              </div>
            </section>

            <section>
              <h2>2. Hébergement</h2>
              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <p><strong>Hébergeur web :</strong> Lovable (interface)</p>
                <p><strong>Adresse :</strong> Lovable Platform, États-Unis</p>
                <p><strong>Site :</strong> <a href="https://lovable.dev" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">lovable.dev</a></p>
                
                <hr className="my-4" />
                
                <p><strong>Hébergeur base de données :</strong> Supabase Inc.</p>
                <p><strong>Adresse :</strong> 970 Toa Payoh North, #07-04, Singapore 318992</p>
                <p><strong>Datacenter :</strong> Union Européenne (Frankfurt, Allemagne)</p>
                <p><strong>Site :</strong> <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">supabase.com</a></p>
              </div>
            </section>

            <section>
              <h2>3. Données personnelles et RGPD</h2>
              <p>
                <strong>Responsable du traitement :</strong> EmotionsCare SAS
              </p>
              <p>
                <strong>Délégué à la Protection des Données (DPO) :</strong><br />
                Email : <a href="mailto:dpo@emotionscare.com" className="text-primary hover:underline">dpo@emotionscare.com</a><br />
                Adresse : EmotionsCare – DPO, 123 Avenue de l'Innovation, 75001 Paris
              </p>
              <p>
                Pour plus d'informations sur le traitement de vos données personnelles, consultez notre{' '}
                <Link to="/legal/privacy" className="text-primary hover:underline">Politique de confidentialité</Link>.
              </p>
              <p>
                <strong>Réclamation CNIL :</strong> Vous pouvez introduire une réclamation auprès de la Commission Nationale de l'Informatique et des Libertés (CNIL) :<br />
                CNIL - 3 Place de Fontenoy - TSA 80715 - 75334 PARIS CEDEX 07<br />
                Tél : 01 53 73 22 22 - Site : <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">www.cnil.fr</a>
              </p>
            </section>

            <section>
              <h2>4. Propriété intellectuelle</h2>
              <p>
                L'ensemble du contenu de ce site (textes, images, vidéos, graphismes, logo, icônes, sons, logiciels) 
                est la propriété exclusive d'EmotionsCare SAS ou de ses partenaires, sauf mention contraire.
              </p>
              <p>
                Toute reproduction, représentation, modification, publication, adaptation de tout ou partie des 
                éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite, sauf autorisation 
                écrite préalable d'EmotionsCare.
              </p>
              <p>
                <strong>Marques déposées :</strong>
              </p>
              <ul>
                <li>EmotionsCare™ (marque déposée INPI - demande en cours)</li>
                <li>ResiMax™ (marque déposée INPI - demande en cours)</li>
              </ul>
              <p>
                Pour consulter les licences des logiciels open source utilisés, voir notre page{' '}
                <Link to="/legal/licenses" className="text-primary hover:underline">Crédits & Licences</Link>.
              </p>
            </section>

            <section>
              <h2>5. Limitation de responsabilité</h2>
              <p>
                EmotionsCare s'efforce d'assurer au mieux de ses possibilités, l'exactitude et la mise à jour des 
                informations diffusées sur ce site. Toutefois, EmotionsCare ne peut garantir l'exactitude, la 
                précision ou l'exhaustivité des informations mises à disposition sur ce site.
              </p>
              <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 my-4">
                <p className="font-semibold text-destructive mb-2">⚠️ Avertissement médical important</p>
                <p>
                  EmotionsCare est un outil de bien-être et de suivi émotionnel. Il ne constitue en aucun cas un 
                  dispositif médical, un diagnostic médical ou un traitement thérapeutique. Il ne remplace pas une 
                  consultation médicale ou psychologique auprès d'un professionnel de santé qualifié.
                </p>
                <p className="mt-2">
                  En cas de détresse psychologique, de pensées suicidaires ou d'urgence médicale, contactez 
                  immédiatement le 15 (SAMU), le 112 (urgences européennes) ou le 3114 (numéro national de 
                  prévention du suicide).
                </p>
              </div>
            </section>

            <section>
              <h2>6. Médiation de la consommation</h2>
              <p>
                Conformément à l'article L612-1 du Code de la consommation, EmotionsCare propose un dispositif de 
                médiation de la consommation.
              </p>
              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <p><strong>Médiateur :</strong> Centre de Médiation de la Consommation de Conciliateurs de Justice (CM2C)</p>
                <p><strong>Adresse :</strong> 14 rue Saint Jean, 75017 Paris</p>
                <p><strong>Site web :</strong> <a href="https://www.cm2c.net" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">www.cm2c.net</a></p>
                <p><strong>Email :</strong> contact@cm2c.net</p>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Le recours à la médiation est gratuit. Le consommateur doit avoir préalablement fait une réclamation 
                écrite auprès d'EmotionsCare qui n'a pas abouti.
              </p>
            </section>

            <section>
              <h2>7. Loi applicable et juridiction compétente</h2>
              <p>
                Les présentes mentions légales sont régies par le droit français. En cas de litige et à défaut 
                d'accord amiable, le litige sera porté devant les tribunaux français conformément aux règles de 
                compétence en vigueur.
              </p>
            </section>

            <section>
              <h2 className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                8. Contact
              </h2>
              <p>Pour toute question concernant ces mentions légales :</p>
              <ul>
                <li><strong>Email :</strong> <a href="mailto:legal@emotionscare.com" className="text-primary hover:underline">legal@emotionscare.com</a></li>
                <li><strong>Téléphone :</strong> +33 1 23 45 67 89</li>
                <li><strong>Courrier :</strong> EmotionsCare SAS - Service Juridique - 123 Avenue de l'Innovation - 75001 Paris</li>
              </ul>
            </section>

            <section className="text-sm text-muted-foreground border-t pt-4">
              <p><strong>Dernière mise à jour :</strong> {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              <p><strong>Version :</strong> 1.0</p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MentionsLegalesPage;
