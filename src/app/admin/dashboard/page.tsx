'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import InviteCodeList from './components/InviteCodeList'
import TestRecordList from './components/TestRecordList'
import StatsCards from './components/StatsCards'
import { getAuthToken } from '@/lib/auth'

export default function AdminDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'overview' | 'invites' | 'records'>('overview')
  const [isLoading, setIsLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = getAuthToken()
      if (!token) {
        setIsAdmin(false)
        return
      }

      const response = await fetch('/api/auth/verify', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setIsAdmin(response.ok)
    } catch (error) {
      setIsAdmin(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    localStorage.removeItem('admin_token')
    router.push('/admin/login')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>加载中...</p>
      </div>
    )
  }

  if (!isAdmin) {
    router.push('/admin/login')
    return null
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 头部 */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">炒股人格测试 - 后台管理</h1>
          <Button variant="outline" onClick={handleLogout}>
            退出登录
          </Button>
        </div>
      </header>

      {/* 导航标签 */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-2 border-b">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            数据概览
          </button>
          <button
            onClick={() => setActiveTab('invites')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === 'invites'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            邀请码管理
          </button>
          <button
            onClick={() => setActiveTab('records')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === 'records'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            测试记录
          </button>
        </div>

        {/* 内容区域 */}
        <div className="py-6">
          {activeTab === 'overview' && <StatsCards />}
          {activeTab === 'invites' && <InviteCodeList />}
          {activeTab === 'records' && <TestRecordList />}
        </div>
      </div>
    </div>
  )
}
