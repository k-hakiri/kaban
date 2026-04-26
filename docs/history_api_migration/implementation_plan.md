# History APIによるクリーンURL化の実装計画

この計画では、現在のハッシュ（#）を使用したページ内リンクを、History APIを使用したクリーンなURL（例：`/pricing`）に移行します。これにより、SEOの向上とユーザー体験の改善を図ります。

## ユーザーレビューが必要な事項
- URLの命名規則（例：`repair-flow` か `flow` か）
- 各セクションにアクセスした際のブラウザタイトルの文言

## 提案される変更

### Firebase設定
#### [MODIFY] [firebase.json](file:///Users/kenichi/kaban/firebase.json)
- `rewrites` セクションを追加し、すべてのリクエストを `index.html` に転送します。

### HTML/JavaScript
#### [MODIFY] [index.html](file:///Users/kenichi/kaban/index.html)
- ナビゲーションメニューの `href` を `#` 形式からパス形式に変更します。
- クリックイベントをキャッチし、`history.pushState` でURLを更新する処理を追加します。
- URLの変更に合わせて `document.title` を動的に更新するロジックを実装します。
- ページ読み込み時に現在のURLパスを解析し、適切な位置までスクロールする処理を実装します。

### サイトマップ
#### [MODIFY] [sitemap.xml](file:///Users/kenichi/kaban/sitemap.xml)
- 新しいクリーンURLをすべてリストに追加し、クローラーが発見できるようにします。

## 検証計画
- 各メニューをクリックして、URLが正しく変わり、該当セクションへスクロールすることを確認。
- URLを直接入力（例：`/pricing`）してアクセスした際、正しく該当セクションが表示されることを確認。
- ブラウザの「戻る」「進む」ボタンでURLと表示位置が同期することを確認。
