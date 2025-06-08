import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { VagasComponent } from './pages/vagas/vagas.component';
import { VagasFormComponent } from './pages/vagas-form/vagas-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from './components/navbar/navbar.component';
import { MinhasVagasComponent } from './pages/minhas-vagas/minhas-vagas.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { RouterModule } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { MensagensComponent } from './pages/mensagens/mensagens.component';
import { ApiStatusComponent } from './components/api-status/api-status.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    VagasComponent,
    VagasFormComponent,
    NavbarComponent,
    MinhasVagasComponent,
    PerfilComponent,
    LandingComponent,
    MensagensComponent,
    ApiStatusComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
