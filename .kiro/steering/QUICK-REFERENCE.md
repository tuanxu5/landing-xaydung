---
inclusion: manual
---

# Quick Reference - Tiết Kiệm Token

## 🎯 Cách Hỏi Hiệu Quả

### ✅ Tốt - Cụ thể, ngắn gọn
```
"Header.tsx - Thêm logo 40x40px bên trái"
"Products page - Sửa grid từ 3 sang 4 cột"
"Fix lỗi getImageUrl ở ProductCard"
```

### ❌ Tránh - Mơ hồ, dài dòng
```
"Làm cho header đẹp hơn với logo và các thứ"
"Sửa trang sản phẩm cho nó responsive và đẹp"
"Có lỗi gì đó ở đâu đó trong code"
```

## 📁 File Paths Thường Dùng

### Frontend
```
components/landing/Header.tsx          # Header component
components/landing/ProductCard.tsx     # Product card
app/(landing)/products/page.tsx        # Products listing
app/(landing)/products/[slug]/page.tsx # Product detail
app/(landing)/page.tsx                 # Homepage
lib/utils.ts                           # Utilities (getImageUrl)
lib/api.ts                             # API client
lib/cart.ts                            # Cart functions
```

### Backend
```
src/products/products.controller.ts    # Products API
src/categories/categories.controller.ts # Categories API
src/posts/posts.controller.ts          # Posts API
src/auth/auth.controller.ts            # Auth API
```

## 🎨 Common Patterns

### Thêm Component Mới
```
"Tạo components/landing/Banner.tsx
- Props: title, image, description
- Style: max-w-7xl, primary color
- Pattern: như ProductCard"
```

### Sửa Style
```
"Products page - Sidebar:
- Width: 3/10 → 4/10
- Sticky top-24
- Max-h-[600px]"
```

### Fix Bug
```
"ProductCard - getImageUrl undefined
File: components/landing/ProductCard.tsx
Line: ~25"
```

### Thêm API Endpoint
```
"Backend - Thêm GET /api/brands
- Return: { data: Brand[], total: number }
- Pagination: page, limit
- Pattern: như products.controller.ts"
```

## 🔧 Common Commands

### Chỉ đọc 1 file
```
"Đọc Header.tsx"
"Show me ProductCard.tsx"
```

### Chỉ sửa 1 chỗ
```
"Header.tsx line 45 - Đổi text 'Menu' thành 'Danh mục'"
```

### So sánh 2 files
```
"So sánh ProductCard.tsx và NewsCard.tsx"
```

## 💾 Shortcuts

### Colors
```
Primary: #173e72
```

### Container
```
max-w-7xl mx-auto px-4
```

### Button Primary
```
bg-primary-600 hover:bg-primary-700 text-white rounded-xl px-6 py-3
```

### Card
```
bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all
```

### Image
```tsx
import { getImageUrl } from '@/lib/utils';
<img src={getImageUrl(path)} alt="..." />
```

## 📊 Token Usage Tips

### Thay vì hỏi chung chung:
❌ "Làm sao để thêm sản phẩm?"

### Hỏi cụ thể:
✅ "API endpoint để create product?"
→ Trả lời: `POST /api/products` (nhanh, ít token)

### Thay vì:
❌ "Trang products có vấn đề gì không?"

### Hỏi:
✅ "Check lỗi TypeScript ở products/page.tsx"
→ Chỉ scan 1 file

## 🎯 Workflow Hiệu Quả

### 1. Task đơn giản (< 5 phút)
```
"Header.tsx - Thêm class 'font-bold' vào logo"
```
→ 1 message, xong ngay

### 2. Task trung bình (5-15 phút)
```
"Tạo NewsCard component:
- Props: title, image, date, excerpt
- Style: giống ProductCard
- File: components/landing/NewsCard.tsx"
```
→ 2-3 messages

### 3. Task phức tạp (> 15 phút)
```
Message 1: "Plan: Thêm filter theo brand ở products page"
Message 2: "OK, implement backend API"
Message 3: "OK, implement frontend"
```
→ Chia nhỏ, dễ control

## 🚀 Pro Tips

1. **Dùng "OK" hoặc "Tiếp tục"** thay vì giải thích lại
2. **Reference file đã mở** trong editor
3. **Copy error message** thay vì mô tả
4. **Dùng line numbers** khi chỉ chỗ cần sửa
5. **Nói "như file X"** để reference pattern

## ⚡ Examples

### Siêu ngắn gọn:
```
"Header - logo 50px"
"Products - 4 cols"
"Fix ProductCard line 25"
"API /brands - như /products"
```

### Với context:
```
"ProductCard.tsx
Line 25: getImageUrl is not defined
→ Add import"
```

### Multi-step:
```
"1. Backend: POST /api/bookings
2. Frontend: BookingForm component
3. Validation: phone, email required"
```

---

**Nhớ**: Càng cụ thể, càng ít token! 🎯
