'use client';

import { useState, useEffect } from 'react';
import { FolderTree, X } from 'lucide-react';
import { api } from '@/lib/api';
import { generateSlug } from '@/lib/utils';
import { Button, Input, Select, useSnackbar } from '@/components/ui';

interface Category {
  _id: string;
  name: string;
  slug: string;
  parent?: {
    _id: string;
    name: string;
  };
}

interface FormData {
  name: string;
  parent: string;
}

export default function CategoriesPage() {
  const snackbar = useSnackbar();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    parent: '',
  });
  const [submitting, setSubmitting] = useState(false);

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

  const openCreateModal = () => {
    setModalMode('create');
    setSelectedCategory(null);
    setFormData({ name: '', parent: '' });
    setShowModal(true);
  };

  const openEditModal = (category: Category) => {
    setModalMode('edit');
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      parent: category.parent?._id || '',
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCategory(null);
    setFormData({ name: '', parent: '' });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError(null);

      const submitData = {
        name: formData.name,
        slug: generateSlug(formData.name),
        parent: formData.parent || undefined,
      };

      if (modalMode === 'create') {
        await api.post('/categories', submitData);
        snackbar.success('Danh mục mới đã được tạo thành công!');
      } else if (modalMode === 'edit' && selectedCategory) {
        await api.patch(`/categories/${selectedCategory._id}`, submitData);
        snackbar.success('Danh mục đã được cập nhật thành công!');
      }

      await fetchCategories();
      closeModal();
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || 'Có lỗi xảy ra';
      setError(errorMsg);
      snackbar.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa danh mục này?')) return;
    
    try {
      setDeletingId(id);
      setError(null);
      await api.delete(`/categories/${id}`);
      snackbar.success('Danh mục đã được xóa thành công!');
      await fetchCategories();
    } catch (err: any) {
      const errorMsg = err.message || 'Không thể xóa danh mục';
      setError(errorMsg);
      snackbar.error(errorMsg);
    } finally {
      setDeletingId(null);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
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
          <Button onClick={openCreateModal}>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Thêm danh mục
          </Button>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-700">{error}</p>
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
            <Button onClick={openCreateModal}>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
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
              {/* Category Icon */}
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

              {/* Content */}
              <div className="px-2">
                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors leading-tight mb-3">
                  {category.name}
                </h3>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => openEditModal(category)}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-xl cursor-pointer transition-all hover:shadow-lg hover:scale-105 whitespace-nowrap"
                  >
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span>Chỉnh sửa</span>
                  </button>
                  <button
                    onClick={() => handleDelete(category._id)}
                    disabled={deletingId === category._id}
                    className="inline-flex items-center justify-center p-2.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl cursor-pointer transition-all hover:scale-105 disabled:opacity-50"
                    title="Xóa danh mục"
                  >
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {modalMode === 'create' ? 'Thêm danh mục mới' : 'Chỉnh sửa danh mục'}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <Input
                label={
                  <>
                    Tên danh mục <span className="text-red-500">*</span>
                  </>
                }
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nhập tên danh mục..."
              />

              <Select
                label="Danh mục cha"
                value={formData.parent}
                onChange={(e) => setFormData({ ...formData, parent: e.target.value })}
              >
                <option value="">-- Không có --</option>
                {categories
                  .filter(cat => cat._id !== selectedCategory?._id)
                  .map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
              </Select>

              {/* Modal Footer */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Đang xử lý...' : modalMode === 'create' ? 'Tạo danh mục' : 'Cập nhật'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
