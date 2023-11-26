import express from 'express'
import { getArnDetails } from "../service/get-arn-details.js";

const routesV1 = () => {
  const router = new express.Router()

  router.get(
    '/arn/:id',
    (req, res) => {
      try {
        const _id = req.params.id
        const cityname = `${_id}`.toUpperCase()
        console.log(_id)
        if (_id) {
          getArnDetails(_id).then((resp)=> console.log('resp arrived'))
          
          res.send(`<h1>check at:::: ${cityname}.json</h1>`)
        }
      } catch (error) {
        res.status(404).send()
      }
    }
  )
  return router
}

export default routesV1