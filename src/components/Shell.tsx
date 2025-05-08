
import React, { memo } from "react";
import { Toaster } from "./ui/toaster";
import useDrawerState from "@/hooks/useDrawerState";
import useLogger from "@/hooks/useLogger";

interface ShellProps {
  children?: React.ReactNode;
}

const Shell: React.FC<ShellProps> = () => {
  const logger = useLogger('Shell-Stub');
  const { isDrawerOpen, toggleDrawer, closeDrawer } = useDrawerState();
  
  logger.debug('Rendering shell stub component', { data: { isDrawerOpen } });

  return (
    <div style={{ padding: '2rem', background: '#fcf' }}>
      <h1>Shell Stub</h1>
      <button 
        onClick={toggleDrawer} 
        style={{ 
          padding: '0.5rem 1rem',
          background: '#4a8',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        🎵 Toggle Music Drawer
      </button>
      
      {isDrawerOpen && (
        <div style={{ marginTop: '1rem', padding: '1rem', background: '#eef' }}>
          ✅ Shell Stub OK - Drawer State: {isDrawerOpen ? 'OPEN' : 'CLOSED'}
          <div>
            <button 
              onClick={closeDrawer}
              style={{ 
                marginTop: '0.5rem',
                padding: '0.25rem 0.5rem',
                background: '#e44',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Toast notification system */}
      <Toaster />
    </div>
  );
};

// Export named component and default export for flexibility
export { Shell };
export default memo(Shell);
