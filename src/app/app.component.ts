import { Component, OnInit } from '@angular/core';
import { IdleTimeoutService } from './services/idle-timeout.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'dashboard';

  constructor(
    private idleTimeoutService: IdleTimeoutService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    if (this.authService.getAccessToken()) {
      this.idleTimeoutService.initializeIdleTimer();
    }
  }
}
