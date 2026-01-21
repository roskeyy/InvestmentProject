'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Home() {
  const router = useRouter()
  const [inviteCode, setInviteCode] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/invite-codes/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: inviteCode.trim() }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || '邀请码验证失败')
        return
      }

      // 验证成功，保存邀请码到 sessionStorage 并跳转到测试页面
      sessionStorage.setItem('inviteCode', inviteCode.trim())
      sessionStorage.setItem('inviteCodeId', data.id)
      router.push('/quiz')
    } catch (err) {
      setError('网络错误，请稍后重试')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50">
      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md shadow-xl animate-fade-in">
          <CardHeader className="text-center space-y-2">
            <div className="text-6xl mb-4">📈</div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              炒股人格测试
            </CardTitle>
            <CardDescription className="text-base">
              揭秘你的炒股人格，3分钟完成专业分析
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="inviteCode" className="text-sm font-medium">
                  请输入邀请码
                </label>
                <Input
                  id="inviteCode"
                  type="text"
                  placeholder="输入邀请码"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                  className="text-center text-lg tracking-wider"
                  maxLength={10}
                  required
                />
                {error && (
                  <p className="text-sm text-destructive mt-2">{error}</p>
                )}
              </div>

              <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
                <p className="font-medium">测试包含：</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• 12道精心设计的单选题</li>
                  <li>• 分析你的风险偏好和投资风格</li>
                  <li>• 生成个性化炒股人格报告</li>
                  <li>• 获得专属投资建议</li>
                </ul>
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-lg"
                disabled={isLoading || !inviteCode.trim()}
              >
                {isLoading ? '验证中...' : '开始测试'}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                约3分钟完成 · 结果仅供娱乐参考
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
