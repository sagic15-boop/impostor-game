import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, Eye, EyeOff, UserPlus, Play, RotateCcw, 
  HelpCircle, Check, Crown, Skull, Fingerprint, 
  Sparkles, Timer, Trophy, Shuffle, Database,
  Maximize, Minimize, Lightbulb
} from 'lucide-react';

// --- רכיבי UI ---

const Card = ({ children, className = "" }) => (
  <div className={`bg-slate-800/80 backdrop-blur-md border border-slate-700/50 shadow-xl rounded-3xl p-6 ${className}`}>
    {children}
  </div>
);

const Button = ({ onClick, disabled, variant = 'primary', children, className = "" }) => {
  const baseStyle = "w-full font-bold py-4 rounded-2xl shadow-lg transform active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed select-none touch-manipulation";
  const variants = {
    primary: "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-violet-900/20",
    secondary: "bg-slate-700 hover:bg-slate-600 text-white border border-slate-600",
    danger: "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-red-900/20",
    success: "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-emerald-900/20"
  };
  return (
    <button onClick={onClick} disabled={disabled} className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

const Toggle = ({ label, checked, onChange }) => (
  <div className="flex items-center justify-between bg-slate-900/40 p-3 rounded-xl border border-white/5 cursor-pointer hover:bg-slate-800/40 transition-colors" onClick={() => onChange(!checked)}>
    <span className="font-bold text-slate-300 text-sm">{label}</span>
    <div className={`w-12 h-6 flex items-center rounded-full p-1 duration-300 ease-in-out ${checked ? 'bg-amber-500' : 'bg-slate-700'}`}>
      <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${checked ? 'translate-x-0' : '-translate-x-6'}`}></div>
    </div>
  </div>
);

// --- DATA PACKS WITH ASSOCIATIVE HINTS (HARDER) ---
// Structure: {w: word, h: associative hint}
const DATA_PACKS = {
  'חיות 🦁': [
    {w: 'אריה', h: 'אפריקה'}, {w: 'פיל', h: 'כבד'}, {w: 'ג׳ירפה', h: 'גובה'}, {w: 'כלב', h: 'חבר'}, {w: 'חתול', h: 'בית'}, 
    {w: 'נחש', h: 'זוחל'}, {w: 'דולפין', h: 'ים'}, {w: 'נשר', h: 'שמיים'}, {w: 'פינגווין', h: 'קור'}, {w: 'קנגורו', h: 'קפיצות'},
    {w: 'עצלן', h: 'עצים'}, {w: 'זברה', h: 'אפריקה'}, {w: 'טיגריס', h: 'טורף'}, {w: 'היפופוטם', h: 'מים'}, {w: 'צפרדע', h: 'ירוק'},
    {w: 'זיקית', h: 'צבעים'}, {w: 'קיפוד', h: 'גינה'}, {w: 'תמנון', h: 'ים'}, {w: 'כריש', h: 'טורף'}, {w: 'ינשוף', h: 'לילה'},
    {w: 'גמל', h: 'מדבר'}, {w: 'אוגר', h: 'כלוב'}, {w: 'סוס', h: 'רכיבה'}, {w: 'דוב קוטב', h: 'שלג'}, {w: 'קואלה', h: 'אוסטרליה'},
    {w: 'פנדה', h: 'אסיה'}, {w: 'גורילה', h: 'חזק'}, {w: 'זאב', h: 'לילה'}, {w: 'שועל', h: 'זנב'}, {w: 'ארנב', h: 'אוזניים'}
  ],
  'מאכלים 🍕': [
    {w: 'פיצה', h: 'איטליה'}, {w: 'פלאפל', h: 'פיתה'}, {w: 'סושי', h: 'אסיה'}, {w: 'המבורגר', h: 'אמריקה'}, {w: 'גלידה', h: 'קינוח'},
    {w: 'שוקולד', h: 'מתוק'}, {w: 'פסטה', h: 'איטליה'}, {w: 'סלט', h: 'בריא'}, {w: 'שווארמה', h: 'בשר'}, {w: 'חומוס', h: 'פיתה'},
    {w: 'ג׳חנון', h: 'בצק'}, {w: 'שקשוקה', h: 'מחבת'}, {w: 'סטייק', h: 'על האש'}, {w: 'צ׳יפס', h: 'תוספת'}, {w: 'אבטיח', h: 'קיץ'},
    {w: 'פופקורן', h: 'קולנוע'}, {w: 'סביח', h: 'פיתה'}, {w: 'בורקס', h: 'מאפייה'}, {w: 'קוסקוס', h: 'בישול ארוך'}, {w: 'מלוואח', h: 'תימן'},
    {w: 'טקו', h: 'מקסיקו'}, {w: 'פנקייק', h: 'בוקר'}, {w: 'קרמבו', h: 'חורף'}, {w: 'שניצל', h: 'מטוגן'}, {w: 'עוגת גבינה', h: 'קינוח'}
  ],
  'מדינות 🌍': [
    {w: 'ישראל', h: 'המזרח התיכון'}, {w: 'צרפת', h: 'אירופה'}, {w: 'ארצות הברית', h: 'גדול'}, {w: 'יפן', h: 'אסיה'}, {w: 'איטליה', h: 'אירופה'},
    {w: 'ברזיל', h: 'דרום אמריקה'}, {w: 'מצרים', h: 'שכנים'}, {w: 'סין', h: 'אסיה'}, {w: 'רוסיה', h: 'קר'}, {w: 'אוסטרליה', h: 'רחוק'},
    {w: 'הודו', h: 'אסיה'}, {w: 'מקסיקו', h: 'אמריקה'}, {w: 'קנדה', h: 'צפון'}, {w: 'יוון', h: 'קרוב'}, {w: 'תאילנד', h: 'חופשה'},
    {w: 'ארגנטינה', h: 'דרום אמריקה'}, {w: 'גרמניה', h: 'אירופה'}, {w: 'ספרד', h: 'אירופה'}, {w: 'אנגליה', h: 'אי'}, {w: 'טורקיה', h: 'קרוב'}
  ],
  'מקצועות 💼': [
    {w: 'רופא', h: 'בריאות'}, {w: 'שוטר', h: 'מדים'}, {w: 'מורה', h: 'בית ספר'}, {w: 'כבאי', h: 'הצלה'}, {w: 'טייס', h: 'תחבורה'},
    {w: 'טבח', h: 'אוכל'}, {w: 'מתכנת', h: 'משרד'}, {w: 'נגר', h: 'עבודת יד'}, {w: 'עורך דין', h: 'משרד'}, {w: 'זמר', h: 'במה'},
    {w: 'ליצן', h: 'ילדים'}, {w: 'וטרינר', h: 'חיות'}, {w: 'ספר', h: 'ראש'}, {w: 'נהג מונית', h: 'כביש'}, {w: 'מציל', h: 'ים'},
    {w: 'גנן', h: 'בחוץ'}, {w: 'אדריכל', h: 'משרד'}, {w: 'חשמלאי', h: 'בתים'}, {w: 'מאמן כושר', h: 'ספורט'}, {w: 'מדען', h: 'חכם'}
  ],
  'חפצים בבית 🏠': [
    {w: 'מקרר', h: 'מטבח'}, {w: 'טלוויזיה', h: 'סלון'}, {w: 'מיטה', h: 'חדר שינה'}, {w: 'ספה', h: 'נוח'}, {w: 'מחשב', h: 'חשמל'},
    {w: 'שולחן', h: 'רהיט'}, {w: 'מזגן', h: 'קיר'}, {w: 'תנור', h: 'מטבח'}, {w: 'מראה', h: 'קיר'}, {w: 'שעון', h: 'קיר'},
    {w: 'מכונת כביסה', h: 'ניקיון'}, {w: 'אסלה', h: 'מים'}, {w: 'מקלחת', h: 'מים'}, {w: 'קומקום', h: 'מטבח'}, {w: 'טוסטר', h: 'מטבח'},
    {w: 'ארון בגדים', h: 'חדר'}, {w: 'מנורה', h: 'תקרה'}, {w: 'כרית', h: 'רך'}, {w: 'שטיח', h: 'רצפה'}, {w: 'מיקרוגל', h: 'מטבח'}
  ],
  'צה"ל 🪖': [
    {w: 'מפקד', h: 'סמכות'}, {w: 'טירונות', h: 'התחלה'}, {w: 'מטווח', h: 'רעש'}, {w: 'נשק', h: 'ברזל'}, {w: 'מדים', h: 'לבוש'},
    {w: 'כומתה', h: 'ראש'}, {w: 'דסקית', h: 'צוואר'}, {w: 'פזצט"א', h: 'שטח'}, {w: 'מסדר', h: 'משמעת'}, {w: 'חדר אוכל', h: 'אוכל'},
    {w: 'שמירה', h: 'לילה'}, {w: 'אפטר', h: 'יציאה'}, {w: 'רגילה', h: 'חופש'}, {w: 'מילואים', h: 'אזרח'}, {w: 'צו ראשון', h: 'מבחנים'},
    {w: 'גיבוש', h: 'כושר'}, {w: 'בקו"ם', h: 'התחלה'}, {w: 'חוגר', h: 'כיס'}, {w: 'דרגה', h: 'כתף'}, {w: 'פק"ל', h: 'ציוד'}
  ],
  'מותגים 🏷️': [
    {w: 'נייקי', h: 'ספורט'}, {w: 'אדידס', h: 'ספורט'}, {w: 'אפל', h: 'טכנולוגיה'}, {w: 'סמסונג', h: 'טכנולוגיה'}, {w: 'קוקה קולה', h: 'שתייה'},
    {w: 'מקדונלדס', h: 'אוכל'}, {w: 'איקאה', h: 'בית'}, {w: 'גוגל', h: 'אינטרנט'}, {w: 'פייסבוק', h: 'אינטרנט'}, {w: 'אמזון', h: 'קניות'},
    {w: 'נטפליקס', h: 'טלוויזיה'}, {w: 'דיסני', h: 'ילדים'}, {w: 'טויוטה', h: 'רכב'}, {w: 'מרצדס', h: 'רכב'}, {w: 'טסלה', h: 'רכב'},
    {w: 'גוצ׳י', h: 'אופנה'}, {w: 'זארה', h: 'קניון'}, {w: 'קסטרו', h: 'אופנה'}, {w: 'פוקס', h: 'בגדים'}, {w: 'תנובה', h: 'אוכל'}
  ],
  'גיבורי על 🦸‍♂️': [
    {w: 'ספיידרמן', h: 'עיר'}, {w: 'באטמן', h: 'עשיר'}, {w: 'סופרמן', h: 'חזק'}, {w: 'וונדר וומן', h: 'לוחמת'}, {w: 'איירון מן', h: 'טכנולוגיה'},
    {w: 'קפטן אמריקה', h: 'חייל'}, {w: 'הענק הירוק', h: 'כועס'}, {w: 'ת׳ור', h: 'אל'}, {w: 'האלמנה השחורה', h: 'מרגלת'}, {w: 'הפנתר השחור', h: 'מלך'},
    {w: 'אקוומן', h: 'מים'}, {w: 'דדפול', h: 'מצחיק'}, {w: 'וולברין', h: 'עצבני'}, {w: 'הפלאש', h: 'מהיר'}, {w: 'גרוט', h: 'צמח'}
  ],
  'דמויות דיסני/פיקסאר 🏰': [
    {w: 'מיקי מאוס', h: 'קלאסי'}, {w: 'אלזה', h: 'נסיכה'}, {w: 'סימבה', h: 'חיה'}, {w: 'אלאדין', h: 'נסיך'}, {w: 'בת הים הקטנה', h: 'מים'},
    {w: 'שרק', h: 'ירוק'}, {w: 'באז שנות אור', h: 'צעצוע'}, {w: 'וודי', h: 'צעצוע'}, {w: 'נימו', h: 'ים'}, {w: 'מואנה', h: 'ים'},
    {w: 'שלגיה', h: 'נסיכה'}, {w: 'פו הדב', h: 'חיה'}, {w: 'סטיץ׳', h: 'חייזר'}, {w: 'במבי', h: 'יער'}, {w: 'פיטר פן', h: 'ילד'}
  ]
};

export default function App() {
  const [gameState, setGameState] = useState('setup'); 
  const [players, setPlayers] = useState([]);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [impostorCount, setImpostorCount] = useState(1);
  const [gameData, setGameData] = useState(null);
  const [revealIndex, setRevealIndex] = useState(0);
  const [isCardVisible, setIsCardVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [enableHint, setEnableHint] = useState(false); 
  const [usedWords, setUsedWords] = useState({});

  const totalWordsCount = useMemo(() => Object.values(DATA_PACKS).reduce((acc, curr) => acc + curr.length, 0), []);
  
  // Logic for Max Impostors (Min 5 players for 2 impostors)
  const maxImpostors = Math.max(1, Math.floor((players.length - 1) / 2));

  // --- Handlers ---
  
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullScreen(true)).catch((e) => console.log(e));
    } else {
      document.exitFullscreen().then(() => setIsFullScreen(false));
    }
  };

  const addPlayer = (e) => {
    e.preventDefault();
    if (newPlayerName.trim()) {
      setPlayers(prev => [...prev, { name: newPlayerName.trim(), id: Date.now() }]);
      setNewPlayerName('');
    }
  };

  const removePlayer = (id) => {
    const newPlayers = players.filter(p => p.id !== id);
    setPlayers(newPlayers);
    // Adjust impostor count if needed
    const newMax = Math.max(1, Math.floor((newPlayers.length - 1) / 2));
    if (impostorCount > newMax) setImpostorCount(newMax);
  };

  const getUniqueGameItem = (category) => {
    const allItems = DATA_PACKS[category];
    const used = usedWords[category] || [];
    
    // Filter items based on the 'w' (word) property
    let availableItems = allItems.filter(item => !used.includes(item.w));
    
    if (availableItems.length === 0) {
      availableItems = allItems;
      setUsedWords(prev => ({ ...prev, [category]: [] }));
    }

    const selectedItem = availableItems[Math.floor(Math.random() * availableItems.length)];
    
    setUsedWords(prev => {
      const currentUsed = prev[category] || [];
      const newList = availableItems.length === allItems.length ? [selectedItem.w] : [...currentUsed, selectedItem.w];
      return { ...prev, [category]: newList };
    });

    return selectedItem;
  };

  const startGame = () => {
    if (players.length < 3) return;
    const categories = Object.keys(DATA_PACKS);
    const selectedCategory = categories[Math.floor(Math.random() * categories.length)];
    
    // Get item object {w, h}
    const selectedItem = getUniqueGameItem(selectedCategory);

    let shuffledPlayers = [...players].sort(() => 0.5 - Math.random());
    let roles = shuffledPlayers.map(p => ({ ...p, role: 'citizen' }));
    
    const safeImpostorCount = Math.min(impostorCount, Math.floor((players.length - 1) / 2));

    let indices = Array.from({ length: roles.length }, (_, i) => i);
    indices = indices.sort(() => 0.5 - Math.random());
    
    for (let i = 0; i < safeImpostorCount; i++) {
      roles[indices[i]].role = 'impostor';
    }

    setGameData({
      players: roles,
      category: selectedCategory,
      word: selectedItem.w,
      hint: selectedItem.h,
      starter: roles[Math.floor(Math.random() * roles.length)].name
    });

    setRevealIndex(0);
    setIsCardVisible(false);
    setTimeLeft(300);
    setIsTimerRunning(false);
    setGameState('reveal');
  };

  const nextReveal = () => {
    setIsCardVisible(false);
    if (revealIndex + 1 < gameData.players.length) {
      setRevealIndex(revealIndex + 1);
    } else {
      setGameState('playing');
      setIsTimerRunning(true);
    }
  };

  useEffect(() => {
    let interval = null;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  const formatTime = (s) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // --- Screens ---

  // 1. SETUP
  if (gameState === 'setup') {
    return (
      <div className="min-h-screen bg-[#0f172a] text-slate-100 font-sans selection:bg-fuchsia-500 selection:text-white pb-6" dir="rtl">
        {/* Fullscreen Button */}
        <button 
          onClick={toggleFullScreen}
          className="absolute top-4 left-4 z-50 p-2 bg-slate-800 rounded-full text-slate-400 hover:text-white shadow-lg border border-white/10 active:scale-95 transition-transform"
          title="מסך מלא"
        >
          {isFullScreen ? <Minimize size={20} /> : <Maximize size={20} />}
        </button>

        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute top-1/2 -left-24 w-72 h-72 bg-fuchsia-600/20 rounded-full blur-3xl opacity-50"></div>
        </div>

        <div className="relative max-w-md mx-auto p-6 min-h-screen flex flex-col z-10">
          <header className="text-center py-6 space-y-2">
            <div className="inline-flex p-4 rounded-full bg-slate-800/50 ring-1 ring-white/10 mb-4 shadow-lg shadow-violet-500/10 backdrop-blur-sm">
              <EyeOff size={40} className="text-fuchsia-400" />
            </div>
            <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-violet-200 to-fuchsia-300 drop-shadow-sm">
              המתחזה
            </h1>
            <div className="flex justify-center items-center gap-2 text-xs text-slate-500 font-mono mt-2">
              <Database size={12} />
              <span>מאגר מילים: {totalWordsCount}</span>
            </div>
          </header>

          <Card className="flex-1 flex flex-col gap-5">
            <h2 className="text-xl font-bold flex items-center gap-2 text-violet-200">
              <Users className="text-fuchsia-400" size={20} />
              רשימת סוכנים ({players.length})
            </h2>
            
            <form onSubmit={addPlayer} className="relative group">
              <input
                type="text"
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                placeholder="שם סוכן חדש..."
                autoComplete="off"
                className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-fuchsia-500 outline-none transition-all placeholder-slate-500"
              />
              <button 
                type="submit"
                disabled={!newPlayerName.trim()}
                className="absolute left-2 top-2 bottom-2 bg-slate-800 hover:bg-violet-600 text-violet-300 hover:text-white p-2.5 rounded-xl transition-all disabled:opacity-0"
              >
                <UserPlus size={20} />
              </button>
            </form>

            <div className="flex-1 overflow-y-auto space-y-2 max-h-[30vh] custom-scrollbar pr-1">
              {players.length === 0 && (
                <div className="text-center py-8 opacity-40 border-2 border-dashed border-slate-700 rounded-2xl">
                  <UserPlus className="mx-auto mb-2" size={32} />
                  <p>אין שחקנים עדיין</p>
                </div>
              )}
              {players.map((p) => (
                <div key={p.id} className="flex justify-between items-center bg-slate-900/30 border border-white/5 px-4 py-3 rounded-xl hover:border-violet-500/30 transition-colors group">
                  <span className="font-medium">{p.name}</span>
                  <button onClick={() => removePlayer(p.id)} className="opacity-40 group-hover:opacity-100 hover:text-red-400 p-1">✕</button>
                </div>
              ))}
            </div>

            <div className="space-y-4 pt-2">
              {/* Impostor Slider */}
              <div className="bg-slate-900/50 p-4 rounded-2xl border border-white/5 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-slate-300 flex items-center gap-2">
                    <Skull size={16} className="text-red-400"/>
                    מספר מתחזים
                  </span>
                  <span className="bg-slate-800 px-3 py-1 rounded-lg text-red-400 font-bold font-mono border border-white/5">
                    {impostorCount}
                  </span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max={Math.max(1, maxImpostors)} // Fix for visual consistency
                  value={impostorCount} 
                  onChange={(e) => setImpostorCount(parseInt(e.target.value))}
                  className={`w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-fuchsia-500 ${players.length < 5 ? 'opacity-50 grayscale' : ''}`}
                  disabled={players.length < 5} // Disable if not enough players for >1 impostor
                />
                <div className="text-xs text-slate-500 text-center">
                  {players.length < 5 && "מינימום 5 שחקנים כדי להוסיף מתחזים נוספים"}
                </div>
              </div>

              {/* Hint Toggle */}
              <Toggle 
                label="אפשר רמז למתחזה (אסוציאציה)" 
                checked={enableHint} 
                onChange={setEnableHint} 
              />
            </div>

            <Button onClick={startGame} disabled={players.length < 3} className="mt-2">
              <Play size={20} fill="currentColor" />
              התחל משימה
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  // 2. REVEAL
  if (gameState === 'reveal') {
    const currentPlayer = gameData.players[revealIndex];
    const isImpostor = currentPlayer.role === 'impostor';

    return (
      <div className="min-h-screen bg-[#0f172a] text-slate-100 flex flex-col font-sans" dir="rtl">
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto w-full">
          {!isCardVisible ? (
            <div className="animate-in fade-in zoom-in duration-300 space-y-8 w-full">
               <div className="relative w-32 h-32 mx-auto">
                  <div className="absolute inset-0 bg-violet-500 rounded-full blur-2xl opacity-20 animate-pulse"></div>
                  <div className="relative bg-gradient-to-b from-slate-800 to-slate-900 rounded-full w-full h-full flex items-center justify-center ring-1 ring-white/10 shadow-2xl">
                    <Fingerprint size={64} className="text-violet-400" />
                  </div>
               </div>
               
               <div>
                  <div className="text-slate-400 text-sm tracking-widest uppercase mb-2 font-semibold">סיווג בטחוני: סודי ביותר</div>
                  <h2 className="text-2xl text-slate-300">העבירו את המכשיר ל</h2>
                  <h1 className="text-5xl font-black mt-2 text-transparent bg-clip-text bg-gradient-to-r from-violet-200 to-fuchsia-200">
                    {currentPlayer.name}
                  </h1>
               </div>
               
               <Button onClick={() => setIsCardVisible(true)} variant="primary">
                 <Eye size={20} />
                 אני {currentPlayer.name}, חשוף מידע
               </Button>
            </div>
          ) : (
            <Card className={`w-full animate-in slide-in-from-bottom-10 duration-500 border-2 ${isImpostor ? 'border-red-500/50 shadow-red-900/20' : 'border-emerald-500/50 shadow-emerald-900/20'}`}>
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#0f172a] p-3 rounded-full border border-slate-700 shadow-xl">
                 {isImpostor ? <Skull size={40} className="text-red-500" /> : <Check size={40} className="text-emerald-500" />}
              </div>

              <div className="pt-8 space-y-6">
                <div className="space-y-1">
                  <span className="text-xs font-bold tracking-[0.2em] text-slate-500 uppercase">זהות נוכחית</span>
                  <h2 className={`text-4xl font-black ${isImpostor ? 'text-red-500' : 'text-emerald-400'}`}>
                    {isImpostor ? 'מתחזה' : 'אזרח תמים'}
                  </h2>
                </div>

                <div className="py-6 px-4 bg-slate-900/50 rounded-2xl border border-white/5 space-y-4">
                  {isImpostor ? (
                    <>
                      <p className="text-red-200 font-medium">המטרה שלך: לגלות את המילה ולהיטמע בשיחה.</p>
                      <div className="pt-4 border-t border-white/10">
                        <span className="text-xs text-slate-500 block mb-1">רמז לקטגוריה:</span>
                        <span className="text-lg font-bold text-slate-300">{gameData.category}</span>
                        
                        {/* HINT LOGIC - ASSOCIATIVE */}
                        {enableHint && (
                          <div className="mt-4 pt-4 border-t border-white/10 flex flex-col items-center animate-in fade-in slide-in-from-top-2">
                             <div className="flex items-center gap-2 text-amber-300 mb-1">
                               <Lightbulb size={16} />
                               <span className="text-xs font-bold uppercase tracking-wider">רמז מודיעיני</span>
                             </div>
                             <div className="bg-amber-500/10 px-4 py-2 rounded-lg border border-amber-500/20">
                               <span className="text-xl font-bold text-amber-100">{gameData.hint}</span>
                             </div>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <span className="text-xs text-emerald-500/70 block mb-1 font-bold">מילת הקוד</span>
                        <div className="text-3xl font-black text-white tracking-wide">{gameData.word}</div>
                      </div>
                      <div className="pt-2">
                        <span className="inline-block px-3 py-1 bg-emerald-500/10 rounded-full text-emerald-300 text-sm">
                          {gameData.category}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                <Button onClick={nextReveal} variant="secondary">
                  <EyeOff size={20} />
                  הסתר מידע
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    );
  }

  // 3. PLAYING
  if (gameState === 'playing') {
    return (
      <div className="min-h-screen bg-[#0f172a] text-slate-100 flex flex-col font-sans relative overflow-hidden" dir="rtl">
        <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-violet-600"></div>
        
        <header className="px-6 py-4 flex justify-between items-center z-10">
          <div className="bg-slate-800/80 backdrop-blur rounded-full px-4 py-2 border border-slate-700 flex items-center gap-3">
            <Timer size={18} className={isTimerRunning ? "text-fuchsia-400 animate-pulse" : "text-slate-400"} />
            <span className="font-mono text-xl font-bold tracking-wider">{formatTime(timeLeft)}</span>
          </div>
          <button onClick={() => setGameState('setup')} className="bg-slate-800/50 p-3 rounded-full hover:bg-slate-700 transition-colors">
            <RotateCcw size={20} className="text-slate-300" />
          </button>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center p-6 space-y-8 z-10 w-full max-w-md mx-auto">
           
           <div className="text-center space-y-2 animate-in slide-in-from-top-4 duration-700">
              <span className="inline-block px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-bold tracking-wider uppercase">
                נושא השיחה
              </span>
              <h2 className="text-4xl font-black text-white leading-tight drop-shadow-xl">
                {gameData.category}
              </h2>
           </div>

           <div className="relative w-full">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 opacity-10 blur-xl rounded-3xl"></div>
              <Card className="relative text-center border-white/10">
                 <p className="text-slate-400 text-sm mb-3">פותח את הסיבוב</p>
                 <div className="flex items-center justify-center gap-3">
                    <Crown size={32} className="text-amber-400 drop-shadow-lg" />
                    <span className="text-3xl font-bold text-white">{gameData.starter}</span>
                 </div>
                 <div className="mt-4 pt-4 border-t border-slate-700/50 flex items-center justify-center gap-2 text-slate-500 text-sm">
                    <RotateCcw size={14} className="scale-x-[-1]" />
                    <span>המשיכו עם כיוון השעון</span>
                 </div>
              </Card>
           </div>

           <div className="bg-slate-900/50 p-5 rounded-2xl border border-white/5 text-sm text-slate-400 leading-relaxed text-center">
              <Sparkles className="inline-block text-fuchsia-400 mb-2" size={20} />
              <p>שאלו שאלות, חשדו בכולם. המתחזה לא יודע את המילה, אבל הוא מקשיב לכל דבר שאתם אומרים.</p>
           </div>

        </main>

        <div className="p-6 z-10 w-full max-w-md mx-auto">
          <Button onClick={() => setGameState('result')} variant="danger">
            <Fingerprint size={24} />
            עצור והצבע
          </Button>
        </div>
      </div>
    );
  }

  // 4. RESULT
  if (gameState === 'result') {
    const impostors = gameData.players.filter(p => p.role === 'impostor');

    return (
      <div className="min-h-screen bg-[#0f172a] text-slate-100 flex flex-col items-center justify-center p-6 font-sans" dir="rtl">
        <div className="w-full max-w-md space-y-6 animate-in zoom-in duration-300">
          
          <div className="text-center mb-8">
            <Trophy className="mx-auto text-yellow-500 mb-4 drop-shadow-lg" size={48} />
            <h1 className="text-3xl font-black text-white">סיכום משימה</h1>
          </div>
          
          <Card className="text-center border-emerald-500/30 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)]"></div>
            <p className="text-emerald-500/80 text-xs font-bold tracking-[0.2em] uppercase mb-2">המילה הסודית</p>
            <p className="text-5xl font-black text-white drop-shadow-2xl tracking-wide">{gameData.word}</p>
            <p className="text-slate-400 mt-2 text-sm bg-slate-900/40 inline-block px-3 py-1 rounded-full">{gameData.category}</p>
          </Card>

          <Card className="border-red-500/30 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)]"></div>
            <div className="flex items-center justify-center gap-2 mb-4">
              <Skull className="text-red-500" />
              <h2 className="text-xl font-bold text-white">זהות המתחזים</h2>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {impostors.map(imp => (
                <div key={imp.id} className="bg-red-500/10 text-red-200 px-5 py-2 rounded-xl font-bold border border-red-500/20 shadow-lg">
                  {imp.name}
                </div>
              ))}
            </div>
          </Card>

          <div className="pt-6 flex gap-4">
             <Button onClick={startGame} variant="success">
               <Shuffle size={20} />
               סיבוב מהיר
             </Button>
             <Button onClick={() => setGameState('setup')} variant="secondary">
               <RotateCcw size={20} />
               הגדרות
             </Button>
          </div>

        </div>
      </div>
    );
  }

  return null;
}
