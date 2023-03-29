import { Component } from '@angular/core';
import { PlacesService } from '../../services';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styles: [
    `
      .search-container {
        width: 250px;
        position: fixed;
        top: 20px;
        left: 20px;
        background-color: white;
        padding: 5px;
        box-shadow: 0 10px 10px rgba(0, 0, 0, 0.1);
        border-radius: 5px;
        border: 1px solid rgba(0, 0, 0, 0.1);
      }
    `,
  ],
})
export class SearchBarComponent {
  private debounceTimer?: NodeJS.Timeout;

  constructor(private placesService: PlacesService) {}

  onQueryChanged(query: string) {
    if (this.debounceTimer) clearTimeout(this.debounceTimer);

    this.debounceTimer = setTimeout(() => {
      console.log(query);
      this.placesService.getPlacesByQuery(query);
    }, 350);
  }
}
