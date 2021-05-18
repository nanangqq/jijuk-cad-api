import Koa from 'koa'
import os from 'os'
import { exec } from 'child_process'
import Router from 'koa-router'
import mount from 'koa-mount'
import serve from 'koa-static'
import bodyParser from 'koa-bodyparser'

import api from './api'

const startServer = async () => {
    const app = new Koa()
    const router = new Router()
    app.use(bodyParser())
    router.use('/api', api.routes())

    const PORT = process.env.PORT || 8000

    let HOSTNAME
    if (os.platform() == 'linux') {
        HOSTNAME = await exec('hostname -i', (error, stdout, stderr) => {
            if (!error & !stderr) {
                console.log('host: %s', stdout)
            } else {
                console.log(error, stderr)
            }
        })
    } else {
        HOSTNAME = 'localhost'
    }

    const static_pages = new Koa()
    static_pages.use(serve('../jijuk-cad/build'))

    const files = new Koa()
    files.use(serve('../out'))

    app.use(mount('/', static_pages))
        .use(mount('/jj_out/', files))
        .use(router.routes())

    app.listen(PORT, HOSTNAME, () => {
        console.log('==> 🌎  Listening on port %s.', PORT)
    })
}

startServer()
