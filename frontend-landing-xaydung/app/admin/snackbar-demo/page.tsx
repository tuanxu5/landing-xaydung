'use client';

import { useSnackbar } from '@/components/ui';
import { CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';

export default function SnackbarDemoPage() {
  const snackbar = useSnackbar();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-10 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Demo Snackbar Component</h1>
        <p className="text-base text-gray-600">
          Thử nghiệm các loại thông báo snackbar
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Success */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Success</h3>
            </div>
            <button
              onClick={() => snackbar.success('Thao tác thành công!')}
              className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors"
            >
              Hiển thị Success (5s)
            </button>
            <button
              onClick={() => snackbar.success('Sản phẩm đã được tạo thành công!', 3000)}
              className="w-full px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-colors"
            >
              Success (3s)
            </button>
            <button
              onClick={() => snackbar.success('Thông báo này không tự động đóng', 0)}
              className="w-full px-4 py-3 bg-green-400 hover:bg-green-500 text-white rounded-xl font-medium transition-colors"
            >
              Success (Không tự đóng)
            </button>
          </div>

          {/* Error */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <XCircle className="w-5 h-5 text-red-600" />
              <h3 className="text-lg font-semibold text-gray-900">Error</h3>
            </div>
            <button
              onClick={() => snackbar.error('Có lỗi xảy ra!')}
              className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors"
            >
              Hiển thị Error (5s)
            </button>
            <button
              onClick={() => snackbar.error('Không thể kết nối đến server', 3000)}
              className="w-full px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors"
            >
              Error (3s)
            </button>
            <button
              onClick={() => snackbar.error('Lỗi nghiêm trọng! Vui lòng liên hệ admin', 0)}
              className="w-full px-4 py-3 bg-red-400 hover:bg-red-500 text-white rounded-xl font-medium transition-colors"
            >
              Error (Không tự đóng)
            </button>
          </div>

          {/* Warning */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <h3 className="text-lg font-semibold text-gray-900">Warning</h3>
            </div>
            <button
              onClick={() => snackbar.warning('Cảnh báo: Kiểm tra lại thông tin!')}
              className="w-full px-4 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-xl font-medium transition-colors"
            >
              Hiển thị Warning (5s)
            </button>
            <button
              onClick={() => snackbar.warning('Dữ liệu có thể không chính xác', 3000)}
              className="w-full px-4 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl font-medium transition-colors"
            >
              Warning (3s)
            </button>
            <button
              onClick={() => snackbar.warning('Cảnh báo quan trọng!', 0)}
              className="w-full px-4 py-3 bg-yellow-400 hover:bg-yellow-500 text-white rounded-xl font-medium transition-colors"
            >
              Warning (Không tự đóng)
            </button>
          </div>

          {/* Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Info</h3>
            </div>
            <button
              onClick={() => snackbar.info('Thông tin: Dữ liệu đã được cập nhật')}
              className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
            >
              Hiển thị Info (5s)
            </button>
            <button
              onClick={() => snackbar.info('Phiên bản mới đã có sẵn', 3000)}
              className="w-full px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors"
            >
              Info (3s)
            </button>
            <button
              onClick={() => snackbar.info('Thông tin hệ thống', 0)}
              className="w-full px-4 py-3 bg-blue-400 hover:bg-blue-500 text-white rounded-xl font-medium transition-colors"
            >
              Info (Không tự đóng)
            </button>
          </div>
        </div>

        {/* Multiple notifications */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Nhiều thông báo cùng lúc</h3>
          <button
            onClick={() => {
              snackbar.success('Thông báo 1');
              setTimeout(() => snackbar.info('Thông báo 2'), 200);
              setTimeout(() => snackbar.warning('Thông báo 3'), 400);
              setTimeout(() => snackbar.error('Thông báo 4'), 600);
            }}
            className="w-full px-4 py-3 bg-gradient-to-r from-green-600 via-blue-600 to-red-600 hover:opacity-90 text-white rounded-xl font-medium transition-opacity"
          >
            Hiển thị 4 thông báo liên tiếp
          </button>
        </div>

        {/* Usage example */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Cách sử dụng</h3>
          <div className="bg-gray-50 rounded-xl p-4">
            <pre className="text-sm text-gray-800 overflow-x-auto">
{`import { useSnackbar } from '@/components/ui';

const MyComponent = () => {
  const snackbar = useSnackbar();

  const handleSubmit = async () => {
    try {
      await api.post('/data');
      snackbar.success('Thành công!');
    } catch (err) {
      snackbar.error('Có lỗi xảy ra!');
    }
  };

  return <button onClick={handleSubmit}>Submit</button>;
};`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
