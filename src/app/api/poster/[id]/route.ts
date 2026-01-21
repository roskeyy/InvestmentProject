import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { personalityTypes } from '@/data/personality-types'
import puppeteer from 'puppeteer'
import path from 'path'
import fs from 'fs'

export const dynamic = 'force-dynamic'

async function generatePosterImage(testRecord: any, personality: any, scores: any) {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/usr/bin/chromium-browser',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  })

  try {
    const page = await browser.newPage()
    const posterUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/poster-preview/${testRecord.id}`

    await page.goto(posterUrl, { waitUntil: 'networkidle0' })

    const screenshot = await page.screenshot({
      type: 'png',
      fullPage: true,
    })

    // 保存图片
    const postersDir = path.join(process.cwd(), 'public', 'posters')
    if (!fs.existsSync(postersDir)) {
      fs.mkdirSync(postersDir, { recursive: true })
    }

    const filename = `${testRecord.id}.png`
    const filepath = path.join(postersDir, filename)
    fs.writeFileSync(filepath, screenshot)

    const publicUrl = `/posters/${filename}`

    // 更新数据库
    await prisma.testRecord.update({
      where: { id: testRecord.id },
      data: { posterUrl: publicUrl },
    })

    return publicUrl
  } finally {
    await browser.close()
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const testRecord = await prisma.testRecord.findUnique({
      where: { id: params.id },
    })

    if (!testRecord) {
      return NextResponse.json({ error: '测试记录不存在' }, { status: 404 })
    }

    return NextResponse.json({ posterUrl: testRecord.posterUrl })
  } catch (error) {
    console.error('Get poster error:', error)
    return NextResponse.json({ error: '服务器错误' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const testRecord = await prisma.testRecord.findUnique({
      where: { id: params.id },
    })

    if (!testRecord) {
      return NextResponse.json({ error: '测试记录不存在' }, { status: 404 })
    }

    const personality = personalityTypes[testRecord.personalityType]
    const scores = testRecord.scores

    const posterUrl = await generatePosterImage(testRecord, personality, scores)

    return NextResponse.json({ posterUrl })
  } catch (error) {
    console.error('Generate poster error:', error)
    return NextResponse.json({ error: '海报生成失败' }, { status: 500 })
  }
}
