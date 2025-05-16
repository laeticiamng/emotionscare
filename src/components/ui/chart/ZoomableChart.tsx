
import React, { useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceArea } from 'recharts';

export interface ZoomableChartProps {
  children: React.ReactNode;
  data: any[];
  brushDataKey: string;
  showControls?: boolean;
}

export const ZoomableChart: React.FC<ZoomableChartProps> = ({ 
  children, 
  data,
  brushDataKey,
  showControls = true
}) => {
  const [left, setLeft] = useState<string | number>('dataMin');
  const [right, setRight] = useState<string | number>('dataMax');
  const [refAreaLeft, setRefAreaLeft] = useState<string | number>('');
  const [refAreaRight, setRefAreaRight] = useState<string | number>('');
  const [isZoomed, setIsZoomed] = useState(false);

  const getAxisYDomain = (from: number, to: number, ref: string, offset: number) => {
    const refData = data.slice(from - 1, to);
    let [bottom, top] = [refData[0][ref], refData[0][ref]];

    refData.forEach((d) => {
      if (d[ref] > top) top = d[ref];
      if (d[ref] < bottom) bottom = d[ref];
    });

    return [(bottom | 0) - offset, (top | 0) + offset];
  };

  const zoom = () => {
    if (refAreaLeft === refAreaRight || refAreaRight === '') {
      setRefAreaLeft('');
      setRefAreaRight('');
      return;
    }

    let leftValue = refAreaLeft;
    let rightValue = refAreaRight;

    if (refAreaLeft > refAreaRight) {
      leftValue = refAreaRight;
      rightValue = refAreaLeft;
    }

    setLeft(leftValue);
    setRight(rightValue);
    setRefAreaLeft('');
    setRefAreaRight('');
    setIsZoomed(true);
  };

  const zoomOut = () => {
    setLeft('dataMin');
    setRight('dataMax');
    setRefAreaLeft('');
    setRefAreaRight('');
    setIsZoomed(false);
  };

  return (
    <div className="w-full relative">
      {showControls && isZoomed && (
        <button
          className="absolute top-0 right-0 z-10 bg-accent/70 hover:bg-accent text-accent-foreground text-xs py-1 px-2 rounded"
          onClick={zoomOut}
        >
          Reset Zoom
        </button>
      )}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          onMouseDown={(e) => e && e.activeLabel && setRefAreaLeft(e.activeLabel)}
          onMouseMove={(e) => refAreaLeft && e && e.activeLabel && setRefAreaRight(e.activeLabel)}
          onMouseUp={zoom}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <XAxis 
            dataKey={brushDataKey} 
            allowDataOverflow 
            domain={[left, right]} 
          />
          <YAxis allowDataOverflow />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          
          {React.Children.map(children, child => child)}
          
          {refAreaLeft && refAreaRight && (
            <ReferenceArea x1={refAreaLeft} x2={refAreaRight} strokeOpacity={0.3} />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
