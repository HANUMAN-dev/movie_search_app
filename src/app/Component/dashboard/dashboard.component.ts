// src/app/dashboard/dashboard.component.ts

import { Component, OnInit } from '@angular/core';
import { CacheService } from 'src/app/shared/cache.service';
import { RestApiService } from 'src/app/shared/rest-api.service';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MovieDialogComponent } from '../movie-dialog/movie-dialog.component';
import { HostListener } from '@angular/core';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})

export class DashboardComponent implements OnInit {
  searchedMovieList: any;
  searchedMovie: any;
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  keysList: string[]

  constructor(private dataService: RestApiService, private cacheService: CacheService, public dialog: MatDialog) { }

  ngOnInit(): void {

    const storedData = localStorage.getItem('searchedMovie');
    console.log(storedData);


    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        keys.push(key);
      }
    }
    this.keysList = keys;
    console.log(this.keysList);

    // localStorage.clear();


    this.searchedMovie = storedData ? JSON.parse(storedData) : null;
  }
  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(event: Event) {

    // localStorage.setItem('searchedMovie', JSON.stringify(this.searchedMovie));
    localStorage.setItem('searchedMovie', JSON.stringify(JSON.parse(localStorage.getItem(localStorage.getItem('latestSearch')))));

    console.log(this.searchedMovie);
  }
  getLocal() {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const value = localStorage.getItem(key);
      // console.log(`Key: ${key}, Value: ${value}`);
    }
  }

  getLocalByImdbID(imdbID) {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const value = localStorage.getItem(key);

      // Check if the value contains the provided imdbID
      if (value && value.includes(imdbID)) {
        console.log(`Key: ${key}, Value: ${value}`);
        console.log("Item found. Stopping further search.");
        break;  // Stop the loop after finding the first match
      }
    }

    // Log a message if no match is found
    console.log("No matching item found.");
  }



  onSearch() {
    // Implement your search logic here
    console.log('Search term:', this.searchTerm);
  }
  openMovieDialog(movie: any, i: number): void {
    const dialogRef = this.dialog.open(MovieDialogComponent, {
      width: '500px',
      data: { i, ...movie },

      // Pass a copy to prevent changes to the original data
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Handle changes if needed
        console.log('Movie details updated:', result);
      }
    });
  }


  search() {
    const cacheKey = 'searchMovie';
    this.searchedMovieList = null; // Reset the previous search results

    if (this.cacheService.has(cacheKey)) {
      this.searchedMovieList = this.cacheService.get(cacheKey);
      this.searchedMovie = this.searchedMovieList.Search;
      this.totalItems = +this.searchedMovieList.totalResults;
    } else {
      this.dataService.searchMovie().subscribe(
        (res) => {
          this.searchedMovieList = res;
          this.searchedMovie = this.searchedMovieList.Search;
          this.totalItems = +this.searchedMovieList.totalResults;


          // Cache the data
          this.cacheService.set(cacheKey, this.searchedMovieList);
        },
        (err) => {
          console.log('Error fetching data');
        }
      );
    }
  }

  clearStorage() {
    console.log('cleared cache');
    localStorage.clear();
    this.cacheService.clear();
  }

  onSearchby() {
    if (this.searchTerm.trim() !== '') {
      this.searchedMovieList = null; // Reset the previous search results
      const isStringFound = this.keysList.includes(this.searchTerm);
      localStorage.setItem('latestSearch', this.searchTerm.trim());
      console.log(isStringFound)
      if (isStringFound) {
        this.searchedMovie = localStorage.getItem(this.searchTerm) ? JSON.parse(localStorage.getItem(this.searchTerm)) : null;


      } else {
        this.searchMoviePage(this.searchTerm, 1);

      }


    }
  }

  searchMoviePage(term: string, page: number) {
    this.dataService.searchMovieByName(term, page).subscribe(
      (res) => {
        if (!this.searchedMovieList) {
          this.searchedMovieList = res;
          this.searchedMovie = this.searchedMovieList.Search;
          this.totalItems = +this.searchedMovieList.totalResults;
        } else {
          // Concatenate the new results to the existing list
          this.searchedMovieList.Search = this.searchedMovieList.Search.concat(res.Search);
          this.searchedMovie = this.searchedMovieList.Search;
        }

        if (res.totalResults > this.searchedMovieList.Search.length) {
          // Fetch the next page if there are more results
          console.log(this.searchedMovie);
          this.searchMoviePage(term, page + 1);
        } else {
          console.log('rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr');
          // Cache the final resultl
          const cacheKey1 = `${term.trim()}`;
          const cacheKey = `searchMovieByName_${term.trim()}`; console.log(cacheKey);
          localStorage.setItem(cacheKey1, JSON.stringify(this.searchedMovie));


          this.cacheService.set(cacheKey, this.searchedMovieList);

        }
      },
      (err) => {
        console.log('Error fetching data');
      }
    );
  }

  onPageChange(event: PageEvent) {
    console.log('Page changed:', event);
    this.currentPage = event.pageIndex + 1;
    this.search();
  }

}

interface Search {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
}
