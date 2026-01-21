'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getAuthToken } from '@/lib/auth'

interface InviteCode {
  id: string
  code: string
  isActive: boolean
  maxUses: number
  usedCount: number
  validFrom: string
  validUntil: string | null
  createdAt: string
  creator: { username: string }
}

export default function InviteCodeList() {
  const [inviteCodes, setInviteCodes] = useState<InviteCode[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState('')
  const [newCode, setNewCode] = useState('')
  const [newMaxUses, setNewMaxUses] = useState('1000')
  const [newValidDays, setNewValidDays] = useState('1')

  useEffect(() => {
    fetchInviteCodes()
  }, [])

  const fetchInviteCodes = async () => {
    try {
      setError('')
      const token = getAuthToken()

      if (!token) {
        setError('未登录，请重新登录')
        return
      }

      const response = await fetch('/api/invite-codes', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setInviteCodes(data)
      } else {
        const data = await response.json()
        setError(data.error || '获取邀请码列表失败')
      }
    } catch (error) {
      console.error('Fetch invite codes error:', error)
      setError('网络错误，请稍后重试')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsCreating(true)

    try {
      const token = getAuthToken()
      if (!token) {
        alert('未登录，请重新登录')
        return
      }

      const response = await fetch('/api/invite-codes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          code: newCode,
          maxUses: parseInt(newMaxUses),
          validUntil: new Date(Date.now() + parseInt(newValidDays) * 24 * 60 * 60 * 1000).toISOString(),
        }),
      })

      if (response.ok) {
        setNewCode('')
        setNewMaxUses('100')
        fetchInviteCodes()
      } else {
        const data = await response.json()
        alert(data.error || '创建失败')
      }
    } catch (error) {
      alert('网络错误')
    } finally {
      setIsCreating(false)
    }
  }

  const handleToggleActive = async (id: string, isActive: boolean, validUntil: string | null) => {
    try {
      const token = getAuthToken()
      if (!token) {
        alert('未登录，请重新登录')
        return
      }

      // 如果启用且已过期，自动延长有效期1天
      const body: any = { isActive: !isActive }
      if (!isActive && validUntil && new Date(validUntil) < new Date()) {
        body.validUntil = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      }

      const response = await fetch(`/api/invite-codes/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      })

      if (response.ok) {
        fetchInviteCodes()
      } else {
        const data = await response.json()
        alert(data.error || '操作失败')
      }
    } catch (error) {
      console.error('Toggle active error:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个邀请码吗？')) return

    try {
      const token = getAuthToken()
      if (!token) {
        alert('未登录，请重新登录')
        return
      }

      const response = await fetch(`/api/invite-codes/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        fetchInviteCodes()
      }
    } catch (error) {
      console.error('Delete error:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">加载中...</p>
      </div>
    )
  }

  if (error && inviteCodes.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <p className="text-destructive">{error}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {error && inviteCodes.length > 0 && (
        <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* 创建邀请码 */}
      <Card>
        <CardHeader>
          <CardTitle>创建邀请码</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="code">邀请码</Label>
                <Input
                  id="code"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                  placeholder="输入邀请码"
                  required
                />
              </div>
              <div>
                <Label htmlFor="maxUses">最大使用次数</Label>
                <Input
                  id="maxUses"
                  type="number"
                  value={newMaxUses}
                  onChange={(e) => setNewMaxUses(e.target.value)}
                  min="1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="validDays">有效天数</Label>
                <Input
                  id="validDays"
                  type="number"
                  value={newValidDays}
                  onChange={(e) => setNewValidDays(e.target.value)}
                  min="1"
                  required
                />
              </div>
            </div>
            <Button type="submit" disabled={isCreating} className="w-full">
              {isCreating ? '创建中...' : '创建'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* 邀请码列表 */}
      <Card>
        <CardHeader>
          <CardTitle>邀请码列表</CardTitle>
        </CardHeader>
        <CardContent>
          {inviteCodes.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>暂无邀请码，请创建新的邀请码</p>
            </div>
          ) : (
            <div className="space-y-3">
              {inviteCodes.map((inviteCode) => (
              <div
                key={inviteCode.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <code className="text-lg font-bold">{inviteCode.code}</code>
                    <span
                      className={`px-2 py-0.5 text-xs rounded-full ${
                        inviteCode.isActive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {inviteCode.isActive ? '有效' : '失效'}
                    </span>
                    {inviteCode.validUntil && new Date(inviteCode.validUntil) < new Date() && (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-700">
                        已过期
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    使用: {inviteCode.usedCount} / {inviteCode.maxUses} ·
                    创建: {new Date(inviteCode.createdAt).toLocaleDateString()}
                    {inviteCode.validUntil && (
                      <> · 有效期至: {new Date(inviteCode.validUntil).toLocaleDateString()}</>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleToggleActive(inviteCode.id, inviteCode.isActive, inviteCode.validUntil)
                    }
                  >
                    {inviteCode.isActive ? '禁用' : '启用'}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(inviteCode.id)}
                  >
                    删除
                  </Button>
                </div>
              </div>
            ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
