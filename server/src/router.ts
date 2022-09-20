import { initTRPC, TRPCError } from '@trpc/server'
import fs from "node:fs"
import superjson from 'superjson'
import ini from "ini"
import { Context } from './context'

export const t = initTRPC.context<Context>().create({ transformer: superjson })

const SMB_CONF_PATH = '/etc/samba/smb.conf'

export const appRouter = t.router({
    getConfig: t.procedure.query(() => {
        if (!fs.existsSync(SMB_CONF_PATH)) throw new TRPCError({
            code: "PARSE_ERROR",
            "message": "SMB config file not found"
        })

        const rawConf = fs.readFileSync(SMB_CONF_PATH, 'utf-8')

        console.log(ini.parse(rawConf));
        return ini.parse(rawConf)
    }),
})

export type AppRouter = typeof appRouter
