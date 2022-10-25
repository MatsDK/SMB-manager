import { invoke } from '@tauri-apps/api/tauri'
import ini from 'ini'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import PreactMarkdown from 'preact-markdown'
import { globalParams } from '../../get-docs/parsedConfParams.json'
import { buildConfig } from '../utils/buildConfigFile'
import {
    changedGlobalFields,
    configAtom,
    ConfigType,
    editGlobalConfigAtom,
    globalChangedAtom,
    GlobalConfigAtom,
    ReloadPopupOpenAtom,
} from '../utils/store'
import { DashboardLayout, endPointAtom } from './DashboardView'
import { SaveChangesPopup } from './SaveChangesPopup'

const Markdown = PreactMarkdown as any

const GlobalParamsKeys = Object.keys(globalParams)
type GlobalDocsKeys = keyof typeof globalParams

export const GlobalConfigView = () => {
    const endpoint = useAtomValue(endPointAtom)

    const [config, setConfig] = useAtom(configAtom)
    const globalConfig = useAtomValue(GlobalConfigAtom)
    const hasChanged = useAtomValue(globalChangedAtom)
    const changedValues = useAtomValue(changedGlobalFields)
    const setGlobalConfig = useSetAtom(editGlobalConfigAtom)
    const setReloadPopupOpen = useSetAtom(ReloadPopupOpenAtom)
    if (!globalConfig) return null

    const onSave = () => {
        const newConfig: ConfigType = {
            ...config,
            global: {
                ...globalConfig,
                ...changedValues,
            },
        }

        invoke('set_conf_command', { conf: buildConfig(newConfig), url: endpoint }).then(res => {
            try {
                res = ini.parse(res as string)

                if (res) {
                    setConfig(res as ConfigType)
                    setGlobalConfig(() => ({}))
                    setReloadPopupOpen(true)
                }
            } catch {}
        }).catch(e => {
            console.error(e)
        })
    }

    return (
        <DashboardLayout pageTitle='Global'>
            {hasChanged && (
                <SaveChangesPopup
                    message='Save changes in Global config'
                    onSave={onSave}
                />
            )}
            {GlobalParamsKeys.map((paramName) => {
                if (!paramName) return
                const value = globalConfig[paramName]

                return (
                    <ConfigParam
                        key={paramName}
                        value={value || ''}
                        name={paramName as GlobalDocsKeys}
                    />
                )
            })}
        </DashboardLayout>
    )
}

interface ConfigParamProps {
    name: GlobalDocsKeys
    value: string
}

const ConfigParam = ({ name, value }: ConfigParamProps) => {
    const docs = globalParams[name]
    const setGlobalConfig = useSetAtom(editGlobalConfigAtom)

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
                        onChange={(e) =>
                            setGlobalConfig(prev => {
                                prev[name] = e.currentTarget.value
                                return prev
                            })}
                    />
                </div>
            </div>

            <div className='text-secondary-text'>
                <Markdown markdown={docs.md} />
            </div>
        </div>
    )
}
