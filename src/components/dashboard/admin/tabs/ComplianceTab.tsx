
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from 'lucide-react';

interface ComplianceTabProps {
  complianceData: {
    mfaEnabled: number;
    lastKeyRotation: string;
    lastPentest: string;
    gdprCompliance: string;
    dataRetention: string;
    certifications: string[];
  };
}

const ComplianceTab: React.FC<ComplianceTabProps> = ({ complianceData }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Statut de sécurité</CardTitle>
          <CardDescription>Synthèse des indicateurs clés</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>MFA activée</span>
              <span className="font-medium">{complianceData.mfaEnabled}% des utilisateurs</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Dernière rotation des clés</span>
              <span className="font-medium">{new Date(complianceData.lastKeyRotation).toLocaleDateString('fr-FR')}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Dernier test de pénétration</span>
              <span className="font-medium">{new Date(complianceData.lastPentest).toLocaleDateString('fr-FR')}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Conformité RGPD</span>
              <span className="font-medium text-green-600">{complianceData.gdprCompliance}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Conservation des données</span>
              <span className="font-medium text-green-600">{complianceData.dataRetention}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Certifications</CardTitle>
          <CardDescription>Standards de sécurité et conformité</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {complianceData.certifications.map((cert, i) => (
              <div key={i} className="p-4 bg-white rounded-xl shadow-sm text-center">
                <ShieldCheck className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <h4 className="font-medium">{cert}</h4>
                <p className="text-xs text-green-600">Certifié</p>
              </div>
            ))}
          </div>
          
          <div className="mt-6">
            <Button className="w-full" variant="outline">
              Voir tous les documents de certification
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card className="col-span-1 md:col-span-2 glass-card">
        <CardHeader>
          <CardTitle>Journal d'audit</CardTitle>
          <CardDescription>Activités récentes sur la plateforme</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-left py-3 px-4">Utilisateur</th>
                  <th className="text-left py-3 px-4">Action</th>
                  <th className="text-left py-3 px-4">Détails</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4">05/05/2025 09:32</td>
                  <td className="py-3 px-4">admin@example.com</td>
                  <td className="py-3 px-4">Connexion réussie</td>
                  <td className="py-3 px-4">IP: 192.168.1.1</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4">04/05/2025 17:15</td>
                  <td className="py-3 px-4">john.doe@example.com</td>
                  <td className="py-3 px-4">Modification de rôle</td>
                  <td className="py-3 px-4">User → Manager</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4">03/05/2025 14:22</td>
                  <td className="py-3 px-4">admin@example.com</td>
                  <td className="py-3 px-4">Configuration MFA</td>
                  <td className="py-3 px-4">Activation pour tous</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="mt-6">
            <Button className="bg-gray-700 hover:bg-gray-800 text-white">
              Télécharger le rapport d'audit complet
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComplianceTab;
