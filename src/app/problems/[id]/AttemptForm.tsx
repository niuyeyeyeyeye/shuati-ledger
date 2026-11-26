'use client'

import { useState, useTransition } from 'react'
import { createAttempt } from './actions'

const RESULTS = [
  { value: 'ac', label: '✅ 独立写出' },
  { value: 'hint', label: '💡 看了提示' },
  { value: 'fail', label: '❌ 没写出来' },
]

const PITFALL_TAGS = [
  { value: '', label: '（不选）' },
  { value: 'boundary', label: '越界 / 空值' },
  { value: 'js', label: 'JS 细节' },
  { value: 'pointer', label: '指针 / 作用域' },
  { value: 'logic', label: '思路错' },
  { value: 'other', label: '其他' },
]

export default function AttemptForm({ problemId }: { problemId: number }) {
  const [open, setOpen] = useState(false)
  const [result, setResult] = useState('ac')
  const [round, setRound] = useState('1')
  const [durationMin, setDurationMin] = useState('')
  const [memo, setMemo] = useState('')
  const [pitfallTag, setPitfallTag] = useState('')
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const fd = new FormData()
    fd.set('result', result)
    fd.set('round', round)
    fd.set('durationMin', durationMin)
    fd.set('memo', memo)
    fd.set('pitfallTag', pitfallTag)

    startTransition(async () => {
      const res = await createAttempt(problemId, fd)
      if (!res.ok) {
        setError(res.error ?? '保存失败')
        return
      }
      // 成功：清空表单、收起
      setMemo('')
      setDurationMin('')
      setResult('ac')
      setPitfallTag('')
      setRound('1')
      setOpen(false)
    })
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        style={{
          padding: '6px 14px',
          background: '#0969da',
          color: '#fff',
          border: 'none',
          borderRadius: 6,
          cursor: 'pointer',
          fontSize: 14,
        }}
      >
        + 记一次练习
      </button>
    )
  }

  return (
    <form
      onSubmit={onSubmit}
      style={{
        border: '1px solid #d0d7de',
        borderRadius: 8,
        padding: 14,
        display: 'grid',
        gap: 10,
        fontSize: 14,
        maxWidth: 420,
      }}
    >
      <label>
        结果{' '}
        <select value={result} onChange={(e) => setResult(e.target.value)}>
          {RESULTS.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
      </label>



      <label>
        花了多久（分钟）{' '}
        <input
          type="number"
          value={durationMin}
          onChange={(e) => setDurationMin(e.target.value)}
          placeholder="可空"
          style={{ width: 80 }}
        />
      </label>

      <label>
        错误类型{' '}
        <select value={pitfallTag} onChange={(e) => setPitfallTag(e.target.value)}>
          {PITFALL_TAGS.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </label>

      <label>
        这次错在哪
        <textarea
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          rows={2}
          placeholder="一句话，比如：第二步找入口没想出来"
          style={{ width: '100%', marginTop: 4 }}
        />
      </label>

      {error !== '' && <p style={{ color: '#cf222e', margin: 0 }}>{error}</p>}

      <div style={{ display: 'flex', gap: 8 }}>
        <button type="submit" disabled={isPending}>
          {isPending ? '保存中…' : '保存'}
        </button>
        <button type="button" onClick={() => setOpen(false)} disabled={isPending}>
          取消
        </button>
      </div>
    </form>
  )
}