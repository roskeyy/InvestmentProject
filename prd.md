这是一个nextjs web app应用 需要部署在ubuntu 22.04服务器

我有一个小红书账号发炒股内容
准备做低客单价的测试作为商品售卖
通过卡片引流到商铺，用户下单后发给用户网站链接，打开首页是一个简单介绍和输入邀请码的界面，需要每天更新当天有效的邀请码用于自动发货填进去
用户做一些卡片式的问题 你来设计问题 大概3分钟答完
最后生成测试结果包含 
你的“炒股人格类型”
你的优势/盲区（行为金融视角）
你更适合的“操作频率/信息源/记录方式”
你最容易犯什么错、如何自我约束

UI要简洁高级，明亮，交互要有动效，最后的测试结果的UI要做成海报一样，方便用户下载分享


# ----- 阿里云 PostgreSQL RDS 配置 -----
DATABASE_HOST=pgm-uf67pd1ut0g8m0zmbo.pg.rds.aliyuncs.com
DATABASE_PORT=5432
DATABASE_NAME=investment_db
DATABASE_USER=yongwen_user
DATABASE_PASSWORD=duQ3-+UM5LpeuF6


# ----- JWT 配置 -----
JWT_SECRET=aMUakAbzH2TCxw8G3fpA_j-97ihPtC3Aliql_qAY8rQ
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080