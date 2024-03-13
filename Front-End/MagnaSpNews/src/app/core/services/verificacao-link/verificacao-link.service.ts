import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VerificacaoLinkService {

  constructor(private http: HttpClient) { }

  verificarLink(link: string): Observable<boolean> {
    return this.http.get(link).pipe(
      map((response: any) => response.status === 'success'),
      catchError(() => of(false))
    );
  }
}
