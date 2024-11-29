import { Component, OnInit } from '@angular/core';
import { Item } from './interfaces';
import { ItemsServiceService } from './services/items-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Welcome to TrialPal AI Assistant';
  items: Item[] = [];

  constructor(private readonly itemsService: ItemsServiceService) {}

  ngOnInit(): void {
    this.itemsService.fetchItems().subscribe({
      next: (items: Item[]) => {
        console.log('fetched items successfull', items);
        this.items = items;
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {
        console.log('complete');
      },
    });
  }
  addNewItem(item: Item) {
    this.items = this.itemsService.addItemToArray(item, this.items);
  }
  deleteItem(item: Item) {
    console.log(this.items, 'before');
    this.items = this.itemsService.removeItemFromArray(item, this.items);
    console.log(this.items, 'after');
  }
}
