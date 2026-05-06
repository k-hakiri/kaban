# 波切カバン店 Webサイト

## 概要
山梨県甲府市にあるカバン修理専門店「波切カバン店」の公式ウェブサイトです。
SPA（Single Page Application）風のスクロール遷移と、SEO対策を施した静的サイト生成（SSG）を組み合わせた構成となっています。

## 技術スタック
- **フロントエンド**: HTML5, Vanilla CSS, Tailwind CSS（ユーティリティクラス）
- **ビルドツール**: Node.js (`build.js` による独自スクリプト)
- **インフラ/ホスティング**: Firebase Hosting

## プロジェクト構成
- **ソースコード**: `index.html` を中心に、各コンテンツセクションを定義しています。
- **ビルドスクリプト**: `build.js` が `index.html` を元に各ページの静的HTMLを生成します。
- **アセット**: `/assets` ディレクトリにCSS, JavaScript, 画像ファイルが格納されています。
- **設定**: `firebase.json` でFirebase Hostingの設定、`.gitignore` でGit管理対象外ファイルが定義されています。

## 開発・デプロイフロー
### 依存関係のインストール
```bash
npm install
```

### 静的サイトのビルド
`build.js` を実行して、各ページのHTMLファイルを生成します。
```bash
npm run build
```

### デプロイ
ビルドとデプロイをまとめて実行するスクリプトを用意しました。

1.  **ビルド＆デプロイ実行スクリプト**:
    `deploy.sh` を使用して、ビルドからFirebaseへのデプロイまでを一度に行えます。
    ```bash
    sh deploy.sh
    ```

2.  **直接デプロイ**:
    ビルド済みファイルをFirebase Hostingにデプロイします。
    ```bash
    firebase deploy
    ```

## ガイドライン
プロジェクトのコーディング規約や開発フローについては、以下のファイルを参照してください。
- `GEMINI.md`

## リポジトリ管理
- Gitの管理対象外ファイルは `.gitignore` で定義されています。
- 自動生成されるファイル（例: `/faq/index.html` 等の各ページ）はGitの管理対象から除外されています。
- ローカルでの変更は、`npm run build` でビルドし、`sh deploy.sh` でデプロイすることをおすすめします。
