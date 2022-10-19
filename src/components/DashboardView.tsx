import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline'
import { invoke } from '@tauri-apps/api/tauri'
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai'
import { ComponentChildren, h } from 'preact'
import { Link, useRouter } from 'preact-router'
import { useEffect } from 'preact/hooks'
import { configAtom, SmbSharesAtom } from '../utils/store'
import { ThemeSwitcher } from './ThemeSwitcher'

export const endPointAtom = atom('')

export const DashboardView = () => {
    const [router] = useRouter()
    const [endPoint, setEndPoint] = useAtom(endPointAtom)
    const setConfig = useSetAtom(configAtom)

    useEffect(() => {
        if (router.matches?.e) {
            setConfig(null)
            setEndPoint(router.matches.e)
            invoke('get_conf_command', { url: router.matches.e }).then(res => {
                try {
                    res = JSON.parse(res as string)

                    if (res) setConfig(res as any)
                } catch (e) {}
            })
        }
    }, [router])

    if (!endPoint) return <div>No endpoint</div>

    return (
        <DashboardLayout>
            <DashboardOverView />
        </DashboardLayout>
    )
}

interface DashboardLayoutProps {
    pageTitle?: string
}

export const DashboardLayout = ({ children, ...props }: { children: ComponentChildren } & DashboardLayoutProps) => {
    return (
        <div className='bg-primary-bg transition-colors h-screen overflow-hidden overflow-y-auto '>
            <div className='max-w-5xl px-6 mx-auto flex flex-col relative'>
                <DashboardHeader {...props} />
                {children}
            </div>
        </div>
    )
}

export const DashboardHeader = ({ pageTitle }: DashboardLayoutProps) => {
    const [endpoint] = useAtom(endPointAtom)

    return (
        <div className='flex justify-between  py-5 h-fit z-10'>
            <div className='flex items-center'>
                <Link href={`/dashboard?e=${endpoint}`}>
                    <h1 className='text-[40px] font-semibold text-primary-text'>Dashboard</h1>
                </Link>
                {pageTitle && (
                    <h1 className='text-[40px] font-semibold text-primary-text flex'>
                        <p className='px-5'>/</p>
                        {pageTitle}
                    </h1>
                )}
            </div>
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
    const [config] = useAtom(configAtom)
    return (
        <div className='mt-4'>
            {config && (
                <div>
                    {config?.['global'] && <GlobalConfigOverView data={config['global']} />}
                    <SmbSharesOverView />
                </div>
            )}
        </div>
    )
}

const SmbSharesOverView = () => {
    const smbShares = useAtomValue(SmbSharesAtom)

    return (
        <div className='mt-8'>
            <div className='flex justify-between items-center'>
                <h1 className='font-semibold text-[30px] text-primary-text'>
                    Smb Shares
                    <span className='ml-2 text-secondary-text font-normal text-xl '>({smbShares.length})</span>
                </h1>
                <button className='text-center bg-primary-text text-primary-bg px-5 py-1 rounded-md hover:scale-[1.02] transition-transform'>
                    New Share
                </button>
            </div>
            <div className='grid grid-cols-2 gap-5'>
                {smbShares && smbShares.map(([name, params]) => <SmbShareCard name={name} params={params} />)}
            </div>
        </div>
    )
}

const SmbShareCard = ({ name, params }: { name: string; params: Record<string, string> }) => {
    return (
        <Link href={`/dashboard/share/${name}`}>
            <div className='bg-secondary-bg rounded-md px-5 py-2 shadow-md'>
                <h3 className='text-primary-text font-medium text-xl'>[{name}]</h3>
                <div className='grid grid-cols-2 gap-2'>
                    {Object.entries(params).slice(0, 12).map(([name, value]) => {
                        if (!name) return null
                        return (
                            <div key={name} className='flex items-center'>
                                <span className='text-primary-text font-medium whitespace-nowrap'>{name}:</span>
                                <span className='text-secondary-text ml-2 whitespace-nowrap text-ellipsis overflow-hidden'>
                                    {value}
                                </span>
                            </div>
                        )
                    })}
                </div>
            </div>
        </Link>
    )
}

const GlobalConfigOverView = ({ data }: { data: Record<string, string> }) => {
    const [endPoint] = useAtom(endPointAtom)

    return (
        <Link href={`/dashboard/global?e=${endPoint}`}>
            <div className='bg-secondary-bg rounded-md p-5 shadow-md'>
                <h2 className='text-primary-text text-2xl font-semibold mb-3'>
                    Global configuration
                </h2>
                <div className='grid grid-cols-2 gap-2'>
                    {Object.entries(data).slice(0, 12).map(([name, value]) => {
                        if (!name) return null
                        return (
                            <div key={name} className='flex items-center'>
                                <span className='text-primary-text font-medium whitespace-nowrap'>{name}:</span>
                                <span className='text-secondary-text ml-2 whitespace-nowrap text-ellipsis overflow-hidden'>
                                    {value}
                                </span>
                            </div>
                        )
                    })}
                </div>
            </div>
        </Link>
    )
}
