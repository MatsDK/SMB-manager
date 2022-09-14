import { atom, useAtom } from 'jotai'
import { useRouter, Link } from 'preact-router'
import { useEffect } from 'preact/hooks'
import { trpc } from '../utils/trpc'
import { DashboardProvider } from './DashboardProvider'
import { ThemeSwitcher } from './ThemeSwitcher'
import { ArrowLeftOnRectangleIcon } from "@heroicons/react/24/outline"

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
            <DashboardPage />
        </DashboardProvider>
    )
}

const DashboardPage = () => {
    return (
        <div className='bg-primary-bg transition-colors h-screen'>
            <div className='max-w-5xl px-6 mx-auto flex flex-col overflow-auto'>
                <Header />
                <Dashboard />
            </div>
        </div>
    )
}

const Header = () => {
    const [endpoint] = useAtom(endPointAtom)

    return (
        <div className='flex justify-between  py-5 h-fit z-10'>
            <h1 className='text-[40px] font-semibold text-primary-text'>Dashboard</h1>
            <div className='flex'>
                <div className='flex justify-center items-center'>
                    <span className='text-primary-text'>{endpoint}</span>
                    <Link href='/' >
                        <ArrowLeftOnRectangleIcon
                            width={20}
                            className="cursor-pointer text-secondary-text ml-3 hover:text-primary-text transition-colors"
                        />
                    </Link>
                </div>
                {/* <ThemeSwitcher /> */}
            </div>
        </div>
    )
}

const Dashboard = () => {
    const { isLoading, data, error } = trpc.getConfig.useQuery()

    if (isLoading) return <div>loading</div>
    if (error) return <div>Error: {error?.message}</div>

    return (
        <div className='mt-4'>
            <GlobalConfig />
            {JSON.stringify(data)}
        </div>
    )
}

const GlobalConfig = () => {
    return (
        <div className=''>
            <h2 className='text-xl font-medium'>Global Config</h2>
        </div>
    )
}
