'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createAttempt(problemId: number, formData: FormData) {
    const result = String(formData.get('result') ?? '').trim()
    const durationMin = String(formData.get('durationMin') ?? '').trim()
    const memo = String(formData.get('memo') ?? '').trim()
    const pitfallTag = String(formData.get('pitfallTag') ?? '').trim()

    if (result === '') {
        return { ok: false, error: '未填写学习结果' }
    }

    if(Number.isNaN(durationMin)){
        return { ok: false, error: '时间必须为数字' }
    }

    const lastRound = await prisma.attempt.findFirst({
        where: { problemId: problemId },
        orderBy: { round: 'desc' },
        select: { round: true }
    })

    const round = (lastRound?.round ?? 0) + 1

    await prisma.attempt.create({
        data: {
            result: result,
            round: round,
            problemId: problemId,
            durationMin: durationMin === '' ? null : Number(durationMin),
            memo: memo === '' ? null : memo,
            pitfallTag: pitfallTag === '' ? null : pitfallTag,
        },
    })

    revalidatePath(`/problems/${problemId}`)
    revalidatePath(`/problems`)
    
    return {ok:true}
}