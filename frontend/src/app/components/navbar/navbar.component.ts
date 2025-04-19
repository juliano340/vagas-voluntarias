import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit {
  isCandidato = false;
  nomeUsuario = '';

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Chama ao iniciar
    this.carregarDadosDoToken();

    // E escuta mudanças de rota (ex: após login)
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.carregarDadosDoToken();
      });

    this.authService.role$.subscribe((role) => {
      this.isCandidato = role === 'candidato';
    });
  }

  carregarDadosDoToken() {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.isCandidato = payload.role === 'candidato';
        this.nomeUsuario = payload.name || payload.email;
        this.cdr.detectChanges();
      } catch (err) {
        console.error('Erro ao decodificar token:', err);
      }
    }
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
