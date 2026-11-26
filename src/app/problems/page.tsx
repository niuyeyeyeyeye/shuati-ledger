import { prisma } from '@/lib/prisma'
import styles from './problems.module.css'
import Link from 'next/link'

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}
const TOPICS = ['链表', '二叉树', '数组']
const DIFFICULTIES = ['简单', '中等', '困难']
const STATUSES = [
  { value: 'new', label: '未做' },
  { value: 'seen', label: '🟡 见过' },
  { value: 'mastered', label: '🟢 会做' }
]

type Filters = {
  topic?: string,
  difficulty?: string,
  status?: string,
}

type FilterKey = 'topic' | 'difficulty' | 'status'

function buildHref(current: Filters, key: FilterKey, value: string): string {
  const next = new URLSearchParams()
  const keys: FilterKey[] = ['topic', 'difficulty', 'status']

  for (const k of keys) {
    if (k === key) continue
    const v = current[k]
    if (v !== undefined) {
      next.set(k, v)
    }
  }

  if (current[key] !== value) {
    next.set(key, value)
  }

  const qs = next.toString()
  return qs === '' ? '/problems' : `/problems?${qs}`
}



function FilterRow({
  label,
  options,
  currentValue,
  field,
  params,
}: {
  label: string
  options: { value: string; label: string }[]
  currentValue?: string
  field: FilterKey
  params: Filters
}) {
  return (
    <div className={styles.filterRow}>
      <span className={styles.filterLabel}>{label}</span>
      {options.map((o) => (
        <Link
          key={o.value}
          href={buildHref(params, field, o.value)}
          className={`${styles.filterBtn} ${currentValue === o.value ? styles.active : ''}`}
        >
          {o.label}
        </Link>
      ))}
    </div>
  )
}

// ⭐ 注意这个 async —— 它是一个 Server Component，直接在组件里 await 数据库
export default async function ProblemsPage({ searchParams }: Props) {
  const sp = await searchParams

  const difficulty = typeof sp.difficulty === 'string' ? sp.difficulty : undefined
  const topic = typeof sp.topic === 'string' ? sp.topic : undefined
  const status = typeof sp.status === 'string' ? sp.status : undefined

  const problems = await prisma.problem.findMany({
    where: {
      difficulty: difficulty,
      topic: topic,
      status: status,
    },
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { attempts: true } } }
  })

  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ fontSize: 20, marginBottom: 16 }}>
        题目列表（{problems.length} 道）
      </h1>

      <div className={styles.filters}>
        <FilterRow
          label="专题"
          options={TOPICS.map((t) => ({ value: t, label: t }))}
          currentValue={topic}
          field="topic"
          params={{ topic, difficulty, status }}
        />
        <FilterRow
          label="难度"
          options={DIFFICULTIES.map((d) => ({ value: d, label: d }))}
          currentValue={difficulty}
          field="difficulty"
          params={{ topic, difficulty, status }}
        />
        <FilterRow
          label="状态"
          options={STATUSES}
          currentValue={status}
          field="status"
          params={{ topic, difficulty, status }}
        />
      </div>

      <div className={styles.list}>
        {problems.map((p) => (
          <Link href={`/problems/${p.id}`} key={p.id} className={styles.card}>
            <p className={styles.title}>
              {p.leetcodeId ? `#${p.leetcodeId} ` : ''}
              {p.title}
            </p>
            <div className={styles.meta}>
              <span className={styles.tag}>{p.difficulty}</span>
              <span className={styles.tag}>{p.topic}</span>
              <span className={styles.tag}>{p._count.attempts}次尝试</span>
              <span
                className={`${styles.tag} ${p.status === 'mastered' ? styles.mastered : styles.seen
                  }`}
              >
                {p.status === 'mastered' ? '🟢 会做' : p.status === 'seen' ? '🟡 见过' : '未做'}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}