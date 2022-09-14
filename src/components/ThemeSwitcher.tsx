import { SunIcon, MoonIcon } from "@heroicons/react/24/outline"
import { useEffect, useState } from "preact/hooks"



export const ThemeSwitcher = () => {
    const [theme, setTheme] = useState<'light' | 'dark'>(null!)

    useEffect(() => {
        const html = document.querySelector('html')
        html && (html.dataset.theme = theme)
    }, [theme])

    useEffect(() => {
        const html = document.querySelector('html')

        console.log(html?.classList);
        if (html?.classList.contains('dark'))
            setTheme('dark')
        else setTheme('light')
    }, [])

    return (
        <div className='flex items-center'>
            {theme === 'light' ? (
                <button className='text-primary-text' onClick={() => setTheme('dark')}>
                    <MoonIcon
                        width={20}
                    />
                </button>
            ) : (
                <button className='text-primary-text' onClick={() => setTheme('light')}>
                    <SunIcon
                        width={20}
                    />
                </button>
            )}
        </div >
    )
}
