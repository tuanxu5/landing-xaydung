'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Package, Search, ChevronRight, Grid3x3 } from 'lucide-react';
import { api } from '@/lib/api';
import ProductCard from '@/components/landing/ProductCard';
import Pagination from '@/components/ui/Pagination';

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
  parent?: { _id: string; name: string } | null;
  level?: number;
}

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 9; // 9 sản phẩm mỗi trang

  useEffect(() => {
    // Fetch all categories
    api.get('/categories', { params: { isActive: true, limit: 100 } })
      .then(res => setCategories(res.data.categories || res.data || []))
      .catch(err => console.error('Failed to fetch categories:', err));
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [page, search, selectedCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params: any = { page, limit, isActive: true };
      if (search) params.search = search;
      if (selectedCategory) params.category = selectedCategory;

      const response = await api.get('/products', { params });
      setProducts(response.data.products || []);
      setTotal(response.data.total || 0);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  };

  // Toggle category expansion
  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // Organize categories by level
  const level1Categories = categories.filter(cat => !cat.parent);
  const getCategoryChildren = (parentId: string) => {
    return categories.filter(cat => cat.parent && (typeof cat.parent === 'string' ? cat.parent === parentId : cat.parent._id === parentId));
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-primary-700 text-white overflow-hidden" style={{ minHeight: '350px' }}>
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="/images/image-banner.jpg" 
            alt="Products background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900/40 via-primary-800/35 to-primary-700/30"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10 flex items-center" style={{ minHeight: '350px' }}>
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Sản phẩm</h1>
            <p className="text-xl text-primary-100">
              Khám phá bộ sưu tập vật liệu xây dựng chất lượng cao
            </p>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-6 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="relative max-w-2xl">
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
        </div>
      </section>

      {/* Main Content - Sidebar + Products Grid */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
            {/* Left Sidebar - Categories (wider and more beautiful) */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden sticky top-24 border border-gray-100">
                {/* Header */}
                <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 px-5 py-4">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
                      <Grid3x3 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-white">Danh mục ngành hàng</h2>
                      <p className="text-[10px] text-primary-100 mt-0.5">Chọn danh mục để xem sản phẩm</p>
                    </div>
                  </div>
                </div>

                {/* Categories List */}
                <div className="p-4 max-h-[calc(100vh-220px)] overflow-y-auto custom-scrollbar">
                  {/* All Products */}
                  <button
                    onClick={() => {
                      setSelectedCategory('');
                      setPage(1);
                    }}
                    className={`w-full text-left px-3.5 py-2.5 rounded-lg transition-all mb-2.5 font-bold text-sm shadow-sm ${
                      selectedCategory === ''
                        ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-primary-200 scale-[1.02]'
                        : 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 hover:from-gray-100 hover:to-gray-200 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-base">📦</span>
                        <span>Tất cả sản phẩm</span>
                      </div>
                      {selectedCategory === '' && (
                        <div className="bg-white/20 p-0.5 rounded">
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  </button>

                  <div className="relative my-3">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-[10px]">
                      <span className="bg-white px-2 text-gray-500 font-medium">Danh mục chi tiết</span>
                    </div>
                  </div>

                  {/* Level 1 Categories */}
                  {level1Categories.map((cat, idx) => {
                    const level2Children = getCategoryChildren(cat._id);
                    const isSelected = selectedCategory === cat._id;
                    const hasSelectedDescendant = level2Children.some(child => {
                      const level3Children = getCategoryChildren(child._id);
                      return child._id === selectedCategory || level3Children.some(l3 => l3._id === selectedCategory);
                    });
                    const isExpanded = expandedCategories.includes(cat._id) || hasSelectedDescendant;

                    return (
                      <div key={cat._id} className="mb-2">
                        {/* Level 1 - Parent Category */}
                        <div className="flex items-stretch gap-1.5">
                          {level2Children.length > 0 && (
                            <button
                              onClick={() => toggleCategory(cat._id)}
                              className={`p-1.5 hover:bg-primary-50 rounded-lg transition-all ${
                                isExpanded ? 'bg-primary-50' : 'bg-gray-50'
                              }`}
                            >
                              <ChevronRight 
                                className={`w-4 h-4 transition-transform duration-200 ${
                                  isExpanded ? 'rotate-90 text-primary-600' : 'text-gray-400'
                                }`}
                              />
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setSelectedCategory(cat._id);
                              setPage(1);
                              if (level2Children.length > 0 && !isExpanded) {
                                toggleCategory(cat._id);
                              }
                            }}
                            className={`flex-1 text-left px-3 py-2 rounded-lg transition-all font-bold text-xs shadow-sm ${
                              isSelected
                                ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-primary-200 scale-[1.02]'
                                : hasSelectedDescendant
                                ? 'bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 border-2 border-primary-200'
                                : 'bg-white text-gray-800 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 border-2 border-gray-100 hover:border-gray-200'
                            } ${!level2Children.length ? 'ml-0' : ''}`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <span className={`w-1.5 h-1.5 rounded-full ${
                                  isSelected ? 'bg-white' : hasSelectedDescendant ? 'bg-primary-600' : 'bg-gray-400'
                                }`}></span>
                                <span className="leading-tight">{cat.name}</span>
                              </div>
                              {isSelected && (
                                <div className="bg-white/20 p-0.5 rounded">
                                  <ChevronRight className="w-3.5 h-3.5" />
                                </div>
                              )}
                            </div>
                          </button>
                        </div>

                        {/* Level 2 - Child Categories */}
                        {isExpanded && level2Children.length > 0 && (
                          <div className="ml-6 mt-1.5 space-y-1.5 relative">
                            {/* Vertical line */}
                            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-200 via-primary-100 to-transparent"></div>
                            
                            {level2Children.map((child, childIdx) => {
                              const level3Children = getCategoryChildren(child._id);
                              const isChildSelected = selectedCategory === child._id;
                              const hasSelectedLevel3 = level3Children.some(l3 => l3._id === selectedCategory);
                              const isChildExpanded = expandedCategories.includes(child._id) || hasSelectedLevel3;

                              return (
                                <div key={child._id} className="relative">
                                  {/* Level 2 Category */}
                                  <div className="flex items-stretch gap-1">
                                    {level3Children.length > 0 && (
                                      <button
                                        onClick={() => toggleCategory(child._id)}
                                        className={`p-1 hover:bg-primary-50 rounded transition-all ${
                                          isChildExpanded ? 'bg-primary-50' : 'bg-gray-50'
                                        }`}
                                      >
                                        <ChevronRight 
                                          className={`w-3.5 h-3.5 transition-transform duration-200 ${
                                            isChildExpanded ? 'rotate-90 text-primary-500' : 'text-gray-400'
                                          }`}
                                        />
                                      </button>
                                    )}
                                    <button
                                      onClick={() => {
                                        setSelectedCategory(child._id);
                                        setPage(1);
                                        if (level3Children.length > 0 && !isChildExpanded) {
                                          toggleCategory(child._id);
                                        }
                                      }}
                                      className={`flex-1 text-left px-2.5 py-1.5 rounded-lg text-xs transition-all font-semibold ${
                                        isChildSelected
                                          ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md shadow-primary-200'
                                          : hasSelectedLevel3
                                          ? 'bg-primary-50 text-primary-600 border-2 border-primary-200'
                                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-2 border-transparent hover:border-gray-200'
                                      } ${!level3Children.length ? 'ml-0' : ''}`}
                                    >
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1.5">
                                          <span className={`text-sm ${isChildSelected ? 'text-white' : 'text-primary-500'}`}>•</span>
                                          <span className="leading-tight">{child.name}</span>
                                        </div>
                                        {isChildSelected && (
                                          <div className="bg-white/20 p-0.5 rounded">
                                            <ChevronRight className="w-3 h-3" />
                                          </div>
                                        )}
                                      </div>
                                    </button>
                                  </div>

                                  {/* Level 3 - Grandchild Categories */}
                                  {isChildExpanded && level3Children.length > 0 && (
                                    <div className="ml-5 mt-1 space-y-1 relative">
                                      {/* Vertical line for level 3 */}
                                      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-100 to-transparent"></div>
                                      
                                      {level3Children.map((grandchild, grandchildIdx) => {
                                        const isGrandchildSelected = selectedCategory === grandchild._id;
                                        return (
                                          <div key={grandchild._id} className="relative">
                                            {/* Horizontal connector */}
                                            <div className="absolute left-0 top-1/2 w-2 h-0.5 bg-primary-100"></div>
                                            
                                            <button
                                              onClick={() => {
                                                setSelectedCategory(grandchild._id);
                                                setPage(1);
                                              }}
                                              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] transition-all font-medium ml-2 ${
                                                isGrandchildSelected
                                                  ? 'bg-gradient-to-r from-primary-400 to-primary-500 text-white shadow-md shadow-primary-200'
                                                  : 'bg-gray-50 text-gray-600 hover:bg-primary-50 hover:text-primary-600 border border-transparent hover:border-primary-200'
                                              }`}
                                            >
                                              <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-1">
                                                  <span className={`text-[10px] ${isGrandchildSelected ? 'text-white' : 'text-gray-400'}`}>└</span>
                                                  <span className="leading-tight">{grandchild.name}</span>
                                                </div>
                                                {isGrandchildSelected && (
                                                  <div className="bg-white/20 p-0.5 rounded">
                                                    <ChevronRight className="w-2.5 h-2.5" />
                                                  </div>
                                                )}
                                              </div>
                                            </button>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Content - Products Grid */}
            <div className="lg:col-span-7">
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
              ) : products.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                  <Package className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Không tìm thấy sản phẩm</h3>
                  <p className="text-gray-600">Vui lòng thử tìm kiếm với từ khóa khác hoặc chọn danh mục khác</p>
                </div>
              ) : (
                <>
                  {/* Products Grid - 3 columns */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {products.map((product) => (
                      <ProductCard
                        key={product._id}
                        _id={product._id}
                        name={product.name}
                        slug={product.slug}
                        thumbnail={product.thumbnail}
                        category={product.category}
                      />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <Pagination
                      currentPage={page}
                      totalPages={totalPages}
                      onPageChange={setPage}
                      total={total}
                      limit={limit}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
