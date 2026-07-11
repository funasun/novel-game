# ROADMAP — 大改修と新作2本（2026-07-12 自律作業計画）

指示：
1. 十五少年漂流記 — 世界をもっと広く。マイクラ×ドラクエ的な楽しさを拡充（見た目・操作性は現状維持）
2. ハムレット — マップが少ない・できることが少ない → 大掛かりに改善
3. 新作『クリスマス・キャロル』→『高瀬舟』
4. 妥協しない。まず計画を書き出し、それに従う。

---

## A. エンジン汎用機構の追加（Layer 1 — 作品を知らないまま拡張）

どの作品にも効く「遊びの語彙」を先にエンジンへ足す。全て**宣言的データ駆動**で、
packが使わなければ何も起きない（後方互換）。

| 機構 | 内容 | 実装箇所 |
|---|---|---|
| クラフト/建設 | `RecipeDef {id,label,description?,inputs:Record<itemId,n>,effects,requiresFlag?,hideFlag?}`・`ContentPack.recipes?`・`store.craft(id)`。effectsでflagを立てれば「建設」（Sceneがflagで建物を出す）、paramsを動かせば「料理」になる | types.ts / gameStore.ts / LearningLayer(手帳「つくる」タブ) |
| 再取得できる資源 | `InteractableDef.cooldownHours?: number`・`store.usedAt: Record<id,分>`。once:trueの代わりに時間経過で復活（採集の周回が成立） | types.ts / gameStore.ts / InteractionSystem.tsx |
| 地図と発見 | `LandmarkDef {id,label,position:[x,z],radius?}`・`ContentPack.landmarks?`・`mapBounds?:[minX,minZ,maxX,maxZ]`・`store.visitedLandmarks`。接近で「〜を発見した」トースト＋手帳「地図」タブに点灯（未発見は「？」） | types.ts / gameStore.ts / DiscoverySystem(Canvas内) / DiscoveryToast(DOM) |
| サイドクエスト | `QuestDef.side?: boolean`。HUD方位・光の柱は非sideの先頭クエスト優先。手帳では「よりみち」枠 | types.ts / Waypoint.tsx / LearningLayer |
| テレポート | `Effects.teleport?: [x,z]`。engine/warp.ts の requestWarp を Player useFrame が消費（camera initialized リセット）。章移動・夢の場面転換に | types.ts / warp.ts / gameStore.ts / Player.tsx |
| ダッシュ | Shift押下 or ジョイスティック倒し込み(>0.92)で移動×1.55。世界が広くなるので必須 | Player.tsx |
| 効果音 | engine/audio.ts — WebAudio合成SFX（調べる/入手/クエスト達成ファンファーレ/発見/クラフト/学び）。HUDにミュートトグル、localStorage永続 | audio.ts / 各system / Hud |
| 手帳のタブ化 | 目標/地図/つくる/持ちもの/学び/なかま。地図・つくるはpackにデータがある時だけ表示 | LearningLayer.tsx |
| セーブ拡張 | SaveData に usedAt / visitedLandmarks を追加。旧セーブは `?? {}` で移行 | SaveSystem.ts / gameStore.ts |

**規律**: engineに作品名・座標・文言を一切書かない。全てpack側データ。

---

## B. 十五少年漂流記 — 世界拡張＋マイクラ×DQ化

### B-1. 地形拡張（既存座標の高さを変えないこと！）
- `islandHeight` に **沿岸リング項**（r>95 でのみ効く smoothstep 窓 95→135）を追加。
  内陸（キャンプ・見張り山・洞窟・北端）は1mmも動かさず、海岸線の外に新たな低地が生まれる。
- メッシュ ISLAND_SIZE 280→380、歩行可能半径 110→132。fog遠方も調整。
- **湖** (-54,-8) r≈17 — ガウス窪みで水面。西の荒地の奥に「静かな湖」。
- **川** 湖→南海岸: (-48,6)→(-40,28)→(-38,48)→(-44,80)。川は歩行不可、
  **丸木橋** ~(-42,22)（洞窟→荒地ルート上）と河口の浅瀬で渡れる。
- 北東 (30,-40) に高地の隆起（眺望スポット）。
- 新規座標は layout.ts に命名して追加（LAKE, RIVER_BRIDGE, EAST_CAPE, …）。

### B-2. 資源ノード（cooldownHours で復活）
| 資源 | 場所 | 間隔 |
|---|---|---|
| 魚（釣り） | 湖・河口・桟橋 | 6h |
| 木いちご | 森の縁 | 12h |
| 石 | 岩場 | 8h |
| 葦 | 川辺 | 12h |
| 粘土 | 河口 | 12h |
| 海鳥の卵 | 断崖 | 24h |
| 薬草 | 荒地 | 24h |
| 薪 | 既存＋川辺 | 6h |

### B-3. クラフト＆建設（recipes）
- 料理: 焼き魚（魚1→空腹回復）、いちご煮（いちご2）、卵料理、薬湯（薬草＋counter dishes_cooked）
- 道具: 釣り竿（木2葦2 → flag rod_made、以後釣り効率UP文言）、ロープ（葦3）
- 建設（flag→StagePropsが建物を描画、counter buildings++）:
  - 物見やぐら（木8ロープ2）— 東岬に骨組みが建つ
  - 燻製小屋（木6石4粘土2）— キャンプ脇
  - 桟橋（木10ロープ3）— 入江
- サイドクエスト: sq_build（建設3件）/ sq_cook（料理3品）/ sq_map（地図の踏破＝landmark発見数）

### B-4. 地図・発見
- landmarks ~12: 隊の入江/見張り山/フレンチ・デン/北のけむり山/静かな湖/丸木橋/東の岬/
  海鳥の断崖/南の浅瀬/西の荒地/セヴァーン岬/ボードワンの墓
- 遠地に「漂着物」「昔の測量標」など発見系interactable（学びと結ぶ）

## C. ハムレット — 大改修（城の既存座標は不動）

### C-1. マップ拡張 — 城の南に世界を足す
- 城壁の南門(z=+34)の先に **城下町**: 石畳の通り z=36..90、家並み、市場、酒場「錨亭」、井戸、広場(0,60)
- 南東に **港**: 桟橋・小舟・樽/木箱・海
- 西に **オフィーリアの庭**: (-30..-52, 45..70) 柳の木・小川・花畑
- 城の周囲に海の遠景（エルシノアは海辺の城）
- walkable = 城内規則 ∪ 町領域 ∪ 門通路。家はBLOCKERS。

### C-2. 遊びの拡充
- 新NPC: 衛兵/商人/宿の女将/漁師 — **噂集め** sq_rumors（counter 4）。
  デンマーク選挙王制・海峡通行税・フォーティンブラス動向の学びに接続
- **花集め** sq_flowers（ポローニアス死後に解禁、5種 — 第四幕の花言葉の学び→柳に花輪を供える）
- **台詞の欠片** sq_quotes（7つの名台詞コレクション、光る紙片）
- **心の管理**（cooldownHours、憂鬱/疑い/決意を能動的に動かせる）:
  剣の稽古（決意+）/ホレイシオと語らう（憂鬱−）/礼拝堂で祈る/酒場（憂鬱− 疑念+）/書見（疑い−）
- landmarks ~14、手帳の地図タブでエルシノア全景

## D. 新作『クリスマス・キャロル』（id: christmas-carol）

- **params**: 温もり(0始まり)/悔恨/金貨(displayのお金)
- **マップ**: 雪のロンドン — スクルージの事務所/ガス灯の通り/教会/クラチット家/フレッドの家/市場/墓地。
  遠座標に「過去」「未来」の夢の街区（Effects.teleport で行き来）
- **流れ**: 開幕の選択（石炭/フレッド/寄付）→ マーレイの亡霊 → q_past（学校/フェジウィッグ/ベル）→
  q_present（クラチット家/フレッド家/無知と欠乏）→ q_future（3つの暗い場面＋自分の墓）→
  朝の再生 q_redemption（七面鳥/寄付/チップ/フレッド訪問/ボブ昇給 = counter good_deeds 5）→ 結び（タイニー・ティムは生きる）
- **学び** ~14: ヴィクトリア朝の貧困/救貧院/ディケンズとクリスマス文化 等
- 雪のパーティクル、夜〜朝の時間演出、鎖の亡霊

## E. 新作『高瀬舟』（id: takasebune）

- プレイヤー＝同心・羽田庄兵衛。夜の高瀬川を下る舟で喜助を護送
- **params**: 問い/静けさ。**流れ**: 4つの舫い（章）を teleport で移動 —
  晴れやかな護送者の謎 → 二百文の知足 → 弟の死の告白（安楽死）→ 大阪へ・暁
- 岸辺の点景（蛍/朧月/柳/地蔵/高札場）で「静けさ」が満ちる
- **学び** ~10: 知足/ユウタナジイ/オオトリテエ/角倉了以と高瀬川/遠島の実際
- 夜景: 運河の水面、柳、蔵、橋、蛍のPoints、霞む月。最小スコープで密度重視

## F. 進行順と検証

1. エンジン機構（A）→ typecheck
2. 十五少年（B）→ E2E（拡張地形の歩行/採集/クラフト/地図/既存クエスト回帰）→ commit
3. ハムレット（C）→ E2E（町への出入り/新遊び/既存5幕回帰）→ commit
4. キャロル（D）→ E2E 通し → commit
5. 高瀬舟（E）→ E2E 通し → commit
6. build → gh-pages デプロイ → メモリ更新

検証は preview MCP（rAFはスクリーンショットで進む/店舗setStateは40ms待ち/812×375横長）。
セーブ互換: 旧セーブ読込で落ちないこと（`?? {}`）。
