import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { delay } from 'rxjs/operators';
import { User } from '../components/user/user.component';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private jsonUrl = 'assets/data/users.json';

  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.jsonUrl).pipe(
      delay(1500) // Simulate loading delay
    );
  }
}