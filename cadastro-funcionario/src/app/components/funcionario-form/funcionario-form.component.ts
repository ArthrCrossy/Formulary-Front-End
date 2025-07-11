// src/app/components/funcionario-form/funcionario-form.component.ts
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
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
  selectedFile: File | null = null;
  carregando = false;


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

  @ViewChild('fileInput') fileInput: ElementRef | undefined;

  openFileSelector() {
    // Se não houver arquivo selecionado, abre o seletor de arquivo
    if (!this.selectedFile) {
      // Programaticamente clica no input de arquivo
      // @ts-ignore
      this.fileInput.nativeElement.click();
    } else {
      // Se já tiver um arquivo selecionado, envia diretamente
      this.sendPDF();
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // Verifica se o arquivo é um PDF
      if (file.type !== 'application/pdf') {
        this.mensagemErro = "Por favor, selecione apenas arquivos PDF.";
        input.value = ''; // Limpa o input
        this.selectedFile = null;
        return;
      }

      // Verifica o tamanho do arquivo (limite de 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB em bytes
      if (file.size > maxSize) {
        this.mensagemErro = "O arquivo é muito grande. O tamanho máximo permitido é 5MB.";
        input.value = ''; // Limpa o input
        this.selectedFile = null;
        return;
      }

      // Se passar nas validações, armazena o arquivo
      this.selectedFile = file;
      this.mensagemErro = '';
      console.log(`Arquivo selecionado: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`);
    } else {
      this.selectedFile = null;
    }
  }




  /**
   * Envia um arquivo PDF para o backend junto com os dados do funcionário
   * O funcionário será criado no backend e o PDF anexado ao seu cadastro
   */
  sendPDF() {

    console.log('Enviando arquivo PDF...');

     /*
    // Verifica se o formulário está válido
    if (this.funcionarioForm.invalid) {
      this.mensagemErro = "Preencha corretamente todos os campos obrigatórios antes de enviar.";
      console.log('PDF INVALIDO');
      return;
    }*/

    // Verifica se um arquivo foi selecionado
    if (!this.selectedFile) {
      this.mensagemErro = "Selecione um arquivo PDF para enviar.";
      console.log('Nãoo arquivo selecionado');
      return;
    }

    // Cria um objeto FormData para enviar tanto o arquivo quanto os dados do formulário
    const formData = new FormData();

    // Adiciona o arquivo PDF ao FormData
    formData.append('file', this.selectedFile, this.selectedFile.name);

    console.log("oi")

    // Adiciona os dados do funcionário do formulário ao FormData
    const funcionarioData = this.funcionarioForm.value;
    Object.keys(funcionarioData).forEach(key => {
      // Converte datas para o formato esperado pelo backend (se necessário)
      if (key === 'dataContratacao' && funcionarioData[key]) {
        const data = new Date(funcionarioData[key]);
        formData.append(key, data.toISOString().split('T')[0]);
      } else {
        formData.append(key, funcionarioData[key]);
      }
    });

    // Exibe mensagem de carregamento
    this.carregando = true;
    this.mensagemErro = '';
    this.mensagemSucesso = '';

    this.http.post('http://localhost:8080/api/files/upload', formData, {
      responseType: 'text' // Esta é a alteração principal
    })
      .subscribe(
        (response: any) => {
          this.carregando = false;
          this.mensagemSucesso = "Funcionário cadastrado com sucesso! O documento PDF foi anexado.";

          // Limpa o formulário e o arquivo selecionado
          this.onReset();

          console.log('Resposta do servidor:', response);
        },
        (error) => {
          // Resto do código de tratamento de erro permanece igual
          this.carregando = false;

          // Tratamento específico de erros
          if (error.status === 413) {
            this.mensagemErro = "O arquivo PDF é muito grande. O tamanho máximo permitido é 5MB.";
          } else if (error.status === 415) {
            this.mensagemErro = "Formato de arquivo inválido. Apenas PDFs são aceitos.";
          } else if (error.status === 400) {
            this.mensagemErro = "Dados inválidos. Verifique o formulário e tente novamente.";
          } else {
            this.mensagemErro = "Erro ao cadastrar funcionário: " +
              (error.error?.mensagem || "Não foi possível conectar ao servidor");
          }

          console.error('Erro ao enviar dados:', error);
        }
      );
  }
}
