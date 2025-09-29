
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { AuditLog, ConsentRecord, DataRequest, PrivacySettings } from '@/types/privacy';
import { toast } from 'sonner';

interface EthicsContextType {
  auditLogs: AuditLog[];
  consentRecords: ConsentRecord[];
  dataRequests: DataRequest[];
  privacySettings: PrivacySettings;
  logAction: (action: AuditLog['action'], resource: string, success: boolean, details?: string) => Promise<void>;
  updateConsent: (consentType: ConsentRecord['consentType'], granted: boolean) => Promise<void>;
  requestDataExport: () => Promise<void>;
  requestDataDeletion: () => Promise<void>;
  updatePrivacySettings: (settings: Partial<PrivacySettings>) => Promise<void>;
  exportUserData: () => Promise<void>;
  loading: boolean;
}

const EthicsContext = createContext<EthicsContextType | undefined>(undefined);

export const EthicsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [consentRecords, setConsentRecords] = useState<ConsentRecord[]>([]);
  const [dataRequests, setDataRequests] = useState<DataRequest[]>([]);
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    dataSharing: false,
    analytics: true,
    marketing: false,
    anonymization: true,
    dataRetention: 24,
    exportFormat: 'json'
  });
  const [loading, setLoading] = useState(false);

  const logAction = async (
    action: AuditLog['action'], 
    resource: string, 
    success: boolean, 
    details?: string
  ) => {
    if (!user) return;

    const log: AuditLog = {
      id: Date.now().toString(),
      userId: user.id,
      action,
      resource,
      timestamp: new Date().toISOString(),
      success,
      details,
      metadata: {
        userRole: user.role,
        sessionId: Date.now()
      }
    };

    setAuditLogs(prev => [log, ...prev].slice(0, 100)); // Garder 100 derniers logs
    
    // Simuler l'envoi au serveur
    try {
      console.log('Audit log saved:', log);
    } catch (error) {
      console.error('Failed to save audit log:', error);
    }
  };

  const updateConsent = async (consentType: ConsentRecord['consentType'], granted: boolean) => {
    if (!user) return;

    setLoading(true);
    try {
      const consent: ConsentRecord = {
        id: Date.now().toString(),
        userId: user.id,
        consentType,
        granted,
        timestamp: new Date().toISOString(),
        version: '1.0',
        source: 'settings'
      };

      setConsentRecords(prev => [consent, ...prev]);
      await logAction('consent_given', consentType, true, `Consent ${granted ? 'granted' : 'revoked'}`);
      
      toast.success(`Consentement ${granted ? 'accordé' : 'retiré'} pour ${consentType}`);
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du consentement');
    } finally {
      setLoading(false);
    }
  };

  const requestDataExport = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const request: DataRequest = {
        id: Date.now().toString(),
        userId: user.id,
        type: 'export',
        status: 'pending',
        requestDate: new Date().toISOString()
      };

      setDataRequests(prev => [request, ...prev]);
      await logAction('data_export', 'user_data', true, 'Export request submitted');
      
      toast.success('Demande d\'export soumise');
    } catch (error) {
      toast.error('Erreur lors de la demande d\'export');
    } finally {
      setLoading(false);
    }
  };

  const requestDataDeletion = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const request: DataRequest = {
        id: Date.now().toString(),
        userId: user.id,
        type: 'delete',
        status: 'pending',
        requestDate: new Date().toISOString()
      };

      setDataRequests(prev => [request, ...prev]);
      await logAction('data_delete', 'user_data', true, 'Deletion request submitted');
      
      toast.success('Demande de suppression soumise');
    } catch (error) {
      toast.error('Erreur lors de la demande de suppression');
    } finally {
      setLoading(false);
    }
  };

  const updatePrivacySettings = async (settings: Partial<PrivacySettings>) => {
    if (!user) return;

    setLoading(true);
    try {
      const newSettings = { ...privacySettings, ...settings };
      setPrivacySettings(newSettings);
      await logAction('preference_change', 'privacy_settings', true, 'Privacy settings updated');
      
      toast.success('Paramètres de confidentialité mis à jour');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour des paramètres');
    } finally {
      setLoading(false);
    }
  };

  const exportUserData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const userData = {
        user: user,
        auditLogs: auditLogs,
        consentRecords: consentRecords,
        privacySettings: privacySettings,
        exportDate: new Date().toISOString()
      };

      const blob = new Blob([JSON.stringify(userData, null, 2)], { 
        type: 'application/json' 
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `emotionscare-data-${user.id}-${Date.now()}.json`;
      a.click();
      
      URL.revokeObjectURL(url);
      
      await logAction('data_export', 'complete_export', true, 'User data exported');
      toast.success('Données exportées avec succès');
    } catch (error) {
      toast.error('Erreur lors de l\'export des données');
    } finally {
      setLoading(false);
    }
  };

  // Initialiser les données au montage
  useEffect(() => {
    if (isAuthenticated && user) {
      logAction('login', 'application', true, 'User session started');
    }
  }, [isAuthenticated, user]);

  return (
    <EthicsContext.Provider value={{
      auditLogs,
      consentRecords,
      dataRequests,
      privacySettings,
      logAction,
      updateConsent,
      requestDataExport,
      requestDataDeletion,
      updatePrivacySettings,
      exportUserData,
      loading
    }}>
      {children}
    </EthicsContext.Provider>
  );
};

export const useEthics = () => {
  const context = useContext(EthicsContext);
  if (!context) {
    throw new Error('useEthics must be used within an EthicsProvider');
  }
  return context;
};
