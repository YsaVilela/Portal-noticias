import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sobre-nos',
  templateUrl: './sobre-nos.component.html',
  styleUrl: './sobre-nos.component.css'
})
export class SobreNosComponent implements OnInit{
  ngOnInit(): void {
    window.scrollTo(0, 0);
  }

}
