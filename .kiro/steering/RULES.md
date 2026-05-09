---
inclusion: auto
---

# Project Rules & Guidelines

## 🎨 Design System

### Colors
- **Primary Color**: `#173e72` (Navy Blue)
- Defined in: `frontend-landing-xaydung/app/globals.css`
- Usage: Buttons, links, headers, accents

### Layout
- **Container**: Use `max-w-7xl mx-auto` instead of `container mx-auto`
- **Padding**: Standard `px-4` for mobile, responsive padding for larger screens
- **Spacing**: Consistent use of Tailwind spacing scale

### Typography
- **Font Family**: Plus Jakarta Sans (defined in globals.css)
- **Headings**: Bold, clear hierarchy
- **Body**: Regular weight, good line-height for readability

## 🏗️ Architecture

### Backend
- **Framework**: NestJS
- **Database**: MongoDB with Mongoose
- **Port**: 3000
- **Base URL**: `http://localhost:3000`
- **API Prefix**: `/api`

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Port**: 3001 (currently running on 3002)
- **Styling**: Tailwind CSS
- **State Management**: React hooks, local storage for cart

## 📁 Project Structure

### Backend Structure
```
backend-landing-xaydung/
├── src/
│   ├── auth/          # Authentication & admin management
│   ├── bookings/      # Booking/consultation requests
│   ├── categories/    # Product categories (3 levels)
│   ├── posts/         # News/blog posts
│   ├── products/      # Products management
│   ├── recruitments/  # Job postings & applications
│   ├── common/        # Shared utilities, filters
│   └── database/      # Database configuration
└── uploads/           # Static files (images, documents)
```

### Frontend Structure
```
frontend-landing-xaydung/
├── app/
│   ├── (landing)/     # Public pages
│   │   ├── about/
│   │   ├── cart/
│   │   ├── contact/
│   │   ├── news/
│   │   ├── products/
│   │   └── recruitments/
│   └── admin/         # Admin dashboard
├── components/
│   ├── landing/       # Public components
│   └── admin/         # Admin components
└── lib/               # Utilities, API clients
```

## 🖼️ Image Handling

### Upload Response Format
Backend upload API now returns **full URLs** for convenience:
```json
{
  "filename": "compressed-123456.jpg",
  "path": "/uploads/images/compressed-123456.jpg",  // Relative path
  "url": "http://localhost:3000/uploads/images/compressed-123456.jpg",  // Full URL
  "size": 123456,
  "mimetype": "image/jpeg"
}
```

### Admin Upload
- **Save `url` field** to database (full URL)
- Backend automatically includes domain
- No need to construct URLs in frontend

```tsx
// ✅ Admin upload - save full URL
const uploadResult = await uploadApi.uploadImage(file);
const imageUrl = uploadResult.url; // Full URL ready to use
```

### Frontend Display
- **Use `getImageUrl()` utility** for backward compatibility
- Handles both full URLs and relative paths
- Located in `lib/utils.ts`

```tsx
import { getImageUrl } from '@/lib/utils';

// ✅ Works with both formats
<img src={getImageUrl(product.thumbnail)} alt="..." />
```

### How getImageUrl() Works
```typescript
// Full URL → return as-is
getImageUrl('http://localhost:3000/uploads/image.jpg') 
// → 'http://localhost:3000/uploads/image.jpg'

// Relative path → prepend base URL
getImageUrl('/uploads/image.jpg') 
// → 'http://localhost:3000/uploads/image.jpg'

// Null/undefined → placeholder
getImageUrl(null) 
// → '/images/placeholder.jpg'
```

### Environment Variables
**Backend** (`.env`):
```env
BASE_URL=http://localhost:3000  # Used for generating full URLs
```

**Frontend** (`.env.local`):
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000  # Used by getImageUrl()
```

### Migration Notes
- **New uploads**: Automatically get full URLs
- **Old data**: Still works with `getImageUrl()` utility
- **No breaking changes**: Backward compatible

## 🗂️ Categories System

### Structure
- **3-Level Hierarchy**: Level 1 → Level 2 → Level 3
- **Schema**: Each category has `parentId` (null for level 1)
- **Display**: Dropdown menu shows all 3 levels with proper nesting

### Navigation
- All category links go to: `/products?category=${categoryId}`
- Filter products by category on products page

## 📦 Products

### Features
- Grid layout: 3 columns
- Pagination: 9 products per page
- Sidebar: Category tree (sticky, max-h-[500px], scrollable)
- Details: Description, specifications (HTML), promotion policy, brands

### Image Handling
- Thumbnail for cards
- Multiple images for product detail gallery
- All images use `getImageUrl()`

## 🛒 Cart System

### Storage
- **Location**: Browser localStorage
- **Key**: `cart`
- **Functions**: In `lib/cart.ts`

### Features
- Add to cart from product detail
- Update quantity
- Remove items
- Calculate totals
- Persist across sessions

## 📝 Content Management

### Posts (News/Blog)
- Rich text content (HTML)
- Featured image
- Categories & tags
- Published/draft status
- SEO-friendly slugs

### Recruitments
- Job details with rich text
- Application form with CV upload
- Deadline tracking
- Active/inactive status

## 🎯 Best Practices

### Code Style
- Use TypeScript for type safety
- Functional components with hooks
- Async/await for API calls
- Error handling with try/catch
- Loading states for better UX

### API Calls
- Use `api` client from `lib/api.ts`
- Handle loading states
- Show error messages to users
- Validate responses

### Performance
- Lazy load images
- Paginate large lists
- Debounce search inputs
- Optimize re-renders

### Accessibility
- Semantic HTML
- Alt text for images
- Keyboard navigation
- ARIA labels where needed
- Color contrast compliance

## 🔒 Security

### Authentication
- JWT-based auth for admin
- Session management
- Protected routes
- Secure password hashing (bcrypt)

### File Uploads
- Validate file types
- Limit file sizes
- Sanitize filenames
- Store in secure directory

### Input Validation
- Use DTOs with class-validator
- Sanitize user inputs
- Validate on both client and server
- Prevent XSS and injection attacks

## 🚀 Development Workflow

### Running the Project
```bash
# Backend (port 3000)
cd backend-landing-xaydung
npm run start:dev

# Frontend (port 3001)
cd frontend-landing-xaydung
npm run dev
```

### Environment Variables
- Backend: `.env` (database, JWT secret)
- Frontend: `.env.local` (API base URL)

### Testing
- Write tests for critical features
- Test API endpoints
- Test user flows
- Verify responsive design

## 📋 Common Tasks

### Adding a New Feature
1. Design the data model (schema)
2. Create backend API endpoints
3. Create frontend components
4. Connect with API calls
5. Add proper error handling
6. Test thoroughly

### Updating Styles
1. Check if color is in design system
2. Use Tailwind utility classes
3. Maintain consistency with existing pages
4. Test responsive behavior

### Fixing Bugs
1. Reproduce the issue
2. Check browser console for errors
3. Verify API responses
4. Check data flow
5. Test the fix thoroughly

## 🎨 UI Components

### Buttons
- Primary: `bg-primary-600 hover:bg-primary-700`
- Secondary: `bg-gray-100 hover:bg-gray-200`
- Rounded: `rounded-lg` or `rounded-xl`

### Cards
- White background: `bg-white`
- Shadow: `shadow-sm hover:shadow-xl`
- Rounded: `rounded-2xl`
- Border: `border border-gray-100` (optional)

### Forms
- Input: `border-2 border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100`
- Labels: `text-sm font-medium text-gray-700`
- Errors: `text-xs text-red-600`

### Animations
- Transitions: `transition-all duration-300`
- Hover effects: Scale, shadow, color changes
- Loading: Spin animation for spinners

## 📱 Responsive Design

### Breakpoints (Tailwind)
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

### Mobile-First Approach
- Design for mobile first
- Add responsive classes for larger screens
- Test on multiple devices
- Ensure touch-friendly interactions

## 🔄 State Management

### Local State
- Use `useState` for component state
- Use `useEffect` for side effects
- Keep state close to where it's used

### Global State
- Cart: localStorage + custom hooks
- Auth: Context API (admin)
- No Redux/Zustand needed for this project

## 📊 Data Fetching

### Patterns
- Fetch on mount with `useEffect`
- Show loading state
- Handle errors gracefully
- Cache when appropriate

### Pagination
- Always show pagination controls
- Track current page in state
- Update URL params (optional)
- Smooth scroll to top on page change

## 🎯 SEO Considerations

### Meta Tags
- Unique titles per page
- Descriptive meta descriptions
- Open Graph tags for social sharing
- Canonical URLs

### Content
- Semantic HTML structure
- Proper heading hierarchy (h1, h2, h3)
- Alt text for images
- Descriptive link text

### Performance
- Optimize images
- Minimize bundle size
- Server-side rendering (Next.js)
- Fast page loads

---

**Last Updated**: May 9, 2026
**Maintained By**: Development Team
