// Layout components exports - Version optimisée
import HeaderComponent from './Header';
import FooterComponent from './Footer';
import MainNavigationComponent from '../navigation/MainNavigation';

export { HeaderComponent as Header };
export { FooterComponent as Footer };  
export { MainNavigationComponent as MainNavigation };

// Default exports pour compatibilité
export { default as HeaderDefault } from './Header';
export { default as FooterDefault } from './Footer';
export { default as MainNavigationDefault } from '../navigation/MainNavigation';