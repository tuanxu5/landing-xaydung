'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { Button } from '@/components/ui';

interface User {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  district?: string;
  ward?: string;
  role: 'admin' | 'user';
  isActive: boolean;
  avatar?: string;
  notes?: string;
}

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    ward: '',
    role: 'user' as 'admin' | 'user',
    isActive: true,
    avatar: '',
    notes: '',
  });

  useEffect(() => {
    fetchUser();
  }, [userId]);

  const fetchUser = async () => {
    try {
      setFetching(true);
      setError(null);
      const response = await api.get(`/users/${userId}`);
      const user: User = response.data;
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        district: user.district || '',
        ward: user.ward || '',
        role: user.role || 'user',
        isActive: user.isActive ?? true,
        avatar: user.avatar || '',
        notes: user.notes || '',
      });
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Không thể tải thông tin người dùng');
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await api.patch(`/users/${userId}`, formData);
      router.push('/admin/users');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Không thể cập nhật người dùng');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-10 py-10">
        <div className="mb-6">
          <div className="h-9 bg-gray-200 rounded-lg w-64 mb-2 animate-pulse"></div>
          <div className="h-5 bg-gray-200 rounded-lg w-96 animate-pulse"></div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-10 py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Chỉnh sửa người dùng</h1>
        <p className="mt-1 text-base text-gray-600">Cập nhật thông tin người dùng</p>
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
              Họ và tên *
            </label>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Nguyễn Văn A"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="email@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Số điện thoại *
            </label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="0912345678"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Địa chỉ
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Số nhà, tên đường"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tỉnh/Thành phố
            </label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Hà Nội"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quận/Huyện
            </label>
            <input
              type="text"
              value={formData.district}
              onChange={(e) => setFormData({ ...formData, district: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Cầu Giấy"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phường/Xã
            </label>
            <input
              type="text"
              value={formData.ward}
              onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Dịch Vọng"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vai trò *
            </label>
            <select
              required
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'user' })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="user">Khách hàng</option>
              <option value="admin">Quản trị viên</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL ảnh đại diện
            </label>
            <input
              type="url"
              value={formData.avatar}
              onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="https://example.com/avatar.jpg"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ghi chú
            </label>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Ghi chú về người dùng..."
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
              Tài khoản hoạt động
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
            {loading ? 'Đang cập nhật...' : 'Cập nhật người dùng'}
          </Button>
        </div>
      </form>
    </div>
  );
}
