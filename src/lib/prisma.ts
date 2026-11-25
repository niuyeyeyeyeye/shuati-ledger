import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@/generated/prisma/client'

// ⭐ 挂到 globalThis：dev 热更新会重复执行模块顶层代码，
//    不这么做就会创建出成百上千个连接池 → 打满数据库连接数
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaPg(process.env.DATABASE_URL as string),
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}