import { Component, OnInit } from '@angular/core';
import { VagasService } from '../../services/vagas.service';
import { ViewChild, ElementRef } from '@angular/core';
import { Toast, Modal } from 'bootstrap';


@Component({
  selector: 'app-minhas-vagas',
  templateUrl: './minhas-vagas.component.html',
})
export class MinhasVagasComponent implements OnInit {
  vagas: any[] = [];
  candidatos: any[] = [];
  vagaSelecionadaId: number = 0;


  @ViewChild('candidatosModal', { static: false }) modalElement!: ElementRef;
  @ViewChild('toastErro', { static: false }) toastErro!: ElementRef;


  constructor(private vagasService: VagasService) {}

  ngOnInit() {
    this.vagasService.minhasVagas().subscribe((res: any[]) => {
      this.vagas = res;
    });
  }

  excluir(id: number) {
    if (confirm('Ao excluir esta vaga, todas as candidaturas e mensagens relacionadas também serão removidas. Deseja continuar?')) {
      this.vagasService.removerVaga(id).subscribe({
        next: () => {
          this.vagas = this.vagas.filter(v => v.id !== id);
        },
        error: (err) => {
          console.error('Erro ao excluir vaga:', err);
        }
      });
    }
  }  

  mostrarToastErro() {
    const toastElement = this.toastErro.nativeElement;
    const toastBootstrap = new Toast(toastElement, { delay: 3000, autohide: true });
    toastBootstrap.show();
  }

  abrirCandidatos(vagaId: number) {
    this.vagaSelecionadaId = vagaId;
    this.vagasService.listarCandidatos(vagaId).subscribe({
      next: (data) => {
        this.candidatos = data;
        const modal = new Modal(document.getElementById('candidatosModal')!);
        modal.show();
      },
      error: (err) => console.error('Erro ao buscar candidatos:', err)
    });
  }
  
  
  
}
