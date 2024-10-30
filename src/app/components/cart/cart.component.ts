import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  carts: any[] = [];
  display: boolean = false; 
  selectedImage: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadCartsFromLocalStorage();
  }

  createNewCart(): void {
    const cartName = prompt('Yeni sepetin adını giriniz:');
    if (cartName) {
      const newCart = {
        id: Date.now(),
        name: cartName,
        products: []
      };
      this.carts.push(newCart);
      this.saveCartsToLocalStorage();
    }
  }

  loadCartsFromLocalStorage(): void {
    this.carts = JSON.parse(localStorage.getItem('carts') || '[]');
    console.log('carts',this.carts); 
  }

  saveCartsToLocalStorage(): void {
    localStorage.setItem('carts', JSON.stringify(this.carts));
  }

  toggleSelection(cartIndex: number, item: any): void {
    item.selected = !item.selected;
    this.updateSelectedTotal(this.carts[cartIndex]);
  }

  updateQuantity(cartIndex: number, item: any, event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const newQuantity = inputElement.value;

    // Geçersiz veya boş miktar durumunu kontrol et
    if (!newQuantity || isNaN(Number(newQuantity))) {
        console.error('Geçersiz miktar:', newQuantity);
        return;
    }

    const quantity = Math.max(1, parseInt(newQuantity, 10)); // Minimum 1 olmalı
    item.quantity = quantity; // Güncellenen ürünün miktarını ata
    this.saveCartsToLocalStorage(); // Güncellemeleri localStorage'a kaydet
    this.updateSelectedTotal(this.carts[cartIndex]); // Toplamı güncelle
}

  addProductToCart(cartIndex: number, product: any): void {
    const existingProduct = this.carts[cartIndex].products.find((p: { productName: any; }) => p.productName === product.productName);
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      this.carts[cartIndex].products.push({ ...product, quantity: 1, selected: false });
    }
    this.saveCartsToLocalStorage();
  }

  calculateSelectedTotal(cart: any): number {
    return cart.products
      .filter((item: any) => item.selected)
      .reduce((total: number, item: any) => total + this.calculateTotalPrice(item), 0);
  }

  updateSelectedTotal(cart: any): void {
    this.calculateSelectedTotal(cart);
    this.calculateGrandTotal(cart);
  }

  calculateKDV(price: number): number {
    return price * 0.2;
  }

  calculateTotalPrice(item: any): number {
    return item.productPrice * item.quantity + this.calculateKDV(item.productPrice * item.quantity);
  }

  calculateCartTotal(cart: any): number {
    return cart.products.reduce((total: number, item: any) => total + this.calculateTotalPrice(item), 0);
  }

  calculateShipping(cart: any): number {
    return cart.products.some((item: any) => item.selected) ? (this.calculateCartTotal(cart) >= 1000 ? 0 : 40) : 0;
  }

  calculateGrandTotal(cart: any): number {
    return this.calculateSelectedTotal(cart) + this.calculateShipping(cart);
  }

  selectAllProducts(cartIndex: number): void {
    this.carts[cartIndex].products.forEach((item: any) => item.selected = true);
    this.updateSelectedTotal(this.carts[cartIndex]);
  }

  deselectAllProducts(cartIndex: number): void {
    this.carts[cartIndex].products.forEach((item: any) => item.selected = false);
    this.updateSelectedTotal(this.carts[cartIndex]);
  }

  deleteSelectedProducts(cartIndex: number): void {
    this.carts[cartIndex].products = this.carts[cartIndex].products.filter((item: any) => !item.selected);
    this.saveCartsToLocalStorage();
    this.updateSelectedTotal(this.carts[cartIndex]);
  }

  deleteCart(cartIndex: number): void {
    this.carts.splice(cartIndex, 1);
    this.saveCartsToLocalStorage();
  }

  removeProductFromCart(cartIndex: number, item: any): void {
    this.carts[cartIndex].products = this.carts[cartIndex].products.filter((p: any) => p.productName !== item.productName);
    this.saveCartsToLocalStorage();
  }

  updateCart(cartIndex: number, event?: Event): void {
    if (event) {
      const inputElement = event.target as HTMLInputElement;
      if (inputElement && inputElement.value) {
        const newQuantity = parseInt(inputElement.value, 10);
        if (!isNaN(newQuantity) && newQuantity > 0) {
          this.carts[cartIndex].products.forEach((item: any) => {
            item.quantity = newQuantity;
          });
        }
      }
    }
    this.saveCartsToLocalStorage();
    this.updateSelectedTotal(this.carts[cartIndex]); // Adet değiştiğinde toplamı güncelle
  }
  

  viewProductDetails(item: any): void {
    this.router.navigate(['/product-detail', item.productName]);
  }

  clearCart(cartIndex: number): void {
    this.carts[cartIndex].products = [];
    this.saveCartsToLocalStorage();
  }

  showImage(image: string): void {
    this.selectedImage = image; 
    this.display = true; 
  }
}
