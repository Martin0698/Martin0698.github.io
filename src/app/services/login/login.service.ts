import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  userInfo = new BehaviorSubject(null);
  jwtHelper = new JwtHelperService();
  // http://localhost:8080 http://150.136.136.104:8080
  baseUrl = 'http://150.136.136.104:8080';

  constructor(private http: HttpClient) {}

  getTeams(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/api/getequipos`);
  }

  getRole(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/api/getrol`);
  }

  registerUser(user: any): Observable<any> {
    return this.http.post<{token: string}>(`${this.baseUrl}/api/signup`, user)
    .pipe(
      map(result => {
        localStorage.setItem('access_token', result.token);
        const decodedUser = this.jwtHelper.decodeToken(result.token);
        this.userInfo.next(decodedUser);
        return true;
      })
    );
  }

  loginUser(user: any): Observable<boolean> {
    return this.http.post<{token: string}>(`${this.baseUrl}/api/signin`, user)
    .pipe(
      map(result => {
        localStorage.setItem('access_token', result.token);
        const decodedUser = this.jwtHelper.decodeToken(result.token);
        this.userInfo.next(decodedUser);
        return true;
      })
    );
  }

  getUserData(email: any): Observable<any> {
    const url = `${this.baseUrl}/api/user_data`;
    return this.http.post<any>(url, {email: email});
  }

  logout() {
    localStorage.removeItem('access_token');
  }

  public get loggedIn(): boolean {
    return (localStorage.getItem('access_token') !== null);
  }

  loadUserInfo() {
    let userdata = this.userInfo.getValue();
    if (!userdata) {
      const access_token = localStorage.getItem('access_token');
      if (access_token) {
        userdata = this.jwtHelper.decodeToken(access_token);
        this.userInfo.next(userdata);
      }
    }
  }
}
