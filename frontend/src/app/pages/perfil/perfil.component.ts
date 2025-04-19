import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html'
})
export class PerfilComponent implements OnInit {
  usuario: any;
  modoEdicao: boolean = false; // 👈 controla se campos estão editáveis

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get('http://localhost:3000/users/me').subscribe({
      next: (data) => this.usuario = data,
      error: (err) => console.error('Erro ao buscar perfil:', err)
    });
  }

  salvar() {
    const token = localStorage.getItem('token');

    this.http.put('http://localhost:3000/users/me', this.usuario, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).subscribe({
      next: () => {
        alert('Perfil atualizado com sucesso!');
        this.modoEdicao = false; // 👈 volta para visualização
      },
      error: (err) => console.error('Erro ao salvar perfil:', err)
    });
  }
}
