# 自分専用iPhoneアプリとして入れる手順

App Storeへ公開せず、自分のiPhoneで「瞬間突破」を遊ぶための手順です。Apple Developer Programの有料登録は使わず、無料のApple AccountとXcodeのPersonal Teamを使います。

## 必要なもの

- Mac
- Xcode
- 自分のApple Account
- iPhone
- USBケーブル、またはXcodeで認識できるワイヤレス接続
- このGitHubリポジトリ

WindowsだけではiOSアプリを実機へ入れるところまでは進めません。Web版の開発はWindowsで続けられますが、iPhoneへ入れる作業はMacで行います。

## 無料利用時の制限

無料のApple Accountでは、App Store配布やTestFlight配布はできません。自分の端末でテストする用途です。

また、Personal Teamでは以下の制限があります。

- App IDは最大10個
- 登録できるテスト端末は各プラットフォーム最大3台
- 端末へ入れられるアプリは1台あたり最大3個
- プロビジョニングプロファイルは7日で期限切れ

期限切れ後は、Xcodeから再ビルドして再インストールします。

## 1. Macに準備する

1. App StoreからXcodeをインストールします。
2. Xcodeを一度起動し、追加コンポーネントのインストールを完了します。
3. XcodeのSettings > AccountsでApple Accountを追加します。
4. GitHubからこのリポジトリをMacへcloneします。

```bash
git clone git@github.com:bonbon-create/sukimagame.git
cd sukimagame
npm install
```

## 2. iOSプロジェクトを作る

初回だけ以下を実行します。

```bash
npm run cap:add:ios
```

これで `ios/` フォルダが作られます。

## 3. Xcodeで開く

```bash
npm run cap:open:ios
```

Xcodeが開いたら以下を確認します。

1. 左のプロジェクト一覧で `App` を選ぶ。
2. Targetsの `App` を選ぶ。
3. Signing & Capabilitiesを開く。
4. Teamに自分のPersonal Teamを選ぶ。
5. Bundle Identifierが重複してエラーになる場合は、末尾を少し変える。
   - 例: `com.bonboncreate.shunkantoppa.chuya`
6. iPhoneをMacにつなぎ、Xcode上部の実行先に自分のiPhoneを選ぶ。
7. 再生ボタンを押してビルド・インストールする。

## 4. iPhone側で信頼する

初回起動時に開発元を信頼する設定が必要になる場合があります。

1. iPhoneの設定を開く。
2. 一般 > VPNとデバイス管理へ進む。
3. 自分のApple Accountの開発元を信頼する。
4. ホーム画面から「瞬間突破」を起動する。

## 5. Web側を修正したあとの更新

ゲームを修正したら、Mac側で以下を実行します。

```bash
git pull
npm install
npm run cap:sync
npm run cap:open:ios
```

Xcodeで再度iPhoneを選び、再生ボタンでインストールします。

## 公式ドキュメント

- Apple Developer登録: https://developer.apple.com/register/
- Apple Developerメンバーシップ比較: https://developer.apple.com/support/compare-memberships/
- Apple Developerアカウント概要: https://developer.apple.com/help/account/basics/about-your-developer-account/
- Capacitor iOS: https://capacitorjs.com/docs/ios
