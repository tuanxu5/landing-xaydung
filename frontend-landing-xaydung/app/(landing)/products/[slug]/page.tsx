'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Package, ArrowLeft, Tag, Share2 } from 'lucide-react';
import { api } from '@/lib/api';

interface Product {
  _id: string;
  name: string;
  slug: string;
  thumbnail?: string;
  images?: string[];
  category?: { _id: string; name: string } | null;
  shortDescription?: string;
  description?: string;
  specifications?: string;
  price?: number;
  unit?: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>('');

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
      setSelectedImage(response.data.thumbnail || response.data.images?.[0] || '');
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

  const allImages = [product.thumbnail, ...(product.images || [])].filter(Boolean);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link href="/products" className="inline-flex items-center text-sm text-gray-600 hover:text-primary-600">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Quay lại danh sách sản phẩm
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Images */}
            <div>
              <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden mb-4">
                {selectedImage ? (
                  <img src={selectedImage} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-24 h-24 text-gray-300" />
                  </div>
                )}
              </div>
              {allImages.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {allImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img!)}
                      className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === img ? 'border-primary-600' : 'border-transparent hover:border-gray-300'
                      }`}
                    >
                      <img src={img!} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div>
              {product.category && (
                <div className="mb-4">
                  <Link href={`/products?category=${product.category._id}`} className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 mb-2">
                    <Tag className="w-4 h-4" />
                    {product.category.name}
                  </Link>
                </div>
              )}
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
              {product.shortDescription && (
                <p className="text-lg text-gray-600">{product.shortDescription}</p>
              )}

              {product.price && (
                <div className="bg-primary-50 rounded-xl p-6 mb-6">
                  <div className="text-sm text-gray-600 mb-1">Giá</div>
                  <div className="text-3xl font-bold text-primary-600">
                    {product.price.toLocaleString('vi-VN')} đ
                    {product.unit && <span className="text-lg text-gray-600">/{product.unit}</span>}
                  </div>
                </div>
              )}

              <div className="flex gap-3 mb-8">
                <Link href="/contact" className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-700 transition-all text-center">
                  Liên hệ báo giá
                </Link>
                <button className="px-6 py-3 border-2 border-gray-200 rounded-xl hover:border-primary-600 hover:text-primary-600 transition-all">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              {product.specifications && (
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Thông số kỹ thuật</h3>
                  <div className="prose prose-sm max-w-none text-gray-600" dangerouslySetInnerHTML={{ __html: product.specifications }} />
                </div>
              )}
            </div>
          </div>

          {product.description && (
            <div className="border-t border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Mô tả chi tiết</h2>
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: product.description }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
