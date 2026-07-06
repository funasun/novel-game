# 十五少年漂流記 — 没入体験型生活ゲーム アーキテクチャ仕様書
### PD名作古典ゲーム化フレームワーク（第一弾）

## 0. この文書について

実装の北極星となる設計仕様。第一弾は **十五少年漂流記**（J. ヴェルヌ、パブリックドメイン）だが、実装は「他のPD作品にも使い回せる型（フレームワーク）」として組む。ハムレット・銀河鉄道の夜・南総里見八犬伝などは、後からコンテンツパックを追加するだけで載る構造にする。

## 1. 設計思想（北極星）

**没入体験型生活ゲーム。** プレイヤーはその世界に入り込み、日々の生活を送りながら、その物語・時代・場所を "体験して" 学ぶ。

- **説明で教えない。体験させる。** 体験 → 気づき → さりげない史実の答え合わせ、の順。テキストで講義しない。
- **生活の手触りが没入の核。** 時間が流れ、食って・作って・仲間と関わる。その日々の中に物語が差し込まれる。
- **認知負荷は最小に。** UIはシンプル、常時表示は最小限、世界そのものに語らせる。
- **オフラインファースト（PWA）。** 実行時にAPIを呼ばない。物語分岐等はビルド時に静的生成して焼き込む。
- **データ駆動で作品を追加。** エンジンのコードは触らず、コンテンツパックを差し替える。

## 2. 技術スタック

| 領域 | 採用 |
|---|---|
| 3D描画 | React Three Fiber（+ Three.js） |
| 3Dヘルパー | @react-three/drei |
| 見た目の磨き | @react-three/postprocessing（bloom・色調・ビネット） |
| 物理 | 簡易kinematic（必要になれば @react-three/rapier） |
| 状態管理 | Zustand |
| UI | React（DOMオーバーレイ） |
| 音 | Howler.js |
| バンドラ | Vite + vite-plugin-pwa |
| 言語 | TypeScript |
| データ | JSON / TS（ビルド時静的） |
| 3Dアセット | **プロシージャル生成（コード生成の低ポリ）を基本とする** ※下記 9. 参照 |
| デプロイ | Vercel / GitHub Pages（PWA） |

## 3. 3層アーキテクチャ

```
┌─────────────────────────────────────────────┐
│  Layer 3 : コンテンツデータ（作品ごと）        │  ← 追加はここだけ
│  物語・世界・キャラ・学び・アセット参照         │
├─────────────────────────────────────────────┤
│  Layer 2 : ジャンルモジュール（任意で着脱）     │  ← 作品が使うものを選ぶ
│  survival / colony / building / ...           │
├─────────────────────────────────────────────┤
│  Layer 1 : コアエンジン（全作品共通）           │  ← ほぼ触らない
│  3D世界・プレイヤー・時間・会話・状態・保存 等   │
└─────────────────────────────────────────────┘
```

**新しい作品を足す = Layer 3 のフォルダを1つ増やすだけ。** Layer 1 は不変。

境界の実例: エンジンは地形を知らない。`engine/ground.ts` の `GroundProvider` にコンテンツ側が標高・歩行可否を登録する（`IslandScene` が `setGround()` を呼ぶ）。この流儀をすべてのシステムで守る。

## 4. リポジトリ構成

```
/src
  /engine                      # Layer 1 : 共通コア（作品を知らない）
    World.tsx                  # 3Dシーンの器・ライティング・ポスプロ
    Player.tsx                 # 操作アバター（移動・カメラ追従・歩行アニメ）
    ground.ts                  # 接地インターフェース（コンテンツが実装を注入）
    /systems                   # Time / Interaction / Dialogue / Event / Quest / Parameter / Save
    /store                     # gameStore.ts（Zustand）
    /learning                  # LearningLayer（体験後の答え合わせ）
    /ui                        # HUD / DialogueBox / Menu / Journal / ParameterBar
  /modules                     # Layer 2 : ジャンル（survival / colony / building / exploration / relationship / combat）
  /content
    /two-years-vacation        # Layer 3 : 十五少年漂流記
      /scene                   # IslandScene（チェアマン島：プロシージャル地形・海・植生）
      manifest.json  story.json  world.json  characters.json  learning.json
  /shared-assets
    /procedural                # noise / terrain / vegetation — 全作品共通の生成基盤
```

## 5. コアエンジンの各システム仕様

- **World** — シーンの器。空・環境光・太陽光・フォグ・ポストプロセス（bloom・ビネット）を集中管理。作品固有物はchildrenで受ける。
- **Player** — 三人称（背後追従カメラ）。WASD/矢印移動、ドラッグでカメラ回転。接地は `GroundProvider` 経由。プロシージャル少年モデル＋手足の歩行アニメ。
- **TimeSystem** — 1日を分刻みで進め、朝→昼→夕→夜のサイクルと日付をstoreに反映。行動で時間を消費させる。
- **InteractionSystem** — 対象の `interaction` データに従い、拾う/採る/話す/使うを実行。効果はデータ側に書く。
- **DialogueSystem** — `characters.json` のノードを辿る。選択肢が `effects` を持つ。
- **EventSystem** — `trigger`（gameStart/時刻/場所/フラグ/閾値）を監視し物語ビートを発火。
- **QuestSystem** — 目標の追加/更新/完了。押し付けがましくしない。
- **ParameterSystem** — パラメータ定義は作品の `manifest` に書く汎用枠。エンジンは増減と表示のみ。
- **SaveSystem** — store全体をIndexedDBへ。複数スロット・オートセーブ。完全オフライン。
- **LearningLayer** — 教育の核。体験直後にさりげなく史実・解説を提示。ジャーナルに蓄積。
- **ContentLoader** — `manifest.json` を読み、モジュールを動的import、初期状態をセット。

## 6. データスキーマ（実装の指針）

**manifest.json** — 使用モジュールとパラメータ定義（stamina/supplies/morale/trust/development、開始シーン・開始時刻）。
**story.json** — 物語イベント（trigger / steps: camera・dialogue・quest / learning参照）。
**characters.json** — 会話ノード（speaker / lines / choices+effects）。
**world.json** — インタラクト対象（model / position / interaction: prompt+action）。
**learning.json** — 答え合わせ（title / trigger / body / tags）。

> パラメータもイベントも会話も学びも、**すべてデータ側**。エンジンは「読んで動かす」だけ。

## 7. 十五少年漂流記の具体設計

**物語アーク（8段）**: 嵐で漂着 → 島の探索 → 拠点建設 → 社会形成（役割分担・リーダー選挙）→ 内部対立 → 外部の脅威 → 協力して解決 → 成長と決着。

**生活ループ**: 朝起きる → 食料調達 → 拠点の維持・建設 → 仲間との会話 → 夜の振り返り → 時間が進む。この反復にEventSystemが物語ビートを差し込む。「日々を生きていたら物語が起きる」感覚。

**モジュール**: survival + colony + building + exploration + relationship。

**パラメータ**: 体力・物資・仲間の士気・信頼・開拓度。行動と選択に因果で重みを持たせる。

**学び**: 19世紀の航海とサバイバル、リーダーシップと合意形成、島の選挙＝民主主義の原体験、島の地理と自然。

**アート方向**: 様式化した低ポリ＋ポストプロセス。フォトリアルは狙わない。一貫した様式を磨く。

## 8. 実装フェーズと現状

- **Phase 0 — 土台** ✅ 完了: Vite+TS+R3F+PWA。プロシージャルなチェアマン島（地形・海・植生）、歩けるプレイヤー、追従カメラ、HUD。
- **Phase 1 — インタラクトと所持品** ✅ 完了: InteractionSystem（調べる/拾う）＋ Inventory。流木を拾える。
- **Phase 2 — 時間とサバイバル** ✅ 完了: TimeSystem（昼夜サイクル、Worldのライティング連動）＋ 空腹・体力の代謝。
- **Phase 3 — 会話と状態** ✅ 完了: DialogueBox（選択肢・連鎖会話）＋ gameStore ＋ SaveSystem（IndexedDBオートセーブ）。
- **Phase 4 — 物語と学び** ✅ 完了: EventSystem（gameStart/フラグ/時刻/クエスト達成トリガー、就寝ステップ）＋ LearningLayer（学びトースト・手帳）。

→ 「型」が動いた（第一章チュートリアル: 漂着→火→食→夜→第2日 をE2E確認済み）。以降はモジュールとコンテンツの追加のみ。

## 9. アセット方針（プロシージャル第一）

**方針**: 3Dアセットは外部調達に頼らず、**コードによるプロシージャル生成を基本**とする。

- 地形（島）: ノイズ関数＋放射状フォールオフによる生成（`shared-assets/procedural/terrain.ts`）。標高関数を地形メッシュ・接地・植生散布が共有する。
- 植生・岩: 決定論的散布＋InstancedMesh（`vegetation.ts`）。個体差はシード乱数。
- キャラクター: プリミティブ構成の低ポリ人型＋コードアニメーション。
- 理由: (1) 制作を完全に自己完結できる (2) ライセンス100%クリーン (3) 様式の一貫性 (4) バンドルが軽くPWA向き。
- 将来、CC0アセット（Quaternius/Kenney等）やGLBへの差し替えは `AssetRegistry` 経由で可能な構造を保つ。

## 10. 著作権の注意

- プロット・キャラクター・世界設定は自由（原作PD）。
- **テキストは自作の翻案**。現代の邦訳の文章はコピーしない。
- 絵・3Dはプロシージャル自作（上記9）。特定の挿絵・映画版のデザインは流用しない。

## 11. 実装の進め方

- Phase単位で進める。完了条件は「〜が画面で動く」。
- 常に「これは engine か content か？」を問い、作品固有のものは必ず content 側のデータに書く。この境界を崩さない限り、型は他作品に効き続ける。
