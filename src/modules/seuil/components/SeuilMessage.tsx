/**
 * Affichage du message de zone SEUIL
 * Messages empathiques et non-jugeants selon le niveau
 */
import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { getZoneFromLevel } from '../constants';

interface SeuilMessageProps {
  level: number;
}

export const SeuilMessage: React.FC<SeuilMessageProps> = memo(({ level }) => {
  const zoneConfig = getZoneFromLevel(level);

  return (
    <motion.div
      key={zoneConfig.zone}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`relative p-6 rounded-2xl bg-gradient-to-br ${zoneConfig.ambiance.gradient} border overflow-hidden`}
    >
      {/* Subtle animated background */}
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{
          background: [
            'radial-gradient(circle at 0% 0%, currentColor 0%, transparent 50%)',
            'radial-gradient(circle at 100% 100%, currentColor 0%, transparent 50%)',
            'radial-gradient(circle at 0% 0%, currentColor 0%, transparent 50%)',
          ],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      />

      <div className="relative z-10">
        {/* Icon indicator */}
        <div className={`w-12 h-12 rounded-full mb-4 flex items-center justify-center ${
          zoneConfig.zone === 'low' ? 'bg-emerald-500/20' :
          zoneConfig.zone === 'intermediate' ? 'bg-amber-500/20' :
          zoneConfig.zone === 'critical' ? 'bg-rose-500/20' :
          'bg-indigo-500/20'
        }`}>
          <span className="text-2xl">
            {zoneConfig.zone === 'low' ? '🌿' :
             zoneConfig.zone === 'intermediate' ? '⚡' :
             zoneConfig.zone === 'critical' ? '🔥' : '🌙'}
          </span>
        </div>

        {/* Message with line breaks */}
        <p className="text-lg leading-relaxed whitespace-pre-line">
          {zoneConfig.message}
        </p>
      </div>
    </motion.div>
  );
});

SeuilMessage.displayName = 'SeuilMessage';

export default SeuilMessage;
