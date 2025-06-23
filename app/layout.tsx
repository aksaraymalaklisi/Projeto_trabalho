import type { Metadata } from 'next'
import './globals.css'
import { TranslationProvider } from '../contexts/TranslationContext'
import React from 'react'

export const metadata: Metadata = {
  title: 'IA Digital - Transforme Sua Presença Digital',
  description: 'Criação de logotipos, websites e estratégias de marketing digital personalizadas com inteligência artificial',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt">
      <head>
        {/* Meta Pixel Code */}
        <script dangerouslySetInnerHTML={{ __html: `!function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '30650563904534684');
        fbq('track', 'PageView');` }} />
        {/* End Meta Pixel Code */}
      </head>
      <body>
        {/* Meta Pixel Code para quem não tem JS */}
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=30650563904534684&ev=PageView&noscript=1"
          />
        </noscript>
        <TranslationProvider>
          {children}
        </TranslationProvider>
      </body>
    </html>
  )
}
