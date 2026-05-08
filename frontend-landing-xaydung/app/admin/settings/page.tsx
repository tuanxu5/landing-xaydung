'use client';

import { useState, useEffect } from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import { api } from '@/lib/api';
import { Button, Input, Textarea, useSnackbar } from '@/components/ui';
import ProtectedRoute from '@/components/admin/ProtectedRoute';

interface SettingsData {
  siteName?: string;
  siteDescription?: string;
  address?: string;
  email?: string;
  phone?: string;
  zalo?: string;
  facebook?: string;
  youtube?: string;
  instagram?: string;
  workingHours?: string;
  googleMapsUrl?: string;
}

export default function SettingsPage() {
  const snackbar = useSnackbar();
  const [settings, setSettings] = useState<SettingsData>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/settings');
      setSettings(response.data);
    } catch (err: any) {
      setError(err.message || 'Không thể tải cài đặt');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError(null);
      await api.patch('/settings', settings);
      snackbar.success('Cài đặt đã được cập nhật thành công!');
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || 'Có lỗi xảy ra';
      setError(errorMsg);
      snackbar.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (field: keyof SettingsData, value: string) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-10 py-10">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/30">
              <SettingsIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Thông tin chung</h1>
              <p className="text-base text-gray-600">
                Quản lý thông tin liên hệ và mạng xã hội của website
              </p>
            </div>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Settings Form */}
        {loading ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Thông tin website */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                Thông tin website
              </h2>
              <div className="space-y-4">
                <Input
                  label="Tên website"
                  value={settings.siteName || ''}
                  onChange={(e) => handleChange('siteName', e.target.value)}
                  placeholder="Vật liệu xây dựng ABC"
                />
                <Textarea
                  label="Mô tả website"
                  value={settings.siteDescription || ''}
                  onChange={(e) => handleChange('siteDescription', e.target.value)}
                  placeholder="Cung cấp vật liệu xây dựng chất lượng cao..."
                  rows={3}
                />
              </div>
            </div>

            {/* Thông tin liên hệ */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Thông tin liên hệ
              </h2>
              <div className="space-y-4">
                <Textarea
                  label="Địa chỉ"
                  value={settings.address || ''}
                  onChange={(e) => handleChange('address', e.target.value)}
                  placeholder="123 Đường ABC, Quận XYZ, TP. HCM"
                  rows={2}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Email"
                    type="email"
                    value={settings.email || ''}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="contact@example.com"
                  />
                  <Input
                    label="Số điện thoại"
                    value={settings.phone || ''}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder="0912345678"
                  />
                </div>
                <Input
                  label="Zalo"
                  value={settings.zalo || ''}
                  onChange={(e) => handleChange('zalo', e.target.value)}
                  placeholder="0912345678"
                  helperText="Số điện thoại Zalo để khách hàng liên hệ"
                />
                <Textarea
                  label="Giờ làm việc"
                  value={settings.workingHours || ''}
                  onChange={(e) => handleChange('workingHours', e.target.value)}
                  placeholder="Thứ 2 - Thứ 6: 8:00 - 17:00&#10;Thứ 7: 8:00 - 12:00&#10;Chủ nhật: Nghỉ"
                  rows={3}
                />
              </div>
            </div>

            {/* Mạng xã hội */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
                Mạng xã hội
              </h2>
              <div className="space-y-4">
                <Input
                  label="Facebook"
                  value={settings.facebook || ''}
                  onChange={(e) => handleChange('facebook', e.target.value)}
                  placeholder="https://facebook.com/yourpage"
                  helperText="Link đến trang Facebook của bạn"
                />
                <Input
                  label="YouTube"
                  value={settings.youtube || ''}
                  onChange={(e) => handleChange('youtube', e.target.value)}
                  placeholder="https://youtube.com/@yourchannel"
                  helperText="Link đến kênh YouTube của bạn"
                />
                <Input
                  label="Instagram"
                  value={settings.instagram || ''}
                  onChange={(e) => handleChange('instagram', e.target.value)}
                  placeholder="https://instagram.com/yourprofile"
                  helperText="Link đến trang Instagram của bạn"
                />
              </div>
            </div>

            {/* Google Maps */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Bản đồ
              </h2>
              <div className="space-y-4">
                <Textarea
                  label="Google Maps Embed URL"
                  value={settings.googleMapsUrl || ''}
                  onChange={(e) => handleChange('googleMapsUrl', e.target.value)}
                  placeholder="https://www.google.com/maps/embed?pb=..."
                  rows={3}
                  helperText="Link nhúng Google Maps (Share → Embed a map → Copy HTML)"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={fetchSettings}
                disabled={submitting}
              >
                Hủy thay đổi
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Đang lưu...' : 'Lưu cài đặt'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </ProtectedRoute>
  );
}
