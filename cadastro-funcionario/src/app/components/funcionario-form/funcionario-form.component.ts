// src/app/components/funcionario-form/funcionario-form.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-funcionario-form',
  templateUrl: './funcionario-form.component.html',
  styleUrls: ['./funcionario-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule
  ]
})
export class FuncionarioFormComponent implements OnInit {
  funcionarioForm: FormGroup;
  submitted = false;
  mensagemErro: string = '';
  mensagemSucesso: string = '';
  departamentos = ['RH', 'TI', 'Financeiro', 'Marketing', 'Operações'];
  private apiUrl = 'http://localhost:8080/api/funcionarios';


  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient
  ) {
    this.funcionarioForm = this.formBuilder.group({
      nomeCompleto: ['', Validators.required],
      email: ['', Validators.required],
      telefone: ['', Validators.required,],
      cargo: ['', Validators.required],
      departamento: ['', Validators.required],
      dataContratacao: ['', Validators.required],
      salario: ['', Validators.required],
      ativo: [true]
    });
  }

  ngOnInit(): void {
    // Inicialização adicional se necessário
  }

  get f() {
    return this.funcionarioForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    this.mensagemErro = '';
    this.mensagemSucesso = '';

    if (this.funcionarioForm.invalid) {
      return;
    }

    const dadosParaEnvio = {...this.funcionarioForm.value};

    if (dadosParaEnvio.telefone) {
      dadosParaEnvio.telefone = dadosParaEnvio.telefone.replace(/\D/g, '');
    }

    if (dadosParaEnvio.dataContratacao) {
      const data = new Date(dadosParaEnvio.dataContratacao);
      dadosParaEnvio.dataContratacao = data.toISOString().split('T')[0];
    }

    if (dadosParaEnvio.salario) {
      dadosParaEnvio.salario = parseFloat(dadosParaEnvio.salario);
    }

    console.log('Dados a serem enviados:', dadosParaEnvio);

    // Use dadosParaEnvio em vez de this.funcionarioForm.value
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

this.http.post(this.apiUrl, dadosParaEnvio, { headers })
      .pipe(
        catchError(error => {
          console.error('Erro completo:', error);
          console.error('Detalhes do erro:', error.error);

          // Tentar extrair mensagem de erro mais específica
          if (error.error && error.error.message) {
            this.mensagemErro = `Erro: ${error.error.message}`;
          } else if (error.error && typeof error.error === 'string') {
            this.mensagemErro = `Erro: ${error.error}`;
          } else {
            this.mensagemErro = 'Erro ao cadastrar funcionário. Tente novamente.';
          }

          return of(null);
        })
      )
      .subscribe(response => {
        if (response) {
          console.log('Resposta da API:', response);
          this.mensagemSucesso = 'Funcionário cadastrado com sucesso!';
          this.submitted = false;
          this.funcionarioForm.reset();
          // Restaura o valor padrão de ativo como true após resetar
          this.funcionarioForm.patchValue({
            ativo: true
          });
        }
      });
  }

  // Adicionando o método onReset
  onReset() {
    this.submitted = false;
    this.mensagemErro = '';
    this.mensagemSucesso = '';
    this.funcionarioForm.reset();
    // Restaura o valor padrão de ativo como true após resetar
    this.funcionarioForm.patchValue({
      ativo: true
    });
  }
}
