import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { CartService } from '../../services/cart.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  product: any;
  carts: any[] = [];
  selectedCart: any;
  recommendedProducts: any[] = [];
  allProducts: any[] = [];
  selectedImage: string = '';
  display: boolean = false;
  private routeSub: Subscription = new Subscription();
  selectedCartName = new FormControl<string | null>(null); 

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute, private cartService: CartService) {}

  ngOnInit(): void {
    this.routeSub = this.route.paramMap.subscribe(() => {
      this.loadProductDetails();
    });
    const storedCarts = localStorage.getItem('carts');
    if (storedCarts) {
      this.carts = JSON.parse(storedCarts);
    }
    this.loadCarts();
    
    // Seçilen sepetin adını kontrol et
    this.selectedCartName.valueChanges.subscribe(selectedName => {
      this.selectedCart = this.carts.find(cart => cart.name === selectedName); // Düzeltildi
      console.log('Seçilen Sepet:', this.selectedCart); // Seçilen sepeti konsola yaz
    });
    
    this.loadAllProducts();
  }
  loadCarts(): void {
    this.carts = JSON.parse(localStorage.getItem('carts') || '[]');
    console.log('Yüklenen Sepetler:', this.carts);
}
  
  loadAllProducts(): void {
    this.http.get<any[]>('assets/products.json').subscribe(products => {
      this.allProducts = products;
    });
  }

  loadProductDetails(): void {
    const productName = this.route.snapshot.paramMap.get('productName'); 
    this.http.get<any[]>('assets/products.json').subscribe(products => {
      this.product = products.find(p => p.productName === productName);

      const favoriteProducts = JSON.parse(localStorage.getItem('favoriteProducts') || '[]');
      this.product.isFavorite = favoriteProducts.some((item: any) => item.productName === this.product.productName);
      
      this.recommendProducts(); 
    });
  }

  recommendProducts(): void {
    const favoriteProducts = JSON.parse(localStorage.getItem('favoriteProducts') || '[]');
    this.recommendedProducts = favoriteProducts.filter(
      (p: any) => p.productName !== this.product.productName
    );
  }

  
  onCartSelect(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedCartName.setValue(target.value);
  
    // Seçilen sepeti bul
    this.selectedCart = this.carts.find(cart => cart.name === this.selectedCartName.value); // Düzeltildi
  }

  addToCart(): void {
    if (!this.selectedCartName.value) {
        alert('Lütfen Önce Sepet Seçiniz');
        return;
    }
  
    const cartName = this.selectedCartName.value; // FormControl değerini al
    console.log('cartName:', cartName); // Log ile sepet ismini kontrol et
  
    // Seçilen sepeti bul 
    const cart = this.carts.find(c => c.name === cartName);
    if (!cart) {
        alert('Sepet bulunamadı!');
        return;
    }
  
    // Ürün sepete ekleme mantığı
    const existingCartItem = cart.products.find((item: any) => item.productName === this.product.productName);
  
    if (existingCartItem) {
        existingCartItem.quantity += 1; // Ürünün miktarını artır
    } else {
        const newCartItem = {
            productName: this.product.productName,
            productPrice: this.product.productPrice,
            quantity: 1, // İlk kez eklendiğinde miktarı 1 olarak ayarla
            productImage: this.product.productImage
        };
        cart.products.push(newCartItem); // Yeni ürünü sepete ekle
    }
  
    // Güncellenmiş sepeti localStorage'a kaydet
    localStorage.setItem('carts', JSON.stringify(this.carts));
  
    // Kullanıcıya bildirim
    alert(`${this.product.productName} sepete eklendi!`);
}

  toggleFavorite(product: any): void {
    product.isFavorite = !product.isFavorite;

    let favoriteProducts = JSON.parse(localStorage.getItem('favoriteProducts') || '[]');
    if (product.isFavorite) {
      favoriteProducts.push(product);
    } else {
      favoriteProducts = favoriteProducts.filter((item: any) => item.productName !== product.productName);
    }

    localStorage.setItem('favoriteProducts', JSON.stringify(favoriteProducts));
  }

  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
  }

  viewDetails(product: any): void {
    this.router.navigate(['/product-detail', product.productName]);
  }

  showImage(image: string): void {
    this.selectedImage = image;
    this.display = true;
  }
}
