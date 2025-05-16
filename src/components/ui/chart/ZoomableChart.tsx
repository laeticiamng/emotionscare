
import React, { useState, ReactNode } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceArea, ResponsiveContainer } from 'recharts';

export interface ZoomableChartProps {
  data: any[];
  children?: ReactNode;
  width?: number | string;
  height?: number | string;
  margin?: { top: number; right: number; bottom: number; left: number };
}

export const ZoomableChart: React.FC<ZoomableChartProps> = ({
  data,
  children,
  width = '100%',
  height = 400,
  margin = { top: 20, right: 20, bottom: 20, left: 20 }
}) => {
  const [refAreaLeft, setRefAreaLeft] = useState('');
  const [refAreaRight, setRefAreaRight] = useState('');
  const [zoomedData, setZoomedData] = useState(data);

  const getAxisYDomain = (from: number, to: number, ref: string, offset: number) => {
    const refData = data.slice(from - 1, to);
    let [bottom, top] = [refData[0][ref], refData[0][ref]];
    
    refData.forEach(d => {
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

    let left = refAreaLeft;
    let right = refAreaRight;

    if (left > right) {
      [left, right] = [right, left];
    }

    const leftIndex = data.findIndex(d => d.name === left);
    const rightIndex = data.findIndex(d => d.name === right);
    
    if (leftIndex !== -1 && rightIndex !== -1) {
      const zoomed = data.slice(leftIndex, rightIndex + 1);
      setZoomedData(zoomed);
    }
    
    setRefAreaLeft('');
    setRefAreaRight('');
  };

  const handleMouseDown = (e: any) => {
    if (e && e.activeLabel) {
      setRefAreaLeft(e.activeLabel);
    }
  };
  
  const handleMouseMove = (e: any) => {
    if (refAreaLeft && e && e.activeLabel) {
      setRefAreaRight(e.activeLabel);
    }
  };

  const handleReset = () => {
    setZoomedData(data);
  };

  return (
    <div className="zoomable-chart">
      <ResponsiveContainer width={width} height={height}>
        <LineChart
          data={zoomedData}
          margin={margin}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={zoom}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name"
            allowDataOverflow 
          />
          <YAxis 
            allowDataOverflow 
          />
          <Tooltip />
          <Legend />
          
          {children}
          
          {refAreaLeft && refAreaRight && (
            <ReferenceArea
              x1={refAreaLeft}
              x2={refAreaRight}
              strokeOpacity={0.3}
              fill="rgba(100, 100, 100, 0.1)"
            />
          )}
        </LineChart>
      </ResponsiveContainer>
      
      {zoomedData.length !== data.length && (
        <button
          className="mt-2 text-sm text-muted-foreground hover:text-foreground"
          onClick={handleReset}
        >
          Reset Zoom
        </button>
      )}
    </div>
  );
};
