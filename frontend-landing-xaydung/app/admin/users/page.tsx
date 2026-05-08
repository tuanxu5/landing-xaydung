'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Users as UsersIcon } from 'lucide-react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui';

interface User {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  role: 'admin' | 'user';
  isActive: boolean;
  avatar?: string;
  createdAt: string;
}

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchUsers();
  }, [page, search]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/users', {
        params: { page, limit: 20, search: search || undefined },
      });
      setUsers(response.data.users);
      setTotalPages(response.data.totalPages);
    } catch (err: any) {
      setError(err.message || 'Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      setError(null);
      await api.delete(`/users/${id}`);
      await fetchUsers();
      setDeleteConfirmId(null);
    } catch (err: any) {
      setError(err.message || 'Không thể xóa người dùng');
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
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
            <h1 className="text-3xl font-bold text-gray-900">Quản lý Người dùng</h1>
            <p className="mt-1 text-base text-gray-600">
              Quản lý khách hàng và tài khoản quản trị viên.
            </p>
          </div>
          <Button
            onClick={() => router.push('/admin/users/new')}
            leftIcon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            }
          >
            Thêm người dùng
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
                onClick={fetchUsers}
                className="mt-2 text-sm font-medium text-red-800 hover:text-red-900 underline cursor-pointer transition-colors"
              >
                Thử lại
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Users Grid */}
      {users.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <UsersIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">Chưa có người dùng</h3>
            <p className="text-sm text-gray-500 mb-6">
              Bắt đầu bằng cách thêm người dùng đầu tiên.
            </p>
            <Button
              onClick={() => router.push('/admin/users/new')}
              leftIcon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              }
            >
              Thêm người dùng
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <div
              key={user._id}
              className="group cursor-pointer bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-primary-200 p-3"
            >
              {/* User Avatar */}
              <div className="relative h-56 bg-gradient-to-br from-purple-50 via-purple-100 to-purple-200 flex flex-col items-center justify-center overflow-hidden rounded-xl mb-4">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/20 rounded-full translate-y-1/2 -translate-x-1/2"></div>
                
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.fullName}
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg relative z-10"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center border-4 border-white shadow-lg relative z-10">
                    <span className="text-3xl font-bold text-purple-600">
                      {user.fullName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                
                {/* Role Badge */}
                <div className="absolute top-3 right-3 z-20">
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 backdrop-blur-sm rounded-full text-xs font-semibold shadow-lg ${
                    user.role === 'admin' 
                      ? 'bg-purple-500/95 text-white' 
                      : 'bg-white/95 text-blue-700'
                  }`}>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>{user.role === 'admin' ? 'Admin' : 'Khách hàng'}</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="px-2">
                {/* Name */}
                <h3 className="text-xl font-bold text-gray-900 line-clamp-1 group-hover:text-primary-600 transition-colors leading-tight mb-2">
                  {user.fullName}
                </h3>
                
                {/* Contact Info */}
                <div className="space-y-1.5 mb-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4 flex-shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="truncate">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4 flex-shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>{user.phone}</span>
                  </div>
                  {user.city && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <svg className="w-4 h-4 flex-shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="truncate">{user.city}</span>
                    </div>
                  )}
                </div>

                {/* Date & Status */}
                <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                  <span>Tham gia: {formatDate(user.createdAt)}</span>
                  {!user.isActive && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      Tạm khóa
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                  {deleteConfirmId === user._id ? (
                    <div className="flex items-center justify-between w-full gap-3">
                      <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Xác nhận xóa?</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDelete(user._id)}
                          disabled={deletingId === user._id}
                          className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all hover:shadow-lg whitespace-nowrap"
                        >
                          {deletingId === user._id ? 'Đang xóa...' : 'Xóa'}
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          disabled={deletingId === user._id}
                          className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all whitespace-nowrap"
                        >
                          Hủy
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => router.push(`/admin/users/${user._id}/edit`)}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-xl cursor-pointer transition-all hover:shadow-lg hover:scale-105 whitespace-nowrap"
                      >
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span>Chỉnh sửa</span>
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(user._id)}
                        className="inline-flex items-center justify-center p-2.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl cursor-pointer transition-all hover:scale-105"
                        title="Xóa người dùng"
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
