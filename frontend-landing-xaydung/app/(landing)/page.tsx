'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle, Package, TrendingUp, Shield, Clock, ChevronDown, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { api } from '@/lib/api';
import ProductCard from '@/components/landing/ProductCard';

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

interface Category {
  _id: string;
  name: string;
  slug: string;
  icon?: string;
  parent?: string | null;
  productCount?: number;
}

interface FAQ {
  _id: string;
  question: string;
  answer: string;
  order: number;
  isActive: boolean;
}

interface Review {
  id: number;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  comment: string;
}

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [latestNews, setLatestNews] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [faqs, setFAQs] = useState<FAQ[]>([]);
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Fake reviews data
  const reviews: Review[] = [
    {
      id: 1,
      name: 'Nguyễn Văn A',
      role: 'Chủ đầu tư dự án',
      avatar: 'https://ui-avatars.com/api/?name=Nguyen+Van+A&background=173e72&color=fff',
      rating: 5,
      comment: 'Chất lượng vật liệu rất tốt, giao hàng đúng hẹn. Tôi rất hài lòng với dịch vụ của công ty.',
    },
    {
      id: 2,
      name: 'Trần Thị B',
      role: 'Kiến trúc sư',
      avatar: 'https://ui-avatars.com/api/?name=Tran+Thi+B&background=173e72&color=fff',
      rating: 5,
      comment: 'Đội ngũ tư vấn chuyên nghiệp, nhiệt tình. Sản phẩm đa dạng, giá cả hợp lý.',
    },
    {
      id: 3,
      name: 'Lê Văn C',
      role: 'Nhà thầu xây dựng',
      avatar: 'https://ui-avatars.com/api/?name=Le+Van+C&background=173e72&color=fff',
      rating: 5,
      comment: 'Đã hợp tác nhiều dự án, luôn tin tưởng chất lượng vật liệu từ công ty.',
    },
    {
      id: 4,
      name: 'Phạm Thị D',
      role: 'Chủ nhà',
      avatar: 'https://ui-avatars.com/api/?name=Pham+Thi+D&background=173e72&color=fff',
      rating: 5,
      comment: 'Xây nhà riêng, được tư vấn tận tình từ A-Z. Rất hài lòng với sản phẩm và dịch vụ.',
    },
  ];

  useEffect(() => {
    // Fetch featured products
    api.get('/products', { params: { isFeatured: true, limit: 12 } })
      .then(res => setFeaturedProducts(res.data.products || []))
      .catch(err => console.error('Failed to fetch products:', err));

    // Fetch latest news
    api.get('/api/posts', { params: { status: 'published', limit: 3 } })
      .then(res => setLatestNews(res.data || []))
      .catch(err => console.error('Failed to fetch news:', err));

    // Fetch categories (level 1 only - categories without parent)
    api.get('/categories', { params: { isActive: true, limit: 100 } })
      .then(res => {
        console.log('Categories API response:', res.data);
        const allCategories = res.data.categories || [];
        // Level 1 categories are those without parent
        const level1Categories = allCategories.filter((cat: Category) => !cat.parent);
        console.log('Level 1 categories (no parent):', level1Categories);
        setCategories(level1Categories.slice(0, 8));
      })
      .catch(err => console.error('Failed to fetch categories:', err));

    // Fetch FAQs
    api.get('/api/site-info/faqs', { params: { isActive: true } })
      .then(res => {
        const sortedFAQs = (res.data || []).sort((a: FAQ, b: FAQ) => a.order - b.order);
        setFAQs(sortedFAQs.slice(0, 6));
      })
      .catch(err => console.error('Failed to fetch FAQs:', err));
  }, []);

  // Check scroll position for slider buttons
  const checkScrollButtons = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScrollButtons();
    const slider = sliderRef.current;
    if (slider) {
      slider.addEventListener('scroll', checkScrollButtons);
      window.addEventListener('resize', checkScrollButtons);
      return () => {
        slider.removeEventListener('scroll', checkScrollButtons);
        window.removeEventListener('resize', checkScrollButtons);
      };
    }
  }, [featuredProducts]);

  const scroll = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const scrollAmount = sliderRef.current.clientWidth * 0.8;
      sliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-primary-700 text-white overflow-hidden pb-28 md:pb-32">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="/images/image-banner.jpg" 
            alt="Hero background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900/40 via-primary-800/35 to-primary-700/30"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-20 relative z-10">
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
      </section>

      {/* Categories Section - Overlapping Hero */}
      {categories.length > 0 && (
        <section className="relative -mt-20 md:-mt-24 z-20 mb-16">
          <div className="max-w-6xl mx-auto px-6">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 md:p-5">
              {/* Categories Grid - 2 rows, horizontal cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
                {categories.map((category) => (
                  <Link
                    key={category._id}
                    href={`/products?category=${category.slug}`}
                    className="group flex items-center gap-3 rounded-xl transition-all duration-200"
                  >
                    <div className="w-16 h-16 flex-shrink-0 bg-primary-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-200">
                      <Package className="w-8 h-8 text-primary-500" />
                    </div>
                    <span className="text-sm font-semibold text-gray-800 group-hover:text-primary-600 transition-colors leading-tight flex-1">
                      {category.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* About Company Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left - Image */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-xl">
                <img
                  src="/images/image-banner.jpg"
                  alt="Về chúng tôi"
                  className="w-full h-[400px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>
              {/* Stats overlay */}
              <div className="absolute -bottom-6 -right-6 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary-600">15+</div>
                    <div className="text-sm text-gray-600">Năm kinh nghiệm</div>
                  </div>
                  <div className="w-px h-12 bg-gray-200"></div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary-600">1000+</div>
                    <div className="text-sm text-gray-600">Khách hàng</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Content */}
            <div>
              <div className="inline-block px-4 py-2 bg-primary-50 text-primary-600 rounded-full text-sm font-semibold mb-4">
                Về chúng tôi
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Đối tác tin cậy trong <br />
                <span className="text-primary-600">Xây dựng và Phát triển</span>
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Với hơn 15 năm kinh nghiệm trong lĩnh vực cung cấp vật liệu xây dựng, chúng tôi tự hào là đối tác tin cậy của hàng ngàn dự án trên toàn quốc.
              </p>
              <p className="text-base text-gray-600 mb-8 leading-relaxed">
                Chúng tôi cam kết mang đến những sản phẩm chất lượng cao, giá cả cạnh tranh và dịch vụ chuyên nghiệp, đáp ứng mọi nhu cầu xây dựng từ dân dụng đến công nghiệp.
              </p>

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {[
                  { icon: CheckCircle, text: 'Sản phẩm chính hãng 100%' },
                  { icon: Shield, text: 'Bảo hành uy tín' },
                  { icon: TrendingUp, text: 'Giá cả cạnh tranh' },
                  { icon: Clock, text: 'Giao hàng nhanh chóng' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-primary-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{item.text}</span>
                  </div>
                ))}
              </div>

              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-all"
              >
                <span>Tìm hiểu thêm</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
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
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Sản phẩm nổi bật</h2>
            <p className="text-lg text-gray-600">Những sản phẩm được khách hàng tin dùng nhất</p>
          </div>

          {/* Slider Container */}
          <div className="relative">
            {/* Left Button */}
            {canScrollLeft && (
              <button
                onClick={() => scroll('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center text-gray-700 hover:bg-primary-600 hover:text-white transition-all"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {/* Right Button */}
            {canScrollRight && (
              <button
                onClick={() => scroll('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center text-gray-700 hover:bg-primary-600 hover:text-white transition-all"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}

            {/* Products Slider */}
            <div
              ref={sliderRef}
              className="overflow-x-auto scrollbar-hide scroll-smooth"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <div className="flex gap-6" style={{ width: 'max-content' }}>
                {featuredProducts.map((product) => (
                  <div key={product._id} className="w-[280px] flex-shrink-0">
                    <ProductCard
                      _id={product._id}
                      name={product.name}
                      slug={product.slug}
                      thumbnail={product.thumbnail}
                      category={product.category}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
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
          <div className="max-w-7xl mx-auto px-4">
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

      {/* Reviews Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Khách hàng nói gì về chúng tôi</h2>
            <p className="text-lg text-gray-600">Những đánh giá chân thực từ khách hàng</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all border border-gray-100"
              >
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={review.avatar}
                    alt={review.name}
                    className="w-14 h-14 rounded-full border-2 border-primary-200"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900">{review.name}</h4>
                    <p className="text-sm text-gray-500">{review.role}</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-3">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      {faqs.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Câu hỏi thường gặp</h2>
              <p className="text-lg text-gray-600">Giải đáp những thắc mắc phổ biến của khách hàng</p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq) => (
                <div
                  key={faq._id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedFAQ(expandedFAQ === faq._id ? null : faq._id)}
                    className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                  >
                    <h3 className="text-lg font-bold text-gray-900 pr-4">{faq.question}</h3>
                    <ChevronDown
                      className={`w-5 h-5 text-primary-600 flex-shrink-0 transition-transform ${
                        expandedFAQ === faq._id ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {expandedFAQ === faq._id && (
                    <div className="px-6 pb-6">
                      <div className="pt-4 border-t border-gray-100">
                        <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
