import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class VerificarApiService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router) { }

  verificarConexao(): void {
    this.http.get(this.apiUrl).pipe(
      catchError(error => {
        console.error('Erro ao conectar à API:', error);
        this.router.navigate(['/manutencao']); 
        return []; 
      })
    ).subscribe()
  }
}
