import { Component, Input, OnChanges, OnInit } from '@angular/core';
import {
    BuildingDTO,
    BuildingService,
} from 'src/app/services/building.service';
import { FloorAndBuildingDTO, FloorService } from 'src/app/services/floor.service';

@Component({
    selector: 'app-create-floor',
    templateUrl: './create-floor.component.html',
    styleUrls: ['./create-floor.component.css'],
})
export class CreateFloorComponent implements OnInit, OnChanges {
    @Input() selectedBuilding: string;
    @Input() createdFloor;

    buildings: BuildingDTO[];
    floors: FloorAndBuildingDTO[];

    constructor(
        private buildingService: BuildingService,
        private floorService: FloorService,
    ) {
        this.selectedBuilding = '';
        this.createdFloor = null as unknown as FloorAndBuildingDTO;
        this.buildings = [];
        this.floors = [];
    }

    ngOnChanges(): void {
        if (this.selectedBuilding.length !== 0) {
            this.floorService
                .getFloors(this.selectedBuilding)
                .subscribe((list: FloorAndBuildingDTO[]) => {
                    this.floors = list;
                });
        }
    }

    ngOnInit(): void {
        this.buildingService.getBuildings().subscribe((list: BuildingDTO[]) => {
            this.buildings = list;
        });
    }

    createFloor(dto: FloorAndBuildingDTO) {
        this.floorService.createFloor(dto).subscribe((floor: FloorAndBuildingDTO) => {
            this.createdFloor = floor;
        });
    }
}
