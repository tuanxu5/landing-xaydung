const mongoose = require('mongoose');
require('dotenv').config();

// Category Schema
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: String,
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const Category = mongoose.model('Category', categorySchema);

// Product Schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  shortDescription: String,
  price: { type: Number, required: true },
  salePrice: Number,
  unit: { type: String, required: true },
  stock: { type: Number, default: 0 },
  sku: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  images: { type: [String], default: [] },
  thumbnail: String,
  specifications: String,
  promotionPolicy: String,
  brands: { type: [String], default: [] },
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  tags: { type: [String], default: [] },
  manufacturer: String,
  origin: String,
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

// Helper function to generate slug
function generateSlug(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

// Sample products data
const productsData = [
  {
    name: 'Xi măng Portland PCB40',
    description: `
      <h2>Giới thiệu sản phẩm</h2>
      <p>Xi măng Portland PCB40 là loại xi măng chất lượng cao, được sản xuất theo tiêu chuẩn TCVN 2682:2009. Sản phẩm có độ bền cao, thời gian đông kết phù hợp, được sử dụng rộng rãi trong xây dựng dân dụng và công nghiệp.</p>
      
      <h3>Ưu điểm nổi bật</h3>
      <ul>
        <li>Độ bền cao, đạt cường độ 40 MPa sau 28 ngày</li>
        <li>Thời gian đông kết phù hợp, dễ thi công</li>
        <li>Độ ổn định thể tích tốt, không nứt nẻ</li>
        <li>Khả năng chống thấm cao</li>
        <li>Giá thành hợp lý</li>
      </ul>
      
      <h3>Ứng dụng</h3>
      <p>Xi măng PCB40 thích hợp cho các công trình:</p>
      <ul>
        <li>Xây dựng nhà ở dân dụng</li>
        <li>Công trình công nghiệp</li>
        <li>Đổ bê tông móng, cột, dầm, sàn</li>
        <li>Xây tường, trát tường</li>
        <li>Làm đường giao thông</li>
      </ul>
    `,
    specifications: `
      <table style="width: 100%; border-collapse: collapse;">
        <tr style="background: #f3f4f6;">
          <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold;">Cường độ chịu nén</td>
          <td style="padding: 12px; border: 1px solid #e5e7eb;">40 MPa (sau 28 ngày)</td>
        </tr>
        <tr>
          <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold;">Thời gian đông kết đầu</td>
          <td style="padding: 12px; border: 1px solid #e5e7eb;">≥ 45 phút</td>
        </tr>
        <tr style="background: #f3f4f6;">
          <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold;">Thời gian đông kết cuối</td>
          <td style="padding: 12px; border: 1px solid #e5e7eb;">≤ 10 giờ</td>
        </tr>
        <tr>
          <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold;">Độ mịn</td>
          <td style="padding: 12px; border: 1px solid #e5e7eb;">≥ 3000 cm²/g</td>
        </tr>
        <tr style="background: #f3f4f6;">
          <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold;">Khối lượng</td>
          <td style="padding: 12px; border: 1px solid #e5e7eb;">50 kg/bao</td>
        </tr>
        <tr>
          <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold;">Tiêu chuẩn</td>
          <td style="padding: 12px; border: 1px solid #e5e7eb;">TCVN 2682:2009</td>
        </tr>
      </table>
    `,
    promotionPolicy: `
      <h3>🎁 Chính sách ưu đãi đặc biệt</h3>
      <ul>
        <li><strong>Giảm 3%</strong> cho đơn hàng từ 100 bao trở lên</li>
        <li><strong>Giảm 5%</strong> cho đơn hàng từ 500 bao trở lên</li>
        <li><strong>Giảm 7%</strong> cho đơn hàng từ 1000 bao trở lên</li>
        <li><strong>Miễn phí vận chuyển</strong> trong bán kính 30km</li>
        <li><strong>Hỗ trợ vận chuyển</strong> cho đơn hàng lớn toàn quốc</li>
        <li><strong>Tư vấn kỹ thuật miễn phí</strong> từ đội ngũ chuyên gia</li>
      </ul>
      <p><em>* Áp dụng cho khách hàng mua số lượng lớn. Liên hệ để được báo giá tốt nhất!</em></p>
    `,
    brands: ['Holcim', 'Xi măng Hà Tiên'],
    unit: 'bao',
    isFeatured: true,
    tags: ['xi-mang', 'vat-lieu-xay-dung', 'xi-mang-portland'],
  },
  {
    name: 'Thép xây dựng D10 Hòa Phát',
    description: `
      <h2>Thép xây dựng D10 Hòa Phát</h2>
      <p>Thép xây dựng D10 Hòa Phát là sản phẩm thép thanh vằn có đường kính 10mm, được sản xuất theo công nghệ hiện đại, đạt tiêu chuẩn chất lượng cao. Sản phẩm có độ bền tốt, dễ uốn, dễ hàn, được sử dụng phổ biến trong xây dựng.</p>
      
      <h3>Đặc điểm nổi bật</h3>
      <ul>
        <li>Bề mặt sạch, không gỉ sét</li>
        <li>Độ bền kéo cao, chịu lực tốt</li>
        <li>Dễ uốn, dễ hàn, dễ thi công</li>
        <li>Độ đồng đều cao</li>
        <li>Giá cả cạnh tranh</li>
      </ul>
      
      <h3>Công dụng</h3>
      <p>Thép D10 được sử dụng trong:</p>
      <ul>
        <li>Đổ bê tông cột, dầm, sàn</li>
        <li>Làm cốt thép móng nhà</li>
        <li>Xây dựng công trình dân dụng</li>
        <li>Làm khung sắt, giàn giáo</li>
      </ul>
    `,
    specifications: `
      <table style="width: 100%; border-collapse: collapse;">
        <tr style="background: #f3f4f6;">
          <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold;">Đường kính</td>
          <td style="padding: 12px; border: 1px solid #e5e7eb;">10 mm</td>
        </tr>
        <tr>
          <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold;">Chiều dài</td>
          <td style="padding: 12px; border: 1px solid #e5e7eb;">11.7m - 12m</td>
        </tr>
        <tr style="background: #f3f4f6;">
          <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold;">Trọng lượng</td>
          <td style="padding: 12px; border: 1px solid #e5e7eb;">~7.4 kg/cây</td>
        </tr>
        <tr>
          <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold;">Giới hạn chảy</td>
          <td style="padding: 12px; border: 1px solid #e5e7eb;">≥ 390 MPa</td>
        </tr>
        <tr style="background: #f3f4f6;">
          <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold;">Độ bền kéo</td>
          <td style="padding: 12px; border: 1px solid #e5e7eb;">≥ 560 MPa</td>
        </tr>
        <tr>
          <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold;">Tiêu chuẩn</td>
          <td style="padding: 12px; border: 1px solid #e5e7eb;">TCVN 1651-1:2018</td>
        </tr>
      </table>
    `,
    promotionPolicy: `
      <h3>💰 Ưu đãi hấp dẫn</h3>
      <ul>
        <li><strong>Giảm 2%</strong> cho đơn hàng từ 1 tấn</li>
        <li><strong>Giảm 4%</strong> cho đơn hàng từ 5 tấn</li>
        <li><strong>Giảm 6%</strong> cho đơn hàng từ 10 tấn</li>
        <li><strong>Giao hàng miễn phí</strong> nội thành</li>
        <li><strong>Hỗ trợ cắt, uốn</strong> theo yêu cầu</li>
      </ul>
    `,
    brands: ['Hòa Phát', 'Việt Nhật'],
    unit: 'kg',
    isFeatured: true,
    tags: ['thep', 'thep-xay-dung', 'thep-d10'],
  },
  {
    name: 'Gạch ốp lát Viglacera 60x60',
    description: `
      <h2>Gạch ốp lát Viglacera 60x60</h2>
      <p>Gạch ốp lát Viglacera 60x60 là dòng gạch cao cấp, bề mặt men bóng, vân đá tự nhiên sang trọng. Sản phẩm có độ bền cao, chống trầy xước, chống thấm nước tốt, phù hợp cho mọi không gian.</p>
      
      <h3>Ưu điểm vượt trội</h3>
      <ul>
        <li>Bề mặt men bóng, vân đá tự nhiên đẹp mắt</li>
        <li>Độ bền cao, chống trầy xước</li>
        <li>Chống thấm nước tuyệt đối</li>
        <li>Dễ vệ sinh, không bám bẩn</li>
        <li>Màu sắc đa dạng, kiểu dáng hiện đại</li>
      </ul>
      
      <h3>Ứng dụng</h3>
      <ul>
        <li>Ốp lát phòng khách, phòng ngủ</li>
        <li>Ốp lát nhà bếp, nhà tắm</li>
        <li>Ốp tường ngoại thất</li>
        <li>Sảnh khách sạn, văn phòng</li>
      </ul>
    `,
    specifications: `
      <table style="width: 100%; border-collapse: collapse;">
        <tr style="background: #f3f4f6;">
          <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold;">Kích thước</td>
          <td style="padding: 12px; border: 1px solid #e5e7eb;">600 x 600 mm</td>
        </tr>
        <tr>
          <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold;">Độ dày</td>
          <td style="padding: 12px; border: 1px solid #e5e7eb;">9.5 mm</td>
        </tr>
        <tr style="background: #f3f4f6;">
          <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold;">Độ hút nước</td>
          <td style="padding: 12px; border: 1px solid #e5e7eb;">< 0.5%</td>
        </tr>
        <tr>
          <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold;">Độ cứng bề mặt</td>
          <td style="padding: 12px; border: 1px solid #e5e7eb;">Mohs 6</td>
        </tr>
        <tr style="background: #f3f4f6;">
          <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold;">Số viên/thùng</td>
          <td style="padding: 12px; border: 1px solid #e5e7eb;">3 viên</td>
        </tr>
        <tr>
          <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold;">Xuất xứ</td>
          <td style="padding: 12px; border: 1px solid #e5e7eb;">Việt Nam</td>
        </tr>
      </table>
    `,
    promotionPolicy: `
      <h3>🎉 Khuyến mãi đặc biệt</h3>
      <ul>
        <li><strong>Giảm 5%</strong> cho đơn hàng từ 50m²</li>
        <li><strong>Giảm 8%</strong> cho đơn hàng từ 100m²</li>
        <li><strong>Giảm 10%</strong> cho đơn hàng từ 200m²</li>
        <li><strong>Tặng keo dán gạch</strong> cho đơn hàng trên 100m²</li>
        <li><strong>Miễn phí vận chuyển</strong> nội thành</li>
        <li><strong>Bảo hành 10 năm</strong> cho sản phẩm</li>
      </ul>
    `,
    brands: ['Viglacera', 'Prime'],
    unit: 'm²',
    isFeatured: true,
    tags: ['gach', 'gach-op-lat', 'gach-60x60'],
  },
  {
    name: 'Sơn nước ngoại thất Dulux Weathershield',
    description: `
      <h2>Sơn nước ngoại thất Dulux Weathershield</h2>
      <p>Sơn nước ngoại thất Dulux Weathershield là dòng sơn cao cấp, chuyên dụng cho bề mặt ngoại thất. Sản phẩm có khả năng chống chịu thời tiết khắc nghiệt, chống bám bẩn, giữ màu lâu dài.</p>
      
      <h3>Tính năng ưu việt</h3>
      <ul>
        <li>Công nghệ chống thấm vượt trội</li>
        <li>Chống bám bẩn, dễ lau chùi</li>
        <li>Chống rêu mốc, nấm mọc</li>
        <li>Giữ màu lâu dài dưới ánh nắng</li>
        <li>Thân thiện môi trường, không mùi</li>
      </ul>
      
      <h3>Phạm vi sử dụng</h3>
      <ul>
        <li>Sơn tường ngoại thất nhà ở</li>
        <li>Sơn công trình thương mại</li>
        <li>Sơn tường rào, hàng rào</li>
        <li>Sơn các bề mặt xi măng, bê tông</li>
      </ul>
    `,
    specifications: `
      <table style="width: 100%; border-collapse: collapse;">
        <tr style="background: #f3f4f6;">
          <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold;">Dung tích</td>
          <td style="padding: 12px; border: 1px solid #e5e7eb;">18 lít</td>
        </tr>
        <tr>
          <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold;">Độ phủ</td>
          <td style="padding: 12px; border: 1px solid #e5e7eb;">12-14 m²/lít/lớp</td>
        </tr>
        <tr style="background: #f3f4f6;">
          <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold;">Số lớp sơn</td>
          <td style="padding: 12px; border: 1px solid #e5e7eb;">2-3 lớp</td>
        </tr>
        <tr>
          <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold;">Thời gian khô</td>
          <td style="padding: 12px; border: 1px solid #e5e7eb;">2-4 giờ</td>
        </tr>
        <tr style="background: #f3f4f6;">
          <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold;">Bảo quản</td>
          <td style="padding: 12px; border: 1px solid #e5e7eb;">Nơi khô ráo, thoáng mát</td>
        </tr>
        <tr>
          <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold;">Xuất xứ</td>
          <td style="padding: 12px; border: 1px solid #e5e7eb;">Anh Quốc</td>
        </tr>
      </table>
    `,
    promotionPolicy: `
      <h3>🎨 Ưu đãi sơn nước</h3>
      <ul>
        <li><strong>Giảm 10%</strong> cho đơn hàng từ 10 thùng</li>
        <li><strong>Giảm 15%</strong> cho đơn hàng từ 20 thùng</li>
        <li><strong>Tặng dụng cụ sơn</strong> (cọ, lăn) cho đơn hàng lớn</li>
        <li><strong>Tư vấn phối màu miễn phí</strong></li>
        <li><strong>Giao hàng tận nơi</strong> miễn phí</li>
      </ul>
    `,
    brands: ['Dulux', 'Jotun'],
    unit: 'thùng',
    isFeatured: false,
    tags: ['son', 'son-nuoc', 'son-ngoai-that'],
  },
  {
    name: 'Cát xây dựng loại 1',
    description: `
      <h2>Cát xây dựng loại 1</h2>
      <p>Cát xây dựng loại 1 là loại cát sạch, hạt mịn đều, không lẫn tạp chất, được sử dụng phổ biến trong xây dựng. Sản phẩm đạt tiêu chuẩn chất lượng, phù hợp cho mọi công trình.</p>
      
      <h3>Đặc điểm</h3>
      <ul>
        <li>Hạt mịn đều, không lẫn đất, sỏi</li>
        <li>Độ sạch cao, không tạp chất</li>
        <li>Độ ẩm phù hợp</li>
        <li>Giá cả hợp lý</li>
      </ul>
      
      <h3>Công dụng</h3>
      <ul>
        <li>Trộn bê tông, vữa xây</li>
        <li>Trát tường, trát sàn</li>
        <li>Đổ móng, đổ sàn</li>
        <li>Lót nền nhà</li>
      </ul>
    `,
    specifications: `
      <table style="width: 100%; border-collapse: collapse;">
        <tr style="background: #f3f4f6;">
          <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold;">Loại</td>
          <td style="padding: 12px; border: 1px solid #e5e7eb;">Cát xây dựng loại 1</td>
        </tr>
        <tr>
          <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold;">Kích thước hạt</td>
          <td style="padding: 12px; border: 1px solid #e5e7eb;">0.5 - 2 mm</td>
        </tr>
        <tr style="background: #f3f4f6;">
          <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold;">Độ ẩm</td>
          <td style="padding: 12px; border: 1px solid #e5e7eb;">< 5%</td>
        </tr>
        <tr>
          <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold;">Tạp chất</td>
          <td style="padding: 12px; border: 1px solid #e5e7eb;">< 3%</td>
        </tr>
        <tr style="background: #f3f4f6;">
          <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold;">Đơn vị bán</td>
          <td style="padding: 12px; border: 1px solid #e5e7eb;">m³ hoặc tấn</td>
        </tr>
        <tr>
          <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold;">Xuất xứ</td>
          <td style="padding: 12px; border: 1px solid #e5e7eb;">Việt Nam</td>
        </tr>
      </table>
    `,
    promotionPolicy: `
      <h3>📦 Chính sách bán cát</h3>
      <ul>
        <li><strong>Giảm 3%</strong> cho đơn hàng từ 10m³</li>
        <li><strong>Giảm 5%</strong> cho đơn hàng từ 50m³</li>
        <li><strong>Miễn phí vận chuyển</strong> trong bán kính 20km</li>
        <li><strong>Hỗ trợ bốc xếp</strong> tại công trình</li>
        <li><strong>Giao hàng nhanh</strong> trong ngày</li>
      </ul>
    `,
    brands: ['Cát Bình Dương', 'Cát Đồng Nai'],
    unit: 'm³',
    isFeatured: false,
    tags: ['cat', 'cat-xay-dung', 'vat-lieu-co-ban'],
  },
];

async function seedProducts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/landing-xaydung');
    console.log('✅ Connected to MongoDB');

    // Get first category to use as default
    const category = await Category.findOne();
    if (!category) {
      console.error('❌ No categories found. Please run seed-categories.js first!');
      process.exit(1);
    }

    console.log(`📁 Using category: ${category.name}`);

    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');

    // Create products
    for (const productData of productsData) {
      const product = await Product.create({
        ...productData,
        slug: generateSlug(productData.name),
        category: category._id,
        price: 0,
        stock: 100,
        isActive: true,
        images: [
          'https://via.placeholder.com/800x800/173e72/ffffff?text=' + encodeURIComponent(productData.name.substring(0, 20)),
          'https://via.placeholder.com/800x800/2a6941/ffffff?text=Image+2',
          'https://via.placeholder.com/800x800/52a377/ffffff?text=Image+3',
        ],
        thumbnail: 'https://via.placeholder.com/800x800/173e72/ffffff?text=' + encodeURIComponent(productData.name.substring(0, 20)),
      });
      console.log(`✅ Created: ${product.name}`);
    }

    console.log('\n🎉 Successfully seeded all products!');
    console.log(`📊 Total products created: ${productsData.length}`);

  } catch (error) {
    console.error('❌ Error seeding products:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

// Run the seed function
seedProducts();
