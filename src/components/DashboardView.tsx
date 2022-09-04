import { createTRPCProxyClient } from '@trpc/client'
import { useRouter } from 'preact-router'
import { useEffect, useState } from 'preact/hooks'
import superjson from 'superjson'
import type { AppRouter } from '../../server/src/router'

export const DashboardView = () => {
    const [router] = useRouter()
    const [endPoint, setEndPoint] = useState('')

    useEffect(() => {
        const url = router.matches?.['e']

        if (url) {
            setEndPoint(url)

            const client = createTRPCProxyClient<AppRouter>({
                url,
                transformer: superjson,
            })
        }
    }, [router])

    return (
        <div>
            Dashboard: {endPoint}
        </div>
    )
}
