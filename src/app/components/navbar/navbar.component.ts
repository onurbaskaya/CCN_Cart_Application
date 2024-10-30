import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  items: MenuItem[] = [];

  ngOnInit() {
    this.items = [
      {
        label: 'Ürünler',
        icon: 'pi pi-fw pi-tags',
        routerLink: '/products' 
      },
      {
        label: 'Favori Ürünler',
        icon: 'pi pi-fw pi-heart',
        routerLink: '/favorites' 
      },
      {
        label: 'Sepet',
        icon: 'pi pi-fw pi-shopping-cart',
        routerLink: '/cart'
      }
    ];
  }
}
