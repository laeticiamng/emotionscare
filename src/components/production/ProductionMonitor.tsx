
import React, { useEffect, useState } from 'react';
import { runProductionAudit, ProductionAuditResult } from '@/utils/productionAudit';

const ProductionMonitor: React.FC = () => {
  const [audit, setAudit] = useState<ProductionAuditResult | null>(null);

  useEffect(() => {
    const result = runProductionAudit();
    setAudit(result);
  }, []);

  if (!audit || import.meta.env.PROD) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 max-w-sm bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold text-sm">Audit Production</h4>
        <span className={`text-xs px-2 py-1 rounded ${
          audit.isReady ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {audit.score}/100
        </span>
      </div>
      
      {audit.critical.length > 0 && (
        <div className="mb-2">
          <p className="text-xs font-medium text-red-600 mb-1">Critiques:</p>
          <ul className="text-xs text-red-700 space-y-1">
            {audit.critical.map((issue, index) => (
              <li key={index}>• {issue}</li>
            ))}
          </ul>
        </div>
      )}
      
      {audit.warnings.length > 0 && (
        <div>
          <p className="text-xs font-medium text-yellow-600 mb-1">Avertissements:</p>
          <ul className="text-xs text-yellow-700 space-y-1">
            {audit.warnings.slice(0, 2).map((warning, index) => (
              <li key={index}>• {warning}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProductionMonitor;
