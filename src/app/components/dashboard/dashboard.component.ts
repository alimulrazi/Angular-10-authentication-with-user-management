import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TitleService } from '../../services/title.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  message = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private titleService: TitleService
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle('Dashboard');
    this.http.get<{ message: string }>('http://localhost:8001/api/v1/dashboard')
      .subscribe({
        next: (res) => this.message = res.message,
        error: (err) => this.message = 'Error loading data'
      });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
