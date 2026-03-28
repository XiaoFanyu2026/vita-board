import { useCallback, useEffect, useState, useRef } from 'react';
import { TldrawApp, TDShape, TDBinding, TDAsset, TDUser, TDUserStatus } from '@tldraw/tldraw';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';

export function useMultiplayerState(roomId: string) {
  const [app, setApp] = useState<TldrawApp>();
  const [loading, setLoading] = useState(true);
  const [userCount, setUserCount] = useState(1); // Track number of connected users
  const docRef = useRef<Y.Doc>();
  const providerRef = useRef<WebsocketProvider>();
  const isUpdatingRef = useRef(false);

  useEffect(() => {
    if (!app) return;

    const doc = new Y.Doc();
    // Use the current window's hostname so other devices on the network connect to the correct IP
    const host = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
    const provider = new WebsocketProvider(
      `ws://${host}:1234`,
      roomId,
      doc
    );
    
    docRef.current = doc;
    providerRef.current = provider;

    const yShapes = doc.getMap<TDShape>('shapes');
    const yBindings = doc.getMap<TDBinding>('bindings');
    const yAssets = doc.getMap<TDAsset>('assets');

    provider.on('sync', (isSynced: boolean) => {
      if (isSynced) {
        setLoading(false);
        
        // Initial load from Yjs
        const shapes: Record<string, TDShape> = {};
        const bindings: Record<string, TDBinding> = {};
        const assets: Record<string, TDAsset> = {};

        yShapes.forEach((shape, id) => { shapes[id] = shape; });
        yBindings.forEach((binding, id) => { bindings[id] = binding; });
        yAssets.forEach((asset, id) => { assets[id] = asset; });

        isUpdatingRef.current = true;
        app.replacePageContent(shapes, bindings, assets);
        isUpdatingRef.current = false;
      }
    });

    const handleUpdate = () => {
      if (isUpdatingRef.current) return;
      isUpdatingRef.current = true;

      const shapes: Record<string, TDShape> = {};
      const bindings: Record<string, TDBinding> = {};
      const assets: Record<string, TDAsset> = {};

      yShapes.forEach((shape, id) => { shapes[id] = shape; });
      yBindings.forEach((binding, id) => { bindings[id] = binding; });
      yAssets.forEach((asset, id) => { assets[id] = asset; });

      app.replacePageContent(shapes, bindings, assets);
      isUpdatingRef.current = false;
    };

    yShapes.observeDeep(handleUpdate);
    yBindings.observeDeep(handleUpdate);
    yAssets.observeDeep(handleUpdate);

    // Awareness for cursors
    const awareness = provider.awareness;
    
    // Create a map to track user indices
    const userIndices = new Map<number, number>();
    let nextUserIndex = 1;
    
    // Set a random color for the local user
    const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFA500', '#800080', '#008080'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const localUserId = Math.random().toString(36).slice(2, 9);
    
    // We keep a map of clientId to userId so we can remove them when they disconnect
    const clientIdToUserId = new Map<number, string>();
    
    // Set local awareness state initially
    const initialUser: TDUser = {
      id: localUserId,
      color: randomColor,
      point: [0, 0],
      selectedIds: [],
      activeShapes: [],
      status: TDUserStatus.Connected,
    };

    // We don't assign "用户X" to ourselves immediately until we know our order
    awareness.setLocalState({
      user: initialUser
    });

    // Update the app user config
    app.updateUsers([initialUser]);

    awareness.on('change', () => {
      // Update user count
      setUserCount(awareness.getStates().size);
    });

    awareness.on('update', ({ added, updated, removed }: { added: number[], updated: number[], removed: number[] }) => {
      const states = awareness.getStates() as Map<number, { user?: TDUser }>;
      
      const usersToUpdate: TDUser[] = [];
      
      // Assign indices to new users
      added.forEach((clientId) => {
        if (!userIndices.has(clientId)) {
          // If it's our own clientId, we assign the next index
          userIndices.set(clientId, nextUserIndex++);
        }
      });
      
      // Update our own username if it hasn't been set properly yet
      const ourState = states.get(awareness.clientID);
      if (ourState?.user && userIndices.has(awareness.clientID)) {
        const ourIndex = userIndices.get(awareness.clientID);
        const expectedName = `用户${ourIndex}`;
        
        // If our local state doesn't have the correct name, update it
        // We check if the name needs updating by looking at the custom name field
        // Since TDUser doesn't have a standard name field that tldraw v1 renders easily by default for cursors,
        // we might need to handle this carefully.
        // Actually, tldraw v1 cursor components usually look for 'id' or we can pass custom data.
      }
      
      added.concat(updated).forEach((clientId) => {
        const state = states.get(clientId);
        if (state?.user && clientId !== awareness.clientID) {
          // Assign index if somehow missed
          if (!userIndices.has(clientId)) {
            userIndices.set(clientId, nextUserIndex++);
          }
          
          const userIndex = userIndices.get(clientId);
          
          // Add custom name to the user object. 
          // Note: To make tldraw v1 display names, we might need a custom cursor component,
          // or we can append the name to the ID if the default cursor shows the ID.
          // Let's try passing the name directly, maybe tldraw supports it internally,
          // or we just rely on the ID being displayed.
          const userWithDisplay = {
            ...state.user,
            id: `用户${userIndex}` // Override ID for display purposes if default cursor shows ID
          };
          
          usersToUpdate.push(userWithDisplay);
          clientIdToUserId.set(clientId, userWithDisplay.id);
        }
      });
      
      if (usersToUpdate.length > 0) {
        app.updateUsers(usersToUpdate);
      }
      
      removed.forEach((clientId) => {
        const userId = clientIdToUserId.get(clientId);
        if (userId) {
          app.removeUser(userId);
          clientIdToUserId.delete(clientId);
        }
        // Don't remove from userIndices so if they reconnect they get a new number,
        // or we could remove them if we want to recycle numbers.
      });
    });

    return () => {
      provider.disconnect();
      doc.destroy();
    };
  }, [app, roomId]);

  const onMount = useCallback((app: TldrawApp) => {
    setApp(app);
  }, []);

  const onChangePage = useCallback(
    (
      _app: TldrawApp,
      shapes: Record<string, TDShape | undefined>,
      bindings: Record<string, TDBinding | undefined>,
      assets: Record<string, TDAsset | undefined>
    ) => {
      if (!docRef.current || isUpdatingRef.current) return;
      isUpdatingRef.current = true;

      const yShapes = docRef.current.getMap<TDShape>('shapes');
      const yBindings = docRef.current.getMap<TDBinding>('bindings');
      const yAssets = docRef.current.getMap<TDAsset>('assets');

      docRef.current.transact(() => {
        Object.entries(shapes).forEach(([id, shape]) => {
          if (!shape) yShapes.delete(id);
          else yShapes.set(id, shape);
        });
        Object.entries(bindings).forEach(([id, binding]) => {
          if (!binding) yBindings.delete(id);
          else yBindings.set(id, binding);
        });
        Object.entries(assets).forEach(([id, asset]) => {
          if (!asset) yAssets.delete(id);
          else yAssets.set(id, asset);
        });
      });

      isUpdatingRef.current = false;
    },
    []
  );

  const onChangePresence = useCallback(
    (_app: TldrawApp, user: TDUser) => {
      if (!providerRef.current) return;
      const currentState = providerRef.current.awareness.getLocalState()?.user || {};
      providerRef.current.awareness.setLocalStateField('user', {
        ...currentState,
        ...user,
      });
    },
    []
  );

  return {
    onMount,
    onChangePage,
    onChangePresence,
    loading,
    userCount,
  };
}
