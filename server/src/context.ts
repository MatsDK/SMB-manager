import type { inferAsyncReturnType } from '@trpc/server'
import type { CreateExpressContextOptions } from '@trpc/server/adapters/express'

export const createContext = ({
    req,
    res,
}: CreateExpressContextOptions) => ({})

export type Context = inferAsyncReturnType<typeof createContext>
