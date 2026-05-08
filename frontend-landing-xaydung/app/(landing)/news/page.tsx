'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FileText, Search } from 'lucide-react';
import { api } from '@/lib/api';

interface Post {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage?: string;
  createdAt: string;
}

export default function NewsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchPosts();
  }, [search]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params: any = { status: 'published' };
      if (search) params.search = search;

      const response = await api.get('/api/posts', { params });
      setPosts(response.data.posts || response.data || []);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-primary-700 text-white overflow-hidden" style={{ minHeight: '350px' }}>
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="/images/image-banner.jpg" 
            alt="News background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900/40 via-primary-800/35 to-primary-700/30"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10 flex items-center" style={{ minHeight: '350px' }}>
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Tin tức</h1>
            <p className="text-xl text-primary-100">
              Cập nhật thông tin và xu hướng xây dựng mới nhất
            </p>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8 bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm tin tức..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all"
            />
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20">
              <FileText className="w-20 h-20 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Không tìm thấy tin tức</h3>
              <p className="text-gray-600">Vui lòng thử tìm kiếm với từ khóa khác</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
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
                        <FileText className="w-16 h-16 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="text-xs text-gray-500 mb-2">
                      {new Date(post.createdAt).toLocaleDateString('vi-VN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-3">{post.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
