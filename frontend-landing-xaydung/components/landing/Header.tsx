'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Phone, Mail, ChevronDown, Search, ShoppingCart } from 'lucide-react';
import { api } from '@/lib/api';
import { getCartItemCount } from '@/lib/cart';

interface Category {
  _id: string;
  name: string;
  slug: string;
  parent?: string;
  children?: Category[];
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isNewsOpen, setIsNewsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [hoveredLevel2Item, setHoveredLevel2Item] = useState<string | null>(null);
  const [submenuPosition, setSubmenuPosition] = useState<{ top: number; left: number } | null>(null);
  const [level3SubmenuPosition, setLevel3SubmenuPosition] = useState<{ top: number; left: number } | null>(null);
  const [mounted, setMounted] = useState(false);
  const leaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const level2LeaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const menuLeaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const newsLeaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    setCartCount(getCartItemCount());
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    api.get('/categories/tree')
      .then(res => setCategories(res.data || []))
      .catch(err => console.error('Failed to fetch categories:', err));
  }, []);

  // Update cart count when cart changes
  useEffect(() => {
    const handleCartUpdate = () => {
      setCartCount(getCartItemCount());
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };

    if (isSearchOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  const handleItemHover = (categoryId: string, event: React.MouseEvent<HTMLAnchorElement>) => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
    if (menuLeaveTimeoutRef.current) {
      clearTimeout(menuLeaveTimeoutRef.current);
      menuLeaveTimeoutRef.current = null;
    }
    
    setHoveredItem(categoryId);
    const rect = event.currentTarget.getBoundingClientRect();
    setSubmenuPosition({
      top: rect.top,
      left: rect.right + 4,
    });
  };

  const handleItemLeave = () => {
    leaveTimeoutRef.current = setTimeout(() => {
      setHoveredItem(null);
      setSubmenuPosition(null);
      setHoveredLevel2Item(null);
      setLevel3SubmenuPosition(null);
    }, 200);
  };

  const handleLevel2ItemHover = (categoryId: string, event: React.MouseEvent<HTMLAnchorElement>) => {
    if (level2LeaveTimeoutRef.current) {
      clearTimeout(level2LeaveTimeoutRef.current);
      level2LeaveTimeoutRef.current = null;
    }
    if (menuLeaveTimeoutRef.current) {
      clearTimeout(menuLeaveTimeoutRef.current);
      menuLeaveTimeoutRef.current = null;
    }
    
    setHoveredLevel2Item(categoryId);
    const rect = event.currentTarget.getBoundingClientRect();
    setLevel3SubmenuPosition({
      top: rect.top,
      left: rect.right + 4,
    });
  };

  const handleLevel2ItemLeave = () => {
    level2LeaveTimeoutRef.current = setTimeout(() => {
      setHoveredLevel2Item(null);
      setLevel3SubmenuPosition(null);
    }, 200);
  };

  const handleLevel3SubmenuEnter = () => {
    if (level2LeaveTimeoutRef.current) {
      clearTimeout(level2LeaveTimeoutRef.current);
      level2LeaveTimeoutRef.current = null;
    }
    if (menuLeaveTimeoutRef.current) {
      clearTimeout(menuLeaveTimeoutRef.current);
      menuLeaveTimeoutRef.current = null;
    }
  };

  const handleSubmenuEnter = (categoryId: string) => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
    if (menuLeaveTimeoutRef.current) {
      clearTimeout(menuLeaveTimeoutRef.current);
      menuLeaveTimeoutRef.current = null;
    }
    if (level2LeaveTimeoutRef.current) {
      clearTimeout(level2LeaveTimeoutRef.current);
      level2LeaveTimeoutRef.current = null;
    }
    setHoveredItem(categoryId);
    setIsProductsOpen(true);
  };

  const handleMenuLeave = () => {
    menuLeaveTimeoutRef.current = setTimeout(() => {
      setIsProductsOpen(false);
      setHoveredItem(null);
      setSubmenuPosition(null);
      setHoveredLevel2Item(null);
      setLevel3SubmenuPosition(null);
    }, 200);
  };

  const renderCategoryMobile = (category: Category, level: number = 0) => {
    return (
      <div key={category._id}>
        <Link
          href={`/products?category=${category._id}`}
          onClick={() => setIsMenuOpen(false)}
          className={`block px-4 py-2 text-sm hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors uppercase ${
            level === 0 ? 'font-semibold text-gray-900' : 'text-gray-600'
          }`}
          style={{ paddingLeft: `${16 + level * 20}px` }}
        >
          {level > 0 && '• '}
          {category.name}
        </Link>
        {category.children && category.children.length > 0 && (
          <>
            {category.children.map(child => renderCategoryMobile(child, level + 1))}
          </>
        )}
      </div>
    );
  };

  const navigation = [
    { name: 'TRANG CHỦ', href: '/' },
    { name: 'GIỚI THIỆU', href: '/about' },
    { name: 'SẢN PHẨM', href: '/products', hasDropdown: true, dropdownType: 'products' },
    { name: 'TIN TỨC', href: '/news', hasDropdown: true, dropdownType: 'news' },
    { name: 'LIÊN HỆ', href: '/contact' },
  ];

  const newsSubmenu = [
    { name: 'TIN TỨC NỔI BẬT', href: '/news' },
    { name: 'TUYỂN DỤNG', href: '/recruitments' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname?.startsWith(href);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-lg' : 'bg-white/95 backdrop-blur-sm'}`}>
      <div className="bg-primary-600 text-white py-2">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <a href="tel:0912345678" className="flex items-center gap-2 hover:text-primary-100 transition-colors">
                <Phone className="w-4 h-4" />
                <span className="hidden sm:inline">0912 345 678</span>
              </a>
              <a href="mailto:contact@example.com" className="flex items-center gap-2 hover:text-primary-100 transition-colors">
                <Mail className="w-4 h-4" />
                <span className="hidden sm:inline">contact@example.com</span>
              </a>
            </div>
            <div className="flex items-center gap-3">
              <a href="#" className="hover:text-primary-100 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="hover:text-primary-100 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Vật liệu XD</h1>
              <p className="text-xs text-gray-500">Chất lượng - Uy tín</p>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navigation.map((item) => (
              item.hasDropdown ? (
                <div 
                  key={item.href} 
                  className="dropdown-menu" 
                  onMouseEnter={() => {
                    if (menuLeaveTimeoutRef.current) {
                      clearTimeout(menuLeaveTimeoutRef.current);
                      menuLeaveTimeoutRef.current = null;
                    }
                    if (newsLeaveTimeoutRef.current) {
                      clearTimeout(newsLeaveTimeoutRef.current);
                      newsLeaveTimeoutRef.current = null;
                    }
                    if (item.dropdownType === 'products') {
                      setIsProductsOpen(true);
                      setIsNewsOpen(false);
                    } else if (item.dropdownType === 'news') {
                      setIsNewsOpen(true);
                      setIsProductsOpen(false);
                    }
                  }} 
                  onMouseLeave={() => {
                    if (item.dropdownType === 'products') {
                      handleMenuLeave();
                    } else if (item.dropdownType === 'news') {
                      newsLeaveTimeoutRef.current = setTimeout(() => {
                        setIsNewsOpen(false);
                      }, 200);
                    }
                  }}
                >
                  <Link href={item.href} className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-bold transition-colors ${isActive(item.href) ? 'text-primary-600 bg-primary-50' : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'}`}>
                    {item.name}
                    <ChevronDown className={`w-4 h-4 transition-transform ${(item.dropdownType === 'products' && isProductsOpen) || (item.dropdownType === 'news' && isNewsOpen) ? 'rotate-180' : ''}`} />
                  </Link>

                  {/* Products Dropdown */}
                  {item.dropdownType === 'products' && isProductsOpen && categories.length > 0 && (
                    <div className="dropdown-content max-h-[500px] overflow-y-auto scrollbar-hide">
                      {categories.map((category, idx) => (
                        <div key={category._id} className={`dropdown-item ${idx > 0 ? 'mt-1' : ''}`}>
                          <Link 
                            href={`/products?category=${category._id}`} 
                            className="dropdown-link"
                            onMouseEnter={(e) => category.children && category.children.length > 0 && handleItemHover(category._id, e)}
                            onMouseLeave={handleItemLeave}
                          >
                            <span className="uppercase font-semibold">{category.name}</span>
                            {category.children && category.children.length > 0 && <ChevronDown className="w-4 h-4 -rotate-90" />}
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* News Dropdown */}
                  {item.dropdownType === 'news' && isNewsOpen && (
                    <div className="dropdown-content">
                      {newsSubmenu.map((newsItem) => (
                        <div key={newsItem.href} className="dropdown-item">
                          <Link 
                            href={newsItem.href} 
                            className="dropdown-link"
                          >
                            <span className="uppercase font-semibold">{newsItem.name}</span>
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link key={item.href} href={item.href} className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${isActive(item.href) ? 'text-primary-600 bg-primary-50' : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'}`}>
                  {item.name}
                </Link>
              )
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <div className="relative" ref={searchRef}>
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 rounded-lg text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Search Dropdown */}
              {isSearchOpen && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 p-4 z-50">
                  <form onSubmit={handleSearch}>
                    <div className="relative">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Tìm kiếm sản phẩm..."
                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        autoFocus
                      />
                      <button
                        type="submit"
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                      >
                        <Search className="w-4 h-4" />
                      </button>
                    </div>
                  </form>
                  <div className="mt-3 text-xs text-gray-500">
                    Nhấn Enter hoặc click icon để tìm kiếm
                  </div>
                </div>
              )}
            </div>

            <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/30 hover:shadow-xl uppercase text-sm whitespace-nowrap">
              <Phone className="w-4 h-4" />
              <span>Liên hệ ngay</span>
            </Link>
          </div>

          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Submenu cấp 2 */}
      {mounted && hoveredItem && submenuPosition && (() => {
        const category = categories.find(c => c._id === hoveredItem);
        
        return createPortal(
          <div 
            style={{
              position: 'fixed',
              top: `${submenuPosition.top}px`,
              left: `${submenuPosition.left}px`,
              minWidth: '16rem',
              maxHeight: '500px',
              overflowY: 'auto',
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
              border: '1px solid #e5e7eb',
              padding: '8px 0',
              zIndex: 9999,
            }}
            className="scrollbar-hide"
            onMouseEnter={() => handleSubmenuEnter(hoveredItem)}
            onMouseLeave={() => {
              handleMenuLeave();
              handleLevel2ItemLeave();
            }}
          >
            {category?.children?.map((child, idx) => (
              <div key={child._id} style={{ marginTop: idx > 0 ? '4px' : '0' }}>
                <Link 
                  href={`/products?category=${child._id}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 16px',
                    fontSize: '14px',
                    color: '#374151',
                    textTransform: 'uppercase',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#e8f1fb';
                    e.currentTarget.style.color = '#173e72';
                    if (child.children && child.children.length > 0) {
                      handleLevel2ItemHover(child._id, e);
                    } else {
                      // Nếu không có children, đóng submenu cấp 3
                      setHoveredLevel2Item(null);
                      setLevel3SubmenuPosition(null);
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#374151';
                    // Chỉ trigger leave nếu không có children hoặc không hover vào submenu cấp 3
                    if (!child.children || child.children.length === 0) {
                      handleLevel2ItemLeave();
                    }
                  }}
                >
                  <span>• {child.name}</span>
                  {child.children && child.children.length > 0 && (
                    <ChevronDown style={{ width: '16px', height: '16px', transform: 'rotate(-90deg)' }} />
                  )}
                </Link>
              </div>
            ))}
          </div>,
          document.body
        );
      })()}

      {/* Submenu cấp 3 */}
      {mounted && hoveredLevel2Item && level3SubmenuPosition && (() => {
        const parentCategory = categories.find(c => c._id === hoveredItem);
        const level2Category = parentCategory?.children?.find(c => c._id === hoveredLevel2Item);
        
        return createPortal(
          <div 
            style={{
              position: 'fixed',
              top: `${level3SubmenuPosition.top}px`,
              left: `${level3SubmenuPosition.left}px`,
              minWidth: '16rem',
              maxHeight: '500px',
              overflowY: 'auto',
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
              border: '1px solid #e5e7eb',
              padding: '8px 0',
              zIndex: 10000,
            }}
            className="scrollbar-hide"
            onMouseEnter={handleLevel3SubmenuEnter}
            onMouseLeave={() => {
              handleLevel2ItemLeave();
              handleMenuLeave();
            }}
          >
            {level2Category?.children?.map((grandchild, idx) => (
              <div key={grandchild._id} style={{ marginTop: idx > 0 ? '4px' : '0' }}>
                <Link 
                  href={`/products?category=${grandchild._id}`}
                  style={{
                    display: 'block',
                    padding: '8px 16px',
                    fontSize: '13px',
                    color: '#374151',
                    textTransform: 'uppercase',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#e8f1fb';
                    e.currentTarget.style.color = '#173e72';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#374151';
                  }}
                >
                  └ {grandchild.name}
                </Link>
              </div>
            ))}
          </div>,
          document.body
        );
      })()}

      {isMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white">
          <nav className="max-w-7xl mx-auto px-4 py-4 space-y-1">
            {navigation.map((item) => (
              <div key={item.href}>
                <Link href={item.href} onClick={() => !item.hasDropdown && setIsMenuOpen(false)} className={`block px-4 py-3 rounded-lg text-sm font-bold transition-colors ${isActive(item.href) ? 'text-primary-600 bg-primary-50' : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'}`}>
                  {item.name}
                </Link>
                {item.hasDropdown && item.dropdownType === 'products' && categories.length > 0 && (
                  <div className="ml-4 mt-1 space-y-1">
                    {categories.map((category) => renderCategoryMobile(category))}
                  </div>
                )}
                {item.hasDropdown && item.dropdownType === 'news' && (
                  <div className="ml-4 mt-1 space-y-1">
                    {newsSubmenu.map((newsItem) => (
                      <Link
                        key={newsItem.href}
                        href={newsItem.href}
                        onClick={() => setIsMenuOpen(false)}
                        className="block px-4 py-2 text-sm font-semibold text-gray-900 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors uppercase"
                      >
                        {newsItem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <Link href="/contact" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-center gap-2 px-4 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-all mt-4 uppercase text-sm">
              <Phone className="w-4 h-4" />
              <span>Liên hệ ngay</span>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
