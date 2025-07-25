import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule
  ]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  carregando = false;
  mensagemErro: string = '';
  mensagemSucesso: string = '';
  mostrarSenha = false;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      lembrar: [false]
    });
  }

  ngOnInit(): void {
    // Verifica se há credenciais salvas localmente
    const savedEmail = localStorage.getItem('savedEmail');
    if (savedEmail) {
      this.loginForm.patchValue({
        email: savedEmail,
        lembrar: true
      });
    }
  }

  // Getter para acesso fácil aos controles do formulário
  get f() {
    return this.loginForm.controls;
  }

  toggleMostrarSenha() {
    this.mostrarSenha = !this.mostrarSenha;
  }

  onSubmit() {
    this.submitted = true;
    this.mensagemErro = '';
    this.mensagemSucesso = '';

    // Verifica se o formulário é válido
    if (this.loginForm.invalid) {
      return;
    }

    this.carregando = true;

    // Dados para envio
    const credenciais = {
      email: this.loginForm.value.email,
      senha: this.loginForm.value.senha
    };

    // Salva email se a opção "lembrar" estiver marcada
    if (this.loginForm.value.lembrar) {
      localStorage.setItem('savedEmail', credenciais.email);
    } else {
      localStorage.removeItem('savedEmail');
    }

    // Endpoint de login (substitua pela URL correta do seu backend)
    this.http.post<any>('http://localhost:8080/api/auth/login', credenciais)
      .pipe(
        catchError(erro => {
          this.carregando = false;

          if (erro.status === 401) {
            this.mensagemErro = 'Email ou senha incorretos. Tente novamente.';
          } else if (erro.status === 0) {
            this.mensagemErro = 'Não foi possível conectar ao servidor. Verifique sua conexão.';
          } else {
            this.mensagemErro = 'Erro ao fazer login. Por favor, tente novamente mais tarde.';
          }

          console.error('Erro de login:', erro);
          return of(null);
        })
      )
      .subscribe(resposta => {
        if (resposta) {
          // Armazena o token de autenticação
          localStorage.setItem('authToken', resposta.token);

          this.mensagemSucesso = 'Login realizado com sucesso! Redirecionando...';

          // Redireciona após login bem-sucedido (com pequeno atraso para mostrar mensagem)
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 1000);
        }

        this.carregando = false;
      });
  }
}
