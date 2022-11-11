import { ArrowDownTrayIcon, ArrowLeftOnRectangleIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
import { invoke } from '@tauri-apps/api'
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai'
import { h, Ref } from 'preact'
import { Link } from 'preact-router'
import { useClickOutisde } from '../hooks/useClickOutside'
import { ThemeSwitcher } from '../ui/ThemeSwitcher'
import { invokeCommand } from '../utils/invokeCommand'
import { DashboardLayoutProps, endPointAtom } from './DashboardView'

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
                onClick={() => invokeCommand('restart_service', { url: endpoint })}
                className='flex px-4 py-2 items-center gap-3 text-secondary-text cursor-pointer hover:text-primary-text transition-colors'
            >
                <ArrowPathIcon
                    width={20}
                    className='cursor-pointer'
                />
                Restart Service
            </div>
            <div
                onClick={() => {
                    invokeCommand('get_conf', { url: endpoint }).then(res => {
                        try {
                            navigator.clipboard.writeText(res as string)
                        } catch (e) {}
                    })
                }}
                className='flex px-4 py-2 items-center gap-3 text-secondary-text cursor-pointer hover:text-primary-text transition-colors'
            >
                <ArrowDownTrayIcon
                    width={20}
                    className='cursor-pointer'
                />
                Copy Raw Config
            </div>
        </div>
    )
}
