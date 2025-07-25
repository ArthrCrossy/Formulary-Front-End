import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { FuncionarioFormComponent } from './components/funcionario-form/funcionario-form.component';

export const routes: Routes = [
  // Rota para a página de login
  { path: 'login', component: LoginComponent },

  // Rota para o formulário de funcionários
  { path: 'funcionarios', component: FuncionarioFormComponent },

  // Redireciona a raiz para a página de login
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  // Rota wildcard - redireciona qualquer rota não encontrada para login
  { path: '**', redirectTo: '/login' }
];
