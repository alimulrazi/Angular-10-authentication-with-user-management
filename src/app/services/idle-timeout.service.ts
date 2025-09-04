import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class IdleTimeoutService {
  private idleTimer: any;
  private readonly IDLE_TIME = 15 * 60 * 1000; // 1 minutes in milliseconds

  constructor(private authService: AuthService, private router: Router) {
    this.initializeIdleTimer();
  }

  public initializeIdleTimer() {
    this.resetTimer();

    // Listen for user activity
    ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'].forEach(event => {
      document.addEventListener(event, () => this.resetTimer(), true);
    });
  }

  private resetTimer() {
    clearTimeout(this.idleTimer);
    this.idleTimer = setTimeout(() => this.logout(), this.IDLE_TIME);
  }

  private logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
    alert('Session expired due to inactivity. Please login again.');
  }

  stopTimer() {
    clearTimeout(this.idleTimer);
  }
}
