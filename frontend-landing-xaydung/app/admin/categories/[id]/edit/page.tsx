'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { Button } from '@/components/ui';

interface Category {
  _id: string;
  name: string;
}

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    parent: '',
    image: '',
    order: 0,
    isActive: true,
  });

  useEffect(() => {
    fetchCategories();
    fetchCategory();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data.filter((cat: Category) => cat._id !== params.id));
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchCategory = async () => {
    try {
      setFetching(true);
      const response = await api.get(`/categories/${params.id}`);
      const category = response.data;
      setFormData({
        name: category.name,
        slug: category.slug,
        description: category.description || '',
        parent: category.parent?._id || '',
        image: category.image || '',
        order: category.order,
        isActive: category.isActive,
      });
    } catch (err: any) {
      setError(err.message || 'Không thể tải thông tin danh mục');
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await api.patch(`/categories/${params.id}`, formData);
      router.push('/admin/categories');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Không thể cập nhật danh mục');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-10 py-10">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-96 mb-8"></div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-10 py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Chỉnh sửa danh mục</h1>
        <p className="mt-1 text-base text-gray-600">Cập nhật thông tin danh mục</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên danh mục *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Slug *
            </label>
            <input
              type="text"
              required
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mô tả
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Danh mục cha
            </label>
            <select
              value={formData.parent}
              onChange={(e) => setFormData({ ...formData, parent: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">-- Không có --</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Thứ tự
            </label>
            <input
              type="number"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL hình ảnh
            </label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
              Hiển thị danh mục
            </label>
          </div>
        </div>

        <div className="flex gap-4 pt-6 border-t">
          <Button
            type="button"
            onClick={() => router.back()}
            className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            Hủy
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="flex-1"
          >
            {loading ? 'Đang cập nhật...' : 'Cập nhật'}
          </Button>
        </div>
      </form>
    </div>
  );
}
