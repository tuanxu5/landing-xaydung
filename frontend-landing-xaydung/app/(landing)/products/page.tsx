'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Package, Search } from 'lucide-react';
import { api } from '@/lib/api';

interface Product {
  _id: string;
  name: string;
  slug: string;
  thumbnail?: string;
  category: { _id: string; name: string } | null;
  shortDescription?: string;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
}

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    // Fetch categories
    api.get('/categories', { params: { isActive: true } })
      .then(res => setCategories(res.data.categories || res.data || []))
      .catch(err => console.error('Failed to fetch categories:', err));
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [page, search, selectedCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params: any = { page, limit: 12, isActive: true };
      if (search) params.search = search;
      if (selectedCategory) params.category = selectedCategory;

      const response = await api.get('/products', { params });
      setProducts(response.data.products || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Sản phẩm</h1>
          <p className="text-xl text-primary-100">
            Khám phá bộ sưu tập vật liệu xây dựng chất lượng cao
          </p>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setPage(1);
              }}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all bg-white"
            >
              <option value="">Tất cả danh mục</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <Package className="w-20 h-20 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Không tìm thấy sản phẩm</h3>
              <p className="text-gray-600">Vui lòng thử tìm kiếm với từ khóa khác</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {products.map((product) => (
                  <Link
                    key={product._id}
                    href={`/products/${product.slug}`}
                    className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all overflow-hidden"
                  >
                    <div className="aspect-square bg-gray-100 overflow-hidden">
                      {product.thumbnail ? (
                        <img
                          src={product.thumbnail}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
                          <Package className="w-16 h-16 text-primary-400" />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="text-xs font-semibold text-primary-600 mb-2">
                        {product.category?.name || 'Chưa phân loại'}
                      </div>
                      <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                        {product.name}
                      </h3>
                      {product.shortDescription && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {product.shortDescription}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Trước
                  </button>
                  <span className="px-4 py-2 text-sm text-gray-600">
                    Trang {page} / {totalPages}
                  </span>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Sau
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
