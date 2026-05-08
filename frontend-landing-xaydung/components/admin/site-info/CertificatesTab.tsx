'use client';

import { useState, useEffect } from 'react';
import { api, uploadApi } from '@/lib/api';
import { Button, Input, Textarea, useSnackbar } from '@/components/ui';
import { Plus, Pencil, Trash2, Upload, X, FileText, Image as ImageIcon } from 'lucide-react';

interface Certificate {
  _id: string;
  title: string;
  fileUrl: string;
  fileType: 'pdf' | 'image';
  description?: string;
  issuedDate?: string;
  order: number;
  isActive: boolean;
}

export default function CertificatesTab() {
  const snackbar = useSnackbar();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    fileUrl: '',
    fileType: 'image' as 'pdf' | 'image',
    description: '',
    issuedDate: '',
    order: 0,
    isActive: true,
  });
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState('');

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/site-info/certificates');
      setCertificates(response.data);
    } catch (error: any) {
      snackbar.error('Không thể tải danh sách');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (cert?: Certificate) => {
    if (cert) {
      setEditingId(cert._id);
      setFormData({
        title: cert.title,
        fileUrl: cert.fileUrl,
        fileType: cert.fileType,
        description: cert.description || '',
        issuedDate: cert.issuedDate || '',
        order: cert.order,
        isActive: cert.isActive,
      });
      setFilePreview(cert.fileUrl);
    } else {
      setEditingId(null);
      setFormData({
        title: '',
        fileUrl: '',
        fileType: 'image',
        description: '',
        issuedDate: '',
        order: 0,
        isActive: true,
      });
      setFilePreview('');
    }
    setFile(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFile(null);
    setFilePreview('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const isPdf = selectedFile.type === 'application/pdf';
      const isImage = selectedFile.type.startsWith('image/');
      
      if (!isPdf && !isImage) {
        snackbar.error('Vui lòng chọn file PDF hoặc ảnh');
        return;
      }
      if (selectedFile.size > 10 * 1024 * 1024) {
        snackbar.error('Kích thước file tối đa 10MB');
        return;
      }
      
      setFile(selectedFile);
      setFormData({ ...formData, fileType: isPdf ? 'pdf' : 'image' });
      
      if (isImage) {
        const reader = new FileReader();
        reader.onloadend = () => setFilePreview(reader.result as string);
        reader.readAsDataURL(selectedFile);
      } else {
        setFilePreview('');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setUploading(true);
      
      let fileUrl = formData.fileUrl;
      if (file) {
        const uploadResult = await uploadApi.uploadCertificate(file);
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
        fileUrl = `${baseUrl}${uploadResult.path}`;
      }

      const data = { ...formData, fileUrl };

      if (editingId) {
        await api.put(`/api/site-info/certificates/${editingId}`, data);
        snackbar.success('Đã cập nhật chứng chỉ');
      } else {
        await api.post('/api/site-info/certificates', data);
        snackbar.success('Đã thêm chứng chỉ');
      }

      handleCloseModal();
      fetchCertificates();
    } catch (error: any) {
      snackbar.error(error.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa?')) return;
    
    try {
      await api.delete(`/api/site-info/certificates/${id}`);
      snackbar.success('Đã xóa chứng chỉ');
      fetchCertificates();
    } catch (error: any) {
      snackbar.error('Không thể xóa');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Giải thưởng & Chứng chỉ</h2>
        <Button onClick={() => handleOpenModal()} leftIcon={<Plus className="w-4 h-4" />}>
          Thêm chứng chỉ
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : certificates.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">Chưa có chứng chỉ nào</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert) => (
            <div key={cert._id} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gray-100 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                {cert.fileType === 'image' ? (
                  <img src={cert.fileUrl} alt={cert.title} className="w-full h-full object-cover" />
                ) : (
                  <FileText className="w-16 h-16 text-gray-400" />
                )}
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{cert.title}</h3>
              {cert.description && (
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{cert.description}</p>
              )}
              {cert.issuedDate && (
                <p className="text-xs text-gray-500 mb-3">
                  Ngày cấp: {new Date(cert.issuedDate).toLocaleDateString('vi-VN')}
                </p>
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => handleOpenModal(cert)}
                  className="flex-1 p-2 text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-medium"
                >
                  <Pencil className="w-4 h-4 mx-auto" />
                </button>
                <button
                  onClick={() => handleDelete(cert._id)}
                  className="flex-1 p-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium"
                >
                  <Trash2 className="w-4 h-4 mx-auto" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">
                {editingId ? 'Chỉnh sửa chứng chỉ' : 'Thêm chứng chỉ'}
              </h3>
              <button onClick={handleCloseModal} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  File (PDF hoặc Ảnh) <span className="text-red-500">*</span>
                </label>
                {filePreview && formData.fileType === 'image' ? (
                  <div className="relative">
                    <img src={filePreview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                    <button
                      type="button"
                      onClick={() => {
                        setFile(null);
                        setFilePreview('');
                        setFormData({ ...formData, fileUrl: '' });
                      }}
                      className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : formData.fileUrl && formData.fileType === 'pdf' ? (
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <FileText className="w-8 h-8 text-red-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">File PDF đã tải lên</p>
                      <a href={formData.fileUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary-600 hover:underline">
                        Xem file
                      </a>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setFile(null);
                        setFilePreview('');
                        setFormData({ ...formData, fileUrl: '' });
                      }}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-500">
                    <input type="file" accept="image/*,.pdf" onChange={handleFileChange} className="hidden" />
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">Tải lên PDF hoặc ảnh (tối đa 10MB)</span>
                  </label>
                )}
              </div>

              <Input
                label={<>Tiêu đề <span className="text-red-500">*</span></>}
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Tên giải thưởng hoặc chứng chỉ"
              />

              <Textarea
                label="Mô tả"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Mô tả chi tiết"
                rows={3}
              />

              <Input
                label="Ngày cấp"
                type="date"
                value={formData.issuedDate}
                onChange={(e) => setFormData({ ...formData, issuedDate: e.target.value })}
              />

              <Input
                label="Thứ tự"
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
              />

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-primary-600 rounded"
                />
                <span className="text-sm font-medium text-gray-700">Hiển thị</span>
              </label>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={handleCloseModal} className="flex-1">
                  Hủy
                </Button>
                <Button type="submit" disabled={uploading || (!file && !formData.fileUrl)} className="flex-1">
                  {uploading ? 'Đang lưu...' : editingId ? 'Cập nhật' : 'Thêm'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
