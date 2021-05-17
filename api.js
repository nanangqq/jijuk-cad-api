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

api.post('/land', async ctx => {
    const { lat, lng } = ctx.request.body
    const res = await executeQ(
        `select st_asgeojson(geometry)::jsonb, "A1" as pnu from seoul_jijuk_0501_4326 
        where st_intersects(geometry, st_pointfromtext('POINT (${lng} ${lat})', 4326))`
    )
    // console.log(res.rows)
    // ctx.body = res.rows.map(row => row.st_asgeojson)
    ctx.body = res.rows
})

api.get('/save', async ctx => {
    const pnus = ['1168010600109450010', '1168010600109480000']
    const res = await Axios.post(
        'http://172.17.0.5:4000/python/jjcadpy?name=1',
        pnus
    )
    // console.log(res.data)
    ctx.body = res.data
})

export default api
