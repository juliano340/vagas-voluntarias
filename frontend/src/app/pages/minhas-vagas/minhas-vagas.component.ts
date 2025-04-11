import { Component, OnInit } from '@angular/core';
import { VagasService } from '../../services/vagas.service';

@Component({
  selector: 'app-minhas-vagas',
  templateUrl: './minhas-vagas.component.html',
})
export class MinhasVagasComponent implements OnInit {
  vagas: any[] = [];

  constructor(private vagasService: VagasService) {}

  ngOnInit() {
    this.vagasService.minhasVagas().subscribe((res: any[]) => {
      this.vagas = res;
    });
  }

  excluir(id: number) {
    if (confirm('Deseja realmente excluir esta vaga?')) {
      this.vagasService.removerVaga(id).subscribe(() => {
        this.vagas = this.vagas.filter(v => v.id !== id);
      });
    }
  }
}
