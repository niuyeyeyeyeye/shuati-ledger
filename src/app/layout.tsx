import type { Metadata } from 'next'
import Link from 'next/link'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  title: '刷题账本',
  description: '记录每道题的思路和踩过的坑',
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="zh-CN" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        {/* ⭐ 放在 layout 里 → 所有页面共享（相当于 React Router 的 RootLayout） */}
        <header
          style={{
            display: 'flex',
            gap: 16,
            alignItems: 'center',
            padding: '12px 24px',
            borderBottom: '1px solid #eaeef2',
          }}
        >
          <Link href="/" style={{ fontWeight: 700, color: '#1f2328', textDecoration: 'none' }}>
            刷题账本
          </Link>
          <Link href="/problems" style={{ color: '#57606a', textDecoration: 'none' }}>
            题目列表
          </Link>
        </header>

        {children}
      </body>
    </html>
  )
}