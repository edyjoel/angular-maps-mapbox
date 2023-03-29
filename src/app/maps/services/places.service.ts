import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PlacesApiClient } from '../api';
import { Feature, PlacesResponse } from '../interfaces/places';
import { MapService } from './map.service';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  public userLocation?: [number, number];
  public isLoadingPlaces: boolean = false;
  public places: Feature[] = [];

  get userLocationReady(): boolean {
    return !!this.userLocation;
  }

  constructor(
    private placesApi: PlacesApiClient,
    private mapService: MapService
  ) {
    this.getUserLocation();
  }

  public async getUserLocation(): Promise<[number, number]> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.userLocation = [
            position.coords.longitude,
            position.coords.latitude,
          ];
          resolve(this.userLocation);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  getPlacesByQuery(query: string) {
    if (query.length === 0) {
      this.places = [];
      this.isLoadingPlaces = false;
      return;
    }

    if (!this.userLocation) throw new Error('User location not ready');

    this.isLoadingPlaces = true;

    this.placesApi
      .get<PlacesResponse>(`/${query}.json`, {
        params: {
          proximity: this.userLocation?.join(','),
        },
      })
      .subscribe((data) => {
        console.log(data);

        this.places = data.features;
        this.isLoadingPlaces = false;

        this.mapService.createMarkersFromPlaces(
          this.places,
          this.userLocation!
        );
      });
  }

  deletePlaces() {
    this.places = [];
  }
}
