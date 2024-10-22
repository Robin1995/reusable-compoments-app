import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Item } from '../interfaces';

@Component({
  selector: 'app-dynamic-list',
  templateUrl: './dynamic-list.component.html',
  styleUrls: ['./dynamic-list.component.scss'],
})
export class DynamicListComponent implements OnInit, OnChanges {
  @Input() items: Item[] = [];
  filteredItems: Item[] = [];
  filterText: string = '';
  sortField: 'title' | 'description' = 'title';
  sortOrder: 'asc' | 'desc' = 'asc';

  constructor() {}

  ngOnInit(): void {
    this.filteredItems = [...this.items];
    console.log(this.items);
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['items'] && changes['items'].currentValue) {
      this.filteredItems = [...this.items];
      this.onFilterChange();
    }
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
