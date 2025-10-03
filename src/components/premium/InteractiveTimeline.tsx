
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle } from 'lucide-react';

interface TimelineEvent {
  date: string;
  title: string;
  description: string;
  completed?: boolean;
}

interface InteractiveTimelineProps {
  events: TimelineEvent[];
}

const InteractiveTimeline: React.FC<InteractiveTimelineProps> = ({ events }) => {
  const [activeEvent, setActiveEvent] = useState<number | null>(null);

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <Circle className="h-5 w-5 text-blue-500" />
        Timeline Interactive
      </h3>
      
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-purple-500" />

        <div className="space-y-6">
          {events.map((event, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative flex items-start gap-4"
              onMouseEnter={() => setActiveEvent(index)}
              onMouseLeave={() => setActiveEvent(null)}
            >
              {/* Timeline dot */}
              <motion.div
                className="relative z-10 flex-shrink-0"
                whileHover={{ scale: 1.2 }}
              >
                {event.completed ? (
                  <CheckCircle className="h-8 w-8 text-green-500 bg-white rounded-full" />
                ) : (
                  <Circle className="h-8 w-8 text-blue-500 bg-white rounded-full" />
                )}
              </motion.div>

              {/* Event content */}
              <motion.div
                className="flex-1 cursor-pointer"
                whileHover={{ scale: 1.02 }}
              >
                <div className={`p-4 rounded-xl border transition-all duration-300 ${
                  activeEvent === index 
                    ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 shadow-lg' 
                    : 'bg-white border-gray-200 hover:border-blue-300'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="text-xs">
                      {event.date}
                    </Badge>
                    {event.completed && (
                      <Badge className="bg-green-500 text-white">
                        Terminé
                      </Badge>
                    )}
                  </div>
                  
                  <h4 className="font-semibold text-lg mb-1">
                    {event.title}
                  </h4>
                  
                  <AnimatePresence>
                    {(activeEvent === index || event.completed) && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-muted-foreground text-sm"
                      >
                        {event.description}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default InteractiveTimeline;
