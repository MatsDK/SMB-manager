import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline'
import { atom, useAtom } from 'jotai'
import { Link, useRouter } from 'preact-router'
import { useEffect } from 'preact/hooks'
import confDocs from '../../get-docs/parsedConfParams.json'
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
            <div className='bg-primary-bg transition-colors h-screen'>
                <div className='max-w-5xl px-6 mx-auto flex flex-col overflow-auto'>
                    <Header />
                    <Dashboard />
                </div>
            </div>
        </DashboardProvider>
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
                    <Link href='/'>
                        <ArrowLeftOnRectangleIcon
                            width={20}
                            className='cursor-pointer text-secondary-text ml-3 hover:text-primary-text transition-colors'
                        />
                    </Link>
                </div>
                <ThemeSwitcher />
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
            {data && <GlobalConfig data={data['global']} />}
        </div>
    )
}

const GlobalConfig = ({ data }: { data: Record<string, string> }) => {
    return (
        <div className=''>
            <h2 className='text-xl font-medium'>Global Config</h2>
            <div className='flex flex-col gap-20'>
                {Object.entries(data).map(([name, value]) => {
                    if (!name) return null
                    return (
                        <div key={name}>
                            <div className='flex'>
                                <span>{name}:</span>
                                <span>{value}</span>
                            </div>
                            <div className='text-secondary-text'>
                                docs:
                                <pre>
                                    {confDocs['globalParams'][name as keyof typeof confDocs['globalParams']]?.md}
                                </pre>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
