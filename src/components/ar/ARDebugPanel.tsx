/**
 * AR Debug Panel - Phase 4.5
 * Development debug panel for AR experiences
 */

import React, { useState, useEffect } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { useAR } from '@/contexts/ARContext';
import { cn } from '@/lib/utils';

export interface ARDebugPanelProps {
  className?: string;
}

export function ARDebugPanel({ className }: ARDebugPanelProps) {
  const { showDebugPanel, setShowDebugPanel, fps, memoryUsage, arMode, currentExperience } = useAR();
  const [isExpanded, setIsExpanded] = useState(true);
  const [fpsHistory, setFpsHistory] = useState<number[]>([]);

  // Track FPS history
  useEffect(() => {
    setFpsHistory((prev) => [...prev.slice(-59), fps]);
  }, [fps]);

  if (!showDebugPanel) {
    return (
      <button
        onClick={() => setShowDebugPanel(true)}
        className={cn(
          'fixed bottom-4 right-4 px-3 py-2 bg-gray-900 text-white rounded-lg text-xs font-mono hover:bg-gray-800 z-50',
          className
        )}
      >
        Debug Panel
      </button>
    );
  }

  const avgFps = fpsHistory.length > 0 ? Math.round(fpsHistory.reduce((a, b) => a + b) / fpsHistory.length) : 0;
  const minFps = fpsHistory.length > 0 ? Math.min(...fpsHistory) : 0;
  const maxFps = fpsHistory.length > 0 ? Math.max(...fpsHistory) : 0;

  return (
    <div
      className={cn(
        'fixed bottom-4 right-4 w-80 bg-gray-900 text-white rounded-lg shadow-xl z-50 font-mono text-xs',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-gray-800 rounded-t-lg">
        <h3 className="font-bold">AR Debug Panel</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-gray-700 rounded"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setShowDebugPanel(false)}
            className="p-1 hover:bg-gray-700 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="p-3 space-y-3 border-t border-gray-700">
          {/* Session info */}
          <div>
            <div className="text-gray-400 font-semibold mb-1">Session</div>
            <div className="space-y-0.5 text-gray-300 bg-gray-800 p-2 rounded">
              <div>Mode: <span className="text-indigo-400">{arMode}</span></div>
              <div>
                Experience:{' '}
                <span className="text-indigo-400">{currentExperience || 'none'}</span>
              </div>
            </div>
          </div>

          {/* Performance metrics */}
          <div>
            <div className="text-gray-400 font-semibold mb-1">Performance</div>
            <div className="space-y-0.5 text-gray-300 bg-gray-800 p-2 rounded">
              <div className="flex justify-between">
                <span>FPS (current):</span>
                <span className={fps < 30 ? 'text-red-400' : fps < 50 ? 'text-yellow-400' : 'text-green-400'}>
                  {fps}
                </span>
              </div>
              <div className="flex justify-between">
                <span>FPS (avg):</span>
                <span className={avgFps < 30 ? 'text-red-400' : avgFps < 50 ? 'text-yellow-400' : 'text-green-400'}>
                  {avgFps}
                </span>
              </div>
              <div className="flex justify-between">
                <span>FPS (min/max):</span>
                <span>{minFps}/{maxFps}</span>
              </div>
              <div className="flex justify-between">
                <span>Memory:</span>
                <span className={memoryUsage > 200 ? 'text-red-400' : 'text-green-400'}>
                  {memoryUsage.toFixed(1)} MB
                </span>
              </div>
            </div>
          </div>

          {/* FPS Graph */}
          {fpsHistory.length > 1 && (
            <div>
              <div className="text-gray-400 font-semibold mb-1">FPS Graph</div>
              <div className="bg-gray-800 p-2 rounded h-20 flex items-end gap-0.5">
                {fpsHistory.map((f, i) => (
                  <div
                    key={i}
                    className={cn(
                      'flex-1 rounded-t',
                      f < 30
                        ? 'bg-red-600'
                        : f < 50
                          ? 'bg-yellow-600'
                          : 'bg-green-600'
                    )}
                    style={{ height: `${(f / 60) * 100}%` }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* System info */}
          <div>
            <div className="text-gray-400 font-semibold mb-1">System</div>
            <div className="space-y-0.5 text-gray-300 bg-gray-800 p-2 rounded text-xs">
              <div>
                Device: {navigator.userAgent.includes('iPhone')
                  ? 'iOS'
                  : navigator.userAgent.includes('Android')
                    ? 'Android'
                    : 'Desktop'}
              </div>
              <div>
                Memory: {navigator.deviceMemory || 'unknown'} GB
              </div>
              <div>
                WebXR: {navigator.xr ? '✓' : '✗'}
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="p-2 bg-blue-900 rounded border border-blue-700">
            <div className="text-blue-200 text-xs">
              Debug panel is visible. Close with X button.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
