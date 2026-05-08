'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Package } from 'lucide-react';
import { api } from '@/lib/api';
import { Button, useSnackbar } from '@/components/ui';

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  salePrice?: number;
  unit: string;
  stock: number;
  category: {
    _id: string;
    name: string;
  };
  thumbnail?: string;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
}

export default function ProductsPage() {
  const router = useRouter();
  const snackbar = useSnackbar();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchProducts();
  }, [page, search]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/products', {
        params: { page, limit: 20, search: search || undefined },
      });
      setProducts(response.data.products);
      setTotalPages(response.data.totalPages);
    } catch (err: any) {
      setError(err.message || 'Không thể tải danh sách sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      setError(null);
      await api.delete(`/products/${id}`);
      snackbar.success('Sản phẩm đã được xóa thành công!');
      await fetchProducts();
      setDeleteConfirmId(null);
    } catch (err: any) {
      const errorMsg = err.message || 'Không thể xóa sản phẩm';
      setError(errorMsg);
      snackbar.error(errorMsg);
    } finally {
      setDeletingId(null);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  // Loading state
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10">
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1">
              <div className="h-9 bg-gray-200 rounded-lg w-64 mb-2 animate-pulse"></div>
              <div className="h-5 bg-gray-200 rounded-lg w-96 animate-pulse"></div>
            </div>
            <div className="h-12 bg-gray-200 rounded-xl w-48 animate-pulse"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <div className="h-56 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100 animate-pulse rounded-xl mb-4"></div>
              <div className="px-2">
                <div className="h-6 bg-gray-200 rounded-full w-24 mb-3 animate-pulse"></div>
                <div className="space-y-2 mb-3">
                  <div className="h-6 bg-gray-200 rounded-lg w-full animate-pulse"></div>
                  <div className="h-6 bg-gray-200 rounded-lg w-3/4 animate-pulse"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded-lg w-32 mb-5 animate-pulse"></div>
                <div className="flex items-center gap-2 pt-5 border-t border-gray-100">
                  <div className="flex-1 h-11 bg-gray-200 rounded-xl animate-pulse"></div>
                  <div className="h-11 w-11 bg-gray-200 rounded-xl animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quản lý Sản phẩm</h1>
            <p className="mt-1 text-base text-gray-600">
              Quản lý vật liệu xây dựng, giá cả và tồn kho.
            </p>
          </div>
          <Button
            onClick={() => router.push('/admin/products/new')}
            leftIcon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            }
          >
            Thêm sản phẩm
          </Button>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-red-800">Lỗi</h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
              <button
                onClick={fetchProducts}
                className="mt-2 text-sm font-medium text-red-800 hover:text-red-900 underline cursor-pointer transition-colors"
              >
                Thử lại
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <Package className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">Chưa có sản phẩm</h3>
            <p className="text-sm text-gray-500 mb-6">
              Bắt đầu bằng cách thêm sản phẩm vật liệu xây dựng đầu tiên.
            </p>
            <Button
              onClick={() => router.push('/admin/products/new')}
              leftIcon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              }
            >
              Thêm sản phẩm
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="group cursor-pointer bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-primary-200 p-3"
            >
              {/* Product Image */}
              {product.thumbnail ? (
                <div className="relative h-48 bg-gray-200 overflow-hidden rounded-xl mb-4">
                  <img
                    src={product.thumbnail}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Category Badge */}
                  <div className="absolute top-3 right-3">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/95 backdrop-blur-sm text-primary-700 rounded-full text-xs font-semibold shadow-lg">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      <span>{product.category.name}</span>
                    </div>
                  </div>

                  {/* Featured Badge */}
                  {product.isFeatured && (
                    <div className="absolute top-3 left-3">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500/95 backdrop-blur-sm text-white rounded-full text-xs font-semibold shadow-lg">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span>Nổi bật</span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative h-56 bg-gradient-to-br from-primary-50 via-primary-100 to-primary-200 flex items-center justify-center overflow-hidden rounded-xl mb-4">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/20 rounded-full translate-y-1/2 -translate-x-1/2"></div>
                  
                  <Package className="w-20 h-20 text-primary-400 relative z-10" />
                  
                  {/* Category Badge */}
                  <div className="absolute top-3 right-3 z-20">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/95 backdrop-blur-sm text-primary-700 rounded-full text-xs font-semibold shadow-lg">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      <span>{product.category.name}</span>
                    </div>
                  </div>

                  {/* Featured Badge */}
                  {product.isFeatured && (
                    <div className="absolute top-3 left-3 z-20">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500/95 backdrop-blur-sm text-white rounded-full text-xs font-semibold shadow-lg">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span>Nổi bật</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Content */}
              <div className="px-2">
                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors leading-tight mb-3">
                  {product.name}
                </h3>
                
                {/* Price & Stock */}
                <div className="flex items-center justify-between text-sm mb-2">
                  <div>
                    {product.salePrice ? (
                      <div>
                        <div className="text-lg font-bold text-red-600">{formatPrice(product.salePrice)}</div>
                        <div className="text-xs text-gray-400 line-through">{formatPrice(product.price)}</div>
                      </div>
                    ) : (
                      <div className="text-lg font-bold text-gray-900">{formatPrice(product.price)}</div>
                    )}
                    <div className="text-xs text-gray-500">/{product.unit}</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {product.stock} {product.unit}
                    </div>
                    <div className="text-xs text-gray-500">Tồn kho</div>
                  </div>
                </div>

                {/* Status */}
                {!product.isActive && (
                  <div className="mb-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      Tạm ẩn
                    </span>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                  {deleteConfirmId === product._id ? (
                    <div className="flex items-center justify-between w-full gap-3">
                      <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Xác nhận xóa?</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDelete(product._id)}
                          disabled={deletingId === product._id}
                          className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all hover:shadow-lg whitespace-nowrap"
                        >
                          {deletingId === product._id ? 'Đang xóa...' : 'Xóa'}
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          disabled={deletingId === product._id}
                          className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all whitespace-nowrap"
                        >
                          Hủy
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => router.push(`/admin/products/${product._id}/edit`)}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-xl cursor-pointer transition-all hover:shadow-lg hover:scale-105 whitespace-nowrap"
                      >
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span>Chỉnh sửa</span>
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(product._id)}
                        className="inline-flex items-center justify-center p-2.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl cursor-pointer transition-all hover:scale-105"
                        title="Xóa sản phẩm"
                      >
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Trước
          </button>
          <span className="px-4 py-2 text-sm text-gray-600">
            Trang {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Sau
          </button>
        </div>
      )}
    </div>
  );
}
