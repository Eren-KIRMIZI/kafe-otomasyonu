"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useParams } from "next/navigation"
import { Search, Coffee, Clock, ChevronRight, X, Plus, Minus, Check } from "lucide-react"

interface ProductSize {
  id: string
  name: string
  priceModifier: number
}

interface ProductExtra {
  id: string
  name: string
  price: number
}

interface ProductExtraItem {
  extra: ProductExtra
}

interface Product {
  id: string
  name: string
  description?: string | null
  price: number
  imageUrl?: string | null
  preparationTime?: number | null
  sizes?: ProductSize[]
  extraItems?: ProductExtraItem[]
}

interface Category {
  id: string
  name: string
  description?: string | null
  products: Product[]
}

export default function CustomerMenuPage() {
  const params = useParams()
  const tableId = params?.tableId as string
  const tableNumber = tableId?.replace("masa-", "")

  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  
  // Modal State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null)
  const [selectedExtras, setSelectedExtras] = useState<Set<string>>(new Set())
  const [quantity, setQuantity] = useState(1)

  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({})

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/public/menu?t=" + new Date().getTime(), {
          cache: "no-store"
        })
        if (!res.ok) throw new Error()
        const data = await res.json()
        setCategories(data)
        if (data.length > 0) setActiveCategory(data[0].id)
      } catch {
        // Hata yönetimi
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filtered = categories
    .map((cat) => ({
      ...cat,
      products: cat.products.filter(
        (p) =>
          !search ||
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.description?.toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter((cat) => cat.products.length > 0)

  const scrollToCategory = (id: string) => {
    setActiveCategory(id)
    categoryRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", minimumFractionDigits: 0 }).format(price)

  const openProductModal = (product: Product) => {
    setSelectedProduct(product)
    setQuantity(1)
    setSelectedSize(product.sizes && product.sizes.length > 0 ? product.sizes[0] : null)
    setSelectedExtras(new Set())
  }

  const toggleExtra = (extraId: string) => {
    const next = new Set(selectedExtras)
    if (next.has(extraId)) next.delete(extraId)
    else next.add(extraId)
    setSelectedExtras(next)
  }

  const calculateTotal = () => {
    if (!selectedProduct) return 0
    let total = selectedProduct.price
    if (selectedSize) total += selectedSize.priceModifier
    
    selectedProduct.extraItems?.forEach(item => {
      if (selectedExtras.has(item.extra.id)) {
        total += item.extra.price
      }
    })
    
    return total * quantity
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
          className="h-12 w-12 rounded-full border-4 border-[#ffb77d] border-t-transparent"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-[#ffb77d]/30 font-sans">
      {/* Hero Header */}
      <div className="relative overflow-hidden pb-8 pt-12 px-6 border-b border-white/5">
        {/* Background image */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1200&q=80')] bg-cover bg-center opacity-15" />
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-900/60 via-[#0a0a0a]/80 to-[#0a0a0a]" />

        <div className="relative z-10 flex flex-col items-center justify-center text-center">
          {/* BIG logo */}
          <div className="h-56 w-56 mb-6 rounded-[3rem] bg-white/5 backdrop-blur-xl border border-white/15 shadow-[0_30px_80px_rgba(0,0,0,0.6)] flex items-center justify-center overflow-hidden">
            <img
              src="/images/AnaLogo.png"
              alt="Alacatı Cafe Logo"
              className="h-full w-full object-contain p-3 drop-shadow-xl"
            />
          </div>

          <h1 className="text-4xl font-black tracking-tight text-white mb-1">Coppie</h1>
          <p className="text-sm font-semibold text-[#ffb77d] tracking-[0.3em] uppercase mb-6">
            {tableNumber ? `Masa ${tableNumber}` : "Hoş Geldiniz"}
          </p>

          {/* Search */}
          <div className="relative w-full max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-500" />
            <input
              type="text"
              placeholder="Menüde ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl bg-white/5 border border-white/10 pl-12 pr-4 py-4 text-sm text-white placeholder-neutral-500 outline-none focus:border-[#ffb77d]/50 focus:bg-white/8 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Category Navigation (Sticky) */}
      {!search && (
        <div className="sticky top-0 z-30 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/5 py-4">
          <div className="flex gap-3 overflow-x-auto px-6 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => scrollToCategory(cat.id)}
                className={[
                  "shrink-0 rounded-2xl px-5 py-2.5 text-sm font-semibold transition-all duration-300",
                  activeCategory === cat.id
                    ? "bg-[#ffb77d] text-[#2f1500] shadow-[0_0_20px_rgba(255,183,125,0.3)]"
                    : "bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white border border-white/5",
                ].join(" ")}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Menu List */}
      <div className="px-6 py-8 pb-32 space-y-10 max-w-3xl mx-auto">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-white/5 border border-white/10">
              <Search className="h-8 w-8 text-neutral-600" />
            </div>
            <p className="text-neutral-400 font-medium">Aradığınız ürün bulunamadı</p>
          </div>
        ) : (
          filtered.map((cat) => (
            <motion.div
              key={cat.id}
              ref={(el) => { categoryRefs.current[cat.id] = el }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-2xl font-bold text-white tracking-tight">{cat.name}</h2>
                <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cat.products.map((product) => (
                  <motion.button
                    key={product.id}
                    onClick={() => openProductModal(product)}
                    className="group relative flex flex-col text-left overflow-hidden rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all duration-300"
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Large Image Area */}
                    <div className="relative w-full aspect-[4/3] bg-neutral-900 overflow-hidden">
                      {product.imageUrl ? (
                        <img 
                          src={product.imageUrl} 
                          alt={product.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-800 to-neutral-900">
                          <Coffee className="h-12 w-12 text-neutral-700" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                      
                      {/* Floating Price Tag */}
                      <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md rounded-full px-4 py-1.5 border border-white/10">
                        <span className="font-bold text-white tracking-wide">
                          {formatPrice(product.price)}
                        </span>
                      </div>

                      {product.preparationTime && (
                        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md rounded-full px-3 py-1.5 flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-[#ffb77d]" />
                          <span className="text-xs font-medium text-white">{product.preparationTime} dk</span>
                        </div>
                      )}
                    </div>

                    {/* Content Area */}
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="text-lg font-bold text-white mb-1.5 group-hover:text-[#ffb77d] transition-colors line-clamp-1">{product.name}</h3>
                      {product.description && (
                        <p className="text-sm text-neutral-400 line-clamp-2 leading-relaxed flex-1">
                          {product.description}
                        </p>
                      )}
                      
                      {/* Action indicator */}
                      <div className="mt-4 flex items-center justify-between text-[#ffb77d]">
                        <span className="text-xs font-medium uppercase tracking-wider">İncele</span>
                        <div className="h-8 w-8 rounded-full bg-[#ffb77d]/10 flex items-center justify-center group-hover:bg-[#ffb77d]/20 transition-colors">
                           <ChevronRight className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Floating Waiter Button */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
        <button className="flex items-center gap-3 bg-[#ffb77d] hover:bg-[#ffcda3] text-[#2f1500] px-6 py-4 rounded-full font-bold shadow-[0_10px_30px_rgba(255,183,125,0.3)] transition-all active:scale-95">
          <Coffee className="h-5 w-5" />
          <span>Garson Çağır</span>
        </button>
      </div>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: "100%" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-x-0 bottom-0 z-50 flex flex-col max-h-[90vh] rounded-t-[40px] bg-[#121212] border-t border-white/10 shadow-2xl"
            >
              <div className="flex-1 overflow-y-auto">
                {/* Header Image in Modal */}
                <div className="relative h-56 w-full shrink-0 bg-neutral-900">
                  {selectedProduct.imageUrl ? (
                    <img src={selectedProduct.imageUrl} alt={selectedProduct.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Coffee className="h-16 w-16 text-neutral-800" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-black/50"></div>
                  
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="absolute top-6 right-6 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-white/20 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="px-6 py-6 pb-8">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-3xl font-bold text-white tracking-tight leading-tight">{selectedProduct.name}</h2>
                </div>
                
                {selectedProduct.description && (
                  <p className="text-neutral-400 leading-relaxed mb-4">{selectedProduct.description}</p>
                )}

                {/* Size Selection */}
                {selectedProduct.sizes && selectedProduct.sizes.length > 0 && (
                  <div className="mb-10">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-500 mb-4">Boyut Seçimi</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {selectedProduct.sizes.map(size => (
                        <button
                          key={size.id}
                          onClick={() => setSelectedSize(size)}
                          className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${
                            selectedSize?.id === size.id
                              ? "bg-[#ffb77d]/10 border-[#ffb77d] text-white"
                              : "bg-white/5 border-white/10 text-neutral-400 hover:border-white/20"
                          }`}
                        >
                          <span className="font-semibold mb-1">{size.name}</span>
                          <span className="text-xs opacity-70">
                            {size.priceModifier > 0 ? `+${formatPrice(size.priceModifier)}` : 'Ücretsiz'}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Extras Selection */}
                {selectedProduct.extraItems && selectedProduct.extraItems.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-500 mb-4">Ekstralar</h3>
                    <div className="space-y-3">
                      {selectedProduct.extraItems.map(item => (
                        <button
                          key={item.extra.id}
                          onClick={() => toggleExtra(item.extra.id)}
                          className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${
                            selectedExtras.has(item.extra.id)
                              ? "bg-[#ffb77d]/10 border-[#ffb77d]"
                              : "bg-white/5 border-white/10 hover:border-white/20"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`flex h-6 w-6 items-center justify-center rounded-md border ${
                              selectedExtras.has(item.extra.id)
                                ? "bg-[#ffb77d] border-[#ffb77d] text-[#2f1500]"
                                : "border-neutral-600 bg-transparent"
                            }`}>
                              {selectedExtras.has(item.extra.id) && <Check className="h-4 w-4" />}
                            </div>
                            <span className={selectedExtras.has(item.extra.id) ? "text-white font-medium" : "text-neutral-400"}>
                              {item.extra.name}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-neutral-400">
                            +{formatPrice(item.extra.price)}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Bar (Sticky Bottom in Modal) */}
            <div className="shrink-0 bg-[#1a1a1a]/95 backdrop-blur-xl border-t border-white/10 p-6 flex items-center gap-6">
                <div className="flex items-center gap-4 bg-white/10 rounded-full px-2 py-1 border border-white/5">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white hover:bg-white/20 transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-4 text-center font-bold text-white text-lg">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ffb77d] text-[#2f1500] hover:bg-[#ffcda3] transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                
                <button className="flex-1 bg-[#ffb77d] hover:bg-[#ffcda3] text-[#2f1500] py-4 rounded-full font-bold shadow-lg flex items-center justify-between px-6 transition-colors">
                  <span>Siparişe Ekle</span>
                  <span className="bg-black/10 px-3 py-1 rounded-full">{formatPrice(calculateTotal())}</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
