import { Component, OnInit, Input } from '@angular/core';
import { PreviaNoticia } from '../../core/models/previa-noticia';
import { Router } from '@angular/router';
import { RoteamentoService } from '../../core/services/rotas/roteamento.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-previa-noticia',
  templateUrl: './previa-noticia.component.html',
  styleUrl: './previa-noticia.component.css',
})
export class PreviaNoticiaComponent implements OnInit {
  constructor(
    private router: Router,
    private dadosRotas: RoteamentoService,
    private sanitizer: DomSanitizer
  ) {}

  @Input() previa: PreviaNoticia = {
    id: 0,
    titulo: '',
    sinopse: '',
    dataPublicacao: '',
    imagemCapa: '',
    siteBuscado: '',
  };

  imagemCapaInjetavel!: SafeHtml;
  limiteDeCaracteres!: number;
  ngOnInit(): void {
    if (window.innerWidth < 426) {
      this.limiteDeCaracteres = 150;
    } else {
      this.limiteDeCaracteres = 390;
    }

    setTimeout(() => {
      this.imagemCapaInjetavel = this.sanitizer.bypassSecurityTrustHtml(
        this.previa.imagemCapa
      );
    }, 50);
  }

  exibirNoticia() {
    this.dadosRotas.setIdNoticia(this.previa.id);
    this.router.navigate([
      `/noticia/${this.previa.siteBuscado}/${
        this.previa.dataPublicacao
      }/${this.previa.titulo.replace(/ /g, '_')}`,
    ]);
  }

  buscarSite() {
    this.router.navigate([`/noticias/${this.previa.siteBuscado}`]);
  }
}