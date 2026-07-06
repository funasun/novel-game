import type { ContentPack, ComingSoonEntry } from '../engine/types';
import { twoYearsVacation } from './two-years-vacation/pack';

// アプリの「書架」。ここに並べた作品パックがホーム画面に現れる。
// 新しい名作を足すときは、そのパックをここに import して PACKS に加えるだけ。
// エンジン（Layer 1）は個別作品を知らない。作品の登録はこの合成ルートだけが担う。

export const PACKS: ContentPack[] = [twoYearsVacation];

// まだ実装していない、これから作る作品（ホームに「準備中」で並ぶ）
export const COMING_SOON: ComingSoonEntry[] = [
  {
    id: 'hamlet',
    title: 'ハムレット',
    author: 'W・シェイクスピア',
    blurb: 'エルシノア城の夜、亡き父王の亡霊が現れる。疑い、狂気、そして復讐——ハムレットの「心の生活」を生きる。',
    accent: '#7a5a9b',
  },
];
