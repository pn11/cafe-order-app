# Cafe Mobile Order App

Google Sheets と連携したReactベースのモバイル注文アプリケーションです。メニュー管理と注文処理に対応しています。

[English](./README.md)

## 機能

- **メニュー表示**: Google Sheets からカテゴリ、説明、価格、画像付きでメニューを取得
- **ショッピングカート**: 商品の追加・削除、数量調整、合計金額表示
- **チェックアウト**: お客様情報入力フォームと注文内容確認
- **注文送信**: カフェ管理用に Google Sheets へ注文を送信
- **モバイル対応**: モバイルデバイス向けに最適化
- **カテゴリフィルター**: カテゴリ別にメニューを絞り込み

## セットアップ

### 1. 依存パッケージのインストール

```bash
npm install
```

### 2. Google Sheets の設定

#### メニュー用スプレッドシートの作成

以下のカラムを持つ Google Sheet を作成してください：

- A列: 商品名
- B列: 説明
- C列: 価格（数値）
- D列: カテゴリ
- E列: 画像URL（任意）

#### 注文用スプレッドシートの作成

以下のカラムを持つ別の Google Sheet を作成してください：

- A列: タイムスタンプ
- B列: お客様名
- C列: 電話番号
- D列: 注文内容（JSON）
- E列: 合計金額
- F列: 備考
- G列: ステータス

### 3. Google Sheets API の設定

1. [Google Cloud Console](https://console.cloud.google.com/) にアクセス
2. 新規プロジェクトを作成するか、既存のプロジェクトを選択
3. Google Sheets API を有効化
4. 認証情報（API キー）を作成
5. シートが公開されているか、適切に共有されていることを確認

### 4. 環境設定

1. `.env.example` を `.env` にコピー：

```bash
cp .env.example .env
```

2. 認証情報を入力：

```env
REACT_APP_GOOGLE_SHEETS_API_KEY=your_api_key_here
REACT_APP_MENU_SHEET_ID=your_menu_spreadsheet_id
REACT_APP_ORDER_SHEET_ID=your_order_spreadsheet_id
```

**シート ID の取得方法**:
シートの URL `https://docs.google.com/spreadsheets/d/SHEET_ID/edit` から、`/d/` と `/edit` の間にある長い文字列が `SHEET_ID` です。

### 5. トークン認証の設定

このアプリはアクセス制限のためにトークンベースの認証を使用しています。`generate-token.sh` スクリプトを使用してアクセス認証情報を作成します。

#### 前提条件

```bash
brew install qrencode  # 任意、QRコード生成用
```

#### トークンの生成

```bash
./scripts/generate-token.sh
```

カスタムベース URL を指定する場合：

```bash
./scripts/generate-token.sh https://your-domain.com/cafe-order-app
```

#### スクリプトの動作内容

1. ランダムな64文字の16進数トークンを生成
2. トークンをクエリパラメータとして含む完全な URL を作成（`?key=TOKEN`）
3. `qrencode` がインストールされている場合、QR コード画像（`access-qr.png`）を生成
4. `apps-script-generated.js` の `AUTH_TOKEN` を更新

#### 生成後の手順

1. `apps-script-generated.js` の内容を Google Apps Script にコピー
2. Apps Script を Web アプリとしてデプロイ
3. QR コード（`access-qr.png`）を許可されたユーザーと共有

#### セキュリティに関する注意

- `apps-script-generated.js` や `access-qr.png` を git に**コミットしないでください**
- トークンが漏洩した場合は再生成してください
- QR コードや URL は許可されたユーザーにのみ共有してください

## 利用可能なスクリプト

### `npm start`

開発モードでアプリを起動します（[http://localhost:3000](http://localhost:3000)）

### `npm test`

インタラクティブウォッチモードでテストランナーを起動します

### `npm run build`

本番用にアプリを `build` フォルダにビルドします

## ファイル構成

```text
src/
├── components/
│   ├── MenuItem.js          # 個別メニュー項目の表示
│   ├── MenuList.js          # カテゴリフィルター付きメニュー
│   ├── Cart.js              # ショッピングカートコンポーネント
│   └── CheckoutForm.js      # 注文チェックアウトフォーム
├── services/
│   └── googleSheets.js      # Google Sheets API 連携
├── App.js                   # メインアプリケーションコンポーネント
└── App.css                  # レスポンシブスタイリング
```

## 使い方

1. **メニューを閲覧**: すべてのメニューを表示するか、カテゴリで絞り込み
2. **カートに追加**: 「カートに追加」をクリックして商品を追加
3. **カートを確認**: カートに移動して選択した商品を確認
4. **数量を調整**: +/- ボタンで数量を調整、または商品を削除
5. **チェックアウト**: お客様情報を入力して注文を送信
6. **注文確認**: 確認画面が表示され、新規注文のオプションが提示されます

## Google Sheets 連携

### メニューシートのフォーマット

```text
商品名        | 説明              | 価格  | カテゴリ | 画像URL
エスプレッソ   | 濃いコーヒー       | 250   | コーヒー | https://...
クロワッサン   | バターたっぷり     | 300   | ペストリー| https://...
```

### 注文シートのフォーマット

注文は以下の内容で自動的に追加されます：

- 注文のタイムスタンプ
- お客様の連絡先情報
- 注文商品の JSON 文字列
- 合計金額
- 特記事項
- 初期ステータス「保留中」

## トラブルシューティング

- **メニューが読み込まれない**: API キーとシート ID を確認し、シートが公開読み取り可能であることを確認
- **注文が送信されない**: 書き込み権限と注文シートのフォーマットを確認
- **モバイル表示の問題**: 実際のデバイスでレスポンシブデザインをテスト

## セキュリティに関する注意

- 本番環境では API キーを安全に保管してください
- レート制限の実装を検討してください
- クォータ制限を超えないよう API 使用量を監視してください
- 送信前にすべてのユーザー入力を検証してください
