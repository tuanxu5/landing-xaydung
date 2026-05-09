'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { recruitmentsApi, uploadApi } from '@/lib/api';
import { Card, Button, Input, Textarea, useSnackbar } from '@/components/ui';
import type { CreateRecruitmentDto, ApiError } from '@/types';
import { ArrowLeft, Upload, Calendar } from 'lucide-react';

export default function CreateRecruitmentPage() {
  const router = useRouter();
  const snackbar = useSnackbar();

  const [formData, setFormData] = useState<CreateRecruitmentDto>({
    banner: '',
    title: '',
    quantity: 1,
    location: '',
    department: '',
    jobDescription: '',
    candidateRequirements: '',
    salary: '',
    benefits: '',
    contact: '',
    applicationDeadline: '',
    isActive: true,
  });

  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string>('');
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value,
    }));

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrors((prev) => ({ ...prev, banner: 'Vui lòng chọn file ảnh' }));
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, banner: 'Kích thước ảnh tối đa 5MB' }));
        return;
      }

      setBannerFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      if (errors.banner) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.banner;
          return newErrors;
        });
      }
    }
  };

  const handleRemoveBanner = () => {
    setBannerFile(null);
    setBannerPreview('');
    setFormData((prev) => ({ ...prev, banner: '' }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Vui lòng nhập tiêu đề';
    if (!formData.department.trim()) newErrors.department = 'Vui lòng nhập bộ phận';
    if (!formData.location.trim()) newErrors.location = 'Vui lòng nhập địa điểm';
    if (formData.quantity < 1) newErrors.quantity = 'Số lượng phải lớn hơn 0';
    if (!formData.jobDescription.trim()) newErrors.jobDescription = 'Vui lòng nhập mô tả công việc';
    if (!formData.candidateRequirements.trim()) newErrors.candidateRequirements = 'Vui lòng nhập yêu cầu ứng viên';
    if (!formData.salary.trim()) newErrors.salary = 'Vui lòng nhập mức lương';
    if (!formData.benefits.trim()) newErrors.benefits = 'Vui lòng nhập quyền lợi';
    if (!formData.contact.trim()) newErrors.contact = 'Vui lòng nhập thông tin liên hệ';
    if (!formData.applicationDeadline) newErrors.applicationDeadline = 'Vui lòng chọn thời hạn ứng tuyển';
    if (!bannerFile && !formData.banner) newErrors.banner = 'Vui lòng chọn ảnh banner';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      snackbar.error('Vui lòng kiểm tra lại thông tin!');
      return;
    }

    try {
      setSaving(true);

      let bannerUrl = formData.banner;
      if (bannerFile) {
        setUploadingBanner(true);
        try {
          const uploadResult = await uploadApi.uploadImage(bannerFile);
          // Backend now returns full URL
          bannerUrl = uploadResult.url || uploadResult.path;
        } catch (uploadError: any) {
          snackbar.error(uploadError.message || 'Lỗi khi tải ảnh lên');
          return;
        } finally {
          setUploadingBanner(false);
        }
      }

      const recruitmentData: CreateRecruitmentDto = {
        ...formData,
        banner: bannerUrl,
      };

      await recruitmentsApi.create(recruitmentData);
      snackbar.success('Tin tuyển dụng đã được tạo thành công!');
      router.push('/admin/recruitments');
    } catch (error) {
      const err = error as ApiError;
      if (err.errors && err.errors.length > 0) {
        const fieldErrors: Record<string, string> = {};
        err.errors.forEach((e) => {
          fieldErrors[e.field] = e.message;
        });
        setErrors(fieldErrors);
      }
      snackbar.error(err.message || 'Không thể tạo tin tuyển dụng');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.back()}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          className="mb-4"
        >
          Quay lại
        </Button>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tạo tin tuyển dụng mới</h1>
        <p className="text-gray-600">Điền thông tin chi tiết về vị trí tuyển dụng</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin cơ bản</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tiêu đề <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    error={errors.title}
                    placeholder="VD: Tuyển dụng Kỹ sư Xây dựng"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bộ phận tuyển dụng <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      error={errors.department}
                      placeholder="VD: Phòng Kỹ thuật"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số lượng <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      error={errors.quantity}
                      min={1}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Địa điểm làm việc <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    error={errors.location}
                    placeholder="VD: Hà Nội, Hồ Chí Minh"
                  />
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Mô tả công việc</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mô tả công việc <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    name="jobDescription"
                    value={formData.jobDescription}
                    onChange={handleInputChange}
                    error={errors.jobDescription}
                    rows={6}
                    placeholder="Mô tả chi tiết về công việc, trách nhiệm..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Yêu cầu ứng viên <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    name="candidateRequirements"
                    value={formData.candidateRequirements}
                    onChange={handleInputChange}
                    error={errors.candidateRequirements}
                    rows={6}
                    placeholder="Trình độ, kinh nghiệm, kỹ năng yêu cầu..."
                  />
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Chế độ đãi ngộ</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mức lương <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    name="salary"
                    value={formData.salary}
                    onChange={handleInputChange}
                    error={errors.salary}
                    rows={3}
                    placeholder="VD: 15-20 triệu/tháng hoặc Thỏa thuận"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quyền lợi <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    name="benefits"
                    value={formData.benefits}
                    onChange={handleInputChange}
                    error={errors.benefits}
                    rows={5}
                    placeholder="Bảo hiểm, thưởng, nghỉ phép..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Liên hệ <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    name="contact"
                    value={formData.contact}
                    onChange={handleInputChange}
                    error={errors.contact}
                    rows={3}
                    placeholder="Email, số điện thoại, địa chỉ liên hệ..."
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Cài đặt</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thời hạn ứng tuyển <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="date"
                    name="applicationDeadline"
                    value={formData.applicationDeadline}
                    onChange={handleInputChange}
                    error={errors.applicationDeadline}
                    leftIcon={<Calendar className="w-5 h-5 text-gray-400" />}
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, isActive: e.target.checked }))
                      }
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Đang tuyển dụng</span>
                  </label>
                  <p className="mt-1 text-xs text-gray-500">
                    Bật để hiển thị tin tuyển dụng này
                  </p>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Ảnh Banner <span className="text-red-500">*</span>
              </h3>
              
              {bannerPreview ? (
                <div className="relative rounded-lg overflow-hidden bg-gray-100 aspect-video group">
                  <img
                    src={bannerPreview}
                    alt="Banner preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveBanner}
                    className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <label className="relative rounded-lg overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 aspect-video flex items-center justify-center cursor-pointer hover:from-gray-100 hover:to-gray-150 transition-colors border-2 border-dashed border-gray-300 hover:border-primary-400">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleBannerChange}
                    className="hidden"
                  />
                  <div className="text-center p-4">
                    <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm font-medium text-gray-700 mb-1">Click để tải ảnh lên</p>
                    <p className="text-xs text-gray-500">PNG, JPG tối đa 5MB</p>
                  </div>
                </label>
              )}

              {errors.banner && (
                <p className="mt-2 text-xs text-red-600 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.banner}
                </p>
              )}
            </Card>

            <div className="flex flex-col gap-3">
              <Button
                type="submit"
                disabled={saving || uploadingBanner}
                className="w-full"
              >
                {saving ? 'Đang lưu...' : 'Tạo tin tuyển dụng'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="w-full"
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
