import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
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
  vagasComMensagens: number[] = [];

  @ViewChild('toastSucesso', { static: false }) toastSucesso!: ElementRef;

  constructor(private vagasService: VagasService, private router: Router) {}

  ngOnInit() {
    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.resetarEstado();
        this.carregarDados();
      }
    });

    this.resetarEstado();
    this.carregarDados();

    if (this.isCandidato) {
      this.vagasService.vagasComMensagensRecebidas().subscribe({
        next: (ids) => (this.vagasComMensagens = ids),
        error: () => (this.vagasComMensagens = []),
      });
    }
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  resetarEstado() {
    this.vagas = [];
    this.vagasCandidatadas = [];
    this.isLogado = false;
    this.isCandidato = false;
  }

  carregarDados() {
    console.clear();

    const token = localStorage.getItem('token');
    this.isLogado = !!token;

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.isCandidato = payload.role === 'candidato';
      } catch (error) {
        console.error('[DEBUG] Erro ao decodificar token:', error);
      }
    }

    if (this.isCandidato) {
      this.vagasService.vagasCandidatadas().subscribe({
        next: (ids: number[]) => {
          this.vagasCandidatadas = ids.map(Number);
          this.buscar();
        },
        error: (err) => {
          console.error('[DEBUG] Erro ao buscar vagas candidatadas:', err);
          this.vagasCandidatadas = [];
          this.buscar();
        },
      });
    } else {
      this.vagasCandidatadas = [];
      this.buscar();
    }
  }

  buscar() {
    this.vagasService
      .listarVagas({ titulo: this.titulo, localidade: this.localidade })
      .subscribe((data: any[]) => {
        this.vagas = data;
      });
  }

  candidatar(id: number) {
    if (!this.isLogado || !this.isCandidato) {
      alert('Você precisa estar logado como candidato para se candidatar.');
      return;
    }

    this.vagasService.candidatarSe(id).subscribe({
      next: () => {
        this.vagasService.vagasCandidatadas().subscribe((ids) => {
          this.vagasCandidatadas = ids.map(Number);
        });
        this.mostrarToastSucesso();
      },
      error: (err) => {
        if (err.status === 409) {
          alert('Você já se candidatou a esta vaga.');
          this.vagasService.vagasCandidatadas().subscribe((ids) => {
            this.vagasCandidatadas = ids.map(Number);
          });
        } else {
          alert('Erro ao realizar candidatura.');
        }
      },
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
