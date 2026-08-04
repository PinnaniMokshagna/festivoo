import { useState, useMemo } from 'react';
import { Search, MapPin, X, Navigation, ChevronDown, ChevronUp } from 'lucide-react';

interface CitySelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCity: (city: string) => void;
  selectedCity?: string;
}

interface PopularCity {
  name: string;
  icon: JSX.Element;
}

// Custom line-art SVGs for famous Indian landmarks
const popularCities: PopularCity[] = [
  {
    name: 'Mumbai',
    icon: (
      <svg className="w-12 h-12 stroke-sage-700 fill-none" viewBox="0 0 64 64" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {/* Gateway of India representation */}
        <path d="M8 56h48M12 56V28l6-6h28l6 6v28" />
        <path d="M24 56V38c0-4.4 3.6-8 8-8s8 3.6 8 8v18" />
        <path d="M16 22v-6l4-4h24l4 4v6" />
        <path d="M28 12V8h8v4" />
        <circle cx="32" cy="22" r="3" />
        <path d="M16 34h8M40 34h8" />
      </svg>
    ),
  },
  {
    name: 'Delhi-NCR',
    icon: (
      <svg className="w-12 h-12 stroke-sage-700 fill-none" viewBox="0 0 64 64" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {/* India Gate representation */}
        <path d="M10 56h44M14 56V26h36v30" />
        <path d="M22 56V34c0-5.5 4.5-10 10-10s10 4.5 10 10v22" />
        <path d="M10 26V18h44v8" />
        <path d="M18 18V12l6-4h16l6 4v6" />
        <path d="M26 8V5h12v3" />
      </svg>
    ),
  },
  {
    name: 'Bengaluru',
    icon: (
      <svg className="w-12 h-12 stroke-sage-700 fill-none" viewBox="0 0 64 64" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {/* Vidhana Soudha representation */}
        <path d="M6 56h52M10 56V32h44v24" />
        <path d="M26 56V38h12v18" />
        <path d="M22 32V20h20v12" />
        <path d="M28 20V12c0-2.2 1.8-4 4-4s4 1.8 4 4v8" />
        <path d="M14 32v-6l4-4h28l4 4v6" />
      </svg>
    ),
  },
  {
    name: 'Hyderabad',
    icon: (
      <svg className="w-12 h-12 stroke-sage-700 fill-none" viewBox="0 0 64 64" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {/* Charminar representation */}
        <path d="M8 56h48M14 56V28h36v28" />
        <path d="M24 56V40c0-4.4 3.6-8 8-8s8 3.6 8 8v16" />
        <path d="M14 28c0-3.3 2.7-6 6-6h24c3.3 0 6 2.7 6 6" />
        <path d="M16 22V8m32 14V8" />
        <path d="M14 8c0-2 2-4 4-4s4 2 4 4m20 0c0-2 2-4 4-4s4 2 4 4" />
      </svg>
    ),
  },
  {
    name: 'Chandigarh',
    icon: (
      <svg className="w-12 h-12 stroke-sage-700 fill-none" viewBox="0 0 64 64" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {/* Open Hand Monument / Modern sculpture */}
        <path d="M12 56h40M32 56V32" />
        <path d="M32 32L18 20c-2-2-2-5 0-7s5-2 7 0l7 7V8c0-2.2 1.8-4 4-4s4 1.8 4 4v16l5-5c2-2 5-2 7 0s2 5 0 7L32 32z" />
      </svg>
    ),
  },
  {
    name: 'Ahmedabad',
    icon: (
      <svg className="w-12 h-12 stroke-sage-700 fill-none" viewBox="0 0 64 64" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {/* Sidi Saiyyed / Heritage Arch */}
        <path d="M8 56h48M14 56V32c0-9.9 8.1-18 18-18s18 8.1 18 18v24" />
        <path d="M24 56V36c0-4.4 3.6-8 8-8s8 3.6 8 8v20" />
        <path d="M32 14v10M20 22l8 8M44 22l-8 8" />
      </svg>
    ),
  },
  {
    name: 'Pune',
    icon: (
      <svg className="w-12 h-12 stroke-sage-700 fill-none" viewBox="0 0 64 64" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {/* Shaniwar Wada Fort Gate */}
        <path d="M8 56h48M12 56V26l6-4h28l6 4v30" />
        <path d="M22 56V38c0-5.5 4.5-10 10-10s10 4.5 10 10v18" />
        <path d="M16 22V12h32v10" />
        <path d="M12 12l4-4h32l4 4" />
      </svg>
    ),
  },
  {
    name: 'Chennai',
    icon: (
      <svg className="w-12 h-12 stroke-sage-700 fill-none" viewBox="0 0 64 64" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {/* Temple Gopuram Tower */}
        <path d="M10 56h44M16 56L20 18h24l4 38" />
        <path d="M18 44h28M20 32h24M22 24h20" />
        <path d="M26 18V10l6-4 6 4v8" />
        <circle cx="32" cy="38" r="3" />
      </svg>
    ),
  },
  {
    name: 'Kolkata',
    icon: (
      <svg className="w-12 h-12 stroke-sage-700 fill-none" viewBox="0 0 64 64" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {/* Howrah Bridge */}
        <path d="M4 56h56M8 56L20 16h4L32 40L40 16h4L56 56" />
        <path d="M4 44h56" />
        <path d="M12 44v12M24 44v12M40 44v12M52 44v12" />
        <path d="M22 16V8h4v8m12 0V8h4v8" />
      </svg>
    ),
  },
  {
    name: 'Kochi',
    icon: (
      <svg className="w-12 h-12 stroke-sage-700 fill-none" viewBox="0 0 64 64" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {/* Chinese Fishing Net & Palms */}
        <path d="M6 56h52M12 56L36 20m0 0L52 56M36 20v36" />
        <path d="M16 44h32" />
        <path d="M44 24c4-4 10-4 14 0m-4-10c2 4 2 10 0 14" />
      </svg>
    ),
  },
];

const allOtherCities = [
  'Aalo', 'Abohar', 'Abu Road', 'Achampet', 'Acharapakkam', 'Addanki', 'Adilabad', 'Adimali',
  'Adipur', 'Adoni', 'Agar Malwa', 'Agartala', 'Agiripalli', 'Agra', 'Ahilyanagar (Ahmednagar)',
  'Ahmedgarh', 'Ahore', 'Aizawl', 'Ajmer', 'Akaltara', 'Akbarpur', 'Akividu', 'Akluj',
  'Akola', 'Akot', 'Alakode', 'Alangudi', 'Alangulam', 'Alappuzha', 'Alathur', 'Alibaug',
  'Aligarh', 'Alipurduar', 'Allagadda', 'Almora', 'Alwar', 'Amalapuram', 'Ambala', 'Ambikapur',
  'Amravati', 'Amreli', 'Amritsar', 'Anand', 'Anantapur', 'Angul', 'Annavaram', 'Annur',
  'Arakkonam', 'Arrah', 'Araria', 'Arcot', 'Ariyalur', 'Asansol', 'Aurangabad', 'Azamgarh',
  'Baddi', 'Badami', 'Badaun', 'Bagalkot', 'Baghpat', 'Bahadurgarh', 'Bahraich', 'Balaghat',
  'Balasore', 'Ballari (Bellary)', 'Ballia', 'Balrampur', 'Banda', 'Bandipore', 'Bankura',
  'Banswara', 'Barabanki', 'Baramulla', 'Baran', 'Bardhaman', 'Bareilly', 'Barmer', 'Barnala',
  'Baroda (Vadodara)', 'Barwani', 'Bastar', 'Basti', 'Bathinda', 'Beawar', 'Beed', 'Begusarai',
  'Belagavi (Belgaum)', 'Berhampur', 'Betul', 'Bhagalpur', 'Bharatpur', 'Bharuch', 'Bhavnagar',
  'Bhilai', 'Bhilwara', 'Bhimavaram', 'Bhind', 'Bhiwadi', 'Bhiwani', 'Bhopal', 'Bhubaneswar',
  'Bhuj', 'Bhusawal', 'Bidar', 'Bihar Sharif', 'Bikaner', 'Bilaspur', 'Bokaro', 'Bongaigaon',
  'Botad', 'Bulandshahr', 'Bundi', 'Burhanpur', 'Buxar', 'Calicut (Kozhikode)', 'Chamba',
  'Chandausi', 'Chandrapur', 'Chhapra', 'Chhatarpur', 'Chhindwara', 'Chidambaram', 'Chikhli',
  'Chikmagalur', 'Chitradurga', 'Chitrakoot', 'Chittoor', 'Chittorgarh', 'Churu', 'Coimbatore',
  'Cuddalore', 'Cuttack', 'Daman', 'Darbhanga', 'Darjeeling', 'Davanagere', 'Dehradun',
  'Deoghar', 'Deoria', 'Dewas', 'Dhanbad', 'Dhar', 'Dharamshala', 'Dharmapuri', 'Dharwad',
  'Dholpur', 'Dhule', 'Dibrugarh', 'Dindigul', 'Dimapur', 'Dispur', 'Durg', 'Durgapur',
  'Dwarka', 'Eluru', 'Ernakulam', 'Erode', 'Etah', 'Etawah', 'Faizabad', 'Faridabad',
  'Faridkot', 'Farrukhabad', 'Fatehabad', 'Fatehpur', 'Firozabad', 'Gadag', 'Gadchiroli',
  'Gandhidham', 'Gandhinagar', 'Gaya', 'Ghaziabad', 'Ghazipur', 'Giridih', 'Godhra',
  'Gondia', 'Gorakhpur', 'Guntur', 'Gurdaspur', 'Gurgaon (Gurugram)', 'Guwahati', 'Gwalior',
  'Hajipur', 'Haldwani', 'Hamirpur', 'Hampi', 'Hansi', 'Hapur', 'Hardoi', 'Haridwar',
  'Hassan', 'Hathras', 'Himatnagar', 'Hisar', 'Hoshangabad', 'Hoshiarpur', 'Hospet',
  'Hosur', 'Hubballi (Hubli)', 'Imphal', 'Itanagar', 'Jabalpur', 'Jalandhar', 'Jalgaon',
  'Jalna', 'Jalpaiguri', 'Jammu', 'Jamnagar', 'Jamshedpur', 'Jaunpur', 'Jhabua', 'Jhajjar',
  'Jhalawar', 'Jhansi', 'Jharsuguda', 'Jhunjhunu', 'Jind', 'Jodhpur', 'Jorhat', 'Junagadh',
  'Kadapa', 'Kakinada', 'Kalaburagi (Gulbarga)', 'Kanchipuram', 'Kangra', 'Kanjirappally',
  'Kannur', 'Kanpur', 'Kanyakumari', 'Karad', 'Karaikal', 'Karaikudi', 'Karimnagar',
  'Karnal', 'Karur', 'Karwar', 'Kasaragod', 'Kashipur', 'Katihar', 'Katni', 'Kawardha',
  'Kendrapara', 'Keonjhar', 'Khagaria', 'Khammam', 'Khandwa', 'Kharagpur', 'Khargone',
  'Kheda', 'Kishangarh', 'Kishanganj', 'Kolhapur', 'Kollam', 'Korba', 'Kota', 'Kottayam',
  'Kozhikode', 'Krishnagiri', 'Kurnool', 'Kurukshetra', 'Latur', 'Lonavala', 'Ludhiana',
  'Machilipatnam', 'Madurai', 'Malappuram', 'Malda', 'Maler Kotla', 'Mathura', 'Meerut',
  'Mehsana', 'Mirzapur', 'Moga', 'Moradabad', 'Morbi', 'Motihari', 'Muktsar', 'Muzaffarnagar',
  'Muzaffarpur', 'Mysore (Mysuru)', 'Nadiad', 'Nagercoil', 'Nagpur', 'Nanded', 'Nandyal',
  'Nashik', 'Navsari', 'Nellore', 'Noida', 'Nizamabad', 'Ongole', 'Ooty', 'Palakkad',
  'Palanpur', 'Pali', 'Palwal', 'Panaji', 'Panchkula', 'Panipat', 'Pathankot', 'Patiala',
  'Patna', 'Pollachi', 'Pondicherry (Puducherry)', 'Porbandar', 'Prayagraj (Allahabad)',
  'Puri', 'Purnea', 'Raichur', 'Raigarh', 'Raipur', 'Rajahmundry', 'Rajkot', 'Rajsamand',
  'Ranchi', 'Ratlam', 'Ratnagiri', 'Rewa', 'Rewari', 'Rishikesh', 'Rohtak', 'Roorkee',
  'Rourkela', 'Sagar', 'Saharanpur', 'Salem', 'Sambalpur', 'Satara', 'Satna', 'Shillong',
  'Shimla', 'Shimoga (Shivamogga)', 'Sikar', 'Silchar', 'Siliguri', 'Solapur', 'Sonipat',
  'Srinagar', 'Surat', 'Tanjore (Thanjavur)', 'Tezpur', 'Thane', 'Thrissur', 'Tiruchirappalli (Trichy)',
  'Tirupati', 'Tirupur', 'Tiruvannamalai', 'Trivandrum (Thiruvananthapuram)', 'Tumakuru (Tumkur)',
  'Tuticorin (Thoothukudi)', 'Udaipur', 'Ujjain', 'Vadodara', 'Vapi', 'Varanasi', 'Vasai-Virar',
  'Vellore', 'Vijayawada', 'Visakhapatnam (Vizag)', 'Vizianagaram', 'Warangal', 'Wardha',
  'Yamunanagar', 'Yavatmal'
];

export default function CitySelectorModal({
  isOpen,
  onClose,
  onSelectCity,
  selectedCity,
}: CitySelectorModalProps) {
  const [search, setSearch] = useState('');
  const [isDetecting, setIsDetecting] = useState(false);
  const [showAllCities, setShowAllCities] = useState(false);

  const filteredPopular = useMemo(() => {
    if (!search.trim()) return popularCities;
    return popularCities.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const filteredOther = useMemo(() => {
    if (!search.trim()) return allOtherCities;
    return allOtherCities.filter((c) =>
      c.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const displayedOtherCities = useMemo(() => {
    if (showAllCities || search.trim().length > 0) return filteredOther;
    return filteredOther.slice(0, 35);
  }, [filteredOther, showAllCities, search]);

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsDetecting(true);
    navigator.geolocation.getCurrentPosition(
      () => {
        setIsDetecting(false);
        // Default to Mumbai if reverse geocoding is unavailable
        onSelectCity('Mumbai');
        onClose();
      },
      () => {
        setIsDetecting(false);
        alert('Unable to retrieve your location. Please select a city manually.');
      }
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden z-10 border border-sage-100">
        {/* Header / Search Area */}
        <div className="p-6 border-b border-sage-100 space-y-4 bg-white sticky top-0 z-20">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-sage-900 font-display">Select Your City</h2>
            <button
              onClick={onClose}
              className="p-2 text-sage-400 hover:text-sage-700 rounded-full hover:bg-sage-50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sage-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for your city"
              className="w-full pl-12 pr-10 py-3.5 bg-sage-50/70 rounded-2xl text-sage-900 placeholder:text-sage-400 text-sm font-medium border border-sage-200/80 focus:outline-none focus:border-sage-500 focus:bg-white transition-all shadow-inner"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-sage-400 hover:text-sage-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            onClick={handleDetectLocation}
            disabled={isDetecting}
            className="flex items-center gap-2 text-rose-500 hover:text-rose-600 font-semibold text-sm transition-colors py-1 px-1 rounded-lg focus:outline-none"
          >
            <Navigation className={`w-4 h-4 ${isDetecting ? 'animate-spin' : ''}`} />
            <span>{isDetecting ? 'Detecting location...' : 'Detect my location'}</span>
          </button>
        </div>

        {/* Modal Scroll Content */}
        <div className="p-6 overflow-y-auto space-y-8 flex-1 custom-scrollbar">
          {/* Popular Cities */}
          {filteredPopular.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-sage-500 mb-5 text-center">
                Popular Cities
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-5 lg:grid-cols-10 gap-3">
                {filteredPopular.map((city) => {
                  const isSelected = selectedCity === city.name;
                  return (
                    <button
                      key={city.name}
                      onClick={() => {
                        onSelectCity(city.name);
                        onClose();
                      }}
                      className={`flex flex-col items-center justify-between p-3 rounded-2xl border transition-all duration-200 group hover:scale-105 ${
                        isSelected
                          ? 'border-sage-600 bg-sage-50 shadow-sm'
                          : 'border-sage-100 hover:border-sage-300 hover:bg-sage-50/50'
                      }`}
                    >
                      <div className="w-14 h-14 flex items-center justify-center text-sage-700 group-hover:scale-110 transition-transform">
                        {city.icon}
                      </div>
                      <span className="text-xs font-bold text-sage-800 mt-2 text-center group-hover:text-sage-900">
                        {city.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Other Cities */}
          {filteredOther.length > 0 && (
            <div className="border-t border-sage-100 pt-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-sage-500 mb-5 text-center">
                Other Cities
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-y-3 gap-x-4">
                {displayedOtherCities.map((cityName) => {
                  const isSelected = selectedCity === cityName;
                  return (
                    <button
                      key={cityName}
                      onClick={() => {
                        onSelectCity(cityName);
                        onClose();
                      }}
                      className={`text-left text-xs font-medium py-1.5 px-2 rounded-lg transition-colors truncate ${
                        isSelected
                          ? 'text-rose-600 font-bold bg-rose-50'
                          : 'text-sage-600 hover:text-sage-900 hover:bg-sage-50'
                      }`}
                    >
                      {cityName}
                    </button>
                  );
                })}
              </div>

              {!search && (
                <div className="text-center mt-6">
                  <button
                    onClick={() => setShowAllCities(!showAllCities)}
                    className="inline-flex items-center gap-1.5 text-rose-500 hover:text-rose-600 font-bold text-sm transition-colors py-2 px-4 rounded-xl hover:bg-rose-50"
                  >
                    <span>{showAllCities ? 'Hide all cities' : 'View all cities'}</span>
                    {showAllCities ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              )}
            </div>
          )}

          {filteredPopular.length === 0 && filteredOther.length === 0 && (
            <div className="text-center py-12 text-sage-500">
              <MapPin className="w-10 h-10 mx-auto text-sage-300 mb-3" />
              <p className="font-bold text-base text-sage-800">No cities found matching "{search}"</p>
              <p className="text-xs text-sage-500 mt-1">Try searching with a different spelling or keyword.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
