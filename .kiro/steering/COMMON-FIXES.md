---
inclusion: manual
---

# Common Fixes - Giải Pháp Nhanh

## 🐛 Lỗi Thường Gặp & Cách Fix

### 1. getImageUrl is not defined
**File:** Any component using images

**Fix:**
```tsx
import { getImageUrl } from '@/lib/utils';
```

### 2. Cannot find module '@/...'
**Nguyên nhân:** TypeScript path mapping

**Fix:** Restart TypeScript server hoặc check `tsconfig.json`

### 3. Image không hiển thị
**Check:**
1. Backend running? (port 3000)
2. Image path có `/uploads/` prefix?
3. Đã dùng `getImageUrl()`?

**Fix:**
```tsx
<img src={getImageUrl(product.thumbnail)} alt="..." />
```

### 4. API call failed
**Check:**
1. Backend running?
2. Endpoint đúng? `/api/...`
3. CORS enabled?

**Fix:**
```tsx
try {
  const response = await api.get('/api/products');
  setData(response.data);
} catch (error) {
  console.error('Error:', error);
}
```

### 5. Tailwind classes không work
**Nguyên nhân:** Class name typo hoặc không có trong config

**Fix:**
- Check spelling: `bg-primary-600` (not `bg-primary`)
- Use standard Tailwind classes
- Restart dev server

### 6. TypeScript error: Type 'X' is not assignable
**Fix:** Add proper interface
```tsx
interface Product {
  _id: string;
  name: string;
  thumbnail?: string;
}
```

### 7. Dropdown menu bị đóng khi hover
**Fix:** Add proper hover states
```tsx
onMouseEnter={() => setIsOpen(true)}
onMouseLeave={() => setIsOpen(false)}
```

### 8. Pagination không hiển thị
**Check:** Có điều kiện `totalPages > 1`?

**Fix:** Bỏ điều kiện, luôn hiển thị pagination

### 9. Category tree không đúng cấp
**Check:** `parentId` trong database

**Fix:** Verify category hierarchy:
- Level 1: `parentId = null`
- Level 2: `parentId = level1._id`
- Level 3: `parentId = level2._id`

### 10. Cart không update
**Check:** localStorage và event listener

**Fix:**
```tsx
window.dispatchEvent(new Event('cartUpdated'));
```

## 🎨 Style Quick Fixes

### Container không đúng
```tsx
// ❌ Wrong
<div className="container mx-auto">

// ✅ Correct
<div className="max-w-7xl mx-auto px-4">
```

### Button không đúng màu
```tsx
// ❌ Wrong
<button className="bg-blue-600">

// ✅ Correct
<button className="bg-primary-600 hover:bg-primary-700">
```

### Card không có shadow
```tsx
// ❌ Wrong
<div className="bg-white rounded-lg">

// ✅ Correct
<div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all">
```

## 🔧 Performance Quick Fixes

### Image loading chậm
```tsx
// Add loading="lazy"
<img src={getImageUrl(path)} alt="..." loading="lazy" />
```

### Too many re-renders
```tsx
// Use useCallback
const handleClick = useCallback(() => {
  // ...
}, [dependencies]);
```

### API call nhiều lần
```tsx
// Add dependency array
useEffect(() => {
  fetchData();
}, []); // Empty array = run once
```

## 📱 Responsive Quick Fixes

### Mobile layout vỡ
```tsx
// Use responsive classes
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
```

### Text quá dài
```tsx
// Add line-clamp
<p className="line-clamp-2">Long text...</p>
```

### Button quá nhỏ trên mobile
```tsx
// Add responsive padding
<button className="px-4 py-2 md:px-6 md:py-3">
```

## 🚀 Quick Commands

### Restart dev server
```bash
# Frontend
cd frontend-landing-xaydung
npm run dev

# Backend
cd backend-landing-xaydung
npm run start:dev
```

### Clear cache
```bash
# Next.js
rm -rf .next
npm run dev

# Node modules
rm -rf node_modules
npm install
```

### Check TypeScript errors
```bash
npx tsc --noEmit
```

### Format code
```bash
npm run format
```

---

**Tip:** Bookmark file này để reference nhanh! 🔖
