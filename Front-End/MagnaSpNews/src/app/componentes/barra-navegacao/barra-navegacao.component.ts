import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-barra-navegacao',
  templateUrl: './barra-navegacao.component.html',
  styleUrl: './barra-navegacao.component.css',
})
export class BarraNavegacaoComponent {
  constructor(private router: Router) {}

  portais: String[] = ["G1", "UOL", "CNN", "GOV", "VEJA"]

  redirecionar(nomePortal: String) {
    this.router.navigate([`noticias/${nomePortal}`]);
  }
}
