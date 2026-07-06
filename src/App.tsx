import { useEffect, useState } from 'react';
import { World } from './engine/World';
import { Player } from './engine/Player';
import { HUD } from './engine/ui/HUD';
import { DialogueBox } from './engine/ui/DialogueBox';
import { NarrationOverlay } from './engine/ui/NarrationOverlay';
import { LearningToast, Journal } from './engine/learning/LearningLayer';
import { OrientationGate } from './engine/ui/OrientationGate';
import { EventSystem } from './engine/systems/EventSystem';
import { AutoSave, loadGame } from './engine/systems/SaveSystem';
import { useGame } from './engine/store/gameStore';
import { twoYearsVacation } from './content/two-years-vacation/pack';

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    void loadGame(twoYearsVacation.id).then((save) => {
      useGame.getState().init(twoYearsVacation, save);
      setReady(true);
    });
  }, []);

  if (!ready) {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#e8e2d4',
          letterSpacing: 4,
        }}
      >
        読み込み中……
      </div>
    );
  }

  return (
    <OrientationGate>
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        <World>
          <twoYearsVacation.Scene />
          <Player />
        </World>
        <HUD />
        <DialogueBox />
        <NarrationOverlay />
        <LearningToast />
        <Journal />
        <EventSystem />
        <AutoSave />
      </div>
    </OrientationGate>
  );
}
