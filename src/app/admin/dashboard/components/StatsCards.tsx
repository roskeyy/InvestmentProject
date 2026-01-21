'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { personalityTypes } from '@/data/personality-types'
import { getAuthToken } from '@/lib/auth'

interface Stats {
  totalTests: number
  totalInvites: number
  personalityCounts: Array<{ personalityType: string; _count: number }>
}

export default function StatsCards() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const token = getAuthToken()
      if (!token) {
        return
      }

      const response = await fetch('/api/stats', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Fetch stats error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading || !stats) {
    return <div>加载中...</div>
  }

  return (
    <div className="space-y-6">
      {/* 总览卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              总测试次数
            </CardTitle>
            <span className="text-2xl">📊</span>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalTests}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              总邀请码数
            </CardTitle>
            <span className="text-2xl">🎫</span>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalInvites}</div>
          </CardContent>
        </Card>
      </div>

      {/* 人格分布 */}
      <Card>
        <CardHeader>
          <CardTitle>人格类型分布</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(personalityTypes).map(([key, personality]) => {
              const count = stats.personalityCounts.find(
                (c) => c.personalityType === key
              )?._count || 0
              const percentage = stats.totalTests > 0
                ? Math.round((count / stats.totalTests) * 100)
                : 0

              return (
                <div key={key} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center">
                      <span className="text-xl mr-2">{personality.emoji}</span>
                      <span>{personality.name}</span>
                    </span>
                    <span className="text-muted-foreground">
                      {count} 次 ({percentage}%)
                    </span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${personality.gradient}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
