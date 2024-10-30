import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private carts: any[] = JSON.parse(localStorage.getItem('carts') || '[]');

  // Kullanıcının tüm sepetlerini getir
  getCarts(): any[] {
    return this.carts;
  }

  // Ürünü seçilen sepete ekle
  addProductToCart(cartId: string, product: any): void {
    const cart = this.carts.find((c: any) => c.id === cartId);
    if (cart) {
      // Eğer ürün zaten varsa, miktarı artır
      const existingProduct = cart.products.find((p: any) => p.id === product.id);
      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        cart.products.push({ ...product, quantity: 1 });
      }
      this.saveCarts();
    }
  }

  // Sepetleri Local Storage'a kaydet
  private saveCarts(): void {
    localStorage.setItem('carts', JSON.stringify(this.carts));
  }
}
