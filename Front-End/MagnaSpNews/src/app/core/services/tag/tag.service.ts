import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaginacaoTag } from '../../models/paginacaoTag';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class TagService {

  private readonly API = environment.apiUrl;

  constructor(private http: HttpClient) {}

  buscarNomeTag(busca: string): Observable<PaginacaoTag>{
    const quantidadeDeTagsParaCarregar = 20;
    let params = new HttpParams()
    .set('size', quantidadeDeTagsParaCarregar);

    return this.http.get<PaginacaoTag>(`${this.API}/${busca}`, {params});
  }
}
