# 🐇 RabbitMQ メッセージブローカー チャレンジ

**RabbitMQ メッセージブローカー チャレンジ**へようこそ - メッセージキュー実装スキルを評価するための柔軟な技術評価です。

## 📚 チャレンジ概要

このチャレンジでは以下の能力を評価します：
- RabbitMQ メッセージブローカーの使用
- カスタマーデータの CRUD 操作の実装
- 技術的アプローチの選択と正当化
- 包括的なテストとドキュメントの作成

### 主な特徴

- **柔軟な実装**: 任意のプログラミング言語を選択（PHP、Python、TypeScript の例を提供）
- **カスタマーデータに焦点**: 現実世界のカスタマーデータ管理シナリオ
- **複数のセットアップオプション**: Docker、クラウド、またはローカル RabbitMQ インストール
- **包括的なテスト**: テストスイートの例とカバレッジ要件
- **オプションのフロントエンド**: 推奨されるが必須ではない

## 🎯 目的

1. **メッセージブローカーの理解**: RabbitMQ のセットアップと構成スキルを実証
2. **CRUD 操作**: カスタマーデータの作成、読み取り、更新、削除を実装
3. **柔軟な実装**: 好みの言語とアーキテクチャを選択
4. **ドキュメントとテスト**: 明確なドキュメントと徹底的なテストを提供

## 📖 タスク: カスタマーデータ管理システム

RabbitMQ ベースのカスタマーデータ管理システムを構築し、カスタマーレコードに対する CRUD 操作を実行する必要があります。実装アプローチは完全に柔軟です。

### カスタマーデータ構造

```json
{
  "customer_id": "一意の識別子",
  "name": "顧客名",
  "email": "customer@example.com",
  "phone": "+1234567890",
  "address": {
    "street": "123 Main St",
    "city": "東京",
    "postal_code": "100-0001"
  },
  "status": "active|inactive|pending",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

### 必要な操作

選択した言語でこれらの操作を実装してください：

```javascript
// 例インターフェース - 選択した言語で実装
createCustomer(customerData)
getCustomer(customerId)
updateCustomer(customerId, updatedData)
deleteCustomer(customerId)
getCustomerLogs()
checkConnection()
```

## 🛠 実装要件

### 1. 柔軟な環境セットアップ

以下のアプローチのいずれかを選択してください：

#### オプションA: Docker（推奨）
```bash
# docker-compose.yml の例
version: '3.8'

services:
  rabbitmq:
    image: rabbitmq:3.11-management
    ports:
      - "5672:5672"      # AMQP
      - "15672:15672"    # 管理UI
    environment:
      RABBITMQ_DEFAULT_USER: your_user
      RABBITMQ_DEFAULT_PASS: your_password
```

#### オプションB: クラウドサービス
- RabbitMQ クラウドプロバイダーを使用（CloudAMQP、AWS MQ など）
- 接続詳細をドキュメントに記載
- 選択したサービスのセットアップ手順を含める

#### オプションC: ローカルインストール
```bash
# macOS (Homebrew)
brew install rabbitmq
brew services start rabbitmq

# Windows (Chocolatey)
choco install rabbitmq
rabbitmq-server

# Linux (Debian/Ubuntu)
sudo apt-get install rabbitmq-server
sudo systemctl start rabbitmq-server
```

### 2. 環境構成

実装用の `.env` ファイルを作成してください：

```env
RABBITMQ_HOST=localhost
RABBITMQ_PORT=5672
RABBITMQ_USER=your_user
RABBITMQ_PASS=your_password
RABBITMQ_VHOST=/  # 仮想ホスト
```

### 3. バックエンド実装

以下の言語で例を提供しています：
- **PHP 8+**: [`backend/php/RabbitMQClient.php`](rabbitmq-challenge/backend/php/RabbitMQClient.php)
- **Python 3.9+**: [`backend/python/rabbitmq_client.py`](rabbitmq-challenge/backend/python/rabbitmq_client.py)
- **TypeScript 4.9+**: [`backend/typescript/rabbitmqClient.ts`](rabbitmq-challenge/backend/typescript/rabbitmqClient.ts)

**以下のいずれかを選択できます：**
- これらを参考実装として使用
- 既存のコードを修正・改善
- スクラッチから独自の実装を作成
- 好みのプログラミング言語を使用

### 4. キュー構造（提案）

```
customer_queue       - メインのカスタマーデータキュー（永続的）
customer_logs        - すべての変更の監査トレイル
customer_dlq         - 失敗した操作用のデッドレターキュー
```

### 5. フロントエンド（オプション）

フロントエンドインターフェースを作成するオプションがあります：
- **必須ではありません**が、フルスタックの実証として推奨
- 単純な HTML/JS または任意のフレームワークを使用可能
- CRUD 操作の動作を実証する必要があります
- デザインは完全に自由です

## 🧪 テスト要件

以下の言語でテストスイートの例を提供しています：
- **PHP**: [`tests/php/RabbitMQClientTest.php` (PHPUnit)](rabbitmq-challenge/tests/php/RabbitMQClientTest.php)
- **Python**: [`tests/python/test_rabbitmq_client.py` (pytest)](rabbitmq-challenge/tests/python/test_rabbitmq_client.py)
- **TypeScript**: [`tests/typescript/rabbitmqClient.test.ts` (Jest)](rabbitmq-challenge/tests/typescript/rabbitmqClient.test.ts)

### テストカバレッジ要件

テストでは以下をカバーしてください：
1. **接続処理**: RabbitMQ 接続の検証
2. **CRUD 操作**: すべてのカスタマーデータ操作のテスト
3. **エラーセナリオ**: 無効なデータ、ネットワーク障害
4. **エッジケース**: 空のキュー、大容量メッセージ
5. **パフォーマンス**: メッセージスループットとレイテンシ

### 提供されたテストの実行

```bash
# PHP
cd backend/php
php vendor/bin/phpunit tests

# Python
cd backend/python
python -m pytest tests

# TypeScript
cd backend/typescript
npm test
```

## 📤 提出手順

圧縮（`.zip`）フォルダーを提供してください。以下を含めてください：
1. **バックエンド実装**（選択した言語）
2. **フロントエンドコード**（作成した場合）
3. **セットアップ手順**（Docker、ローカル、またはクラウド構成）
4. **ドキュメント**（セットアップと使用ガイド）
5. **テストケース**（実装用）
6. **サンプル構成ファイル**（`.env` の例）
7. **ソリューションの実行に必要なその他のリソース**

## 🎯 評価基準

実装は以下の基準で評価されます：

1. **機能性**（40%）：すべての CRUD 操作がカスタマーデータで正しく動作するか
2. **コード品質**（20%）：クリーンで保守性が高く、文書化されたコード
3. **エラー処理**（15%）：堅牢で包括的なエラー管理
4. **テスト**（15%）：徹底的なテストカバレッジとエッジケースの処理
5. **ドキュメント**（10%）：明確なセットアップと使用ガイド

## 💡 ヒント

1. **シンプルに始める**：基本的なカスタマー操作をまず動作させる
2. **早期にテスト**：各機能の開発とともにテストを作成
3. **すべてを文書化**：レビュー担当者が理解しやすくする
4. **エッジケースを処理**：現実世界のシナリオを考慮
5. **後で最適化**：まず正確性に焦点を当て、その後パフォーマンスを向上

## 📚 追加リソース

### 実装例
- **PHP**：php-amqplib を使用した RabbitMQ 接続
- **Python**：pika ライブラリを使用した非同期サポート
- **TypeScript**：amqplib を使用した Promise ベースの API

### RabbitMQ ベストプラクティス
```yaml
# 推奨されるキューのプロパティ
durable: true              # ブローカー再起動に耐える
auto_delete: false         # 最後のコンシューマーがアンサブスクライブしても自動削除しない
arguments:
  x-message-ttl: 86400000  # 24時間 TTL
  x-dead-letter-exchange: "customer_dlq"
```

### トラブルシューティングガイド

**接続の問題：**
```bash
# RabbitMQ のステータスを確認
rabbitmqctl status

# 接続をテスト
telnet localhost 5672

# 資格情報を確認
rabbitmqctl list_users
```

**メッセージ配信の問題：**
- キューのバインディングを確認：`rabbitmqctl list_bindings`
- メッセージ永続性設定を確認
- コンシューマーの承認ロジックを確認
- 失敗したメッセージ用のデッドレターキューを確認

## 🚀 開始チェックリスト

- [ ] このチャレンジドキュメント全体を読む
- [ ] 実装アプローチを選択（言語、セットアップ）
- [ ] 好みの方法で RabbitMQ をセットアップ
- [ ] 実装例を確認（オプション）
- [ ] カスタマーデータの CRUD 操作を実装
- [ ] 包括的なテストを作成
- [ ] セットアップドキュメントを作成
- [ ] 実装を徹底的にテスト
- [ ] 提出用にすべてをパッケージ化

実装を楽しんでください！創造的なソリューションを楽しみにしています。 🚀
