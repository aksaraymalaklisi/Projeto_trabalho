"use client"

import React from "react"
import { handleStripeCheckout } from "@/lib/handleStripePayment";
import { useState, useEffect } from "react"
import LanguageSelector from "@/components/LanguageSelector";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useTranslation } from "../contexts/TranslationContext"
import {
  Star,
  Users,
  Clock,
  Shield,
  CheckCircle,
  Zap,
  Award,
  Palette,
  MessageCircle,
  Instagram,
  Facebook,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Target,
  Rocket,
  Heart,
} from "lucide-react"
import { LogoGallery } from "@/components/logo-gallery"
import PayPalButton from "@/components/PayPalButton";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";


const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const packages = [
  {
    name: "IA START",
    price: "€34,99",
    originalPrice: "€49,99",
    description: "LOGO POR IA, JPG E PNG ALTA RESOLUÇÃO (MARCA D\'ÁGUA EM PNG)",
    features: [
      "Logo gerado por IA com personalização baseada nas suas preferências",
      "Arquivo em JPG de alta resolução, ideal para redes sociais, apresentações e uso digital em geral",
      "Arquivo em PNG com fundo transparente, pronto para aplicar em qualquer fundo ou arte",
      "Marca d\'água em PNG, ideal para proteger sua criação ao divulgar ou enviar para aprovação",
      "Entrega rápida, direto no seu e-mail ou WhatsApp",
    ],
    stripeUrl: "https://buy.stripe.com/fZu7sMg1NasV8Y11rZ9Zm00",
    popular: false,
    color: "from-blue-500 to-cyan-500",
    icon: "🧠",
    recommendation: "Indicado para quem precisa de um logo rápido, com boa qualidade, pronto para começar a divulgar.",
  },
  {
    name: "DESIGN SMART",
    price: "€49,99",
    originalPrice: "€69,99",
    description: "JPG+PNG+PDF (IMPRESSÕES, MARCA D\'ÁGUA, ADESIVO)",
    features: [
      "JPG e PNG de alta resolução",
      "PDF profissional, ideal para impressão de cartões, etiquetas, banners e adesivos",
      "Marca d\'água e versão para adesivo, com o logo centralizado e pronto para produção gráfica",
    ],
    stripeUrl: "https://buy.stripe.com/6oU14oaHtgRjfmp8Ur9Zm01",
    popular: false,
    color: "from-purple-500 to-pink-500",
    icon: "🎨",
    recommendation:
      "Ótimo para quem quer começar a imprimir o logo em brindes, papelaria e divulgar em diversos canais.",
  },
  {
    name: "PRO BRAND",
    price: "€79,99",
    originalPrice: "€97,99",
    description:
      "JPG+PNG+PDF (IMPRESSÕES, MARCA D\'ÁGUA, ADESIVO, DOCUMENTOS) + PALETA DE CORES E TIPOGRAFIA + IDENTIDADE VISUAL",
    features: [
      "JPG, PNG e PDF (impressão, adesivo, documentos)",
      "Paleta de cores personalizada, com códigos exatos para manter sua marca sempre igual",
      "Tipografia recomendada, combinando com seu logo (para usar em posts, textos e artes)",
      "Identidade visual pronta, com cores, fonte e estilo coesos para aplicar no Instagram, embalagens e materiais promocionais",
    ],
    stripeUrl: "https://buy.stripe.com/28EaEYeXJgRjdeh6Mj9Zm02",
    popular: true,
    color: "from-orange-500 to-red-500",
    icon: "🚀",
    recommendation: "Ideal para marcas que querem consistência e impacto visual desde o início.",
  },
  {
    name: "PREMIUM FULL",
    price: "€109,99",
    originalPrice: "€149,99",
    description:
      "JPG+PNG+PDF (IMPRESSÕES, MARCA D\'ÁGUA, ADESIVO, DOCUMENTOS) PSD ARQUIVO EDITÁVEL DO LOGO + IDENTIDADE VISUAL + MANUAL COMPLETO + TIPOGRAFIA + MOCKUPS",
    features: [
      "JPG, PNG e PDF (para impressão, adesivo, papelaria, documentos)",
      "PSD editável do seu logotipo (arquivo original para edições no Photoshop)",
      "Identidade visual completa, com cores, fontes e estilo definidos para uso consistente",
      "Manual da marca completo, com orientações de aplicação, tamanho mínimo, área de respiro e uso correto",
      "Tipografia profissional personalizada, para reforçar sua marca em postagens e materiais",
      "Mockups aplicados, com o logo pronto em camiseta, fachada, cartão e outros modelos realistas",
    ],
    stripeUrl: "https://buy.stripe.com/00w28s02P6cFcad7Qn9Zm03",
    popular: false,
    color: "from-emerald-500 to-teal-500",
    icon: "👑",
    recommendation:
      "Pacote feito para marcas que querem escalar, atrair público e apresentar uma imagem profissional impecável.",
  },
]

const testimonials = [
  {
    name: "João Santos",
    company: "Tech Solutions",
    rating: 5,
    text: "Melhor investimento que fiz para minha empresa. Logo profissional por um preço justo!",
    avatar: "/images/clients/client-1.png",
    logo: "/images/logos/mecanica-2d-new.png",
  },
  {
    name: "Carlos Silva",
    company: "Max Finança",
    rating: 5,
    text: "Logo incrível! Superou todas as minhas expectativas. Profissional muito talentoso!",
    avatar: "/images/clients/client-2.png",
    logo: "/images/logos/max-financa-2d-new.png",
  },
  {
    name: "Pedro Oliveira",
    company: "Corpo & Mente",
    rating: 5,
    text: "Processo rápido e fácil. Logo ficou exatamente como eu imaginava!",
    avatar: "/images/clients/client-3.png",
    logo: "/images/logos/corpo-mente-2d-new.png",
  },
  {
    name: "Maria Silva",
    company: "Florista Boutique",
    rating: 5,
    text: "Atendimento excepcional e resultado fantástico. Recomendo para todos!",
    avatar: "/images/clients/client-4.png",
    logo: "/images/logos/florista-2d-new.png",
  },
]

const faqs = [
  {
    question: "Quanto tempo leva para receber meu logo?",
    answer:
      "Todos os nossos pacotes têm entrega rápida em até 24 horas. Após a confirmação do pagamento e recebimento das suas informações, você receberá seu logo completo diretamente no seu e-mail ou WhatsApp.",
  },
  {
    question: "Posso solicitar revisões?",
    answer:
      "Sim! Cada pacote inclui revisões. Essencial: 2 revisões, Intermediário: 3 revisões, Premium e Completo: revisões ilimitadas até sua total satisfação.",
  },
  {
    question: "Em que formatos recebo o logo?",
    answer:
      "Depende do pacote: Essencial (PNG, JPG), Intermediário (PNG, JPG, PDF), Premium (PNG, JPG, PDF, AI, EPS), Completo (todos os formatos possíveis incluindo SVG, PSD).",
  },
  {
    question: "Há garantia de satisfação?",
    answer:
      "Sim! Oferecemos 100% de garantia de satisfação. Se não ficar completamente satisfeito, devolvemos seu dinheiro em até 7 dias.",
  },
  {
    question: "O logo será exclusivo?",
    answer:
      "Absolutamente! Cada logo é criado exclusivamente para você. Você terá todos os direitos autorais e garantimos que nunca será usado por outra empresa.",
  },
]

const CheckoutPage = ({ package: pkg, onBack, handleSocialContact }: { package: any; onBack: () => void; handleSocialContact: (platform: string, packageName?: string, packagePrice?: string) => void }) => {
  const [paypalSuccess, setPaypalSuccess] = useState(false);
  const [paypalError, setPaypalError] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-sm border-white/20 text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Finalizar Compra</CardTitle>
          <CardDescription className="text-center text-gray-300">Pacote Selecionado: {pkg.name}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg">Preço: <span className="font-bold text-xl">{pkg.price}</span></p>
          <p className="text-sm text-gray-300">{pkg.description}</p>
          <Button
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            onClick={() => handleStripeCheckout(pkg.stripeUrl)}
          >
            Pagar com Stripe
          </Button>
          {/* PayPal */}
          <div className="my-4">
            <PayPalButton
              amount={pkg.price.replace(/[^\d,\.]/g, "").replace(",", ".")}
              onSuccess={() => setPaypalSuccess(true)}
              onError={(err) => setPaypalError(typeof err === 'string' ? err : 'Erro no pagamento PayPal')}
            />
            {paypalSuccess && <div className="text-green-400 mt-2">Pagamento PayPal realizado com sucesso!</div>}
            {paypalError && <div className="text-red-400 mt-2">{paypalError}</div>}
          </div>
          <Button
            className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
            onClick={onBack}
          >
            Voltar
          </Button>

          {/* Seção de pagamento via redes sociais */}
          <div className="mt-8 p-4 rounded-lg bg-white/10 border border-white/20 text-center">
            <h3 className="text-lg font-bold mb-4 text-white">Ou pague através das redes sociais</h3>
            <p className="text-sm text-gray-300 mb-4">Fale conosco diretamente e passe as informações por lá</p>
            <div className="flex flex-col gap-3 mb-4">
              <Button
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold"
                onClick={() => handleStripeCheckout(pkg.stripeUrl)}
              >
                Pague com Stripe ({pkg.price})
              </Button>
              <Button
                className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold"
                onClick={() => handleSocialContact('instagram', pkg.name, pkg.price)}
              >
                <Instagram className="w-5 h-5 mr-2" /> Pague através do Instagram {pkg.price}
              </Button>
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold"
                onClick={() => handleSocialContact('facebook', pkg.name, pkg.price)}
              >
                <Facebook className="w-5 h-5 mr-2" /> Pague através do Facebook {pkg.price}
              </Button>
            </div>
            <div className="text-xs text-gray-400 flex flex-col items-center gap-1">
              <span>💬 Atendimento personalizado</span>
              <span>⚡ Resposta rápida garantida</span>
              <span>📝 Passe suas preferências diretamente</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default function Home() {
  const { t } = useTranslation();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleBuyNow = (pkg: any) => {
    setSelectedPackage(pkg);
    setShowCheckout(true);
  };

  const handleSocialContact = (platform: string, packageName?: string, packagePrice?: string) => {
    let message = "";

    if (packageName && packagePrice) {
      switch (packageName) {
        case "IA START":
          message = `Olá! Gostaria de adquirir o pacote IA START por ${packagePrice}. Este pacote inclui logo criado por IA personalizado, JPG e PNG alta resolução, marca d\'água e entrega rápida. Podemos prosseguir com o pedido?`;
          break;
        case "DESIGN SMART":
          message = `Olá! Tenho interesse no pacote DESIGN SMART por ${packagePrice}. Gostaria de saber mais sobre os formatos JPG, PNG, PDF, marca d\'água, formato adesivo e suporte prioritário inclusos. Como posso finalizar a compra?`;
          break;
        case "PRO BRAND":
          message = `Olá! Quero contratar o pacote PRO BRAND por ${packagePrice}. Preciso da identidade visual completa com JPG, PNG, PDF, paleta de cores e tipografia personalizada. Quando podemos começar o projeto?`;
          break;
        case "PREMIUM FULL":
          message = `Olá! Gostaria do pacote PREMIUM FULL por ${packagePrice}. Preciso do pacote completo com PSD editável, manual de marca, tipografia personalizada, mockups profissionais e suporte VIP. Qual o próximo passo?`;
          break;
        default:
          message = "Olá! Gostaria de saber mais sobre os pacotes de logo disponíveis.";
      }
    } else {
      message = "Olá! Gostaria de saber mais sobre os pacotes de logo disponíveis.";
    }

    const links = {
      whatsapp: `https://wa.me/5528999331545?text=${encodeURIComponent(message)}`,
      instagram: `https://ig.me/m/up_designeer_?text=${encodeURIComponent(message)}`,
      facebook: `https://m.me/61571328744041?text=${encodeURIComponent(message)}`,
    };
    window.open(links[platform as keyof typeof links], "_blank");
  };

  if (showCheckout && selectedPackage) {
    return (
      <PayPalScriptProvider
        options={{
          clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "YOUR_PAYPAL_CLIENT_ID",
          currency: "EUR"
        }}
      >
        <CheckoutPage package={selectedPackage} onBack={() => setShowCheckout(false)} handleSocialContact={handleSocialContact} />
      </PayPalScriptProvider>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Background Animation */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-2000"></div>
      </div>

      <div className="absolute top-6 right-6 z-[1000]">
        <LanguageSelector onSelectLanguage={(langCode) => {
          console.log(`Idioma selecionado: ${langCode}`);
        }} />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
        <motion.div
          className="text-center max-w-6xl mx-auto"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          {/* Logo */}
          <motion.div variants={fadeInUp} className="mb-8">
            <img
              src="/images/up-designer-logo.png"
              alt="UP DESIGNER"
              className="h-24 mx-auto mb-4 hover:scale-110 transition-transform duration-300"
            />
          </motion.div>

          {/* Stats */}
          <motion.div variants={fadeInUp} className="flex justify-center gap-8 mb-12 flex-wrap">
            <div className="flex items-center gap-2 text-cyan-400">
              <Users className="w-5 h-5" />
              <span className="text-sm">+2.500 Clientes Satisfeitos</span>
            </div>
            <div className="flex items-center gap-2 text-yellow-400">
              <Star className="w-5 h-5 fill-current" />
              <span className="text-sm">4.9/5 Avaliação</span>
            </div>
            <div className="flex items-center gap-2 text-green-400">
              <Award className="w-5 h-5" />
              <span className="text-sm">+5 anos de Experiência</span>
            </div>
          </motion.div>

          {/* Main Headline */}
          <motion.h1 variants={fadeInUp} className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            {t('hero.title')}
          </motion.h1>

          {/* Subtitle */}
          <motion.p variants={fadeInUp} className="text-xl text-gray-300 mb-8">
            {t('hero.subtitle')}
          </motion.p>

          {/* CTA Badges */}
          <motion.div variants={fadeInUp} className="flex justify-center gap-4 mb-12 flex-wrap">
            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 px-4 py-2">
              <Zap className="w-4 h-4 mr-2" />
              {t('features.feature1.title')}
            </Badge>
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 px-4 py-2">
              <Clock className="w-4 h-4 mr-2" />
              Início Imediato
            </Badge>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 px-4 py-2">
              <Shield className="w-4 h-4 mr-2" />
              Garantia Total
            </Badge>
          </motion.div>

          {/* Social Proof Intro */}
          <motion.p variants={fadeInUp} className="text-xl text-cyan-400 mb-12">
            {t('testimonials.title').toUpperCase()}:
          </motion.p>
        </motion.div>
      </section>

      {/* Testimonials Carousel */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTestimonial}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-8">
                {/* Fotos e Logo - Parte Superior */}
                <div className="flex items-center justify-center gap-8 mb-8">
                  {/* Avatar com animação */}
                  <motion.img
                    key={`avatar-${currentTestimonial}`}
                    src={testimonials[currentTestimonial].avatar || "/placeholder.svg"}
                    alt={testimonials[currentTestimonial].name}
                    className="w-24 h-24 rounded-full object-cover border-3 border-cyan-400 shadow-lg"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1, type: "spring", bounce: 0.4 }}
                  />

                  {/* Logo com animação espetacular */}
                  <motion.div
                    key={`logo-${currentTestimonial}`}
                    className="w-32 h-32 bg-white rounded-xl p-4 flex items-center justify-center shadow-xl hover:scale-110 transition-transform duration-200"
                    initial={{
                      opacity: 0,
                      scale: 0,
                      rotate: -180,
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      rotate: 0,
                    }}
                    transition={{
                      duration: 0.8,
                      delay: 0.3,
                      type: "spring",
                      bounce: 0.6,
                    }}
                  >
                    <img
                      src={testimonials[currentTestimonial].logo || "/placeholder.svg"}
                      alt={`${testimonials[currentTestimonial].company} logo`}
                      className="max-w-full max-h-full object-contain"
                    />
                  </motion.div>
                </div>

                {/* Texto do Depoimento */}
                <motion.p
                  className="text-xl mb-8 italic text-center leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  "{testimonials[currentTestimonial].text}"
                </motion.p>

                {/* Informações do Cliente */}
                <div className="flex flex-col items-center">
                  <h3 className="text-xl font-bold text-cyan-400">{testimonials[currentTestimonial].name}</h3>
                  <p className="text-gray-300">{testimonials[currentTestimonial].company}</p>
                  <div className="flex items-center mt-2">
                    {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Nossos Pacotes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {packages.map((pkg, index) => (
              <motion.div
                key={pkg.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className={`h-full bg-gradient-to-br ${pkg.color} border-white/20 backdrop-blur-sm`}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-2xl font-bold">{pkg.name}</CardTitle>
                        <CardDescription className="text-white/80">{pkg.description}</CardDescription>
                      </div>
                      <span className="text-4xl">{pkg.icon}</span>
                    </div>
                    <div className="mt-4">
                      <span className="text-3xl font-bold">{pkg.price}</span>
                      <span className="text-lg line-through text-white/60 ml-2">{pkg.originalPrice}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {pkg.features.map((feature, i) => (
                        <li key={i} className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-400 mr-2 flex-shrink-0 mt-1" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="space-y-3">
                      <Button
                        className="w-full bg-white text-black hover:bg-white/90"
                        onClick={() => handleBuyNow(pkg)}
                      >
                        Comprar Agora
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full border-white/20 text-white hover:bg-white/10"
                        onClick={() => handleSocialContact('whatsapp', pkg.name, pkg.price)}
                      >
                        Falar no WhatsApp
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Perguntas Frequentes</h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <CardTitle className="text-xl">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300">{faq.answer}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400">© 2024 UP DESIGNER. Todos os direitos reservados.</p>
          <div className="flex justify-center gap-4 mt-4">
            <Button
              variant="ghost"
              className="text-white hover:bg-white/10"
              onClick={() => handleSocialContact('whatsapp')}
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              WhatsApp
            </Button>
            <Button
              variant="ghost"
              className="text-white hover:bg-white/10"
              onClick={() => handleSocialContact('instagram')}
            >
              <Instagram className="w-5 h-5 mr-2" />
              Instagram
            </Button>
            <Button
              variant="ghost"
              className="text-white hover:bg-white/10"
              onClick={() => handleSocialContact('facebook')}
            >
              <Facebook className="w-5 h-5 mr-2" />
              Facebook
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}
