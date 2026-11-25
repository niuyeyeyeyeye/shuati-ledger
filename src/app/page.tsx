import Link from 'next/link'

export default function Home() {
  return (
    <main style={{ padding: 24, maxWidth: 720 }}>
      <h1 style={{ fontSize: 24, marginBottom: 8 }}>刷题账本</h1>
      <p style={{ color: '#57606a', marginBottom: 20 }}>
        记录每道题的思路和踩过的坑，告诉你今天该复习哪几道题。
      </p>

      <Link
        href="/problems"
        style={{
          display: 'inline-block',
          padding: '8px 18px',
          background: '#0969da',
          color: '#fff',
          borderRadius: 6,
          textDecoration: 'none',
        }}
      >
        进入题目列表 →
      </Link>
    </main>
  )
}