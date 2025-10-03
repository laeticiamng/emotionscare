
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Report } from '@/types/report';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Calendar, ArrowRight, Sparkles, LineChart } from 'lucide-react';
import { cn } from '@/lib/utils';
import useSound from '@/hooks/useSound';

interface ReportTimelineProps {
  reports: Report[];
}

const ReportTimeline: React.FC<ReportTimelineProps> = ({ reports }) => {
  const { playSound } = useSound();

  const sortedReports = [...reports].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('fr-FR', { 
      day: 'numeric', month: 'long', year: 'numeric' 
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Chronologie de votre parcours
        </CardTitle>
        <CardDescription>
          Visualisez votre progression et vos moments clés
        </CardDescription>
      </CardHeader>
      <CardContent className="relative pl-6 md:pl-8">
        {/* Vertical timeline line */}
        <div className="absolute left-0 top-0 bottom-0 w-px bg-primary/20 ml-3 md:ml-4" />

        <div className="space-y-8">
          {sortedReports.map((report, index) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
              onHoverStart={() => playSound('hover')}
            >
              {/* Timeline dot */}
              <div className="absolute -left-3 md:-left-4 mt-1.5">
                <motion.div 
                  className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white"
                  initial={{ scale: 0.8 }}
                  whileHover={{ scale: 1.2 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                  <LineChart className="w-3 h-3" />
                </motion.div>
              </div>

              <div className="pl-6 pb-6">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold">{report.title}</h3>
                  <Badge variant="outline" className={cn(
                    "text-xs",
                    report.type === 'weekly' ? "bg-blue-500/10 text-blue-500" : 
                    "bg-purple-500/10 text-purple-500"
                  )}>
                    {report.type === 'weekly' ? 'Hebdomadaire' : 'Mensuel'}
                  </Badge>
                </div>

                <p className="text-sm text-muted-foreground mb-3">
                  {formatDate(report.date)}
                </p>

                <div className="bg-muted/30 p-4 rounded-lg border border-muted">
                  <p className="text-sm mb-3">{report.summary}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {report.metrics.map((metric, idx) => (
                      <motion.div 
                        key={idx}
                        whileHover={{ scale: 1.02 }}
                        className="bg-background p-2 rounded-md"
                      >
                        <div className="text-xs text-muted-foreground">{metric.name}</div>
                        <div className="font-medium">{metric.value}</div>
                        <div className={cn(
                          "text-xs flex items-center",
                          metric.change > 0 ? "text-emerald-500" : metric.change < 0 ? "text-rose-500" : "text-muted-foreground"
                        )}>
                          {metric.change > 0 ? '↑' : metric.change < 0 ? '↓' : '–'}
                          {' '}{Math.abs(metric.change)}%
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {index === 0 && (
                    <motion.div 
                      className="mt-4 flex items-center justify-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1, duration: 0.5 }}
                    >
                      <Badge className="bg-primary/10 text-primary border-primary/30 flex items-center gap-1 py-1">
                        <Sparkles className="h-3 w-3" />
                        Dernier rapport disponible
                      </Badge>
                    </motion.div>
                  )}
                </div>

                {index < sortedReports.length - 1 && (
                  <div className="flex justify-center my-2">
                    <ArrowRight className="h-4 w-4 text-muted-foreground transform rotate-90" />
                  </div>
                )}
              </div>

              {index < sortedReports.length - 1 && (
                <Separator className="my-2" />
              )}
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportTimeline;
