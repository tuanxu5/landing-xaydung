---
inclusion: auto
---

# AI Agent Guidelines for This Project

## 🤖 Working with This Codebase

### Quick Context
- **Project**: Landing page for construction materials company (Vật liệu xây dựng)
- **Stack**: NestJS (backend) + Next.js 14 (frontend)
- **Language**: Vietnamese UI, English code
- **Status**: Active development

### Key Files to Reference
- `RULES.md` - Project rules and conventions
- `frontend-landing-xaydung/IMAGE_URL_UPDATE_COMPLETE.md` - Image handling guide
- `backend-landing-xaydung/README.md` - Backend setup
- `frontend-landing-xaydung/app/globals.css` - Design tokens

## 📝 Communication Style

### With User
- User speaks Vietnamese
- Keep responses concise and direct
- Ask for clarification when needed
- Confirm before making destructive changes

### Code Comments
- Write in English
- Be concise but clear
- Explain "why" not "what"
- Document complex logic

## 🎯 Task Approach

### Before Starting
1. **Read relevant files** - Don't guess, check the actual code
2. **Check RULES.md** - Follow established patterns
3. **Understand context** - Review related components
4. **Plan approach** - Think before coding

### During Implementation
1. **Follow existing patterns** - Match the project's style
2. **Use existing utilities** - Don't reinvent (e.g., `getImageUrl()`)
3. **Test as you go** - Verify changes work
4. **Handle errors** - Add proper error handling

### After Completion
1. **Verify no errors** - Check TypeScript diagnostics
2. **Test the feature** - Ensure it works end-to-end
3. **Update docs** - If you added something significant
4. **Summarize changes** - Brief summary for user

## 🔍 Common Scenarios

### Adding a New Page

```typescript
// 1. Create the page file
// app/(landing)/new-page/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { getImageUrl } from '@/lib/utils';

export default function NewPage() {
  // Follow existing patterns from similar pages
  // Use max-w-7xl mx-auto for container
  // Use primary color #173e72
  // Handle loading and error states
}
```

### Adding a New API Endpoint

```typescript
// 1. Create/update controller
// backend-landing-xaydung/src/module/module.controller.ts

@Get()
async findAll(@Query() query: QueryDto) {
  // Use existing patterns
  // Add proper validation
  // Return consistent response format
}
```

### Updating Styles

```tsx
// ✅ DO: Use Tailwind + existing patterns
<div className="max-w-7xl mx-auto px-4">
  <button className="bg-primary-600 hover:bg-primary-700 text-white rounded-xl">
    Click me
  </button>
</div>

// ❌ DON'T: Add custom CSS unless absolutely necessary
```

### Working with Images

```tsx
// ✅ ALWAYS use getImageUrl for backend images
import { getImageUrl } from '@/lib/utils';

<img src={getImageUrl(product.thumbnail)} alt={product.name} />

// ❌ NEVER hardcode backend URL
<img src={`http://localhost:3000${product.thumbnail}`} alt="..." />
```

## 🚨 Important Reminders

### Must-Do's
- ✅ Use `getImageUrl()` for ALL backend images
- ✅ Use `max-w-7xl mx-auto` for page containers
- ✅ Use primary color `#173e72` for brand elements
- ✅ Handle loading and error states
- ✅ Add TypeScript types
- ✅ Test responsive design
- ✅ Follow existing file structure

### Must-Not's
- ❌ Don't change the primary color
- ❌ Don't use `container mx-auto` (use `max-w-7xl mx-auto`)
- ❌ Don't hardcode backend URLs
- ❌ Don't skip error handling
- ❌ Don't ignore TypeScript errors
- ❌ Don't break existing features
- ❌ Don't add unnecessary dependencies

## 🔧 Debugging Approach

### Frontend Issues
1. Check browser console for errors
2. Verify API responses in Network tab
3. Check component state with React DevTools
4. Verify image URLs are correct
5. Test in different browsers

### Backend Issues
1. Check server logs
2. Verify database connection
3. Test API endpoints with Postman/Thunder Client
4. Check request/response format
5. Verify authentication/authorization

### Common Issues & Solutions

**Images not loading?**
- Check if `getImageUrl()` is used
- Verify backend is running on port 3000
- Check image path in database

**API call failing?**
- Verify backend is running
- Check API endpoint URL
- Verify request format
- Check CORS settings

**Styling looks wrong?**
- Check if Tailwind classes are correct
- Verify responsive breakpoints
- Check for conflicting styles
- Clear browser cache

## 📚 Learning from Existing Code

### Good Examples to Follow

**Product Card Component**
- `components/landing/ProductCard.tsx`
- Clean, reusable, properly typed
- Uses getImageUrl correctly

**Products Page**
- `app/(landing)/products/page.tsx`
- Good layout structure
- Proper pagination
- Category sidebar implementation

**API Client**
- `lib/api.ts`
- Centralized API calls
- Proper error handling
- Interceptors for auth

## 🎨 Design Patterns

### Component Structure
```tsx
'use client'; // If using hooks

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { getImageUrl } from '@/lib/utils';

interface Props {
  // Define props
}

export default function ComponentName({ props }: Props) {
  // 1. State declarations
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // 2. Effects
  useEffect(() => {
    fetchData();
  }, []);

  // 3. Functions
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/endpoint');
      setData(response.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // 4. Render logic
  if (loading) return <LoadingState />;

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Component content */}
    </div>
  );
}
```

### API Endpoint Structure
```typescript
@Controller('resource')
export class ResourceController {
  constructor(private readonly service: ResourceService) {}

  @Get()
  async findAll(@Query() query: QueryDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() dto: CreateDto) {
    return this.service.create(dto);
  }
}
```

## 🎯 Efficiency Tips

### Save Time
- Reference existing similar components
- Copy-paste and modify rather than write from scratch
- Use existing utilities and helpers
- Follow established patterns

### Avoid Rework
- Read RULES.md before starting
- Check existing implementation
- Verify requirements with user
- Test incrementally

### Token Efficiency
- Reference RULES.md and AGENTS.md instead of repeating
- Use file search to find examples
- Read only relevant sections of files
- Summarize changes concisely

## 📋 Checklist for Common Tasks

### Adding a Feature
- [ ] Understand requirements
- [ ] Check existing similar features
- [ ] Plan the implementation
- [ ] Create backend API (if needed)
- [ ] Create frontend components
- [ ] Add proper types
- [ ] Handle loading/error states
- [ ] Use getImageUrl for images
- [ ] Test functionality
- [ ] Check TypeScript errors
- [ ] Verify responsive design
- [ ] Update documentation (if significant)

### Fixing a Bug
- [ ] Reproduce the issue
- [ ] Identify root cause
- [ ] Check related code
- [ ] Implement fix
- [ ] Test the fix
- [ ] Verify no side effects
- [ ] Check TypeScript errors

### Updating Styles
- [ ] Check design system (RULES.md)
- [ ] Use Tailwind utilities
- [ ] Maintain consistency
- [ ] Test responsive behavior
- [ ] Verify accessibility
- [ ] Check all breakpoints

## 🌟 Best Practices Summary

1. **Read before writing** - Check existing code first
2. **Follow patterns** - Match the project's style
3. **Use utilities** - Don't reinvent the wheel
4. **Type everything** - TypeScript is your friend
5. **Handle errors** - Always expect things to fail
6. **Test thoroughly** - Don't assume it works
7. **Be consistent** - Follow established conventions
8. **Document when needed** - Help future developers
9. **Ask when unsure** - Better to clarify than guess
10. **Keep it simple** - Don't over-engineer

---

**Remember**: This project has established patterns and conventions. Your job is to follow them and maintain consistency, not to introduce new patterns unless specifically requested.

**Last Updated**: May 9, 2026
