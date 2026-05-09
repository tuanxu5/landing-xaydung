/**
 * Generate URL-friendly slug from Vietnamese text
 * @param text - Input text to convert to slug
 * @returns URL-friendly slug
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD') // Normalize to decomposed form
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/đ/g, 'd') // Replace đ with d
    .replace(/Đ/g, 'd') // Replace Đ with d
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
    .trim();
}

/**
 * Format number as Vietnamese currency
 * @param amount - Amount to format
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
}

/**
 * Format date to Vietnamese format
 * @param date - Date to format
 * @returns Formatted date string
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

/**
 * Format datetime to Vietnamese format
 * @param date - Date to format
 * @returns Formatted datetime string
 */
export function formatDateTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Get full image URL by adding backend domain if needed
 * @param imagePath - Image path (can be relative or absolute URL)
 * @returns Full image URL with backend domain
 */
export function getImageUrl(imagePath?: string | null): string {
  if (!imagePath) {
    return '/images/placeholder.jpg'; // Default placeholder
  }

  // If already a full URL (starts with http:// or https://), return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // If it's a relative path, add backend domain
  const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
  
  // Remove leading slash if exists to avoid double slashes
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  
  return `${backendUrl}${cleanPath}`;
}
