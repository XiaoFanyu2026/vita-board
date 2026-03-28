import { useCallback, useEffect, useState, useRef } from 'react';
import { TldrawApp, TDShape, TDBinding, TDAsset, TDUser } from '@tldraw/tldraw';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';

export function useMultiplayerState(roomId: string) {
  const [app, setApp] = useState<TldrawApp>();
  const [loading, setLoading] = useState(true);
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
    
    // We keep a map of clientId to userId so we can remove them when they disconnect
    const clientIdToUserId = new Map<number, string>();
    
    awareness.on('update', ({ added, updated, removed }: { added: number[], updated: number[], removed: number[] }) => {
      const states = awareness.getStates() as Map<number, { user?: TDUser }>;
      
      const usersToUpdate: TDUser[] = [];
      
      added.concat(updated).forEach((clientId) => {
        const state = states.get(clientId);
        if (state?.user && clientId !== awareness.clientID) {
          usersToUpdate.push(state.user);
          clientIdToUserId.set(clientId, state.user.id);
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
      providerRef.current.awareness.setLocalStateField('user', user);
    },
    []
  );

  return {
    onMount,
    onChangePage,
    onChangePresence,
    loading,
  };
}
