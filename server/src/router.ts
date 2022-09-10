import { initTRPC } from '@trpc/server'
import superjson from 'superjson'
import { z } from 'zod'
import { Context } from './context'

export const t = initTRPC.context<Context>().create({ transformer: superjson })

export const appRouter = t.router({
    getConfig: t.procedure.query(() => {
        return {}
    }),
})

export type AppRouter = typeof appRouter
