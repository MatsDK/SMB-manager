import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline'
import { atom, useAtom } from 'jotai'
import { ComponentChildren, h } from 'preact'
import { Link, useRouter } from 'preact-router'
import { useEffect } from 'preact/hooks'
import { trpc } from '../utils/trpc'
import { DashboardProvider } from './DashboardProvider'
import { ThemeSwitcher } from './ThemeSwitcher'

const endPointAtom = atom('')

export const DashboardView = () => {
    const [router] = useRouter()
    const [endPoint, setEndPoint] = useAtom(endPointAtom)

    useEffect(() => {
        if (router.matches?.e) {
            setEndPoint(router.matches.e)
        }
    }, [router])

    if (!endPoint) return <div>No endpoint</div>

    return (
        <DashboardProvider endpoint={endPoint}>
            <DashboardLayout>
                <DashboardOverView />
            </DashboardLayout>
        </DashboardProvider>
    )
}

export const DashboardLayout = ({ children }: { children: ComponentChildren }) => {
    return (
        <div className='bg-primary-bg transition-colors h-screen overflow-hidden overflow-y-auto'>
            <div className='max-w-5xl px-6 mx-auto flex flex-col'>
                <DashboardHeader />
                {children}
            </div>
        </div>
    )
}

export const DashboardHeader = () => {
    const [endpoint] = useAtom(endPointAtom)

    return (
        <div className='flex justify-between  py-5 h-fit z-10'>
            <Link href={`/dashboard?e=${endpoint}`}>
                <h1 className='text-[40px] font-semibold text-primary-text'>Dashboard</h1>
            </Link>
            <div className='flex'>
                <div className='flex justify-center items-center mr-5'>
                    <span className='text-primary-text'>{endpoint}</span>
                    <Link href='/'>
                        <ArrowLeftOnRectangleIcon
                            width={20}
                            className='cursor-pointer text-secondary-text ml-1 hover:text-primary-text transition-colors'
                        />
                    </Link>
                </div>
                <ThemeSwitcher />
            </div>
        </div>
    )
}

const DashboardOverView = () => {
    const { isLoading, data, error } = trpc.getConfig.useQuery()

    if (isLoading) return <div>loading</div>
    if (error) return <div>Error: {error?.message}</div>

    return (
        <div className='mt-4'>
            {data && <GlobalConfigOverView data={data['global']} />}
        </div>
    )
}

const GlobalConfigOverView = ({ data }: { data: Record<string, string> }) => {
    const [endPoint] = useAtom(endPointAtom)

    return (
        <Link href={`/dashboard/global?e=${endPoint}`}>
            <div className='bg-secondary-bg rounded-md p-5 shadow-md'>
                <h2 className="text-primary-text text-2xl font-semibold mb-3">
                    Global configuration
                </h2>
                <div className='grid grid-cols-2 gap-2'>
                    {Object.entries(data).slice(0, 12).map(([name, value]) => {
                        if (!name) return null
                        return (
                            <div key={name} className="flex items-center">
                                <span className="text-primary-text font-medium whitespace-nowrap">{name}:</span>
                                <span className="text-secondary-text ml-2 whitespace-nowrap text-ellipsis overflow-hidden">{value}</span>
                                {/* <div className='text-secondary-text'>
                                docs:
                                <pre>
                                    {confDocs['globalParams'][name as keyof typeof confDocs['globalParams']]?.md}
                                </pre>
                            </div> */}
                            </div>
                        )
                    })}
                </div>
            </div>
        </Link>
    )
}


