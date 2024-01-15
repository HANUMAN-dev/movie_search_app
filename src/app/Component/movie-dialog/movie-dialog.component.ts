// src/app/movie-dialog/movie-dialog.component.ts

import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CacheService } from 'src/app/shared/cache.service';
import { RestApiService } from 'src/app/shared/rest-api.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-movie-dialog',
  templateUrl: './movie-dialog.component.html',
  styleUrls: ['./movie-dialog.component.scss'],
})
export class MovieDialogComponent implements OnInit {
  // Add any additional properties or methods you need
  title: String;
  year: number;


  constructor(private dataService: RestApiService, private cacheService: CacheService, private location: Location, private router: Router,
    public dialogRef: MatDialogRef<MovieDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(MAT_DIALOG_DATA) public index: number,
  ) { }

  ngOnInit(): void {
    // Implement any initialization logic here
    const storedData = localStorage.getItem('searchedMovie');

    console.log('MovieDialogComponent initialized:', this.data);
  }

  handleInputChange1(field: string, value: any) {
    this.title = value;
  }
  handleInputChange2(field: string, value: any) {
    this.year = value;
  }
  onSaveClick(): void {
    //const storedData = localStorage.getItem('searchedMovie');
    const storedData = localStorage.getItem(localStorage.getItem('latestSearch'))
    const storedDataForSearched = localStorage.getItem('searchedMovie')
    const m = storedData ? JSON.parse(storedData) : null;
    const m1 = storedData ? JSON.parse(storedDataForSearched) : null;
    if (m.length > 0) {
      if (this.title != null) {
        m[this.data.i].Title = this.title;
        m1[this.data.i].Title = this.title;

        localStorage.setItem(localStorage.getItem('latestSearch'), JSON.stringify(m));
        localStorage.setItem('searchedMovie', JSON.stringify(m1));

      }
      if (this.year != null) {
        m[this.data.i].Year = this.year;
        localStorage.setItem(localStorage.getItem('latestSearch'), JSON.stringify(m));
        m1[this.data.i].Year = this.year;
        localStorage.setItem('searchedMovie', JSON.stringify(m1));

      }
    }

    window.location.reload();
    this.dialogRef.close();
  }

}
