
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmotionalStatsWidget } from '@/components/dashboard/b2c/widgets/EmotionalStatsWidget';
import { QuickActionsWidget } from '@/components/dashboard/b2c/widgets/QuickActionsWidget';
import { GoalsProgressWidget } from '@/components/dashboard/b2c/widgets/GoalsProgressWidget';
import { RecentActivityWidget } from '@/components/dashboard/b2c/widgets/RecentActivityWidget';
import { MoodTrendWidget } from '@/components/dashboard/b2c/widgets/MoodTrendWidget';
import { WeeklyInsightsWidget } from '@/components/dashboard/b2c/widgets/WeeklyInsightsWidget';
import { PersonalizedRecommendationsWidget } from '@/components/dashboard/b2c/widgets/PersonalizedRecommendationsWidget';
import { Button } from '@/components/ui/button';
import { Bell, Settings, Calendar, Users } from 'lucide-react';

const B2CDashboardPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Bonjour, Sarah ! 👋
            </h1>
            <p className="text-muted-foreground mt-2">
              Voici votre tableau de bord personnel EmotionsCare
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Planifier
            </Button>
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Paramètres
            </Button>
          </div>
        </div>

        {/* Quick Status */}
        <Card className="mb-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-2">État Émotionnel Actuel</h2>
                <p className="text-blue-100">Calme et Concentré - Score: 82/100</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">82%</div>
                <div className="text-blue-100 text-sm">+7% cette semaine</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <MoodTrendWidget />
            <PersonalizedRecommendationsWidget />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <EmotionalStatsWidget />
            <QuickActionsWidget />
            <GoalsProgressWidget />
          </div>
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <WeeklyInsightsWidget />
          <RecentActivityWidget />
        </div>

        {/* Community Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Communauté Bien-être
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <h3 className="font-medium">Rejoignez le Social Cocon</h3>
                <p className="text-sm text-muted-foreground">
                  Partagez anonymement avec d'autres personnes dans votre situation
                </p>
              </div>
              <Button>Découvrir</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default B2CDashboardPage;
