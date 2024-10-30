import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit {
  favoriteProducts: any[] = []; // Favori ürünleri saklamak için bir dizi
  display: boolean = false; // Görsel büyütme durumu
  selectedImage: string = ''; // Seçilen görselin URL'si
  selectedProducts: any[] = []; // Seçilen ürünler
  carts: any[] = []; // Sepet listesi
  selectedCartName = new FormControl<string | null>(null);  // Seçilen sepet
  cartForm: FormGroup | undefined;

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.loadFavoriteProducts(); // Favori ürünleri yükle
    this.loadCarts(); // Sepetleri yükle
    this.selectedCartName.setValue(this.carts.length > 0 ? this.carts[0].name : null); 
    this.carts = JSON.parse(localStorage.getItem('carts') || '[]');
    console.log(this.carts); 
  }

  loadFavoriteProducts(): void {
    const favoriteProducts = JSON.parse(localStorage.getItem('favoriteProducts') || '[]');
    this.favoriteProducts = favoriteProducts.map((product: { productImage: any; productPrice: any; productDescription: any; }) => ({
        ...product,
        productImage: product.productImage || 'default-image.jpg', // Resim bilgisi eksikse varsayılan bir görsel ekleyin
        productPrice: product.productPrice || 0, // Fiyat bilgisi eksikse varsayılan bir fiyat ekleyin
        productDescription: product.productDescription || 'Açıklama bulunmuyor.' // Açıklama eksikse varsayılan bir açıklama ekleyin
    }));
}

  loadCarts(): void {
    const carts = JSON.parse(localStorage.getItem('carts') || '[]');
    this.carts = carts; // Sepetleri diziye ata
  }

  toggleSelectAll(event: { checked: any; }) {
    const checked = event.checked;
    this.favoriteProducts.forEach(product => {
      product.selected = checked;
    });
  }

  updateSelectedProducts(index: number) {
    this.favoriteProducts[index].selected = !this.favoriteProducts[index].selected;
  }

  toggleFavorite(product: any): void {
    product.isFavorite = !product.isFavorite; // Ürünün favori durumunu değiştir

    // Favori ürünleri güncelle
    let favoriteProducts = JSON.parse(localStorage.getItem('favoriteProducts') || '[]');
    if (product.isFavorite) {
      // Ürün favorilere ekleniyor
      favoriteProducts.push(product);
    } else {
      // Ürün favorilerden kaldırılıyor
      favoriteProducts = favoriteProducts.filter((item: any) => item.productName !== product.productName);
    }
    
    localStorage.setItem('favoriteProducts', JSON.stringify(favoriteProducts)); // Güncellenmiş favori ürünleri Local Storage'a kaydet
    this.loadFavoriteProducts(); // Favori ürünleri tekrar yükle
  }

  viewDetails(product: any): void {
    this.router.navigate(['/product-detail', product.productName]);
  }

  showImage(image: string): void {
    this.selectedImage = image;
    this.display = true;
  }

  addToCart(product: any): void {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]'); // Sepeti yükle
    const existingCartIndex = cart.findIndex((item: any) => item.productName === product.productName); // Ürünün sepette olup olmadığını kontrol et

    if (existingCartIndex !== -1) {
        // Ürün zaten sepetteyse miktarını artır
        cart[existingCartIndex].quantity += 1;
    } else {
        // Yeni bir ürün ekle
        const newCartItem = {
            productName: product.productName,
            productPrice: product.productPrice,
            quantity: 1, // İlk eklemede miktar 1
            productImage: product.productImage // Gerekirse resim bilgisini de ekleyebilirsiniz
        };
        cart.push(newCartItem); // Sepete yeni ürünü ekle
    }

    // Güncellenmiş sepeti Local Storage'a kaydet
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${product.productName} sepete eklendi!`); // Kullanıcıya bilgi ver
}



  selectAllProducts() {
    this.favoriteProducts.forEach(product => {
        product.selected = true;
    });
  }

  addSelectedToCart(): void {
    this.selectedProducts.forEach(product => {
      this.addToCart(product); // Her seçili ürünü sepete ekle
    });
    this.selectedProducts = []; // Seçili ürünleri sıfırla
    alert('Seçili ürünler sepete eklendi.'); // Kullanıcıya bilgi ver
  }

  removeSelectedFromFavorites() {
    // Favori ürünleri güncelle
    this.favoriteProducts = this.favoriteProducts.filter(product => {
        // Seçili olanları localStorage'dan kaldır
        if (product.selected) {
            this.toggleFavorite(product); // Favori durumunu değiştir
            return false; // Seçili olanları filtrele
        }
        return true; // Seçilmeyenleri tut
    });
    localStorage.setItem('favoriteProducts', JSON.stringify(this.favoriteProducts)); // Güncellenmiş favori ürünleri kaydet
  }

  deselectAllProducts() {
      this.favoriteProducts.forEach(product => {
          product.selected = false;
      });
  }

  addSelectedToCartFromDropdown() {
    const selectedCartName = this.selectedCartName.value;

    if (!selectedCartName) {
        alert('Lütfen bir sepet seçin.');
        return;
    }

    // Seçili sepeti bul
    const selectedCart = this.carts.find(cart => cart.name === selectedCartName);

    // Seçili ürünleri filtrele
    this.selectedProducts = this.favoriteProducts.filter(product => product.selected);

    // Eğer seçili ürün yoksa uyarı ver
    if (this.selectedProducts.length === 0) {
        alert('Lütfen sepetine eklemek için ürün seçin.');
        return;
    }

    // Seçili sepetin `products` dizisini güncelle
    if (selectedCart) {
        // `products` dizisine seçili ürünleri ekleyin
        this.selectedProducts.forEach(product => {
            if (product) {
                selectedCart.products.push({
                    productName: product.productName,
                    productPrice: product.productPrice,
                    productImage: product.productImage, // Ürün resmi
                    productDescription: product.productDescription, // Ürün açıklaması
                    quantity: 1
                });
            }
        });
        alert(`Seçili ürünler ${selectedCartName} sepetine eklendi.`);
    }

    // Seçili ürünleri sıfırla ve yerel depolamayı güncelle
    this.selectedProducts = [];
    localStorage.setItem('carts', JSON.stringify(this.carts)); // Güncellenmiş sepeti kaydet
}


}
