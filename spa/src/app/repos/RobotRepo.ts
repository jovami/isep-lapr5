import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { AppModule } from '../app.module'

interface RobotWithoutStateDTO {
    code: string
    nickname: string
    typeCode: string
    serialNumber: string
    description?: string
}

interface RobotDTO {
    code: string
    nickname: string
    typeCode: string
    serialNumber: string
    description?: string
    state: number
}

@Injectable({
    providedIn: 'root',
})
export class RobotRepo {
    constructor(private http: HttpClient) {}

    createRobot(dto: RobotWithoutStateDTO): Observable<RobotDTO> {
        return this.http.post<RobotDTO>(
            `${AppModule.baseUrl}/robots`,
            JSON.stringify(dto),
            {
                headers: { 'Content-type': 'application/json' },
                observe: 'body',
                responseType: 'json',
            },
        )
    }

    getRobots(): Observable<RobotDTO[]> {
        return this.http.get<RobotDTO[]>(`${AppModule.baseUrl}/robottypes`, {
            headers: { 'Content-type': 'application/json' },
            observe: 'body',
            responseType: 'json',
        })
    }
}