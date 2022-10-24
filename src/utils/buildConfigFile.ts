import { ConfigType } from './store'

export const buildConfig = (conf: ConfigType) => {
    if (!conf) return ''

    const config = Object.entries(conf).map(([name, params]) => {
        return `[${name}]\n${buildParams(params as Record<string, string>)}`
    }).join('\n\n')

    return config
}

const buildParams = (params: Record<string, string>) => {
    return Object.entries(params).filter(([name, value]) => !!name && !!value).map(([name, value]) => {
        return `  ${name}=${value}`
    }).join('\n')
}
