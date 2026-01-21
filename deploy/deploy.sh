#!/bin/bash

# 炒股人格测试部署脚本
# 适用于 Ubuntu 22.04

set -e

echo "开始部署炒股人格测试应用..."

# 1. 安装 Node.js (如果未安装)
if ! command -v node &> /dev/null; then
    echo "安装 Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# 2. 安装 PM2 (如果未安装)
if ! command -v pm2 &> /dev/null; then
    echo "安装 PM2..."
    sudo npm install -g pm2
fi

# 3. 安装 Chrome/Chromium (Puppeteer 依赖)
echo "安装 Chromium 浏览器..."
sudo apt-get update
sudo apt-get install -y chromium-browser

# 4. 配置 npm 使用国内镜像（加速国内服务器）
echo "配置 npm 镜像源..."
npm config set registry https://registry.npmmirror.com

# 5. 安装项目依赖（使用国内镜像和跳过 Puppeteer 下载）
echo "安装项目依赖（可能需要几分钟）..."
echo "开始时间: $(date '+%Y-%m-%d %H:%M:%S')"

PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
PUPPETEER_SKIP_DOWNLOAD=true \
npm install \
  --progress=true \
  --loglevel=http \
  --timing=true

echo "完成时间: $(date '+%Y-%m-%d %H:%M:%S')"
echo "✅ 依赖安装完成"

# 6. 构建 Prisma
echo "构建 Prisma..."
npx prisma generate

# 7. 推送数据库 schema
echo "推送数据库 schema..."
npx prisma db push

# 8. (可选) 初始化数据
# npx tsx prisma/seed.ts

# 9. 构建应用
echo "构建 Next.js 应用..."
npm run build

# 10. 创建日志目录
mkdir -p logs

# 11. 启动/重启 PM2
echo "启动 PM2..."
pm2 restart ecosystem.config.js || pm2 start ecosystem.config.js

# 12. 保存 PM2 配置
pm2 save
pm2 startup

echo "部署完成！"
echo "应用运行在: http://localhost:3000"
echo "后台管理: http://localhost:3000/admin/login"
echo "默认管理员账号: admin / admin123"

# 13. 配置 Nginx (提示)
echo ""
echo "请配置 Nginx 反向代理："
echo "1. 复制 deploy/nginx.conf 到 /etc/nginx/sites-available/pricesignal"
echo "2. 修改 server_name 为你的域名"
echo "3. 创建软链接: sudo ln -s /etc/nginx/sites-available/pricesignal /etc/nginx/sites-enabled/"
echo "4. 测试配置: sudo nginx -t"
echo "5. 重载 Nginx: sudo systemctl reload nginx"
