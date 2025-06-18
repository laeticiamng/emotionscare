import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import MiniCoach from '@/components/coach/MiniCoach';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import ActionButtons from '@/components/home/ActionButtons';
import { useToast } from '@/components/ui/use-toast';
import { useUserMode } from '@/contexts/UserModeContext';
import GamificationWidget from '@/components/dashboard/widgets/GamificationWidget';

const UserDashboard: React.FC = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { mode } = useUserMode();

  useEffect(() => {
    if (!user) {
      navigate('/auth/login');
    }
  }, [user, navigate]);

  const handleDateSelect = (newDate: Date | undefined) => {
    setDate(newDate);
    toast({
      title: "Date sélectionnée",
      description: newDate ? format(newDate, "PPP", { locale: enUS }) : "Aucune date sélectionnée.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between space-x-2">
        <CardTitle className="text-2xl font-bold">
          Bienvenue sur votre tableau de bord, {user?.name}!
        </CardTitle>
      </div>
      
      <div className="dashboard-premium">
        <div className="dashboard-main">
          <Card className="space-y-4">
            <CardHeader>
              <CardTitle>Sélectionnez une date</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP", { locale: enUS }) : <span>Sélectionner une date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateSelect}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions Rapides</CardTitle>
            </CardHeader>
            <CardContent>
              <ActionButtons />
            </CardContent>
          </Card>
        </div>
        
        <div className="dashboard-side">
          {/* Add gamification widget */}
          <GamificationWidget />
          
          <MiniCoach className="h-96" quickQuestions={[
            "Comment puis-je gérer mon stress ?",
            "Quels sont les bienfaits de la méditation ?",
            "Comment améliorer ma qualité de sommeil ?",
          ]} />
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
