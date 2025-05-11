
import React from 'react';
import { Card } from '@/components/ui/card';

interface Department {
  id: string;
  name: string;
  manager: string;
  employeeCount: number;
}

interface Team {
  id: string;
  name: string;
  departmentId: string;
  lead: string;
  members: Array<{id: string; name: string;}>;
}

interface OrgChartProps {
  departments: Department[];
  teams: Team[];
}

const OrgChart: React.FC<OrgChartProps> = ({ departments, teams }) => {
  return (
    <div className="overflow-auto">
      <div className="min-w-[800px]">
        {/* CEO */}
        <div className="flex justify-center mb-8">
          <Card className="p-4 w-64 bg-primary/10 border-primary">
            <div className="text-center">
              <div className="font-bold">CEO</div>
              <div>Alexandre Martin</div>
              <div className="text-xs text-muted-foreground mt-1">Direction Générale</div>
            </div>
          </Card>
        </div>
        
        {/* Connect line */}
        <div className="flex justify-center">
          <div className="w-0.5 h-8 bg-border"></div>
        </div>
        
        {/* Department Heads */}
        <div className="flex justify-center mb-8">
          <div className="grid grid-cols-4 gap-8 relative">
            {/* Horizontal line connecting all departments */}
            <div className="absolute left-1/2 top-0 h-0.5 bg-border w-full -translate-x-1/2 -translate-y-4"></div>
            
            {/* Vertical lines connecting to departments */}
            {departments.map((_, index) => (
              <div 
                key={`line-${index}`}
                className="absolute bg-border w-0.5 h-4" 
                style={{
                  left: `calc(${25 * index}% + 12.5%)`,
                  top: '-16px'
                }}
              />
            ))}
            
            {departments.map((dept) => (
              <Card key={dept.id} className="p-4 bg-secondary/20 border-secondary">
                <div className="text-center">
                  <div className="font-bold">{dept.name}</div>
                  <div className="text-sm">{dept.manager}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {dept.employeeCount} membres
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
        
        {/* Connect lines from departments to teams */}
        <div className="grid grid-cols-4 gap-8 mb-2">
          {departments.map((dept) => {
            const deptTeams = teams.filter(team => team.departmentId === dept.id);
            return (
              <div key={`conn-${dept.id}`} className="flex flex-col items-center">
                {deptTeams.length > 0 && (
                  <>
                    <div className="w-0.5 h-8 bg-border"></div>
                    {deptTeams.length > 1 && (
                      <div className="relative w-full h-0.5 bg-border"></div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
        
        {/* Teams */}
        <div className="grid grid-cols-4 gap-8">
          {departments.map((dept) => {
            const deptTeams = teams.filter(team => team.departmentId === dept.id);
            return (
              <div key={`teams-${dept.id}`} className="flex flex-col space-y-4">
                {deptTeams.map((team) => (
                  <Card key={team.id} className="p-4 border-dashed">
                    <div className="text-center">
                      <div className="font-medium">{team.name}</div>
                      <div className="text-sm">{team.lead} (Lead)</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {team.members.length} membres
                      </div>
                    </div>
                  </Card>
                ))}
                
                {deptTeams.length === 0 && (
                  <div className="flex justify-center items-center h-16 text-muted-foreground text-sm italic">
                    Aucune équipe
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OrgChart;
