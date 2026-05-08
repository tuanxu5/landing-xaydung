'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Button, useSnackbar } from '@/components/ui';
import { Plus } from 'lucide-react';

export default function BrandsTab() {
  const snackbar = useSnackbar();
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const response = await api.get('/api/site-info/brands');
      setBrands(response.data);
    } catch (error) {
      snackbar.error('Không thể tải danh sách');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Thương hiệu nổi bật</h2>
        <Button leftIcon={<Plus className="w-4 h-4" />}>Thêm thương hiệu</Button>
      </div>
      <p className="text-gray-600">Đang phát triển...</p>
    </div>
  );
}
