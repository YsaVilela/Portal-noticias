import { Component, HostListener, OnInit } from '@angular/core';
import { NoticiaService } from '../../core/services/noticia/noticia.service';
import { HttpErrorResponse } from '@angular/common/http';
import { PreviaNoticia } from '../../core/models/previa-noticia';
import { NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs';
import { VerificarApiService } from '../../core/services/verificacao-api/verificar-api.service';

@Component({
  selector: 'app-tela-inicio',
  templateUrl: './tela-inicio.component.html',
  styleUrl: './tela-inicio.component.css',
})
export class TelaInicioComponent implements OnInit {
  tempoInativo!: ReturnType<typeof setTimeout>;
  principaisNoticias: PreviaNoticia[] = [];
  paginaPrincipaisNoticias: number = 0;
  maisLidas: PreviaNoticia[] = [];
  paginaMaisLidas: number = 0;
  ultimasNoticias: PreviaNoticia[] = [];
  paginaUltimasNoticias: number = 0;
  previasCards: PreviaNoticia[] = [];
  paginaPreviasCards: number = 0;
  possuiMaisNoticias: boolean = true;
  loading: boolean = false;
  loadingInicial: boolean = true;

  constructor(
    private noticiaService: NoticiaService,
    private router: Router,
    private verificarApiService: VerificarApiService
  ) { }

  @HostListener('document:mousemove', ['$event'])
  @HostListener('document:keypress', ['$event'])
  @HostListener('window:scroll', ['$event'])
  reiniciarContador() {
    clearTimeout(this.tempoInativo);
    this.tempoInativo = setTimeout(() => {
      location.reload();
    }, 300000);
  }

  desativarContador() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationStart))
      .subscribe(() => {
        clearTimeout(this.tempoInativo);
      });
  }

  ngOnInit(): void {
    this.verificarApiService.verificarConexao();

    this.reiniciarContador();
    this.desativarContador();

    this.buscarPrincipaisNoticias(this.paginaPrincipaisNoticias);
    this.buscarUltimasNoticias(this.paginaUltimasNoticias);
    this.buscarMaisLidas(this.paginaMaisLidas);
    this.buscarTodasPrevias();
  }

  verMaisNoticias() {
    this.loading = true;
    this.paginaPreviasCards++;
    this.buscarTodasPrevias();
  }

  buscarPrincipaisNoticias(pagina: number) {
    this.noticiaService.listarPreviasPrincipaisNoticias(pagina).subscribe({
      next: (noticias) => {
        this.principaisNoticias.push(...noticias.content);
        this.loadingInicial = false;
        if (this.principaisNoticias.length < 3) {
          this.buscarPrincipaisNoticias(++pagina)
        }
      },
      error: (error: HttpErrorResponse) => {
        this.loadingInicial = false;
      },
    });
  }

  buscarUltimasNoticias(pagina: number) {
    this.noticiaService.listarPreviasUltimasNoticias(pagina).subscribe({
      next: (noticias) => {
        noticias.content.forEach((previa) => {
          if (this.ultimasNoticias.length < 5) {
            this.ultimasNoticias.push(previa);
          }
        });
        this.loadingInicial = false;
        if (this.ultimasNoticias.length < 5) {
          this.buscarUltimasNoticias(++pagina)
        }
      },
      error: (error: HttpErrorResponse) => {
        this.loadingInicial = false;
      },
    });
  }

  buscarMaisLidas(pagina: number) {
    this.noticiaService.listarPreviasMaisLidas(pagina).subscribe({
      next: (noticias) => {
        noticias.content.forEach((previa) => {
          if (this.maisLidas.length < 5) {
            this.maisLidas.push(previa);
          }
        });
        this.loadingInicial = false;
        if (this.maisLidas.length < 5) {
          this.buscarMaisLidas(++pagina)
        }
      },
      error: (error: HttpErrorResponse) => {
        this.loadingInicial = false;
      },
    });
  }

  buscarTodasPrevias() {
    this.noticiaService
      .listarTodasPrevias(this.paginaPreviasCards)
      .subscribe({
        next: (noticias) => {
          if (!noticias.empty) {
            this.previasCards.push(...noticias.content);
          } else {
            this.possuiMaisNoticias = false;
          }
          this.loading = false;
        },
        error: (error: HttpErrorResponse) => {
          this.loading = false;
        },
      });
  }
}
