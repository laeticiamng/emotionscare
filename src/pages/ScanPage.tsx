
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockUsers } from '@/data/mockData';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Scan, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const ScanPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = React.useState('');
  
  // Filter users based on search
  const filteredUsers = mockUsers.filter(user => 
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.anonymity_code?.toLowerCase().includes(search.toLowerCase()) ||
    user.role?.toLowerCase().includes(search.toLowerCase())
  );
  
  // Function to get color based on emotional score
  const getScoreColor = (score?: number) => {
    if (!score) return 'bg-gray-200';
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 60) return 'bg-green-500';
    if (score >= 40) return 'bg-yellow-500';
    if (score >= 20) return 'bg-orange-500';
    return 'bg-red-500';
  };
  
  return (
    <div className="cocoon-page">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Scan className="mr-2 text-primary" />
            Scan émotionnel
          </h1>
          <p className="text-muted-foreground mt-1">
            Visualisez l'état émotionnel de votre équipe
          </p>
        </div>
      </div>
      
      <div className="mb-6 flex">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            className="pl-10"
            placeholder="Rechercher par nom, code ou rôle..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <Card 
            key={user.id}
            className="cursor-pointer transition-all duration-300 hover:shadow-md hover:border-primary/30"
            onClick={() => navigate(`/scan/${user.id}`)}
          >
            <CardContent className="p-6 flex items-center">
              <Avatar className="h-14 w-14 border-2 border-muted">
                <AvatarImage src={user.avatar} />
                <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              
              <div className="ml-4 flex-1">
                <div className="font-medium">{user.name}</div>
                <div className="text-sm text-muted-foreground">{user.role}</div>
                <div className="flex items-center mt-1">
                  <div className="flex-1 bg-secondary h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${getScoreColor(user.emotional_score)}`} 
                      style={{ width: `${user.emotional_score}%` }}
                    ></div>
                  </div>
                  <span className="ml-2 text-sm font-medium">{user.emotional_score}/100</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Code: {user.anonymity_code}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ScanPage;
