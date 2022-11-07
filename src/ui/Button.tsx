import type { ComponentChildren } from 'preact'

interface ButtonProps {
    children: ComponentChildren
    typeSubmit?: boolean
    className?: string
    onClick?: () => void
}

export const Button = ({ children, onClick, typeSubmit = false, className = '' }: ButtonProps) => {
    return (
        <button
            onClick={onClick}
            type={typeSubmit ? 'submit' : ''}
            className={`text-center py-1 px-5 bg-primary-text text-primary-bg rounded-md hover:scale-[1.02] transition-transform ${className}`}
        >
            {children}
        </button>
    )
}

export const ButtonInverted = ({ children, onClick, typeSubmit = false, className = '' }: ButtonProps) => {
    return (
        <button
            onClick={onClick}
            type={typeSubmit ? 'submit' : ''}
            className={`text-center py-1 px-5 bg-primary-bg text-primary-text rounded-md hover:scale-[1.02] transition-transform ${className}`}
        >
            {children}
        </button>
    )
}
