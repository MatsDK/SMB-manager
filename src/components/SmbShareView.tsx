import { invoke } from '@tauri-apps/api/tauri'
import ini from 'ini'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import PreactMarkdown from 'preact-markdown'
import { useRouter } from 'preact-router'
import { useEffect, useState } from 'preact/hooks'
import { sharedParams } from '../../get-docs/parsedConfParams.json'
import { buildConfig } from '../utils/buildConfigFile'
import { compareFields } from '../utils/compareFields'
import { configAtom, ConfigType, ReloadPopupOpenAtom, SmbSharesAtom } from '../utils/store'
import { DashboardLayout, endPointAtom } from './DashboardView'
import { SaveChangesPopup } from './SaveChangesPopup'
const Markdown = PreactMarkdown as any

const ShareParamKeys = Object.keys(sharedParams)
type ShareParamKeys = keyof typeof sharedParams

export const SmbShareView = ({}) => {
    const smbShares = useAtomValue(SmbSharesAtom)
    const [config, setConfig] = useAtom(configAtom)
    const endpoint = useAtomValue(endPointAtom)
    const setReloadPopupOpen = useSetAtom(ReloadPopupOpenAtom)
    const [route] = useRouter()

    const [currShare, setCurrShare] = useState<Record<string, string>>(null!)
    const [editedFields, setEditedFields] = useState<Record<string, string>>({})
    const [hasChanged, setHasChanged] = useState(false)

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

        invoke('set_conf_command', { conf: buildConfig(newConfig), url: endpoint }).then((res) => {
            try {
                res = ini.parse(res as string)

                if (res) {
                    setConfig(res as ConfigType)
                    setReloadPopupOpen(true)
                }
            } catch (e) {}
        }).catch(e => {
            console.error(e)
        })
    }

    const deleteShare = () => {
        if (!route?.matches?.name) return
        const name = route.matches.name

        const newConfig = {
            ...config,
        } as ConfigType
        delete newConfig![name]

        invoke('set_conf_command', { conf: buildConfig(newConfig), url: endpoint }).then((res) => {
            try {
                res = ini.parse(res as string)

                if (res) {
                    setConfig(res as ConfigType)
                    setReloadPopupOpen(true)
                    window.location.href = `/dashboard?e=${endpoint}`
                }
            } catch (e) {}
        }).catch(e => {
            console.error(e)
        })
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
                        <button
                            className='text-center p-1 bg-primary-text text-primary-bg mt-5 rounded-md hover:scale-[1.02] transition-transform px-5'
                            onClick={deleteShare}
                        >
                            Delete
                        </button>
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
