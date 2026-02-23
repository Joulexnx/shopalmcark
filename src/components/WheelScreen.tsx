import { useState, useEffect } from 'react';
import type { Product, Winner } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Wheel } from './Wheel';
import { ResultModal } from './ResultModal';
import { RotateCcw, LogOut, Package, Trophy, Users, Download, Copy, Check } from 'lucide-react';

interface WheelScreenProps {
  userName: string;
  onReset: () => void;
}

const INITIAL_PRODUCTS: Product[] = [
  { id: 1, name: 'OfisWeb %50 İndirim', stock: 5, icon: '', color: '#29347e' },
 { id: 2, name: 'Bukytalk İngilizce Öğrenim Seansı', stock: 5, icon: '', color: '#f39669' },
  { id: 3, name: 'Shopalm 500₺ Kupon', stock: 5, icon: '', color: '#f0c7a8' },
  { id: 4, name: "PAS", stock: 50, icon: "😢", color: "#555555"},
  { id: 5, name: 'WhyNot %35 İndirim', stock: 5, icon: '', color: '#5c6bc0' },
  { id: 6, name: 'Rawsome Glütensiz Mini Atıştırmalık', stock: 50, icon: '', color: '#f0c7a8' },
  { id: 7, name: "PAS", stock: 50, icon: "😢", color: "#555555"},
  { id: 8, name: 'Rawsome Granola', stock: 15, icon: '', color: '#29347e' },
  { id: 9, name: "PAS", stock: 50, icon: "😢", color: "#555555"},
  { id: 10, name: 'Şanslı Çekiliş Hakkı', stock: 50, icon: '🍀', color: '#f39669' },
];

const SPONSORS = [
  { name: 'Shopalm', logo: '/shopalm-white.png', isMain: true },
  { name: 'WHYNOT', logo: '/sponsor-WhyNot.png' },
  { name: 'Bukytalk', logo: '/sponsor-BukyTalk.png' },
  { name: 'OfisWeb', logo: '/sponsor-OfisWeb.png' },
  { name: 'Rawsome', logo: '/sponsor-Rawsome.png' },
  { name: 'MobilePlus', logo: '/sponsor-mobileplus.png' },
  { name: 'GameCenter', logo: '/sponsor-gamecenter.png' },
];

export function WheelScreen({ userName, onReset }: WheelScreenProps) {
  const [products, setProducts] = useLocalStorage<Product[]>('shopalm-products', INITIAL_PRODUCTS);
  const [winners, setWinners] = useLocalStorage<Winner[]>('shopalm-winners', []);
  
  const [isSpinning, setIsSpinning] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [result, setResult] = useState<{ product: Product; isPass: boolean } | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSpinEnd = (product: Product, isPass: boolean) => {
    const currentProduct = products.find(p => p.id === product.id);
    
    if (!currentProduct || currentProduct.stock <= 0) {
      setIsSpinning(false);
      return;
    }

    if (!isPass) {
      setProducts(prev => 
        prev.map(p => 
          p.id === product.id 
            ? { ...p, stock: p.stock - 1 }
            : p
        )
      );

      const newWinner: Winner = {
        id: Date.now(),
        name: userName,
        product: currentProduct,
        timestamp: new Date(),
      };

      setWinners(prev => [newWinner, ...prev]);
    }

    setResult({ product: currentProduct, isPass });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setResult(null);
  };

  const handleResetAll = () => {
    if (confirm('Tüm verileri sıfırlamak istediğinize emin misiniz?')) {
      setProducts(INITIAL_PRODUCTS);
      setWinners([]);
    }
  };

  // 🎯 CSV İndirme Fonksiyonu
  const downloadCSV = () => {
    if (winners.length === 0) {
      alert('Henüz kazanan yok!');
      return;
    }

    const headers = ['Sıra No', 'İsim Soyisim', 'Kazanılan Ödül', 'Tarih', 'Telefon', 'Email', 'Notlar'];
    const rows = winners.map((w, i) => [
      i + 1,
      w.name,
      w.product.name,
      new Date(w.timestamp).toLocaleString('tr-TR'),
      '', // Telefon - manuel doldurulacak
      '', // Email - manuel doldurulacak
      ''  // Notlar - manuel doldurulacak
    ]);
    
    const csv = [headers, ...rows]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(';'))
      .join('\n');
    
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `shopalm-kazananlar-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 🎯 Panoya Kopyala Fonksiyonu
  const copyToClipboard = () => {
    if (winners.length === 0) {
      alert('Henüz kazanan yok!');
      return;
    }

    const text = winners.map((w, i) => 
      `${i + 1}. ${w.name} - ${w.product.name} (${new Date(w.timestamp).toLocaleString('tr-TR')})`
    ).join('\n');

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const availableProducts = products.filter(p => p.stock > 0 && p.name !== "PAS");
  const totalStock = availableProducts.reduce((acc, p) => acc + p.stock, 0);

  return (
    <div 
      className={`min-h-screen flex flex-col transition-all duration-500 ease-expo-out ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Header */}
      <header 
        className={`w-full px-4 md:px-8 py-4 flex items-center justify-between glass-card rounded-none border-x-0 border-t-0 transition-all duration-500 ease-expo-out ${
          isVisible ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'
        }`}
        style={{ transitionDelay: '400ms' }}
      >
        <h1 className="text-xl md:text-2xl font-display font-bold text-white">
          Shopalm <span className="text-shopalm-accent">Çarkıfelek</span>
        </h1>
        
        <div className="flex items-center gap-2">
          {winners.length > 0 && (
            <button
              onClick={handleResetAll}
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-shopalm-accent hover:bg-white/20 transition-all duration-200"
              title="Tüm Verileri Sıfırla"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
          
          <button
            onClick={onReset}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all duration-200"
            title="Çıkış Yap"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Content - 3 Sütunlu Layout */}
      <main className="flex-1 flex overflow-hidden">
        
        {/* SOL PANEL - Sponsorlar */}
        <aside 
          className={`hidden lg:flex flex-col w-72 p-6 border-r border-white/10 bg-shopalm-navy/30 transition-all duration-500 ease-expo-out ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
          }`}
          style={{ transitionDelay: '500ms' }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-shopalm-accent/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-shopalm-accent" />
            </div>
            <h3 className="text-lg font-display font-bold text-white">Sponsorlar</h3>
          </div>
          
          <div className="space-y-3 overflow-y-auto flex-1">
            {SPONSORS.map((sponsor) => (
              <div
                key={sponsor.name}
                className={`
                  flex items-center gap-3 p-3 rounded-xl transition-all duration-200 cursor-pointer group
                  ${sponsor.isMain 
                    ? 'bg-shopalm-accent/20 border border-shopalm-accent/40' 
                    : 'bg-white/5 hover:bg-white/10'
                  }
                `}
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-white/10 overflow-hidden flex-shrink-0">
                  <img 
                    src={sponsor.logo} 
                    alt={sponsor.name}
                    className="w-8 h-8 object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `<span class="text-lg font-bold text-white">${sponsor.name.charAt(0)}</span>`;
                      }
                    }}
                  />
                </div>
                <span className={`font-medium text-sm transition-colors ${sponsor.isMain ? 'text-shopalm-accent' : 'text-white/80 group-hover:text-white'}`}>
                  {sponsor.name}
                </span>
              </div>
            ))}
          </div>
        </aside>

        {/* ORTA PANEL - Çark */}
        <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
          <div 
            className={`w-full h-full flex items-center justify-center transition-all duration-800 ease-expo-out ${
              isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
            style={{ transitionDelay: '500ms' }}
          >
            <Wheel
              products={products}
              onSpinEnd={handleSpinEnd}
              isSpinning={isSpinning}
              setIsSpinning={setIsSpinning}
            />
          </div>
        </div>

        {/* SAĞ PANEL - Kazananlar ve Stok */}
        <aside 
          className={`hidden lg:flex flex-col w-80 p-6 border-l border-white/10 bg-shopalm-navy/30 transition-all duration-500 ease-expo-out ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
          }`}
          style={{ transitionDelay: '600ms' }}
        >
          {/* Özet Bilgiler */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <Package className="w-6 h-6 text-shopalm-accent mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{totalStock}</p>
              <p className="text-xs text-white/60">Toplam Ödül</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <Trophy className="w-6 h-6 text-shopalm-accent mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{winners.length}</p>
              <p className="text-xs text-white/60">Kazanan</p>
            </div>
          </div>

          {/* Kazananlar Listesi */}
          <div className="flex-1 overflow-hidden flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-shopalm-accent/20 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-shopalm-accent" />
                </div>
                <h3 className="text-lg font-display font-bold text-white">Kazananlar</h3>
              </div>
              
              {/* 🎯 Export Butonları */}
              {winners.length > 0 && (
                <div className="flex gap-2">
                  <button
                    onClick={copyToClipboard}
                    className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white/70 hover:text-shopalm-accent hover:bg-white/20 transition-all duration-200"
                    title="Panoya Kopyala"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              )}
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 space-y-3 min-h-0">
              {winners.length === 0 ? (
                <p className="text-white/40 text-center py-8">Henüz kazanan yok</p>
              ) : (
                winners.slice(0, 50).map((winner, index) => (
                  <div key={winner.id} className="bg-white/5 rounded-xl p-3 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-shopalm-accent/20 flex items-center justify-center text-shopalm-accent font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium text-sm truncate">{winner.name}</p>
                      <p className="text-white/60 text-xs truncate">{winner.product.name}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* 🎯 CSV İndir Butonu */}
            {winners.length > 0 && (
              <button
                onClick={downloadCSV}
                className="mt-4 w-full py-3 px-4 rounded-xl bg-gradient-to-r from-shopalm-accent to-shopalm-accent-orange text-shopalm-navy font-display font-semibold flex items-center justify-center gap-2 hover:scale-105 hover:shadow-neon transition-all duration-200"
              >
                <Download className="w-5 h-5" />
                <span>CSV İndir</span>
              </button>
            )}
          </div>

          {/* Kalan Stoklar - PAS HARİÇ */}
          <div className="mt-6 pt-6 border-t border-white/10 flex-shrink-0">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-shopalm-accent/20 flex items-center justify-center">
                <Package className="w-5 h-5 text-shopalm-accent" />
              </div>
              <h3 className="text-lg font-display font-bold text-white">Kalan Stoklar</h3>
            </div>
            
            <div className="space-y-2 max-h-32 overflow-y-auto pr-2">
              {availableProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2">
                  <span className="text-white/80 text-sm truncate flex-1">{product.name}</span>
                  <span className="text-shopalm-accent font-bold text-sm ml-2">{product.stock}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </main>

      {/* Result Modal */}
      <ResultModal
        product={result?.product || null}
        userName={userName}
        isOpen={showModal}
        onClose={handleCloseModal}
      />

      {/* Footer */}
      <footer className="w-full py-3 text-center text-white/40 text-sm border-t border-white/5">
        <p>© 2026 Shopalm Çarkıfelek - Şansını dene, kazan!</p>
      </footer>
    </div>
  );
}