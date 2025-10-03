import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { motion } from 'framer-motion';

interface FaceMoodCardProps {
  data: {
    valence_face_avg: number;
    joy_face_avg: number;
  };
}

const valenceColor = (v: number) => {
  const hue = Math.min(Math.max(v, 0), 1) * 120; // 0 red -> 120 green
  return `hsl(${hue}, 70%, 50%)`;
};

export const FaceMoodCard: React.FC<FaceMoodCardProps> = ({ data }) => {
  const { valence_face_avg, joy_face_avg } = data;
  const color = valenceColor(valence_face_avg);
  return (
    <Card className="flex flex-col items-center" aria-label={`Valence moyenne visage ${valence_face_avg.toFixed(2)} sur 1`}>
      <CardHeader className="pb-2">
        <CardTitle>Humeur visage</CardTitle>
      </CardHeader>
      <CardContent className="w-full flex flex-col items-center">
        <motion.div animate={{ value: valence_face_avg }} className="w-24 h-24">
          <CircularProgressbar
            value={valence_face_avg * 100}
            styles={buildStyles({ pathColor: color, trailColor: '#eee' })}
          />
        </motion.div>
        {joy_face_avg > 0.5 && (
          <span role="img" aria-label="happy" className="text-2xl mt-2">
            😊
          </span>
        )}
      </CardContent>
    </Card>
  );
};

export default FaceMoodCard;
