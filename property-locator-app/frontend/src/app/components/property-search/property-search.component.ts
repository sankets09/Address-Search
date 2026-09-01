import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { PropertyService } from '../../services/property.service';
import { Property } from '../../models/property.model';

@Component({
  selector: 'app-property-search',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './property-search.component.html',
  styleUrls: ['./property-search.component.css'],
})
export class PropertySearchComponent implements OnInit {
  buildingName = '';
  houseNumber = '';
  street = '';
  city = '';
  results: Property[] = [];
  currentUser = '';
  isLoading = false;
  errorMessage = '';
  hasSearched = false;

  constructor(
    private propertyService: PropertyService,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUsername() || 'User';
  }

  search(): void {
    // Trim all fields
    const buildingNameTrimmed = this.buildingName.trim();
    const houseNumberTrimmed = this.houseNumber.trim();
    const streetTrimmed = this.street.trim();
    const cityTrimmed = this.city.trim();

    // Check if at least one field is provided
    if (!buildingNameTrimmed && !houseNumberTrimmed && !streetTrimmed && !cityTrimmed) {
      this.errorMessage = 'Please enter at least one search field.';
      return;
    }

    this.errorMessage = '';
    this.isLoading = true;
    this.hasSearched = true;

    const criteria: any = {};
    if (buildingNameTrimmed) criteria.buildingName = buildingNameTrimmed;
    if (houseNumberTrimmed) criteria.houseNumber = houseNumberTrimmed;
    if (streetTrimmed) criteria.street = streetTrimmed;
    if (cityTrimmed) criteria.city = cityTrimmed;

    this.propertyService.search(criteria).subscribe({
      next: (res) => {
        this.results = res || [];
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Search failed. Please try again.';
        this.results = [];
      },
    });
  }

  clear(): void {
    this.buildingName = '';
    this.houseNumber = '';
    this.street = '';
    this.city = '';
    this.results = [];
    this.errorMessage = '';
    this.hasSearched = false;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
