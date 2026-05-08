const mongoose = require('mongoose');
require('dotenv').config();

// FAQ Schema
const faqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const FAQ = mongoose.model('FAQ', faqSchema);

// FAQs data
const faqsData = [
  {
    question: 'Công ty có giao hàng tận nơi không?',
    answer: 'Có, chúng tôi cung cấp dịch vụ giao hàng tận nơi trên toàn quốc. Thời gian giao hàng thường trong vòng 24-48 giờ tùy theo khu vực. Đối với các đơn hàng lớn, chúng tôi có đội xe chuyên dụng để đảm bảo hàng hóa được vận chuyển an toàn.',
  },
  {
    question: 'Làm thế nào để đặt hàng?',
    answer: 'Bạn có thể đặt hàng qua 3 cách: (1) Gọi điện trực tiếp đến hotline của chúng tôi, (2) Đặt hàng qua website bằng cách chọn sản phẩm và điền form liên hệ, (3) Đến trực tiếp showroom để được tư vấn và đặt hàng. Nhân viên của chúng tôi sẽ hỗ trợ bạn trong suốt quá trình.',
  },
  {
    question: 'Có chính sách bảo hành cho sản phẩm không?',
    answer: 'Tất cả sản phẩm của chúng tôi đều được bảo hành theo quy định của nhà sản xuất, thường từ 6 tháng đến 2 năm tùy loại sản phẩm. Chúng tôi cam kết hỗ trợ đổi trả nếu sản phẩm có lỗi từ nhà sản xuất trong thời gian bảo hành.',
  },
  {
    question: 'Có hỗ trợ tư vấn kỹ thuật không?',
    answer: 'Có, chúng tôi có đội ngũ kỹ sư và chuyên gia giàu kinh nghiệm sẵn sàng tư vấn miễn phí về lựa chọn vật liệu, khối lượng cần thiết, và phương pháp thi công phù hợp với dự án của bạn. Bạn có thể liên hệ qua hotline hoặc đặt lịch hẹn tư vấn trực tiếp.',
  },
  {
    question: 'Giá sản phẩm đã bao gồm VAT chưa?',
    answer: 'Giá niêm yết trên website chưa bao gồm VAT. Khi xuất hóa đơn VAT, giá sẽ được cộng thêm 10% thuế VAT. Đối với khách hàng mua số lượng lớn, chúng tôi có chính sách giá ưu đãi đặc biệt.',
  },
  {
    question: 'Có chính sách giảm giá cho đơn hàng lớn không?',
    answer: 'Có, chúng tôi có chính sách chiết khấu hấp dẫn cho các đơn hàng với số lượng lớn hoặc khách hàng thường xuyên. Mức chiết khấu sẽ được tính dựa trên tổng giá trị đơn hàng và loại sản phẩm. Vui lòng liên hệ bộ phận kinh doanh để được báo giá chi tiết.',
  },
  {
    question: 'Thời gian làm việc của công ty?',
    answer: 'Chúng tôi làm việc từ thứ 2 đến thứ 7, từ 8:00 sáng đến 17:30 chiều. Hotline tư vấn hoạt động từ 7:30 sáng đến 20:00 tối để hỗ trợ khách hàng kịp thời. Chủ nhật và ngày lễ, bạn có thể đặt hàng online hoặc để lại thông tin, chúng tôi sẽ liên hệ lại vào ngày làm việc tiếp theo.',
  },
  {
    question: 'Có thể xem hàng trước khi mua không?',
    answer: 'Hoàn toàn có thể. Chúng tôi có showroom trưng bày đầy đủ các mẫu sản phẩm để khách hàng tham quan và lựa chọn. Bạn cũng có thể yêu cầu xem mẫu sản phẩm thực tế trước khi quyết định đặt hàng số lượng lớn.',
  },
  {
    question: 'Có nhận thi công không?',
    answer: 'Chúng tôi chuyên cung cấp vật liệu xây dựng và có thể giới thiệu các đội thi công uy tín, có kinh nghiệm cho khách hàng. Tuy nhiên, chúng tôi không trực tiếp nhận thi công để tập trung vào việc cung cấp vật liệu chất lượng cao nhất.',
  },
  {
    question: 'Làm thế nào để thanh toán?',
    answer: 'Chúng tôi chấp nhận nhiều hình thức thanh toán: tiền mặt, chuyển khoản ngân hàng, quẹt thẻ tại showroom. Đối với khách hàng thân thiết và đơn hàng lớn, chúng tôi có chính sách thanh toán công nợ linh hoạt sau khi thỏa thuận cụ thể.',
  },
];

async function seedFAQs() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/landing-xaydung');
    console.log('✅ Connected to MongoDB');

    // Clear existing FAQs
    await FAQ.deleteMany({});
    console.log('🗑️  Cleared existing FAQs');

    // Create FAQs with order
    for (let i = 0; i < faqsData.length; i++) {
      const faq = await FAQ.create({
        ...faqsData[i],
        order: i + 1,
        isActive: true,
      });
      console.log(`✅ Created FAQ ${i + 1}: ${faq.question}`);
    }

    console.log('\n🎉 Successfully seeded all FAQs!');
    console.log(`📊 Total FAQs created: ${faqsData.length}`);

  } catch (error) {
    console.error('❌ Error seeding FAQs:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

// Run the seed function
seedFAQs();
