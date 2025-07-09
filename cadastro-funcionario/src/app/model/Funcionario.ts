// src/app/models/funcionario.model.ts
export interface Funcionario {
  id?: number;
  nome: string;
  email: string;
  telefone: string;
  cargo: string;
  dataContratacao: string; // Formato ISO para compatibilidade com Java
  salario: number;
  departamento: string;
  ativo: boolean;
}
