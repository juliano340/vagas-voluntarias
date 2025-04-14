import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit {
  isCandidato = false;
  
  constructor(private router: Router, private cdr: ChangeDetectorRef, private authService: AuthService) {}

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.isCandidato = payload.role === 'candidato';
        console.log( 'isCandidato:', this.isCandidato);
        this.cdr.detectChanges(); // força o Angular a atualizar a view
      } catch (err) {
        console.error('Erro ao decodificar token:', err);
      }
    }

    this.authService.role$.subscribe((role) => {
      this.isCandidato = role === 'candidato';
    });
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
    
    this.router.navigate(['/login']);
  }
}
