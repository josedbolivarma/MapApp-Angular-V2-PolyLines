import { Component } from '@angular/core';
import { MapService } from '../../services/map.service';
import { PlacesService } from '../../services/places.service';

@Component({
  selector: 'app-btn-my-location',
  templateUrl: './btn-my-location.component.html',
  styleUrls: ['./btn-my-location.component.css']
})
export class BtnMyLocationComponent {

  constructor(
    private placesService: PlacesService,
    private mapService: MapService
  ) { }


  goToMyLocation() {

    if ( !this.placesService.isUserLocationReady ) throw new Error('No hay ubicacion de usuario');
    if ( !this.mapService.isMapReady ) throw new Error('No se ha inicializado el mapa');

    this.mapService.flyTo( this.placesService.useLocation! );
    
  }

}
