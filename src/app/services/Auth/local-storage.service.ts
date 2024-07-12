import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  private readonly storage: Storage;

  constructor() {
    this.storage = window.localStorage;
  }

  get(key: string): any {
    if (this.storage) {
      return JSON.parse(this.storage.getItem(key) as string);
    }
    return null;
  }

  set(key: string, value: any): boolean {
    if (this.storage) {
      this.storage.setItem(key, JSON.stringify(value));
      return true;
    }
    return false;
  }

}
