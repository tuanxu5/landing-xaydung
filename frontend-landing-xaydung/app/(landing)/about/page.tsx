import { CheckCircle, Users, Award, TrendingUp } from 'lucide-react';

export default function AboutPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Về chúng tôi</h1>
            <p className="text-xl text-primary-100">
              Đơn vị cung cấp vật liệu xây dựng uy tín hàng đầu với hơn 10 năm kinh nghiệm
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Câu chuyện của chúng tôi</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Được thành lập từ năm 2014, chúng tôi bắt đầu với mục tiêu đơn giản: cung cấp vật liệu xây dựng 
                  chất lượng cao với giá cả hợp lý cho mọi công trình.
                </p>
                <p>
                  Qua hơn 10 năm phát triển, chúng tôi đã trở thành đối tác tin cậy của hàng nghìn khách hàng 
                  từ các dự án nhỏ lẻ đến các công trình lớn trên toàn quốc.
                </p>
                <p>
                  Với đội ngũ nhân viên giàu kinh nghiệm và hệ thống kho bãi hiện đại, chúng tôi cam kết mang đến 
                  dịch vụ tốt nhất cho khách hàng.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800"
                  alt="About us"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Users, number: '5000+', label: 'Khách hàng' },
              { icon: Award, number: '10+', label: 'Năm kinh nghiệm' },
              { icon: CheckCircle, number: '15000+', label: 'Dự án hoàn thành' },
              { icon: TrendingUp, number: '98%', label: 'Khách hàng hài lòng' },
            ].map((stat, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 text-center shadow-sm">
                <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-7 h-7 text-primary-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Giá trị cốt lõi</h2>
            <p className="text-lg text-gray-600">Những giá trị chúng tôi luôn hướng tới</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Chất lượng',
                desc: 'Cam kết cung cấp sản phẩm chính hãng, chất lượng cao từ các thương hiệu uy tín',
              },
              {
                title: 'Uy tín',
                desc: 'Xây dựng niềm tin với khách hàng thông qua dịch vụ chuyên nghiệp và minh bạch',
              },
              {
                title: 'Tận tâm',
                desc: 'Luôn lắng nghe và đáp ứng nhu cầu của khách hàng một cách tốt nhất',
              },
            ].map((value, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all">
                <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Đội ngũ của chúng tôi</h2>
            <p className="text-lg text-gray-600">Những con người tạo nên sự khác biệt</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Nguyễn Văn A', role: 'Giám đốc điều hành' },
              { name: 'Trần Thị B', role: 'Trưởng phòng kinh doanh' },
              { name: 'Lê Văn C', role: 'Trưởng phòng kỹ thuật' },
            ].map((member, index) => (
              <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all">
                <div className="aspect-square bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                  <Users className="w-20 h-20 text-primary-400" />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-sm text-gray-600">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
