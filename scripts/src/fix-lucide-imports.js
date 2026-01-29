#!/usr/bin/env node

/**
 * Script pour vérifier et corriger les imports manquants de lucide-react
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Liste complète des icônes lucide-react disponibles
const availableIcons = [
  'Activity', 'Airplay', 'AlertCircle', 'AlertOctagon', 'AlertTriangle', 'AlignCenter',
  'AlignJustify', 'AlignLeft', 'AlignRight', 'Anchor', 'Aperture', 'Archive', 'ArrowDown',
  'ArrowDownCircle', 'ArrowDownLeft', 'ArrowDownRight', 'ArrowLeft', 'ArrowLeftCircle',
  'ArrowRight', 'ArrowRightCircle', 'ArrowUp', 'ArrowUpCircle', 'ArrowUpLeft', 'ArrowUpRight',
  'AtSign', 'Award', 'BarChart', 'BarChart2', 'BarChart3', 'Battery', 'BatteryCharging',
  'Bell', 'BellOff', 'Bluetooth', 'Bold', 'Book', 'BookOpen', 'Bookmark', 'Box', 'Briefcase',
  'Building', 'Building2', 'Calendar', 'Camera', 'CameraOff', 'Car', 'Cast', 'Check',
  'CheckCircle', 'CheckCircle2', 'CheckSquare', 'CheckSquare2', 'ChevronDown', 'ChevronLeft',
  'ChevronRight', 'ChevronUp', 'ChevronsDown', 'ChevronsLeft', 'ChevronsRight', 'ChevronsUp',
  'Chrome', 'Circle', 'Clipboard', 'Clock', 'Cloud', 'CloudDrizzle', 'CloudLightning',
  'CloudRain', 'CloudSnow', 'Code', 'Coffee', 'Cog', 'Compass', 'Copy', 'CornerDownLeft',
  'CornerDownRight', 'CornerLeftDown', 'CornerLeftUp', 'CornerRightDown', 'CornerRightUp',
  'CornerUpLeft', 'CornerUpRight', 'Cpu', 'CreditCard', 'Crop', 'Crosshair', 'Crown',
  'Database', 'Delete', 'Disc', 'DollarSign', 'Download', 'DownloadCloud', 'Droplets',
  'Edit', 'Edit2', 'Edit3', 'ExternalLink', 'Eye', 'EyeOff', 'Facebook', 'FastForward',
  'Feather', 'File', 'FileCheck', 'FileMinus', 'FilePlus', 'FileText', 'FileX', 'Film',
  'Filter', 'Flag', 'Flame', 'Flashlight', 'FlipHorizontal', 'FlipVertical', 'Folder',
  'FolderMinus', 'FolderPlus', 'Framer', 'Frown', 'Gift', 'GitBranch', 'GitCommit',
  'GitMerge', 'GitPullRequest', 'GitHub', 'GitLab', 'Globe', 'Grid', 'HardDrive', 'Hash',
  'Headphones', 'Heart', 'HelpCircle', 'Hexagon', 'Home', 'Image', 'Inbox', 'Info',
  'Instagram', 'Italic', 'Key', 'Keyboard', 'Layers', 'Layout', 'LifeBuoy', 'Link',
  'Link2', 'LinkedIn', 'List', 'Loader', 'Loader2', 'Lock', 'LogIn', 'LogOut', 'Mail',
  'Map', 'MapPin', 'Maximize', 'Maximize2', 'Meh', 'Menu', 'MessageCircle', 'MessageSquare',
  'Mic', 'MicOff', 'Minimize', 'Minimize2', 'Minus', 'MinusCircle', 'MinusSquare', 'Monitor',
  'Moon', 'MoreHorizontal', 'MoreVertical', 'MousePointer', 'Move', 'Music', 'Navigation',
  'Navigation2', 'Octagon', 'Package', 'Package2', 'PaintBucket', 'Palette', 'Paperclip',
  'Pause', 'PauseCircle', 'PenTool', 'Percent', 'Phone', 'PhoneCall', 'PhoneForwarded',
  'PhoneIncoming', 'PhoneMissed', 'PhoneOff', 'PhoneOutgoing', 'PieChart', 'Play',
  'PlayCircle', 'Plus', 'PlusCircle', 'PlusSquare', 'Pocket', 'Power', 'Printer',
  'Radio', 'Rainbow', 'RefreshCcw', 'RefreshCw', 'Repeat', 'Repeat1', 'RotateCcw',
  'RotateCw', 'Rss', 'Save', 'Scissors', 'Search', 'Send', 'Server', 'Settings',
  'Share', 'Share2', 'Shield', 'ShieldAlert', 'ShieldCheck', 'ShieldOff', 'ShoppingBag',
  'ShoppingCart', 'Shuffle', 'Sidebar', 'SkipBack', 'SkipForward', 'Slack', 'Slash',
  'Sliders', 'Smartphone', 'Smile', 'Speaker', 'Square', 'Star', 'Stars', 'Sun',
  'Sunrise', 'Sunset', 'Tablet', 'Tag', 'Target', 'Terminal', 'Thermometer', 'ThumbsDown',
  'ThumbsUp', 'ToggleLeft', 'ToggleRight', 'Tool', 'Trash', 'Trash2', 'TrendingDown',
  'TrendingUp', 'Triangle', 'Trophy', 'Truck', 'Tv', 'Twitch', 'Twitter', 'Type',
  'Umbrella', 'Underline', 'Undo', 'Undo2', 'Unlock', 'Upload', 'UploadCloud', 'User',
  'UserCheck', 'UserMinus', 'UserPlus', 'UserX', 'Users', 'Video', 'VideoOff', 'Volume',
  'Volume1', 'Volume2', 'VolumeX', 'Watch', 'Waves', 'Wifi', 'WifiOff', 'Wind',
  'X', 'XCircle', 'XSquare', 'Youtube', 'Zap', 'ZapOff', 'ZoomIn', 'ZoomOut',
  // Nouvelles icônes souvent utilisées
  'Brain', 'Sparkles', 'Timer', 'Contrast', 'Gamepad2', 'Headset', 'Layers3',
  'MonitorSpeaker', 'MousePointer2', 'PlaySquare', 'Building', 'Laptop', 'Gauge'
];

// Patterns pour identifier les icônes utilisées
const iconUsagePatterns = [
  /<(\w+)\s+className="[^"]*"/g,        // <IconName className="...
  /<(\w+)\s*\/>/g,                      // <IconName />
  /icon:\s*(\w+)/g,                     // icon: IconName
  /Icon:\s*(\w+)/g,                     // Icon: IconName
  /{\s*(\w+)\s*}/g,                     // { IconName }
];

function findUsedIcons(content) {
  const usedIcons = new Set();
  
  iconUsagePatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const iconName = match[1];
      if (availableIcons.includes(iconName)) {
        usedIcons.add(iconName);
      }
    }
  });
  
  return Array.from(usedIcons);
}

function getImportedIcons(content) {
  const importMatch = content.match(/import\s*{\s*([^}]+)\s*}\s*from\s*['"]lucide-react['"]/);
  if (!importMatch) return [];
  
  return importMatch[1]
    .split(',')
    .map(icon => icon.trim())
    .filter(icon => icon.length > 0);
}

function updateImports(content, usedIcons) {
  const importedIcons = getImportedIcons(content);
  const allNeededIcons = [...new Set([...importedIcons, ...usedIcons])].sort();
  
  if (allNeededIcons.length === 0) return content;
  
  const newImportStatement = `import { 
  ${allNeededIcons.join(', ')}
} from 'lucide-react';`;
  
  // Remplacer l'import existant ou l'ajouter
  if (content.includes("from 'lucide-react'")) {
    return content.replace(
      /import\s*{\s*[^}]*\s*}\s*from\s*['"]lucide-react['"];?/g,
      newImportStatement
    );
  }
  
  return content;
}

function checkAndFixFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Vérifier si le fichier utilise lucide-react
    if (!content.includes("from 'lucide-react'") && !content.includes('lucide-react')) {
      return { checked: true, fixed: false, errors: [] };
    }
    
    const usedIcons = findUsedIcons(content);
    const importedIcons = getImportedIcons(content);
    const missingIcons = usedIcons.filter(icon => !importedIcons.includes(icon));
    
    if (missingIcons.length > 0) {
      const updatedContent = updateImports(content, usedIcons);
      fs.writeFileSync(filePath, updatedContent, 'utf8');
      return { 
        checked: true, 
        fixed: true, 
        errors: [], 
        missingIcons,
        addedIcons: missingIcons
      };
    }
    
    return { checked: true, fixed: false, errors: [] };
  } catch (error) {
    return { 
      checked: true, 
      fixed: false, 
      errors: [error.message] 
    };
  }
}

function scanDirectory(dirPath, results = { fixed: 0, errors: 0, files: [] }) {
  const items = fs.readdirSync(dirPath);
  
  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
      scanDirectory(fullPath, results);
    } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
      const result = checkAndFixFile(fullPath);
      
      if (result.fixed) {
        results.fixed++;
        console.log(`✅ Corrigé: ${fullPath}`);
        if (result.addedIcons) {
          console.log(`   Ajouté: ${result.addedIcons.join(', ')}`);
        }
      }
      
      if (result.errors.length > 0) {
        results.errors++;
        console.log(`❌ Erreur dans ${fullPath}:`, result.errors);
      }
      
      results.files.push({
        path: fullPath,
        ...result
      });
    }
  }
  
  return results;
}

// Exécution du script
const srcPath = path.join(__dirname, '..', 'src');
console.log('🔍 Vérification des imports lucide-react...\n');

const results = scanDirectory(srcPath);

console.log('\n📊 Résumé:');
console.log(`- Fichiers corrigés: ${results.fixed}`);
console.log(`- Fichiers avec erreurs: ${results.errors}`);
console.log(`- Total fichiers vérifiés: ${results.files.length}`);

if (results.fixed > 0) {
  console.log('\n✨ Tous les imports manquants ont été corrigés !');
} else {
  console.log('\n✅ Aucun import manquant détecté.');
}