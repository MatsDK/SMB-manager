import { ArrowLeftOnRectangleIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
import { invoke } from '@tauri-apps/api/tauri'
import ini from 'ini'
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai'
import { ComponentChildren, h, Ref } from 'preact'
import { Link, useRouter } from 'preact-router'
import { useEffect } from 'preact/hooks'
import { useClickOutisde } from '../hooks/useClickOutside'
import { configAtom, ReloadPopupOpenAtom, SmbSharesAtom } from '../utils/store'
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
                    res = ini.parse(res as string)
                    // res = JSON.parse(res as string)

                    if (res) setConfig(res as any)
                } catch (e) { }
            }).catch(e => {
                console.error(e)
            })
        }
    }, [router])

    if (!endPoint) return (
        <div className="h-screen w-screen flex justify-center items-center bg-primary-bg">
            <div className="flex flex-col items-center">
                <span className="text-xl font-semibold text-primary-text">No endpoint found</span>
                <Link href="/" className="text-primary-text">Go back</Link>
            </div>
        </div>
    )


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
    const reloadPopupOpen = useAtomValue(ReloadPopupOpenAtom)

    return (
        <div className='bg-primary-bg transition-colors h-screen overflow-hidden overflow-y-auto '>
            <div className='max-w-5xl px-6 mx-auto flex flex-col relative'>
                <DashboardHeader {...props} />
                {children}
            </div>
            {reloadPopupOpen && <ReloadServicePopup />}
        </div>
    )
}

const ReloadServicePopup = () => {
    const setReloadPopupOpen = useSetAtom(ReloadPopupOpenAtom)
    const endpoint = useAtomValue(endPointAtom)

    const restart = () => {
        invoke('restart_service_command', { url: endpoint }).then(() => {
            setReloadPopupOpen(false)
        }).catch(e => {
            console.error(e)
        })
    }

    return (
        <div className='fixed left-0 right-0 bottom-3 '>
            <div className='w-full bottom-3 bg-primary-text px-10 py-5 drop-shadow-2xl max-w-3xl mx-auto flex justify-between rounded-lg items-center z-10'>
                <span className='text-primary-bg'>
                    Restart SMB service to apply the changes
                </span>
                <div>
                    <button
                        onClick={() => setReloadPopupOpen(false)}
                        className='text-center p-1 text-primary-bg rounded-md px-4'
                    >
                        cancel
                    </button>
                    <button
                        onClick={restart}
                        className='text-center p-1 bg-primary-bg text-primary-text rounded-md hover:scale-[1.02] transition-transform px-4'
                    >
                        Reload
                    </button>
                </div>
            </div>
        </div>
    )
}

const DropdownOpenAtom = atom(false)

export const DashboardHeader = ({ pageTitle }: DashboardLayoutProps) => {
    const [endpoint] = useAtom(endPointAtom)
    const [dropdownOpen, setDropdownOpen] = useAtom(DropdownOpenAtom)

    const dropdownRef = useClickOutisde(() => {
        setDropdownOpen(false)
    }) as Ref<HTMLDivElement>

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
                <div ref={dropdownRef} className='flex justify-center items-center mr-5 relative'>
                    <span className='text-primary-text cursor-pointer' onClick={() => setDropdownOpen(s => !s)}>
                        {endpoint}
                    </span>
                    {dropdownOpen && <HeaderDropdown />}
                </div>
                <ThemeSwitcher />
            </div>
        </div>
    )
}

const HeaderDropdown = () => {
    const setDropdownOpen = useSetAtom(DropdownOpenAtom)
    const endpoint = useAtomValue(endPointAtom)

    return (
        <div className='absolute top-12 w-60 rounded-md bg-secondary-bg drop-shadow-md overflow-hidden'>
            <Link href='/' onClick={() => setDropdownOpen(false)}>
                <div className='flex px-4 py-2 items-center gap-3 text-secondary-text cursor-pointer hover:text-primary-text transition-colors'>
                    <ArrowLeftOnRectangleIcon
                        width={20}
                        className='cursor-pointer'
                    />
                    Logout
                </div>
            </Link>
            <div
                onClick={() => invoke('restart_service_command', { url: endpoint }).catch(e => {
                    console.error(e)
                })}
                className='flex px-4 py-2 items-center gap-3 text-secondary-text cursor-pointer hover:text-primary-text transition-colors'
            >
                <ArrowPathIcon
                    width={20}
                    className='cursor-pointer'
                />
                Restart Service
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
