import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { PropertyService } from '../../services/property.service';
import { Property } from '../../models/property.model';

@Component({
  selector: 'app-property-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './property-detail.component.html',
  styleUrls: ['./property-detail.component.css'],
})
export class PropertyDetailComponent implements OnInit {
  property: Property | null = null;
  mapUrl: SafeResourceUrl | null = null;

  constructor(
    private route: ActivatedRoute,
    private propertyService: PropertyService,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.propertyService.getById(id).subscribe({
      next: (res) => {
        this.property = res;
        this.buildMapUrl();
      },
      error: (err) => console.error('Property fetch failed', err),
    });
  }

  private buildMapUrl(): void {
    const lat = this.property?.latitude;
    const lng = this.property?.longitude;

    if (lat == null || lng == null || Number.isNaN(lat) || Number.isNaN(lng)) {
      this.mapUrl = null;
      return;
    }

    const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
    this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(googleMapsUrl);
  }
}
