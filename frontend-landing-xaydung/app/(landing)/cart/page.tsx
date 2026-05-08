'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, ArrowRight } from 'lucide-react';
import { getCartItems, updateCartItemQuantity, removeFromCart, clearCart, getCartTotal, formatCurrency, CartItem } from '@/lib/cart';

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setCartItems(getCartItems());
    setIsLoading(false);

    // Listen for cart updates
    const handleCartUpdate = () => {
      setCartItems(getCartItems());
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    updateCartItemQuantity(itemId, newQuantity);
  };

  const handleRemoveItem = (itemId: string) => {
    if (confirm('Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?')) {
      removeFromCart(itemId);
    }
  };

  const handleClearCart = () => {
    if (confirm('Bạn có chắc muốn xóa toàn bộ giỏ hàng?')) {
      clearCart();
    }
  };

  const total = getCartTotal();
  const shipping = total > 0 ? 50000 : 0; // 50k shipping fee
  const grandTotal = total + shipping;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Tiếp tục mua sắm</span>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Giỏ hàng của bạn</h1>
          <p className="text-gray-600 mt-2">
            {cartItems.length > 0 ? `Bạn có ${cartItems.length} sản phẩm trong giỏ hàng` : 'Giỏ hàng trống'}
          </p>
        </div>

        {cartItems.length === 0 ? (
          /* Empty Cart */
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Giỏ hàng trống</h2>
            <p className="text-gray-600 mb-8">Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm</p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-all"
            >
              <span>Khám phá sản phẩm</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <Link
                      href={`/products/${item.slug}`}
                      className="flex-shrink-0 w-24 h-24 md:w-32 md:h-32 bg-gray-100 rounded-lg overflow-hidden"
                    >
                      {item.thumbnail ? (
                        <img
                          src={item.thumbnail}
                          alt={item.name}
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </Link>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/products/${item.slug}`}
                            className="text-lg font-bold text-gray-900 hover:text-primary-600 transition-colors line-clamp-2"
                          >
                            {item.name}
                          </Link>
                          {item.category && (
                            <p className="text-sm text-gray-500 mt-1">{item.category}</p>
                          )}
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item._id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                          title="Xóa sản phẩm"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between gap-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => {
                              const value = parseInt(e.target.value);
                              if (value > 0) {
                                handleUpdateQuantity(item._id, value);
                              }
                            }}
                            className="w-16 h-8 text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            min="1"
                          />
                          <button
                            onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <div className="text-lg font-bold text-primary-600">
                            {formatCurrency(item.price * item.quantity)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatCurrency(item.price)} x {item.quantity}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Clear Cart Button */}
              <button
                onClick={handleClearCart}
                className="w-full py-3 text-red-600 font-semibold hover:bg-red-50 rounded-lg transition-colors"
              >
                Xóa toàn bộ giỏ hàng
              </button>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Tóm tắt đơn hàng</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between text-gray-600">
                    <span>Tạm tính</span>
                    <span className="font-semibold">{formatCurrency(total)}</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-600">
                    <span>Phí vận chuyển</span>
                    <span className="font-semibold">{formatCurrency(shipping)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center justify-between text-lg font-bold text-gray-900">
                      <span>Tổng cộng</span>
                      <span className="text-primary-600">{formatCurrency(grandTotal)}</span>
                    </div>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="block w-full py-4 bg-primary-600 text-white text-center font-bold rounded-lg hover:bg-primary-700 transition-all shadow-lg hover:shadow-xl mb-3"
                >
                  Tiến hành thanh toán
                </Link>

                <Link
                  href="/products"
                  className="block w-full py-3 border-2 border-gray-300 text-gray-700 text-center font-semibold rounded-lg hover:bg-gray-50 transition-all"
                >
                  Tiếp tục mua sắm
                </Link>

                {/* Trust Badges */}
                <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>Giao hàng nhanh chóng</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <span>Thanh toán an toàn</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                      </svg>
                    </div>
                    <span>Đổi trả trong 7 ngày</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
