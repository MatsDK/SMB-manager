import { atom, useAtom, useAtomValue } from 'jotai'
import { Link } from 'preact-router'
import { useCallback } from 'preact/hooks'
import { ThemeSwitcher } from './ThemeSwitcher'

export const HomeView = () => {
    return (
        <div className='bg-primary-bg transition-colors '>
            <div className='max-w-5xl px-6 mx-auto flex flex-col overflow-auto'>
                <Header />
                <ConnectToServerForm />
                <RecentConnections />
            </div>
        </div>
    )
}

const Header = () => {
    return (
        <div className='flex justify-between fixed w-screen inset-0 px-12 py-5 h-fit z-10'>
            <h1 className='text-[40px] font-semibold text-primary-text'>Home</h1>
            <ThemeSwitcher />
        </div>
    )
}

const EndpointInputAtom = atom('')

const ConnectToServerForm = () => {
    const [endpointInput, setEndpointInput] = useAtom(EndpointInputAtom)

    const scrollToRecentConnections = () => {
        const el = document.querySelector('#recent')
        el?.scrollIntoView({ behavior: 'smooth' })
    }

    const submit = useCallback((e: Event) => {
        e.preventDefault()
        if (!endpointInput) return

        saveRecentConnections(endpointInput)
        window.location.href = `/dashboard?e=${endpointInput}`
    }, [endpointInput])

    return (
        <section className='w-full h-screen grid place-items-center relative'>
            <div className='w-96 p-4 flex flex-col'>
                <div className='mb-5'>
                    <h3 className='text-2xl font-medium text-primary-text '>Connect to server</h3>
                    <p className='text-sm text-secondary-text'>Connect to any device running a server, smb service</p>
                </div>
                <form onSubmit={submit}>
                    <div className='flex flex-col py-1'>
                        <p className='text-primary-text text-lg font-medium'>Endpoint</p>
                        <input
                            value={endpointInput}
                            onChange={(e) => setEndpointInput(e.currentTarget.value)}
                            type='text'
                            className='bg-primary-bg text-primary-text border border-secondary-bg px-2 py-1 text-lg outline-none rounded-md'
                            placeholder='0.0.0.0:3000'
                        />
                    </div>
                    <button type='submit' className='w-full'>
                        <p className='text-center p-1 bg-primary-text text-primary-bg w-full mt-5 rounded-md hover:scale-[1.02] transition-transform'>
                            Connect
                        </p>
                    </button>
                </form>
                <div onClick={scrollToRecentConnections} className='text-center text-secondary-text cursor-pointer'>
                    Recent connections
                </div>
            </div>
        </section>
    )
}

const getRecentConnections = (): string[] => {
    if (localStorage.getItem('recent-connections')) {
        const items = JSON.parse(localStorage.getItem('recent-connections')!)
        if (!Array.isArray(items)) return []

        return items
    }

    return []
}

const RecentConnectionsAtom = atom(() => getRecentConnections())

const RecentConnections = () => {
    const recentConnections = useAtomValue(RecentConnectionsAtom)

    return (
        <section id='recent' className='h-screen flex flex-col items-center pt-32'>
            <h3 className='text-2xl font-medium text-primary-text '>Recent connections</h3>
            <ul className='w-full flex flex-col items-center gap-5 mt-20'>
                {recentConnections.map((name) => (
                    <li
                        key={name}
                        className='bg-secondary-bg w-3/4 text-primary-text flex items-center px-5 py-3 justify-between rounded-md font-medium'
                    >
                        {name}
                        <Link href={`/dashboard?e=${name}`} onClick={() => saveRecentConnections(name)}>
                            <p className='text-center p-1 bg-primary-text text-primary-bg rounded-md hover:scale-[1.02] transition-transform px-10'>
                                Connect
                            </p>
                        </Link>
                    </li>
                ))}
            </ul>
        </section>
    )
}

const saveRecentConnections = (lastConnectionEndpoint: string) => {
    let recentConnections = getRecentConnections()
    recentConnections = Array.from(new Set([lastConnectionEndpoint, ...recentConnections]))

    localStorage.setItem('recent-connections', JSON.stringify(recentConnections))
}
