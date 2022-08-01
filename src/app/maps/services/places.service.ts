import { Injectable } from '@angular/core';
import { PlacesApiClient } from '../api';
import { Feature, PlacesResponse } from '../interfaces/places';
import { MapService } from './map.service';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  public useLocation?: [ number, number ];
  public isLoadingPlaces: boolean = false;
  public places: Feature[] = [];

  get isUserLocationReady(): boolean {
    return !!this.useLocation;
  }

  constructor(
    private placesApi: PlacesApiClient,
    private mapService: MapService
  ) {
    this.getUserLocation();
  }

  public async getUserLocation(): Promise<[ number, number ]> {
    return new Promise( ( resolve, reject ) => {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          this.useLocation = [ coords.longitude, coords.latitude ];
          resolve( this.useLocation );
        },
        ( err ) => {
          alert('No se pudo obtener la geolocalizacion');
          console.log( err );
          reject();
        }
      );
    })
  }

  getPlacesByQuery( query: string = '' ) {
    // TODO: Evaluar cuando el query es nulo
    if ( query.length === 0 ) {
      this.isLoadingPlaces = false;
      this.places = [];
      return;
    }

    if ( !this.useLocation ) throw new Error('No hay useLocation');

    this.isLoadingPlaces = true;

    this.placesApi.get<PlacesResponse>(`/${ query }.json`, {
      params: {
        proximity: this.useLocation.join(','),
      }
    })
      .subscribe({
        next: ( resp ) => {
          this.isLoadingPlaces = false;
          this.places = resp.features;
          this.mapService.createMarkersFromPlaces( this.places, this.useLocation! );
        },
        error: ( error ) => {
          console.log(`Error: ${ error }`);
        }
      });
  }

  deletePlaces() {
    this.places = [];
  }

}
