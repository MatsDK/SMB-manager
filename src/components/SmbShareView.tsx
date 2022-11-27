import { invoke } from '@tauri-apps/api/tauri'
import ini from 'ini'
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai'
import { Ref } from 'preact'
import PreactMarkdown from 'preact-markdown'
import { useRouter } from 'preact-router'
import { useEffect, useState } from 'preact/hooks'
import { sharedParams } from '../../get-docs/parsedConfParams.json'
import { useClickOutisde } from '../hooks/useClickOutside'
import { Button } from '../ui/Button'
import { buildConfig } from '../utils/buildConfigFile'
import { compareFields } from '../utils/compareFields'
import { invokeCommand } from '../utils/invokeCommand'
import { configAtom, ConfigType, ReloadPopupOpenAtom, SmbSharesAtom } from '../utils/store'
import { DashboardLayout, endPointAtom } from './DashboardView'
import { SaveChangesPopup } from './SaveChangesPopup'
const Markdown = PreactMarkdown as any

const ShareParamKeys = Object.keys(sharedParams)
type ShareParamKeys = keyof typeof sharedParams

const ConnectDropdownOpenAtom = atom(false)

export const SmbShareView = ({}) => {
    const smbShares = useAtomValue(SmbSharesAtom)
    const [config, setConfig] = useAtom(configAtom)
    const endpoint = useAtomValue(endPointAtom)
    const setReloadPopupOpen = useSetAtom(ReloadPopupOpenAtom)
    const [route] = useRouter()

    const [currShare, setCurrShare] = useState<Record<string, string>>(null!)
    const [editedFields, setEditedFields] = useState<Record<string, string>>({})
    const [hasChanged, setHasChanged] = useState(false)
    const [connectDropdownOpen, setConnectDropdownOpen] = useAtom(ConnectDropdownOpenAtom)

    const connectDropdownRef = useClickOutisde(() => {
        setConnectDropdownOpen(false)
    }) as Ref<HTMLDivElement>

    useEffect(() => {
        if (!route?.matches?.name) return

        const share = smbShares.find(([name]) => name === route.matches!.name)
        if (share) setCurrShare(share[1])
    }, [route, smbShares])

    useEffect(() => {
        setHasChanged(compareFields(currShare, editedFields))
    }, [editedFields, currShare])

    const onSave = () => {
        if (!route?.matches?.name) return
        const name = route.matches.name

        const newConfig = {
            ...config,
            [name]: {
                ...currShare,
                ...editedFields,
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
                console.error('Error while parsing config', e)
            }
        })
    }

    const deleteShare = () => {
        if (!route?.matches?.name) return
        const name = route.matches.name

        const newConfig = {
            ...config,
        } as ConfigType
        delete newConfig![name]

        invokeCommand('set_conf', { url: endpoint, conf: buildConfig(newConfig) }).then(res => {
            if (!res) return
            try {
                const parsedConf = ini.parse(res) as ConfigType

                if (parsedConf) {
                    setConfig(parsedConf)
                    setReloadPopupOpen(true)
                    window.location.href = `/dashboard?e=${endpoint}`
                }
            } catch (e) {
                console.error('Error while parsing config', e)
            }
        })
    }

    const connect = (e: any) => {
        e.preventDefault()
        if (!route.matches?.name) return

        const drive: string = e.currentTarget?.elements?.['drive']?.value.trim().toUpperCase()

        let ip = endpoint.split(':')[0]
        let shareEndpoint = `\\\\${ip}\\${route.matches.name}`
        if (drive) invokeCommand('connect_share', { drive, endpoint: shareEndpoint })
    }

    return (
        <DashboardLayout pageTitle={`[${route?.matches?.name}]`}>
            {hasChanged && (
                <SaveChangesPopup
                    message={`Save changes in [${route.matches?.name}]`}
                    onSave={onSave}
                />
            )}
            {currShare && (
                <div>
                    <div className='flex justify-end'>
                        <div ref={connectDropdownRef} className='flex justify-center items-center mr-5 relative'>
                            <span
                                className='text-primary-text cursor-pointer'
                                onClick={() => setConnectDropdownOpen(s => !s)}
                            >
                                Connect
                            </span>
                            {connectDropdownOpen && (
                                <div className='absolute top-8 bg-secondary-bg drop-shadow-md rounded-md overflow-hidden px-4 py-2 flex items-center'>
                                    <span className='text-primary-text whitespace-nowrap font-semibold'>Mount to:</span>
                                    <form onSubmit={connect}>
                                        <input
                                            name='drive'
                                            type='text'
                                            className='bg-primary-bg text-primary-text border border-secondary-bg px-2 py-1 text-md outline-none rounded-md'
                                            placeholder='drive letter'
                                        />
                                    </form>
                                </div>
                            )}
                        </div>
                        <Button
                            onClick={deleteShare}
                            className='w-fit px-5'
                        >
                            Delete
                        </Button>
                    </div>
                    {ShareParamKeys.map((paramName) => {
                        if (!paramName) return
                        const value = currShare[paramName]

                        return (
                            <ConfigParam
                                key={paramName}
                                name={paramName as ShareParamKeys}
                                value={value}
                                onChange={(newVal) => setEditedFields(fields => ({ ...fields, [paramName]: newVal }))}
                            />
                        )
                    })}
                </div>
            )}
        </DashboardLayout>
    )
}

interface ConfigParamProps {
    value: string
    name: ShareParamKeys
    onChange: (newVal: string) => void
}

const ConfigParam = ({ name, value, onChange }: ConfigParamProps) => {
    const docs = sharedParams[name]
    return (
        <div className='my-4 py-2'>
            <div className='flex mb-4'>
                <span className='flex-1 font-medium text-primary-text text-lg'>{name}</span>
                <div className='flex-1'>
                    <input
                        placeholder={`Default: ${(docs as any).default}`}
                        className='rounded-md bg-secondary-bg py-1 px-3 text-primary-text'
                        type='text'
                        defaultValue={value}
                        title={(docs as any).default}
                        onChange={(e) => onChange(e.currentTarget.value)}
                    />
                </div>
            </div>

            <div className='text-secondary-text'>
                <Markdown markdown={docs.md} />
            </div>
        </div>
    )
}
