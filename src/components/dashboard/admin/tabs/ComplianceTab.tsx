// @ts-nocheck
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from '@/components/ui/skeleton';

interface ComplianceTabProps {
  complianceData: {
    mfaEnabled: number;
    lastKeyRotation: string;
    lastPentest: string;
    gdprCompliance: string;
    dataRetention: string;
    certifications: string[];
  };
  isLoading?: boolean;
}

const ComplianceTab: React.FC<ComplianceTabProps> = ({ complianceData, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Sécurité Multi-Facteur (MFA)</CardTitle>
          <CardDescription>Pourcentage d'utilisateurs avec MFA activé</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <div className="text-4xl font-bold">{complianceData.mfaEnabled}%</div>
        </CardContent>
      </Card>
      
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Dernière Rotation des Clés</CardTitle>
          <CardDescription>Date de la dernière rotation des clés de sécurité</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <div>{new Date(complianceData.lastKeyRotation).toLocaleDateString('fr-FR')}</div>
        </CardContent>
      </Card>
      
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Dernier Test d'Intrusion</CardTitle>
          <CardDescription>Date du dernier test d'intrusion réalisé</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <div>{new Date(complianceData.lastPentest).toLocaleDateString('fr-FR')}</div>
        </CardContent>
      </Card>
      
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Conformité RGPD</CardTitle>
          <CardDescription>Statut de la conformité au RGPD</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <Badge variant="outline">{complianceData.gdprCompliance}</Badge>
        </CardContent>
      </Card>
      
      <Card className="glass-card col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle>Politique de Rétention des Données</CardTitle>
          <CardDescription>Durée de conservation des données utilisateurs</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <div>{complianceData.dataRetention}</div>
        </CardContent>
      </Card>
      
      <Card className="glass-card col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle>Certifications</CardTitle>
          <CardDescription>Certifications de sécurité et conformité</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {complianceData.certifications.map((cert, i) => (
            <Badge key={i} variant="secondary">{cert}</Badge>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default ComplianceTab;
