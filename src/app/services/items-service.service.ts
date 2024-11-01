import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, tap } from 'rxjs';
import { Item } from '../interfaces';
@Injectable({
  providedIn: 'root',
})
export class ItemsServiceService {
  constructor(private readonly http: HttpClient) {}

  fetchItems(): Observable<Item[]> {
    return this.http.get<Item[]>('/assets/items.json').pipe(
      map((items) => {
        return items.map((item, index) => ({
          ...item,
          id: index,
        }));
      }),
      tap((items) => {
        console.log('fetched items', items);
      }),
      catchError((error) => {
        console.error('Error fetching items:', error);
        throw error;
      })
    );
  }

  private sortItemsDesc(items: Item[]): Item[] {
    return [...items].sort((a, b) => b.id! - a.id!);
  }

  private checkIfAlreadyExist(item: Item, items: Item[]): boolean {
    return (
      items.some(
        (i: Item) => i.title.toLowerCase() === item.title.toLowerCase()
      ) ||
      items.some(
        (i) => i.description.toLowerCase() === item.description.toLowerCase()
      )
    );
  }

  addItemToArray(item: Item, items: Item[]): Item[] {
    if (items.length === 0) {
      return [{ ...item, id: 0 }];
    }
    if (this.checkIfAlreadyExist(item, items)) {
      return items;
    }
    const sortedItems = this.sortItemsDesc(items);
    const maxId = sortedItems[0].id!;
    return items.concat({ ...item, id: maxId + 1 });
  }

  removeItemFromArray(item: Item, items: Item[]): Item[] {
    return [...items].filter((i) => i.id !== item.id);
  }
}
