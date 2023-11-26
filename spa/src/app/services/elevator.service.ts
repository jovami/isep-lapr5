import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { ElevatorDTO } from 'src/app/dto/ElevatorDTO'
import { CreatedElevatorDTO } from 'src/app/dto/CreatedElevatorDTO'
import { FloorAndBuildingDTO, PatchFloorDTO, PutFloorDTO } from './floor.service'
import { Config } from '../config'
import { EditElevatorDTO } from '../dto/EditElevatorDTO'
import { CreateElevatorDTO } from '../dto/CreateElevatorDTO'

@Injectable()
export class ElevatorService {
    constructor(private http: HttpClient) {}

    createElevator(buildingId: string, dto: CreateElevatorDTO): Observable<CreatedElevatorDTO> {
        return this.http.post<CreatedElevatorDTO>(
            `${Config.baseUrl}/buildings/${buildingId}/elevators`,
            JSON.stringify(dto),
            {
                headers: { 'Content-type': 'application/json' },
                observe: 'body',
                responseType: 'json',
            },
        )
    }

    getElevators(buildingCode: string): Observable<CreatedElevatorDTO[]> {
        const url = `${Config.baseUrl}/buildings/${buildingCode}/elevators`
        return this.http.get<CreatedElevatorDTO[]>(url, {
            observe: 'body',
            responseType: 'json',
        })
    }

    patchElevator(dto: EditElevatorDTO): Observable<CreatedElevatorDTO> {
        const dtoElevator = {
            floors: dto.floors,
            brand: dto.brand ?? undefined,
            model: dto.model  ?? undefined,
            serialNumber: dto.serialNumber  ?? undefined,
            description: dto.description  ?? undefined,
        } as ElevatorDTO

        return this.http.patch<ElevatorDTO>(
            `${Config.baseUrl}/buildings/${dto.buildingId}/elevators/${dto.identifier}`,
            JSON.stringify(dtoElevator),
            {
                headers: { 'Content-type': 'application/json' },
                observe: 'body',
                responseType: 'json',
            },
        )
    }

    putElevator(dto: EditElevatorDTO): Observable<CreatedElevatorDTO> {
        const dtoElevator = {
            floors: dto.floors,
            brand: dto.brand ?? undefined,
            model: dto.model  ?? undefined,
            serialNumber: dto.serialNumber  ?? undefined,
            description: dto.description  ?? undefined,

        } as ElevatorDTO

        return this.http.put<ElevatorDTO>(
            `${Config.baseUrl}/buildings/${dto.buildingId}/elevators/${dto.identifier}`,
            JSON.stringify(dtoElevator),
            {
                headers: { 'Content-type': 'application/json' },
                observe: 'body',
                responseType: 'json',
            },
        )
    }
}
