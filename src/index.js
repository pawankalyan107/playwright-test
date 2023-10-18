import express from 'express'
import routesV1 from './routes/routesV1.js'

const app = express()
const port = 3000
const router = routesV1()

app.use(express.json())

app.use('/v1', router)

app.listen(port, () => {
  console.log('server is up on port ' + port)
})