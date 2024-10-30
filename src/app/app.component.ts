import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title: string = '';
  constructor(private router: Router) {
    // Rota değişikliklerini dinleyerek başlığı ayarla
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.setTitleBasedOnRoute(event.urlAfterRedirects);
      }
    });
  }
  setTitleBasedOnRoute(url: string): void {
    if (url.includes('/product-list')) {
      this.title = 'Ürün Liste';
    } else if (url.includes('/product-detail')) {
      this.title = 'Ürün Detay';
    } else if (url.includes('/favorites')) {
      this.title = 'Favori Liste';
    } else if (url.includes('/cart')) {
      this.title = 'Sepet';
    } else {
      this.title = 'Anasayfa';
    }
  }
}
