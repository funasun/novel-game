import { useState } from 'react';
import { World } from './engine/World';
import { Player } from './engine/Player';
import { HUD } from './engine/ui/HUD';
import { DialogueBox } from './engine/ui/DialogueBox';
import { NarrationOverlay } from './engine/ui/NarrationOverlay';
import { LearningToast, Journal } from './engine/learning/LearningLayer';
import { ControlsTutorial } from './engine/ui/ControlsTutorial';
import { OrientationGate } from './engine/ui/OrientationGate';
import { InstallHint } from './engine/ui/InstallHint';
import { HomeScreen } from './engine/ui/HomeScreen';
import { EventSystem } from './engine/systems/EventSystem';
import { AutoSave, loadGame, saveGame, deleteSave } from './engine/systems/SaveSystem';
import { useGame } from './engine/store/gameStore';
import { requestAppFullscreen, isTouchDevice } from './engine/fullscreen';
import type { ContentPack } from './engine/types';
import { PACKS, COMING_SOON } from './content/catalog';

// 合成ルート兼ルーター。ホーム画面（書架）とゲーム本体を切り替える。
// エンジンは個別作品を知らない——遊ぶ作品は catalog.ts の PACKS から選ぶ。
export default function App() {
  const [pack, setPack] = useState<ContentPack | null>(null);
  const [run, setRun] = useState(0); // ゲーム部分の再マウント鍵（「最初から」で加算）
  const [busy, setBusy] = useState(false);

  // ホーム画面から作品を選んで入る。fresh=true は「はじめから」（セーブ無視）。
  const enter = async (p: ContentPack, fresh: boolean) => {
    // 作品を開く=没入の入口。スマホではブラウザのURLバー等を隠して全画面に。
    // このタップはユーザー操作なので許可される。await より前＝操作直後に呼ぶこと（活性が切れる前）。
    if (isTouchDevice()) void requestAppFullscreen();
    setBusy(true);
    const save = fresh ? undefined : await loadGame(p.id);
    useGame.getState().init(p, save);
    setRun((r) => r + 1);
    setPack(p);
    setBusy(false);
  };

  // ゲーム中から書架（ホーム）へ戻る。戻る前に現在地を保存。
  const goHome = async () => {
    await saveGame();
    setPack(null);
  };

  // 「最初から」：セーブを消し、同じ作品を冒頭の場面から作り直す（画面遷移なし）。
  // run を加算して World/Player/EventSystem を再マウントし、開幕イベントを再生する。
  const restart = async () => {
    if (!pack) return;
    await deleteSave(pack.id);
    useGame.getState().init(pack, undefined);
    setRun((r) => r + 1);
  };

  return (
    <OrientationGate>
      {!pack ? (
        <HomeScreen
          packs={PACKS}
          comingSoon={COMING_SOON}
          onSelect={(p, fresh) => void enter(p, fresh)}
          busy={busy}
        />
      ) : (
        <div
          key={`${pack.id}#${run}`}
          style={{ position: 'relative', width: '100%', height: '100%' }}
        >
          <World>
            <pack.Scene />
            <Player />
          </World>
          {pack.Overlay && <pack.Overlay />}
          <HUD onHome={() => void goHome()} onRestart={() => void restart()} />
          <ControlsTutorial />
          <InstallHint />
          <DialogueBox />
          <NarrationOverlay />
          <LearningToast />
          <Journal />
          <EventSystem />
          <AutoSave />
        </div>
      )}
    </OrientationGate>
  );
}
