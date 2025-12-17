// src/app/layout.js
import './globals.css';
import './app.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Prompt } from 'next/font/google';

const prompt = Prompt({
  weight: ['300', '400', '500', '700'],
  subsets: ['thai', 'latin'],
  display: 'swap',
});

import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import CookieConsent from '@/components/CookieConsent';
import { CartProvider } from '@/components/CartContext';
import GoogleAdsTag from '@/components/GoogleAdsTag';

// ตั้งค่า URL หลัก
const rawSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://www.pgmobilev9.com';
const siteUrl = rawSiteUrl.startsWith('http')
  ? rawSiteUrl
  : `https://${rawSiteUrl}`;

// รูปสำหรับ OG / Logo
const ogImage = `${siteUrl}/images/table-thumbnail.jpg`;
const logoImage = `${siteUrl}/images/logo.png`;

// ข้อมูลติดต่อ
const contactPhone = process.env.NEXT_PUBLIC_CONTACT_PHONE || '';
const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || '';

// แบรนด์ / นิติบุคคล
const brandName = 'pg mobile';
const companyLegal =
  process.env.NEXT_PUBLIC_COMPANY_LEGAL ||
  'PG MOBILE LIMITED PARTNERSHIP';

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'pg mobile | แหล่งรวมมือถือคุณภาพ ประกันศูนย์ไทย',
    template: '%s | pg mobile'
  },
  applicationName: 'pg mobile',
  description:
    'pg mobile ศูนย์รวมมือถือ PG V9 และสมาร์ทโฟนราคาคุ้มค่า ประกันศูนย์ไทยแท้ 100% ส่งฟรีทั่วประเทศ เก็บเงินปลายทางได้ สินค้าคุณภาพเชื่อถือได้',
  keywords: [
    'pg mobile',
    'pg mobile v9',
    'pg v9',
    'pg',
    'โทรศัพท์มือถือ',
    'สมาร์ทโฟนราคาถูก',
    'มือถือประกันศูนย์'
  ],
  alternates: {
    canonical: siteUrl
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/images/logo.png'
  },
  openGraph: {
    title: 'pg mobile | มือถือคุณภาพ ราคาคุ้มค่า',
    description:
      'เลือกซื้อโทรศัพท์มือถือ PG Mobile V9 ประกันศูนย์ไทย ส่งฟรี เก็บเงินปลายทาง',
    url: siteUrl,
    siteName: 'pg mobile',
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: 'สินค้าแนะนำจาก pg mobile'
      }
    ],
    locale: 'th_TH',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'pg mobile',
    description: 'ศูนย์รวมมือถือ PG Mobile V9 ราคาคุ้มค่า',
    images: [ogImage]
  },
  robots: {
    index: true,
    follow: true,
    maxImagePreview: 'large',
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  }
};

export default function RootLayout({ children }) {
  // WebSite + Sitelinks Search Box
  const ldJsonWebsite = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteUrl}#website`,
    name: brandName,
    alternateName: ['PG Mobile V9', 'PG Mobile Official', 'pgmobile'],
    url: siteUrl,
    inLanguage: 'th-TH',
    publisher: {
      '@id': `${siteUrl}#organization`
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/search?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  };

  // Organization
  const ldJsonOrganization = {
    '@context': 'https://schema.org',
    '@type': 'MobilePhoneStore',
    '@id': `${siteUrl}#organization`,
    name: brandName,
    legalName: companyLegal,
    url: siteUrl,
    logo: {
      '@type': 'ImageObject',
      url: logoImage,
      width: 112,
      height: 112
    },
    contactPoint: [
      ...(contactPhone
        ? [
          {
            '@type': 'ContactPoint',
            telephone: contactPhone,
            contactType: 'customer service',
            areaServed: 'TH',
            availableLanguage: 'Thai'
          }
        ]
        : []),
      ...(contactEmail
        ? [
          {
            '@type': 'ContactPoint',
            email: contactEmail,
            contactType: 'customer service'
          }
        ]
        : [])
    ],
    sameAs: [
      // ใส่ลิงก์ Facebook / Line OA ถ้ามี
      // 'https://www.facebook.com/pgmobile',
    ]
  };

  // Breadcrumb โครงเว็บหลัก
  const ldJsonBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'หน้าหลัก',
        item: siteUrl
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'สินค้า',
        item: `${siteUrl}/products`
      }
    ]
  };

  // WebPage สำหรับหน้าแรก
  const ldJsonWebPage = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${siteUrl}#webpage`,
    url: siteUrl,
    name: 'pg mobile | แหล่งรวมมือถือคุณภาพ ประกันศูนย์ไทย',
    inLanguage: 'th-TH',
    isPartOf: {
      '@id': `${siteUrl}#website`
    },
    about: {
      '@id': `${siteUrl}#organization`
    }
  };

  return (
    <html lang="th" className={prompt.className}>
      <head>
        <link
          rel="shortcut icon"
          href="/favicon.ico"
          type="image/x-icon"
        />

        <!-- TikTok Pixel Code Start -->
        <script>
        !function (w, d, t) {
          w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(
        var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script")
        ;n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};
        
        
          ttq.load('D4VG0AJC77U41IUN5AJG');
          ttq.page();
        }(window, document, 'ttq');
        </script>
        <!-- TikTok Pixel Code End -->
            

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(ldJsonWebsite)
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(ldJsonOrganization)
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(ldJsonBreadcrumb)
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(ldJsonWebPage)
          }}
        />
      </head>
      <body>
        <CartProvider>
          <GoogleAdsTag />
          <NavBar />
          {children}
          <Footer />
          <CookieConsent />
        </CartProvider>
      </body>
    </html>
  );
}
