'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Loader2 } from 'lucide-react'
import { quizQuestions } from '@/data/quiz-questions'

export default function QuizPage() {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [tempSelected, setTempSelected] = useState<number | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // 检查是否有邀请码
    const inviteCode = sessionStorage.getItem('inviteCode')
    if (!inviteCode) {
      router.push('/')
    }
  }, [router])

  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100

  const handleAnswer = (optionIndex: number) => {
    setTempSelected(optionIndex)

    setTimeout(() => {
      const newAnswers = [...answers]
      newAnswers[currentQuestion] = optionIndex
      setAnswers(newAnswers)

      if (currentQuestion < quizQuestions.length - 1) {
        setDirection('forward')
        setIsAnimating(true)
        setTimeout(() => {
          setCurrentQuestion(currentQuestion + 1)
          setTempSelected(null)
          setIsAnimating(false)
        }, 200)
      } else {
        submitQuiz(newAnswers)
        setTempSelected(null)
      }
    }, 150)
  }

  const submitQuiz = async (finalAnswers: number[]) => {
    const inviteCodeId = sessionStorage.getItem('inviteCodeId')
    if (!inviteCodeId) {
      router.push('/')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inviteCodeId,
          answers: finalAnswers.map((answer, index) => ({
            questionId: index + 1,
            optionIndex: answer,
          })),
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        alert(error.error || '提交失败')
        setIsSubmitting(false)
        return
      }

      const data = await response.json()
      sessionStorage.setItem('testRecordId', data.id)
      sessionStorage.removeItem('inviteCode')
      sessionStorage.removeItem('inviteCodeId')
      router.push(`/result/${data.id}`)
    } catch (error) {
      alert('网络错误，请稍后重试')
      setIsSubmitting(false)
    }
  }

  const goBack = () => {
    if (currentQuestion > 0) {
      setTempSelected(null)
      setDirection('backward')
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentQuestion(currentQuestion - 1)
        setIsAnimating(false)
      }, 300)
    }
  }

  const question = quizQuestions[currentQuestion]

  return (
    <main className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* 提交中的 Loading 遮罩 */}
        {isSubmitting && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-8 text-center space-y-4">
              <Loader2 className="w-16 h-16 animate-spin text-primary mx-auto" />
              <h3 className="text-2xl font-bold text-gray-800">正在分析你的炒股人格...</h3>
              <p className="text-gray-600">请稍候，马上就好</p>
            </div>
          </div>
        )}

        {/* 头部进度 */}
        <div className="mb-8 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">
              问题 {currentQuestion + 1} / {quizQuestions.length}
            </span>
            <span className="text-muted-foreground">
              {Math.round(progress)}% 完成
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* 问题卡片 */}
        <Card className="shadow-xl overflow-hidden">
          <CardContent className="p-8">
            <div
              className={`transition-all duration-300 ${
                isAnimating
                  ? direction === 'forward'
                    ? 'translate-x-[-20px] opacity-0'
                    : 'translate-x-[20px] opacity-0'
                  : 'translate-x-0 opacity-100'
              }`}
            >
              <h2 className="text-2xl font-bold mb-8 text-center">
                {question.question}
              </h2>

              <div className="space-y-3">
                {question.options.map((option, index) => {
                  const isSelected = tempSelected === index || answers[currentQuestion] === index
                  return (
                    <button
                      key={index}
                      onClick={() => !isSubmitting && handleAnswer(index)}
                      disabled={isSubmitting}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed ${
                        isSelected
                          ? 'border-primary bg-primary/10 shadow-md'
                          : 'border-border hover:border-primary hover:bg-primary/5'
                      }`}
                    >
                      <span className="flex items-center">
                        <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-medium mr-3 ${
                          isSelected ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'
                        }`}>
                          {String.fromCharCode(65 + index)}
                        </span>
                        <span className="flex-1">{option}</span>
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 导航按钮 */}
        <div className="mt-6 flex justify-between">
          <Button
            variant="outline"
            onClick={goBack}
            disabled={currentQuestion === 0}
            className="px-8"
          >
            上一题
          </Button>
          <Button
            variant="ghost"
            onClick={() => router.push('/')}
            className="text-muted-foreground"
          >
            退出测试
          </Button>
        </div>

        {/* 进度指示器 */}
        <div className="mt-8 flex justify-center gap-2">
          {quizQuestions.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (index < currentQuestion || answers[index] !== undefined) {
                  setTempSelected(null)
                  setDirection(index > currentQuestion ? 'forward' : 'backward')
                  setIsAnimating(true)
                  setTimeout(() => {
                    setCurrentQuestion(index)
                    setIsAnimating(false)
                  }, 300)
                }
              }}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentQuestion
                  ? 'bg-primary scale-125'
                  : index < currentQuestion || answers[index] !== undefined
                  ? 'bg-primary/50 hover:bg-primary/70'
                  : 'bg-muted'
              }`}
              aria-label={`Question ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </main>
  )
}
