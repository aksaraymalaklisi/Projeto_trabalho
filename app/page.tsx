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
import { PayPalProvider } from "@/components/PayPalProvider";


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

export default function Home() {
  const { t } = useTranslation();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const testimonials = [
    {
      name: t('testimonials.testimonial1.name'),
      company: t('testimonials.testimonial1.company'),
      rating: 5,
      text: t('testimonials.testimonial1.text'),
      avatar: "/images/clients/client-1.png",
      logo: "/images/logos/mecanica-2d-new.png",
    },
    {
      name: t('testimonials.testimonial2.name'),
      company: t('testimonials.testimonial2.company'),
      rating: 5,
      text: t('testimonials.testimonial2.text'),
      avatar: "/images/clients/client-2.png",
      logo: "/images/logos/max-financa-2d-new.png",
    },
    {
      name: t('testimonials.testimonial3.name'),
      company: t('testimonials.testimonial3.company'),
      rating: 5,
      text: t('testimonials.testimonial3.text'),
      avatar: "/images/clients/client-3.png",
      logo: "/images/logos/corpo-mente-2d-new.png",
    },
    {
      name: t('testimonials.testimonial4.name'),
      company: t('testimonials.testimonial4.company'),
      rating: 5,
      text: t('testimonials.testimonial4.text'),
      avatar: "/images/clients/client-4.png",
      logo: "/images/logos/florista-2d-new.png",
    },
  ]

  const faqs = [
    {
      question: t('faq.question1'),
      answer: t('faq.answer1'),
    },
    {
      question: t('faq.question2'),
      answer: t('faq.answer2'),
    },
    {
      question: t('faq.question3'),
      answer: t('faq.answer3'),
    },
    {
      question: t('faq.question4'),
      answer: t('faq.answer4'),
    },
    {
      question: t('faq.question5'),
      answer: t('faq.answer5'),
    },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

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

  const CheckoutPage = ({ package: pkg, onBack, handleSocialContact }: { package: any; onBack: () => void; handleSocialContact: (platform: string, packageName?: string, packagePrice?: string) => void }) => {
    const [paypalSuccess, setPaypalSuccess] = useState(false);
    const [paypalError, setPaypalError] = useState<string | null>(null);
    
    // Calcular preço com desconto (€10 de desconto)
    const originalPrice = parseFloat(pkg.price.replace(/[^\d,\.]/g, "").replace(",", "."));
    const discountedPrice = originalPrice - 10;

    const handleSubmit = () => {
      handleStripeCheckout(pkg.stripeUrl);
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-4">
        <div className="max-w-7xl mx-auto py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <Button
              onClick={onBack}
              className="mb-4 bg-gray-600 hover:bg-gray-700 text-white"
            >
              ← Voltar aos Pacotes
            </Button>
            <h1 className="text-4xl font-bold mb-2">Finalizar Compra</h1>
            <p className="text-xl text-gray-300">Escolha sua forma de pagamento preferida</p>
          </div>

          {/* Layout de duas colunas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Coluna Esquerda - Pacote Selecionado */}
            <div className="space-y-6">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6">
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    <img src="/images/up-designer-logo.png" alt="UP DESIGNER" className="h-16" />
                  </div>
                  <CardTitle className="text-3xl font-bold">{pkg.name}</CardTitle>
                  <CardDescription className="text-lg text-gray-300 mt-2">{pkg.description}</CardDescription>
                  <div className="flex justify-center items-center gap-2 mt-6">
                    <span className="text-xl text-gray-400 line-through">de {pkg.originalPrice}</span>
                  </div>
                  <div className="flex justify-center items-center gap-2 mt-1">
                    <span className="text-3xl font-bold text-orange-500">por {pkg.price}</span>
                  </div>
                  <p className="text-sm text-gray-300 mt-2">Preço original com desconto já aplicado</p>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="mb-4">
                    <span className="text-4xl">{pkg.icon}</span>
                  </div>
                  <h4 className="font-semibold mb-4 text-lg">Incluído no pacote:</h4>
                  <ul className="space-y-3 max-w-md mx-auto">
                    {pkg.features.map((feature: string, i: number) => (
                      <li key={i} className="flex items-start gap-3 text-sm">
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-left">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  {pkg.recommendation && (
                    <div className="mt-6 p-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/30">
                      <p className="text-sm text-blue-300 font-medium">{pkg.recommendation}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Coluna Direita - Pagamento e Formulário */}
            <div className="space-y-6">
              {/* Opção de Pagamento no Site */}
              <Card className="bg-white border-green-500/30 p-6">
                <CardHeader className="text-center">
                  <CardTitle className="text-xl text-green-600 flex items-center justify-center gap-2">
                    <Sparkles className="w-6 h-6" />
                    OFERTA ESPECIAL DO SITE
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <p className="text-lg mb-2">Compre agora pelo site e receba</p>
                    <div className="text-3xl font-bold text-green-600 mb-2">€10 GRÁTIS</div>
                    <p className="text-sm text-gray-600 mb-4">Seu logo por apenas</p>
                    <div className="text-4xl font-bold text-orange-500">
                      €{discountedPrice.toFixed(2).replace(".", ",")}
                    </div>
                  </div>
                  <div className="bg-white/10 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 text-cyan-600 text-center">Como funciona:</h4>
                    <ol className="text-sm space-y-1 text-gray-600 max-w-xs mx-auto">
                      <li>1. Pagamento adiantado seguro</li>
                      <li>2. Após confirmação, coleta de informações</li>
                      <li>3. Criação do seu logo personalizado</li>
                      <li>4. Entrega conforme pacote escolhido</li>
                    </ol>
                  </div>
                  <div className="text-center">
                    <Button
                      onClick={handleSubmit}
                      className="w-full md:w-3/4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-4 text-lg rounded-lg transition-all duration-300 hover:scale-105"
                    >
                      💳 PAGAR AGORA €{discountedPrice.toFixed(2).replace(".", ",")}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* PayPal */}
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6">
                <CardHeader className="text-center">
                  <CardTitle className="text-xl">Pagar com PayPal</CardTitle>
                  <CardDescription>Pagamento seguro e rápido</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="flex justify-center items-center gap-2 mb-2">
                      <span className="text-lg text-gray-400 line-through">de {pkg.originalPrice}</span>
                    </div>
                    <div className="flex justify-center items-center gap-2 mb-4">
                      <span className="text-2xl font-bold text-orange-500">por €{discountedPrice.toFixed(2).replace(".", ",")}</span>
                    </div>
                    <p className="text-sm text-gray-300 mb-4">Preço com desconto de €10 aplicado</p>
                    <div className="my-4">
                      <PayPalProvider>
                        <PayPalButton
                          amount={discountedPrice.toString()}
                          onSuccess={() => setPaypalSuccess(true)}
                          onError={(err) => setPaypalError(typeof err === 'string' ? err : 'Erro no pagamento PayPal')}
                        />
                      </PayPalProvider>
                      {paypalSuccess && <div className="text-green-400 mt-2">Pagamento PayPal realizado com sucesso!</div>}
                      {paypalError && <div className="text-red-400 mt-2">{paypalError}</div>}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Redes sociais */}
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6">
                <CardHeader className="text-center">
                  <CardTitle className="text-xl">Ou pague através das redes sociais</CardTitle>
                  <CardDescription>Fale conosco diretamente e passe as informações por lá</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col items-center gap-4">
                    <Button
                      onClick={() => handleSocialContact("whatsapp", pkg.name, pkg.price)}
                      className="w-full md:w-3/4 bg-green-600 hover:bg-green-700 text-white font-semibold py-4 rounded-lg flex items-center justify-center gap-3"
                    >
                      <MessageCircle className="w-5 h-5" />
                      Pague através do WhatsApp €{pkg.price}
                    </Button>
                    <Button
                      onClick={() => handleSocialContact("instagram", pkg.name, pkg.price)}
                      className="w-full md:w-3/4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 rounded-lg flex items-center justify-center gap-3"
                    >
                      <Instagram className="w-5 h-5" />
                      Pague através do Instagram €{pkg.price}
                    </Button>
                    <Button
                      onClick={() => handleSocialContact("facebook", pkg.name, pkg.price)}
                      className="w-full md:w-3/4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-lg flex items-center justify-center gap-3"
                    >
                      <Facebook className="w-5 h-5" />
                      Pague através do Facebook €{pkg.price}
                    </Button>
                  </div>
                  <div className="text-center text-sm text-gray-400 mt-4">
                    <p>💬 Atendimento personalizado</p>
                    <p>⚡ Resposta rápida garantida</p>
                    <p>🎨 Passe suas preferências diretamente</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (showCheckout && selectedPackage) {
    return <CheckoutPage package={selectedPackage} onBack={() => setShowCheckout(false)} handleSocialContact={handleSocialContact} />;
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
              {t('features.immediateStart')}
            </Badge>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 px-4 py-2">
              <Shield className="w-4 h-4 mr-2" />
              {t('features.totalGuarantee')}
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

      {/* Logo Gallery Section */}
      <section className="py-20 px-4">
        <motion.div
          className="max-w-6xl mx-auto text-center"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold mb-6">
            {t('logos.delivered.title')}
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-lg text-gray-300 mb-12">
            {t('logos.delivered.subtitle')}
          </motion.p>
          <motion.div variants={fadeInUp}>
            <LogoGallery />
          </motion.div>
        </motion.div>
      </section>

      {/* Packages Section */}
      <section className="py-20 px-4">
        <motion.div
          className="max-w-7xl mx-auto"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              {t('packages.choose.title')}
            </h2>
            <p className="text-xl text-gray-300">{t('packages.choose.subtitle')}</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {packages.map((pkg, index) => (
              <motion.div key={pkg.name} variants={fadeInUp} className="relative">
                <Card
                  className={`bg-white/10 backdrop-blur-sm border-white/20 p-6 h-full hover:bg-white/20 transition-all duration-300 hover:scale-105 ${pkg.popular ? "ring-2 ring-orange-500" : ""}`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-orange-500 text-white px-4 py-1">{t('packages.mostPopular')}</Badge>
                    </div>
                  )}

                  <CardHeader className="text-center pb-4">
                    <div
                      className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${pkg.color} flex items-center justify-center`}
                    >
                      <Target className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold">{pkg.name}</CardTitle>
                    <CardDescription className="text-gray-400">{pkg.description}</CardDescription>
                    <div className="flex items-center justify-center gap-2 mt-4">
                      <span className="text-3xl font-bold text-orange-500">{pkg.price}</span>
                      <span className="text-lg text-gray-400 line-through">{pkg.originalPrice}</span>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <ul className="space-y-3">
                      {pkg.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <div>
                      <Button
                        onClick={() => handleBuyNow(pkg)}
                        className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 rounded-lg transition-all duration-300 hover:scale-105"
                      >
                        {t('packages.selectPackage')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Process Section */}
      <section className="py-20 px-4">
        <motion.div
          className="max-w-6xl mx-auto"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              {t('process.title')}
            </h2>
            <p className="text-xl text-gray-300">{t('process.subtitle')}</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: t('process.step1.title'),
                desc: t('process.step1.desc'),
              },
              {
                icon: Palette,
                title: t('process.step2.title'),
                desc: t('process.step2.desc'),
              },
              { 
                icon: Rocket, 
                title: t('process.step3.title'), 
                desc: t('process.step3.desc') 
              },
            ].map((step, index) => (
              <motion.div key={index} variants={fadeInUp} className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                  <step.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4">{step.title}</h3>
                <p className="text-gray-300">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Guarantees Section */}
      <section className="py-20 px-4">
        <motion.div
          className="max-w-6xl mx-auto"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              {t('guarantees.title')}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Shield,
                title: t('guarantees.guarantee1.title'),
                desc: t('guarantees.guarantee1.desc'),
              },
              { 
                icon: Zap, 
                title: t('guarantees.guarantee2.title'), 
                desc: t('guarantees.guarantee2.desc') 
              },
              { 
                icon: Heart, 
                title: t('guarantees.guarantee3.title'), 
                desc: t('guarantees.guarantee3.desc') 
              },
              {
                icon: Award,
                title: t('guarantees.guarantee4.title'),
                desc: t('guarantees.guarantee4.desc'),
              },
            ].map((guarantee, index) => (
              <motion.div key={index} variants={fadeInUp} className="text-center">
                <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6 h-full hover:bg-white/20 transition-all duration-300 hover:scale-105">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                    <guarantee.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{guarantee.title}</h3>
                  <p className="text-sm text-gray-300">{guarantee.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4">
        <motion.div
          className="max-w-4xl mx-auto"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              {t('faq.title')}
            </h2>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardHeader className="cursor-pointer" onClick={() => setOpenFaq(openFaq === index ? null : index)}>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{faq.question}</CardTitle>
                      {openFaq === index ? <ChevronUp /> : <ChevronDown />}
                    </div>
                  </CardHeader>
                  <AnimatePresence>
                    {openFaq === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <CardContent>
                          <p className="text-gray-300">{faq.answer}</p>
                        </CardContent>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
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
