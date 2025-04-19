import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html'
})
export class PerfilComponent implements OnInit {
  usuario: any;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get('http://localhost:3000/users/me').subscribe({
      next: (data) => this.usuario = data,
      error: (err) => console.error('Erro ao buscar perfil:', err)
    });
  }
}
