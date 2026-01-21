import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  // 创建默认管理员
  const hashedPassword = await bcrypt.hash('20010626syw', 10)
  const admin = await prisma.admin.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      passwordHash: hashedPassword,
    },
  })
  console.log('Created admin:', admin.username)

  // 创建一些测试邀请码
  const inviteCodes = [
    { code: 'TEST2024', maxUses: 1000 },
    { code: 'DEMO1234', maxUses: 1000 },
    { code: 'PREVIEW', maxUses: 1000 },
  ]

  for (const inviteCode of inviteCodes) {
    const code = await prisma.inviteCode.upsert({
      where: { code: inviteCode.code },
      update: {},
      create: {
        code: inviteCode.code,
        maxUses: inviteCode.maxUses,
        isActive: true,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1年后过期
        createdBy: admin.id,
      },
    })
    console.log('Created invite code:', code.code)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
