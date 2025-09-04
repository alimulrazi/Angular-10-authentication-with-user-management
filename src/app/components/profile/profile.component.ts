import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TitleService } from '../../services/title.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user: any = null;
  error: string | null = null;

  constructor(private http: HttpClient, private titleService: TitleService) { }

  ngOnInit(): void {
    this.titleService.setTitle('Profile');
    this.http.get('http://localhost:8001/api/user').subscribe({
      next: (data) => this.user = data,
      error: () => this.error = 'Failed to load profile'
    });
  }

}
