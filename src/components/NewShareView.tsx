import ini from 'ini'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { Button } from '../ui/Button'
import { buildConfig } from '../utils/buildConfigFile'
import { invokeCommand } from '../utils/invokeCommand'
import { configAtom, ConfigType, ReloadPopupOpenAtom } from '../utils/store'
import { DashboardLayout, endPointAtom } from './DashboardView'

export const NewShareView = () => {
    const [config, setConfig] = useAtom(configAtom)
    const endpoint = useAtomValue(endPointAtom)
    const setReloadPopupOpen = useSetAtom(ReloadPopupOpenAtom)

    const createShare = (e: any) => {
        e.preventDefault()

        const path = e.target.path.value.trim()
        const name = e.target.name.value.trim()
        if (!name || !path || !config) return
        if (name in config) return alert(`'${name}' already exists`)

        const newConfig = {
            ...config,
            [name]: {
                path,
            },
        } as ConfigType

        invokeCommand('set_conf', { url: endpoint, conf: buildConfig(newConfig) }).then(res => {
            if (!res) return

            try {
                const parsedConf = ini.parse(res) as ConfigType

                if (parsedConf) {
                    setConfig(parsedConf)
                    setReloadPopupOpen(true)
                }
            } catch (e) {
                console.error('Eror while parsing config', e)
            }
        })
    }

    return (
        <DashboardLayout pageTitle={`New Share`}>
            <div className='flex items-center justify-center flex-1'>
                <div className='flex flex-col w-96'>
                    <form onSubmit={createShare}>
                        <div className='flex flex-col py-1'>
                            <p className='text-primary-text text-lg font-medium'>Share name</p>
                            <input
                                name='name'
                                type='text'
                                className='bg-primary-bg text-primary-text border border-secondary-bg px-2 py-1 text-lg outline-none rounded-md'
                                placeholder='Share name'
                            />
                        </div>
                        <div className='flex flex-col py-1'>
                            <p className='text-primary-text text-lg font-medium'>Path</p>
                            <input
                                name='path'
                                type='text'
                                className='bg-primary-bg text-primary-text border border-secondary-bg px-2 py-1 text-lg outline-none rounded-md'
                                placeholder='/home/user'
                            />
                        </div>

                        <Button typeSubmit className='w-full mt-5'>
                            Create new share
                        </Button>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    )
}
