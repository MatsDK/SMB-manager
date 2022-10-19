import { atom } from 'jotai'
import { compareFields } from './compareFields'

export type GlobalConfigType = Record<string, string>
export type ConfigType =
    | {
        'global': GlobalConfigType
    } & Record<string, any>
    | null
export type SmbSharesType = Array<[string, Record<string, string>]>

export const configAtom = atom({} as ConfigType)
export const GlobalConfigAtom = atom((get) => get(configAtom)?.['global'])
export const SmbSharesAtom = atom((get) => {
    const conf = get(configAtom)

    return Object.entries(conf || {})
        .filter(([name]) => !['global', 'printers'].includes(name)) as SmbSharesType
})

export const changedGlobalFields = atom({} as GlobalConfigType)
export const globalChangedAtom = atom(false)

export const editGlobalConfigAtom = atom(
    null,
    (get, set, update: (prev: GlobalConfigType) => GlobalConfigType) => {
        const newVal = update(get(changedGlobalFields))
        const hasChanged = compareFields(get(GlobalConfigAtom) || {}, newVal)
        set(globalChangedAtom, hasChanged)
        set(changedGlobalFields, newVal)
    },
)
