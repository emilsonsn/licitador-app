import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private readonly storage: Storage | null;

  constructor() {
    this.storage = typeof window !== 'undefined' && window.localStorage ? window.localStorage : null;
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

  remove(key: string) {
    if (this.storage) {
      this.storage.removeItem(key);
      return true;
    }
    return false;
  }
}
