import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  products: any[] = [];
  display: boolean = false; 
  selectedImage: string = '';

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.http.get<any[]>('assets/products.json').subscribe(data => {
      this.products = data.map(product => ({
        ...product,
        isFavorite: false
      }));
  
      const favoriteProducts = JSON.parse(localStorage.getItem('favoriteProducts') || '[]');
      this.products.forEach(product => {
        if (favoriteProducts.find((fav: { productName: any; }) => fav.productName === product.productName)) {
          product.isFavorite = true;
        }
      });
    });
  }

  toggleFavorite(product: any): void {
    product.isFavorite = !product.isFavorite;
    this.updateFavoriteProducts();
  }
  
  updateFavoriteProducts(): void {
    const favoriteProducts = this.products.filter(p => p.isFavorite);
    localStorage.setItem('favoriteProducts', JSON.stringify(favoriteProducts));
  }

  viewDetails(product: any): void {
    this.router.navigate(['/product-detail', product.productName]);
  }

  showImage(image: string): void {
    this.selectedImage = image; 
    this.display = true; 
  }
}
