import cors from 'cors'
import express from 'express'
import ini from "ini"
import fs from "node:fs"

const SMB_CONF_PATH = '/etc/samba/smb.conf';

; (async () => {
    const app = express()


    app.use(cors())
    app.get('/conf', (req, res) => {
        if (!fs.existsSync(SMB_CONF_PATH)) {
            return
        }

        const rawConf = fs.readFileSync(SMB_CONF_PATH, 'utf-8')

        console.log(ini.parse(rawConf))
        res.json(ini.parse(rawConf))
    })

    app.listen(3000, () => {
        console.log('Server is running')
    })
})()
