'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { recruitmentsApi, applicationsApi } from '@/lib/api';
import { Card, Button, useSnackbar } from '@/components/ui';
import type { Recruitment, Application, ApiError, ApplicationStatus } from '@/types';
import { ArrowLeft, Pencil, Calendar, MapPin, Users, Briefcase, FileText, Mail, Phone, Download, Eye } from 'lucide-react';

export default function RecruitmentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const snackbar = useSnackbar();
  const recruitmentId = params.id as string;

  const [recruitment, setRecruitment] = useState<Recruitment | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingApplications, setLoadingApplications] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [filterStatus, setFilterStatus] = useState<string>('');
  const limit = 10;

  useEffect(() => {
    fetchRecruitment();
  }, [recruitmentId]);

  useEffect(() => {
    fetchApplications();
  }, [recruitmentId, page, filterStatus]);

  const fetchRecruitment = async () => {
    try {
      setLoading(true);
      const data = await recruitmentsApi.getById(recruitmentId);
      setRecruitment(data);
    } catch (error) {
      const err = error as ApiError;
      snackbar.error(err.message || 'Không thể tải thông tin tuyển dụng');
      router.push('/admin/recruitments');
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      setLoadingApplications(true);
      const response = await applicationsApi.getByRecruitment(recruitmentId, {
        page,
        limit,
        status: filterStatus || undefined,
      });
      setApplications(response.data);
      setTotal(response.total);
    } catch (error) {
      const err = error as ApiError;
      snackbar.error(err.message || 'Không thể tải danh sách CV');
    } finally {
      setLoadingApplications(false);
    }
  };

  const handleUpdateStatus = async (applicationId: string, status: ApplicationStatus) => {
    try {
      await applicationsApi.update(applicationId, { status });
      snackbar.success('Đã cập nhật trạng thái CV');
      fetchApplications();
    } catch (error) {
      const err = error as ApiError;
      snackbar.error(err.message || 'Không thể cập nhật trạng thái');
    }
  };

  const handleDeleteApplication = async (applicationId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa CV này?')) return;

    try {
      await applicationsApi.delete(applicationId);
      snackbar.success('Đã xóa CV');
      fetchApplications();
    } catch (error) {
      const err = error as ApiError;
      snackbar.error(err.message || 'Không thể xóa CV');
    }
  };

  const getStatusColor = (status: ApplicationStatus) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      reviewing: 'bg-blue-100 text-blue-800',
      interviewed: 'bg-purple-100 text-purple-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status: ApplicationStatus) => {
    const texts = {
      pending: 'Chờ xử lý',
      reviewing: 'Đang xem xét',
      interviewed: 'Đã phỏng vấn',
      accepted: 'Đã chấp nhận',
      rejected: 'Đã từ chối',
    };
    return texts[status] || status;
  };

  const totalPages = Math.ceil(total / limit);

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

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/admin/recruitments')}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          className="mb-4"
        >
          Quay lại danh sách
        </Button>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{recruitment.title}</h1>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Briefcase className="w-4 h-4" />
                {recruitment.department}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {recruitment.location}
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                Tuyển {recruitment.quantity} người
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Hạn nộp: {new Date(recruitment.applicationDeadline).toLocaleDateString('vi-VN')}
              </span>
            </div>
          </div>
          <Button
            onClick={() => router.push(`/admin/recruitments/${recruitmentId}/edit`)}
            leftIcon={<Pencil className="w-4 h-4" />}
          >
            Chỉnh sửa
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Banner */}
          {recruitment.banner && (
            <Card className="p-0 overflow-hidden">
              <img
                src={recruitment.banner}
                alt={recruitment.title}
                className="w-full h-64 object-cover"
              />
            </Card>
          )}

          {/* Job Description */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary-600" />
              Mô tả công việc
            </h3>
            <div className="text-gray-700 whitespace-pre-wrap">{recruitment.jobDescription}</div>
          </Card>

          {/* Requirements */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Users className="w-5 h-5 text-primary-600" />
              Yêu cầu ứng viên
            </h3>
            <div className="text-gray-700 whitespace-pre-wrap">{recruitment.candidateRequirements}</div>
          </Card>

          {/* Salary & Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Mức lương</h3>
              <div className="text-gray-700 whitespace-pre-wrap">{recruitment.salary}</div>
            </Card>
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Quyền lợi</h3>
              <div className="text-gray-700 whitespace-pre-wrap">{recruitment.benefits}</div>
            </Card>
          </div>

          {/* Contact */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Thông tin liên hệ</h3>
            <div className="text-gray-700 whitespace-pre-wrap">{recruitment.contact}</div>
          </Card>
        </div>

        {/* Sidebar - Stats */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Trạng thái</span>
                <span
                  className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                    recruitment.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {recruitment.isActive ? 'Đang tuyển' : 'Đã đóng'}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Tổng CV</span>
                <span className="text-lg font-bold text-gray-900">{total}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Ngày đăng</span>
                <span className="text-sm text-gray-900">
                  {new Date(recruitment.createdAt).toLocaleDateString('vi-VN')}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600">Cập nhật</span>
                <span className="text-sm text-gray-900">
                  {new Date(recruitment.updatedAt).toLocaleDateString('vi-VN')}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Applications List */}
      <div className="mt-8">
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Danh sách CV ứng tuyển ({total})</h2>
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setPage(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="pending">Chờ xử lý</option>
              <option value="reviewing">Đang xem xét</option>
              <option value="interviewed">Đã phỏng vấn</option>
              <option value="accepted">Đã chấp nhận</option>
              <option value="rejected">Đã từ chối</option>
            </select>
          </div>

          {loadingApplications ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Chưa có CV ứng tuyển nào</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Ứng viên
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Liên hệ
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Ngày nộp
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Trạng thái
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {applications.map((application) => (
                      <tr key={application._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-gray-900">{application.fullName}</div>
                          {application.coverLetter && (
                            <div className="text-xs text-gray-500 mt-1 line-clamp-1">
                              {application.coverLetter}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1 text-sm">
                            <a
                              href={`mailto:${application.email}`}
                              className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                            >
                              <Mail className="w-3 h-3" />
                              {application.email}
                            </a>
                            <a
                              href={`tel:${application.phone}`}
                              className="flex items-center gap-1 text-gray-600 hover:text-gray-800"
                            >
                              <Phone className="w-3 h-3" />
                              {application.phone}
                            </a>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600">
                            {new Date(application.createdAt).toLocaleDateString('vi-VN')}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={application.status}
                            onChange={(e) =>
                              handleUpdateStatus(application._id, e.target.value as ApplicationStatus)
                            }
                            className={`px-3 py-1 text-xs font-semibold rounded-full border-0 cursor-pointer ${getStatusColor(
                              application.status
                            )}`}
                          >
                            <option value="pending">Chờ xử lý</option>
                            <option value="reviewing">Đang xem xét</option>
                            <option value="interviewed">Đã phỏng vấn</option>
                            <option value="accepted">Đã chấp nhận</option>
                            <option value="rejected">Đã từ chối</option>
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <a
                              href={application.cvUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Xem CV"
                            >
                              <Eye className="w-5 h-5" />
                            </a>
                            <a
                              href={application.cvUrl}
                              download
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Tải CV"
                            >
                              <Download className="w-5 h-5" />
                            </a>
                            <button
                              onClick={() => handleDeleteApplication(application._id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Xóa"
                            >
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 mt-4">
                  <div className="text-sm text-gray-600">
                    Hiển thị {(page - 1) * limit + 1} - {Math.min(page * limit, total)} trong tổng số {total}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1}
                    >
                      Trước
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page + 1)}
                      disabled={page === totalPages}
                    >
                      Sau
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
