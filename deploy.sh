#!/bin/bash

# エラーが発生したら即座に終了
set -e

echo "🚀 ビルドを開始します..."
npm run build

echo "📦 Firebaseへデプロイ中..."
firebase deploy

echo "✅ デプロイが完了しました！"
