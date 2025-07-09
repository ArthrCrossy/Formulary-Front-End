// src/app/app.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FuncionarioFormComponent } from './components/funcionario-form/funcionario-form.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FuncionarioFormComponent
  ],
  template: `
    <div class="container mt-5">
      <h1>Cadastro de Funcionários</h1>
      <app-funcionario-form></app-funcionario-form>
    </div>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Cadastro de Funcionários';
}
