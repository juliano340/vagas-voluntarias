import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment.prod'; // Adjust the import path as necessary
// import { environment } from ''../../../environments/environment'; // Uncomment this line if you want to use the local environment

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
})
export class PerfilComponent implements OnInit {
  usuario: any;
  modoEdicao: boolean = false;
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.http.get(`${this.apiUrl}/users/me`).subscribe({
      next: (data) => (this.usuario = data),
      error: (err) => console.error('Erro ao buscar perfil:', err),
    });
  }

  salvar() {
    const token = localStorage.getItem('token');

    this.http
      .put(`${this.apiUrl}/users/me`, this.usuario, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .subscribe({
        next: () => {
          alert('Perfil atualizado com sucesso!');
          this.modoEdicao = false;
        },
        error: (err) => console.error('Erro ao salvar perfil:', err),
      });
  }

  confirmarExclusaoConta() {
    if (
      confirm(
        'Tem certeza que deseja excluir sua conta? Todos os seus dados serão apagados permanentemente.'
      )
    ) {
      const token = localStorage.getItem('token');
      this.http
        .delete(`${this.apiUrl}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .subscribe({
          next: () => {
            alert('Conta excluída com sucesso.');
            localStorage.removeItem('token');
            this.router.navigate(['/']);
          },
          error: (err) => console.error('Erro ao excluir conta:', err),
        });
    }
  }
}
