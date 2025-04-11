import { Component, OnInit } from '@angular/core';
import { VagasService } from '../../services/vagas.service';

@Component({
  selector: 'app-vagas',
  templateUrl: './vagas.component.html',
})
export class VagasComponent implements OnInit {
  vagas: any[] = [];
  titulo = '';
  localidade = '';

  constructor(private vagasService: VagasService) {}

  ngOnInit() {
    this.buscar();
  }

  buscar() {
    this.vagasService.listarVagas({ titulo: this.titulo, localidade: this.localidade })
    .subscribe((data: any[]) => this.vagas = data);
  }
}
