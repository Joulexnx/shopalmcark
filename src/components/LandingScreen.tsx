import { useState, useEffect, useRef } from 'react';
import { User, Instagram, Check, QrCode } from 'lucide-react';

interface LandingScreenProps {
  onStart: (name: string) => void;
}

export function LandingScreen({ onStart }: LandingScreenProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Lütfen adınızı girin');
      return;
    }

    if (!isFollowing) {
      setError('Lütfen Instagram\'dan takip edin');
      return;
    }

    if (buttonRef.current) {
      const button = buttonRef.current;
      const ripple = document.createElement('span');
      ripple.className = 'absolute inset-0 bg-white rounded-full animate-ping';
      ripple.style.animationDuration = '0.5s';
      button.appendChild(ripple);
      setTimeout(() => ripple.remove(), 500);
    }

    setIsExiting(true);
    setTimeout(() => {
      onStart(name.trim());
    }, 400);
  };

  const handleInstagramClick = () => {
    window.open('https://www.instagram.com/shopalmcom/', '_blank');
    setIsFollowing(true);
  };

  const titleChars = ''.split('');

  return (
    <div 
      className={`min-h-screen flex items-center justify-center relative z-10 transition-all duration-400 ease-expo-out ${
        isExiting ? '-translate-y-24 opacity-0' : 'translate-y-0 opacity-100'
      }`}
    >
      <div className="w-full max-w-md px-6 py-8">
        {/* Logo - BÜYÜK VE ÇERÇEVESİZ */}
        <div 
          className={`flex justify-center mb-6 transition-all duration-800 ease-bounce ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-24'
          }`}
          style={{ transitionDelay: '400ms' }}
        >
          <div className="relative">
            <img 
              src="/shopalm-white.png" 
              alt="Shopalm" 
              className="w-48 h-48 md:w-64 md:h-64 object-contain drop-shadow-[0_0_30px_rgba(244,208,63,0.3)]"
            />
          </div>
        </div>

        {/* Title */}
        <h1 
          className={`text-5xl md:text-6xl font-display font-bold text-center mb-4 transition-all duration-600 ease-expo-out ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ transitionDelay: '600ms' }}
        >
          <span className="text-gradient">
            {titleChars.map((char, i) => (
              <span
                key={i}
                className={`inline-block transition-all duration-600 ease-expo-out ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${600 + i * 30}ms` }}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </span>
        </h1>

        {/* Subtitle */}
        <p 
          className={`text-lg text-white/70 text-center mb-8 transition-all duration-500 ease-smooth ${
            isVisible ? 'opacity-100 blur-0' : 'opacity-0 blur-sm'
          }`}
          style={{ transitionDelay: '1000ms' }}
        >
          Shopalm Çarkıfelek ile harika hediyeler kazan
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name Input */}
          <div 
            className={`relative transition-all duration-500 ease-expo-out ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-16'
            }`}
            style={{ transitionDelay: '1100ms' }}
          >
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50">
              <User className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              placeholder="Adınızı girin..."
              className={`w-full bg-white/10 border rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-white/50 transition-all duration-200 focus:bg-white/15 ${
                error 
                  ? 'border-red-500 shadow-[0_0_10px_rgba(244,67,54,0.4)]' 
                  : 'border-white/20 focus:border-shopalm-accent/60 focus:shadow-[0_0_20px_rgba(244,208,63,0.3)]'
              }`}
              maxLength={30}
            />
            {error && (
              <p className="absolute -bottom-6 left-0 text-red-400 text-sm animate-slide-in-up">
                {error}
              </p>
            )}
          </div>

          {/* Instagram Takip Bölümü */}
          <div 
            className={`space-y-4 transition-all duration-500 ease-expo-out ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-16'
            }`}
            style={{ transitionDelay: '1150ms' }}
          >
            {/* Instagram Takip Butonu */}
            <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0">
                <Instagram className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-white font-semibold text-sm">Instagram'dan Takip Et</p>
                <p className="text-white/60 text-xs">@shopalmcom</p>
              </div>
              <button
                type="button"
                onClick={handleInstagramClick}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${
                  isFollowing 
                    ? 'bg-green-500 text-white' 
                    : 'bg-white text-purple-600 hover:bg-white/90'
                }`}
              >
                {isFollowing ? (
                  <span className="flex items-center gap-1">
                    <Check className="w-4 h-4" /> Takip Ettim
                  </span>
                ) : (
                  'Takip Et'
                )}
              </button>
            </div>

            {/* QR Kod Butonu */}
            <button
              type="button"
              onClick={() => setShowQr(!showQr)}
              className="w-full py-3 px-4 rounded-xl bg-white/5 border border-white/20 text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <QrCode className="w-5 h-5" />
              <span>{showQr ? 'QR Kodu Gizle' : 'QR Kod ile Takip Et'}</span>
            </button>

            {/* QR Kod Gösterim Alanı */}
            {showQr && (
              <div className="p-6 rounded-xl bg-white border-2 border-shopalm-accent animate-in zoom-in-95 duration-300">
                <div className="aspect-square w-full max-w-[200px] mx-auto bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                  <img 
                    src="/instagram-qr.png" 
                    alt="Instagram QR Kod"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `
                          <div class="text-center p-4">
                            <div class="w-32 h-32 mx-auto bg-gray-300 rounded-lg flex items-center justify-center mb-2">
                              <QrCode class="w-16 h-16 text-gray-500" />
                            </div>
                            <p class="text-gray-500 text-sm">instagram-qr.png</p>
                            <p class="text-gray-400 text-xs mt-1">public klasörüne ekleyin</p>
                          </div>
                        `;
                      }
                    }}
                  />
                </div>
                <p className="text-shopalm-navy text-center mt-3 font-medium text-sm">
                  Kameranızla tarayarak takip edin
                </p>
                <button
                  type="button"
                  onClick={() => setIsFollowing(true)}
                  className="w-full mt-3 py-2 px-4 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:opacity-90 transition-all duration-200"
                >
                  Takip Ettim ✓
                </button>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div 
            className={`transition-all duration-500 ease-expo-out ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-16'
            }`}
            style={{ transitionDelay: '1200ms' }}
          >
            <button
              ref={buttonRef}
              type="submit"
              disabled={!name.trim() || !isFollowing}
              className={`relative w-full py-4 px-8 rounded-full font-display font-semibold text-lg overflow-hidden group transition-all duration-200 ${
                name.trim() && isFollowing
                  ? 'text-white hover:scale-105 hover:shadow-button-hover active:scale-95'
                  : 'text-white/50 cursor-not-allowed'
              }`}
            >
              <span className={`absolute inset-0 ${name.trim() && isFollowing ? 'gradient-button' : 'bg-white/20'}`} />
              <span className="relative flex items-center justify-center gap-2">
                {!name.trim() 
                  ? 'İsim Girin' 
                  : !isFollowing 
                    ? 'Instagram\'dan Takip Edin' 
                    : 'BAŞLA'}
              </span>
            </button>
          </div>
        </form>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-3 h-3 rounded-full bg-shopalm-accent/40 animate-float" style={{ animationDelay: '0s' }} />
        <div className="absolute top-40 right-16 w-2 h-2 rounded-full bg-shopalm-blue/50 animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-32 left-20 w-4 h-4 rounded-full bg-white/20 animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-20 right-10 w-2 h-2 rounded-full bg-shopalm-accent/30 animate-float" style={{ animationDelay: '1.5s' }} />
      </div>
    </div>
  );
}