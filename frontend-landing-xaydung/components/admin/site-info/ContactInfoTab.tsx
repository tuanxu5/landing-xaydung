'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Button, Input, Textarea, useSnackbar } from '@/components/ui';
import { Save, MapPin, Phone, Mail, Globe, Clock, FileText, Building2 } from 'lucide-react';

interface ContactInfo {
  _id: string;
  companyName: string;
  address: string;
  phone: string;
  email?: string;
  website?: string;
  facebookUrl?: string;
  zaloUrl?: string;
  youtubeUrl?: string;
  linkedinUrl?: string;
  mapEmbedUrl?: string;
  workingHours?: string;
  taxCode?: string;
  description?: string;
}

export default function ContactInfoTab() {
  const snackbar = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<ContactInfo>({
    _id: '',
    companyName: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    facebookUrl: '',
    zaloUrl: '',
    youtubeUrl: '',
    linkedinUrl: '',
    mapEmbedUrl: '',
    workingHours: '',
    taxCode: '',
    description: '',
  });

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/site-info/contact');
      setFormData(response.data);
    } catch (error: any) {
      snackbar.error('Không thể tải thông tin liên hệ');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      await api.put('/api/site-info/contact', formData);
      snackbar.success('Đã cập nhật thông tin liên hệ');
      fetchContactInfo();
    } catch (error: any) {
      snackbar.error(error.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Thông tin liên hệ</h2>
        <p className="text-sm text-gray-600">Quản lý thông tin liên hệ và mạng xã hội của công ty</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Thông tin cơ bản */}
        <div className="bg-gray-50 rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary-600" />
            Thông tin công ty
          </h3>
          
          <Input
            label={
              <>
                Tên công ty <span className="text-red-500">*</span>
              </>
            }
            required
            value={formData.companyName}
            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
            placeholder="Công ty TNHH Vật liệu Xây dựng"
          />

          <Textarea
            label={
              <>
                Địa chỉ <span className="text-red-500">*</span>
              </>
            }
            required
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
            rows={2}
          />

          <Input
            label="Mã số thuế"
            value={formData.taxCode || ''}
            onChange={(e) => setFormData({ ...formData, taxCode: e.target.value })}
            placeholder="0123456789"
          />

          <Textarea
            label="Mô tả công ty"
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Giới thiệu ngắn về công ty"
            rows={3}
          />
        </div>

        {/* Liên hệ */}
        <div className="bg-gray-50 rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Phone className="w-5 h-5 text-primary-600" />
            Thông tin liên hệ
          </h3>

          <Input
            label={
              <>
                Số điện thoại <span className="text-red-500">*</span>
              </>
            }
            required
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="0123456789"
          />

          <Input
            label="Email"
            type="email"
            value={formData.email || ''}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="contact@example.com"
          />

          <Input
            label="Website"
            type="url"
            value={formData.website || ''}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            placeholder="https://example.com"
          />

          <Input
            label="Giờ làm việc"
            value={formData.workingHours || ''}
            onChange={(e) => setFormData({ ...formData, workingHours: e.target.value })}
            placeholder="Thứ 2 - Thứ 6: 8:00 - 17:00"
          />
        </div>

        {/* Mạng xã hội */}
        <div className="bg-gray-50 rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary-600" />
            Mạng xã hội
          </h3>

          <Input
            label="Facebook"
            type="url"
            value={formData.facebookUrl || ''}
            onChange={(e) => setFormData({ ...formData, facebookUrl: e.target.value })}
            placeholder="https://facebook.com/yourpage"
          />

          <Input
            label="Zalo"
            type="url"
            value={formData.zaloUrl || ''}
            onChange={(e) => setFormData({ ...formData, zaloUrl: e.target.value })}
            placeholder="https://zalo.me/yourpage"
          />

          <Input
            label="YouTube"
            type="url"
            value={formData.youtubeUrl || ''}
            onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
            placeholder="https://youtube.com/@yourchannel"
          />

          <Input
            label="LinkedIn"
            type="url"
            value={formData.linkedinUrl || ''}
            onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
            placeholder="https://linkedin.com/company/yourcompany"
          />
        </div>

        {/* Google Maps */}
        <div className="bg-gray-50 rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary-600" />
            Bản đồ
          </h3>

          <Textarea
            label="Google Maps Embed URL"
            value={formData.mapEmbedUrl || ''}
            onChange={(e) => setFormData({ ...formData, mapEmbedUrl: e.target.value })}
            placeholder="https://www.google.com/maps/embed?pb=..."
            rows={3}
            helperText="Lấy mã nhúng từ Google Maps: Tìm địa chỉ → Chia sẻ → Nhúng bản đồ → Sao chép URL"
          />

          {formData.mapEmbedUrl && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Xem trước:</p>
              <div className="aspect-video rounded-lg overflow-hidden border border-gray-200">
                <iframe
                  src={formData.mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          )}
        </div>

        {/* Submit button */}
        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={fetchContactInfo}
            disabled={submitting}
          >
            Hủy thay đổi
          </Button>
          <Button type="submit" disabled={submitting} leftIcon={<Save className="w-4 h-4" />}>
            {submitting ? 'Đang lưu...' : 'Lưu thông tin'}
          </Button>
        </div>
      </form>
    </div>
  );
}
