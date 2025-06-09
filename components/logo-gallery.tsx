"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface LogoPair {
  id: string
  name: string
  logo2D: string
  logo3D: string
}

const logoPairs: LogoPair[] = [
  {
    id: "brainovation",
    name: "Brainovation",
    logo2D: "/images/logos/agencia-web-2d.png",
    logo3D: "/images/logos/agencia-web-3d.png",
  },
  {
    id: "maconaria",
    name: "D&P Maçonaria",
    logo2D: "/images/logos/maconaria-2d.png",
    logo3D: "/images/logos/maconaria-3d.png",
  },
  {
    id: "florista",
    name: "Florista",
    logo2D: "/images/logos/florista-2d.png",
    logo3D: "/images/logos/florista-3d.png",
  },
  {
    id: "mecanica",
    name: "Top Mecânica",
    logo2D: "/images/logos/mecanica-2d.png",
    logo3D: "/images/logos/mecanica-3d.png",
  },
  {
    id: "gelateria",
    name: "Sweet Bunny",
    logo2D: "/images/logos/gelateria-2d-new.png",
    logo3D: "/images/logos/gelateria-3d-new.png",
  },
  {
    id: "corpo-mente",
    name: "Corpo & Mente",
    logo2D: "/images/logos/corpo-mente-2d.png",
    logo3D: "/images/logos/corpo-mente-3d.png",
  },
  {
    id: "max-financa",
    name: "Max Finança",
    logo2D: "/images/logos/max-financa-2d.png",
    logo3D: "/images/logos/max-financa-3d.png",
  },
  {
    id: "imother",
    name: "iMother",
    logo2D: "/images/logos/imother-2d.png",
    logo3D: "/images/logos/imother-3d.png",
  },
]

export function LogoGallery() {
  // Track which logos are showing 3D version
  const [showing3D, setShowing3D] = useState<Record<string, boolean>>({})
  const [hoveredLogo, setHoveredLogo] = useState<string | null>(null)

  // Initialize with all logos showing 2D version
  useEffect(() => {
    const initialState: Record<string, boolean> = {}
    logoPairs.forEach((pair) => {
      initialState[pair.id] = false
    })
    setShowing3D(initialState)

    // Single interval that changes ALL logos at the same time
    const interval = setInterval(() => {
      setShowing3D((prev) => {
        const newState: Record<string, boolean> = {}
        logoPairs.forEach((pair) => {
          newState[pair.id] = !prev[pair.id]
        })
        return newState
      })
    }, 4000) // Change every 4 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
      {logoPairs.map((pair) => (
        <div
          key={pair.id}
          className="relative overflow-hidden rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 p-4 h-64 flex flex-col items-center justify-center group"
          onMouseEnter={() => setHoveredLogo(pair.id)}
          onMouseLeave={() => setHoveredLogo(null)}
        >
          {/* Glow effect on hover */}
          <div
            className={`absolute inset-0 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 opacity-0 transition-opacity duration-500 ${
              hoveredLogo === pair.id ? "opacity-100" : ""
            }`}
          />

          {/* Logo container */}
          <div className="relative w-full h-48 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={showing3D[pair.id] ? "3d" : "2d"}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <img
                  src={showing3D[pair.id] ? pair.logo3D : pair.logo2D}
                  alt={`${pair.name} ${showing3D[pair.id] ? "3D" : "2D"} logo`}
                  className="max-w-full max-h-full object-contain"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Version indicator */}
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2">
            <span
              className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                !showing3D[pair.id] ? "bg-cyan-400" : "bg-white/30"
              }`}
            />
            <span
              className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                showing3D[pair.id] ? "bg-cyan-400" : "bg-white/30"
              }`}
            />
          </div>

          {/* Interactive overlay */}
          <div
            className="absolute inset-0 cursor-pointer"
            onClick={() => {
              setShowing3D((prev) => ({
                ...prev,
                [pair.id]: !prev[pair.id],
              }))
            }}
          />

          {/* Hover effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 via-transparent to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            animate={hoveredLogo === pair.id ? { scale: 1.05 } : { scale: 1 }}
            transition={{ duration: 0.3 }}
          />
        </div>
      ))}
    </div>
  )
}
