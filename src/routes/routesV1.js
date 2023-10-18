import express from 'express'
import { getArnDetails } from "../service/get-arn-details.js";

const routesV1 = () => {
    const router = new express.Router()

    router.get(
        '/arn/:id',
        async (req, res) => {
            try {
                const _id = req.params.id
                if (_id){
                    const myArn = await getArnDetails(_id)
                    res.status(200).send(myArn)
                    console.log(myArn)
                }
            } catch (error) {
                res.status(404).send()
            }
        }
    )

    return router
}

export default routesV1