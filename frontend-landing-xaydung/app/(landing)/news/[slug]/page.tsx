'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { FileText, ArrowLeft, Calendar, Clock, Tag, Share2, Link2 } from 'lucide-react';
import { api } from '@/lib/api';
import { getImageUrl } from '@/lib/utils';

interface Post {
  _id: string;
  title: string;
  slug: string;
  featuredImage?: string;
  excerpt?: string;
  content?: string;
  category?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export default function NewsDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [post, setPost] = useState<Post | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/posts/slug/${slug}`);
      setPost(response.data);
      
      // Fetch related posts (all other posts, not filtered by category)
      fetchRelatedPosts(response.data._id);
    } catch (err) {
      console.error('Failed to fetch post:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedPosts = async (currentPostId: string) => {
    try {
      const response = await api.get('/api/posts', {
        params: { status: 'published' },
      });
      const posts = response.data || [];
      // Filter out current post and limit to 5
      const filtered = posts.filter((p: Post) => p._id !== currentPostId).slice(0, 5);
      setRelatedPosts(filtered);
    } catch (err) {
      console.error('Failed to fetch related posts:', err);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: string) => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(post?.title || '');
    
    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-5xl mx-auto px-4 py-12">
          {/* Breadcrumb Skeleton */}
          <div className="h-6 bg-gray-200 rounded w-48 mb-8 animate-pulse"></div>
          
          {/* Image Skeleton */}
          <div className="aspect-[21/9] bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200 rounded-3xl mb-8 animate-pulse"></div>
          
          {/* Content Skeleton */}
          <div className="bg-white rounded-3xl shadow-sm p-8 lg:p-12">
            <div className="h-4 bg-gray-200 rounded w-32 mb-6 animate-pulse"></div>
            <div className="h-12 bg-gray-200 rounded w-full mb-4 animate-pulse"></div>
            <div className="h-12 bg-gray-200 rounded w-3/4 mb-8 animate-pulse"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gray-100 mb-6">
            <FileText className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Không tìm thấy bài viết</h2>
          <p className="text-gray-600 mb-8">Bài viết bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
          <Link
            href="/news"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all font-semibold"
          >
            <ArrowLeft className="w-5 h-5" />
            Quay lại danh sách tin tức
          </Link>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(post.createdAt).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const readingTime = Math.ceil((post.content?.length || 0) / 1000);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Quay lại danh sách tin tức
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Article Content */}
          <div className="lg:col-span-2">
            {/* Hero Section */}
            <div className="mb-8">
              {/* Category & Meta */}
              <div className="flex flex-wrap items-center gap-4 mb-6">
                {post.category && (
                  <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-50 text-primary-700 rounded-full text-sm font-semibold">
                    <Tag className="w-4 h-4" />
                    {post.category}
                  </span>
                )}
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    <span>{formattedDate}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>{readingTime} phút đọc</span>
                  </div>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
                {post.title}
              </h1>

              {/* Excerpt */}
              {post.excerpt && (
                <p className="text-xl text-gray-600 leading-relaxed mb-8">
                  {post.excerpt}
                </p>
              )}

              {/* Featured Image */}
              {post.featuredImage && (
                <div className="aspect-video bg-gray-100 rounded-3xl overflow-hidden shadow-xl mb-8">
                  <img
                    src={getImageUrl(post.featuredImage)}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            {/* Article Content */}
            <article className="bg-white rounded-3xl shadow-sm p-8 lg:p-12">
              {post.content && (
                <div
                  className="prose prose-lg max-w-none
                    prose-headings:font-bold prose-headings:text-gray-900
                    prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
                    prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
                    prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6
                    prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline
                    prose-strong:text-gray-900 prose-strong:font-bold
                    prose-ul:my-6 prose-ol:my-6
                    prose-li:text-gray-700 prose-li:my-2
                    prose-img:rounded-2xl prose-img:shadow-lg prose-img:my-8
                    prose-blockquote:border-l-4 prose-blockquote:border-primary-500 prose-blockquote:bg-primary-50 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-xl prose-blockquote:not-italic prose-blockquote:text-gray-700
                    prose-code:text-primary-600 prose-code:bg-primary-50 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:font-mono prose-code:text-sm
                    prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-xl prose-pre:shadow-lg"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              )}

              {/* Share Section */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Chia sẻ bài viết này</h3>
                    <p className="text-sm text-gray-600">Giúp nhiều người biết đến thông tin hữu ích</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleShare('facebook')}
                      className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-semibold text-sm"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      Facebook
                    </button>
                    <button
                      onClick={() => handleShare('twitter')}
                      className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 text-white rounded-xl hover:bg-sky-700 transition-all font-semibold text-sm"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      </svg>
                      Twitter
                    </button>
                    <button
                      onClick={handleCopyLink}
                      className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-semibold text-sm"
                    >
                      <Link2 className="w-4 h-4" />
                      {copied ? 'Đã sao chép!' : 'Sao chép'}
                    </button>
                  </div>
                </div>
              </div>
            </article>
          </div>

          {/* Right Sidebar - Related Posts & Tags */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24 space-y-6">
              {/* Related Posts Card */}
              {relatedPosts.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary-600" />
                    Bài viết liên quan
                  </h3>
                  <div className="space-y-4">
                    {relatedPosts.map((relatedPost) => (
                      <Link
                        key={relatedPost._id}
                        href={`/news/${relatedPost.slug}`}
                        className="group block"
                      >
                        <div className="flex gap-3">
                          <div className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                            {relatedPost.featuredImage ? (
                              <img
                                src={getImageUrl(relatedPost.featuredImage)}
                                alt={relatedPost.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                                <FileText className="w-8 h-8 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors mb-1">
                              {relatedPost.title}
                            </h4>
                            <div className="text-xs text-gray-500">
                              {new Date(relatedPost.createdAt).toLocaleDateString('vi-VN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <Link
                    href="/news"
                    className="mt-4 flex items-center justify-center gap-1 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors group"
                  >
                    Xem tất cả tin tức
                    <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              )}

              {/* Tags Card */}
              {post.tags && post.tags.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Tag className="w-5 h-5 text-primary-600" />
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, index) => (
                      <Link
                        key={index}
                        href={`/news?tag=${tag}`}
                        className="inline-flex items-center px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium hover:bg-primary-50 hover:text-primary-700 transition-all"
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
