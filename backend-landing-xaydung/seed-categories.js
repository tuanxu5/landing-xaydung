const mongoose = require('mongoose');
require('dotenv').config();

// Category Schema
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  description: String,
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const Category = mongoose.model('Category', categorySchema);

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

// Categories data
const categoriesData = [
  {
    name: 'PHỤ TÙNG GẦM',
    children: [
      'Bộ xích Comple',
      'Dải xích',
      'Ga lê đỡ',
      'Ga lê tỳ (đè)',
      'Vành sao',
      'Bánh dẫn hướng',
      'Lá xích',
    ],
  },
  {
    name: 'PHỤ TÙNG BỘ CÔNG TÁC',
    children: [
      'Răng gầu',
      'Lợi gầu',
      'Gầu xúc',
      'Ắc gầu - Bạc gầu',
      'Xi lanh thủy lực',
      'Lưỡi ben - Lưỡi góc',
    ],
  },
  {
    name: 'PHỤ TÙNG ĐẦU CẦN',
    children: [
      'Búa Phá Đá',
      'Đầm Rung Thuỷ Lực',
      'Tháo lắp nhanh',
    ],
  },
  {
    name: 'PHỤ TÙNG THỦY LỰC',
    children: [
      {
        name: 'Bơm thủy lực nguyên chiếc',
        children: [
          'Bơm thủy lực máy xúc',
          'Bơm thủy lực máy ủi/ xúc lật',
        ],
      },
      'Bộ điều tiết (Ba lô)',
      'Bơm điều khiển',
      'Bộ ruột bơm thủy lực',
      'Tuy ô thủy lực',
    ],
  },
  {
    name: 'PHỤ TÙNG DI CHUYỂN',
    children: [
      'Cụm mô tơ di chuyển',
      'Nồi trong/ Nồi ngoài di chuyển',
      'Bộ ruột bơm di chuyển',
      {
        name: 'Bánh răng di chuyển',
        children: [
          'Bộ bánh răng tầng dày - tầng mỏng',
          'Bánh răng vệ tinh di chuyển',
          'Bánh răng láp di chuyển',
          'Bánh răng Moay-ơ',
          'Bánh răng trục láp',
          'Vành răng di chuyển',
        ],
      },
    ],
  },
  {
    name: 'PHỤ TÙNG QUAY TOA',
    children: [
      'Cụm quay toa',
      'Mâm quay toa',
      'Bộ ruột bơm quay toa',
      {
        name: 'Bánh răng quay toa',
        children: [
          'Bộ bánh răng quay toa',
          'Bánh răng vệ tinh quay toa',
          'Trục quay toa',
          'Vành răng quay toa',
          'Bánh răng láp quay toa',
        ],
      },
    ],
  },
  {
    name: 'PHỤ TÙNG PHỚT',
    children: [
      'Bộ phớt ghép bộ',
      'Phớt xi lanh thủy lực',
      'Phớt trung tâm',
      'Phớt tăng xích',
      'Phớt Gioăng bơm, ngăn kéo',
      'Phớt mặt chà',
      'Phớt dùng cho máy Lốp',
      'Phớt chắn dầu',
      'Phớt Ti, Tay Trang, Tay điều khiển',
      'Gioăng chỉ',
      'Các loại phớt khác',
    ],
  },
  {
    name: 'PHỤ TÙNG ĐỘNG CƠ',
    children: [
      'Turbo',
      'Lọc',
      'Bầu giảm thanh',
      'Cao su chân máy',
      'Bơm nước',
      'Cút nước',
      'Cánh quạt',
      'Puli tăng đai',
      'Két nước',
      'Sinh hàn',
      'Van hằng nhiệt',
      'Két mát dầu thủy lực',
    ],
  },
  {
    name: 'PHỤ TÙNG ĐIỆN',
    children: [
      'Máy đề',
      'Máy phát',
      'Mô tơ ga',
      'Van điện từ',
      'Cảm biến',
      'Rơ le tắt máy',
      'Hộp điều khiển - hộp đen',
      'Màn hình - táp lô',
      'Chuột đề',
      'Ruột đề',
      'Bơm dầu điện tử',
      'Đèn',
      'Phụ tùng điện khác',
    ],
  },
  {
    name: 'PHỤ TÙNG KHÁC',
    children: [
      'Vòng bi',
      'Bu lông - Ê cu - Chốt răng gầu',
      'Ắc xích - Bạc xích',
      'Tay điều khiển',
      'Van tay điều khiển',
      'Dây điều khiển',
      'Xích bọc lốp',
      'Lá phanh',
      'Bơm mỡ',
      'Lốp xe tải mỏ - xúc lật',
    ],
  },
];

async function seedCategories() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/landing-xaydung');
    console.log('✅ Connected to MongoDB');

    // Clear existing categories
    await Category.deleteMany({});
    console.log('🗑️  Cleared existing categories');

    let order = 0;

    // Process each level 1 category
    for (const level1Data of categoriesData) {
      // Create level 1 category
      const level1 = await Category.create({
        name: level1Data.name,
        slug: generateSlug(level1Data.name),
        order: order++,
        isActive: true,
      });
      console.log(`✅ Created Level 1: ${level1.name}`);

      // Process children
      for (const level2Data of level1Data.children) {
        if (typeof level2Data === 'string') {
          // Simple level 2 category
          const level2 = await Category.create({
            name: level2Data,
            slug: generateSlug(level2Data),
            parent: level1._id,
            order: order++,
            isActive: true,
          });
          console.log(`  ✅ Created Level 2: ${level2.name}`);
        } else {
          // Level 2 with children (level 3)
          const level2 = await Category.create({
            name: level2Data.name,
            slug: generateSlug(level2Data.name),
            parent: level1._id,
            order: order++,
            isActive: true,
          });
          console.log(`  ✅ Created Level 2: ${level2.name}`);

          // Process level 3 children
          for (const level3Name of level2Data.children) {
            const level3 = await Category.create({
              name: level3Name,
              slug: generateSlug(level3Name),
              parent: level2._id,
              order: order++,
              isActive: true,
            });
            console.log(`    ✅ Created Level 3: ${level3.name}`);
          }
        }
      }
    }

    console.log('\n🎉 Successfully seeded all categories!');
    console.log(`📊 Total categories created: ${order}`);

    // Count by level
    const level1Count = await Category.countDocuments({ parent: null });
    const level2Count = await Category.countDocuments({ parent: { $ne: null } });
    const level3Count = await Category.countDocuments({});
    
    console.log(`\n📈 Statistics:`);
    console.log(`   Level 1: ${level1Count} categories`);
    console.log(`   Level 2+: ${level2Count} categories`);
    console.log(`   Total: ${level3Count} categories`);

  } catch (error) {
    console.error('❌ Error seeding categories:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

// Run the seed function
seedCategories();
