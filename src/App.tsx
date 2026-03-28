import { Tldraw } from '@tldraw/tldraw';
import { useMultiplayerState } from './useMultiplayerState';

const ROOM_ID = 'tldraw-yjs-demo-room';

export default function App() {
  const { onMount, onChangePage, onChangePresence, loading } = useMultiplayerState(ROOM_ID);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      {loading && (
        <div style={{ 
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
          display: 'flex', alignItems: 'center', justifyContent: 'center', 
          backgroundColor: 'rgba(255,255,255,0.8)', zIndex: 9999 
        }}>
          Loading multiplayer session...
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
