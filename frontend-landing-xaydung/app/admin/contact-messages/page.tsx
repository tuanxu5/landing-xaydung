'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Button, Input, Textarea, useSnackbar } from '@/components/ui';
import { Mail, Search, Eye, Trash2, X, Clock, CheckCircle, MessageSquare, Archive } from 'lucide-react';
import ProtectedRoute from '@/components/admin/ProtectedRoute';

interface ContactMessage {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  subject?: string;
  message: string;
  status: 'pending' | 'read' | 'replied' | 'archived';
  notes?: string;
  repliedAt?: string;
  createdAt: string;
}

interface Stats {
  total: number;
  pending: number;
  read: number;
  replied: number;
  archived: number;
}

export default function ContactMessagesPage() {
  const snackbar = useSnackbar();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, pending: 0, read: 0, replied: 0, archived: 0 });
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  useEffect(() => {
    fetchMessages();
    fetchStats();
  }, [page, statusFilter, searchQuery]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const params: any = { page, limit };
      if (statusFilter) params.status = statusFilter;
      if (searchQuery) params.search = searchQuery;

      const response = await api.get('/api/contact-messages', { params });
      setMessages(response.data.data);
      setTotal(response.data.total);
    } catch (error: any) {
      snackbar.error('Không thể tải danh sách tin nhắn');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/api/contact-messages/stats');
      setStats(response.data);
    } catch (error) {
      // Silent fail
    }
  };

  const handleViewDetail = async (message: ContactMessage) => {
    setSelectedMessage(message);
    setShowDetailModal(true);
    
    // Mark as read if pending
    if (message.status === 'pending') {
      try {
        await api.put(`/api/contact-messages/${message._id}`, { status: 'read' });
        fetchMessages();
        fetchStats();
      } catch (error) {
        // Silent fail
      }
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await api.put(`/api/contact-messages/${id}`, { 
        status,
        ...(status === 'replied' ? { repliedAt: new Date().toISOString() } : {})
      });
      snackbar.success('Đã cập nhật trạng thái');
      fetchMessages();
      fetchStats();
      if (selectedMessage?._id === id) {
        setShowDetailModal(false);
        setSelectedMessage(null);
      }
    } catch (error: any) {
      snackbar.error('Không thể cập nhật trạng thái');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa tin nhắn này?')) return;
    
    try {
      await api.delete(`/api/contact-messages/${id}`);
      snackbar.success('Đã xóa tin nhắn');
      fetchMessages();
      fetchStats();
      if (selectedMessage?._id === id) {
        setShowDetailModal(false);
        setSelectedMessage(null);
      }
    } catch (error: any) {
      snackbar.error('Không thể xóa tin nhắn');
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: { label: 'Chờ xử lý', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      read: { label: 'Đã đọc', color: 'bg-blue-100 text-blue-800', icon: Eye },
      replied: { label: 'Đã trả lời', color: 'bg-green-100 text-green-800', icon: CheckCircle },
      archived: { label: 'Đã lưu trữ', color: 'bg-gray-100 text-gray-800', icon: Archive },
    };
    const badge = badges[status as keyof typeof badges] || badges.pending;
    const Icon = badge.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${badge.color}`}>
        <Icon className="w-3 h-3" />
        {badge.label}
      </span>
    );
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <ProtectedRoute>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Tin nhắn liên hệ</h1>
              <p className="text-base text-gray-600">Quản lý tin nhắn từ form liên hệ</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Tổng số</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
            <p className="text-sm text-yellow-700 mb-1">Chờ xử lý</p>
            <p className="text-2xl font-bold text-yellow-900">{stats.pending}</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <p className="text-sm text-blue-700 mb-1">Đã đọc</p>
            <p className="text-2xl font-bold text-blue-900">{stats.read}</p>
          </div>
          <div className="bg-green-50 rounded-xl p-4 border border-green-200">
            <p className="text-sm text-green-700 mb-1">Đã trả lời</p>
            <p className="text-2xl font-bold text-green-900">{stats.replied}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Lưu trữ</p>
            <p className="text-2xl font-bold text-gray-900">{stats.archived}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Tìm kiếm theo tên, email, SĐT..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                leftIcon={<Search className="w-4 h-4 text-gray-400" />}
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="pending">Chờ xử lý</option>
              <option value="read">Đã đọc</option>
              <option value="replied">Đã trả lời</option>
              <option value="archived">Lưu trữ</option>
            </select>
          </div>
        </div>

        {/* Messages Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">Không có tin nhắn nào</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Người gửi
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Liên hệ
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Chủ đề
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Trạng thái
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Ngày gửi
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {messages.map((message) => (
                      <tr key={message._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <p className="font-semibold text-gray-900">{message.fullName}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-600">{message.email}</p>
                          <p className="text-sm text-gray-600">{message.phone}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-900 line-clamp-2">
                            {message.subject || 'Không có chủ đề'}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(message.status)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(message.createdAt).toLocaleString('vi-VN')}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleViewDetail(message)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                              title="Xem chi tiết"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(message._id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                              title="Xóa"
                            >
                              <Trash2 className="w-4 h-4" />
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
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Hiển thị {(page - 1) * limit + 1} - {Math.min(page * limit, total)} trong tổng số {total}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1}
                    >
                      Trước
                    </Button>
                    <Button
                      variant="outline"
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
        </div>

        {/* Detail Modal */}
        {showDetailModal && selectedMessage && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Chi tiết tin nhắn</h3>
                <button onClick={() => setShowDetailModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Status */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Trạng thái</label>
                  <div className="flex gap-2">
                    {getStatusBadge(selectedMessage.status)}
                  </div>
                </div>

                {/* Sender Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Họ tên</label>
                    <p className="text-gray-900">{selectedMessage.fullName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                    <p className="text-gray-900">{selectedMessage.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Số điện thoại</label>
                    <p className="text-gray-900">{selectedMessage.phone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Ngày gửi</label>
                    <p className="text-gray-900">{new Date(selectedMessage.createdAt).toLocaleString('vi-VN')}</p>
                  </div>
                </div>

                {/* Subject */}
                {selectedMessage.subject && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Chủ đề</label>
                    <p className="text-gray-900">{selectedMessage.subject}</p>
                  </div>
                )}

                {/* Message */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Nội dung</label>
                  <div className="bg-gray-50 rounded-lg p-4 whitespace-pre-wrap text-gray-900">
                    {selectedMessage.message}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
                  {selectedMessage.status === 'pending' && (
                    <Button
                      variant="outline"
                      onClick={() => handleUpdateStatus(selectedMessage._id, 'read')}
                      leftIcon={<Eye className="w-4 h-4" />}
                    >
                      Đánh dấu đã đọc
                    </Button>
                  )}
                  {(selectedMessage.status === 'pending' || selectedMessage.status === 'read') && (
                    <Button
                      onClick={() => handleUpdateStatus(selectedMessage._id, 'replied')}
                      leftIcon={<CheckCircle className="w-4 h-4" />}
                    >
                      Đánh dấu đã trả lời
                    </Button>
                  )}
                  {selectedMessage.status !== 'archived' && (
                    <Button
                      variant="outline"
                      onClick={() => handleUpdateStatus(selectedMessage._id, 'archived')}
                      leftIcon={<Archive className="w-4 h-4" />}
                    >
                      Lưu trữ
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => handleDelete(selectedMessage._id)}
                    leftIcon={<Trash2 className="w-4 h-4" />}
                    className="ml-auto text-red-600 hover:bg-red-50"
                  >
                    Xóa
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
