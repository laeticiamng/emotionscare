
import React from 'react';
import { KpiCardProps } from '@/types';
import KpiCard from '../../KpiCard';

const DraggableKpiCard: React.FC<KpiCardProps> = (props) => {
  return <KpiCard {...props} />;
};

export default DraggableKpiCard;
