import { UniqueEntityID } from '../../core/domain/UniqueEntityID'
import { Building } from '../building/building'
import { FloorNumber } from './floorNumber'

export class FloorId extends UniqueEntityID {
    constructor(
        private building: Building,
        private floorNumber: FloorNumber,
    ) {
        super()
    }
}