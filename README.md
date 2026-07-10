# 瞬間突破 / NEON GAP

暗い研究施設の中央を動く障害物のスキマを狙い、左側のプレイヤーから右側のセキュリティーコアへ水平レーザーを撃つ、オリジナルの横画面ワンタップゲームです。

## 起動方法

```powershell
npm install
npm run dev
```

ブラウザで表示されたURLを開きます。通常は以下です。

```text
http://localhost:5173/
```

## 操作方法

- クリック / タップ: レーザー発射
- Space: レーザー発射
- 右上の `II`: 一時停止
- Esc: 一時停止
- タイトル画面の音声ボタン: 音声ON/OFF

スマートフォンでは横向きプレイを基本にしています。画面比率は16:9、基準解像度は960x540で、画面サイズに応じてアスペクト比を維持して拡大縮小します。

## コマンド

```powershell
npm run dev
npm run build
npm run test
npm run lint
npm run typecheck
```

## ゲームルール

- 制限時間は60.0秒です。
- 全30ステージを順番に攻略します。
- 発射した瞬間の障害物配置で当たり判定します。
- 障害物に当たるとミスになり、0.75秒の再発射クールダウンが入ります。
- 障害物に当たらずターゲットへ届くとステージ成功です。
- 各ステージの最初の1発で成功すると `1 SHOT` として残り時間に1.0秒加算されます。
- 残り10秒以下で警報モードになります。
- 時間切れ、または30ステージ突破でリザルトへ進みます。
- リザルトは端末内のlocalStorageにベスト10として保存されます。

## 設計

主要なSceneは以下です。

- `BootScene`: 起動初期化
- `TitleScene`: タイトル、画面遷移、音声ON/OFF
- `HowToScene`: 操作説明と動くデモ
- `GameScene`: タイマー、ステージ進行、入力、演出、一時停止
- `ResultScene`: 結果表示と記録保存
- `RecordsScene`: localStorageのベスト10表示と削除

当たり判定は `src/game/geometry/collision.ts` に純粋関数として分離しています。

- `rayIntersectsAABB`
- `rayIntersectsOBB`
- `segmentIntersectsPolygon`
- `normalizeAngle`
- `isLaserPathClear`

ステージ定義は `src/game/data/stages.ts` に集約しています。10種類の基本パターンを速度、位相、数、サイズで変化させて30ステージを生成します。

攻略可能性は `src/game/systems/StageSolvability.ts` の簡易シミュレーターで検査し、全ステージに通過可能な瞬間があることをVitestで確認します。

## 調整可能な定数

`src/game/constants.ts` で主なゲームバランスを調整できます。

- `BASE_WIDTH`, `BASE_HEIGHT`: 基準解像度
- `PLAYER_X`, `TARGET_X`, `LASER_Y`: プレイヤー、ターゲット、レーザー位置
- `START_TIME_SECONDS`: 初期制限時間
- `REFIRE_COOLDOWN_MS`: ミス後の再発射クールダウン
- `ONE_SHOT_BONUS_SECONDS`: 1Shot成功時の加算秒数
- `WARNING_TIME_SECONDS`: 警報モード開始秒数
- `STAGE_TRANSITION_MS`: ステージ遷移時間
- `DEBUG_COLLISION`: 当たり判定形状のデバッグ表示

## 素材と権利

画像素材や既存音源は使用していません。ロゴ、UI、キャラクター、ターゲット、障害物、ステージ配置、音はこのプロジェクト用に作成したオリジナルです。
