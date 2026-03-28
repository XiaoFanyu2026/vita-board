import React, { useEffect, useState } from 'react';
import { Tldraw, useFileSystem } from '@tldraw/tldraw';
import { useParams, useNavigate } from 'react-router-dom';
import { useMultiplayerState } from '../../hooks/useMultiplayerState';
import { Button } from 'antd';

export default function WhiteboardEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileSystemEvents = useFileSystem();
  
  // Custom hook that binds Yjs with Tldraw
  const { onMount, ...events } = useMultiplayerState(id || 'default');

  return (
    <div style={{ position: 'fixed', inset: 0 }}>
      <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 999 }}>
        <Button onClick={() => navigate('/whiteboards')}>返回列表</Button>
      </div>
      <Tldraw
        autofocus
        disableAssets
        showPages={false}
        onMount={onMount}
        {...fileSystemEvents}
        {...events}
      />
    </div>
  );
}
