import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Property } from '../models/property.model';

@Injectable({
  providedIn: 'root',
})
export class PropertyService {
  private apiUrl = `${environment.apiBaseUrl}/properties`;

  constructor(private http: HttpClient) {}

  private mapProperty(backendProp: any): Property {
    return {
      id: backendProp.propertyId,
      title: backendProp.title,
      price: backendProp.price,
      description: backendProp.description,
      bedroomCount: backendProp.bedrooms,
      bathroomCount: backendProp.bathrooms,
      areaSqft: backendProp.squareFeet,
      status: backendProp.listingStatus === 'SOLD' ? 'Sold' : 'Available',
      addressLine: `${backendProp.houseNumber || ''}${backendProp.unitNumber ? ', Unit ' + backendProp.unitNumber : ''}, ${backendProp.street?.streetName || ''}`,
      cityName: backendProp.street?.city?.cityName || '',
      streetName: backendProp.street?.streetName || '',
      latitude: backendProp.latitude,
      longitude: backendProp.longitude,
    };
  }

  search(criteria: any): Observable<Property[]> {
    let params = new HttpParams();

    Object.entries(criteria || {}).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        params = params.set(key, String(value));
      }
    });

    return this.http.get<any[]>(`${this.apiUrl}/search`, { params }).pipe(
      map((properties) => properties.map((p) => this.mapProperty(p)))
    );
  }

  getById(id: number): Observable<Property> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map((p) => this.mapProperty(p))
    );
  }
}
