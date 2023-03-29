import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken =
  'pk.eyJ1IjoiZWR5am9lbCIsImEiOiJjbGM5cWJuMTYydXM2M3Fsa2Q1Y2Q4ZWtpIn0.SP0EcK9E_bdBhM7QvAUyug';

if (!navigator.geolocation) {
  alert('Geolocation is not supported by your browser');
  throw new Error('Geolocation is not supported by your browser');
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
