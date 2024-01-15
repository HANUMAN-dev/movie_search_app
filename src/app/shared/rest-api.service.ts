import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CacheService } from './cache.service';

@Injectable({
  providedIn: 'root',
})
export class RestApiService {
  private apiKey = '6811fd02';
  private apiUrl = 'https://www.omdbapi.com/';

  constructor(private http: HttpClient, private cacheService: CacheService) { }

  searchMovie(page: number = 1): Observable<any> {
    const cacheKey = `searchMovie_page_${page}`;

    if (this.cacheService.has(cacheKey)) {
      return of(this.cacheService.get(cacheKey));
    }

    const params = { s: 'Batman', apikey: this.apiKey, type: 'movie', page: page.toString() };

    return this.http.get<any>(this.apiUrl, { params }).pipe(
      tap((res) => this.cacheService.set(cacheKey, res))
    );
  }

  searchMovieByName(name: string, page: number = 1): Observable<any> {
    const cacheKey = `searchMovieByName_${name}_page_${page}`;

    if (this.cacheService.has(cacheKey)) {
      return of(this.cacheService.get(cacheKey));
    }

    const params = { s: name, apikey: this.apiKey, type: 'movie', page: page.toString() };

    return this.http.get<any>(this.apiUrl, { params }).pipe(
      tap((res) => this.cacheService.set(cacheKey, res))
    );
  }
}
