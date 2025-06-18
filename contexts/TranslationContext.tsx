"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface TranslationContextType {
  currentLanguage: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

const translations = {
  pt: {
    'hero.title': 'Transforme Sua Presença Digital com IA',
    'hero.subtitle': 'Criação de logotipos, websites e estratégias de marketing digital personalizadas com inteligência artificial',
    'hero.cta': 'Comece Agora',
    'features.feature1.title': 'Rapidez Incomparável',
    'features.feature1.description': 'Entrega em até 48 horas',
    'features.feature2.title': 'Qualidade Premium',
    'features.feature2.description': 'Designs profissionais e únicos',
    'features.feature3.title': 'Suporte Dedicado',
    'features.feature3.description': 'Equipe especializada sempre disponível',
    'features.feature4.title': 'Preço Justo',
    'features.feature4.description': 'Melhor custo-benefício do mercado',
    'testimonials.title': 'O Que Nossos Clientes Dizem',
    'testimonials.subtitle': 'Histórias reais de transformação digital',
    'packages.title': 'Nossos Pacotes',
    'packages.subtitle': 'Escolha o pacote perfeito para suas necessidades',
    'packages.selectPackage': 'Selecionar Pacote',
    'faq.title': 'Perguntas Frequentes',
    'faq.subtitle': 'Tire suas dúvidas sobre nossos serviços',
    'cta.title': 'Pronto para Transformar Sua Marca?',
    'cta.subtitle': 'Junte-se a mais de 1000 empresas que já transformaram sua presença digital',
    'cta.button': 'Começar Agora'
  },
  en: {
    'hero.title': 'Transform Your Digital Presence with AI',
    'hero.subtitle': 'Custom logo creation, websites and digital marketing strategies with artificial intelligence',
    'hero.cta': 'Get Started',
    'features.feature1.title': 'Unmatched Speed',
    'features.feature1.description': 'Delivery in up to 48 hours',
    'features.feature2.title': 'Premium Quality',
    'features.feature2.description': 'Professional and unique designs',
    'features.feature3.title': 'Dedicated Support',
    'features.feature3.description': 'Specialized team always available',
    'features.feature4.title': 'Fair Price',
    'features.feature4.description': 'Best cost-benefit in the market',
    'testimonials.title': 'What Our Clients Say',
    'testimonials.subtitle': 'Real stories of digital transformation',
    'packages.title': 'Our Packages',
    'packages.subtitle': 'Choose the perfect package for your needs',
    'packages.selectPackage': 'Select Package',
    'faq.title': 'Frequently Asked Questions',
    'faq.subtitle': 'Clear your doubts about our services',
    'cta.title': 'Ready to Transform Your Brand?',
    'cta.subtitle': 'Join over 1000 companies that have already transformed their digital presence',
    'cta.button': 'Start Now'
  },
  es: {
    'hero.title': 'Transforma Tu Presencia Digital con IA',
    'hero.subtitle': 'Creación de logotipos personalizados, sitios web y estrategias de marketing digital con inteligencia artificial',
    'hero.cta': 'Comenzar Ahora',
    'features.feature1.title': 'Rapidez Incomparable',
    'features.feature1.description': 'Entrega en hasta 48 horas',
    'features.feature2.title': 'Calidad Premium',
    'features.feature2.description': 'Diseños profesionales y únicos',
    'features.feature3.title': 'Soporte Dedicado',
    'features.feature3.description': 'Equipo especializado siempre disponible',
    'features.feature4.title': 'Precio Justo',
    'features.feature4.description': 'Mejor costo-beneficio del mercado',
    'testimonials.title': 'Lo Que Dicen Nuestros Clientes',
    'testimonials.subtitle': 'Historias reales de transformación digital',
    'packages.title': 'Nuestros Paquetes',
    'packages.subtitle': 'Elige el paquete perfecto para tus necesidades',
    'packages.selectPackage': 'Seleccionar Paquete',
    'faq.title': 'Preguntas Frecuentes',
    'faq.subtitle': 'Resuelve tus dudas sobre nuestros servicios',
    'cta.title': '¿Listo para Transformar Tu Marca?',
    'cta.subtitle': 'Únete a más de 1000 empresas que ya han transformado su presencia digital',
    'cta.button': 'Comenzar Ahora'
  },
  fr: {
    'hero.title': 'Transformez Votre Présence Numérique avec l\'IA',
    'hero.subtitle': 'Création de logos personnalisés, sites web et stratégies de marketing numérique avec intelligence artificielle',
    'hero.cta': 'Commencer Maintenant',
    'features.feature1.title': 'Rapidité Incomparable',
    'features.feature1.description': 'Livraison en 48 heures maximum',
    'features.feature2.title': 'Qualité Premium',
    'features.feature2.description': 'Designs professionnels et uniques',
    'features.feature3.title': 'Support Dédié',
    'features.feature3.description': 'Équipe spécialisée toujours disponible',
    'features.feature4.title': 'Prix Équitable',
    'features.feature4.description': 'Meilleur rapport qualité-prix du marché',
    'testimonials.title': 'Ce Que Disent Nos Clients',
    'testimonials.subtitle': 'Histoires réelles de transformation numérique',
    'packages.title': 'Nos Forfaits',
    'packages.subtitle': 'Choisissez le forfait parfait pour vos besoins',
    'packages.selectPackage': 'Sélectionner le Forfait',
    'faq.title': 'Questions Fréquemment Posées',
    'faq.subtitle': 'Clarifiez vos doutes sur nos services',
    'cta.title': 'Prêt à Transformer Votre Marque ?',
    'cta.subtitle': 'Rejoignez plus de 1000 entreprises qui ont déjà transformé leur présence numérique',
    'cta.button': 'Commencer Maintenant'
  },
  de: {
    'hero.title': 'Verwandeln Sie Ihre Digitale Präsenz mit KI',
    'hero.subtitle': 'Individuelle Logo-Erstellung, Websites und digitale Marketing-Strategien mit künstlicher Intelligenz',
    'hero.cta': 'Jetzt Starten',
    'features.feature1.title': 'Unvergleichliche Geschwindigkeit',
    'features.feature1.description': 'Lieferung in bis zu 48 Stunden',
    'features.feature2.title': 'Premium-Qualität',
    'features.feature2.description': 'Professionelle und einzigartige Designs',
    'features.feature3.title': 'Engagierter Support',
    'features.feature3.description': 'Spezialisiertes Team immer verfügbar',
    'features.feature4.title': 'Fairer Preis',
    'features.feature4.description': 'Bestes Preis-Leistungs-Verhältnis am Markt',
    'testimonials.title': 'Was Unsere Kunden Sagen',
    'testimonials.subtitle': 'Echte Geschichten digitaler Transformation',
    'packages.title': 'Unsere Pakete',
    'packages.subtitle': 'Wählen Sie das perfekte Paket für Ihre Bedürfnisse',
    'packages.selectPackage': 'Paket Auswählen',
    'faq.title': 'Häufig Gestellte Fragen',
    'faq.subtitle': 'Klären Sie Ihre Zweifel über unsere Dienstleistungen',
    'cta.title': 'Bereit, Ihre Marke zu Verwandeln?',
    'cta.subtitle': 'Schließen Sie sich über 1000 Unternehmen an, die bereits ihre digitale Präsenz transformiert haben',
    'cta.button': 'Jetzt Starten'
  },
  it: {
    'hero.title': 'Trasforma la Tua Presenza Digitale con l\'IA',
    'hero.subtitle': 'Creazione di loghi personalizzati, siti web e strategie di marketing digitale con intelligenza artificiale',
    'hero.cta': 'Inizia Ora',
    'features.feature1.title': 'Velocità Incomparabile',
    'features.feature1.description': 'Consegna entro 48 ore',
    'features.feature2.title': 'Qualità Premium',
    'features.feature2.description': 'Design professionali e unici',
    'features.feature3.title': 'Supporto Dedicato',
    'features.feature3.description': 'Team specializzato sempre disponibile',
    'features.feature4.title': 'Prezzo Giusto',
    'features.feature4.description': 'Miglior rapporto qualità-prezzo del mercato',
    'testimonials.title': 'Cosa Dicono i Nostri Clienti',
    'testimonials.subtitle': 'Storie reali di trasformazione digitale',
    'packages.title': 'I Nostri Pacchetti',
    'packages.subtitle': 'Scegli il pacchetto perfetto per le tue esigenze',
    'packages.selectPackage': 'Seleziona Pacchetto',
    'faq.title': 'Domande Frequenti',
    'faq.subtitle': 'Risolvi i tuoi dubbi sui nostri servizi',
    'cta.title': 'Pronto a Trasformare il Tuo Brand?',
    'cta.subtitle': 'Unisciti a oltre 1000 aziende che hanno già trasformato la loro presenza digitale',
    'cta.button': 'Inizia Ora'
  },
  nl: {
    'hero.title': 'Transformeer Uw Digitale Aanwezigheid met AI',
    'hero.subtitle': 'Aangepaste logo-creatie, websites en digitale marketingstrategieën met kunstmatige intelligentie',
    'hero.cta': 'Begin Nu',
    'features.feature1.title': 'Ongeëvenaarde Snelheid',
    'features.feature1.description': 'Levering binnen 48 uur',
    'features.feature2.title': 'Premium Kwaliteit',
    'features.feature2.description': 'Professionele en unieke ontwerpen',
    'features.feature3.title': 'Toegewijde Ondersteuning',
    'features.feature3.description': 'Gespecialiseerd team altijd beschikbaar',
    'features.feature4.title': 'Eerlijke Prijs',
    'features.feature4.description': 'Beste prijs-kwaliteitverhouding op de markt',
    'testimonials.title': 'Wat Onze Klanten Zeggen',
    'testimonials.subtitle': 'Echte verhalen van digitale transformatie',
    'packages.title': 'Onze Pakketten',
    'packages.subtitle': 'Kies het perfecte pakket voor uw behoeften',
    'packages.selectPackage': 'Pakket Selecteren',
    'faq.title': 'Veelgestelde Vragen',
    'faq.subtitle': 'Los uw twijfels op over onze diensten',
    'cta.title': 'Klaar om Uw Merk te Transformeren?',
    'cta.subtitle': 'Sluit u aan bij meer dan 1000 bedrijven die hun digitale aanwezigheid al hebben getransformeerd',
    'cta.button': 'Begin Nu'
  }
};

export const TranslationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('pt');

  const setLanguage = (lang: string) => {
    setCurrentLanguage(lang);
  };

  const t = (key: string): string => {
    const langTranslations = translations[currentLanguage as keyof typeof translations] || translations.pt;
    return langTranslations[key as keyof typeof langTranslations] || key;
  };

  return (
    <TranslationContext.Provider value={{ currentLanguage, setLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};

