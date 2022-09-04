export const ThemeSwitcher = () => {
    const setTheme = (theme: string) => {
        const html = document.querySelector('html')
        html && (html.dataset.theme = theme)
    }

    return (
        <div>
            <button className='text-primary-text' onClick={() => setTheme('dark')}>set dark theme</button>
            <button className='text-primary-text' onClick={() => setTheme('light')}>set light theme</button>
        </div>
    )
}
