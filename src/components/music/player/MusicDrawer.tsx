import React from 'react'
import useLogger from '@/hooks/useLogger'

export interface MusicDrawerProps {
  open: boolean
  onClose: () => void
}

const MusicDrawer: React.FC<MusicDrawerProps> = ({ open, onClose }) => {
  const logger = useLogger('MusicDrawer-Stub')

  // Ne rien rendre si fermé
  if (!open) return null

  // Log de montage
  console.log('✅ MusicDrawer stub mounted — open=', open)
  logger.debug('MusicDrawer stub mounted', { open })

  // Simple rectangle gris
  return (
    <div style={{
      position: 'fixed',
      top: 0, right: 0, bottom: 0,
      width: 300,
      background: '#ddd',
      boxShadow: '-2px 0 5px rgba(0,0,0,0.2)',
      padding: 16,
      zIndex: 1000,
    }}>
      <h2>Stub MusicDrawer OK!</h2>
      <button onClick={onClose}>Fermer</button>
    </div>
  )
}

export default MusicDrawer