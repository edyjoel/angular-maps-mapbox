import { Injectable } from '@angular/core';
import {
  AnySourceData,
  LngLatBounds,
  LngLatLike,
  Map,
  Marker,
  Popup,
} from 'mapbox-gl';
import { Feature } from '../interfaces/places';
import { DirectionsApiClient } from '../api';
import { DirectionsResponse, Route } from '../interfaces/directions';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  private map?: Map;
  private markers: Marker[] = [];

  get isMapReady(): boolean {
    return !!this.map;
  }

  setMap(map: Map): void {
    this.map = map;
  }

  flyTo(coordinates: LngLatLike): void {
    if (!this.map) throw new Error('Map is not ready');

    this.map.flyTo({
      zoom: 14,
      center: coordinates,
      essential: true,
    });
  }

  createMarkersFromPlaces(
    places: Feature[],
    userLocation: [number, number]
  ): void {
    if (!this.map) throw new Error('Map is not ready');

    this.markers.forEach((marker) => marker.remove());

    const newMarkers = [];

    for (const place of places) {
      const [lng, lat] = place.center;
      const popup = new Popup().setHTML(
        `<h3>${place.text}</h3><span>${place.place_name}</span>`
      );
      const newMarker = new Marker().setLngLat([lng, lat]).setPopup(popup);

      newMarker.addTo(this.map);

      newMarkers.push(newMarker);
    }

    this.markers = newMarkers;

    if (places.length === 0) return;

    const bounds = new LngLatBounds();

    newMarkers.forEach((marker) => bounds.extend(marker.getLngLat()));

    bounds.extend(userLocation);

    this.map.fitBounds(bounds, {
      padding: 200,
    });
  }

  constructor(private directionsApi: DirectionsApiClient) {}

  getRouteBetweenPoints(start: [number, number], end: [number, number]) {
    return this.directionsApi
      .get<DirectionsResponse>(`/${start.join('%2C')}%3B${end.join('%2C')}`)
      .subscribe((resp) => this.drawPolyline(resp.routes[0]));
  }

  private drawPolyline(route: Route) {
    console.log({ kms: route.distance / 1000, duration: route.duration / 60 });

    if (!this.map) throw new Error('Map is not ready');

    const coords = route.geometry.coordinates;
    const start = coords[0] as [number, number];

    const bounds = new LngLatBounds();
    coords.forEach(([lng, lat]) => {
      bounds.extend([lng, lat]);
    });

    this.map.fitBounds(bounds, {
      padding: 200,
    });

    const sourceData: AnySourceData = {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: coords,
            },
          },
        ],
      },
    };

    if (this.map.getLayer('RouteString')) {
      this.map.removeLayer('RouteString');
      this.map.removeSource('RouteString');
    }

    this.map.addSource('RouteString', sourceData);
    this.map.addLayer({
      id: 'RouteString',
      type: 'line',
      source: 'RouteString',
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': '#888',
        'line-width': 8,
      },
    });
  }
}
