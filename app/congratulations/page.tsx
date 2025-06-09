"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Congratulations() {
  useEffect(() => {
    // Adiciona o script do Google Translate
    const addScript = () => {
      if (document.getElementById("google-translate-script")) return
      const script = document.createElement("script")
      script.id = "google-translate-script"
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
      document.body.appendChild(script)
    }

    // Função global exigida pelo Google Translate
    window.googleTranslateElementInit = function () {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "pt",
          includedLanguages: "en,es,fr,nl,de,it,pt",
          autoDisplay: true,
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
        },
        "google-translate-ball"
      )
    }

    addScript()
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-4">
      {/* Círculo de tradução customizado */}
      <div className="absolute top-6 right-6 z-[1000]">
        <div id="google-translate-ball" className="google-translate-ball flex items-center justify-center">
          {/* Google SVG */}
         
        </div>
      </div>
      
      <div className="bg-white/10 rounded-xl shadow-xl p-12 flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-4 text-center">Obrigado pela sua compra!</h1>
        <p className="text-lg text-center mb-8">
          Seu pedido foi recebido com sucesso. Em breve entraremos em contato para iniciar a criação do seu logo!
        </p>
        <Link href="/">
          <Button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 text-lg rounded-lg shadow hover:scale-105 transition">
            Voltar para a Home
          </Button>
        </Link>
      </div>
    </div>
  )
}
