import { Component, Inject, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-map-dialog',
  templateUrl: './map-dialog.component.html',
  styleUrls: ['./map-dialog.component.css']
})
export class MapDialogComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public location: string,
  private http: HttpClient) {}

  map!: L.Map;

  ngOnInit(): void {
  this.geocodeLocation(this.location);
}

 geocodeLocation(location: string): void {
  const encodedLocation = encodeURIComponent(location);
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedLocation}`;

  this.http.get<any[]>(url).subscribe((results) => {
    if (results.length > 0) {
      const lat = parseFloat(results[0].lat);
      const lon = parseFloat(results[0].lon);
      this.initMap(lat, lon);
    } else {
      // fallback to default location if not found
      this.initMap(36.8065, 10.1815);
    }
  }, error => {
    console.error('Geocoding error:', error);
    this.initMap(36.8065, 10.1815); // fallback
  });
}

initMap(lat: number, lon: number): void {
  this.map = L.map('map').setView([lat, lon], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(this.map);

  L.marker([lat, lon]).addTo(this.map)
    .bindPopup(this.location)
    .openPopup();
}
}
