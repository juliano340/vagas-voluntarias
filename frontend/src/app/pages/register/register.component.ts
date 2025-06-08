import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.prod'; // Adjust the import path as necessary
// import { environment } from ''../../../environments/environment'; // Uncomment this line if you want to use the local environment

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  registerForm: FormGroup;
  erro = '';
  private readonly apiUrl = environment.apiUrl;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['candidato', Validators.required],
    });
  }

  cadastrar() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.http.post(`${this.apiUrl}/users`, this.registerForm.value).subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => (this.erro = 'Erro ao cadastrar. Tente novamente.'),
    });
  }
}
