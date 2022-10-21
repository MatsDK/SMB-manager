import { useEffect, useRef } from 'preact/hooks'

export const useClickOutisde = (cb: () => void) => {
    const ref = useRef<HTMLElement>()

    useEffect(() => {
        const handleClickOutside = (event: Event) => {
            if (ref.current && !ref.current?.contains(event.target as Node)) {
                cb()
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [ref])

    return ref
}
