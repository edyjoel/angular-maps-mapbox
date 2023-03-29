import { Component } from '@angular/core';
import { MapService, PlacesService } from '../../services';

@Component({
  selector: 'app-btn-my-location',
  templateUrl: './btn-my-location.component.html',
  styles: [
    `
      button {
        position: fixed;
        top: 20px;
        right: 20px;
      }
    `,
  ],
})
export class BtnMyLocationComponent {
  constructor(
    private mapService: MapService,
    private placesService: PlacesService
  ) {}

  goToMyLocation() {
    if (!this.placesService.userLocation)
      throw new Error('User location is not set');
    if (!this.mapService.isMapReady) throw new Error('Map is not ready');

    this.mapService.flyTo(this.placesService.userLocation!);
  }
}
