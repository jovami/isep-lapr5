import config from '../../../config'
import { Container } from 'typedi'
import { Router } from 'express'
import { celebrate, Joi } from 'celebrate'

import IRobotController from '../../controllers/IControllers/IRobotController'
import middlewares from '../middlewares'

const route = Router()

export default (app: Router) => {
    app.use('/robots', route)

    const ctrl = Container.get(config.controllers.robot.name) as IRobotController

    route.post(
        '',
        celebrate({
            body: Joi.object({
                code: Joi.string().required(),
                nickname: Joi.string().required(),
                typeCode: Joi.string().required(),
                serialNumber: Joi.string().required(),
                description: Joi.string(),
            }),
        }),middlewares.isAuth,middlewares.attachCurrentUser,middlewares.checkFleetManager,
        (req, res, next) => ctrl.createRobot(req, res, next),
    )

    route.patch('/:id/inhibit',middlewares.isAuth,middlewares.attachCurrentUser,middlewares.checkFleetManager, (req, res, next) => ctrl.inhibitRobot(req, res, next))

    route.get('',middlewares.isAuth,middlewares.attachCurrentUser,middlewares.checkFleetManager, (req, res, next) => ctrl.getRobots(req, res, next))
}
