import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { VagasService } from '../../services/vagas.service';
import { Toast } from 'bootstrap';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-vagas',
  templateUrl: './vagas.component.html',
})
export class VagasComponent implements OnInit, OnDestroy {
  vagas: any[] = [];
  titulo = '';
  localidade = '';
  isLogado = false;
  isCandidato = false;
  vagasCandidatadas: number[] = [];
  routerSubscription!: Subscription;

  @ViewChild('toastSucesso', { static: false }) toastSucesso!: ElementRef;

  constructor(private vagasService: VagasService, private router: Router) {}

  ngOnInit() {
    this.carregarDados();

    // Recarrega os dados sempre que a rota for acessada novamente
    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.carregarDados();
      }
    });
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  carregarDados() {
    console.clear(); // limpa o console pra facilitar a leitura
    console.log('%c[DEBUG] 🚀 carregando dados...', 'color: cyan');
  
    this.vagas = [];
    this.vagasCandidatadas = [];
    this.isLogado = false;
    this.isCandidato = false;
  
    const token = localStorage.getItem('token');
    this.isLogado = !!token;
    console.log('[DEBUG] Token encontrado?', token ? 'SIM' : 'NÃO');
  
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.isCandidato = payload.role === 'candidato';
        console.log('[DEBUG] Usuário é candidato?', this.isCandidato);
        console.log('[DEBUG] Payload do token:', payload);
      } catch (error) {
        console.error('[DEBUG] Erro ao decodificar token:', error);
      }
    }
  
    if (this.isCandidato) {
      this.vagasService.vagasCandidatadas().subscribe({
        next: (ids: number[]) => {
          this.vagasCandidatadas = ids;
          console.log('[DEBUG] IDs das vagas já candidatadas:', this.vagasCandidatadas);
          this.buscar();
        },
        error: (err) => {
          console.error('[DEBUG] Erro ao buscar vagas candidatadas:', err);
          this.vagasCandidatadas = [];
          this.buscar();
        }
      });
    } else {
      this.vagasCandidatadas = [];
      this.buscar();
    }
  }
  

  buscar() {
    console.log('[DEBUG] Buscando vagas com filtros:', {
      titulo: this.titulo,
      localidade: this.localidade,
    });
  
    this.vagasService.listarVagas({ titulo: this.titulo, localidade: this.localidade })
      .subscribe((data: any[]) => {
        this.vagas = data;
        console.log('[DEBUG] Vagas carregadas:', this.vagas);
      });
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
    const toastBootstrap = new Toast(toastElement, {
      delay: 2000,
      autohide: true,
    });

    toastBootstrap.show();
  }
}
