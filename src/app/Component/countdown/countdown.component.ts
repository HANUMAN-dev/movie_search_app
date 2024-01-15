import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.scss'],
  animations: [
    trigger('slide', [
      transition(':increment', [
        style({ transform: 'translateX(-100%)' }),
        animate('300ms', style({ transform: 'translateX(0%)' })),
      ]),
      transition(':decrement', [
        style({ transform: 'translateX(100%)' }),
        animate('300ms', style({ transform: 'translateX(0%)' })),
      ]),
    ]),
  ],
})
export class CountdownComponent implements OnInit {
  countdownTime: number;
  currentTime: number;
  percentage: number;
  progress: number;
  intervalId: any;
  slideState: number;

  constructor(private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.countdownTime = 0;
    this.currentTime = 0;
    this.progress = 0;
    this.percentage = 0;
    this.slideState = 0;
  }

  startCountdown() {
    if (this.intervalId) { this.stopCountdown() }

    if (this.isValidCountdown()) {
      this.progress = 0;
      this.currentTime = this.countdownTime;

      this.intervalId = setInterval(() => {
        this.currentTime--;
        if (this.currentTime % 5 === 0) {
          this.updateProgress();
        }
      }, 1000);
    } else {
      this.snackBar.open('Invalid countdown time. Please enter a positive integer.', 'Dismiss', {
        duration: 3000,
      });
    }
  }
  stopCountdown() {
    this.currentTime = 0;
    this.progress = 0;
    this.percentage = 0;
    this.slideState = 0;
    clearInterval(this.intervalId);
  }
  updateProgress() {
    this.progress = Math.min(100, ((this.countdownTime - this.currentTime) / this.countdownTime) * 100);
    this.percentage = Math.round(this.progress);
    this.slideState = this.percentage;

    if (this.currentTime <= 0) {
      this.progress = 100;
      this.percentage = 100;
      clearInterval(this.intervalId);
    }
  }

  isValidCountdown(): boolean {
    return this.countdownTime > 0 && Number.isInteger(this.countdownTime);
  }
}
