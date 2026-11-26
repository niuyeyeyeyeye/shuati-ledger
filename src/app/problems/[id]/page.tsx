import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import AttemptForm from './AttemptForm'

type Props = {
    params: Promise<{ id: string }>
}

export default async function ProblemDetailPage({ params }: Props) {
    const { id } = await params                    // ⭐ params 也是 Promise

    const problem = await prisma.problem.findUnique({
        where: { id: Number(id) },                   // URL 里是字符串，要转数字
        include: {
            attempts: { orderBy: { date: 'desc' } },   // 一对多：把练习记录一起带出来
        },
    })

    if (problem === null) notFound()                // 没这道题 → 404 页面

    return (
        <main style={{ padding: 24, maxWidth: 720 }}>
            <Link href="/problems" style={{ fontSize: 13, color: '#57606a' }}>
                ← 返回列表
            </Link>

            <h1 style={{ fontSize: 22, margin: '12px 0 6px' }}>
                {problem.leetcodeId ? `#${problem.leetcodeId} ` : ''}
                {problem.title}
            </h1>

            <p style={{ color: '#57606a', fontSize: 13, margin: '0 0 16px' }}>
                {problem.difficulty} · {problem.topic} · {problem.status}
            </p>

            {problem.note !== null && (
                <section style={{ marginBottom: 14 }}>
                    <h2 style={{ fontSize: 15, margin: '0 0 4px' }}>思路</h2>
                    <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7 }}>{problem.note}</p>
                </section>
            )}

            {problem.pitfall !== null && (
                <section style={{ marginBottom: 14 }}>
                    <h2 style={{ fontSize: 15, margin: '0 0 4px' }}>踩过的坑</h2>
                    <p style={{ margin: 0, fontSize: 14, color: '#cf222e' }}>{problem.pitfall}</p>
                </section>
            )}

            <h2 style={{ fontSize: 15, margin: '20px 0 8px' }}>
                练习记录（{problem.attempts.length} 次）
            </h2>

            <div style={{ marginBottom: 12 }}>
                <AttemptForm problemId={problem.id}/>
            </div>

            {problem.attempts.length === 0 ? (
                <p style={{ color: '#8b949e', fontSize: 14 }}>还没有练习记录</p>
            ) : (
                <ul style={{ margin: 0, paddingLeft: 20, fontSize: 14, lineHeight: 1.9 }}>
                    {problem.attempts.map((a) => (
                        <li key={a.id}>
                            {new Date(a.date).toLocaleDateString('zh-CN')} · 第 {a.round} 轮 ·{' '}
                            {a.result === 'ac' ? '✅ 独立写出' : a.result === 'hint' ? '💡 看了提示' : '❌ 没写出来'}
                            {a.pitfallTag !== null && ` · ${a.pitfallTag}`}
                            {a.memo !== null && <span style={{ color: '#57606a' }}>（{a.memo}）</span>}
                        </li>
                    ))}
                </ul>
            )}
        </main>
    )
}