import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class LoginService {

  constructor(private http: HttpClient) { }
  
  getUser(): Observable<any> {
    return this.http.get('');
  }

  registerUser(data: any): Observable<any> {
    return this.http.post('https://agroadvice.violetdesk.com/api/users/register', data);
  }

  loginUser(data: any): Observable<any> {
    return this.http.post('https://agroadvice.violetdesk.com/api/users/login', data);
  }

  isLoggedIn() {
    return !!localStorage.getItem('token');
  }

}
