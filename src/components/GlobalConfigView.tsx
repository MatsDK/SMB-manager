import { useAtom } from 'jotai'
import { globalParams } from '../../get-docs/parsedConfParams.json'
import { GlobalConfigAtom } from '../utils/store'
import { DashboardLayout } from './DashboardView'

const GlobalParamsKeys = Object.keys(globalParams)
type GlobalDocsKeys = keyof typeof globalParams

export const GlobalConfigView = () => {
    const [globalConfig] = useAtom(GlobalConfigAtom)
    if (!globalConfig) return null

    return (
        <DashboardLayout>
            {Object.entries(globalConfig).map(([name, value]) => {
                if (!name) return
                const docs = globalParams[name as GlobalDocsKeys]

                return (
                    <div className='flex-col'>
                        <div>
                            <span>{name}:</span>
                            <span>{value}</span>
                        </div>

                        <span className='text-secondary-text'>{docs?.md}</span>
                    </div>
                )
            })}
        </DashboardLayout>
    )
}
