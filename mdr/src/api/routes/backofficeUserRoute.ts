import config from '../../../config'
import { Container } from 'typedi'
import { Router } from 'express'
import { celebrate, Joi } from 'celebrate'

import middlewares from '../middlewares'
import IBackofficeUserController from '../../controllers/IControllers/IBackofficeUserController'

const route = Router()

export default (app: Router) => {
    app.use('/backofficeusers', route)

    const ctrl = Container.get(
        config.controllers.backofficeUser.name,
    ) as IBackofficeUserController

    route.post(
        '',
        celebrate({
            body: Joi.object({
                name: Joi.string().required(),
                email: Joi.string().required(),
                phoneNumber: Joi.number()
                    .integer()
                    .required(),
                password: Joi.string().required(),
            }),
        }),
        (req, res, next) => ctrl.createBackofficeUser(req, res, next),
    )
}