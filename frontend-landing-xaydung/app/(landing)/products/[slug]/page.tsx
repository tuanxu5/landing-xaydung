'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Package, ArrowLeft, Tag, Share2, Phone, Award } from 'lucide-react';
import { api } from '@/lib/api';
import { getImageUrl } from '@/lib/utils';

interface Product {
  _id: string;
  name: string;
  slug: string;
  thumbnail?: string;
  images?: string[];
  category?: { _id: string; name: string } | null;
  description?: string;
  specifications?: string;
  promotionPolicy?: string;
  brands?: string[];
  price?: number;
  unit?: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'promotion'>('description');

  useEffect(() => {
    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/products/slug/${slug}`);
      setProduct(response.data);
      setSelectedImage(response.data.images?.[0] || response.data.thumbnail || '');
    } catch (err) {
      console.error('Failed to fetch product:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Package className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy sản phẩm</h2>
          <Link href="/products" className="text-primary-600 hover:text-primary-700">
            ← Quay lại danh sách sản phẩm
          </Link>
        </div>
      </div>
    );
  }

  const allImages = product.images && product.images.length > 0 ? product.images : (product.thumbnail ? [product.thumbnail] : []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-primary-600">Trang chủ</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-primary-600">Sản phẩm</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden p-6">
              {/* Main Image */}
              <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden mb-4">
                {selectedImage ? (
                  <img src={getImageUrl(selectedImage)} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-24 h-24 text-gray-300" />
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {allImages.length > 1 && (
                <div className="grid grid-cols-5 gap-3">
                  {allImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === img ? 'border-primary-600 ring-2 ring-primary-200' : 'border-transparent hover:border-gray-300'
                      }`}
                    >
                      <img src={getImageUrl(img)} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Tabs Content */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden mt-6">
              {/* Tabs Header */}
              <div className="border-b border-gray-200">
                <div className="flex">
                  <button
                    onClick={() => setActiveTab('description')}
                    className={`flex-1 px-6 py-4 text-sm font-semibold transition-colors ${
                      activeTab === 'description'
                        ? 'text-primary-600 border-b-2 border-primary-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Mô tả sản phẩm
                  </button>
                  {product.specifications && (
                    <button
                      onClick={() => setActiveTab('specifications')}
                      className={`flex-1 px-6 py-4 text-sm font-semibold transition-colors ${
                        activeTab === 'specifications'
                          ? 'text-primary-600 border-b-2 border-primary-600'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Thông số kỹ thuật
                    </button>
                  )}
                  {product.promotionPolicy && (
                    <button
                      onClick={() => setActiveTab('promotion')}
                      className={`flex-1 px-6 py-4 text-sm font-semibold transition-colors ${
                        activeTab === 'promotion'
                          ? 'text-primary-600 border-b-2 border-primary-600'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Chính sách ưu đãi
                    </button>
                  )}
                </div>
              </div>

              {/* Tabs Content */}
              <div className="p-6">
                {activeTab === 'description' && product.description && (
                  <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: product.description }} />
                )}
                {activeTab === 'specifications' && product.specifications && (
                  <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: product.specifications }} />
                )}
                {activeTab === 'promotion' && product.promotionPolicy && (
                  <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: product.promotionPolicy }} />
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden p-6 sticky top-24">
              {/* Category */}
              {product.category && (
                <Link 
                  href={`/products?category=${product.category._id}`} 
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-700 mb-3 uppercase tracking-wide"
                >
                  <Tag className="w-3 h-3" />
                  {product.category.name}
                </Link>
              )}

              {/* Product Name */}
              <h1 className="text-2xl font-bold text-gray-900 mb-4">{product.name}</h1>

              {/* Brands */}
              {product.brands && product.brands.length > 0 && (
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-semibold text-gray-700">Thương hiệu:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.brands.map((brand, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full font-medium"
                      >
                        {brand}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Price */}
              <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-6 mb-6">
                <div className="text-sm text-gray-600 mb-2">Giá sản phẩm</div>
                <div className="flex items-center gap-2">
                  <Phone className="w-6 h-6 text-primary-600" />
                  <div className="text-2xl font-bold text-primary-600">Liên hệ</div>
                </div>
                <p className="text-xs text-gray-600 mt-2">Gọi ngay để nhận báo giá tốt nhất</p>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3 mb-6">
                <Link 
                  href="/contact" 
                  className="flex items-center justify-center gap-2 w-full bg-primary-600 text-white px-6 py-4 rounded-xl font-bold hover:bg-primary-700 transition-all shadow-lg hover:shadow-xl"
                >
                  <Phone className="w-5 h-5" />
                  Liên hệ báo giá
                </Link>
                <button className="flex items-center justify-center gap-2 w-full border-2 border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:border-primary-600 hover:text-primary-600 transition-all">
                  <Share2 className="w-5 h-5" />
                  Chia sẻ
                </button>
              </div>

              {/* Trust Badges */}
              <div className="space-y-3 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Sản phẩm chính hãng 100%</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span>Giao hàng nhanh chóng</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <span>Bảo hành uy tín</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
