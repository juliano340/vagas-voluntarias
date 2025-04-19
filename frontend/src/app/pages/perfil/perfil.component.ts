import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html'
})
export class PerfilComponent implements OnInit {
  usuario: any;
  modoEdicao: boolean = false; 

  constructor(private http: HttpClient, private router: Router) {}

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
        this.modoEdicao = false; 
      },
      error: (err) => console.error('Erro ao salvar perfil:', err)
    });
  }

  confirmarExclusaoConta() {
    if (confirm('Tem certeza que deseja excluir sua conta? Todos os seus dados serão apagados permanentemente.')) {
      const token = localStorage.getItem('token');
      this.http.delete('http://localhost:3000/users/me', {
        headers: { Authorization: `Bearer ${token}` }
      }).subscribe({
        next: () => {
          alert('Conta excluída com sucesso.');
          localStorage.removeItem('token');
          this.router.navigate(['/']);
        },
        error: (err) => console.error('Erro ao excluir conta:', err)
      });
    }
  }
  
}
