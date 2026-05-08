'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Button, Input, Textarea, useSnackbar } from '@/components/ui';
import { Plus, Pencil, Trash2, X, HelpCircle, ChevronDown } from 'lucide-react';

interface FAQ {
  _id: string;
  question: string;
  answer: string;
  order: number;
  isActive: boolean;
}

export default function FAQsTab() {
  const snackbar = useSnackbar();
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    order: 0,
    isActive: true,
  });

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/site-info/faqs');
      setFaqs(response.data);
    } catch (error: any) {
      snackbar.error('Không thể tải danh sách');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (faq?: FAQ) => {
    if (faq) {
      setEditingId(faq._id);
      setFormData({
        question: faq.question,
        answer: faq.answer,
        order: faq.order,
        isActive: faq.isActive,
      });
    } else {
      setEditingId(null);
      setFormData({
        question: '',
        answer: '',
        order: 0,
        isActive: true,
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingId) {
        await api.put(`/api/site-info/faqs/${editingId}`, formData);
        snackbar.success('Đã cập nhật câu hỏi');
      } else {
        await api.post('/api/site-info/faqs', formData);
        snackbar.success('Đã thêm câu hỏi');
      }

      handleCloseModal();
      fetchFAQs();
    } catch (error: any) {
      snackbar.error(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa?')) return;
    
    try {
      await api.delete(`/api/site-info/faqs/${id}`);
      snackbar.success('Đã xóa câu hỏi');
      fetchFAQs();
    } catch (error: any) {
      snackbar.error('Không thể xóa');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Câu hỏi thường gặp</h2>
        <Button onClick={() => handleOpenModal()} leftIcon={<Plus className="w-4 h-4" />}>
          Thêm câu hỏi
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : faqs.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">Chưa có câu hỏi nào</p>
        </div>
      ) : (
        <div className="space-y-3">
          {faqs.map((faq) => (
            <div key={faq._id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="flex items-start gap-3 p-4">
                <button
                  onClick={() => setExpandedId(expandedId === faq._id ? null : faq._id)}
                  className="flex-shrink-0 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronDown 
                    className={`w-5 h-5 text-gray-600 transition-transform ${
                      expandedId === faq._id ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 mb-1">{faq.question}</h3>
                  {expandedId === faq._id && (
                    <p className="text-sm text-gray-600 mt-2 whitespace-pre-wrap">{faq.answer}</p>
                  )}
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleOpenModal(faq)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(faq._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
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
                {editingId ? 'Chỉnh sửa câu hỏi' : 'Thêm câu hỏi'}
              </h3>
              <button onClick={handleCloseModal} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <Input
                label={<>Câu hỏi <span className="text-red-500">*</span></>}
                required
                value={formData.question}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                placeholder="Nhập câu hỏi"
              />

              <Textarea
                label={<>Câu trả lời <span className="text-red-500">*</span></>}
                required
                value={formData.answer}
                onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                placeholder="Nhập câu trả lời"
                rows={5}
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
                <Button type="submit" className="flex-1">
                  {editingId ? 'Cập nhật' : 'Thêm'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
