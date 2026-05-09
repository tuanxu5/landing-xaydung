'use client';

import { useEffect, useState } from 'react';
import { Users, Award, MapPin, Phone, Mail, Clock, CheckCircle2, Target, Eye, Lightbulb, ExternalLink } from 'lucide-react';
import { api } from '@/lib/api';
import { getImageUrl } from '@/lib/utils';

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
  workingHours?: string;
}

export default function AboutPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCertIndex, setSelectedCertIndex] = useState<number | null>(null);

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

  const openCertModal = (index: number) => {
    setSelectedCertIndex(index);
  };

  const closeCertModal = () => {
    setSelectedCertIndex(null);
  };

  const nextCert = () => {
    if (selectedCertIndex !== null && selectedCertIndex < certificates.length - 1) {
      setSelectedCertIndex(selectedCertIndex + 1);
    }
  };

  const prevCert = () => {
    if (selectedCertIndex !== null && selectedCertIndex > 0) {
      setSelectedCertIndex(selectedCertIndex - 1);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (selectedCertIndex === null) return;
    if (e.key === 'ArrowRight') nextCert();
    if (e.key === 'ArrowLeft') prevCert();
    if (e.key === 'Escape') closeCertModal();
  };

  useEffect(() => {
    if (selectedCertIndex !== null) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [selectedCertIndex]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm text-gray-500">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md px-4">
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={fetchData}
            className="px-6 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-primary-700 text-white overflow-hidden" style={{ minHeight: '350px' }}>
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="/images/image-banner.jpg" 
            alt="About background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900/40 via-primary-800/35 to-primary-700/30"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10 flex items-center" style={{ minHeight: '350px' }}>
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl leading-[1.35] uppercase font-bold mb-4">
              Giới thiệu về {contactInfo?.companyName || 'Công ty'}
            </h1>
            <p className="text-lg text-primary-100">
              {contactInfo?.description || 'Đơn vị chuyên cung cấp phụ tùng máy xúc, máy công trình chính hãng với nhiều năm kinh nghiệm trong ngành'}
            </p>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <a href="/" className="hover:text-primary-600">Trang chủ</a>
            <span>/</span>
            <span className="text-gray-900 font-medium">Giới thiệu</span>
          </div>
        </div>
      </div>

      {/* Company Overview */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left: Image */}
            <div className="space-y-6">
              <div className="aspect-[4/3] rounded-xl overflow-hidden">
                <img
                  src="/images/image-banner.jpg"
                  alt="Công ty"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="aspect-video rounded-lg overflow-hidden">
                  <img
                    src="/images/image-banner.jpg"
                    alt="Kho hàng"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="aspect-video rounded-lg overflow-hidden">
                  <img
                    src="/images/image-banner.jpg"
                    alt="Sản phẩm"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Right: Content */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Lịch sử hình thành và phát triển
              </h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-600 leading-relaxed mb-4">
                  Được thành lập từ năm 2014, {contactInfo?.companyName || 'công ty chúng tôi'} đã không ngừng phát triển 
                  và khẳng định vị thế là một trong những đơn vị hàng đầu trong lĩnh vực cung cấp phụ tùng máy xúc, 
                  máy công trình tại Việt Nam.
                </p>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Với hơn 10 năm kinh nghiệm, chúng tôi tự hào đã phục vụ hàng nghìn khách hàng trên toàn quốc, 
                  từ các doanh nghiệp xây dựng lớn đến các đơn vị thi công nhỏ lẻ. Sự tin tưởng và hài lòng của 
                  khách hàng chính là động lực để chúng tôi không ngừng hoàn thiện và phát triển.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Chúng tôi chuyên cung cấp đầy đủ các loại phụ tùng: phụ tùng gầm (xích, ga lê, vành sao), 
                  phụ tùng bộ công tác (răng gầu, gầu xúc, xi lanh), phụ tùng thủy lực (bơm, van, motor), 
                  phụ tùng động cơ và các phụ tùng khác cho các dòng máy Komatsu, Hitachi, Kobelco, Sumitomo, 
                  Caterpillar, Hyundai, Doosan...
                </p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-gray-200">
                <div>
                  <div className="text-3xl font-bold text-primary-600 mb-1">10+</div>
                  <div className="text-sm text-gray-600">Năm kinh nghiệm</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary-600 mb-1">5000+</div>
                  <div className="text-sm text-gray-600">Khách hàng</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary-600 mb-1">15K+</div>
                  <div className="text-sm text-gray-600">Đơn hàng</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Vision */}
            <div className="bg-white p-8 rounded-xl">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <Eye className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Tầm nhìn</h3>
              <p className="text-gray-600 leading-relaxed">
                Trở thành đơn vị cung cấp phụ tùng máy xúc, máy công trình hàng đầu Việt Nam, 
                được khách hàng tin tưởng và lựa chọn bởi chất lượng sản phẩm, dịch vụ chuyên nghiệp 
                và giá cả cạnh tranh. Mở rộng mạng lưới phân phối trên toàn quốc và khu vực.
              </p>
            </div>

            {/* Mission */}
            <div className="bg-white p-8 rounded-xl">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Sứ mệnh</h3>
              <p className="text-gray-600 leading-relaxed">
                Cung cấp phụ tùng chính hãng, chất lượng cao với giá cả hợp lý, giúp khách hàng 
                tiết kiệm chi phí và tối ưu hiệu quả vận hành máy móc. Đồng hành cùng khách hàng 
                trong mọi dự án với dịch vụ tư vấn chuyên nghiệp và hỗ trợ kỹ thuật tận tâm.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Giá trị cốt lõi</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Những giá trị định hướng mọi hoạt động kinh doanh của chúng tôi
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Chất lượng</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Cam kết 100% sản phẩm chính hãng, có nguồn gốc xuất xứ rõ ràng, 
                    đầy đủ giấy tờ chứng nhận
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Tận tâm</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Đội ngũ tư vấn chuyên nghiệp, nhiệt tình hỗ trợ khách hàng 24/7, 
                    luôn đặt lợi ích khách hàng lên hàng đầu
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Lightbulb className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Đổi mới</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Không ngừng cải tiến quy trình, ứng dụng công nghệ để nâng cao 
                    chất lượng dịch vụ và trải nghiệm khách hàng
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section - Premium Design */}
      {teamMembers.length > 0 && (
        <section className="py-20 px-4 bg-gradient-to-b from-white to-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold mb-4">
                <Users className="w-4 h-4" />
                Đội ngũ lãnh đạo
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Ban lãnh đạo</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Những con người dẫn dắt công ty với tầm nhìn chiến lược và kinh nghiệm sâu rộng
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <div 
                  key={member._id} 
                  className="group relative"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Card */}
                  <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                    {/* Image with Overlay */}
                    <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                      <img
                        src={getImageUrl(member.avatar)}
                        alt={member.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      {/* Gradient Overlay on Hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      {/* Bio on Hover */}
                      {member.bio && (
                        <div className="absolute inset-x-0 bottom-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                          <p className="text-sm leading-relaxed">{member.bio}</p>
                        </div>
                      )}
                    </div>
                    
                    {/* Info */}
                    <div className="p-6 text-center">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                      <p className="text-sm text-primary-600 font-semibold uppercase tracking-wide">
                        {member.position}
                      </p>
                    </div>

                    {/* Decorative Corner */}
                    <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-primary-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Certificates & Awards - Masonry Style */}
      {certificates.length > 0 && (
        <section className="py-20 px-4 relative overflow-hidden" style={{ backgroundColor: '#111827' }}>
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '40px 40px'
            }}></div>
          </div>

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-full text-sm font-semibold mb-4">
                <Award className="w-4 h-4" />
                Thành tựu
              </div>
              <h2 className="text-4xl font-bold mb-4 text-white">Chứng nhận & Giải thưởng</h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                Những thành tựu và sự công nhận từ các tổ chức uy tín trong và ngoài nước
              </p>
            </div>

            {/* Grid Layout - 4 columns */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {certificates.map((cert, index) => (
                <div 
                  key={cert._id} 
                  className="group relative cursor-pointer"
                  onClick={() => openCertModal(index)}
                >
                  <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300">
                    {/* Certificate Image - A4 ratio */}
                    <div className="relative overflow-hidden" style={{ aspectRatio: '1 / 1.414' }}>
                      {cert.fileType === 'image' ? (
                        <img
                          src={getImageUrl(cert.fileUrl)}
                          alt={cert.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-white/5">
                          <Award className="w-12 h-12 text-primary-400" />
                        </div>
                      )}
                      
                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                        <div className="text-white">
                          <h3 className="text-sm font-bold line-clamp-2 mb-1">
                            {cert.title}
                          </h3>
                          {cert.issuedDate && (
                            <p className="text-xs text-gray-300">
                              {new Date(cert.issuedDate).getFullYear()}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none"></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats Bar */}
            <div className="mt-16 pt-12 border-t border-white/10">
              <div className="grid grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-4xl font-bold text-primary-400 mb-2">{certificates.length}+</div>
                  <div className="text-sm text-gray-400">Chứng nhận</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary-400 mb-2">100%</div>
                  <div className="text-sm text-gray-400">Uy tín</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary-400 mb-2">10+</div>
                  <div className="text-sm text-gray-400">Năm kinh nghiệm</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Certificate Modal */}
      {selectedCertIndex !== null && (
        <div 
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closeCertModal}
        >
          <div className="relative max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            {/* Close Button */}
            <button
              onClick={closeCertModal}
              className="absolute -top-12 right-0 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Image Container */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
              <div className="relative bg-gray-100" style={{ aspectRatio: '1 / 1.414' }}>
                {certificates[selectedCertIndex].fileType === 'image' ? (
                  <img
                    src={getImageUrl(certificates[selectedCertIndex].fileUrl)}
                    alt={certificates[selectedCertIndex].title}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Award className="w-24 h-24 text-gray-400" />
                  </div>
                )}
              </div>
              
              {/* Info */}
              <div className="p-6 bg-white">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {certificates[selectedCertIndex].title}
                </h3>
                {certificates[selectedCertIndex].description && (
                  <p className="text-gray-600 mb-3">
                    {certificates[selectedCertIndex].description}
                  </p>
                )}
                {certificates[selectedCertIndex].issuedDate && (
                  <p className="text-sm text-gray-500">
                    Năm cấp: {new Date(certificates[selectedCertIndex].issuedDate).getFullYear()}
                  </p>
                )}
                
                {/* Counter */}
                <div className="mt-4 text-sm text-gray-500">
                  {selectedCertIndex + 1} / {certificates.length}
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            {selectedCertIndex > 0 && (
              <button
                onClick={prevCert}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            
            {selectedCertIndex < certificates.length - 1 && (
              <button
                onClick={nextCert}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Partner Brands - Table List */}
      {brands.length > 0 && (
        <section className="py-20 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold mb-4">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Đối tác chiến lược
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Thương hiệu đối tác</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Chúng tôi tự hào là đại lý chính thức và đối tác tin cậy của các thương hiệu hàng đầu thế giới
              </p>
            </div>

            {/* Table List */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider w-32 whitespace-nowrap">
                        Logo
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider whitespace-nowrap">
                        Tên thương hiệu
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wider whitespace-nowrap">
                        Mô tả
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {brands.map((brand, index) => (
                      <tr key={brand._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                            <img
                              src={getImageUrl(brand.logo)}
                              alt={brand.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-base font-bold text-gray-900">
                            {brand.name}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-600">
                            {brand.description || '—'}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Trust Badge */}
            <div className="mt-12 text-center">
              <div className="inline-flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-primary-50 to-blue-50 rounded-full">
                <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-bold text-gray-900">Đại lý chính thức</div>
                  <div className="text-xs text-gray-600">Được ủy quyền bởi {brands.length} thương hiệu hàng đầu</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Contact Info */}
      {contactInfo && (
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="rounded-2xl p-8 md:p-12 text-white" style={{ background: 'linear-gradient(135deg, #111827 0%, #1f2937 100%)' }}>
              <div className="grid lg:grid-cols-2 gap-12">
                <div>
                  <h2 className="text-3xl font-bold mb-6">Thông tin liên hệ</h2>
                  <div className="space-y-4">
                    {contactInfo.address && (
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 flex-shrink-0 mt-1" />
                        <div>
                          <div className="font-semibold mb-1">Địa chỉ</div>
                          <div className="text-gray-300">{contactInfo.address}</div>
                        </div>
                      </div>
                    )}
                    {contactInfo.phone && (
                      <div className="flex items-start gap-3">
                        <Phone className="w-5 h-5 flex-shrink-0 mt-1" />
                        <div>
                          <div className="font-semibold mb-1">Điện thoại</div>
                          <a href={`tel:${contactInfo.phone}`} className="text-gray-300 hover:text-white">
                            {contactInfo.phone}
                          </a>
                        </div>
                      </div>
                    )}
                    {contactInfo.email && (
                      <div className="flex items-start gap-3">
                        <Mail className="w-5 h-5 flex-shrink-0 mt-1" />
                        <div>
                          <div className="font-semibold mb-1">Email</div>
                          <a href={`mailto:${contactInfo.email}`} className="text-gray-300 hover:text-white">
                            {contactInfo.email}
                          </a>
                        </div>
                      </div>
                    )}
                    {contactInfo.workingHours && (
                      <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 flex-shrink-0 mt-1" />
                        <div>
                          <div className="font-semibold mb-1">Giờ làm việc</div>
                          <div className="text-gray-300">{contactInfo.workingHours}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col justify-center">
                  <h3 className="text-2xl font-bold mb-4">Liên hệ với chúng tôi</h3>
                  <p className="text-gray-300 mb-6">
                    Hãy để chúng tôi tư vấn và cung cấp giải pháp phù hợp nhất cho nhu cầu của bạn
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <a
                      href="/contact"
                      className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      Gửi yêu cầu
                    </a>
                    <a
                      href="/products"
                      className="inline-flex items-center justify-center px-6 py-3 text-white font-semibold rounded-lg border-2 border-white/20 hover:bg-white/10 transition-colors"
                      style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                    >
                      Xem sản phẩm
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
