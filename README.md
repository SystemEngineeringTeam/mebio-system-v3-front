# 名簿システムv3

## 使用技術
- React@19
- Remix
- Vite
- shadcn/ui
- Tailwind CSS
- Radix UI (Primitives)
- TypeScript
- ESLint@9
- Cloudflare Pages

## セットアップ
### 1. リポジトリをクローン
https://github.com/SystemEngineeringTeam/meibo-system-v3 をクローン

### 2. パッケージをインストール
```bash
pnpm install
```

### 3. 環境変数を設定
`.dev.vars.example` をコピーして `.dev.vars` を作成し、環境変数を設定
```bash
cp .dev.vars.example .dev.vars
```

中身は slack のピン留めを参照

### 4. 開発サーバーを起動
```bash
pnpm dev
```
