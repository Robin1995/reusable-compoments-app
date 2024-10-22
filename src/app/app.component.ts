import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Item } from './interfaces';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'reusable-components-app';
  items: Item[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<Item[]>('/assets/items.json').subscribe(data => {
      this.items = data;
    });
  }
}
