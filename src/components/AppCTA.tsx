import { useNavigate } from 'react-router-dom';
import { useInView } from '../hooks/useInView';

export default function AppCTA() {
  const { ref, inView } = useInView();
  const navigate = useNavigate();

  // Clean SVG QR code for Festivo app download
  const qrSvg = (
    <svg viewBox="0 0 200 200" className="w-full h-full text-sage-950">
      <rect width="200" height="200" fill="#ffffff" rx="16" />
      {/* Outer corner squares */}
      <rect x="15" y="15" width="50" height="50" fill="#13201a" rx="8" />
      <rect x="23" y="23" width="34" height="34" fill="#ffffff" rx="4" />
      <rect x="31" y="31" width="18" height="18" fill="#5d8560" rx="3" />

      <rect x="135" y="15" width="50" height="50" fill="#13201a" rx="8" />
      <rect x="143" y="23" width="34" height="34" fill="#ffffff" rx="4" />
      <rect x="151" y="31" width="18" height="18" fill="#5d8560" rx="3" />

      <rect x="15" y="135" width="50" height="50" fill="#13201a" rx="8" />
      <rect x="23" y="143" width="34" height="34" fill="#ffffff" rx="4" />
      <rect x="31" y="151" width="18" height="18" fill="#5d8560" rx="3" />

      {/* Decorative pattern blocks */}
      <rect x="75" y="20" width="14" height="14" fill="#13201a" rx="2" />
      <rect x="95" y="20" width="25" height="14" fill="#5d8560" rx="2" />
      <rect x="75" y="40" width="45" height="14" fill="#13201a" rx="2" />

      <rect x="20" y="75" width="14" height="25" fill="#5d8560" rx="2" />
      <rect x="40" y="75" width="25" height="14" fill="#13201a" rx="2" />
      <rect x="20" y="105" width="45" height="14" fill="#13201a" rx="2" />

      <rect x="80" y="70" width="40" height="40" fill="#13201a" rx="6" />
      <rect x="90" y="80" width="20" height="20" fill="#ffffff" rx="3" />

      <rect x="135" y="75" width="20" height="20" fill="#5d8560" rx="3" />
      <rect x="160" y="75" width="25" height="14" fill="#13201a" rx="2" />
      <rect x="140" y="100" width="45" height="15" fill="#13201a" rx="2" />

      <rect x="75" y="135" width="20" height="20" fill="#13201a" rx="3" />
      <rect x="100" y="135" width="20" height="45" fill="#5d8560" rx="3" />
      <rect x="75" y="160" width="20" height="20" fill="#5d8560" rx="3" />
      <rect x="135" y="135" width="45" height="20" fill="#13201a" rx="3" />
      <rect x="135" y="160" width="20" height="20" fill="#5d8560" rx="3" />
      <rect x="160" y="160" width="20" height="20" fill="#13201a" rx="3" />
    </svg>
  );

  return (
    <section className="py-12 bg-cream-50 overflow-hidden" ref={ref}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FFF5F6] border border-[#FFE0E3] rounded-3xl pt-8 px-8 md:pt-12 md:px-12 pb-0 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          
          {/* Left Text and Store Buttons */}
          <div className="flex-1 max-w-xl text-center md:text-left pb-8 md:pb-12">
            <h2 className="font-sans text-3xl sm:text-4xl font-extrabold text-sage-950 mb-3 tracking-tight">
              Download the app now!
            </h2>
            <p className="text-sage-700 text-base md:text-lg font-medium mb-8 leading-relaxed">
              Experience seamless event planning & vendor booking only on the Festivo app
            </p>

            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              {/* Google Play Button */}
              <button
                onClick={() => navigate('/vendors')}
                className="flex items-center gap-3 bg-black text-white px-5 py-3 rounded-xl hover:bg-neutral-800 transition-all duration-200 active:scale-95 shadow-md"
              >
                <div className="w-6 h-6 flex-shrink-0">
                  <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
                    <path d="M3.18 23.76c.37.21.8.27 1.21.16l12.86-7.41-2.83-2.83-11.24 10.08zM.32 2.31C.12 2.71 0 3.17 0 3.7v16.6c0 .53.12.99.32 1.39l.07.07 9.31-9.31v-.22L.39 2.24l-.07.07zM20.34 10.38l-2.61-1.5-3.18 3.18 3.18 3.18 2.63-1.52c.75-.43.75-1.14-.02-1.84zM4.39.08L17.25 7.49l-2.83 2.83L3.18.24c.41-.11.84-.05 1.21.16z" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-[10px] uppercase tracking-wider text-neutral-400 font-bold leading-none">GET IT ON</p>
                  <p className="font-bold text-sm leading-tight mt-0.5">Google Play</p>
                </div>
              </button>

              {/* App Store Button */}
              <button
                onClick={() => navigate('/vendors')}
                className="flex items-center gap-3 bg-black text-white px-5 py-3 rounded-xl hover:bg-neutral-800 transition-all duration-200 active:scale-95 shadow-md"
              >
                <div className="w-6 h-6 flex-shrink-0">
                  <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-[10px] uppercase tracking-wider text-neutral-400 font-bold leading-none">Download on the</p>
                  <p className="font-bold text-sm leading-tight mt-0.5">App Store</p>
                </div>
              </button>
            </div>
          </div>

          {/* Right Phone Mockup with Scroll-Up Animation */}
          <div className="relative flex-shrink-0 w-72 sm:w-80 self-end">
            <div
              className={`transition-all duration-1000 ease-out transform ${
                inView ? 'translate-y-4 opacity-100' : 'translate-y-36 opacity-0'
              }`}
            >
              {/* Phone Frame */}
              <div className="bg-sage-950 rounded-t-[2.5rem] rounded-b-none p-3 pb-0 shadow-2xl border-4 border-b-0 border-sage-900 relative -mb-2">
                {/* Phone Speaker Notch */}
                <div className="w-20 h-4 bg-sage-900 rounded-b-xl mx-auto absolute top-3 left-1/2 -translate-x-1/2 z-20" />
                
                {/* Screen Content */}
                <div className="bg-white rounded-t-[2rem] rounded-b-none pt-12 pb-10 px-6 text-center shadow-inner">
                  <p className="text-sage-800 font-semibold text-sm mb-6 leading-snug px-2">
                    Scan the QR code to download the app
                  </p>
                  
                  {/* QR Container Box */}
                  <div className="bg-[#FFF5F6] p-4 rounded-2xl border border-[#FFE0E3] shadow-sm max-w-[190px] mx-auto">
                    <div className="w-full aspect-square rounded-xl overflow-hidden shadow-inner">
                      {qrSvg}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
