// 📁 src/app/pages/vagas-form/vagas-form.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VagasService } from '../../services/vagas.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-vagas-form',
  templateUrl: './vagas-form.component.html',
})
export class VagasFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  vagaId?: number;
  erro = '';

  constructor(
    private fb: FormBuilder,
    private vagasService: VagasService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      titulo: ['', Validators.required],
      descricao: ['', Validators.required],
      localidade: ['', Validators.required],
    });

    this.vagaId = Number(this.route.snapshot.paramMap.get('id'));
    this.isEdit = !!this.vagaId;

    if (this.isEdit) {
      this.vagasService.buscarVaga(this.vagaId).subscribe((vaga: any) => {
        this.form.patchValue({
          titulo: vaga.titulo,
          descricao: vaga.descricao,
          localidade: vaga.localidade,
        });
      });
    }
  }

  salvar(): void {
    if (this.form.invalid) return;

    if (this.isEdit) {
      this.vagasService.atualizarVaga(this.vagaId!, this.form.value).subscribe({
        next: () => this.router.navigate(['/minhas-vagas']),
        error: () => this.erro = 'Erro ao atualizar a vaga.'
      });
    } else {
      this.vagasService.criarVaga(this.form.value).subscribe({
        next: () => this.router.navigate(['/minhas-vagas']),
        error: () => this.erro = 'Erro ao criar a vaga.'
      });
    }
  }
}
