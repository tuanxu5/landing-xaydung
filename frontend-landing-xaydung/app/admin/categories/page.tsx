'use client';

import { useState, useEffect } from 'react';
import { FolderTree, X } from 'lucide-react';
import { api } from '@/lib/api';
import { generateSlug } from '@/lib/utils';
import { useDebounce } from '@/hooks/useDebounce';
import { Button, Input, Select, useSnackbar, Pagination } from '@/components/ui';

interface Category {
  _id: string;
  name: string;
  slug: string;
  parent?: {
    _id: string;
    name: string;
    parent?: {
      _id: string;
      name: string;
    };
  };
  createdAt: string;
}

interface FormData {
  name: string;
  parent: string;
}

export default function CategoriesPage() {
  const snackbar = useSnackbar();
  const [categories, setCategories] = useState<Category[]>([]);
  const [allCategories, setAllCategories] = useState<Category[]>([]); // For tree view
  const [viewMode, setViewMode] = useState<'tree' | 'table'>('tree'); // Default to tree view
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 10;
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    parent: '',
  });
  const [submitting, setSubmitting] = useState(false);

  // Debounce search term
  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    fetchCategories();
    if (viewMode === 'tree') {
      fetchAllCategories();
    }
  }, [page, debouncedSearch, viewMode]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/categories', {
        params: { page, limit, search: debouncedSearch || undefined },
      });
      setCategories(response.data.categories || response.data);
      setTotalPages(response.data.totalPages || 1);
      setTotalItems(response.data.total || 0);
    } catch (err: any) {
      setError(err.message || 'Không thể tải danh sách danh mục');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/categories', {
        params: { limit: 1000 }, // Get all categories for tree view
      });
      setAllCategories(response.data.categories || response.data);
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

      const submitData: any = {
        name: formData.name,
        slug: generateSlug(formData.name),
        isActive: true,
      };

      // Only add parent if it has a value
      if (formData.parent) {
        submitData.parent = formData.parent;
      }

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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  // Helper function to get category level
  const getCategoryLevel = (category: Category): number => {
    if (!category.parent) return 1; // Cấp 1
    if (!category.parent.parent) return 2; // Cấp 2
    return 3; // Cấp 3 trở đi
  };

  // Filter categories that can be parent (only level 1 and 2)
  const getAvailableParentCategories = () => {
    return categories.filter(cat => {
      // Không cho chọn chính nó
      if (cat._id === selectedCategory?._id) return false;
      
      // Chỉ cho phép chọn cấp 1 và cấp 2
      const level = getCategoryLevel(cat);
      return level <= 2;
    });
  };

  // Build tree structure
  const buildTree = (parentId: string | null = null): Category[] => {
    return allCategories
      .filter(cat => {
        if (parentId === null) return !cat.parent;
        return cat.parent?._id === parentId;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  };

  // Tree node component
  const TreeNode = ({ category, level = 0, isLast = false }: { category: Category; level?: number; isLast?: boolean }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const children = buildTree(category._id);
    const hasChildren = children.length > 0;

    return (
      <div className="relative">
        <div
          className={`group flex items-center gap-3 py-2.5 px-4 rounded-xl transition-all ${
            level === 0 
              ? 'bg-gradient-to-r from-blue-50 to-transparent hover:from-blue-100 mb-1' 
              : 'hover:bg-gray-50'
          }`}
          style={{ marginLeft: `${level * 32}px` }}
        >
          {/* Vertical line for children */}
          {level > 0 && (
            <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-200" style={{ left: `${(level - 1) * 32 + 20}px` }} />
          )}
          
          {/* Horizontal line */}
          {level > 0 && (
            <div className="absolute top-1/2 w-4 h-px bg-gray-200" style={{ left: `${(level - 1) * 32 + 20}px` }} />
          )}

          {/* Expand/Collapse button */}
          {hasChildren ? (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="relative z-10 flex-shrink-0 w-6 h-6 flex items-center justify-center bg-white border-2 border-gray-300 rounded-md hover:border-primary-500 hover:bg-primary-50 transition-all"
            >
              <svg
                className={`w-3 h-3 text-gray-600 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ) : (
            <div className="relative z-10 flex-shrink-0 w-6 h-6 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-gray-300" />
            </div>
          )}
          
          {/* Icon */}
          <div className={`flex-shrink-0 rounded-lg flex items-center justify-center ${
            level === 0 
              ? 'w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 shadow-md' 
              : level === 1
              ? 'w-9 h-9 bg-gradient-to-br from-indigo-400 to-indigo-500'
              : 'w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-500'
          }`}>
            <FolderTree className={`${level === 0 ? 'w-5 h-5' : 'w-4 h-4'} text-white`} />
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className={`text-gray-900 truncate ${
                level === 0 ? 'text-base font-bold' : level === 1 ? 'text-sm font-semibold' : 'text-sm font-medium'
              }`}>
                {category.name}
              </span>
              {hasChildren && (
                <span className="flex-shrink-0 text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">
                  {children.length}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-mono">{category.slug}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                level === 0 ? 'bg-blue-100 text-blue-700' :
                level === 1 ? 'bg-indigo-100 text-indigo-700' :
                'bg-purple-100 text-purple-700'
              }`}>
                Cấp {level + 1}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => openEditModal(category)}
              className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
              title="Chỉnh sửa"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={() => handleDelete(category._id)}
              disabled={deletingId === category._id || hasChildren}
              className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              title={hasChildren ? 'Không thể xóa danh mục có danh mục con' : 'Xóa'}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Children */}
        {hasChildren && isExpanded && (
          <div className="relative">
            {children.map((child, index) => (
              <TreeNode 
                key={child._id} 
                category={child} 
                level={level + 1}
                isLast={index === children.length - 1}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

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

      {/* Search and View Toggle */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Tìm kiếm danh mục..."
            value={search}
            onChange={handleSearchChange}
            className="w-full px-4 py-3 pl-11 text-sm border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all"
          />
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* View Mode Toggle */}
        <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setViewMode('tree')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              viewMode === 'tree'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
              <span className="hidden sm:inline">Cây</span>
            </div>
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              viewMode === 'table'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span className="hidden sm:inline">Bảng</span>
            </div>
          </button>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : viewMode === 'tree' ? (
          /* Tree View */
          allCategories.length === 0 ? (
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
          ) : (
            <div className="p-6 space-y-1">
              {buildTree(null).map((category, index) => (
                <TreeNode 
                  key={category._id} 
                  category={category} 
                  level={0}
                  isLast={index === buildTree(null).length - 1}
                />
              ))}
            </div>
          )
        ) : (
          /* Table View */
          categories.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <FolderTree className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">Chưa có danh mục</h3>
              <p className="text-sm text-gray-500 mb-6">
                {search ? 'Không tìm thấy danh mục nào phù hợp.' : 'Bắt đầu bằng cách thêm danh mục sản phẩm đầu tiên.'}
              </p>
              {!search && (
                <Button onClick={openCreateModal}>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Thêm danh mục
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-20">
                        STT
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Tên danh mục
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Slug
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Danh mục cha
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider w-24">
                        Cấp
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider w-32">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {categories.map((category, index) => {
                      const level = getCategoryLevel(category);
                      const stt = (page - 1) * limit + index + 1;
                      
                      return (
                        <tr key={category._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <span className="text-sm font-semibold text-gray-500">{stt}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                <FolderTree className="w-5 h-5 text-blue-600" />
                              </div>
                              <span className="text-sm font-semibold text-gray-900">{category.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-600 font-mono">{category.slug}</span>
                          </td>
                          <td className="px-6 py-4">
                            {category.parent ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary-50 text-primary-700 rounded-lg text-xs font-semibold">
                                <FolderTree className="w-3.5 h-3.5" />
                                {category.parent.name}
                              </span>
                            ) : (
                              <span className="text-sm text-gray-400">—</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex justify-center">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                                level === 1 ? 'bg-blue-100 text-blue-700' :
                                level === 2 ? 'bg-indigo-100 text-indigo-700' :
                                'bg-purple-100 text-purple-700'
                              }`}>
                                Cấp {level}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => openEditModal(category)}
                                className="inline-flex items-center justify-center p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                                title="Chỉnh sửa"
                              >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleDelete(category._id)}
                                disabled={deletingId === category._id}
                                className="inline-flex items-center justify-center p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
                                title="Xóa"
                              >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200">
                  <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    itemsPerPage={limit}
                    onPageChange={setPage}
                  />
                </div>
              )}
            </>
          )
        )}
      </div>

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
                helperText="Chỉ có thể chọn danh mục cấp 1 hoặc cấp 2 làm danh mục cha"
              >
                <option value="">-- Không có (Danh mục cấp 1) --</option>
                {getAvailableParentCategories().map((cat) => {
                  const level = getCategoryLevel(cat);
                  const prefix = level === 1 ? '📁 ' : '  └─ ';
                  return (
                    <option key={cat._id} value={cat._id}>
                      {prefix}{cat.name} {level === 2 ? `(Cấp ${level})` : ''}
                    </option>
                  );
                })}
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
