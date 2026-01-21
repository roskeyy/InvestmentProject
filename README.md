# 炒股人格测试 Web 应用

基于 Next.js 14 构建的炒股人格测试应用，用户通过邀请码进入，完成12道单选题后生成个性化的炒股人格分析海报。

## 技术栈

- **前端**: Next.js 14 (App Router) + TypeScript + Tailwind CSS + shadcn/ui
- **后端**: Next.js API Routes + Puppeteer
- **数据库**: PostgreSQL (阿里云 RDS)
- **认证**: JWT
- **部署**: PM2 + Nginx

## 功能特性

- 邀请码验证系统（支持次数限制、过期时间）
- 12道精心设计的人格测试题目
- 6种炒股人格类型智能分析
- 个性化海报生成和下载
- 完整的后台管理系统
- 响应式设计，支持移动端

## 炒股人格类型

| 类型 | 特征 | 适合策略 |
|------|------|----------|
| 🦁 稳健型投资者 | 风险厌恶、长期价值 | 长线持有、季报/年报 |
| 🦊 技术分析派 | 图表指标、短线交易 | 日内/波段、K线/量能 |
| 🐰 跟风小白 | 缺乏判断、情绪化 | 定投、指数基金 |
| 🦉 价值发现者 | 深度研究、逆向思维 | 低吸策略、财报/研报 |
| 🐺 激进交易者 | 高风险偏好、杠杆 | 短线狙击、热点题材 |
| 🐻 数据量化派 | 数据驱动、系统化 | 程序化交易、多因子 |

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

环境变量已配置在 `.env.local`:

```env
DATABASE_HOST=pgm-uf67pd1ut0g8m0zmbo.pg.rds.aliyuncs.com
DATABASE_PORT=5432
DATABASE_NAME=photo_db
DATABASE_USER=yongwen_user
DATABASE_PASSWORD=***
DATABASE_URL="postgresql://yongwen_user:***@pgm-uf67pd1ut0g8m0zmbo.pg.rds.aliyuncs.com:5432/photo_db"

JWT_SECRET=***
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. 初始化数据库

```bash
# 生成 Prisma Client
./node_modules/.bin/prisma generate

# 创建数据库表（如果不存在）
set -a && . ./.env.local && set +a && npx tsx prisma/init-db.ts

# 初始化数据（管理员和邀请码）
set -a && . ./.env.local && set +a && npx tsx prisma/seed.ts
```

### 4. 运行开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

### 5. 运行生产构建

```bash
npm run build
npm start
```

## 默认账号

- **邀请码**: TEST2024, DEMO1234, PREVIEW
- **管理员**: admin / admin123

## 项目结构

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # 根布局
│   ├── page.tsx                  # 首页
│   ├── quiz/page.tsx             # 测试页面
│   ├── result/[id]/page.tsx      # 结果页面
│   ├── admin/                    # 后台管理
│   │   ├── login/page.tsx        # 登录页面
│   │   └── dashboard/page.tsx    # 仪表盘
│   └── api/                      # API Routes
│       ├── auth/                 # 认证
│       ├── invite-codes/         # 邀请码管理
│       ├── quiz/                 # 测试提交
│       ├── poster/               # 海报生成
│       ├── stats/                # 统计数据
│       └── test-records/         # 测试记录
├── components/                   # React 组件
│   ├── ui/                       # shadcn/ui 基础组件
│   ├── quiz/                     # 测试相关组件
│   ├── result/                   # 结果页面组件
│   └── admin/                    # 后台组件
├── lib/                          # 工具函数
│   ├── db.ts                     # Prisma 客户端
│   ├── jwt.ts                    # JWT 工具
│   └── quiz-logic.ts             # 评分算法
├── data/                         # 静态数据
│   ├── quiz-questions.ts         # 测试题目
│   └── personality-types.ts      # 人格类型定义
└── types/                        # TypeScript 类型
```

## API 端点

### 公开接口

- `POST /api/invite-codes/validate` - 验证邀请码
- `POST /api/quiz/submit` - 提交测试答案

### 管理员接口 (需要 JWT)

- `POST /api/auth/login` - 管理员登录
- `POST /api/auth/logout` - 管理员登出
- `GET /api/auth/verify` - 验证登录状态
- `GET /api/invite-codes` - 获取邀请码列表
- `POST /api/invite-codes` - 创建邀请码
- `PATCH /api/invite-codes/[id]` - 更新邀请码
- `DELETE /api/invite-codes/[id]` - 删除邀请码
- `GET /api/test-records` - 获取测试记录
- `GET /api/stats` - 获取统计数据
- `GET /api/poster/[id]` - 获取海报
- `POST /api/poster/[id]` - 生成海报

## 部署

### 使用 PM2 部署

```bash
# 构建应用
npm run build

# 启动 PM2
pm2 start ecosystem.config.js

# 保存 PM2 配置
pm2 save
pm2 startup
```

### 配置 Nginx

参考 `deploy/nginx.conf` 配置文件：

```bash
# 复制配置文件
sudo cp deploy/nginx.conf /etc/nginx/sites-available/pricesignal

# 修改域名
sudo nano /etc/nginx/sites-available/pricesignal

# 启用站点
sudo ln -s /etc/nginx/sites-available/pricesignal /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重载 Nginx
sudo systemctl reload nginx
```

### 自动部署脚本

```bash
chmod +x deploy/deploy.sh
./deploy/deploy.sh
```

## 注意事项

1. **Puppeteer 依赖**: 海报生成功能需要 Puppeteer，确保服务器安装了必要的依赖
2. **数据库**: 确保数据库连接配置正确
3. **环境变量**: 生产环境请修改 JWT_SECRET 和管理员密码
4. **文件上传**: public/posters 目录需要写入权限

## License

MIT
