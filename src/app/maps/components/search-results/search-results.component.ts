import { Component } from '@angular/core';
import { Feature } from '../../interfaces/places';
import { MapService, PlacesService } from '../../services';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styles: [
    `
      li {
        cursor: pointer;
      }

      p {
        font-size: 12px;
      }
    `,
  ],
})
export class SearchResultsComponent {
  public selectedId: string = '';

  constructor(
    private placesService: PlacesService,
    private mapService: MapService
  ) {}

  get isLoadingPlaces(): boolean {
    return this.placesService.isLoadingPlaces;
  }

  get places(): Feature[] {
    return this.placesService.places;
  }

  flyTo(place: Feature) {
    this.selectedId = place.id;
    const [lng, lat] = place.center;
    this.mapService.flyTo([lng, lat]);
  }

  getDirections(place: Feature) {
    if (!this.placesService.userLocation)
      throw new Error('User location is not set');

    this.placesService.deletePlaces();

    const start = this.placesService.userLocation;
    const end = place.center as [number, number];

    this.mapService.getRouteBetweenPoints(start, end);
  }
}
