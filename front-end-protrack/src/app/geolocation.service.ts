import { Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { LocationPermissionDialogComponent } from './location-permission-dialog/location-permission-dialog.component';
import { HttpClient } from '@angular/common/http';
import { catchError, timeout } from 'rxjs/operators';

interface LocationDetails {
  coords: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
  locationName: string;
  area: string;
}

@Injectable({
  providedIn: 'root',
})
export class GeolocationService {
  private lastGeocodeTime = 0;
  private geocodeCache = new Map<string, LocationDetails>();

  constructor(private dialog: MatDialog, private http: HttpClient) {}

  async checkLocationEnabled(): Promise<boolean> {
    if (!('geolocation' in navigator)) {
      this.showLocationUnavailableDialog();
      return false;
    }

    try {
      if (navigator.permissions?.query) {
        const permissionStatus = await navigator.permissions.query({ name: 'geolocation' });
        if (permissionStatus.state === 'denied') {
          this.showLocationPermissionDialog();
          return false;
        }
      }
      return true;
    } catch {
      // If permissions API isn't supported, we'll have to try directly
      return true;
    }
  }

  async getCurrentPositionWithDetails(): Promise<LocationDetails> {
    try {
      const position = await this.getCurrentPosition().toPromise();
      if (!position?.coords) {
        throw new Error('Invalid position data');
      }

      const cacheKey = `${position.coords.latitude.toFixed(4)},${position.coords.longitude.toFixed(4)}`;
      
      if (this.geocodeCache.has(cacheKey)) {
        return this.geocodeCache.get(cacheKey)!;
      }

      // Rate limiting (Nominatim requires <= 1 request per second)
      const now = Date.now();
      if (now - this.lastGeocodeTime < 1000) {
        await new Promise(resolve => setTimeout(resolve, 1000 - (now - this.lastGeocodeTime)));
      }
      this.lastGeocodeTime = Date.now();

      const response = await this.http.get<any>(
        'https://nominatim.openstreetmap.org/reverse',
        {
          params: {
            lat: position.coords.latitude.toString(),
            lon: position.coords.longitude.toString(),
            format: 'json',
            addressdetails: '1'
          },
          headers: { 'User-Agent': 'Your-App-Name/1.0 (your@email.com)' }
        }
      ).pipe(
        timeout(10000),
        catchError(() => of(null))
      ).toPromise();

      const result = {
        coords: position.coords,
        locationName: response?.display_name || 'Unknown location',
        area: response?.address?.neighbourhood || 
              response?.address?.suburb || 
              response?.address?.city_district || 
              response?.address?.city || 
              'Unknown area'
      };

      // Cache for 1 hour
      this.geocodeCache.set(cacheKey, result);
      setTimeout(() => this.geocodeCache.delete(cacheKey), 3600000);

      return result;
    } catch (error) {
      console.error('Geolocation error:', error);
      return {
        coords: { latitude: 0, longitude: 0, accuracy: 0 },
        locationName: 'Location unavailable',
        area: 'Unknown area'
      };
    }
  }

  getCurrentPosition(): Observable<GeolocationPosition> {
    return from(new Promise<GeolocationPosition>((resolve, reject) => {
      if (!('geolocation' in navigator)) {
        this.showLocationUnavailableDialog();
        reject(new Error('Geolocation not available'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        position => resolve(position),
        error => {
          this.handleLocationError(error);
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    }));
  }

  private handleLocationError(error: GeolocationPositionError): void {
    let message = 'Error getting location';
    switch (error.code) {
      case error.PERMISSION_DENIED:
        message = 'Location permission denied. Please enable location services.';
        this.showLocationPermissionDialog();
        break;
      case error.POSITION_UNAVAILABLE:
        message = 'Location information unavailable.';
        break;
      case error.TIMEOUT:
        message = 'Location request timed out.';
        break;
    }
    console.error(message, error);
  }

  private showLocationPermissionDialog(): void {
    const dialogRef = this.dialog.open(LocationPermissionDialogComponent, {
      width: '450px',
      disableClose: true,
      data: {
        title: 'Location Permission Required',
        message: 'Please enable location services in your browser to use this feature.',
        showEnableInstructions: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'refresh') {
        window.location.reload();
      }
    });
  }

  private showLocationUnavailableDialog(): void {
    this.dialog.open(LocationPermissionDialogComponent, {
      width: '450px',
      data: {
        title: 'Location Unavailable',
        message: 'Geolocation is not supported by your browser or device.',
        showEnableInstructions: false
      }
    });
  }
}