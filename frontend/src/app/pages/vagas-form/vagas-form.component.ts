import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VagasService } from '../..//services/vagas.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vagas-form',
  templateUrl: './vagas-form.component.html',
})
export class VagasFormComponent {
  vagaForm: FormGroup;
  erro = '';

  constructor(
    private fb: FormBuilder,
    private vagasService: VagasService,
    private router: Router
  ) {
    this.vagaForm = this.fb.group({
      titulo: ['', Validators.required],
      descricao: ['', Validators.required],
      localidade: ['', Validators.required],
    });
  }

  salvar() {
    if (this.vagaForm.invalid) {
      this.vagaForm.markAllAsTouched();
      return;
    }

    this.vagasService.criarVaga(this.vagaForm.value).subscribe({
      next: () => this.router.navigate(['/vagas']),
      error: () => this.erro = 'Erro ao criar vaga. Verifique se está autenticado como ofertante.',
    });
  }
}
