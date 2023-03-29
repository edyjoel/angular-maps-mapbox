import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { MapService, PlacesService } from '../../services';
import { Map, Popup, Marker } from 'mapbox-gl';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styles: [
    `
      .map-container {
        height: 100%;
        width: 100%;
        position: fixed;
        left: 0;
        top: 0;
      }
    `,
  ],
})
export class MapViewComponent implements AfterViewInit {
  @ViewChild('mapDiv')
  mapDivElement!: ElementRef;

  constructor(
    private placesService: PlacesService,
    private mapService: MapService
  ) {}

  ngAfterViewInit(): void {
    if (!this.placesService.userLocation)
      throw new Error('User location is not set');

    const map = new Map({
      container: this.mapDivElement.nativeElement,
      style: 'mapbox://styles/mapbox/light-v10',
      center: this.placesService.userLocation,
      zoom: 14,
    });

    const popup = new Popup().setHTML(`
        <h6>Aquí estoy</h6>
        <span>Estoy en este lugar del mundo</span>
      `);

    const marker = new Marker({
      color: 'red',
    })
      .setLngLat(this.placesService.userLocation)
      .setPopup(popup);

    marker.addTo(map);

    this.mapService.setMap(map);
  }
}
