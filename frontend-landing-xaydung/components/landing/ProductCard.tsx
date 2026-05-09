import Link from 'next/link';
import { Package, Phone } from 'lucide-react';
import { getImageUrl } from '@/lib/utils';

interface ProductCardProps {
  _id: string;
  name: string;
  slug: string;
  thumbnail?: string;
  category?: {
    name: string;
  } | string;
  price?: number;
}

export default function ProductCard({ _id, name, slug, thumbnail, category }: ProductCardProps) {
  const categoryName = typeof category === 'object' ? category?.name : category;

  return (
    <Link
      href={`/products/${slug}`}
      className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all overflow-hidden border border-gray-100"
    >
      {/* Product Image */}
      <div className="aspect-square bg-gray-100 overflow-hidden relative">
        {thumbnail ? (
          <img
            src={getImageUrl(thumbnail)}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
            <Package className="w-20 h-20 text-primary-400" />
          </div>
        )}
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
      </div>

      {/* Product Info */}
      <div className="p-5">
        {/* Category */}
        {categoryName && (
          <div className="text-xs font-semibold text-primary-600 mb-2 uppercase tracking-wide">
            {categoryName}
          </div>
        )}

        {/* Product Name */}
        <h3 className="text-base font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors min-h-[3rem]">
          {name}
        </h3>

        {/* Price & CTA */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2 text-primary-600 font-bold">
            <Phone className="w-4 h-4" />
            <span className="text-sm">Liên hệ</span>
          </div>
          <div className="text-sm font-semibold text-gray-500 group-hover:text-primary-600 transition-colors">
            Xem chi tiết →
          </div>
        </div>
      </div>
    </Link>
  );
}
