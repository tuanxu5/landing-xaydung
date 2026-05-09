'use client';

import { useState, useEffect } from 'react';
import { api, uploadApi } from '@/lib/api';
import { Button, Input, Textarea, useSnackbar } from '@/components/ui';
import { Plus, Pencil, Trash2, Upload, X, Star } from 'lucide-react';

interface Brand {
  _id: string;
  name: string;
  logo: string;
  description?: string;
  website?: string;
  order: number;
  isActive: boolean;
}

export default function BrandsTab() {
  const snackbar = useSnackbar();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    logo: '',
    description: '',
    website: '',
    order: 0,
    isActive: true,
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState('');

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/site-info/brands');
      setBrands(response.data);
    } catch (error: any) {
      snackbar.error('Không thể tải danh sách');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (brand?: Brand) => {
    if (brand) {
      setEditingId(brand._id);
      setFormData({
        name: brand.name,
        logo: brand.logo,
        description: brand.description || '',
        website: brand.website || '',
        order: brand.order,
        isActive: brand.isActive,
      });
      setLogoPreview(brand.logo);
    } else {
      setEditingId(null);
      setFormData({
        name: '',
        logo: '',
        description: '',
        website: '',
        order: 0,
        isActive: true,
      });
      setLogoPreview('');
    }
    setLogoFile(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setLogoFile(null);
    setLogoPreview('');
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        snackbar.error('Vui lòng chọn file ảnh');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        snackbar.error('Kích thước ảnh tối đa 5MB');
        return;
      }
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setUploading(true);
      
      let logoUrl = formData.logo;
      if (logoFile) {
        const uploadResult = await uploadApi.uploadImage(logoFile);
        // Backend now returns full URL
        logoUrl = uploadResult.url || uploadResult.path;
      }

      const data = { ...formData, logo: logoUrl };

      if (editingId) {
        await api.put(`/api/site-info/brands/${editingId}`, data);
        snackbar.success('Đã cập nhật thương hiệu');
      } else {
        await api.post('/api/site-info/brands', data);
        snackbar.success('Đã thêm thương hiệu');
      }

      handleCloseModal();
      fetchBrands();
    } catch (error: any) {
      snackbar.error(error.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa?')) return;
    
    try {
      await api.delete(`/api/site-info/brands/${id}`);
      snackbar.success('Đã xóa thương hiệu');
      fetchBrands();
    } catch (error: any) {
      snackbar.error('Không thể xóa');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Thương hiệu nổi bật</h2>
        <Button onClick={() => handleOpenModal()} leftIcon={<Plus className="w-4 h-4" />}>
          Thêm thương hiệu
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : brands.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <Star className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">Chưa có thương hiệu nào</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {brands.map((brand) => (
            <div key={brand._id} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-shadow">
              <div className="aspect-square bg-gray-50 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                <img src={brand.logo} alt={brand.name} className="w-full h-full object-contain p-2" />
              </div>
              <h3 className="font-bold text-gray-900 text-center mb-2 truncate">{brand.name}</h3>
              {brand.description && (
                <p className="text-xs text-gray-600 text-center mb-3 line-clamp-2">{brand.description}</p>
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => handleOpenModal(brand)}
                  className="flex-1 p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <Pencil className="w-4 h-4 mx-auto" />
                </button>
                <button
                  onClick={() => handleDelete(brand._id)}
                  className="flex-1 p-2 text-red-600 hover:bg-red-50 rounded-lg"
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
                {editingId ? 'Chỉnh sửa thương hiệu' : 'Thêm thương hiệu'}
              </h3>
              <button onClick={handleCloseModal} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logo <span className="text-red-500">*</span>
                </label>
                {logoPreview ? (
                  <div className="relative w-48 h-48 mx-auto">
                    <img src={logoPreview} alt="Preview" className="w-full h-full object-contain bg-gray-50 rounded-lg p-4" />
                    <button
                      type="button"
                      onClick={() => {
                        setLogoFile(null);
                        setLogoPreview('');
                        setFormData({ ...formData, logo: '' });
                      }}
                      className="absolute -top-2 -right-2 p-1 bg-red-600 text-white rounded-full"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-48 h-48 mx-auto border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-500">
                    <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">Tải logo</span>
                  </label>
                )}
              </div>

              <Input
                label={<>Tên thương hiệu <span className="text-red-500">*</span></>}
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Tên thương hiệu"
              />

              <Textarea
                label="Mô tả"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Mô tả ngắn về thương hiệu"
                rows={3}
              />

              <Input
                label="Website"
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://example.com"
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
                <Button type="submit" disabled={uploading} className="flex-1">
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
