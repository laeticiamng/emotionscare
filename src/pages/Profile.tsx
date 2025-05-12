
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { User, Mail, Briefcase, Building, Calendar, Edit } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const handleEditProfile = () => {
    navigate('/settings');
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader 
          title="Mon Profil" 
          description="Visualisez vos informations personnelles"
          icon={<User className="h-5 w-5" />}
        />
        
        <Card>
          <CardHeader className="relative pb-8">
            <div className="absolute right-6 top-6">
              <Button variant="outline" size="sm" onClick={handleEditProfile}>
                <Edit className="h-4 w-4 mr-2" />
                Modifier le profil
              </Button>
            </div>
            <div className="flex flex-col items-center sm:flex-row sm:items-start sm:space-x-6 pb-4">
              <Avatar className="h-24 w-24 border-4 border-background">
                <AvatarImage src={user?.avatar_url || ''} />
                <AvatarFallback>{user?.name?.substring(0, 2) || 'U'}</AvatarFallback>
              </Avatar>
              <div className="space-y-1 text-center sm:text-left mt-4 sm:mt-0">
                <CardTitle className="text-2xl">{user?.name || 'Utilisateur'}</CardTitle>
                <div className="flex items-center justify-center sm:justify-start text-muted-foreground">
                  <Mail className="h-4 w-4 mr-1" />
                  <span>{user?.email || 'utilisateur@exemple.com'}</span>
                </div>
                {user?.position && (
                  <div className="flex items-center justify-center sm:justify-start text-muted-foreground">
                    <Briefcase className="h-4 w-4 mr-1" />
                    <span>{user.position}</span>
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="font-medium mb-2 flex items-center">
                  <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                  Département
                </h3>
                <p>{user?.department || 'Non spécifié'}</p>
              </div>
              
              <div>
                <h3 className="font-medium mb-2 flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  Rejoint le
                </h3>
                <p>
                  {user?.joined_at 
                    ? new Date(user.joined_at).toLocaleDateString(undefined, { 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric' 
                      })
                    : 'Non spécifié'}
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-2 flex items-center">
                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                Bio
              </h3>
              <p className="text-muted-foreground">
                {user?.bio || 'Aucune biographie disponible.'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
