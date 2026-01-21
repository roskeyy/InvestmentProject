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

# 4. 安装项目依赖（跳过 Puppeteer Chrome 下载）
echo "安装项目依赖..."
PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
PUPPETEER_SKIP_DOWNLOAD=true \
npm install

# 5. 构建 Prisma
echo "构建 Prisma..."
npx prisma generate

# 6. 推送数据库 schema
echo "推送数据库 schema..."
npx prisma db push

# 7. (可选) 初始化数据
# npx tsx prisma/seed.ts

# 8. 构建应用
echo "构建 Next.js 应用..."
npm run build

# 9. 创建日志目录
mkdir -p logs

# 10. 启动/重启 PM2
echo "启动 PM2..."
pm2 restart ecosystem.config.js || pm2 start ecosystem.config.js

# 11. 保存 PM2 配置
pm2 save
pm2 startup

echo "部署完成！"
echo "应用运行在: http://localhost:3000"
echo "后台管理: http://localhost:3000/admin/login"
echo "默认管理员账号: admin / admin123"

# 12. 配置 Nginx (提示)
echo ""
echo "请配置 Nginx 反向代理："
echo "1. 复制 deploy/nginx.conf 到 /etc/nginx/sites-available/pricesignal"
echo "2. 修改 server_name 为你的域名"
echo "3. 创建软链接: sudo ln -s /etc/nginx/sites-available/pricesignal /etc/nginx/sites-enabled/"
echo "4. 测试配置: sudo nginx -t"
echo "5. 重载 Nginx: sudo systemctl reload nginx"
