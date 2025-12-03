import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, Eye, EyeOff, UserPlus, Play, RotateCcw, 
  HelpCircle, Check, Crown, Skull, Fingerprint, 
  Sparkles, Timer, Trophy, Shuffle, Database
} from 'lucide-react';

// --- רכיבי UI (מחוץ לקומפוננטה הראשית למניעת באג הפוקוס) ---

const Card = ({ children, className = "" }) => (
  <div className={`bg-slate-800/80 backdrop-blur-md border border-slate-700/50 shadow-xl rounded-3xl p-6 ${className}`}>
    {children}
  </div>
);

const Button = ({ onClick, disabled, variant = 'primary', children, className = "" }) => {
  const baseStyle = "w-full font-bold py-4 rounded-2xl shadow-lg transform active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed select-none";
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

// --- DATA PACKS (MASSIVE EXPANSION) ---
const DATA_PACKS = {
  'חיות 🦁': [
    'אריה', 'פיל', 'ג׳ירפה', 'כלב', 'חתול', 'נחש', 'דולפין', 'נשר', 'פינגווין', 'קנגורו', 
    'עצלן', 'זברה', 'טיגריס', 'היפופוטם', 'צפרדע', 'זיקית', 'קיפוד', 'תמנון', 'כריש', 'ינשוף', 
    'גמל', 'אוגר', 'סוס', 'דוב קוטב', 'קואלה', 'פנדה', 'גורילה', 'זאב', 'שועל', 'ארנב', 
    'צבי', 'תנין', 'לוויתן', 'עטלף', 'טווס', 'פלמינגו', 'קרנף', 'סנאי', 'חזיר בר', 'יתוש',
    'דבורה', 'נמלה', 'עקרב', 'גמל שלמה', 'פרפר', 'גחלילית', 'חסידה', 'דרור', 'יען', 'פומה'
  ],
  'מאכלים 🍕': [
    'פיצה', 'פלאפל', 'סושי', 'המבורגר', 'גלידה', 'שוקולד', 'פסטה', 'סלט', 'שווארמה', 'חומוס', 
    'ג׳חנון', 'שקשוקה', 'סטייק', 'צ׳יפס', 'אבטיח', 'פופקורן', 'סביח', 'בורקס', 'קוסקוס', 'מלוואח', 
    'טקו', 'פנקייק', 'קרמבו', 'שניצל', 'עוגת גבינה', 'קרואסון', 'לזניה', 'מרק עוף', 'דג מרוקאי', 'חמין',
    'פתיתים', 'אורז', 'קובה', 'ממולאים', 'בייגל', 'דונאטס', 'סנדוויץ׳ טונה', 'טוסט', 'נקניקיה בלחמניה', 'תירס חם',
    'ארטיק', 'וופל בלגי', 'נודלס', 'מוקפץ', 'דים סאם', 'חריימה', 'רגל קרושה', 'כבד קצוץ', 'מצה בריי', 'סופגניה'
  ],
  'מדינות 🌍': [
    'ישראל', 'צרפת', 'ארצות הברית', 'יפן', 'איטליה', 'ברזיל', 'מצרים', 'סין', 'רוסיה', 'אוסטרליה', 
    'הודו', 'מקסיקו', 'קנדה', 'יוון', 'תאילנד', 'ארגנטינה', 'גרמניה', 'ספרד', 'אנגליה', 'טורקיה', 
    'קוריאה הדרומית', 'מרוקו', 'דרום אפריקה', 'שוויץ', 'הולנד', 'בלגיה', 'פורטוגל', 'שבדיה', 'נורבגיה', 'דנמרק',
    'איסלנד', 'אירלנד', 'סקוטלנד', 'פולין', 'הונגריה', 'צ׳כיה', 'אוקראינה', 'ירדן', 'ערב הסעודית', 'איחוד האמירויות',
    'ניו זילנד', 'וייטנאם', 'קולומביה', 'צ׳ילה', 'פרו', 'קובה', 'ג׳מייקה', 'קניה', 'ניגריה', 'אתיופיה'
  ],
  'מקצועות 💼': [
    'רופא', 'שוטר', 'מורה', 'כבאי', 'טייס', 'טבח', 'מתכנת', 'נגר', 'עורך דין', 'זמר', 
    'ליצן', 'וטרינר', 'ספר', 'נהג מונית', 'מציל', 'גנן', 'אדריכל', 'חשמלאי', 'מאמן כושר', 'מדען', 
    'אסטרונאוט', 'שופט', 'מלצר', 'קוסם', 'רופא שיניים', 'אינסטלטור', 'מוסכניק', 'נהג אוטובוס', 'דייל', 'שחקן כדורגל',
    'ראש ממשלה', 'עיתונאי', 'צלם', 'דוגמנית', 'סופר', 'צייר', 'פסיכולוג', 'רוקח', 'קופאי', 'מאבטח',
    'חייל', 'מנופאי', 'חקלאי', 'דייג', 'מציל בבריכה', 'מדריך טיולים', 'מרצה', 'אחות', 'פרמדיק', 'די ג׳יי'
  ],
  'חפצים בבית 🏠': [
    'מקרר', 'טלוויזיה', 'מיטה', 'ספה', 'מחשב', 'שולחן', 'מזגן', 'תנור', 'מראה', 'שעון', 
    'מכונת כביסה', 'אסלה', 'מקלחת', 'קומקום', 'טוסטר', 'ארון בגדים', 'מנורה', 'כרית', 'שטיח', 'מיקרוגל', 
    'מברשת שיניים', 'מסרק', 'עציץ', 'מטאטא', 'מגב', 'דלי', 'סיר', 'מחבת', 'צלחת', 'כוס',
    'מזלג', 'סכין', 'כף', 'מגהץ', 'שואב אבק', 'פן לשיער', 'מטען לטלפון', 'שלט', 'וילון', 'תמונה',
    'כיסא', 'שידה', 'מגירה', 'ברז', 'כיור', 'נייר טואלט', 'שמפו', 'סבון', 'מגבת', 'סל כביסה'
  ],
  'צה"ל 🪖': [
    'מפקד', 'טירונות', 'מטווח', 'נשק', 'מדים', 'כומתה', 'דסקית', 'פזצט"א', 'מסדר', 'חדר אוכל',
    'שמירה', 'אפטר', 'רגילה', 'מילואים', 'צו ראשון', 'גיבוש', 'בקו"ם', 'חוגר', 'דרגה', 'פק"ל',
    'נגמ"ש', 'טנק', 'מטוס קרב', 'כיפת ברזל', 'מחסנית', 'קסדה', 'אפוד', 'מפקד בסיס', 'רס"ר', 'שק"ם',
    'גולני', 'צנחנים', 'חיל האוויר', 'חיל הים', 'מודיעין', 'מגלן', 'סיירת מטכ"ל', '8200', 'קצין', 'נגד'
  ],
  'מותגים 🏷️': [
    'נייקי', 'אדידס', 'אפל', 'סמסונג', 'קוקה קולה', 'מקדונלדס', 'איקאה', 'גוגל', 'פייסבוק', 'אמזון',
    'נטפליקס', 'דיסני', 'טויוטה', 'מרצדס', 'טסלה', 'גוצ׳י', 'זארה', 'קסטרו', 'פוקס', 'תנובה',
    'אוסם', 'שטראוס', 'עלית', 'ביסלי', 'במבה', 'שופרסל', 'רמי לוי', 'סופר פארם', 'בנק הפועלים', 'אל על',
    'לגו', 'סוני', 'פלייסטיישן', 'אקס בוקס', 'נינטנדו', 'טוויטר', 'טיקטוק', 'אינסטגרם', 'יוטיוב', 'זום'
  ],
  'מקומות בישראל 🇮🇱': [
    'הכותל המערבי', 'החרמון', 'ים המלח', 'הכנרת', 'אילת', 'מצדה', 'שוק מחנה יהודה', 'דיזנגוף סנטר', 'הספארי', 'לונה פארק', 
    'הגנים הבהאיים', 'חוף הים', 'הכנסת', 'נתב״ג', 'עזריאלי', 'פארק הירקון', 'בניאס', 'קיסריה', 'נמל יפו', 'מכתש רמון',
    'ראש הנקרה', 'עין גדי', 'יד ושם', 'הר הבית', 'שרונה מרקט', 'הסינמה סיטי', 'סופרלנד', 'גן החיות התנ"כי', 'נמל תל אביב', 'שוק הכרמל'
  ],
  'דמויות תנ"כיות 📜': [
    'אדם וחווה', 'נח', 'אברהם אבינו', 'שרה אימנו', 'יצחק', 'רבקה', 'יעקב', 'רחל', 'לאה', 'יוסף',
    'משה רבנו', 'אהרון הכהן', 'מרים', 'יהושע בן נון', 'שמשון הגיבור', 'דלילה', 'שמואל הנביא', 'שאול המלך', 'דוד המלך', 'גוליית',
    'שלמה המלך', 'אליהו הנביא', 'יונה הנביא', 'אסתר המלכה', 'מרדכי היהודי', 'דניאל', 'איוב', 'קין והבל', 'פרעה', 'בלעם'
  ],
  'גיבורי על 🦸‍♂️': [
    'ספיידרמן', 'באטמן', 'סופרמן', 'וונדר וומן', 'איירון מן', 'קפטן אמריקה', 'הענק הירוק', 'ת׳ור', 'האלמנה השחורה', 'הפנתר השחור', 
    'אקוומן', 'דדפול', 'וולברין', 'הפלאש', 'גרוט', 'קפטן מארוול', 'דוקטור סטריינג׳', 'אנטמן', 'סייבורג', 'גרין לנטרן',
    'הג׳וקר', 'תנוס', 'לוקי', 'הארלי קווין', 'רובין', 'סטורם', 'מגנטו', 'פרופסור אקס', 'סייקלופס', 'ונום'
  ],
  'דמויות דיסני/פיקסאר 🏰': [
    'מיקי מאוס', 'אלזה', 'סימבה', 'אלאדין', 'בת הים הקטנה', 'שרק', 'באז שנות אור', 'וודי', 'נימו', 'מואנה', 
    'שלגיה', 'פו הדב', 'סטיץ׳', 'במבי', 'פיטר פן', 'פינוקיו', 'מולאן', 'הרקולס', 'טימון ופומבה', 'מיניון',
    'גרו (גנוב על הירח)', 'אולף', 'אנה', 'מלך האריות', 'רפונזל', 'סינדרלה', 'היפה והחיה', 'טרזן', 'דונלד דאק', 'גופי'
  ]
};

export default function App() {
  const [gameState, setGameState] = useState('setup'); // setup, reveal, playing, result
  const [players, setPlayers] = useState([]);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [impostorCount, setImpostorCount] = useState(1);
  const [gameData, setGameData] = useState(null);
  const [revealIndex, setRevealIndex] = useState(0);
  const [isCardVisible, setIsCardVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  
  // New State for tracking used words to prevent repeats
  const [usedWords, setUsedWords] = useState({});

  // Calculate Total Words for Display
  const totalWordsCount = useMemo(() => {
    return Object.values(DATA_PACKS).reduce((acc, curr) => acc + curr.length, 0);
  }, []);

  // --- Handlers ---
  const addPlayer = (e) => {
    e.preventDefault();
    if (newPlayerName.trim()) {
      setPlayers(prev => [...prev, { name: newPlayerName.trim(), id: Date.now() }]);
      setNewPlayerName('');
    }
  };

  const removePlayer = (id) => {
    setPlayers(players.filter(p => p.id !== id));
  };

  const getUniqueWord = (category) => {
    const allWords = DATA_PACKS[category];
    const used = usedWords[category] || [];
    
    // Find words that haven't been used yet
    let availableWords = allWords.filter(word => !used.includes(word));
    
    // If all words used, reset the used list for this category
    if (availableWords.length === 0) {
      availableWords = allWords;
      setUsedWords(prev => ({ ...prev, [category]: [] })); // Reset in state (async)
      // For current selection, we assume reset happened
    }

    const selectedWord = availableWords[Math.floor(Math.random() * availableWords.length)];
    
    // Update used words
    setUsedWords(prev => {
      const currentUsed = prev[category] || [];
      // If we just reset (all were used), start fresh, otherwise append
      const newList = availableWords.length === allWords.length 
        ? [selectedWord] 
        : [...currentUsed, selectedWord];
      
      return { ...prev, [category]: newList };
    });

    return selectedWord;
  };

  const startGame = () => {
    if (players.length < 3) return;
    
    // 1. Select Category
    const categories = Object.keys(DATA_PACKS);
    const selectedCategory = categories[Math.floor(Math.random() * categories.length)];
    
    // 2. Select Unique Word
    const selectedWord = getUniqueWord(selectedCategory);

    // 3. Assign Roles
    let shuffledPlayers = [...players].sort(() => 0.5 - Math.random());
    let roles = shuffledPlayers.map(p => ({ ...p, role: 'citizen' }));
    
    // Assign Impostors randomly
    let indices = Array.from({ length: roles.length }, (_, i) => i);
    indices = indices.sort(() => 0.5 - Math.random());
    
    for (let i = 0; i < impostorCount; i++) {
      roles[indices[i]].role = 'impostor';
    }

    // Determine starter
    const starter = roles[Math.floor(Math.random() * roles.length)].name;

    setGameData({
      players: roles,
      category: selectedCategory,
      word: selectedWord,
      starter: starter
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
      <div className="min-h-screen bg-[#0f172a] text-slate-100 font-sans selection:bg-fuchsia-500 selection:text-white" dir="rtl">
        {/* Background Atmosphere */}
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
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2 text-violet-200">
                <Users className="text-fuchsia-400" size={20} />
                רשימת סוכנים ({players.length})
              </h2>
            </div>
            
            <form onSubmit={addPlayer} className="relative group">
              <input
                type="text"
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                placeholder="שם סוכן חדש..."
                autoComplete="off"
                autoFocus
                className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent outline-none transition-all placeholder-slate-500"
              />
              <button 
                type="submit"
                disabled={!newPlayerName.trim()}
                className="absolute left-2 top-2 bottom-2 bg-slate-800 hover:bg-violet-600 text-violet-300 hover:text-white p-2.5 rounded-xl transition-all disabled:opacity-0"
              >
                <UserPlus size={20} />
              </button>
            </form>

            <div className="flex-1 overflow-y-auto space-y-2 max-h-[35vh] custom-scrollbar pr-1">
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
                max={Math.max(1, Math.floor((players.length - 1) / 2))} 
                value={impostorCount} 
                onChange={(e) => setImpostorCount(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-fuchsia-500"
                disabled={players.length < 3}
              />
            </div>

            <Button onClick={startGame} disabled={players.length < 3} className="mt-auto">
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
