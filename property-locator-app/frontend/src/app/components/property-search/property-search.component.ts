import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
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
  searchText = '';
  city = '';
  status = '';
  results: Property[] = [];

  constructor(private propertyService: PropertyService) {}

  ngOnInit(): void {
    this.search();
  }

  search(): void {
    this.propertyService.search({ cityName: this.city, status: this.status, searchText: this.searchText }).subscribe({
      next: (res) => {
        this.results = res || [];
      },
      error: (err) => console.error('Search failed', err),
    });
  }
}
