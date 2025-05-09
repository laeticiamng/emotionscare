
import React, { useState, useEffect } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import MusicDrawer from '@/components/music/player/MusicDrawer'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from './components/ui/button'
import { Clock, Headphones, Menu, Search, User } from 'lucide-react'
import { useIsMobile } from '@/hooks/use-mobile'
import MobileNavigation from '@/components/navigation/MobileNavigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Progress } from '@/components/ui/progress'
import ThemeSwitcher from '@/components/ui/ThemeSwitcher'

const Shell: React.FC = () => {
  // State management
  const [musicOpen, setMusicOpen] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isScrolled, setIsScrolled] = useState(false)
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'evening'>('morning')
  const [historyDrawerOpen, setHistoryDrawerOpen] = useState(false)
  
  // Hooks
  const { isAuthenticated, user } = useAuth()
  const isMobile = useIsMobile()
  const location = useLocation()
  
  // Determine time of day to style the header accordingly
  useEffect(() => {
    const determineTimeOfDay = () => {
      const hour = new Date().getHours()
      if (hour >= 5 && hour < 12) {
        setTimeOfDay('morning')
      } else if (hour >= 12 && hour < 18) {
        setTimeOfDay('afternoon')
      } else {
        setTimeOfDay('evening')
      }
    }
    
    determineTimeOfDay()
    const interval = setInterval(determineTimeOfDay, 60000) // Check every minute
    
    return () => clearInterval(interval)
  }, [])
  
  // Handle scroll events for progress bar and header compression
  useEffect(() => {
    const handleScroll = () => {
      // Calculate scroll progress as percentage
      const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
      const progress = (window.scrollY / totalHeight) * 100
      setScrollProgress(progress)
      
      // Determine if page is scrolled for header compression
      setIsScrolled(window.scrollY > 20)
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  // Toggle music drawer
  const toggleMusicDrawer = () => {
    setMusicOpen(prev => !prev)
  }
  
  // Toggle history drawer
  const toggleHistoryDrawer = () => {
    setHistoryDrawerOpen(prev => !prev)
  }
  
  // Get header background style based on time of day
  const getHeaderBackgroundStyle = () => {
    switch(timeOfDay) {
      case 'morning':
        return 'from-[#FEF9C3]/70 to-white/70'
      case 'afternoon':
        return 'from-[#BFDBFE]/70 to-white/70'
      case 'evening':
        return 'from-[#6366F1]/60 to-[#818CF8]/60'
      default:
        return 'from-background/70 to-background/70'
    }
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Scroll Progress Indicator */}
      <Progress 
        value={scrollProgress} 
        className="fixed top-0 left-0 right-0 z-50 h-0.5 rounded-none bg-transparent" 
      />
      
      {/* Dynamic Header */}
      <header 
        className={`bg-background/60 backdrop-blur-md sticky top-0 z-40 transition-all duration-300 ease-in-out ${
          isScrolled ? 'py-2' : 'py-3 sm:py-4'
        }`}
      >
        <div 
          className={`container mx-auto px-4 flex items-center justify-between relative bg-gradient-to-r ${getHeaderBackgroundStyle()} rounded-xl transition-all duration-500`}
        >
          {/* Mobile Navigation */}
          {isMobile && <MobileNavigation user={user} />}
          
          {/* Brand Logo */}
          <motion.div 
            className="flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
          >
            <h1 className="text-lg sm:text-xl font-serif font-semibold tracking-wider">
              <Link to="/" className="hover:text-primary transition-colors flex items-center">
                <motion.span 
                  initial={{ opacity: 1 }}
                  whileHover={{ 
                    textShadow: "0 0 8px rgba(59, 130, 246, 0.5)",
                  }}
                  className="bg-gradient-to-br from-primary to-primary/70 bg-clip-text text-transparent"
                >
                  EmotionsCare
                </motion.span>
              </Link>
            </h1>
          </motion.div>

          {/* Welcome Message - Only for authenticated users */}
          {isAuthenticated && user && (
            <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 text-sm font-medium">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                Bonjour {user.name} 👋
              </motion.div>
            </div>
          )}

          {/* Right Side Navigation */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Switcher */}
            <div className="hidden sm:block">
              <ThemeSwitcher variant="outline" size="icon" />
            </div>
            
            {/* Recent History Button */}
            <motion.div whileTap={{ scale: 0.95 }}>
              <Button
                onClick={toggleHistoryDrawer}
                variant="outline"
                size="icon"
                className="hidden sm:flex"
                aria-label="Historique récent"
              >
                <Clock className="h-4 w-4" />
              </Button>
            </motion.div>
            
            {/* Music Button with Badge */}
            <motion.div whileTap={{ scale: 0.95 }}>
              <Button
                onClick={toggleMusicDrawer}
                variant={musicOpen ? "secondary" : "outline"}
                size="sm"
                className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 h-8 sm:h-9 transition-all ${
                  musicOpen ? "bg-primary/10" : ""
                }`}
                type="button"
                aria-label="Ouvrir le lecteur musical"
              >
                <Headphones className={`h-4 w-4 ${musicOpen ? "text-primary" : ""}`} />
                <span className="hidden sm:inline">Musique</span>
              </Button>
            </motion.div>

            {/* User Account Button */}
            {isAuthenticated ? (
              <Button 
                variant="default" 
                size="sm" 
                asChild
                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 h-8 sm:h-9 transition-all"
              >
                <Link to="/dashboard" className="flex items-center gap-1 sm:gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Tableau de bord</span>
                </Link>
              </Button>
            ) : (
              <Button 
                variant="default" 
                size="sm" 
                asChild
                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 h-8 sm:h-9 transition-all"
              >
                <Link to="/login" className="flex items-center gap-1 sm:gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Connexion</span>
                </Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Music Drawer */}
      <MusicDrawer
        open={musicOpen}
        onClose={() => setMusicOpen(false)}
      />

      {/* Main Content with Page Transitions */}
      <main className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="h-full"
          >
            <div className="container mx-auto px-4 md:px-8 py-8 max-w-6xl relative">
              {/* Dynamic Background */}
              <div className="absolute inset-0 -z-10 overflow-hidden">
                <motion.div
                  className="absolute inset-0 opacity-5"
                  style={{
                    backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
                  }}
                  animate={{
                    backgroundPosition: ["0px 0px", "60px 60px"],
                  }}
                  transition={{
                    duration: 60,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
              </div>
              
              {/* Page Content */}
              <Outlet />
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Enhanced Footer */}
      <footer className="bg-muted py-4 sm:py-6 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center text-xs sm:text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} EmotionsCare - Tous droits réservés</p>
            <motion.div 
              className="mt-1 sm:mt-2"
              initial={{ opacity: 0.8 }}
              whileHover={{ opacity: 1, scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              <p>Un espace dédié au bien-être émotionnel</p>
            </motion.div>
            
            {/* Footer Links */}
            <div className="mt-4 flex justify-center gap-4 text-xs">
              <Link to="/mentions-legales" className="text-primary/80 hover:text-primary group transition-colors">
                <span className="relative inline-block after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-primary after:origin-bottom-right after:transition-transform after:duration-300 group-hover:after:scale-x-100 group-hover:after:origin-bottom-left">
                  Mentions légales
                </span>
              </Link>
              <span className="text-muted-foreground/50">•</span>
              <Link to="/confidentialite" className="text-primary/80 hover:text-primary group transition-colors">
                <span className="relative inline-block after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-primary after:origin-bottom-right after:transition-transform after:duration-300 group-hover:after:scale-x-100 group-hover:after:origin-bottom-left">
                  Politique de confidentialité
                </span>
              </Link>
              <span className="text-muted-foreground/50">•</span>
              <Link to="/contact" className="text-primary/80 hover:text-primary group transition-colors">
                <span className="relative inline-block after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-primary after:origin-bottom-right after:transition-transform after:duration-300 group-hover:after:scale-x-100 group-hover:after:origin-bottom-left">
                  Contact
                </span>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Footer Background Animation */}
        <div className="absolute bottom-0 left-0 right-0 h-1 overflow-hidden">
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-blue-300 via-primary to-violet-300"
            animate={{ 
              x: ["-100%", "100%"],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </div>
      </footer>
    </div>
  )
}

export default Shell
