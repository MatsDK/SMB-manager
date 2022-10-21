import bodyparser from 'body-parser'
import cors from 'cors'
import express from 'express'
import ini from 'ini'
import fs from 'node:fs'

const SMB_CONF_PATH = '/etc/samba/smb.conf'
;(async () => {
    const app = express()

    app.use(cors())
    app.use(bodyparser.json())
    app.use(bodyparser.urlencoded({ extended: true }))
    app.get('/conf', (req, res) => {
        if (!fs.existsSync(SMB_CONF_PATH)) {
            return
        }

        const rawConf = fs.readFileSync(SMB_CONF_PATH, 'utf-8')

        res.json(ini.parse(rawConf))
    })

    app.post('/set-conf', (req, res) => {
        if (!req.body?.conf) return res.send()
        const rawConf = fs.readFileSync(SMB_CONF_PATH, 'utf-8')

        try {
            const config = Object.entries(JSON.parse(req.body.conf)).map(([name, params]) => {
                return `[${name}]\n${buildParams(params as Record<string, string>)}`
            }).join('\n\n')

            console.log(config)

            fs.writeFileSync(SMB_CONF_PATH, config)

            res.send()
        } catch (e) {
            console.log(e)
            fs.writeFileSync(SMB_CONF_PATH, rawConf)
            return res.send()
        }
    })

    app.listen(3000, () => {
        console.log('Server is running')
    })
})()

const buildParams = (params: Record<string, string>) => {
    return Object.entries(params).filter(([name, value]) => !!name && !!value).map(([name, value]) => {
        return `  ${name}=${value}`
    }).join('\n')
}
