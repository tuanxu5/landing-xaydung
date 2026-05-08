'use client';

import { useState, useEffect } from 'react';
import { User, Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { authApi } from '@/lib/api';
import { Button, Input, useSnackbar } from '@/components/ui';
import ProtectedRoute from '@/components/admin/ProtectedRoute';

type TabType = 'profile' | 'password';

export default function SettingsPage() {
  const { administrator } = useAuth();
  const snackbar = useSnackbar();
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  
  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      snackbar.error('Mật khẩu mới không khớp!');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      snackbar.error('Mật khẩu mới phải có ít nhất 6 ký tự!');
      return;
    }

    try {
      setSubmitting(true);
      await authApi.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
        confirmPassword: passwordForm.confirmPassword,
      });
      snackbar.success('Đổi mật khẩu thành công!');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err: any) {
      const errorMsg = err.message || 'Không thể đổi mật khẩu';
      snackbar.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-10 py-10">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center shadow-lg shadow-gray-500/30">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Cài đặt tài khoản</h1>
              <p className="text-base text-gray-600">
                Quản lý thông tin cá nhân và bảo mật
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex-1 px-6 py-4 text-sm font-semibold transition-colors ${
                  activeTab === 'profile'
                    ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50/50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <User className="w-4 h-4" />
                  <span>Thông tin cá nhân</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('password')}
                className={`flex-1 px-6 py-4 text-sm font-semibold transition-colors ${
                  activeTab === 'password'
                    ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50/50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Lock className="w-4 h-4" />
                  <span>Đổi mật khẩu</span>
                </div>
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'profile' ? (
              // Profile Tab
              <div className="space-y-6">
                <div className="flex items-center gap-4 pb-6 border-b border-gray-200">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/30">
                    <span className="text-3xl font-bold text-white">
                      {administrator?.username?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{administrator?.username}</h3>
                    <p className="text-sm text-gray-500">Quản trị viên</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Tên đăng nhập
                    </label>
                    <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900">
                      {administrator?.username}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email
                    </label>
                    <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900">
                      {administrator?.email || 'Chưa cập nhật'}
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Đăng nhập lần cuối
                    </label>
                    <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900">
                      {administrator?.lastLoginAt
                        ? new Date(administrator.lastLoginAt).toLocaleString('vi-VN', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : 'Chưa có thông tin'}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <h4 className="text-sm font-semibold text-blue-900 mb-1">Thông tin chỉ đọc</h4>
                        <p className="text-sm text-blue-700">
                          Thông tin tài khoản hiện tại không thể chỉnh sửa. Vui lòng liên hệ quản trị viên cấp cao hơn nếu cần thay đổi.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Password Tab
              <form onSubmit={handlePasswordChange} className="space-y-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h4 className="text-sm font-semibold text-yellow-900 mb-1">Lưu ý bảo mật</h4>
                      <p className="text-sm text-yellow-700">
                        Mật khẩu mới phải có ít nhất 6 ký tự. Nên sử dụng kết hợp chữ hoa, chữ thường, số và ký tự đặc biệt.
                      </p>
                    </div>
                  </div>
                </div>

                <Input
                  label={
                    <>
                      Mật khẩu hiện tại <span className="text-red-500">*</span>
                    </>
                  }
                  type="password"
                  required
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                  }
                  placeholder="Nhập mật khẩu hiện tại"
                />

                <Input
                  label={
                    <>
                      Mật khẩu mới <span className="text-red-500">*</span>
                    </>
                  }
                  type="password"
                  required
                  minLength={6}
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                  }
                  placeholder="Nhập mật khẩu mới"
                  helperText="Tối thiểu 6 ký tự"
                />

                <Input
                  label={
                    <>
                      Xác nhận mật khẩu mới <span className="text-red-500">*</span>
                    </>
                  }
                  type="password"
                  required
                  minLength={6}
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                  }
                  placeholder="Nhập lại mật khẩu mới"
                />

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() =>
                      setPasswordForm({
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: '',
                      })
                    }
                    disabled={submitting}
                  >
                    Hủy
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? 'Đang xử lý...' : 'Đổi mật khẩu'}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
