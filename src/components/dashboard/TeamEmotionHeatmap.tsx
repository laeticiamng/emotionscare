import React from 'react';

interface TeamEmotionHeatmapProps {
  data: { week: string; ab: number; ev: number; joy: number; voice: number }[];
}

export const TeamEmotionHeatmap: React.FC<TeamEmotionHeatmapProps> = ({ data }) => {
  return (
    <div className="grid grid-cols-8 gap-1" aria-label="Heatmap équipe">
      {data.map((row, i) => (
        <div key={i} className="flex flex-col space-y-1">
          {[row.ab, row.ev, row.joy, row.voice].map((v, j) => (
            <div
              key={j}
              className="w-3 h-3 rounded"
              style={{ backgroundColor: `rgba(0,0,0,${v})` }}
            ></div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default TeamEmotionHeatmap;
