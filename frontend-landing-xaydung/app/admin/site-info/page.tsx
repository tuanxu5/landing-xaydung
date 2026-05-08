'use client';

import { useState } from 'react';
import { Users, Award, HelpCircle, Star, Phone } from 'lucide-react';
import ContactInfoTab from '@/components/admin/site-info/ContactInfoTab';
import TeamMembersTab from '@/components/admin/site-info/TeamMembersTab';
import CertificatesTab from '@/components/admin/site-info/CertificatesTab';
import FAQsTab from '@/components/admin/site-info/FAQsTab';
import BrandsTab from '@/components/admin/site-info/BrandsTab';

type TabType = 'contact' | 'team' | 'certificates' | 'faqs' | 'brands';

export default function SiteInfoPage() {
  const [activeTab, setActiveTab] = useState<TabType>('contact');

  const tabs = [
    { id: 'contact' as TabType, name: 'Thông tin liên hệ', icon: Phone },
    { id: 'team' as TabType, name: 'Đội ngũ', icon: Users },
    { id: 'certificates' as TabType, name: 'Giải thưởng & Chứng chỉ', icon: Award },
    { id: 'faqs' as TabType, name: 'Câu hỏi thường gặp', icon: HelpCircle },
    { id: 'brands' as TabType, name: 'Thương hiệu nổi bật', icon: Star },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý thông tin</h1>
        <p className="text-gray-600">Quản lý thông tin bổ sung cho website</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'contact' && <ContactInfoTab />}
          {activeTab === 'team' && <TeamMembersTab />}
          {activeTab === 'certificates' && <CertificatesTab />}
          {activeTab === 'faqs' && <FAQsTab />}
          {activeTab === 'brands' && <BrandsTab />}
        </div>
      </div>
    </div>
  );
}
