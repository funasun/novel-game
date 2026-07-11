import { useEffect } from 'react';
import { useGame, isUiLocked, SaveData } from '../store/gameStore';
import { playerPosition } from '../playerState';

// Layer 1: セーブ/ロード。IndexedDBに保存（完全オフライン）。
// 15秒ごと＋タブ非表示時にオートセーブ。

const DB_NAME = 'novel-game';
const STORE = 'saves';
const SLOT = 'auto';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function idbSet(key: string, value: unknown): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).put(value, key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function idbGet<T>(key: string): Promise<T | undefined> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const req = db.transaction(STORE, 'readonly').objectStore(STORE).get(key);
    req.onsuccess = () => resolve(req.result as T | undefined);
    req.onerror = () => reject(req.error);
  });
}

async function idbDelete(key: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).delete(key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function saveGame(): Promise<void> {
  const s = useGame.getState();
  // イベント/会話の途中で保存すると再開時に物語が欠落するため保存しない
  if (!s.pack || isUiLocked(s)) return;
  const data: SaveData = {
    time: s.time,
    params: s.params,
    inventory: s.inventory,
    flags: s.flags,
    counters: s.counters,
    quests: s.quests,
    journal: s.journal,
    usedInteractables: s.usedInteractables,
    firedEvents: s.firedEvents,
    player: [playerPosition.x, playerPosition.y, playerPosition.z],
    usedAt: s.usedAt,
    visitedLandmarks: s.visitedLandmarks,
  };
  await idbSet(`${s.pack.id}/${SLOT}`, data);
}

export async function loadGame(packId: string): Promise<SaveData | undefined> {
  try {
    return await idbGet<SaveData>(`${packId}/${SLOT}`);
  } catch {
    return undefined;
  }
}

export async function deleteSave(packId: string): Promise<void> {
  await idbDelete(`${packId}/${SLOT}`);
}

export async function resetGame(packId: string): Promise<void> {
  await deleteSave(packId);
  location.reload();
}

export function AutoSave() {
  useEffect(() => {
    const interval = setInterval(() => void saveGame(), 15000);
    const onHide = () => {
      if (document.visibilityState === 'hidden') void saveGame();
    };
    document.addEventListener('visibilitychange', onHide);
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', onHide);
    };
  }, []);
  return null;
}
