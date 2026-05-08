'use client';

import { useState, useEffect } from 'react';
import { api, uploadApi } from '@/lib/api';
import { Button, Input, Textarea, useSnackbar } from '@/components/ui';
import { Plus, Pencil, Trash2, Upload, X } from 'lucide-react';

interface TeamMember {
  _id: string;
  name: string;
  position: string;
  avatar: string;
  bio?: string;
  order: number;
  isActive: boolean;
}

export default function TeamMembersTab() {
  const snackbar = useSnackbar();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    avatar: '',
    bio: '',
    order: 0,
    isActive: true,
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState('');

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/site-info/team-members');
      setMembers(response.data);
    } catch (error: any) {
      snackbar.error('Không thể tải danh sách');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (member?: TeamMember) => {
    if (member) {
      setEditingId(member._id);
      setFormData({
        name: member.name,
        position: member.position,
        avatar: member.avatar,
        bio: member.bio || '',
        order: member.order,
        isActive: member.isActive,
      });
      setAvatarPreview(member.avatar);
    } else {
      setEditingId(null);
      setFormData({
        name: '',
        position: '',
        avatar: '',
        bio: '',
        order: 0,
        isActive: true,
      });
      setAvatarPreview('');
    }
    setAvatarFile(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setAvatarFile(null);
    setAvatarPreview('');
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setUploading(true);
      
      let avatarUrl = formData.avatar;
      if (avatarFile) {
        const uploadResult = await uploadApi.uploadImage(avatarFile);
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
        avatarUrl = `${baseUrl}${uploadResult.path}`;
      }

      const data = { ...formData, avatar: avatarUrl };

      if (editingId) {
        await api.put(`/api/site-info/team-members/${editingId}`, data);
        snackbar.success('Đã cập nhật thành viên');
      } else {
        await api.post('/api/site-info/team-members', data);
        snackbar.success('Đã thêm thành viên');
      }

      handleCloseModal();
      fetchMembers();
    } catch (error: any) {
      snackbar.error(error.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa?')) return;
    
    try {
      await api.delete(`/api/site-info/team-members/${id}`);
      snackbar.success('Đã xóa thành viên');
      fetchMembers();
    } catch (error: any) {
      snackbar.error('Không thể xóa');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Đội ngũ của chúng tôi</h2>
        <Button onClick={() => handleOpenModal()} leftIcon={<Plus className="w-4 h-4" />}>
          Thêm thành viên
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member) => (
            <div key={member._id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex flex-col items-center text-center">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-24 h-24 rounded-full object-cover mb-4"
                />
                <h3 className="text-lg font-bold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-sm text-primary-600 mb-3">{member.position}</p>
                {member.bio && <p className="text-sm text-gray-600 mb-4 line-clamp-2">{member.bio}</p>}
                <div className="flex gap-2 mt-auto">
                  <button
                    onClick={() => handleOpenModal(member)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(member._id)}
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
                {editingId ? 'Chỉnh sửa thành viên' : 'Thêm thành viên'}
              </h3>
              <button onClick={handleCloseModal} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ảnh đại diện</label>
                {avatarPreview ? (
                  <div className="relative w-32 h-32 mx-auto">
                    <img src={avatarPreview} alt="Preview" className="w-full h-full rounded-full object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        setAvatarFile(null);
                        setAvatarPreview('');
                        setFormData({ ...formData, avatar: '' });
                      }}
                      className="absolute -top-2 -right-2 p-1 bg-red-600 text-white rounded-full"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-32 h-32 mx-auto border-2 border-dashed border-gray-300 rounded-full cursor-pointer hover:border-primary-500">
                    <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                    <Upload className="w-8 h-8 text-gray-400" />
                    <span className="text-xs text-gray-500 mt-2">Tải ảnh</span>
                  </label>
                )}
              </div>

              <Input
                label="Họ tên"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />

              <Input
                label="Chức vụ"
                required
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              />

              <Textarea
                label="Giới thiệu"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={3}
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
