import { Component, OnInit } from '@angular/core';
import { VagasService } from '../../services/vagas.service';
import { ViewChild, ElementRef } from '@angular/core';
import { Toast } from 'bootstrap';

@Component({
  selector: 'app-vagas',
  templateUrl: './vagas.component.html',
})
export class VagasComponent implements OnInit {
  vagas: any[] = [];
  titulo = '';
  localidade = '';
  isLogado = false;
  isCandidato = false;
  vagasCandidatadas: number[] = [];
  @ViewChild('toastSucesso', { static: false }) toastSucesso!: ElementRef;


  constructor(private vagasService: VagasService) {}

  ngOnInit() {
    const token = localStorage.getItem('token');
    this.isLogado = !!token;
  
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.isCandidato = payload.role === 'candidato';
      } catch (error) {
        console.error('Erro ao decodificar o token:', error);
      }
    }
  
    if (this.isCandidato) {
      this.vagasService.vagasCandidatadas().subscribe({
        next: (ids: number[]) => {
          this.vagasCandidatadas = ids;
          this.buscar(); // busca as vagas depois que os IDs foram carregados
        },
        error: (err) => {
          console.error('Erro ao buscar vagas candidatadas:', err);
          this.buscar(); // mesmo com erro, carrega as vagas
        }
      });
    } else {
      this.buscar(); // se não é candidato, apenas busca
    }
  }
  

  buscar() {
    this.vagasService.listarVagas({ titulo: this.titulo, localidade: this.localidade })
      .subscribe((data: any[]) => this.vagas = data);
  }

  candidatar(id: number) {
    if (!this.isLogado || !this.isCandidato) {
      alert('Você precisa estar logado como candidato para se candidatar.');
      return;
    }
  
    this.vagasService.candidatarSe(id).subscribe({
      next: () => {
        this.vagasCandidatadas.push(id);
        this.mostrarToastSucesso();
      },
      error: (err) => {
        if (err.status === 409) {
          alert('Você já se candidatou a esta vaga.');
        } else {
          alert('Erro ao realizar candidatura.');
        }
      }
    });
  }
  

  mostrarToastSucesso() {
    const toastElement = this.toastSucesso.nativeElement;
  
    // Cria uma nova instância do toast Bootstrap com autohide em 2000ms
    const toastBootstrap = new Toast(toastElement, {
      delay: 2000, // tempo em ms
      autohide: true,
    });
  
    toastBootstrap.show();
  }
  
}
