import { 
  Home, 
  Users, 
  Settings, 
  BarChart3, 
  Shield, 
  Calendar,
  Heart,
  Music,
  MessageSquare,
  HelpCircle,
  Brain,
  Wind,
  Sparkles,
  BookOpen,
  Eye,
  Gamepad2,
  Target,
  Compass,
  Grid3X3
} from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/ui/theme-toggle"

const mainItems = [
  { title: "Accueil", url: "/", icon: Home },
  { title: "Mon Espace", url: "/app/home", icon: BarChart3 },
  { title: "Explorer tout", url: "/navigation", icon: Grid3X3 },
]

const analysisItems = [
  { title: "Scanner Émotionnel", url: "/app/scan", icon: Brain },
  { title: "Hume AI Realtime", url: "/app/hume-realtime", icon: Sparkles },
  { title: "Voice Analysis", url: "/app/voice-analysis", icon: MessageSquare },
]

const wellnessItems = [
  { title: "Flash Glow", url: "/app/flash-glow", icon: Sparkles },
  { title: "Respiration", url: "/app/breath", icon: Wind },
  { title: "Méditation", url: "/app/meditation", icon: Heart },
  { title: "Bubble Beat", url: "/app/bubble-beat", icon: Target },
  { title: "Screen Silk", url: "/app/screen-silk", icon: Heart },
]

const contentItems = [
  { title: "Musicothérapie", url: "/app/music", icon: Music },
  { title: "Music Premium", url: "/app/music-premium", icon: Music },
  { title: "Journal", url: "/app/journal", icon: BookOpen },
  { title: "Voice Journal", url: "/app/voice-journal", icon: MessageSquare },
  { title: "Coach IA", url: "/app/coach", icon: Brain },
]

const immersiveItems = [
  { title: "Espace VR", url: "/app/vr", icon: Eye },
  { title: "VR Galaxy", url: "/app/vr-galaxy", icon: Eye },
  { title: "Parc Émotionnel", url: "/app/emotional-park", icon: Compass },
  { title: "AR Filters", url: "/app/face-ar", icon: Eye },
  { title: "Story Synth Lab", url: "/app/story-synth", icon: BookOpen },
]

const gamificationItems = [
  { title: "Défis", url: "/app/challenges", icon: Target },
  { title: "Défis Quotidiens", url: "/app/daily-challenges", icon: Target },
  { title: "Badges", url: "/app/badges", icon: Gamepad2 },
  { title: "Récompenses", url: "/app/rewards", icon: Gamepad2 },
  { title: "Classements", url: "/app/leaderboard", icon: BarChart3 },
  { title: "Tournois", url: "/app/tournaments", icon: Gamepad2 },
  { title: "Guildes", url: "/app/guilds", icon: Users },
]

const socialItems = [
  { title: "Communauté", url: "/app/community", icon: Users },
  { title: "Messages", url: "/messages", icon: MessageSquare },
  { title: "Buddies", url: "/app/buddies", icon: Users },
  { title: "Social Cocon", url: "/app/social-cocon", icon: Heart },
  { title: "Exchange Hub", url: "/app/exchange", icon: Users },
]

const analyticsItems = [
  { title: "Analytics", url: "/app/analytics", icon: BarChart3 },
  { title: "Weekly Bars", url: "/app/weekly-bars", icon: BarChart3 },
  { title: "Insights", url: "/app/insights", icon: BarChart3 },
  { title: "Trends", url: "/app/trends", icon: BarChart3 },
]

const settingsItems = [
  { title: "Profil", url: "/app/profile", icon: Users },
  { title: "Paramètres", url: "/settings/general", icon: Settings },
  { title: "Confidentialité", url: "/settings/privacy", icon: Shield },
  { title: "Calendrier", url: "/calendar", icon: Calendar },
]

const supportItems = [
  { title: "Aide", url: "/help", icon: HelpCircle },
  { title: "Support", url: "/app/support", icon: MessageSquare },
  { title: "FAQ", url: "/faq", icon: HelpCircle },
]

export function AppSidebar() {
  const location = useLocation()
  const { state } = useSidebar()
  const currentPath = location.pathname

  const isActive = (path: string) => currentPath === path || (path !== '/' && currentPath.startsWith(path))
  const getNavCls = (active: boolean) =>
    active ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted/50"

  const renderMenuGroup = (items: typeof mainItems, label: string) => (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton 
                asChild 
                isActive={isActive(item.url)}
                tooltip={state === "closed" ? item.title : undefined}
              >
                <NavLink to={item.url} className={getNavCls(isActive(item.url))}>
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Heart className="h-4 w-4" />
          </div>
          {state === "open" && (
            <div className="flex flex-col flex-1">
              <span className="text-sm font-semibold">EmotionsCare</span>
              <span className="text-xs text-muted-foreground">Bien-être digital</span>
            </div>
          )}
          <ThemeToggle />
        </div>
      </SidebarHeader>

      <SidebarContent>
        {renderMenuGroup(mainItems, "Navigation")}
        {renderMenuGroup(analysisItems, "Analyse")}
        {renderMenuGroup(wellnessItems, "Bien-être")}
        {renderMenuGroup(contentItems, "Contenu")}
        {renderMenuGroup(immersiveItems, "Immersif")}
        {renderMenuGroup(gamificationItems, "Gamification")}
        {renderMenuGroup(socialItems, "Social")}
        {renderMenuGroup(analyticsItems, "Analytics")}
        {renderMenuGroup(settingsItems, "Configuration")}
        {renderMenuGroup(supportItems, "Support")}
      </SidebarContent>

      <SidebarFooter className="border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              size="lg" 
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  U
                </AvatarFallback>
              </Avatar>
              {state === "open" && (
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Utilisateur</span>
                  <span className="truncate text-xs">user@emotionscare.com</span>
                </div>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
