# Cosmo Quest

宇宙を旅し、図鑑を集めながら天文学を学ぶ、Next.js製のPWA学習ゲームです。

## 必要環境

- Node.js 22.13.0以上
- npm

## ローカル確認

```bash
npm install
npm run build
npm run start
```

`http://localhost:3000`を開いて確認します。開発時は`npm run dev`を使用してください。

## 環境変数

必須の環境変数はありません。`.env.example`の値は設定画面に表示するリリース情報を変更するときだけ使用します。

| 変数 | 既定値 | 用途 |
|---|---|---|
| `NEXT_PUBLIC_APP_VERSION` | `0.1.0` | アプリVersion表示 |
| `NEXT_PUBLIC_PWA_VERSION` | `cosmo-quest-v8` | PWA Version表示 |

ローカルで変更する場合は`.env.example`を`.env.local`へコピーします。`NEXT_PUBLIC_`付きの値はブラウザへ公開されるため、秘密情報を設定しないでください。

## Vercelへデプロイ

### Git連携

1. このリポジトリをGitHub、GitLab、Bitbucketのいずれかへ送信します。
2. Vercel Dashboardで「Add New → Project」を選択します。
3. リポジトリをImportします。
4. Framework Presetが`Next.js`になっていることを確認します。
5. Build Command、Output Directory、Install Commandは上書きせず、Vercelの自動設定を使います。
6. 必要な場合のみ、`.env.example`記載の公開環境変数を登録します。
7. Deployを選択します。

### Vercel CLI

```bash
npx vercel
```

初回の質問へ回答した後、以降は`npx vercel --prod`で本番反映できます。

## PWA確認項目

デプロイ後はHTTPSの本番URLで次を確認してください。

- `/manifest.json`がHTTP 200で返る
- `/sw.js`がHTTP 200で返り、`Service-Worker-Allowed: /`が付く
- Chrome DevToolsのApplication画面でManifestとService Workerが認識される
- Android Chromeで「アプリをインストール」が表示される
- iPhone Safariの共有メニューから「ホーム画面に追加」できる
- 一度オンラインで起動したあと、オフライン再読み込みできる
- 更新時に「新しいバージョンがあります」が表示される

Service Worker、PWAインストール、オフライン機能にはHTTPSが必要です。`localhost`では開発用の安全なオリジンとして動作します。

## ビルドコマンド

| コマンド | 用途 |
|---|---|
| `npm run dev` | Next.js開発サーバー |
| `npm run build` | Vercel向け`next build` |
| `npm run start` | Next.js本番サーバー |
| `npm run lint` | ESLint |
| `npm run build:sites` | 既存Sites／Cloudflare向けビルド |
| `npm run start:sites` | 既存Sites向け本番サーバー |

## 公式資料

- [Next.js Deployment](https://nextjs.org/docs/app/getting-started/deploying)
- [Vercel Builds](https://vercel.com/docs/builds)
- [Vercel CLI](https://vercel.com/docs/cli/deploy)
