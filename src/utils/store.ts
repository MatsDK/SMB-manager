import { atom } from 'jotai'

export type GlobalConfigType = Record<string, string>
export type ConfigType =
    | {
        'global': GlobalConfigType
    } & Record<string, any>
    | null

export const configAtom = atom({} as ConfigType)
export const GlobalConfigAtom = atom((get) => get(configAtom)?.['global'])

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

const compareFields = (initial: GlobalConfigType, newFields: GlobalConfigType) =>
    Object.entries(newFields).some(
        ([name, value]) => value !== (initial[name] || ''),
    )
