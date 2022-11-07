import { ButtonInverted } from '../ui/Button'

interface SaveChangesPopupProps {
    message: string
    onSave: () => void
}

export const SaveChangesPopup = ({ message, onSave }: SaveChangesPopupProps) => {
    return (
        <div className='fixed left-0 right-0 bottom-3 '>
            <div className='w-full bottom-3 bg-primary-text px-10 py-5 drop-shadow-2xl max-w-3xl mx-auto flex justify-between rounded-lg items-center'>
                <span className='text-primary-bg font-semibold'>{message}</span>
                <ButtonInverted
                    className='text-center p-1 bg-primary-bg text-primary-text rounded-md hover:scale-[1.02] transition-transform px-4'
                    onClick={onSave}
                >
                    Save changes
                </ButtonInverted>
            </div>
        </div>
    )
}
