// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

// @ts-ignore
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FuncionarioFormComponent } from './components/funcionario-form/funcionario-form.component';

@NgModule({
  declarations: [

    // Adicione outros componentes aqui
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule,
    FuncionarioFormComponent,
    AppComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})


export class AppModule { }
