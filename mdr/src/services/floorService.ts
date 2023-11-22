import { IFloorDTO } from '../dto/IFloorDTO'
import IFloorRepo from '../services/IRepos/IFloorRepo'
import IBuildingRepo from '../services/IRepos/IBuildingRepo'
import IFloorService from './IServices/IFloorService'
import { Either, left, Result, right } from '../core/logic/Result'
import { Floor } from '../domain/floor/floor'
import { FloorMap } from '../mappers/FloorMap'
import { BuildingCode } from '../domain/building/code'
import { FloorNumber } from '../domain/floor/floorNumber'
import { MaxFloorDimensions } from '../domain/building/maxFloorDimensions'
import { Description } from '../domain/description'
import { IFloorMapDTO } from '../dto/IFloorMapDTO'
import { IBuildingCodeDTO } from '../dto/IBuildingCodeDTO'
import IPassageRepo from './IRepos/IPassageRepo'
import { IUpdateFloorDTO } from '../dto/IUpdateFloorDTO'
import { IFloorPassageDTO } from '../dto/IFloorPassageDTO'
import { FloorPassageMap } from '../mappers/FloorPassageMap'
import { ErrorCode, ErrorResult } from './IServices/IFloorService'
import config from '../../config'
import { Inject, Service } from 'typedi'
import { FloorMapContent } from '../domain/floor/floorMap'
import { Coordinates } from '../domain/floor/Coordinates'

@Service()
export default class FloorService implements IFloorService {
    constructor(
        @Inject(config.repos.floor.name) private floorRepo: IFloorRepo,
        @Inject(config.repos.building.name) private buildingRepo: IBuildingRepo,
        @Inject(config.repos.passage.name) private passageRepo: IPassageRepo,
    ) {}

    public async createFloor(floorDTO: IFloorDTO, buildingCode: string): Promise<Either<ErrorResult, IFloorDTO>> {
        try {
            const code = BuildingCode.create(buildingCode).getValue()
            const building = await this.buildingRepo.findByCode(code)

            if (!building) {
                return left({
                    errorCode: ErrorCode.NotFound,
                    message: `Building ${buildingCode} not found`,
                })
            }

            const floorNumber = FloorNumber.create(floorDTO.floorNumber).getValue()
            const floor = await this.floorRepo.findByCodeNumber(code, floorNumber)

            if (floor) {
                return left({
                    errorCode: ErrorCode.BusinessRuleViolation,
                    message: `Floor ${floorDTO.floorNumber} already exists in building ${buildingCode}`,
                })
            }

            floorDTO.buildingCode = buildingCode

            let description = undefined

            if (floorDTO.description) {
                description = Description.create(floorDTO.description)

                if (description.isFailure) {
                    return left({
                        errorCode: ErrorCode.BusinessRuleViolation,
                        message: 'Description not valid',
                    })
                }
                description = description.getValue()
            }

            const floorOrError = Floor.create({
                building: building,
                floorNumber: FloorNumber.create(floorDTO.floorNumber).getValue(),
                description: description,
            })

            if (floorOrError.error) {
                return left({
                    errorCode: ErrorCode.BusinessRuleViolation,
                    message: 'There was a problem while creating the floor',
                })
            }

            const result = await this.floorRepo.save(floorOrError.getValue())
            return right(FloorMap.toDTO(result))
        } catch (e) {
            throw e
        }
    }

    public async patchFloor(dto: IUpdateFloorDTO): Promise<Either<ErrorResult, IFloorDTO>> {
        try {
            const buildingCode = BuildingCode.create(dto.buildingCode).getValue()
            const building = await this.buildingRepo.findByCode(buildingCode)

            if (!building) {
                return left({
                    errorCode: ErrorCode.NotFound,
                    message: `Building ${dto.buildingCode} not found`,
                })
            }

            const oldFloorNumber = FloorNumber.create(dto.oldFloorNumber).getValue()

            const floor = await this.floorRepo.findByCodeNumber(buildingCode, oldFloorNumber)

            if (floor === null) {
                return left({
                    errorCode: ErrorCode.NotFound,
                    message: `Floor ${dto.oldFloorNumber} not found in building ${dto.buildingCode}`,
                })
            }

            if (dto.description) {
                const description = Description.create(dto.description)

                if (description.isFailure) {
                    return left({
                        errorCode: ErrorCode.BusinessRuleViolation,
                        message: 'Floor description do not meet requirements',
                    })
                }

                floor.description = description.getValue()
            }

            if (dto.floorNumber !== undefined && dto.floorNumber !== null) {
                const newFloorNumber = FloorNumber.create(dto.floorNumber)

                if (newFloorNumber.isFailure) {
                    return left({
                        errorCode: ErrorCode.BusinessRuleViolation,
                        message: 'Floor number do not meet requirements',
                    })
                }

                const newFloor = await this.floorRepo.findByCodeNumber(buildingCode, newFloorNumber.getValue())

                if (newFloor !== null) {
                    return left({
                        errorCode: ErrorCode.NotFound,
                        message: `Floor ${dto.floorNumber} already exists in building ${dto.buildingCode}`,
                    })
                }

                floor.floorNumber = newFloorNumber.getValue()
            }

            const result = await this.floorRepo.save(floor)
            return right(FloorMap.toDTO(result))
        } catch (e) {
            throw e
        }
    }

    public async putFloor(dto: IUpdateFloorDTO): Promise<Either<ErrorResult, IFloorDTO>> {
        try {
            const buildingCode = BuildingCode.create(dto.buildingCode).getValue()
            const building = await this.buildingRepo.findByCode(buildingCode)

            if (!building) {
                return left({
                    errorCode: ErrorCode.NotFound,
                    message: `Building ${dto.buildingCode} not found`,
                })
            }

            const oldFloorNumber = FloorNumber.create(dto.oldFloorNumber).getValue()

            const floor = await this.floorRepo.findByCodeNumber(buildingCode, oldFloorNumber)

            if (floor === null) {
                return left({
                    errorCode: ErrorCode.NotFound,
                    message: `Floor ${dto.oldFloorNumber} not found in building ${dto.buildingCode}`,
                })
            }

            if (dto.description) {
                const description = Description.create(dto.description)

                if (description.isFailure) {
                    return left({
                        errorCode: ErrorCode.BusinessRuleViolation,
                        message: 'Floor description do not meet requirements',
                    })
                }

                floor.description = description.getValue()
            } else {
                floor.removeDescription()
            }

            if (dto.floorNumber !== undefined && dto.floorNumber !== null) {
                const newFloorNumber = FloorNumber.create(dto.floorNumber)

                if (newFloorNumber.isFailure) {
                    return left({
                        errorCode: ErrorCode.BusinessRuleViolation,
                        message: 'Floor number do not meet requirements',
                    })
                }

                const newFloor = await this.floorRepo.findByCodeNumber(buildingCode, newFloorNumber.getValue())

                if (newFloor !== null) {
                    return left({
                        errorCode: ErrorCode.NotFound,
                        message: `Floor ${dto.floorNumber} already exists in building ${dto.buildingCode}`,
                    })
                }

                floor.floorNumber = newFloorNumber.getValue()
            }

            const result = await this.floorRepo.save(floor)
            return right(FloorMap.toDTO(result))
        } catch (e) {
            throw e
        }
    }

    public async getFloors(buildingCode: string): Promise<Either<ErrorResult, IFloorDTO[]>> {
        try {
            const code = BuildingCode.create(buildingCode).getValue()
            const building = await this.buildingRepo.findByCode(code)

            if (!building) {
                return left({
                    errorCode: ErrorCode.NotFound,
                    message: `Building ${buildingCode} not found`,
                })
            }

            const floors = await this.floorRepo.findByBuildingCode(code)

            const dtoList = await Promise.all(floors.map((floor) => FloorMap.toDTO(floor)))
            return right(dtoList)
        } catch (e) {
            throw e
        }
    }

    public async uploadMap(dto: IFloorMapDTO): Promise<Either<ErrorResult, IFloorMapDTO>> {
        try {
            const floor = await this.floorRepo.findByCodeNumber(
                BuildingCode.create(dto.buildingCode).getValue(),
                FloorNumber.create(dto.floorNumber).getValue(),
            )
            if (floor === null) {
                return left({
                    errorCode: ErrorCode.NotFound,
                    message: 'Floor not found',
                })
            }
            const map = this.createMap(dto)
            if (map.isFailure) {
                return left({
                    errorCode: ErrorCode.BusinessRuleViolation,
                    message: 'Map does not meet requirements',
                })
            }
            if (!floor.addMap(map.getValue())) {
                return left({
                    errorCode: ErrorCode.BusinessRuleViolation,
                    message: 'Map too large',
                })
            }
            const saved = await this.floorRepo.save(floor)
            return right(FloorMap.toDTOFloorMap(saved))
        } catch (e) {
            throw e
        }
    }

    private createMap(dto: IFloorMapDTO): Result<FloorMapContent> {
        const mapOrError = FloorMapContent.create({
            path: this.generateMapPath(dto.buildingCode, dto.floorNumber),
            map: {
                dimensions: MaxFloorDimensions.create(dto.map.dimensions.length, dto.map.dimensions.width).getValue(),
                // mapContent: dto.map.mapContent,
                // passages: dto.map.passages.map(passage => Coordinates.create(passage.x, passage.y).getValue()),
                // elevators: dto.map.elevators.map(elevator => Coordinates.create(elevator.x, elevator.y).getValue()),
                // rooms: dto.map. rooms.map(room => Coordinates.create(room.x, room.y).getValue())
            },
        })
        if (mapOrError.isSuccess) {
            return Result.ok(mapOrError.getValue())
        } else {
            return Result.fail('Map does not meet requirements')
        }
    }

    async floorsWithPassage(buildingDTO: IBuildingCodeDTO): Promise<Result<IFloorPassageDTO[]>> {
        const building = await this.buildingRepo.findByCode(BuildingCode.create(buildingDTO.code).getValue())

        if (!building) {
            return Result.fail(`Building with code ${buildingDTO.code} does not exist`)
        }

        const floors = await this.passageRepo.floorsWithPassage(building)
        return Result.ok(floors.map((f) => FloorPassageMap.toDTO(f)))
    }

    async getMap(dto: IFloorDTO): Promise<Either<ErrorResult, string>> {
        const buildingCode = BuildingCode.create(dto.buildingCode)
        const floorNumber = FloorNumber.create(dto.floorNumber)
        try {
            if (buildingCode.isFailure || floorNumber.isFailure) {
                return left({
                    errorCode: ErrorCode.BusinessRuleViolation,
                    message: 'Floor number or buildingCode do not meet requirements',
                })
            }

            const floor = await this.floorRepo.findByCodeNumber(buildingCode.getValue(), floorNumber.getValue())
            if (!floor) {
                return left({
                    errorCode: ErrorCode.NotFound,
                    message: 'Floor not found',
                })
            } else if (!floor.props.path) {
                return left({
                    errorCode: ErrorCode.NotFound,
                    message: 'Floor does not have map yet',
                })
            }
            return right(floor.props.path)
        } catch (e) {
            return left({
                errorCode: ErrorCode.NotFound,
                message: 'Something unexcpected happen',
            })
        }
    }

    private generateMapPath(buildingCode: string, floorNumber: number): string {
        return `${buildingCode}/${floorNumber}.json`
    }
}
