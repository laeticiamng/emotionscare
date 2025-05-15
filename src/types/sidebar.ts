
// Types liés à la sidebar
export interface SidebarContextType {
  collapsed: boolean;
  toggleCollapse: () => void;
  setCollapsed: (collapsed: boolean) => void;
  width: number;
  collapsedWidth: number;
  expandedWidth: number;
}
