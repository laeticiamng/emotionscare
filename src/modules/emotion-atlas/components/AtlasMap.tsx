import React, { useMemo, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AtlasEmotionNode } from './AtlasEmotionNode';
import type { AtlasData, EmotionNode } from '../types';
import { cn } from '@/lib/utils';

interface AtlasMapProps {
  data: AtlasData;
  onNodeSelect: (node: EmotionNode) => void;
  selectedNodeId?: string;
  className?: string;
}

export const AtlasMap: React.FC<AtlasMapProps> = ({
  data,
  onNodeSelect,
  selectedNodeId,
  className
}) => {
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  // Créer les lignes de connexion
  const connectionLines = useMemo(() => {
    return data.connections.map((conn) => {
      const source = data.nodes.find((n) => n.id === conn.source);
      const target = data.nodes.find((n) => n.id === conn.target);
      if (!source || !target) return null;

      const isActive =
        hoveredNodeId === conn.source ||
        hoveredNodeId === conn.target ||
        selectedNodeId === conn.source ||
        selectedNodeId === conn.target;

      return (
        <motion.line
          key={`${conn.source}-${conn.target}`}
          x1={`${source.x}%`}
          y1={`${source.y}%`}
          x2={`${target.x}%`}
          y2={`${target.y}%`}
          stroke={isActive ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground) / 0.2)'}
          strokeWidth={isActive ? 2 : 1}
          strokeDasharray={isActive ? 'none' : '4,4'}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ 
            pathLength: 1, 
            opacity: isActive ? 0.8 : 0.3,
            strokeWidth: isActive ? 2 : 1
          }}
          transition={{ duration: 0.5, delay: Math.random() * 0.3 }}
        />
      );
    });
  }, [data, hoveredNodeId, selectedNodeId]);

  const handleNodeHover = useCallback((nodeId: string | null) => {
    setHoveredNodeId(nodeId);
  }, []);

  return (
    <div className={cn(
      'relative w-full aspect-square max-w-[600px] mx-auto',
      'rounded-2xl overflow-hidden',
      'bg-gradient-to-br from-background via-muted/30 to-background',
      'border border-border/50 shadow-lg',
      className
    )}>
      {/* Grille de fond */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 30%, hsl(var(--primary) / 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, hsl(var(--accent) / 0.1) 0%, transparent 50%),
            linear-gradient(90deg, hsl(var(--border) / 0.1) 1px, transparent 1px),
            linear-gradient(hsl(var(--border) / 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 100% 100%, 40px 40px, 40px 40px'
        }}
      />

      {/* SVG pour les connexions */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <AnimatePresence>
          {connectionLines}
        </AnimatePresence>
      </svg>

      {/* Nodes */}
      <AnimatePresence mode="popLayout">
        {data.nodes.map((node, index) => (
          <AtlasEmotionNode
            key={node.id}
            node={node}
            isSelected={selectedNodeId === node.id}
            isHovered={hoveredNodeId === node.id}
            onSelect={() => onNodeSelect(node)}
            onHover={(hovered) => handleNodeHover(hovered ? node.id : null)}
            delay={index * 0.05}
          />
        ))}
      </AnimatePresence>

      {/* Centre de l'atlas - "Moi" */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: 'spring' }}
      >
        <div className="relative flex items-center justify-center">
          <div className="absolute w-16 h-16 rounded-full bg-primary/20 animate-ping" />
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/30">
            <span className="text-primary-foreground font-bold text-sm">MOI</span>
          </div>
        </div>
      </motion.div>

      {/* Label si vide */}
      {data.nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <p className="text-lg font-medium">Aucune donnée émotionnelle</p>
            <p className="text-sm">Commencez par faire un scan pour remplir votre atlas</p>
          </div>
        </div>
      )}
    </div>
  );
};
