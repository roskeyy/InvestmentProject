export function getAuthToken(): string | null {
  // 优先从 localStorage 获取
  if (typeof window !== 'undefined') {
    const localToken = localStorage.getItem('admin_token')
    if (localToken) return localToken
  }

  // 其次从 cookie 获取
  const cookies = document.cookie.split(';').map(c => c.trim())
  const tokenCookie = cookies.find(c => c.startsWith('admin_token='))
  if (tokenCookie) {
    return tokenCookie.substring('admin_token='.length)
  }

  return null
}

export function setAuthToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('admin_token', token)
  }
}

export function clearAuthToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('admin_token')
  }
}
