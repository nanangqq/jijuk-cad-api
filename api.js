import Router from 'koa-router'
import { executeQ } from './util'
import Axios from 'axios'

const api = new Router()

api.get('/test', async ctx => {
    const res = await executeQ(
        'select st_asgeojson(st_transform(geometry, 5186)) from seoul_jijuk_0501_4326 limit 1'
    )
    // console.log(res.rows)
    ctx.body = res.rows
})

export default api
