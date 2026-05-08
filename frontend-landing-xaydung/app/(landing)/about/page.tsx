'use client';

import { useEffect, useState } from 'react';
import { Users, Award, TrendingUp, Shield, ExternalLink, ArrowRight, CheckCircle2, Target, Sparkles } from 'lucide-react';
import { api } from '@/lib/api';
import Image from 'next/image';

interface TeamMember {
  _id: string;
  name: string;
  position: string;
  avatar: string;
  bio?: string;
  isActive: boolean;
}

interface Certificate {
  _id: string;
  title: string;
  fileUrl: string;
  fileType: 'pdf' | 'image';
  description?: string;
  issuedDate?: string;
  isActive: boolean;
}

interface Brand {
  _id: string;
  name: string;
  logo: string;
  description?: string;
  website?: string;
  isActive: boolean;
}

interface ContactInfo {
  companyName: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
}

export default function AboutPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [teamRes, certRes, brandsRes, contactRes] = await Promise.all([
        api.get('/api/site-info/team-members', { params: { isActive: true } }),
        api.get('/api/site-info/certificates', { params: { isActive: true } }),
        api.get('/api/site-info/brands', { params: { isActive: true } }),
        api.get('/api/site-info/contact'),
      ]);

      setTeamMembers(teamRes.data);
      setCertificates(certRes.data);
      setBrands(brandsRes.data);
      setContactInfo(contactRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchData}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0YzMuMzEgMCA2LTIuNjkgNi02cy0yLjY5LTYtNi02LTYgMi42OS02IDYgMi42OSA2IDYgNnptMC00YzEuMSAwIDItLjkgMi0ycy0uOS0yLTItMi0yIC45LTIgMiAuOSAyIDIgMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              {contactInfo?.companyName || 'Về chúng tôi'}
            </h1>
            <p className="text-xl text-primary-100 leading-relaxed">
              {contactInfo?.description || 'Đơn vị cung cấp phụ tùng máy xúc, máy công trình uy tín hàng đầu với nhiều năm kinh nghiệm'}
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold mb-6">
                Câu chuyện của chúng tôi
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Hành trình xây dựng niềm tin
              </h2>
              <div className="space-y-4 text-gray-600 text-lg leading-relaxed">
                <p>
                  Chúng tôi tự hào là đơn vị chuyên cung cấp phụ tùng máy xúc, máy công trình chính hãng 
                  với đầy đủ các loại từ phụ tùng gầm, bộ công tác, thủy lực đến động cơ và điện.
                </p>
                <p>
                  Với kinh nghiệm nhiều năm trong ngành, chúng tôi hiểu rõ nhu cầu của khách hàng và 
                  cam kết mang đến những sản phẩm chất lượng cao, giá cả cạnh tranh cùng dịch vụ tư vấn 
                  chuyên nghiệp.
                </p>
                <p>
                  Đội ngũ kỹ thuật giàu kinh nghiệm của chúng tôi luôn sẵn sàng hỗ trợ khách hàng 
                  trong việc lựa chọn phụ tùng phù hợp và giải đáp mọi thắc mắc kỹ thuật.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] bg-gradient-to-br from-primary-100 to-primary-200 rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800"
                  alt="About us"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-primary-600 rounded-3xl -z-10"></div>
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary-300 rounded-full -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">5000+</div>
              <div className="text-sm text-gray-600 font-medium">Khách hàng tin tưởng</div>
            </div>
            <div className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">10+</div>
              <div className="text-sm text-gray-600 font-medium">Năm kinh nghiệm</div>
            </div>
            <div className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-purple-600" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">15000+</div>
              <div className="text-sm text-gray-600 font-medium">Đơn hàng hoàn thành</div>
            </div>
            <div className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-orange-600" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">98%</div>
              <div className="text-sm text-gray-600 font-medium">Khách hàng hài lòng</div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold mb-4">
              Giá trị cốt lõi
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Những giá trị chúng tôi theo đuổi</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Chúng tôi xây dựng mọi hoạt động dựa trên những giá trị cốt lõi này
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Chất lượng đảm bảo</h3>
              <p className="text-gray-600 leading-relaxed">
                Cam kết cung cấp phụ tùng chính hãng 100%, có nguồn gốc xuất xứ rõ ràng từ các thương hiệu uy tín
              </p>
            </div>
            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Tận tâm phục vụ</h3>
              <p className="text-gray-600 leading-relaxed">
                Đội ngũ tư vấn chuyên nghiệp, nhiệt tình hỗ trợ khách hàng 24/7 với mọi thắc mắc kỹ thuật
              </p>
            </div>
            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Giá cả cạnh tranh</h3>
              <p className="text-gray-600 leading-relaxed">
                Chính sách giá tốt nhất thị trường với nhiều chương trình ưu đãi hấp dẫn cho khách hàng thân thiết
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      {teamMembers.length > 0 && (
        <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold mb-4">
                Đội ngũ của chúng tôi
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Những con người tạo nên sự khác biệt</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Đội ngũ chuyên gia giàu kinh nghiệm, tận tâm với công việc
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member) => (
                <div key={member._id} className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2">
                  <div className="aspect-square overflow-hidden bg-gradient-to-br from-primary-100 to-primary-200">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                    <p className="text-sm text-primary-600 font-medium mb-3">{member.position}</p>
                    {member.bio && (
                      <p className="text-sm text-gray-600 line-clamp-2">{member.bio}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Certificates Section */}
      {certificates.length > 0 && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold mb-4">
                Chứng nhận & Giải thưởng
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Những thành tựu đạt được</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Được công nhận bởi các tổ chức uy tín trong và ngoài nước
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {certificates.map((cert) => (
                <div key={cert._id} className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2">
                  <div className="aspect-square bg-gray-50 rounded-xl overflow-hidden mb-4 flex items-center justify-center">
                    {cert.fileType === 'image' ? (
                      <img
                        src={cert.fileUrl}
                        alt={cert.title}
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <Award className="w-16 h-16 text-primary-400" />
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 text-center line-clamp-2">
                    {cert.title}
                  </h3>
                  {cert.issuedDate && (
                    <p className="text-xs text-gray-500 text-center mt-2">
                      {new Date(cert.issuedDate).getFullYear()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Brands Section */}
      {brands.length > 0 && (
        <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold mb-4">
                Đối tác thương hiệu
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Thương hiệu nổi bật</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Chúng tôi là đại lý chính thức của các thương hiệu hàng đầu thế giới
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {brands.map((brand) => (
                <div key={brand._id} className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2">
                  <div className="aspect-square bg-gray-50 rounded-xl overflow-hidden mb-4 flex items-center justify-center p-4">
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 text-center line-clamp-1">
                    {brand.name}
                  </h3>
                  {brand.website && (
                    <a
                      href={brand.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1 text-xs text-primary-600 hover:text-primary-700 mt-2"
                    >
                      <span>Website</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Sẵn sàng hợp tác cùng chúng tôi?</h2>
          <p className="text-xl text-primary-100 mb-8">
            Liên hệ ngay để được tư vấn và báo giá tốt nhất
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary-600 font-bold rounded-xl hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl"
            >
              Liên hệ ngay
            </a>
            <a
              href="/products"
              className="inline-flex items-center justify-center px-8 py-4 bg-primary-700 text-white font-bold rounded-xl hover:bg-primary-800 transition-all border-2 border-white/20"
            >
              Xem sản phẩm
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
