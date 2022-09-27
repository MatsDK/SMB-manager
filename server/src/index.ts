import { createExpressMiddleware } from '@trpc/server/adapters/express'
import cors from 'cors'
import express from 'express'
import { createContext } from './context'
import { appRouter } from './router'
    ; (async () => {
        const app = express()

        const trpcApiEndpoint = '/trpc'
        const playgroundEndpoint = '/trpc-playground'

        app.use(cors())
        app.use(
            trpcApiEndpoint,
            createExpressMiddleware({
                router: appRouter,
                createContext,
            }),
        )

        // app.use(
        // 	playgroundEndpoint,
        // 	await expressHandler({
        // 		trpcApiEndpoint,
        // 		playgroundEndpoint,
        // 		router: appRouter,
        // 		request: {
        // 			superjson: true,
        // 		},
        // 	})
        // )

        app.listen(3000, () => {
            console.log('Server is running')
        })
    })()
