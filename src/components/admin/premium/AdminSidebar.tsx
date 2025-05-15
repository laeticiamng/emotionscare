
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, Users, BarChart3, CalendarClock, 
  Settings, ChevronRight, ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AdminSidebarProps {
  currentPath?: string;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ currentPath = '/admin' }) => {
  const [openMenus, setOpenMenus] = React.useState<Record<string, boolean>>({
    reporting: false,
    teams: false
  });

  const toggleMenu = (menu: string) => {
    setOpenMenus(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };

  const isActive = (path: string) => currentPath === path;

  const navigationItems = [
    {
      name: "Dashboard",
      path: "/b2b/admin/dashboard",
      icon: <LayoutDashboard className="h-4 w-4 mr-2" />
    },
    {
      name: "Teams",
      path: "/b2b/admin/teams",
      icon: <Users className="h-4 w-4 mr-2" />,
      submenu: true,
      key: "teams"
    },
    {
      name: "Reports",
      path: "/b2b/admin/reports",
      icon: <BarChart3 className="h-4 w-4 mr-2" />,
      submenu: true,
      key: "reporting"
    },
    {
      name: "Events",
      path: "/b2b/admin/events",
      icon: <CalendarClock className="h-4 w-4 mr-2" />
    },
    {
      name: "Settings",
      path: "/b2b/admin/settings",
      icon: <Settings className="h-4 w-4 mr-2" />
    }
  ];

  const reportingSubItems = [
    { name: "Emotional Trends", path: "/b2b/admin/reports/emotional-trends" },
    { name: "Engagement", path: "/b2b/admin/reports/engagement" },
    { name: "Utilization", path: "/b2b/admin/reports/utilization" }
  ];

  const teamsSubItems = [
    { name: "Team Overview", path: "/b2b/admin/teams/overview" },
    { name: "Members", path: "/b2b/admin/teams/members" },
    { name: "Departments", path: "/b2b/admin/teams/departments" }
  ];

  return (
    <div className="w-64 h-full bg-background dark:bg-gray-900 border-r dark:border-gray-800 flex flex-col">
      <div className="p-4 border-b dark:border-gray-800">
        <h2 className="text-lg font-semibold text-primary">Admin Dashboard</h2>
        <p className="text-sm text-muted-foreground">Manage your organization</p>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {navigationItems.map((item) => (
            <li key={item.path}>
              {item.submenu ? (
                <>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-between",
                      isActive(item.path) && "bg-accent"
                    )}
                    onClick={() => toggleMenu(item.key!)}
                  >
                    <span className="flex items-center">
                      {item.icon}
                      {item.name}
                    </span>
                    {openMenus[item.key!] ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                  
                  {openMenus[item.key!] && (
                    <ul className="pl-6 mt-1 space-y-1">
                      {item.key === "reporting" && reportingSubItems.map((subItem) => (
                        <li key={subItem.path}>
                          <Link to={subItem.path}>
                            <Button 
                              variant="ghost" 
                              className={cn(
                                "w-full justify-start text-sm",
                                isActive(subItem.path) && "bg-accent"
                              )}
                            >
                              {subItem.name}
                            </Button>
                          </Link>
                        </li>
                      ))}
                      
                      {item.key === "teams" && teamsSubItems.map((subItem) => (
                        <li key={subItem.path}>
                          <Link to={subItem.path}>
                            <Button 
                              variant="ghost" 
                              className={cn(
                                "w-full justify-start text-sm",
                                isActive(subItem.path) && "bg-accent"
                              )}
                            >
                              {subItem.name}
                            </Button>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <Link to={item.path}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start",
                      isActive(item.path) && "bg-accent"
                    )}
                  >
                    {item.icon}
                    {item.name}
                  </Button>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t dark:border-gray-800">
        <p className="text-xs text-muted-foreground text-center">
          EmotionsCare Admin v1.0
        </p>
      </div>
    </div>
  );
};

export default AdminSidebar;
