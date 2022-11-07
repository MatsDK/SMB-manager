import { MoonIcon, SunIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'preact/hooks'

export const ThemeSwitcher = () => {
    const [theme, setTheme] = useState(() => {
        if (typeof localStorage !== 'undefined' && localStorage.getItem('theme')) {
            return localStorage.getItem('theme')!
        }

        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark'
        }

        return 'light'
    })

    const updateTheme = (newTheme: string) => {
        if (theme === newTheme) return

        localStorage.setItem('theme', newTheme)
        setTheme(newTheme)
    }

    useEffect(() => {
        const root = document.documentElement
        root.dataset.theme = theme
    }, [theme])

    return (
        <div className='flex items-center'>
            {theme === 'light'
                ? (
                    <button className='text-primary-text' onClick={() => updateTheme('dark')}>
                        <MoonIcon
                            width={20}
                        />
                    </button>
                )
                : (
                    <button className='text-primary-text' onClick={() => updateTheme('light')}>
                        <SunIcon
                            width={20}
                        />
                    </button>
                )}
        </div>
    )
}
