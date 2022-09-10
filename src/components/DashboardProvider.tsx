import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ComponentChildren } from 'preact'
import { useMemo } from 'preact/hooks'
import superjson from 'superjson'
import { trpc } from '../utils/trpc'

// type TrpcClient = ReturnType<typeof trpc.createClient>

type DashboardProviderProps = {
    children: ComponentChildren
    endpoint: string
}

export const DashboardProvider = ({ children, endpoint }: DashboardProviderProps) => {
    const queryClient = useMemo(() => new QueryClient(), [])

    const trpcClient = useMemo(() =>
        trpc.createClient({
            url: endpoint,
            transformer: superjson,
        }), [endpoint])

    if (!endpoint) return <div>loading</div>

    return (
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </trpc.Provider>
    )
}
