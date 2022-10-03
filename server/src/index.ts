import cors from 'cors'
import express from 'express'
import ini from 'ini'
import fs from 'node:fs'
import bodyparser from "body-parser"

const SMB_CONF_PATH = '/etc/samba/smb.conf'
    ; (async () => {
        const app = express()

        app.use(cors())
        app.use(bodyparser.json())
        app.use(bodyparser.urlencoded({ extended: true }))
        app.get('get-conf', (req, res) => {
            if (!fs.existsSync(SMB_CONF_PATH)) {
                return
            }

            const rawConf = fs.readFileSync(SMB_CONF_PATH, 'utf-8')

            res.json(ini.parse(rawConf))
        })

        app.post('/set-conf', (req, res) => {
            if (!req.body?.conf) return res.send()

            console.log(req.body?.conf);

            res.send()
        })

        app.listen(3000, () => {
            console.log('Server is running')
        })
    })()
