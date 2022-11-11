import { invoke } from '@tauri-apps/api/tauri'

type URLInput = { url: string }
type Commands = {
    'get_conf': { input: URLInput; output: string }
    'set_conf': { input: URLInput & { conf: string }; output: string }
    'restart_service': { input: URLInput; output: never }
    'get_service_status': { input: URLInput; output: boolean }
}

export const invokeCommand = async <
    TName extends keyof Commands,
    TOutput = Commands[TName]['output'],
>(name: TName, input: Commands[TName]['input']): Promise<TOutput | undefined> => {
    try {
        const res = await invoke(name, input)
        return res as TOutput
    } catch (error) {
        console.error(error)
    }
}
