import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Item } from '../interfaces';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
@Component({
  selector: 'app-dynamic-list',
  templateUrl: './dynamic-list.component.html',
  styleUrls: ['./dynamic-list.component.scss'],
  animations: [
    trigger('itemVisible', [
      state('hidden', style({ opacity: 0, height: '0px' })),
      state('visible', style({ opacity: 1, height: '*' })),
      transition('hidden <=> visible', animate('0.3s ease-in-out')),
    ]),
  ],
})
export class DynamicListComponent implements OnInit, OnChanges {
  @Input() items: Item[] = [];
  filteredItems: Item[] = [];
  filterText: string = '';
  sortField: keyof Item = 'title';
  sortOrder: 'asc' | 'desc' = 'asc';
  newItem: Item = { title: '', description: '' };
  @Output() onAddNewItem = new EventEmitter<Item>();
  @Output() onDeleteItem = new EventEmitter<Item>();
  isVisible: boolean = false;
  constructor() {}

  ngOnInit(): void {
    this.filteredItems = [...this.items];
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
      const fieldA = a[this.sortField]?.toString().toLowerCase() ?? '';
      const fieldB = b[this.sortField]?.toString().toLowerCase() ?? '';

      if (typeof fieldA === 'string' && typeof fieldB === 'string') {
        return this.sortOrder === 'asc'
          ? fieldA.localeCompare(fieldB)
          : fieldB.localeCompare(fieldA);
      }

      if (fieldA < fieldB) return this.sortOrder === 'asc' ? -1 : 1;
      if (fieldA > fieldB) return this.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }

  onSortChange(field: keyof Item, order: 'asc' | 'desc'): void {
    this.sortField = field;
    this.sortOrder = order;
    this.sortItems();
  }

  onAddItem(): void {
    if (
      this.newItem.title.trim() !== '' &&
      this.newItem.description.trim() !== ''
    ) {
      this.onAddNewItem.emit(this.newItem);
      this.newItem = { title: '', description: '' };
    }
  }
  toogleNewItemContainer(container: HTMLDivElement) {
    container.classList.toggle('visible');
  }
  deleteItem(item: Item) {
    this.onDeleteItem.emit(item);
  }
  toogleVisibility() {
    this.isVisible = !this.isVisible;
  }
}
