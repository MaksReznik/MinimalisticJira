import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { LocalstorageKeys } from 'src/app/shared/enums/localstorage-keys';
import { Task } from 'src/app/shared/interfaces/task';
import { User } from 'src/app/shared/interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  listUpdated = new Subject<void>();
  constructor() {}

  getArrayFromStorage(key: LocalstorageKeys): Array<User | Task> {
    const element = localStorage.getItem(key);
    if (!element) {
      return [];
    }
    return JSON.parse(localStorage.getItem(key) ?? '') ?? [];
  }

  addElementToStorage(key: LocalstorageKeys, item: Task | User) {
    localStorage.setItem(
      key,
      JSON.stringify([...this.getArrayFromStorage(key), item])
    );
    this.listUpdated.next();
  }

  deleteElementFromStorage(key: LocalstorageKeys, item: Task | User) {
    const indexOfDeletedElement = this.getArrayFromStorage(key).findIndex(
      (element) => element.id === item.id
    );
    if (indexOfDeletedElement === -1) {
      return;
    }
    const itemArray = this.getArrayFromStorage(key);
    itemArray.splice(indexOfDeletedElement, 1);
    localStorage.setItem(key, JSON.stringify(itemArray));
    this.listUpdated.next();
  }

  editElementInStorage(key: LocalstorageKeys, item: Task | User) {
    const editedArray = this.getArrayFromStorage(key).map((element) => {
      if (element.id === item.id) return item;
      return element;
    });
    localStorage.setItem(key, JSON.stringify(editedArray));
    this.listUpdated.next();
  }
}
