import { Tldraw } from '@tldraw/tldraw';
import { useMultiplayerState } from './useMultiplayerState';

export default function App() {
  const ROOM_ID = 'tldraw-yjs-room-1';
  const { onMount, onChangePage, onChangePresence, loading, userCount } = useMultiplayerState(ROOM_ID);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      {/* Header Logo */}
      <div style={{
        position: 'absolute',
        top: '12px',
        left: '16px',
        zIndex: 999,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        pointerEvents: 'none',
      }}>
        <img 
          src="/icon-vita.svg" 
          alt="Vita Board Logo" 
          style={{ width: '32px', height: '32px' }} 
        />
        <span style={{ 
          fontWeight: 600, 
          fontSize: '18px', 
          color: '#333',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          textShadow: '0 1px 2px rgba(255,255,255,0.8)'
        }}>
          Vita Board
        </span>
      </div>

      {/* User Count Badge */}
      {!loading && (
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '16px',
          zIndex: 999,
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          padding: '6px 12px',
          borderRadius: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontSize: '14px',
          fontWeight: 500,
          color: '#374151',
          pointerEvents: 'none'
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#10b981',
            boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.2)'
          }} />
          {userCount} {userCount === 1 ? 'User' : 'Users'} Online
        </div>
      )}

      {loading && (
        <div style={{ 
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
          display: 'flex', alignItems: 'center', justifyContent: 'center', 
          backgroundColor: 'rgba(255,255,255,0.8)', zIndex: 9999 
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <img src="/icon-vita.svg" alt="Vita Board" style={{ width: '48px', height: '48px', animation: 'pulse 2s infinite' }} />
            <span>Loading multiplayer session...</span>
          </div>
        </div>
      )}
      <Tldraw
        autofocus
        disableAssets={false}
        showPages={false}
        onMount={onMount}
        onChangePage={onChangePage}
        onChangePresence={onChangePresence}
        showUI={true}
      />
    </div>
  );
}
