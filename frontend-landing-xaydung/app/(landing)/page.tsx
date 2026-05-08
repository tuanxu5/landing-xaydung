'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle, Package, TrendingUp, Shield, Clock } from 'lucide-react';
import { api } from '@/lib/api';

interface Product {
  _id: string;
  name: string;
  slug: string;
  thumbnail?: string;
  category: { name: string };
  isFeatured: boolean;
}

interface Post {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage?: string;
  createdAt: string;
}

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [latestNews, setLatestNews] = useState<Post[]>([]);

  useEffect(() => {
    // Fetch featured products
    api.get('/products', { params: { isFeatured: true, limit: 6 } })
      .then(res => setFeaturedProducts(res.data.products || []))
      .catch(err => console.error('Failed to fetch products:', err));

    // Fetch latest news
    api.get('/api/posts', { params: { status: 'published', limit: 3 } })
      .then(res => setLatestNews(res.data || []))
      .catch(err => console.error('Failed to fetch news:', err));
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Vật Liệu Xây Dựng <br />
              <span className="text-primary-200">Chất Lượng Cao</span>
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 mb-8">
              Cung cấp đầy đủ vật liệu xây dựng với giá cả cạnh tranh, giao hàng nhanh chóng trên toàn quốc
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary-700 font-bold rounded-xl hover:bg-primary-50 transition-all shadow-xl hover:shadow-2xl"
              >
                <span>Xem sản phẩm</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary-500 text-white font-bold rounded-xl hover:bg-primary-400 transition-all border-2 border-white/20"
              >
                <span>Liên hệ tư vấn</span>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: CheckCircle, title: 'Chất lượng đảm bảo', desc: 'Sản phẩm chính hãng 100%' },
              { icon: TrendingUp, title: 'Giá cạnh tranh', desc: 'Giá tốt nhất thị trường' },
              { icon: Clock, title: 'Giao hàng nhanh', desc: 'Giao hàng trong 24h' },
              { icon: Shield, title: 'Bảo hành uy tín', desc: 'Hỗ trợ sau bán hàng tốt' },
            ].map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all">
                <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-7 h-7 text-primary-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Sản phẩm nổi bật</h2>
            <p className="text-lg text-gray-600">Những sản phẩm được khách hàng tin dùng nhất</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {featuredProducts.map((product) => (
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
                      <Package className="w-20 h-20 text-primary-400" />
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="text-xs font-semibold text-primary-600 mb-2">{product.category.name}</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex items-center text-primary-600 font-semibold text-sm">
                    <span>Xem chi tiết</span>
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-all shadow-lg"
            >
              <span>Xem tất cả sản phẩm</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Latest News Section */}
      {latestNews.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Tin tức mới nhất</h2>
              <p className="text-lg text-gray-600">Cập nhật thông tin và xu hướng xây dựng</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {latestNews.map((post) => (
                <Link
                  key={post._id}
                  href={`/news/${post.slug}`}
                  className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all overflow-hidden"
                >
                  <div className="aspect-video bg-gray-100 overflow-hidden">
                    {post.featuredImage ? (
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                        <Package className="w-16 h-16 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="text-xs text-gray-500 mb-2">
                      {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">{post.excerpt}</p>
                    <div className="flex items-center text-primary-600 font-semibold text-sm">
                      <span>Đọc thêm</span>
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center">
              <Link
                href="/news"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-all shadow-lg"
              >
                <span>Xem tất cả tin tức</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Bạn cần tư vấn về vật liệu xây dựng?</h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Đội ngũ chuyên gia của chúng tôi sẵn sàng hỗ trợ bạn 24/7
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:0912345678"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary-700 font-bold rounded-xl hover:bg-primary-50 transition-all shadow-xl"
            >
              <span>Gọi ngay: 0912 345 678</span>
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary-500 text-white font-bold rounded-xl hover:bg-primary-400 transition-all border-2 border-white/20"
            >
              <span>Gửi yêu cầu tư vấn</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
