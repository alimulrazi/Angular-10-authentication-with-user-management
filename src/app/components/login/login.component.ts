import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { IdleTimeoutService } from '../../services/idle-timeout.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email = '';
  password = '';
  errorMessage = '';
  returnUrl: string = '/dashboard';
  isLoading = false;

  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute, private idleTimeoutService: IdleTimeoutService) { }

  onSubmit() {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.isLoading = false;
        // Restart idle timer after successful login
        this.idleTimeoutService.initializeIdleTimer();
        this.router.navigate([this.returnUrl]);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Invalid credentials';
        console.error(err);
      }
    });
  }

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard'
  }

}
