import { Router } from 'express'
import { celebrate, Joi } from 'celebrate'
import { Container } from 'typedi'

import IBuildingController from '../../controllers/IControllers/IBuildingController'
import IFloorController from '../../controllers/IControllers/IFloorController'

import config from '../../../config'
import IElevatorController from '../../controllers/IControllers/IElevatorController'

const route = Router()

export default (app: Router) => {
    app.use('/buildings', route)

    const buildingController = Container.get(config.controllers.building.name) as IBuildingController
    const floorController = Container.get(config.controllers.floor.name) as IFloorController
    const elevatorCtrl = Container.get(config.controllers.elevator.name) as IElevatorController

    route.post(
        '',
        celebrate({
            body: Joi.object({
                code: Joi.string().required(),
                name: Joi.string(),
                description: Joi.string(),
                maxFloorDimensions: Joi.object({
                    length: Joi.number().integer().required(),
                    width: Joi.number().integer().required(),
                }),
            }),
        }),
        (req, res, next) => buildingController.createBuilding(req, res, next),
    )

    route.post(
        '/:id/floors',
        celebrate({
            body: Joi.object({
                floorNumber: Joi.number().integer().required(),
                description: Joi.string(),
            }),
        }),
        (req, res, next) => floorController.createFloor(req, res, next),
    )

    route.patch(
        '/:id',
        celebrate({
            body: Joi.object({
                name: Joi.string(),
                description: Joi.string(),
                maxFloorDimensions: Joi.object({
                    length: Joi.number().integer(),
                    width: Joi.number().integer(),
                }),
            }),
        }),
        (req, res, next) => buildingController.patchBuilding(req, res, next),
    )

    route.put(
        '/:id',
        celebrate({
            body: Joi.object({
                name: Joi.string(),
                description: Joi.string(),
                maxFloorDimensions: Joi.object({
                    length: Joi.number().integer().required(),
                    width: Joi.number().integer().required(),
                }),
            }),
        }),
        (req, res, next) => buildingController.editBuilding(req, res, next),
    )
    route.get('', (req, res, next) => buildingController.getBuildings(req, res, next))

    route.post(
        '/:id/elevators',
        celebrate({
            body: Joi.object({
                floors: Joi.array().items(Joi.number().integer().required()).required(),
                brand: Joi.string(),
                model: Joi.string(),
                serialNumber: Joi.string(),
                description: Joi.string(),
            }),
        }),
        (req, res, next) => elevatorCtrl.createElevator(req, res, next),
    )

    route.patch(
        '/:id/elevators/:id',
        celebrate({
            body: Joi.object({
                floors: Joi.array().items(Joi.number().integer().required()).required(),
                brand: Joi.string(),
                model: Joi.string(),
                serialNumber: Joi.string(),
                description: Joi.string(),
            }),
        }),
        (req, res, next) => elevatorCtrl.patchElevator(req, res, next),
    )

    route.put(
        '/:id/elevators/:id',
        celebrate({
            body: Joi.object({
                floors: Joi.array().items(Joi.number().integer().required()).required(),
                brand: Joi.string(),
                model: Joi.string(),
                serialNumber: Joi.string(),
                description: Joi.string(),
            }),
        }),
        (req, res, next) => elevatorCtrl.putElevator(req, res, next),
    )

    route.get(
        '/:id',
        celebrate({
            body: Joi.object({
                name: Joi.string(),
                description: Joi.string(),
                maxFloorDimensions: Joi.object({
                    length: Joi.number().integer().required(),
                    width: Joi.number().integer().required(),
                }),
            }),
        }),
        (req, res, next) => elevatorCtrl.getElevators(req, res, next),
    )
}
