# App Store準備メモ

このメモは、Web版の「瞬間突破」をCapacitorでiOSアプリ化し、App Store申請へ進めるための作業順です。

## 現在のアプリ設定

- アプリ名: 瞬間突破
- Bundle ID候補: `com.bonboncreate.shunkantoppa`
- Capacitor設定: `capacitor.config.ts`
- Webビルド出力先: `dist`

Bundle IDは一度App Storeへ公開すると変更しづらいため、初回提出前に最終確認してください。自分のドメインを取得する予定がある場合は、そのドメインに合わせたIDへ変更する選択肢もあります。

## Windowsでできること

```powershell
npm install
npm run build
npm run test
npm run lint
npm run typecheck
```

WindowsではWeb版の開発、テスト、Capacitor設定の準備まで進められます。

## Macで必要になること

iOSアプリのビルド、実機確認、TestFlight、App Store提出にはMacとXcodeが必要です。

Macでリポジトリを取得したあと、以下を実行します。

```bash
npm install
npm run cap:add:ios
npm run cap:open:ios
```

以後、Web側を修正したら以下でiOS側へ同期します。

```bash
npm run cap:sync
```

Xcodeで確認する主な項目:

- Signing & CapabilitiesのTeam
- Bundle Identifier
- Version
- Build
- Display Name
- 横画面設定
- 実機またはSimulatorでの起動

## App Store Connectで用意する情報

- アプリ名: 瞬間突破
- プライマリ言語: 日本語
- Bundle ID: `com.bonboncreate.shunkantoppa`
- SKU例: `shunkantoppa-ios-001`
- カテゴリ: ゲーム
- サブカテゴリ候補: アクション、カジュアル
- 年齢制限: 内容に合わせて回答
- 価格: 無料または任意
- プライバシーポリシーURL
- スクリーンショット
- 1024x1024のアプリアイコン
- アプリ説明文
- キーワード
- サポートURL

## プライバシー方針の現状

現在の実装では外部バックエンド、広告SDK、解析SDKは使っていません。記録は端末内のlocalStorageに保存され、開発者へ送信されません。

App Store ConnectのApp Privacyでは、実装がこのままであれば「データを収集しない」に近い内容になります。ただし、今後広告、解析、ランキングサーバー、SNS連携などを追加した場合は必ず見直してください。

## 申請前チェック

- App Store審査で「単なるWebサイトのラッパー」と見なされないよう、ゲームとして完結した操作、演出、記録、音、オフライン動作を確認する。
- iPhone実機でタップ、音、横画面、safe area、再起動後の記録保存を確認する。
- TestFlightで最低1回は自分の端末に配布して確認する。
- アイコン、スクリーンショット、説明文、プライバシーポリシーを提出前にそろえる。

## 公式ドキュメント

- Capacitor Configuration: https://capacitorjs.com/docs/config
- Capacitor iOS: https://capacitorjs.com/docs/ios
- Apple Developer Program: https://developer.apple.com/programs/enroll/
- App Store Connect: https://developer.apple.com/app-store-connect/
- App Review Guidelines: https://developer.apple.com/app-store/review/guidelines/
