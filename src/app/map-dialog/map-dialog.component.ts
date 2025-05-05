import { Component, Inject, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-map-dialog',
  templateUrl: './map-dialog.component.html',
  styleUrls: ['./map-dialog.component.css']
})
export class MapDialogComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public location: string) {}

  map!: L.Map;

  ngOnInit(): void {
    // You can replace this with a real geocoding API later
    this.initMap();
  }

  initMap(): void {
    this.map = L.map('map').setView([36.8065, 10.1815], 13); // default to Tunis

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    // This is where you'd use a geocoding API to convert address to lat/lng
    L.marker([36.8065, 10.1815]).addTo(this.map)
      .bindPopup(this.location)
      .openPopup();
  }
}
