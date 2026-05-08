'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FolderTree } from 'lucide-react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui';

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  parent?: {
    _id: string;
    name: string;
  };
  image?: string;
  order: number;
  isActive: boolean;
  children?: Category[];
}

export default function CategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (err: any) {
      setError(err.message || 'Không thể tải danh sách danh mục');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      setError(null);
      await api.delete(`/categories/${id}`);
      await fetchCategories();
      setDeleteConfirmId(null);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Không thể xóa danh mục');
    } finally {
      setDeletingId(null);
    }
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
                <div className="h-6 bg-gray-200 rounded-lg w-full mb-3 animate-pulse"></div>
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
            <h1 className="text-3xl font-bold text-gray-900">Quản lý Danh mục</h1>
            <p className="mt-1 text-base text-gray-600">
              Quản lý danh mục sản phẩm và phân loại vật liệu xây dựng.
            </p>
          </div>
          <Button
            onClick={() => router.push('/admin/categories/new')}
            leftIcon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            }
          >
            Thêm danh mục
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
                onClick={fetchCategories}
                className="mt-2 text-sm font-medium text-red-800 hover:text-red-900 underline cursor-pointer transition-colors"
              >
                Thử lại
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Categories Grid */}
      {categories.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <FolderTree className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">Chưa có danh mục</h3>
            <p className="text-sm text-gray-500 mb-6">
              Bắt đầu bằng cách thêm danh mục sản phẩm đầu tiên.
            </p>
            <Button
              onClick={() => router.push('/admin/categories/new')}
              leftIcon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              }
            >
              Thêm danh mục
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div
              key={category._id}
              className="group cursor-pointer bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-primary-200 p-3"
            >
              {/* Category Image */}
              {category.image ? (
                <div className="relative h-48 bg-gray-200 overflow-hidden rounded-xl mb-4">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Parent Badge */}
                  {category.parent && (
                    <div className="absolute top-3 right-3">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/95 backdrop-blur-sm text-primary-700 rounded-full text-xs font-semibold shadow-lg">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                        </svg>
                        <span>{category.parent.name}</span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative h-56 bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 flex items-center justify-center overflow-hidden rounded-xl mb-4">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/20 rounded-full translate-y-1/2 -translate-x-1/2"></div>
                  
                  <FolderTree className="w-20 h-20 text-blue-400 relative z-10" />
                  
                  {/* Parent Badge */}
                  {category.parent && (
                    <div className="absolute top-3 right-3 z-20">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/95 backdrop-blur-sm text-primary-700 rounded-full text-xs font-semibold shadow-lg">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                        </svg>
                        <span>{category.parent.name}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Content */}
              <div className="px-2">
                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors leading-tight mb-3">
                  {category.name}
                </h3>
                
                {/* Description */}
                {category.description && (
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {category.description}
                  </p>
                )}

                {/* Info */}
                <div className="flex items-center gap-3 text-sm text-gray-500 mb-2">
                  <div className="flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <span className="font-medium">{category.slug}</span>
                  </div>
                </div>

                {/* Status */}
                {!category.isActive && (
                  <div className="mb-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      Tạm ẩn
                    </span>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                  {deleteConfirmId === category._id ? (
                    <div className="flex items-center justify-between w-full gap-3">
                      <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Xác nhận xóa?</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDelete(category._id)}
                          disabled={deletingId === category._id}
                          className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all hover:shadow-lg whitespace-nowrap"
                        >
                          {deletingId === category._id ? 'Đang xóa...' : 'Xóa'}
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          disabled={deletingId === category._id}
                          className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all whitespace-nowrap"
                        >
                          Hủy
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => router.push(`/admin/categories/${category._id}/edit`)}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-xl cursor-pointer transition-all hover:shadow-lg hover:scale-105 whitespace-nowrap"
                      >
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span>Chỉnh sửa</span>
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(category._id)}
                        className="inline-flex items-center justify-center p-2.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl cursor-pointer transition-all hover:scale-105"
                        title="Xóa danh mục"
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
    </div>
  );
}
