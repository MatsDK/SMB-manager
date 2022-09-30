import { atom } from 'jotai'

export type ConfigType =
    | {
        'global': Record<string, string>
    } & Record<string, any>
    | null

export const configAtom = atom({} as ConfigType)
export const GlobalConfigAtom = atom((get) => get(configAtom)?.['global'])
