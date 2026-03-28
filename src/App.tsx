import { Tldraw } from '@tldraw/tldraw';
import { useMultiplayerState } from './useMultiplayerState';

const ROOM_ID = 'tldraw-yjs-demo-room';

export default function App() {
  const { onMount, onChangePage, onChangePresence, loading } = useMultiplayerState(ROOM_ID);

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
      />
    </div>
  );
}
