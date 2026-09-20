const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('adminToken');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const handleResponse = async (res) => {
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error.message || 'Request failed');
  }
  return res.json();
};

export const cmsService = {
  // Fetch all CMS content
  async getContent() {
    const res = await fetch(`${API_BASE}/cms`, { headers: getAuthHeaders() });
    return handleResponse(res);
  },

  // Save full CMS content object
  async saveContent(data) {
    const res = await fetch(`${API_BASE}/cms`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  // Save a specific section
  async saveSection(section, data) {
    const res = await fetch(`${API_BASE}/cms/${section}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  // Reset content to defaults
  async resetContent() {
    const res = await fetch(`${API_BASE}/cms/reset`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },
};

// Default content structure used as fallback / initial state
export const DEFAULT_CMS_CONTENT = {
  hero: {
    headline: 'Fine Dining, Timeless Moments',
    subheadline: 'Experience the art of Indian cuisine in an ambiance crafted for celebration.',
    ctaText: 'Reserve a Table',
    ctaLink: '/reservations',
    backgroundImage: '',
    overlayOpacity: 0.5,
  },
  about: {
    title: 'Our Story',
    body: 'Hotel Yashdeep has been a cornerstone of hospitality since its founding. We blend traditional Indian warmth with modern elegance to create unforgettable dining experiences.',
    image: '',
    highlights: ['Est. 2005', 'Award-Winning Cuisine', '500+ Events Hosted'],
  },
  contact: {
    phone: '+91 98765 43210',
    email: 'reservations@hotelyashdeep.com',
    address: {
      line1: '12, Heritage Road',
      line2: 'Virar West',
      city: 'Virar',
      state: 'Maharashtra',
      pincode: '401303',
    },
  },
  openingHours: [
    { day: 'Monday – Friday', lunch: '12:00 PM – 3:30 PM', dinner: '7:00 PM – 11:00 PM' },
    { day: 'Saturday', lunch: '12:00 PM – 4:00 PM', dinner: '7:00 PM – 11:30 PM' },
    { day: 'Sunday', lunch: '12:00 PM – 4:30 PM', dinner: '7:00 PM – 11:00 PM' },
  ],
  socialLinks: {
    instagram: '',
    facebook: '',
    twitter: '',
    youtube: '',
    whatsapp: '',
  },
  seo: {
    title: 'Hotel Yashdeep – Fine Dining & Events',
    description: 'Experience exquisite Indian cuisine and impeccable hospitality at Hotel Yashdeep, Virar.',
    keywords: 'hotel yashdeep, fine dining virar, indian restaurant, events virar',
    ogImage: '',
  },
  footer: {
    tagline: 'Crafted with love, served with pride.',
    copyrightName: 'Hotel Yashdeep',
    showSocialLinks: true,
    showOpeningHours: true,
    quickLinks: [
      { label: 'Menu', href: '/menu' },
      { label: 'Reservations', href: '/reservations' },
      { label: 'Gallery', href: '/gallery' },
      { label: 'Contact', href: '/contact' },
    ],
  },
};