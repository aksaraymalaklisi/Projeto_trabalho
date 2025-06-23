"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Congratulations() {
  useEffect(() => {
    // Código do Pixel Meta/Facebook
    if (!document.getElementById("meta-pixel-script")) {
      const script = document.createElement("script");
      script.id = "meta-pixel-script";
      script.innerHTML = `!function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '30650563904534684');
      fbq('track', 'PageView');`;
      document.head.appendChild(script);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-4">
      {/* Pixel Meta/Facebook para quem não tem JS */}
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src="https://www.facebook.com/tr?id=30650563904534684&ev=PageView&noscript=1"
        />
      </noscript>
      <div className="bg-white/10 rounded-xl shadow-xl p-12 flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-4 text-center">Obrigado pela sua compra!</h1>
        <p className="text-lg text-center mb-8">
          Seu pedido foi recebido com sucesso. Em breve entraremos em contato para iniciar a criação do seu logo!
        </p>
        <Link href="/">
          <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 text-lg rounded-lg shadow hover:scale-105 transition">
            Voltar para a Home
          </button>
        </Link>
      </div>
    </div>
  );
}
