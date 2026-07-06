# 作品制作プレイブック — 名作を1本、生活ゲームに仕立てる

### 第一作『十五少年漂流記』でやったこと・留意したことを、次の作品にそのまま使える手順にまとめたもの

---

## 0. この文書の使いかた

`ARCHITECTURE.md` が「なぜこの作りなのか（設計思想・北極星）」なら、こちらは
**「実際に手を動かして1本作るときの実務レシピ」**。第一作（十五少年漂流記）と第二作
（ハムレット）を実装して分かった型・落とし穴・チェックリストを、コードの現実に合わせて書く。

> 大原則：**エンジン（Layer 1）は一切触らない。作品はデータ（Layer 3）を1フォルダ足すだけ。**
> この境界を守るかぎり、型は次の作品にも効きつづける。ハムレットは engine を1行も変えずに載った。

第一作から第二作の間で engine 側に足した「仕組み」は次の3つだけ。いずれも**汎用機構**で、
作品固有の値はすべてデータから注入する（作品を知らないまま誘導・チュートリアル・持ちもの表示ができる）：

- **誘導（Waypoint / guidance）** — クエストに `waypoint:[x,z]` を書くと、光の柱＋HUDの方位矢印が出る。
- **チュートリアル（ControlsTutorial）** — 初回だけ操作説明カード。localStorage で一度きり。
- **手帳の拡張** — 「いまの目標」「持ちもの」を J キーの手帳に常設（腰を据えて確認できる場所）。

---

## 1. 3層の鉄則（境界の実例）

```
Layer 3  content/<作品>/   ← 足すのはここだけ。物語・会話・クエスト・学び・舞台
Layer 2  modules/          ← ジャンル機構（任意）。今は content 内に閉じている
Layer 1  engine/           ← 全作品共通。ほぼ不変。作品を import してはいけない
```

境界を破っていないかの判定は簡単：

- `engine/` の中で `content/` を import していたら**アウト**。エンジンは作品を知らない。
- 作品登録は合成ルート `src/content/catalog.ts` の `PACKS` 配列**だけ**が担う。
- エンジンに作品固有の値（座標・地名・キャラ名・数値）が出てきたら、それは**データに逃がす**。

地形の受け渡しがこの流儀の見本：エンジンは地形を知らない。作品側の Scene が
`engine/ground.ts` の `setGround({ heightAt, isWalkable })` を呼んで標高と歩行可否を「注入」する。
すべての仕組みをこの向き（engine が口を用意し、content が中身を差す）で作る。

---

## 2. 新作を1本立てる手順（最短経路）

```
src/content/<作品id>/
  layout.ts          # 座標の辞書（スポーン・拠点・採集点・地名）。pack を読みやすく保つ
  pack.tsx           # ContentPack 本体（物語のすべて）
  scene/
    <作品>Scene.tsx  # プロシージャル舞台。setGround/addObstacle を呼ぶ
    StageProps.tsx   # 小物・NPC・建物（任意で分割）
    <作品>Overlay.tsx# シネマティック等の情景オーバーレイ（任意）
```

1. **フォルダを作る** `src/content/<作品id>/`。
2. **layout.ts** に座標を名前で置く（後述 §8）。まず舞台の地図を決める。
3. **scene/** に舞台を作る（§7）。`setGround` を必ず呼ぶ。歩ける床がないとプレイヤーが落ちる。
4. **pack.tsx** に `ContentPack` を書く（§3〜§6）。物語・会話・クエスト・学び・インタラクトはすべてここ。
5. **catalog.ts** に import して `PACKS` に足す。これで書架（ホーム画面）に並ぶ。

```ts
// src/content/catalog.ts — 登録はこの2行を足すだけ
import { myWork } from './my-work/pack';
export const PACKS: ContentPack[] = [twoYearsVacation, hamlet, myWork];
```

まだ作っていない作品は `COMING_SOON` に置くと「準備中」の枠でホームに出せる。

---

## 3. pack.tsx の解剖 — `ContentPack` の全フィールド

型は `src/engine/types.ts`。エンジンが理解する語彙はこれがすべて。

| フィールド | 役割・留意点 |
|---|---|
| `id` / `title` | 一意なID（フォルダ名と揃える）とタイトル。IndexedDB のセーブキーにも使われる |
| `author` / `blurb` / `accent` | ホーム画面カードの原作者・惹句・アクセント色（hex） |
| `Overlay?` | 作品専用の情景オーバーレイ（§7 の cinematic）。無くてよい |
| `parameters` | 数値ステータス定義。`display:false` でHUD非表示（内部変数として使える） |
| `items` | 所持品の `{ label }` 辞書。手帳の「持ちもの」に出る |
| `characters` | `{ name, note? }`。`note` があれば手帳の「なかま」に載る |
| `dialogues` | 会話ノード辞書（§4） |
| `quests` | 目標辞書。`goal` と `waypoint`（§5・§6） |
| `events` | 物語ビートの配列。トリガーで発火（§6 が背骨） |
| `learnings` | 「学び」（答え合わせ）辞書 |
| `interactables` | 世界に置く調べもの・採集物の配列（§5） |
| `startTime` | `{ day, hour }` 開始時刻。TimeSystem の起点 |
| `spawn` | `[x,z]` プレイヤー初期位置 |
| `Scene` | 3D舞台コンポーネント（§7） |

### parameters — 因果の重み

体験に重みを与える数値。行動と選択がここを増減させ、世界に手触りが出る。

```ts
parameters: {
  stamina: { label: '体力', min: 0, max: 100, initial: 100 },
  hunger:  { label: '満腹度', min: 0, max: 100, initial: 60 },
  morale:  { label: '士気', min: 0, max: 100, initial: 50 },
  supplies:{ label: '物資', min: 0, max: 100, initial: 20, display: false }, // 内部用
},
```

ハムレットは体力/満腹の代わりに `resolve(決意)` `suspicion(嫌疑)` `melancholy(憂い)` を使った。
**パラメータの選択が作品の主題を決める。** サバイバル作品なら体力・空腹、心理劇なら情念の数値。

---

## 4. dialogues — 会話ノード

```ts
dlg_intro: {
  id: 'dlg_intro',
  speaker: 'briant',            // characters のキー
  lines: ['……ここは、どこだ。', '海の色が、昨日までと違う。'],
  choices: [                    // 選択肢（無ければ一本道）
    { text: '仲間を起こす', effects: { flags: ['party_woke'], next: 'dlg_wake' } },
    { text: '海を見つめる', effects: { params: { morale: -3 }, next: 'dlg_alone' } },
  ],
  // choices が無いノードは effects を末尾で適用（next で連鎖）
},
```

**留意点（落とし穴）:**

- **会話の連鎖は `effects.next` で繋ぐ。** ノードを跨ぐ物語は `next` を辿らせる。
  最後のノードは `next` を持たない＝そこで会話が閉じる。**途中ノードで `next` を書き忘れると会話が途切れる**ので、
  チェーンの末尾以外は必ず `next` があるか確認する。
- **選択肢の `effects` でフラグを立てる**と、それが次のクエスト／イベントの引き金になる（§6）。
  会話＝物語を分岐・前進させる主エンジン。
- `speaker` は `characters` のキー。DialogueBox が名前を引く。
- `effects` に `dialogue:'...'` を書くと別会話を開始できる（インタラクトやイベントから会話を呼ぶ）。

---

## 5. interactables & quests — 「世界に触れる」と「目標」

### interactables — 調べもの・採集物

```ts
{
  id: 'shellfish_0',
  position: [x, z],            // XZのみ。Yは Scene 側が接地して描画する
  prompt: '貝を採って食べる',   // E キーで出る操作プロンプト
  radius: 2.4,                 // 反応距離（既定2.4）
  effects: { params: { hunger: 18 }, counters: { shellfish_eaten: 1 }, minutes: 15 },
  once: true,                  // 一度きり（採ったら消える）
  requiresFlag: 'fire_lit',    // このフラグが立つまで存在しない
  hideFlag: 'cave_moved',      // このフラグが立ったら消える（拠点移動で浜の採集点を畳む等）
},
```

`requiresFlag` / `hideFlag` は**世界を物語で変える鍵**。第一幕の浜の採集点を、拠点を移したら
`hideFlag` で消し、洞窟周りの採集点を `requiresFlag` で出す——同じ機構で「暮らしの場が移った」を表現できる。

生成は `layout.ts` の散布点を `.map()` で量産すると綺麗（§8 の `DRIFTWOOD_POINTS` 等）。

### quests — 目標と誘導

```ts
q_food: {
  id: 'q_food',
  title: '空腹をしのぐ',
  description: '波打ち際で貝を採ろう。',
  waypoint: [6, 87],                                  // §6 誘導の的（光の柱＋HUD矢印）
  goal: { type: 'counter', counter: 'shellfish_eaten', count: 2 },
},
```

`goal` は3種：

- `{ type: 'item', item, count }` — 所持数が達したら完了
- `{ type: 'counter', counter, count }` — カウンタが達したら完了
- `{ type: 'flag', flag }` — フラグが立ったら完了（会話やイベントで明示完了させたい時）

`goal` を書かない場合は**イベント側で明示完了**させる（ドラマ進行で終わるクエスト）。

---

## 6. 物語の背骨 — フラグとクエストの連鎖（最重要）

「日々を生きていたら物語が起きる」感覚は、**イベントのトリガー連鎖**で作る。
これが作品制作でいちばん頭を使うところ。第一作の背骨はこう繋がっている：

```
gameStart ─▶ ev_opening（漂着のナレーション＋会話。ashore フラグを立てる）
                │  同時に最初のクエスト q_wood（waypoint 付き）が提示される
                ▼
プレイヤーが薪を3つ拾う ─▶ goal 達成で q_wood 完了
                ▼
questComplete:q_wood ─▶ ev_fire（焚き火の会話）
   … 会話の選択で次のフラグ／クエストが動く …
                ▼
time:day1/hour19 ─▶ ev_night（夜の会話 → sleepUntilMorning → 第2日）
                ▼
questComplete:q_lookout ─▶ ev_island（「島だ」の気づき）→ 学びトースト
                ▼   （以降、flag トリガーで対立→脅威→協力→決着まで数珠つなぎ）
```

### トリガーは4種

```ts
{ type: 'gameStart' }                          // 開幕（1回）
{ type: 'questComplete', quest: 'q_wood' }     // クエスト完了時
{ type: 'time', day: 1, hour: 19 }             // 指定日時に到達
{ type: 'flag', flag: 'reached_north' }        // フラグが立った時
```

### ステップは5種

```ts
{ type: 'narration', lines: [...] }   // 全画面ナレーション（advanceで進む）
{ type: 'dialogue', id: 'dlg_...' }   // 会話を差し込む
{ type: 'effects', effects: {...} }   // フラグ/パラメータ/クエスト付与などを実行
{ type: 'sleepUntilMorning' }         // 就寝して翌朝へ
{ type: 'skipDays', days: 300 }       // 日数ジャンプ（代謝なしの時間経過。季節や年をまたぐ）
```

**設計の勘所:**

- **クエスト完了 → イベント → 会話の選択でフラグ → そのフラグが次のイベントを起こす**、の数珠つなぎで全篇を編む。
  一本の線を、プレイヤーの手触り（採集・移動・会話）で区切って渡していく。
- **ペース配分**：生活ループ（採る・作る・話す）の反復に、イベントを"差し込む"。
  イベントを連続させない。日々の手触りが no.1、物語ビートは味付け。
- **`effects` で立てたフラグが、`interactables` の `requiresFlag/hideFlag` とも連動**して世界が変わる（§5）。
- 迷子対策として、**進行中クエストには必ず `waypoint` を付ける**（§後述の誘導）。次に行く場所が光る。

### 誘導（この型の要）

プレイヤーが「次に何をすればいいか」を見失わない仕掛けは engine 側の汎用機構で、
作品は**クエストに `waypoint:[x,z]` を書くだけ**：

- **世界内**：目標地点に金色の光の柱（Waypoint ビーコン）。「光の方へ行け」。
- **HUD**：カメラ相対の方位矢印＋「目標地点まで 約Nm」。カーナビ式。近づくと「このあたりだ」。
- **手帳（J）**：いまの目標（◇）と、たどってきた道（✓）、持ちもの、学びを腰を据えて確認できる。
- **初回チュートリアル**：操作説明カードが最初の一度だけ出る（localStorage `ng_tutorial_v1`）。

`waypoint` は「進行中の（active な）クエスト」のものだけが表示される。だから**クエストの提示順＝誘導の順**。
座標は `layout.ts` の名前付き座標をそのまま渡すと保守しやすい（例：`waypoint: LOOKOUT`）。

---

## 7. プロシージャル舞台の作り方（scene/）

**3Dは全部コード生成の低ポリ**（ライセンス完全クリーン・様式の一貫・PWA向きに軽い）。
外部の3Dモデルや実画像は使わない。

### 舞台コンポーネントの骨格

```tsx
export function IslandScene() {
  // ① 歩ける床を engine に注入（これが無いとプレイヤーが落下する）
  useEffect(() => {
    setGround({
      heightAt: islandHeight,                                   // 標高関数
      isWalkable: (x, z) => islandHeight(x, z) > -0.45 && ...,  // 歩行可否
    });
  }, []);

  return (
    <group>
      <Terrain /><Ocean /><Vegetation /><StageProps />
    </group>
  );
}
```

### 押さえるパターン

- **接地はデータで共有**：`setGround` の `heightAt` を、地形メッシュ・プレイヤー接地・小物の設置が全部使う。
  小物は `y = islandHeight(x, z)` で地面に置く（`interactables` の Y はここで決まる）。
- **当たり判定は `addObstacle({ x, z, r })`**。戻り値は undo 関数なので `useEffect` の cleanup で外す。
  木の幹・岩・建物に張る（葉や草は対象外——通れる）。
- **散布は決定論的**：`scatterOnIsland(count, seed, (h, slope) => 条件)` で位置を生成し、
  `InstancedMesh` + `applyInstances` で一括描画。**同じ seed なら毎回同じ配置**（再現性・セーブ整合）。
- **shared-assets/procedural/** の `noise / terrain / vegetation` は全作品共通の生成基盤。
  新しい地形（城・街・草原）もここの関数を組み替えて作る。

### Overlay（シネマティック）— フラグ駆動の情景

冒頭の「嵐の船」のような特別な場面は、島の World の上に**別Canvasを重ねて**表現する。
フラグを見てフェード制御する（`ashore` が立つと嵐シーンが消えて浜が現れる＝漂着の演出）：

```tsx
const ashore = useGame((s) => !!s.flags.ashore);
// ashore が立ったら opacity 0 → 1.5s 後にアンマウント
```

`Overlay` は `ContentPack.Overlay` に置くと App が World の上に載せてくれる。engine は中身を知らない。

---

## 8. layout.ts — 座標を名前で持つ

`pack.tsx` に生の数字を散らすと保守できない。**場所に名前を付けて layout.ts に集約**する。

```ts
export const SPAWN:   [number, number] = [0, 82];
export const LOOKOUT: [number, number] = [2, 6];   // オークランドの丘
export const CAVE:    [number, number] = [-36, 12]; // フレンチ・デン
export const NPC_POS: Record<string, [number, number]> = { briant: CAMP, ... };

// 散布点は生成してエクスポート（interactables が .map で量産する）
export const DRIFTWOOD_POINTS = nearPoint(
  scatterOnIsland(240, 4242, (h) => h > 0.25 && h < 1.0), SPAWN, 6);
```

こうすると `pack.tsx` 側は `waypoint: LOOKOUT` や `position: SHIP` と**意味で書ける**。
座標を1か所直せば舞台・誘導・NPC が揃って動く。

---

## 9. 翻案テキストの留意点（著作権）

- **原作はPD**：プロット・キャラクター・世界設定は自由に使える。
- **文章は自作の翻案**。現代の邦訳の文章を**コピーしない**。原作の出来事を、自分の言葉で書き直す。
- **絵・3Dはプロシージャル自作**。特定の挿絵・映画版のデザインは流用しない。
- 文体は作品に合わせる。十五少年漂流記は少年たちの生き生きした口語＋簡潔な地の文。
  ハムレットは韻文の格調を落とさず、現代日本語で読める密度に。
- 学び（learnings）は**講義しない**。体験の直後にさりげなく史実・背景を1枚差す（手帳に静かに溜まる）。

---

## 10. 検証 — DEV フックと preview の癖

開発ビルドだけ、`window` にデバッグフックが生える（本番は `import.meta.env.DEV` で除去）：

| フック | 中身 | 使いどころ |
|---|---|---|
| `window.__game` | Zustand ストア | `.getState()` でフラグ・パラメータ・クエスト・所持品を確認 |
| `window.__player` | プレイヤー位置 | スポーン・移動の確認 |
| `window.__obstacles` | 当たり判定リスト | 通れない場所の検証 |
| `window.__guidance` | 誘導状態 | `active / distance / relAngle` が正しいか |
| `window.__three` | r3f state | scene / camera / gl に触る |

**誘導の数値は算数で検算できる**：スポーン `[0,82]` → `waypoint:[-4,86]` の距離は
`√(4²+4²)=5.657`。`__guidance.distance` がこれと一致すれば方位計算は正しい。

**preview（自動検証）の癖：**

- **rAF が絞られる**：`useFrame` はスクリーンショットの描画時にしか回らない。
  入室直後は `__player` が原点・`__guidance.active=false` に見える。**スクショを1枚撮って描画を促す**と正しい値になる。
- **`window.confirm` が preview を固める**：確認ダイアログで止まる。検証時は `window.confirm = () => true` を注入。
- **セーブは IndexedDB** `novel-game` / `saves`、キーは `${packId}/auto`。
  テストで汚れたら消してからクリーンな「はじめから」を確認する。

確認する画面要素（第一作＝第二作共通で効くことを実証済み）：チュートリアルカード「あそびかた」／
HUDの「目標地点まで 約Nm」＋回転する▲矢印／手帳の「いまの目標・持ちもの・学んだこと・なかま」／
世界内の光の柱ビーコン。

---

## 11. ビルドとデプロイ

```bash
# 型チェック（CI相当。まずこれが通ること）
npx tsc -b            # → エラーなし

# ローカル本番ビルド
npm run build         # tsc -b && vite build → dist/

# GitHub Pages 用ビルド（base を /novel-game/ に切替）
GH_PAGES=1 npm run build -- --outDir dist-pages
```

**公開は gh-pages ブランチへ**（このリポジトリのトークンは workflow スコープを持たないので
**GitHub Actions は使わない**。手動 push で回す）：

```bash
cd dist-pages
touch .nojekyll
git init -q && git add -A
git -c user.email=tsutsumufunakoshi@gmail.com -c user.name=funasun commit -q -m "deploy"
git push -f https://github.com/funasun/novel-game.git HEAD:gh-pages
cd .. && rm -rf dist-pages/.git    # 次回のためにビルド成果物の .git を消す
```

公開URL：https://funasun.github.io/novel-game/ 　main への通常コミットは co-author に
`Claude Opus 4.7 <noreply@anthropic.com>` を付ける。

---

## 12. 新作チェックリスト（コピーして使う）

```
[ ] content/<id>/ フォルダを作った
[ ] layout.ts に座標を名前で置いた（スポーン・拠点・目標地点・NPC・散布点）
[ ] scene/ で setGround を呼んだ（歩ける床がある）
[ ] 木・岩・建物に addObstacle を張った（cleanup で undo）
[ ] parameters に作品の主題を映す数値を選んだ
[ ] characters に note を書いた（手帳のなかまに載る）
[ ] dialogues のチェーンは末尾以外すべて next がある
[ ] quests に goal と waypoint を付けた（進行中クエストが必ず光る）
[ ] events を gameStart→questComplete/flag/time で数珠つなぎにした
[ ] 生活ループの反復に物語ビートを"差し込んだ"（連続させない）
[ ] learnings は講義でなく、体験直後のさりげない1枚
[ ] interactables の requiresFlag/hideFlag で世界が物語とともに変わる
[ ] テキストは自作翻案（邦訳コピーなし）／3Dはプロシージャル自作
[ ] catalog.ts の PACKS に登録した
[ ] npx tsc -b が通る
[ ] preview で 誘導・手帳・チュートリアル・ビーコン を目視確認した
[ ] GH_PAGES ビルド → gh-pages へ push → 公開URLで確認
```

---

*第一作『十五少年漂流記』（全篇）と第二作『ハムレット』（5幕）は、この型で作られている。*
*engine を1行も変えずに第二作が載ったことが、この型の再利用性の証明。*
