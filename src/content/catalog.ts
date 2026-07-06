import type { ContentPack, ComingSoonEntry } from '../engine/types';
import { twoYearsVacation } from './two-years-vacation/pack';
import { hamlet } from './hamlet/pack';

// アプリの「書架」。ここに並べた作品パックがホーム画面に現れる。
// 新しい名作を足すときは、そのパックをここに import して PACKS に加えるだけ。
// エンジン（Layer 1）は個別作品を知らない。作品の登録はこの合成ルートだけが担う。

export const PACKS: ContentPack[] = [twoYearsVacation, hamlet];

// まだ実装していない、これから作る作品（ホームに「準備中」で並ぶ）
export const COMING_SOON: ComingSoonEntry[] = [];
