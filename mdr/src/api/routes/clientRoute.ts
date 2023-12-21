import config from '../../../config'
import { Container } from 'typedi'
import { Router } from 'express'
import { celebrate, Joi } from 'celebrate'

import middlewares from '../middlewares'
import IClientController from '../../controllers/IControllers/IClientController'

const route = Router()

export default (app: Router) => {
    app.use('/clients', route)

    const ctrl = Container.get(config.controllers.client.name) as IClientController

    route.post(
        '',
        celebrate({
            body: Joi.object({
                name: Joi.string().required(),
                email: Joi.string().required(),
                phoneNumber: Joi.number().integer().required(),
                vatNumber: Joi.number().integer().required(),
                password: Joi.string().required(),
            }),
        }),
        (req, res, next) => ctrl.createClient(req, res, next),
    )
}