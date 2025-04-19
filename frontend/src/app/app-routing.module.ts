import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { VagasComponent } from './pages/vagas/vagas.component';
import { VagasFormComponent } from './pages/vagas-form/vagas-form.component';
import { AuthGuard } from './guards/auth.guard';
import { MinhasVagasComponent } from './pages/minhas-vagas/minhas-vagas.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { LandingComponent } from './pages/landing/landing.component';



const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent },  
  { path: 'vagas', component: VagasComponent },  
  { path: 'register', component: RegisterComponent },
  { path: 'vagas/nova', component: VagasFormComponent, canActivate: [AuthGuard] },
  { path: 'minhas-vagas', component: MinhasVagasComponent, canActivate: [AuthGuard] },
  { path: 'vagas/:id/editar',component: VagasFormComponent, canActivate: [AuthGuard]},
  { path: 'perfil', component: PerfilComponent }

  



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
