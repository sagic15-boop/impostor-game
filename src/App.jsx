import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, Eye, EyeOff, UserPlus, Play, RotateCcw, 
  HelpCircle, Check, Crown, Skull, Fingerprint, 
  Sparkles, Timer, Trophy, Shuffle, Database, Settings, ArrowLeft, Maximize, CheckCircle, Save, FolderOpen, Trash2, Home
} from 'lucide-react';

// --- Helper Functions ---

const shuffleArray = (array) => {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array;
};

// --- Custom Neon Components ---

const LaserBackground = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none bg-[#0a0e17]">
    <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] bg-gradient-to-br from-purple-900/20 via-transparent to-transparent opacity-60 transform rotate-12 blur-xl"></div>
    <div className="absolute top-[-10%] right-[-10%] w-[120%] h-[120%] bg-gradient-to-bl from-cyan-900/20 via-transparent to-transparent opacity-60 transform -rotate-12 blur-xl"></div>
    <div className="absolute top-1/4 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/30 to-transparent blur-[1px]"></div>
    <div className="absolute bottom-1/3 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent blur-[1px] transform rotate-45"></div>
  </div>
);

const PlayerRow = ({ name, colorTheme, avatarSeed, onRemove }) => {
  const themes = {
    purple: "border-[#d946ef] shadow-[0_0_10px_rgba(217,70,239,0.3)] text-[#d946ef]",
    blue: "border-[#00f2ff] shadow-[0_0_10px_rgba(0,242,255,0.3)] text-[#00f2ff]",
    green: "border-[#22c55e] shadow-[0_0_10px_rgba(34,197,94,0.3)] text-[#22c55e]",
    pink: "border-[#ec4899] shadow-[0_0_10px_rgba(236,72,153,0.3)] text-[#ec4899]"
  };
  
  const themeClass = themes[colorTheme] || themes.purple;

  return (
    <div className={`relative group flex items-center justify-between p-3 mb-3 bg-slate-900/60 border rounded-xl backdrop-blur-sm transition-all hover:scale-[1.02] ${themeClass}`}>
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center bg-slate-800 overflow-hidden ${themeClass.split(' ')[0]}`}>
           <img 
             src={`https://api.dicebear.com/7.x/bottts/svg?seed=${avatarSeed}`} 
             alt="avatar" 
             className="w-full h-full object-cover"
           />
        </div>
        <span className="font-bold text-white tracking-wide text-lg">{name}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs font-mono opacity-60 text-slate-400 uppercase tracking-widest hidden sm:block">Ready</span>
        <button onClick={onRemove} className="opacity-40 hover:opacity-100 hover:text-red-500 transition-opacity p-2">✕</button>
      </div>
    </div>
  );
};

const PlayerGridItem = ({ player, isRevealed, onClick }) => {
  const themeColor = {
    purple: "#d946ef", blue: "#00f2ff", green: "#22c55e", pink: "#ec4899"
  }[player.colorTheme] || "#d946ef";

  return (
    <button 
      onClick={onClick}
      disabled={isRevealed}
      className={`
        relative flex flex-col items-center justify-center gap-2 p-4 rounded-2xl transition-all duration-300
        ${isRevealed ? 'opacity-50 grayscale scale-95 cursor-default' : 'hover:scale-105 active:scale-95 bg-slate-800/40 border border-white/10 hover:border-white/30'}
      `}
    >
      <div className={`relative w-20 h-20 rounded-full border-2 p-1 ${isRevealed ? 'border-[#22c55e]' : ''}`} style={{ borderColor: isRevealed ? '#22c55e' : themeColor }}>
        <div className="w-full h-full rounded-full overflow-hidden bg-slate-900">
           <img 
             src={`https://api.dicebear.com/7.x/bottts/svg?seed=${player.avatarSeed}`} 
             alt="avatar" 
             className="w-full h-full object-cover"
           />
        </div>
        {isRevealed && (
          <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
            <CheckCircle size={32} className="text-[#22c55e] drop-shadow-lg" />
          </div>
        )}
      </div>
      <span className={`font-bold text-sm tracking-wide ${isRevealed ? 'text-[#22c55e]' : 'text-white'}`}>
        {player.name}
      </span>
    </button>
  );
};

const HoloContainer = ({ children, title }) => (
  <div className="relative p-[2px] rounded-3xl bg-gradient-to-b from-purple-500 via-cyan-500 to-purple-500 shadow-[0_0_20px_rgba(139,92,246,0.3)]">
    <div className="bg-[#0f172a] rounded-[22px] h-full w-full p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 to-cyan-500/5 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col h-full">
            {title && <h2 className="text-center text-white font-bold mb-4 tracking-wider drop-shadow-md">{title}</h2>}
            {children}
        </div>
    </div>
  </div>
);

const StartButton = ({ onClick, disabled, children }) => (
  <button 
    onClick={onClick} 
    disabled={disabled}
    className={`
      w-full py-4 rounded-xl font-black text-xl tracking-wider uppercase
      bg-[#00f2ff] text-slate-900 
      shadow-[0_0_20px_rgba(0,242,255,0.6)] border-2 border-[#ccfbfd]
      hover:bg-[#5ff9ff] hover:scale-[1.02] active:scale-95
      transition-all disabled:opacity-50 disabled:grayscale disabled:shadow-none
      mt-4
    `}
  >
    {children}
  </button>
);

// --- Modals ---

const SettingsModal = ({ isOpen, onClose, config, setConfig }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm">
        <HoloContainer title="Game Settings">
          <div className="space-y-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-white font-bold">Impostor Category</h4>
                <p className="text-xs text-slate-400">Impostor sees the category name</p>
              </div>
              <button 
                onClick={() => setConfig(prev => ({ ...prev, showCategory: !prev.showCategory }))}
                className={`transition-colors ${config.showCategory ? 'text-[#00f2ff]' : 'text-slate-600'}`}
              >
                {config.showCategory ? <div className="w-12 h-6 bg-[#00f2ff]/20 rounded-full relative border border-[#00f2ff]"><div className="absolute right-1 top-1 w-4 h-4 bg-[#00f2ff] rounded-full shadow-[0_0_10px_#00f2ff]"></div></div> : <div className="w-12 h-6 bg-slate-700 rounded-full relative"><div className="absolute left-1 top-1 w-4 h-4 bg-slate-500 rounded-full"></div></div>}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-white font-bold">Impostor Hint</h4>
                <p className="text-xs text-slate-400">Impostor sees a subtle hint</p>
              </div>
              <button 
                onClick={() => setConfig(prev => ({ ...prev, showHint: !prev.showHint }))}
                className={`transition-colors ${config.showHint ? 'text-[#00f2ff]' : 'text-slate-600'}`}
              >
                {config.showHint ? <div className="w-12 h-6 bg-[#00f2ff]/20 rounded-full relative border border-[#00f2ff]"><div className="absolute right-1 top-1 w-4 h-4 bg-[#00f2ff] rounded-full shadow-[0_0_10px_#00f2ff]"></div></div> : <div className="w-12 h-6 bg-slate-700 rounded-full relative"><div className="absolute left-1 top-1 w-4 h-4 bg-slate-500 rounded-full"></div></div>}
              </button>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="w-full mt-4 py-3 rounded-xl border border-white/20 hover:bg-white/10 text-white font-bold transition-colors"
          >
            CLOSE
          </button>
        </HoloContainer>
      </div>
    </div>
  );
};

const TemplatesModal = ({ isOpen, onClose, currentPlayers, onLoadTemplate }) => {
  const [templates, setTemplates] = useState(() => {
    try {
      const saved = localStorage.getItem('impostor_templates');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [newTemplateName, setNewTemplateName] = useState('');

  const saveTemplate = () => {
    if (!newTemplateName.trim() || currentPlayers.length === 0) return;
    const newTemplate = { name: newTemplateName, players: currentPlayers };
    const updated = [...templates, newTemplate];
    setTemplates(updated);
    localStorage.setItem('impostor_templates', JSON.stringify(updated));
    setNewTemplateName('');
  };

  const deleteTemplate = (index) => {
    const updated = templates.filter((_, i) => i !== index);
    setTemplates(updated);
    localStorage.setItem('impostor_templates', JSON.stringify(updated));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm">
        <HoloContainer title="Saved Groups">
          <div className="space-y-4 py-2">
            
            {/* Save Current */}
            <div className="flex gap-2">
              <input 
                type="text" 
                value={newTemplateName}
                onChange={(e) => setNewTemplateName(e.target.value)}
                placeholder="Group Name..."
                className="flex-1 bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm"
              />
              <button 
                onClick={saveTemplate}
                disabled={currentPlayers.length === 0 || !newTemplateName.trim()}
                className="bg-[#00f2ff] text-slate-900 px-3 rounded-lg font-bold disabled:opacity-50"
              >
                <Save size={18} />
              </button>
            </div>

            <div className="border-t border-white/10 my-2"></div>

            {/* List */}
            <div className="max-h-48 overflow-y-auto custom-scrollbar space-y-2">
              {templates.length === 0 && <p className="text-slate-500 text-center text-sm py-4">No saved groups yet.</p>}
              {templates.map((t, idx) => (
                <div key={idx} className="flex justify-between items-center bg-slate-800/50 p-3 rounded-lg border border-white/5">
                  <div className="text-left">
                    <p className="text-white font-bold text-sm">{t.name}</p>
                    <p className="text-slate-400 text-xs">{t.players.length} Players</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { onLoadTemplate(t.players); onClose(); }} className="p-2 bg-[#22c55e]/20 text-[#22c55e] rounded hover:bg-[#22c55e]/30"><FolderOpen size={16} /></button>
                    <button onClick={() => deleteTemplate(idx)} className="p-2 bg-red-500/20 text-red-500 rounded hover:bg-red-500/30"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>

          </div>
          <button 
            onClick={onClose}
            className="w-full mt-4 py-3 rounded-xl border border-white/20 hover:bg-white/10 text-white font-bold transition-colors"
          >
            CLOSE
          </button>
        </HoloContainer>
      </div>
    </div>
  );
};

// --- DATA PACKS ---
const DATA_PACKS = {
  'חיות 🦁': [
    { word: 'אריה', hint: 'מלך' }, { word: 'פיל', hint: 'חדק' }, { word: 'ג׳ירפה', hint: 'צוואר' }, { word: 'כלב', hint: 'נאמן' }, 
    { word: 'חתול', hint: 'שבע נשמות' }, { word: 'נחש', hint: 'זוחל' }, { word: 'דולפין', hint: 'אינטליגנט' }, { word: 'נשר', hint: 'מלך העופות' }, 
    { word: 'פינגווין', hint: 'קוטב' }, { word: 'קנגורו', hint: 'כיס' }, { word: 'עצלן', hint: 'איטי' }, { word: 'זברה', hint: 'פסים' },
    { word: 'טיגריס', hint: 'טורף' }, { word: 'היפופוטם', hint: 'כבד' }, { word: 'צפרדע', hint: 'ביצה' }, { word: 'זיקית', hint: 'הסוואה' },
    { word: 'קיפוד', hint: 'קוצים' }, { word: 'תמנון', hint: 'זרועות' }, { word: 'כריש', hint: 'מלתעות' }, { word: 'ינשוף', hint: 'לילה' },
    { word: 'גמל', hint: 'דבשת' }, { word: 'אוגר', hint: 'גלגל' }, { word: 'סוס', hint: 'רכיבה' }, { word: 'דוב קוטב', hint: 'לבן' }
  ],
  'מאכלים 🍕': [
    { word: 'פיצה', hint: 'משולש' }, { word: 'פלאפל', hint: 'כדור' }, { word: 'סושי', hint: 'יפן' }, { word: 'המבורגר', hint: 'קציצה' }, 
    { word: 'גלידה', hint: 'קור' }, { word: 'שוקולד', hint: 'מתוק' }, { word: 'פסטה', hint: 'איטליה' }, { word: 'סלט', hint: 'בריא' }, 
    { word: 'שווארמה', hint: 'גלגל' }, { word: 'חומוס', hint: 'ניגוב' }, { word: 'ג׳חנון', hint: 'שבת' }, { word: 'שקשוקה', hint: 'ביצים' }, 
    { word: 'סטייק', hint: 'בשר' }, { word: 'צ׳יפס', hint: 'תפוח אדמה' }, { word: 'אבטיח', hint: 'קיץ' }, { word: 'פופקורן', hint: 'קולנוע' }
  ],
  'מדינות 🌍': [
    { word: 'ישראל', hint: 'בית' }, { word: 'צרפת', hint: 'מגדל' }, { word: 'ארצות הברית', hint: 'פסל החירות' }, { word: 'יפן', hint: 'שמש עולה' }, 
    { word: 'איטליה', hint: 'מגף' }, { word: 'ברזיל', hint: 'קרנבל' }, { word: 'מצרים', hint: 'פירמידה' }, { word: 'סין', hint: 'חומה' }, 
    { word: 'רוסיה', hint: 'וודקה' }, { word: 'אוסטרליה', hint: 'יבשת' }, { word: 'הודו', hint: 'תבלינים' }, { word: 'מקסיקו', hint: 'חריף' }, 
    { word: 'קנדה', hint: 'מייפל' }, { word: 'יוון', hint: 'צלחות' }, { word: 'תאילנד', hint: 'חופים' }, { word: 'ארגנטינה', hint: 'בשר' }
  ],
  'מקצועות 💼': [
    { word: 'רופא', hint: 'חלוק' }, { word: 'שוטר', hint: 'חוק' }, { word: 'מורה', hint: 'לוח' }, { word: 'כבאי', hint: 'אש' }, 
    { word: 'טייס', hint: 'שמיים' }, { word: 'טבח', hint: 'מטבח' }, { word: 'מתכנת', hint: 'קוד' }, { word: 'נגר', hint: 'עץ' }, 
    { word: 'עורך דין', hint: 'בית משפט' }, { word: 'זמר', hint: 'מיקרופון' }, { word: 'ליצן', hint: 'אף אדום' }, { word: 'וטרינר', hint: 'חיות' }, 
    { word: 'ספר', hint: 'מספריים' }, { word: 'נהג מונית', hint: 'מונה' }, { word: 'מציל', hint: 'ים' }, { word: 'גנן', hint: 'צמחים' }
  ],
  'חפצים (כללי) 📦': [
    { word: 'מקרר', hint: 'קור' }, { word: 'טלוויזיה', hint: 'מסך' }, { word: 'מיטה', hint: 'שינה' }, { word: 'ספה', hint: 'סלון' }, 
    { word: 'מחשב', hint: 'מקלדת' }, { word: 'שולחן', hint: 'רגליים' }, { word: 'מזגן', hint: 'אוויר' }, { word: 'תנור', hint: 'חום' }, 
    { word: 'מראה', hint: 'השתקפות' }, { word: 'שעון', hint: 'זמן' }, { word: 'ספסל', hint: 'פארק' }, { word: 'רמזור', hint: 'צבעים' }, 
    { word: 'עמוד חשמל', hint: 'מתח' }, { word: 'תמרור', hint: 'דרך' }, { word: 'מכונית', hint: 'גלגלים' }, { word: 'טלפון', hint: 'שיחה' }
  ],
  'מותגים 🏷️': [
    { word: 'נייקי', hint: 'וי' }, { word: 'אדידס', hint: 'פסים' }, { word: 'אפל', hint: 'פרי' }, { word: 'סמסונג', hint: 'קוריאה' }, 
    { word: 'קוקה קולה', hint: 'טעם החיים' }, { word: 'מקדונלדס', hint: 'M' }, { word: 'איקאה', hint: 'הרכבה' }, { word: 'גוגל', hint: 'חיפוש' }, 
    { word: 'פייסבוק', hint: 'רשת' }, { word: 'אמזון', hint: 'משלוחים' }, { word: 'נטפליקס', hint: 'בינג\'' }, { word: 'דיסני', hint: 'עכבר' }, 
    { word: 'טויוטה', hint: 'יפן' }, { word: 'מרצדס', hint: 'יוקרה' }, { word: 'טסלה', hint: 'חשמל' }, { word: 'גוצ׳י', hint: 'אופנה' }
  ],
  'מקומות בישראל 🇮🇱': [
    { word: 'הכותל המערבי', hint: 'פתקים' }, { word: 'החרמון', hint: 'שלג' }, { word: 'ים המלח', ציפה: 'מלח' }, { word: 'הכנרת', hint: 'ימה' }, 
    { word: 'אילת', hint: 'דרום' }, { word: 'מצדה', hint: 'זריחה' }, { word: 'שוק מחנה יהודה', hint: 'ירושלים' }, { word: 'דיזנגוף סנטר', hint: 'תל אביב' }, 
    { word: 'הספארי', hint: 'חיות' }, { word: 'לונה פארק', hint: 'גלגל ענק' }, { word: 'הגנים הבהאיים', hint: 'חיפה' }, { word: 'חוף הים', hint: 'חול' }, 
    { word: 'הכנסת', hint: '120' }, { word: 'נתב״ג', hint: 'טיסה' }, { word: 'עזריאלי', hint: 'מגדלים' }, { word: 'פארק הירקון', hint: 'ריאה ירוקה' }
  ],
  'דמויות (דיסני וגיבורים) 🎭': [
    { word: 'ספיידרמן', hint: 'קורים' }, { word: 'באטמן', hint: 'עטלף' }, { word: 'סופרמן', hint: 'קריפטונייט' }, { word: 'וונדר וומן', hint: 'אמזונה' }, 
    { word: 'איירון מן', hint: 'חליפה' }, { word: 'קפטן אמריקה', hint: 'מגן' }, { word: 'הענק הירוק', hint: 'כעס' }, { word: 'ת׳ור', hint: 'פטיש' }, 
    { word: 'מיקי מאוס', hint: 'אוזניים' }, { word: 'אלזה', hint: 'קרח' }, { word: 'סימבה', hint: 'גלגל החיים' }, { word: 'אלאדין', hint: 'מנורה' }, 
    { word: 'שרק', hint: 'ביצה' }, { word: 'באז שנות אור', hint: 'אינסוף' }, { word: 'וודי', hint: 'בוקר' }, { word: 'נימו', hint: 'אבוד' }
  ],
  'סרטים 🎬': [
    { word: 'טיטאניק', hint: 'קרחון' }, { word: 'אווטאר', hint: 'כחול' }, { word: 'הארי פוטר', hint: 'קסם' }, { word: 'שר הטבעות', hint: 'הוביט' }, 
    { word: 'מלחמת הכוכבים', hint: 'גלקסיה' }, { word: 'הנוקמים', hint: 'איחוד' }, { word: 'מטריקס', hint: 'גלולה' }, { word: 'פארק היורה', hint: 'דינוזאור' }, 
    { word: 'מלך האריות', hint: 'אפריקה' }, { word: 'לשבור את הקרח', hint: 'שיר' }, { word: 'שרק', hint: 'ירוק' }, { word: 'צעצוע של סיפור', hint: 'צעצועים' }, 
    { word: 'מהיר ועצבני', hint: 'מכוניות' }, { word: 'שליחות קטלנית', hint: 'רובוט' }, { word: 'בחזרה לעתיד', hint: 'דלוריאן' }, { word: 'פורסט גאמפ', hint: 'ריצה' }
  ],
  'מפורסמים (בארץ ובעולם) ⭐': [
    { word: 'גל גדות', hint: 'וונדר וומן' }, { word: 'נועה קירל', hint: 'יוניקורן' }, { word: 'בנימין נתניהו', hint: 'ראש ממשלה' }, { word: 'אייל גולן', hint: 'זמר' }, 
    { word: 'עומר אדם', hint: 'תל אביב' }, { word: 'סטטיק', hint: 'פופ' }, { word: 'בן אל תבורי', hint: 'צמד' }, { word: 'בר רפאלי', hint: 'דוגמנית' }, 
    { word: 'דונלד טראמפ', hint: 'נשיא' }, { word: 'ג׳ו ביידן', hint: 'ארה"ב' }, { word: 'מסי', hint: 'כדורגל' }, { word: 'רונאלדו', hint: 'פורטוגל' }, 
    { word: 'ביונסה', hint: 'מלכה' }, { word: 'אילון מאסק', hint: 'חלל' }, { word: 'מארק צוקרברג', hint: 'פייסבוק' }, { word: 'ביל גייטס', hint: 'מחשבים' }
  ],
  'ספורט 🏆': [
    { word: 'כדורגל', hint: 'שער' }, { word: 'כדורסל', hint: 'סל' }, { word: 'טניס', hint: 'מחבט' }, { word: 'שחייה', hint: 'בריכה' }, 
    { word: 'כדורעף', hint: 'רשת' }, { word: 'ג׳ודו', hint: 'חגורה' }, { word: 'ריצה', hint: 'נעליים' }, { word: 'התעמלות אמנותית', hint: 'סרט' }, 
    { word: 'גלישת גלים', hint: 'גלשן' }, { word: 'פינג פונג', hint: 'שולחן' }, { word: 'אגרוף', hint: 'זירה' }, { word: 'באולינג', hint: 'פינים' }, 
    { word: 'גולף', hint: 'גומה' }, { word: 'בייסבול', hint: 'חבטה' }, { word: 'פוטבול', hint: 'קסדה' }, { word: 'רכיבה על סוסים', hint: 'אוכף' }
  ]
};

export default function App() {
  const [gameState, setGameState] = useState('setup');
  const [players, setPlayers] = useState([]);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [impostorCount, setImpostorCount] = useState(1);
  const [gameData, setGameData] = useState(null);
  const [timeLeft, setTimeLeft] = useState(300);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  
  // Modals State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  
  // New States for the Grid Reveal Logic
  const [revealedPlayers, setRevealedPlayers] = useState([]); 
  const [activeRevealPlayer, setActiveRevealPlayer] = useState(null); 

  // Config State
  const [gameConfig, setGameConfig] = useState({
    showCategory: true,
    showHint: false
  });
  
  // History tracking for random logic
  const [usedWords, setUsedWords] = useState({});
  // Track last category to prevent >2 repeats
  const [categoryHistory, setCategoryHistory] = useState({ last: null, streak: 0 });

  const totalWordsCount = useMemo(() => {
    return Object.values(DATA_PACKS).reduce((acc, curr) => acc + curr.length, 0);
  }, []);

  useEffect(() => {
    const maxAllowed = Math.max(1, Math.floor(players.length / 2));
    if (impostorCount > maxAllowed) {
      setImpostorCount(maxAllowed);
    }
  }, [players.length, impostorCount]);

  const getRandomColorTheme = () => {
    const themes = ['purple', 'blue', 'green', 'pink'];
    return themes[Math.floor(Math.random() * themes.length)];
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  // --- Handlers ---
  const addPlayer = (e) => {
    e.preventDefault();
    if (newPlayerName.trim()) {
      setPlayers(prev => [
        ...prev, 
        { 
          name: newPlayerName.trim(), 
          id: Date.now(),
          colorTheme: getRandomColorTheme(), 
          avatarSeed: Date.now() + Math.random().toString() 
        }
      ]);
      setNewPlayerName('');
    }
  };

  const removePlayer = (id) => {
    setPlayers(players.filter(p => p.id !== id));
  };

  const getUniqueWordAndCategory = () => {
    const categories = Object.keys(DATA_PACKS);
    let selectedCategory;
    let validCategory = false;
    
    // Safety break to prevent infinite loops (though unlikely with >2 categories)
    let attempts = 0;

    // 1. Pick Category (Max 2 repeats constraint)
    while (!validCategory && attempts < 50) {
      selectedCategory = categories[Math.floor(Math.random() * categories.length)];
      
      // If it's the same as last time, check streak
      if (selectedCategory === categoryHistory.last) {
        if (categoryHistory.streak < 2) {
          validCategory = true;
        }
        // If streak is 2 (meaning it appeared twice already), loop again to pick another
      } else {
        validCategory = true;
      }
      attempts++;
    }
    
    // Update streak history
    if (selectedCategory === categoryHistory.last) {
      setCategoryHistory(prev => ({ last: selectedCategory, streak: prev.streak + 1 }));
    } else {
      setCategoryHistory({ last: selectedCategory, streak: 1 });
    }

    // 2. Pick Word (No repeats until reset)
    const allWords = DATA_PACKS[selectedCategory];
    const used = usedWords[selectedCategory] || [];
    
    let availableWords = allWords.filter(item => !used.some(usedItem => usedItem.word === item.word));
    
    if (availableWords.length === 0) {
      availableWords = allWords;
      setUsedWords(prev => ({ ...prev, [selectedCategory]: [] }));
    }

    const selectedItem = availableWords[Math.floor(Math.random() * availableWords.length)];
    
    setUsedWords(prev => {
      const currentUsed = prev[selectedCategory] || [];
      const newList = availableWords.length === allWords.length 
        ? [selectedItem] 
        : [...currentUsed, selectedItem];
      return { ...prev, [selectedCategory]: newList };
    });

    return { category: selectedCategory, item: selectedItem };
  };

  const startGame = () => {
    if (players.length < 3) return;
    
    const { category, item } = getUniqueWordAndCategory();

    let shuffledPlayers = shuffleArray([...players]);
    let roles = shuffledPlayers.map(p => ({ ...p, role: 'citizen' }));
    
    let indices = Array.from({ length: roles.length }, (_, i) => i);
    indices = shuffleArray(indices);
    
    for (let i = 0; i < impostorCount; i++) {
      roles[indices[i]].role = 'impostor';
    }

    const starter = roles[Math.floor(Math.random() * roles.length)].name;

    setGameData({
      players: roles,
      category: category,
      word: item.word,
      hint: item.hint,
      starter: starter
    });

    // Reset Reveal State
    setRevealedPlayers([]);
    setActiveRevealPlayer(null);
    setTimeLeft(300);
    setIsTimerRunning(false);
    setGameState('reveal');
  };

  const handlePlayerRevealClick = (player) => {
    if (!revealedPlayers.includes(player.id)) {
      setActiveRevealPlayer(player);
    }
  };

  const handleHideIntel = () => {
    if (activeRevealPlayer) {
      setRevealedPlayers(prev => [...prev, activeRevealPlayer.id]);
      setActiveRevealPlayer(null);
    }
  };

  const startRound = () => {
    setGameState('playing');
    setIsTimerRunning(true);
  };

  const loadTemplate = (templatePlayers) => {
    // We need to regenerate IDs and seeds to ensure they are fresh but keep names
    const refreshedPlayers = templatePlayers.map(p => ({
      ...p,
      id: Date.now() + Math.random(),
      avatarSeed: p.avatarSeed || (Date.now() + Math.random().toString())
    }));
    setPlayers(refreshedPlayers);
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
    const maxImpostors = Math.max(1, Math.floor(players.length / 2));

    return (
      <div className="min-h-screen bg-[#0a0e17] text-slate-100 font-sans selection:bg-[#00f2ff] selection:text-[#0f172a]" dir="ltr">
        <LaserBackground />
        
        <SettingsModal 
          isOpen={isSettingsOpen} 
          onClose={() => setIsSettingsOpen(false)} 
          config={gameConfig}
          setConfig={setGameConfig}
        />

        <TemplatesModal
          isOpen={isTemplatesOpen}
          onClose={() => setIsTemplatesOpen(false)}
          currentPlayers={players}
          onLoadTemplate={loadTemplate}
        />

        <div className="relative max-w-md mx-auto p-4 min-h-screen flex flex-col z-10">
          
          <div className="flex justify-between items-center bg-slate-900/50 backdrop-blur-md rounded-full px-4 py-3 mb-6 border border-white/10 shadow-[0_0_15px_rgba(139,92,246,0.2)]">
            <button className="text-cyan-400 p-1 hover:bg-white/5 rounded-full"><ArrowLeft size={24} /></button>
            <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 uppercase tracking-widest">
              Game Setup
            </h1>
            <div className="flex gap-2">
              <button 
                onClick={() => setIsTemplatesOpen(true)}
                className="text-cyan-400 p-1 hover:bg-white/5 rounded-full"
                title="Save/Load Groups"
              >
                <FolderOpen size={24} />
              </button>
              <button onClick={toggleFullScreen} className="text-cyan-400 p-1 hover:bg-white/5 rounded-full"><Maximize size={24} /></button>
              <button onClick={() => setIsSettingsOpen(true)} className="text-cyan-400 p-1 hover:bg-white/5 rounded-full"><Settings size={24} /></button>
            </div>
          </div>

          <HoloContainer title="Players Joining">
            <div className="flex-1 overflow-y-auto space-y-2 mb-4 custom-scrollbar pr-1 max-h-[50vh]">
               {players.length === 0 && (
                <div className="text-center py-12 opacity-40 border-2 border-dashed border-slate-700 rounded-2xl">
                  <UserPlus className="mx-auto mb-2 text-cyan-400" size={32} />
                  <p className="font-medium text-slate-400">Waiting for players...</p>
                </div>
              )}
              {players.map((p) => (
                <PlayerRow 
                  key={p.id} 
                  name={p.name} 
                  colorTheme={p.colorTheme} 
                  avatarSeed={p.avatarSeed}
                  onRemove={() => removePlayer(p.id)}
                />
              ))}
            </div>

            <form onSubmit={addPlayer} className="relative group mb-6">
              <input
                type="text"
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                placeholder="Enter player name..."
                autoComplete="off"
                autoFocus
                className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-5 py-4 text-white focus:ring-2 focus:ring-[#00f2ff] focus:border-transparent outline-none transition-all placeholder-slate-500 font-medium"
              />
              <button 
                type="submit"
                disabled={!newPlayerName.trim()}
                className="absolute right-3 top-3 bottom-3 bg-[#00f2ff] text-slate-900 font-bold px-4 rounded-lg hover:bg-[#5ff9ff] transition-colors disabled:opacity-0"
              >
                ADD
              </button>
            </form>

            <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-700">
               <div className="text-center mb-2">
                 <h3 className="text-white font-bold tracking-wide">Game Settings</h3>
               </div>
               <div className="relative pt-6 pb-2 px-2">
                 <input 
                    type="range" 
                    min="1" 
                    max={maxImpostors} 
                    value={impostorCount} 
                    onChange={(e) => setImpostorCount(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#00f2ff]"
                    disabled={players.length < 3}
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-2 font-mono">
                    <span>1</span>
                    <span className="text-cyan-400 font-bold">Number of Impostors: {impostorCount}</span>
                    <span>{maxImpostors}</span>
                  </div>
                  <div 
                    className="absolute top-0 w-8 h-8 bg-[#00f2ff] rounded-full blur-lg opacity-30 pointer-events-none transition-all"
                    style={{ left: `calc(${((impostorCount - 1) / (Math.max(1, maxImpostors - 1) || 1)) * 100}% - 10px)` }}
                  ></div>
               </div>
            </div>

            <StartButton onClick={startGame} disabled={players.length < 3}>
              START GAME
            </StartButton>
          </HoloContainer>

          <div className="mt-4 text-center">
             <p className="text-slate-600 text-xs">V 1.0.9 | The Impostor</p>
          </div>
        </div>
      </div>
    );
  }

  // 2. REVEAL (GRID LAYOUT)
  if (gameState === 'reveal') {
    
    // If a player is selected, show the "Secret Identity" Modal/Card
    if (activeRevealPlayer) {
      const isImpostor = activeRevealPlayer.role === 'impostor';
      return (
        <div className="min-h-screen bg-[#0a0e17] text-slate-100 flex flex-col font-sans relative" dir="ltr">
          <LaserBackground />
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto w-full relative z-10">
            <HoloContainer>
               <div className="py-6 space-y-6">
                 <div className="flex justify-center">
                   {isImpostor ? <Skull size={64} className="text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.6)]" /> : <Check size={64} className="text-[#22c55e] drop-shadow-[0_0_15px_rgba(34,197,94,0.6)]" />}
                 </div>

                 <div className="space-y-1">
                    <span className="text-xs font-bold tracking-[0.2em] text-slate-400 uppercase">Current Identity</span>
                    <h2 className={`text-4xl font-bold ${isImpostor ? 'text-red-500' : 'text-[#22c55e]'}`}>
                      {isImpostor ? 'IMPOSTOR' : 'LOYAL AGENT'}
                    </h2>
                    <p className="text-lg text-white font-medium mt-1">{activeRevealPlayer.name}</p>
                 </div>

                 <div className="py-6 px-4 bg-slate-900/80 rounded-xl border border-white/10 space-y-4">
                    {isImpostor ? (
                      <>
                        <p className="text-red-200 font-medium">Mission: Blend in & identify the secret word.</p>
                        {(gameConfig.showCategory || gameConfig.showHint) && (
                          <div className="pt-4 border-t border-white/10 space-y-3">
                            {gameConfig.showCategory && (
                              <div>
                                <span className="text-xs text-slate-500 block mb-1 uppercase tracking-wider">Category Hint</span>
                                <span className="text-xl font-bold text-white">{gameData.category}</span>
                              </div>
                            )}
                            {gameConfig.showHint && (
                              <div>
                                <span className="text-xs text-purple-400 block mb-1 uppercase tracking-wider font-bold">Secret Hint</span>
                                <span className="text-lg font-bold text-purple-200">{gameData.hint}</span>
                              </div>
                            )}
                          </div>
                        )}
                        {!gameConfig.showCategory && !gameConfig.showHint && (
                          <p className="text-xs text-slate-500 mt-2 italic">No intel available.</p>
                        )}
                      </>
                    ) : (
                      <>
                        <div>
                          <span className="text-xs text-[#22c55e] block mb-1 font-bold uppercase tracking-wider">Secret Code</span>
                          <div className="text-4xl font-bold text-white tracking-wide">{gameData.word}</div>
                        </div>
                        <div className="pt-2">
                          <span className="inline-block px-3 py-1 bg-[#22c55e]/10 rounded-lg text-[#22c55e] border border-[#22c55e]/20 text-sm font-bold">
                            {gameData.category}
                          </span>
                        </div>
                      </>
                    )}
                 </div>

                 <button onClick={handleHideIntel} className="w-full py-4 rounded-xl border border-white/20 hover:bg-white/10 text-white font-bold transition-colors">
                    HIDE INTEL
                 </button>
               </div>
            </HoloContainer>
          </div>
        </div>
      );
    }

    // Grid View
    const allRevealed = gameData.players.length > 0 && revealedPlayers.length === gameData.players.length;

    return (
      <div className="min-h-screen bg-[#0a0e17] text-slate-100 flex flex-col font-sans relative" dir="ltr">
        <LaserBackground />
        
        <div className="relative max-w-md mx-auto p-4 min-h-screen flex flex-col z-10">
          
          <div className="flex justify-between items-center mb-6 mt-4">
             <button onClick={() => setGameState('setup')} className="text-slate-500 hover:text-white transition-colors">
               <Home size={24} />
             </button>
             <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 uppercase tracking-widest drop-shadow-md">
               Identity Check
             </h2>
             <div className="w-6"></div> {/* Spacer for centering */}
          </div>
          
          <p className="text-slate-400 text-sm text-center mb-4">Pass the phone. Tap your avatar to check your role.</p>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {gameData.players.map(p => (
                <PlayerGridItem 
                  key={p.id}
                  player={p}
                  isRevealed={revealedPlayers.includes(p.id)}
                  onClick={() => handlePlayerRevealClick(p)}
                />
              ))}
            </div>
          </div>

          <div className="mt-4">
             <StartButton onClick={startRound} disabled={!allRevealed}>
                {allRevealed ? "START ROUND" : `WAITING (${revealedPlayers.length}/${gameData.players.length})`}
             </StartButton>
          </div>
        </div>
      </div>
    );
  }

  // 3. PLAYING
  if (gameState === 'playing') {
    return (
      <div className="min-h-screen bg-[#0a0e17] text-slate-100 flex flex-col font-sans relative overflow-hidden" dir="ltr">
        <LaserBackground />
        
        <header className="px-6 py-4 flex justify-between items-center z-10 relative">
          <div className="bg-slate-900/80 backdrop-blur rounded-full px-4 py-2 border border-slate-700 flex items-center gap-3 shadow-lg">
            <Timer size={18} className={isTimerRunning ? "text-[#d946ef] animate-pulse" : "text-slate-400"} />
            <span className="font-mono text-xl font-bold tracking-wider">{formatTime(timeLeft)}</span>
          </div>
          <div className="flex gap-2">
            <button onClick={toggleFullScreen} className="bg-slate-900/50 p-3 rounded-full hover:bg-slate-700 transition-colors border border-white/10 text-cyan-400"><Maximize size={20} /></button>
            <button onClick={() => setGameState('setup')} className="bg-slate-900/50 p-3 rounded-full hover:bg-slate-700 transition-colors border border-white/10"><RotateCcw size={20} className="text-slate-300" /></button>
          </div>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center p-6 space-y-8 z-10 w-full max-w-md mx-auto relative">
           
           <HoloContainer>
             <div className="py-8 space-y-6 text-center">
               <div>
                  <span className="inline-block px-4 py-1.5 rounded-full bg-[#d946ef]/10 border border-[#d946ef]/30 text-[#d946ef] text-xs font-bold tracking-[0.15em] uppercase shadow-[0_0_15px_rgba(217,70,239,0.2)]">
                    Current Topic
                  </span>
                  <h2 className="text-4xl font-bold text-white mt-4 leading-tight drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                    {gameData.category}
                  </h2>
               </div>

               <div className="border-t border-white/10 pt-6">
                 <p className="text-slate-400 text-sm mb-3 font-medium uppercase tracking-wide">First Speaker</p>
                 <div className="flex items-center justify-center gap-3">
                    <Crown size={32} className="text-[#fbbf24] drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]" />
                    <span className="text-3xl font-bold text-white">{gameData.starter}</span>
                 </div>
               </div>
             </div>
           </HoloContainer>

           <div className="bg-slate-900/50 p-5 rounded-xl border border-white/10 text-sm text-slate-300 leading-relaxed text-center shadow-lg backdrop-blur-sm">
              <Sparkles className="inline-block text-[#00f2ff] mb-2" size={20} />
              <p>Ask questions, trust no one. The Impostor doesn't know the code, but they are listening.</p>
           </div>

        </main>

        <div className="p-6 z-10 w-full max-w-md mx-auto relative">
           <button 
            onClick={() => setGameState('result')} 
            className="w-full py-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all uppercase tracking-widest flex items-center justify-center gap-2"
           >
             <Fingerprint size={24} />
             STOP & VOTE
           </button>
        </div>
      </div>
    );
  }

  // 4. RESULT
  if (gameState === 'result') {
    const impostors = gameData.players.filter(p => p.role === 'impostor');

    return (
      <div className="min-h-screen bg-[#0a0e17] text-slate-100 flex flex-col items-center justify-center p-6 font-sans relative" dir="ltr">
        <LaserBackground />

        <div className="w-full max-w-md space-y-6 animate-in zoom-in duration-300 relative z-10">
          
          <div className="text-center mb-8">
            <Trophy className="mx-auto text-[#fbbf24] mb-4 drop-shadow-[0_0_20px_rgba(251,191,36,0.4)]" size={56} />
            <h1 className="text-4xl font-bold text-white tracking-tight">Mission Report</h1>
          </div>
          
          <HoloContainer>
             <div className="py-6 space-y-6 text-center">
                <div>
                  <p className="text-[#22c55e] text-xs font-bold tracking-[0.2em] uppercase mb-2">The Secret Word</p>
                  <p className="text-5xl font-bold text-white drop-shadow-2xl tracking-wide">{gameData.word}</p>
                </div>
                
                <div className="border-t border-white/10 pt-6">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Skull className="text-red-500" />
                    <h2 className="text-xl font-bold text-white">Impostors</h2>
                  </div>
                  <div className="flex flex-wrap justify-center gap-3">
                    {impostors.map(imp => (
                      <div key={imp.id} className="bg-red-500/10 text-red-200 px-4 py-2 rounded-xl font-bold border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.15)] flex items-center gap-2">
                        <img 
                          src={`https://api.dicebear.com/7.x/bottts/svg?seed=${imp.avatarSeed}`} 
                          alt="avatar" 
                          className="w-6 h-6 rounded-full bg-slate-800"
                        />
                        {imp.name}
                      </div>
                    ))}
                  </div>
                </div>
             </div>
          </HoloContainer>

          <div className="pt-6 flex gap-4">
             <StartButton onClick={startGame}>
               AGAIN
             </StartButton>
             <button onClick={() => setGameState('setup')} className="flex-1 mt-4 py-4 rounded-xl border border-white/20 hover:bg-white/10 text-white font-bold transition-colors">
               LOBBY
             </button>
          </div>

        </div>
      </div>
    );
  }

  return null;
}
