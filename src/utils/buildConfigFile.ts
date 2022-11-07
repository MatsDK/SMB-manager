import { ConfigType } from './store'

type Conf = Record<string, string>

export const buildConfig = (conf: ConfigType) =>
    conf
        ? Object.entries(conf).map(([name, params]) => {
            return `[${name}]\n${buildParams(params as Conf)}`
        }).join('\n\n')
        : ''

const buildParams = (params: Conf) =>
    Object.entries(params).filter(([name, value]) => !!name && !!value).map(([name, value]) => {
        return `  ${name}=${value}`
    }).join('\n')
