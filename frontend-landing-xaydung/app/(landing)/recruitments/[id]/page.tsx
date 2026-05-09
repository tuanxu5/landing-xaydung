'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { api, uploadApi } from '@/lib/api';
import { MapPin, Briefcase, Calendar, Users, DollarSign, Gift, Phone, Mail, ArrowLeft, Upload, CheckCircle } from 'lucide-react';
import { getImageUrl } from '@/lib/utils';

interface Recruitment {
  _id: string;
  banner: string;
  title: string;
  quantity: number;
  location: string;
  department: string;
  jobDescription: string;
  candidateRequirements: string;
  salary: string;
  benefits: string;
  contact: string;
  applicationDeadline: string;
  isActive: boolean;
}

export default function RecruitmentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const recruitmentId = params.id as string;

  const [recruitment, setRecruitment] = useState<Recruitment | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [uploadingCV, setUploadingCV] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    cvUrl: '',
    coverLetter: '',
  });
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchRecruitment();
  }, [recruitmentId]);

  const fetchRecruitment = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/recruitments/${recruitmentId}`);
      setRecruitment(response.data);
    } catch (error) {
      console.error('Failed to fetch recruitment:', error);
      router.push('/recruitments');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleCVChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, cvUrl: 'Kích thước file tối đa 5MB' }));
        return;
      }
      setCvFile(file);
      if (errors.cvUrl) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.cvUrl;
          return newErrors;
        });
      }
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Vui lòng nhập họ tên';
    if (!formData.email.trim()) newErrors.email = 'Vui lòng nhập email';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Email không hợp lệ';
    if (!formData.phone.trim()) newErrors.phone = 'Vui lòng nhập số điện thoại';
    else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ''))) newErrors.phone = 'Số điện thoại không hợp lệ';
    if (!cvFile && !formData.cvUrl) newErrors.cvUrl = 'Vui lòng tải lên CV';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setSubmitting(true);

      let cvUrl = formData.cvUrl;
      if (cvFile) {
        setUploadingCV(true);
        try {
          const uploadResult = await uploadApi.uploadCV(cvFile);
          const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
          cvUrl = `${baseUrl}${uploadResult.path}`;
        } catch (uploadError: any) {
          setErrors({ cvUrl: 'Không thể tải CV lên. Vui lòng thử lại.' });
          return;
        } finally {
          setUploadingCV(false);
        }
      }

      await api.post('/api/recruitments/applications', {
        recruitmentId,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        cvUrl,
        coverLetter: formData.coverLetter || undefined,
      });

      setSuccess(true);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        cvUrl: '',
        coverLetter: '',
      });
      setCvFile(null);

      // Scroll to success message
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error: any) {
      setErrors({ submit: error.response?.data?.message || 'Không thể gửi đơn ứng tuyển. Vui lòng thử lại.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!recruitment) {
    return null;
  }

  const isExpired = new Date(recruitment.applicationDeadline) < new Date();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner */}
      {recruitment.banner && (
        <div className="relative h-80 bg-gradient-to-br from-primary-600 to-primary-800">
          <img
            src={getImageUrl(recruitment.banner)}
            alt={recruitment.title}
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 -mt-20 relative z-10 pb-16">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-colors mb-6 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại
        </button>

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6 mb-6 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-green-900 mb-2">Gửi đơn ứng tuyển thành công!</h3>
                <p className="text-green-700">
                  Cảm ơn bạn đã ứng tuyển vào vị trí <strong>{recruitment.title}</strong>. 
                  Chúng tôi sẽ xem xét hồ sơ của bạn và liên hệ trong thời gian sớm nhất.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Info Card */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{recruitment.title}</h1>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Bộ phận</div>
                    <div className="font-semibold">{recruitment.department}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Địa điểm</div>
                    <div className="font-semibold">{recruitment.location}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Số lượng</div>
                    <div className="font-semibold">{recruitment.quantity} người</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Hạn nộp</div>
                    <div className={`font-semibold ${isExpired ? 'text-red-600' : ''}`}>
                      {new Date(recruitment.applicationDeadline).toLocaleDateString('vi-VN')}
                    </div>
                  </div>
                </div>
              </div>

              {isExpired && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <p className="text-red-800 font-semibold">
                    Thời hạn ứng tuyển đã kết thúc
                  </p>
                </div>
              )}
            </div>

            {/* Job Description */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Briefcase className="w-6 h-6 text-primary-600" />
                Mô tả công việc
              </h2>
              <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {recruitment.jobDescription}
              </div>
            </div>

            {/* Requirements */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="w-6 h-6 text-primary-600" />
                Yêu cầu ứng viên
              </h2>
              <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {recruitment.candidateRequirements}
              </div>
            </div>

            {/* Salary & Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <DollarSign className="w-6 h-6 text-primary-600" />
                  Mức lương
                </h2>
                <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {recruitment.salary}
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Gift className="w-6 h-6 text-primary-600" />
                  Quyền lợi
                </h2>
                <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {recruitment.benefits}
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Phone className="w-6 h-6 text-primary-600" />
                Thông tin liên hệ
              </h2>
              <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {recruitment.contact}
              </div>
            </div>
          </div>

          {/* Sidebar - Application Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-8 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Ứng tuyển ngay</h2>

              {isExpired ? (
                <div className="text-center py-8">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">Thời hạn ứng tuyển đã kết thúc</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Họ và tên <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-colors ${
                        errors.fullName ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Nguyễn Văn A"
                    />
                    {errors.fullName && <p className="mt-1 text-xs text-red-600">{errors.fullName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-colors ${
                        errors.email ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="email@example.com"
                    />
                    {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-colors ${
                        errors.phone ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="0912345678"
                    />
                    {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CV của bạn <span className="text-red-500">*</span>
                    </label>
                    <label className={`flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                      errors.cvUrl ? 'border-red-300 hover:border-red-400' : 'border-gray-300 hover:border-primary-400'
                    }`}>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleCVChange}
                        className="hidden"
                      />
                      <Upload className="w-5 h-5 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {cvFile ? cvFile.name : 'Tải lên CV (PDF, DOC, DOCX)'}
                      </span>
                    </label>
                    {errors.cvUrl && <p className="mt-1 text-xs text-red-600">{errors.cvUrl}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Thư giới thiệu
                    </label>
                    <textarea
                      name="coverLetter"
                      value={formData.coverLetter}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-colors resize-none"
                      placeholder="Giới thiệu ngắn gọn về bản thân..."
                    />
                  </div>

                  {errors.submit && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-sm text-red-600">{errors.submit}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting || uploadingCV}
                    className="w-full px-6 py-4 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  >
                    {submitting || uploadingCV ? 'Đang gửi...' : 'Gửi đơn ứng tuyển'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
