import { Component, OnInit } from '@angular/core';
import { VagasService } from '../../services/vagas.service';
import { ViewChild, ElementRef } from '@angular/core';
import { Toast } from 'bootstrap';

@Component({
  selector: 'app-minhas-vagas',
  templateUrl: './minhas-vagas.component.html',
})
export class MinhasVagasComponent implements OnInit {
  vagas: any[] = [];
  @ViewChild('toastErro', { static: false }) toastErro!: ElementRef;


  constructor(private vagasService: VagasService) {}

  ngOnInit() {
    this.vagasService.minhasVagas().subscribe((res: any[]) => {
      this.vagas = res;
    });
  }

  excluir(id: number) {
    if (confirm('Deseja realmente excluir esta vaga?')) {
      this.vagasService.removerVaga(id).subscribe({
        next: () => {
          this.vagas = this.vagas.filter(v => v.id !== id);
        },
        error: (err) => {
          if (err.status === 409) {
            this.mostrarToastErro(); // mostra toast se houver conflito
          } else {
            console.error('Erro ao excluir vaga:', err);
          }
        }
      });
    }
  }
  

  mostrarToastErro() {
    const toastElement = this.toastErro.nativeElement;
    const toastBootstrap = new Toast(toastElement, { delay: 3000, autohide: true });
    toastBootstrap.show();
  }
  
}
