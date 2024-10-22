import { Component, Input, OnInit } from '@angular/core';
import { Item } from '../interfaces';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dynamic-list',
  templateUrl: './dynamic-list.component.html',
  styleUrls: ['./dynamic-list.component.scss'],
})
export class DynamicListComponent implements OnInit {
  @Input() items: Item[] = [];
  filteredItems: Item[] = [];
  filterText: string = '';
  sortField: 'title' | 'description' = 'title';
  sortOrder: 'asc' | 'desc' = 'asc';

  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
    this.http.get<Item[]>('/assets/items.json').subscribe((data) => {
      this.items = data;
      this.filteredItems = [...this.items];
    });
  }

  onFilterChange(): void {
    this.filteredItems = this.items.filter(
      (item) =>
        item.title.toLowerCase().includes(this.filterText.toLowerCase()) ||
        item.description.toLowerCase().includes(this.filterText.toLowerCase())
    );
  }

  sortItems(): void {
    this.filteredItems.sort((a, b) => {
      const fieldA = a[this.sortField].toLowerCase();
      const fieldB = b[this.sortField].toLowerCase();

      if (fieldA < fieldB) return this.sortOrder === 'asc' ? -1 : 1;
      if (fieldA > fieldB) return this.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }

  onSortChange(field: 'title' | 'description', order: 'asc' | 'desc'): void {
    this.sortField = field;
    this.sortOrder = order;
    this.sortItems();
  }
}
