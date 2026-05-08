'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { recruitmentsApi } from '@/lib/api';
import { Card, Button, Input, useSnackbar } from '@/components/ui';
import type { Recruitment, ApiError } from '@/types';
import { Eye, Pencil, Trash2, Plus, Search, Users } from 'lucide-react';

export default function RecruitmentsPage() {
  const router = useRouter();
  const snackbar = useSnackbar();

  const [recruitments, setRecruitments] = useState<Recruitment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  useEffect(() => {
    fetchRecruitments();
  }, [page, search]);

  const fetchRecruitments = async () => {
    try {
      setLoading(true);
      const response = await recruitmentsApi.getAll({
        page,
        limit,
        search: search || undefined,
      });
      setRecruitments(response.data);
      setTotal(response.total);
    } catch (error) {
      const err = error as ApiError;
      snackbar.error(err.message || 'Không thể tải danh sách tuyển dụng');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa tin tuyển dụng này?')) return;

    try {
      await recruitmentsApi.delete(id);
      snackbar.success('Đã xóa tin tuyển dụng');
      fetchRecruitments();
    } catch (error) {
      const err = error as ApiError;
      snackbar.error(err.message || 'Không thể xóa tin tuyển dụng');
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý tuyển dụng</h1>
        <p className="text-gray-600">Quản lý các tin tuyển dụng và CV ứng tuyển</p>
      </div>

      {/* Actions */}
      <Card className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex-1 max-w-md">
            <Input
              type="text"
              placeholder="Tìm kiếm theo tiêu đề, bộ phận, địa điểm..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              leftIcon={<Search className="w-5 h-5 text-gray-400" />}
            />
          </div>
          <Button
            onClick={() => router.push('/admin/recruitments/create')}
            leftIcon={<Plus className="w-5 h-5" />}
          >
            Tạo tin tuyển dụng
          </Button>
        </div>
      </Card>

      {/* Table */}
      <Card>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : recruitments.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Chưa có tin tuyển dụng nào</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Tiêu đề
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Bộ phận
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Địa điểm
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Số lượng
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Hạn nộp
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
                  {recruitments.map((recruitment) => (
                    <tr key={recruitment._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">{recruitment.title}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">{recruitment.department}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">{recruitment.location}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-gray-900">{recruitment.quantity}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">
                          {new Date(recruitment.applicationDeadline).toLocaleDateString('vi-VN')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                            recruitment.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {recruitment.isActive ? 'Đang tuyển' : 'Đã đóng'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => router.push(`/admin/recruitments/${recruitment._id}`)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Xem CV ứng tuyển"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => router.push(`/admin/recruitments/${recruitment._id}/edit`)}
                            className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                            title="Chỉnh sửa"
                          >
                            <Pencil className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(recruitment._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Xóa"
                          >
                            <Trash2 className="w-5 h-5" />
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
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
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
  );
}
