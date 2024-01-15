import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class CacheService {
    private cache: { [key: string]: any } = {};

    get(key: string): any {
        return this.cache[key];
    }

    set(key: string, value: any): void {
        this.cache[key] = value;
    }

    has(key: string): boolean {
        return key in this.cache;
    }

    clear(): void {
        this.cache = {};
    }

    getAllKeys(): string[] {
        return Object.keys(this.cache);
    }
}
