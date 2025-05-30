import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private roleSubject = new BehaviorSubject<string | null>(this.getRoleFromToken());
  role$ = this.roleSubject.asObservable();
  private readonly api = 'http://localhost:3000/auth';

  constructor(private http: HttpClient) {}

  private getRoleFromToken(): string | null {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role;
    } catch {
      return null;
    }
  }

  notifyLogin() {
    const role = this.getRoleFromToken();
    this.roleSubject.next(role);
  }  

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.api}/login`, { email, password }).pipe(
      tap((res: any) => {
        localStorage.setItem('token', res.access_token);
        this.notifyLogin();

      })
    );
  }

  getToken() {
    return localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
    this.roleSubject.next(null);

  }
}
