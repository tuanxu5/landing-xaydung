#!/bin/bash

echo "🚀 Setting up Backend for Vật liệu Xây dựng..."
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ File .env không tồn tại!"
    echo "📝 Tạo file .env với nội dung:"
    echo ""
    echo "MONGODB_URI=mongodb://localhost:27017/landing-xaydung"
    echo "PORT=3001"
    echo "JWT_SECRET=your-super-secret-jwt-key-change-this-in-production"
    echo "JWT_EXPIRES_IN=7d"
    echo ""
    exit 1
fi

echo "✅ File .env đã tồn tại"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Cài đặt dependencies..."
    npm install
    echo ""
fi

echo "🌱 Tạo tài khoản mặc định..."
npm run seed:admin
echo ""

echo "🎉 Setup hoàn tất!"
echo ""
echo "📋 Thông tin đăng nhập:"
echo ""
echo "👤 Admin:"
echo "   Username: admin"
echo "   Password: Admin@123"
echo ""
echo "👤 User:"
echo "   Username: user"
echo "   Password: User@123"
echo ""
echo "🌐 Frontend: http://localhost:3000/admin/login"
echo "🔧 Backend API: http://localhost:3001"
echo ""
echo "▶️  Khởi động server..."
echo ""

npm run start:dev
