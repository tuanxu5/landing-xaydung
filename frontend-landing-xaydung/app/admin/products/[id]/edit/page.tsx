'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { api, uploadApi } from '@/lib/api';
import { generateSlug } from '@/lib/utils';
import { Button, Card, Input, Select, Checkbox, TagInput, useSnackbar } from '@/components/ui';
import RichTextEditor from '@/components/ui/RichTextEditor';
import { X, Upload, Image as ImageIcon } from 'lucide-react';

interface Category {
  _id: string;
  name: string;
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const snackbar = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    specifications: '',
    promotionPolicy: '',
    category: '',
    brands: [] as string[],
    images: [] as string[],
    isActive: true,
    isFeatured: false,
  });

  useEffect(() => {
    fetchCategories();
    fetchProduct();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data.categories || response.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchProduct = async () => {
    try {
      setFetching(true);
      setError(null);
      const response = await api.get(`/products/${params.id}`);
      const product = response.data;
      setFormData({
        name: product.name,
        description: product.description || '',
        specifications: product.specifications || '',
        promotionPolicy: product.promotionPolicy || '',
        category: product.category?._id || product.category || '',
        brands: product.brands || [],
        images: product.images || (product.thumbnail ? [product.thumbnail] : []),
        isActive: product.isActive,
        isFeatured: product.isFeatured,
      });
    } catch (err: any) {
      const errorMsg = err.message || 'Không thể tải thông tin sản phẩm';
      setError(errorMsg);
      snackbar.error(errorMsg);
    } finally {
      setFetching(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploading(true);
      const uploadPromises = Array.from(files).map(async (file) => {
        try {
          return await uploadApi.uploadImage(file);
        } catch (err: any) {
          console.error('Upload error for file:', file.name, err);
          throw err;
        }
      });
      
      const results = await Promise.all(uploadPromises);
      const imageUrls = results.map(result => result.path);
      
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...imageUrls]
      }));
      
      snackbar.success(`Đã tải lên ${results.length} ảnh thành công!`);
      
      // Reset input
      e.target.value = '';
    } catch (err: any) {
      console.error('Upload error:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Không thể tải ảnh lên';
      snackbar.error(errorMsg);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      
      const submitData = {
        name: formData.name,
        slug: generateSlug(formData.name),
        description: formData.description,
        specifications: formData.specifications,
        promotionPolicy: formData.promotionPolicy,
        category: formData.category,
        brands: formData.brands,
        images: formData.images,
        thumbnail: formData.images[0] || '',
        isActive: formData.isActive,
        isFeatured: formData.isFeatured,
        price: 0,
        unit: 'cái',
        stock: 0,
      };
      
      await api.patch(`/products/${params.id}`, submitData);
      snackbar.success('Sản phẩm đã được cập nhật thành công!');
      setTimeout(() => router.push('/admin/products'), 1000);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || 'Không thể cập nhật sản phẩm';
      setError(errorMsg);
      snackbar.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
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
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Chỉnh sửa sản phẩm</h1>
        <p className="text-base text-gray-600">
          Cập nhật thông tin sản phẩm
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form - 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info Card */}
            <Card>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Thông tin cơ bản</h3>
              
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <div className="space-y-4">
                {/* Product Name */}
                <Input
                  label={
                    <>
                      Tên sản phẩm <span className="text-red-500 ml-1">*</span>
                    </>
                  }
                  leftIcon={
                    <svg className="w-4 h-4 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  }
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nhập tên sản phẩm..."
                />

                {/* Brands */}
                <TagInput
                  label="Thương hiệu"
                  value={formData.brands}
                  onChange={(brands) => setFormData({ ...formData, brands })}
                  placeholder="Nhập thương hiệu và nhấn Enter..."
                />
              </div>
            </Card>

            {/* Description Card */}
            <Card>
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Mô tả sản phẩm <span className="text-red-500 ml-1">*</span>
              </h3>
              <RichTextEditor
                value={formData.description}
                onChange={(value) => setFormData({ ...formData, description: value })}
                placeholder="Nhập mô tả chi tiết về sản phẩm..."
              />
            </Card>

            {/* Specifications Card */}
            <Card>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Thông số kỹ thuật</h3>
              <RichTextEditor
                value={formData.specifications}
                onChange={(value) => setFormData({ ...formData, specifications: value })}
                placeholder="Nhập thông số kỹ thuật của sản phẩm..."
              />
            </Card>

            {/* Promotion Policy Card */}
            <Card>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Chính sách ưu đãi</h3>
              <RichTextEditor
                value={formData.promotionPolicy}
                onChange={(value) => setFormData({ ...formData, promotionPolicy: value })}
                placeholder="Nhập các chính sách ưu đãi, khuyến mãi..."
              />
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Product Settings */}
            <Card>
              <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Cài đặt
              </h3>

              <div className="space-y-4">
                {/* Category */}
                <Select
                  label={
                    <>
                      Danh mục <span className="text-red-500">*</span>
                    </>
                  }
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="">-- Chọn danh mục --</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </Select>

                {/* Status Checkboxes */}
                <div className="pt-4 border-t border-gray-200 space-y-3">
                  <Checkbox
                    id="isActive"
                    label="Hiển thị sản phẩm"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />

                  <Checkbox
                    id="isFeatured"
                    label="Sản phẩm nổi bật"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  />
                </div>
              </div>
            </Card>

            {/* Product Images */}
            <Card>
              <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center">
                <ImageIcon className="w-5 h-5 mr-2 text-primary-600" />
                Hình ảnh sản phẩm
              </h3>

              <div className="space-y-4">
                {/* Upload Button */}
                <div>
                  <input
                    type="file"
                    id="image-upload"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="image-upload"
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors cursor-pointer"
                  >
                    <Upload className="w-5 h-5 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">
                      {uploading ? 'Đang tải lên...' : 'Tải ảnh lên'}
                    </span>
                  </label>
                  <p className="text-xs text-gray-500 mt-2">
                    Có thể chọn nhiều ảnh cùng lúc. Ảnh đầu tiên sẽ là ảnh đại diện.
                  </p>
                </div>

                {/* Image Grid */}
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-2 gap-3">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={image}
                          alt={`Product ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {index === 0 && (
                          <div className="absolute top-2 left-2 px-2 py-1 bg-primary-600 text-white text-xs font-bold rounded">
                            Ảnh đại diện
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>

            {/* Submit Buttons */}
            <div className="flex flex-col gap-3">
              <Button
                type="submit"
                disabled={loading || uploading}
                size="lg"
                className="w-full"
                leftIcon={
                  loading ? (
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )
                }
              >
                {loading ? 'Đang cập nhật...' : 'Cập nhật sản phẩm'}
              </Button>
              
              <Button
                type="button"
                onClick={() => router.back()}
                className="w-full bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                Hủy
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
