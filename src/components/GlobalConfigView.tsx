import { useAtom } from 'jotai'
import { globalParams } from '../../get-docs/parsedConfParams.json'
import { GlobalConfigAtom } from '../utils/store'
import { DashboardLayout } from './DashboardView'
import PreactMarkdown from 'preact-markdown'

const Markdown = PreactMarkdown as any

const GlobalParamsKeys = Object.keys(globalParams)
type GlobalDocsKeys = keyof typeof globalParams

export const GlobalConfigView = () => {
    const [globalConfig] = useAtom(GlobalConfigAtom)
    if (!globalConfig) return null

    return (
        <DashboardLayout>
            {GlobalParamsKeys.map((paramName) => {
                if (!paramName) return
                const value = globalConfig[paramName]

                return (
                    <ConfigParam
                        key={paramName}
                        value={value}
                        name={paramName as GlobalDocsKeys}
                    />
                )
            })}
        </DashboardLayout>
    )
}

interface ConfigParamProps {
    name: GlobalDocsKeys
    value: string | undefined
}

const ConfigParam = ({ name, value }: ConfigParamProps) => {
    const docs = globalParams[name]
    return (
        <div className="my-4 py-2">
            <div className='flex mb-4'>
                <span className="flex-1 font-medium text-primary-text text-lg">{name}</span>
                <div className="flex-1">
                    <input
                        placeholder={`Default: ${(docs as any).default}`}
                        className="rounded-md bg-secondary-bg py-1 px-3 text-primary-text"
                        type="text"
                        value={value}
                        title={(docs as any).default}
                    />
                </div>
            </div>


            <div className="text-secondary-text">
                <Markdown markdown={docs.md} />
            </div>
        </div>
    )
}
