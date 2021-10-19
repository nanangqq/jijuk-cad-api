import Router from 'koa-router'
import Axios from 'axios'

import { executeQ } from './util'
import np_addr from './np_addr'

const api = new Router()

api.post('/map', async ctx => {
    // console.log(ctx.request.body)
    // ctx.body = 'map'
    const { parts, min, max } = ctx.request.body
    const z = parts[0]
    const x = parts[1]
    const y = parts[2].split('@')[0]
    const imgLocation = parts.join('/')
    const res = await executeQ(`
insert into mapbox_satellite values('${imgLocation}', ${z}, ${x}, ${y}, '${JSON.stringify(
        min
    )}'::jsonb, '${JSON.stringify(
        max
    )}'::jsonb) ON CONFLICT (img_location) DO NOTHING;
`)
    ctx.body = res
})

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
        `select 
            st_asgeojson(geometry)::jsonb,
            "A1" as pnu,
            st_transform(st_pointonsurface(geometry), 5186) as center_point
        from seoul_jijuk_0501_4326 
        where st_intersects(geometry, st_pointfromtext('POINT (${lng} ${lat})', 4326))`
    )
    // console.log(res.rows)
    // ctx.body = res.rows.map(row => row.st_asgeojson)
    ctx.body = res.rows
})

api.post('/download', async ctx => {
    // const pnus = ['1168010600109450010', '1168010600109480000']
    const pnus = ctx.request.body
    const res = await Axios.post(
        `http://${np_addr}:4000/python/jjcadpy?name=1`,
        pnus
    )
    console.log(res.data)
    ctx.body = res.data
})

export default api
