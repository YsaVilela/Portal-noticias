import { Component, Input, OnInit } from '@angular/core';
import { PreviaNoticia } from '../../core/models/previa-noticia';
import { Router } from '@angular/router';
import { RoteamentoService } from '../../core/services/rotas/roteamento.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-principais-noticias',
  templateUrl: './principais-noticias.component.html',
  styleUrl: './principais-noticias.component.css',
})
export class PrincipaisNoticiasComponent implements OnInit {
  constructor(
    private router: Router,
    private dadosRotas: RoteamentoService,
    private sanitizer: DomSanitizer
  ) { }

  @Input() previas: PreviaNoticia[] = [];

  imagensInjetaveis: SafeHtml[] = [];

  ngOnInit(): void {
    for (let i = 0; i < this.previas.length; i++) {
      this.sanitizar(i , this.previas[i].imagemCapa)
    }
  }

  sanitizar(index: number, imagem: string) {
    const regex = /https?:\/\/\S+(?=\b)/g;
    const linkImagem = imagem.match(regex);

    if (linkImagem) {
      this.imagensInjetaveis[index] = this.sanitizer.bypassSecurityTrustHtml(
        imagem
      )
    } else {
      this.inserirImagemDefaulf(index);
    }
  }

  inserirImagemDefaulf(index: number) {
    this.imagensInjetaveis[index] = this.sanitizer.bypassSecurityTrustHtml(
      "<img src='../../../assets/images/imagem-indisponivel.png' alt='Imagem Indisponivel'/>"
    );
  }

  exibirNoticia(noticia: PreviaNoticia) {
    this.dadosRotas.setIdNoticia(noticia.id);
    this.router.navigate([`/noticia/${noticia.siteBuscado}/${noticia.dataPublicacao}/${noticia.titulo.replace(/ /g, '_')}`]);
  }
}
