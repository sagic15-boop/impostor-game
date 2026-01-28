import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, Eye, EyeOff, UserPlus, Play, RotateCcw, 
  HelpCircle, Check, Crown, Skull, Fingerprint, 
  Sparkles, Timer, Trophy, Shuffle, Database, Settings, ArrowLeft, Maximize
} from 'lucide-react';

// --- Helper Functions ---

// Fisher-Yates Shuffle Algorithm
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
        {/* Avatar Image (Robot) */}
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

// --- DATA PACKS ---
const DATA_PACKS = {
  'חיות 🦁': [
    'אריה', 'פיל', 'ג׳ירפה', 'כלב', 'חתול', 'נחש', 'דולפין', 'נשר', 'פינגווין', 'קנגורו', 
    'עצלן', 'זברה', 'טיגריס', 'היפופוטם', 'צפרדע', 'זיקית', 'קיפוד', 'תמנון', 'כריש', 'ינשוף', 
    'גמל', 'אוגר', 'סוס', 'דוב קוטב', 'קואלה', 'פנדה', 'גורילה', 'זאב', 'שועל', 'ארנב', 
    'צבי', 'תנין', 'לוויתן', 'עטלף', 'טווס', 'פלמינגו', 'קרנף', 'סנאי', 'חזיר בר', 'יתוש',
    'דבורה', 'נמלה', 'עקרב', 'גמל שלמה', 'פרפר', 'גחלילית', 'חסידה', 'דרור', 'יען', 'פומה',
    'ברווז', 'תרנגול', 'כבשה', 'עז', 'פרה', 'חמור', 'סוס פוני', 'אפרוח', 'אווז', 'יונה',
    'עורב', 'תוכי', 'בז', 'עיט', 'יעל', 'שפן סלע', 'דורבן', 'נמייה', 'חתול בר', 'תן',
    'צבוע', 'בבון', 'שימפנזה', 'אורנגאוטן', 'למור', 'דביבון', 'בואש', 'לוטרה', 'בונה', 'חפרפרת',
    'עכבר', 'חולדה', 'שרקן', 'צ׳ינצ׳ילה', 'סלמנדרה', 'לטאה', 'חרדון', 'צב', 'איגואנה', 'קומודו',
    'מדוזה', 'דיונון', 'סרטן', 'לובסטר', 'שרימפס', 'סוס ים', 'כוכב ים', 'קיפוד ים', 'דג זהב', 'קרפיון',
    'סלמון', 'טונה', 'ברבור', 'אנפה', 'שקנאי', 'קורמורן', 'זבוב', 'צרעה', 'חיפושית', 'ג׳וק',
    'עכביש', 'תולעת', 'חילזון', 'חשופית', 'פרעוש', 'קרציה', 'כינה', 'טרמיט', 'חגב', 'צרצר'
  ],
  'מאכלים 🍕': [
    'פיצה', 'פלאפל', 'סושי', 'המבורגר', 'גלידה', 'שוקולד', 'פסטה', 'סלט', 'שווארמה', 'חומוס', 
    'ג׳חנון', 'שקשוקה', 'סטייק', 'צ׳יפס', 'אבטיח', 'פופקורן', 'סביח', 'בורקס', 'קוסקוס', 'מלוואח', 
    'טקו', 'פנקייק', 'קרמבו', 'שניצל', 'עוגת גבינה', 'קרואסון', 'לזניה', 'מרק עוף', 'דג מרוקאי', 'חמין',
    'פתיתים', 'אורז', 'קובה', 'ממולאים', 'בייגל', 'דונאטס', 'סנדוויץ׳ טונה', 'טוסט', 'נקניקיה בלחמניה', 'תירס חם',
    'ארטיק', 'וופל בלגי', 'נודלס', 'מוקפץ', 'דים סאם', 'חריימה', 'רגל קרושה', 'כבד קצוץ', 'מצה בריי', 'סופגניה',
    'חביתה', 'מקושקשת', 'ביצת עין', 'סלט ביצים', 'סלט טונה', 'סלט יווני', 'סלט קיסר', 'אנטיפסטי', 'פוקצ׳ה', 'לחם שום',
    'פיש אנד צ׳יפס', 'קציצות', 'בולונז', 'רביולי', 'ניוקי', 'ריזוטו', 'פשטידה', 'קיש', 'בורגול', 'מג׳דרה',
    'מסבחה', 'לאפה', 'פיתה דרוזית', 'כנאפה', 'בקלאווה', 'עוגת שוקולד', 'עוגת גזר', 'סברינה', 'אקלר', 'פחזנית',
    'עוגיות שוקולד צ׳יפס', 'בראוניז', 'מאפינס', 'סוכריה על מקל', 'מסטיק', 'מרשמלו', 'בייגלה', 'ביסלי', 'במבה', 'תפוצ׳יפס',
    'תפוח', 'בננה', 'תפוז', 'ענבים', 'אפרסק', 'משמש', 'שזיף', 'דובדבן', 'תות שדה', 'מלון',
    'קיווי', 'אגס', 'רימון', 'תאנה', 'תמר', 'אבוקדו', 'עגבניה', 'מלפפון', 'פלפל', 'גזר',
    'בצל', 'שום', 'תפוח אדמה', 'בטטה', 'חציל', 'קישוא', 'כרובית', 'ברוקולי', 'פטריות', 'תרד'
  ],
  'מדינות 🌍': [
    'ישראל', 'צרפת', 'ארצות הברית', 'יפן', 'איטליה', 'ברזיל', 'מצרים', 'סין', 'רוסיה', 'אוסטרליה', 
    'הודו', 'מקסיקו', 'קנדה', 'יוון', 'תאילנד', 'ארגנטינה', 'גרמניה', 'ספרד', 'אנגליה', 'טורקיה', 
    'קוריאה הדרומית', 'מרוקו', 'דרום אפריקה', 'שוויץ', 'הולנד', 'בלגיה', 'פורטוגל', 'שבדיה', 'נורבגיה', 'דנמרק',
    'איסלנד', 'אירלנד', 'סקוטלנד', 'פולין', 'הונגריה', 'צ׳כיה', 'אוקראינה', 'ירדן', 'ערב הסעודית', 'איחוד האמירויות',
    'ניו זילנד', 'וייטנאם', 'קולומביה', 'צ׳ילה', 'פרו', 'קובה', 'ג׳מייקה', 'קניה', 'ניגריה', 'אתיופיה',
    'אוסטריה', 'פינלנד', 'רומניה', 'בולגריה', 'קרואטיה', 'סרביה', 'קפריסין', 'מלטה', 'תוניסיה', 'אלג׳יריה',
    'איראן', 'עיראק', 'סוריה', 'לבנון', 'קטאר', 'בחריין', 'עומאן', 'תימן', 'פקיסטן', 'אפגניסטן',
    'נפאל', 'סרי לנקה', 'הפיליפינים', 'אינדונזיה', 'מלזיה', 'סינגפור', 'טייוואן', 'קוריאה הצפונית', 'מונגוליה', 'קזחסטן',
    'גאורגיה', 'ארמניה', 'אזרבייג׳ן', 'אוזבקיסטן', 'גאנה', 'חוף השנהב', 'סנגל', 'קמרון', 'אוגנדה', 'טנזניה',
    'מדגסקר', 'אורוגוואי', 'פרגוואי', 'בוליביה', 'אקוודור', 'ונצואלה', 'פנמה', 'קוסטה ריקה', 'גואטמלה', 'הונדורס'
  ],
  'מקצועות 💼': [
    'רופא', 'שוטר', 'מורה', 'כבאי', 'טייס', 'טבח', 'מתכנת', 'נגר', 'עורך דין', 'זמר', 
    'ליצן', 'וטרינר', 'ספר', 'נהג מונית', 'מציל', 'גנן', 'אדריכל', 'חשמלאי', 'מאמן כושר', 'מדען', 
    'אסטרונאוט', 'שופט', 'מלצר', 'קוסם', 'רופא שיניים', 'אינסטלטור', 'מוסכניק', 'נהג אוטובוס', 'דייל', 'שחקן כדורגל',
    'ראש ממשלה', 'עיתונאי', 'צלם', 'דוגמנית', 'סופר', 'צייר', 'פסיכולוג', 'רוקח', 'קופאי', 'מאבטח',
    'חייל', 'מנופאי', 'חקלאי', 'דייג', 'מציל בבריכה', 'מדריך טיולים', 'מרצה', 'אחות', 'פרמדיק', 'די ג׳יי',
    'מנקה רחובות', 'דוור', 'שליח', 'קצב', 'ירקן', 'אופה', 'קונדיטור', 'ברמן', 'טכנאי מחשבים', 'מנהל חשבונות',
    'כלכלן', 'יועץ השקעות', 'מתווך נדל״ן', 'מעצב פנים', 'מעצב אופנה', 'גרפיקאי', 'במאי', 'מפיק', 'תסריטאי', 'שחקן תיאטרון',
    'רקדן', 'כוריאוגרף', 'מוזיקאי', 'מנצח', 'פסל', 'צורף', 'שען', 'סנדלר', 'חייט', 'מנעולן',
    'זגג', 'צבעי', 'שיפוצניק', 'רתך', 'חרט', 'מהנדס בניין', 'מהנדס חשמל', 'מהנדס מכונות', 'ביולוג', 'כימאי',
    'פיזיקאי', 'ארכיאולוג', 'היסטוריון', 'ספרן', 'גננת', 'מטפלת', 'עובדת סוציאלית', 'פסיכיאטר', 'פיזיותרפיסט', 'רופא מנתח'
  ],
  'חפצים (כללי) 📦': [
    // חפצי בית
    'מקרר', 'טלוויזיה', 'מיטה', 'ספה', 'מחשב', 'שולחן', 'מזגן', 'תנור', 'מראה', 'שעון', 
    'מכונת כביסה', 'אסלה', 'מקלחת', 'קומקום', 'טוסטר', 'ארון בגדים', 'מנורה', 'כרית', 'שטיח', 'מיקרוגל', 
    'מברשת שיניים', 'מסרק', 'עציץ', 'מטאטא', 'מגב', 'דלי', 'סיר', 'מחבת', 'צלחת', 'כוס',
    'מזלג', 'סכין', 'כף', 'מגהץ', 'שואב אבק', 'פן לשיער', 'מטען לטלפון', 'שלט', 'וילון', 'תמונה',
    // חפצי חוץ ורחוב
    'ספסל', 'רמזור', 'עמוד חשמל', 'תמרור', 'ברז כיבוי', 'פח אשפה', 'נדנדה', 'מגלשה', 'פסל', 'מזרקה',
    'כספומט', 'שלט חוצות', 'גדר', 'שער', 'תיבת דואר', 'תחנת אוטובוס', 'מדחן', 'עץ', 'אבן', 'סלע',
    'ברזייה', 'אופניים', 'קסדה', 'תיק גב', 'שמשייה', 'כיסא נוח', 'מנגל', 'אוהל', 'פנס רחוב', 'מדרכה',
    'מכונית', 'משאית', 'אופנוע', 'מטוס', 'מסוק', 'רכבת', 'אונייה', 'סירה', 'גלגל', 'מנוע',
    'הגה', 'מפתחות', 'ארנק', 'טלפון נייד', 'אוזניות', 'משקפיים', 'שעון יד', 'טבעת', 'שרשרת', 'עגילים',
    'צמיד', 'כובע', 'מעיל', 'חולצה', 'מכנסיים', 'נעליים', 'גרביים', 'מטריה', 'בקבוק מים', 'עט',
    'עיפרון', 'מחק', 'מחברת', 'ספר', 'עיתון', 'מספריים', 'דבק', 'סלוטייפ', 'מהדק', 'מחשבון'
  ],
  'מותגים 🏷️': [
    'נייקי', 'אדידס', 'אפל', 'סמסונג', 'קוקה קולה', 'מקדונלדס', 'איקאה', 'גוגל', 'פייסבוק', 'אמזון',
    'נטפליקס', 'דיסני', 'טויוטה', 'מרצדס', 'טסלה', 'גוצ׳י', 'זארה', 'קסטרו', 'פוקס', 'תנובה',
    'אוסם', 'שטראוס', 'עלית', 'ביסלי', 'במבה', 'שופרסל', 'רמי לוי', 'סופר פארם', 'בנק הפועלים', 'אל על',
    'לגו', 'סוני', 'פלייסטיישן', 'אקס בוקס', 'נינטנדו', 'טוויטר', 'טיקטוק', 'אינסטגרם', 'יוטיוב', 'זום',
    'וואטסאפ', 'ספוטיפיי', 'פפסי', 'ספרייט', 'פאנטה', 'קינדר', 'נוטלה', 'פררו רושה', 'מילקה', 'אוראו',
    'פרינגלס', 'דוריתוס', 'היינץ', 'נסטלה', 'לוראל', 'שאנל', 'לואי ויטון', 'פראדה', 'ורסאצ׳ה', 'דיור',
    'אייץ׳ אנד אם', 'פול אנד בר', 'ברשקה', 'מאניה ג׳ינס', 'רנואר', 'הודיס', 'אדידס', 'פומה', 'ריבוק', 'אנדר ארמור',
    'ב.מ.וו', 'אאודי', 'פורשה', 'פרארי', 'למבורגיני', 'יונדאי', 'קיה', 'מאזדה', 'הונדה', 'סוזוקי',
    'מיקרוסופט', 'אינטל', 'אנבידיה', 'HP', 'דל', 'לנובו', 'קנון', 'ניקון', 'גו פרו', 'דייסון'
  ],
  'מקומות בישראל 🇮🇱': [
    'הכותל המערבי', 'החרמון', 'ים המלח', 'הכנרת', 'אילת', 'מצדה', 'שוק מחנה יהודה', 'דיזנגוף סנטר', 'הספארי', 'לונה פארק', 
    'הגנים הבהאיים', 'חוף הים', 'הכנסת', 'נתב״ג', 'עזריאלי', 'פארק הירקון', 'בניאס', 'קיסריה', 'נמל יפו', 'מכתש רמון',
    'ראש הנקרה', 'עין גדי', 'יד ושם', 'הר הבית', 'שרונה מרקט', 'הסינמה סיטי', 'סופרלנד', 'גן החיות התנ"כי', 'נמל תל אביב', 'שוק הכרמל',
    'ימית 2000', 'חמי געש', 'הסחנה', 'גן השלושה', 'נחל הירקון', 'נחל הקיבוצים', 'שמורת החולה', 'אגמון החולה', 'תל דן', 'נחל שניר',
    'המוזיאון הלאומי למדע', 'מוזיאון ישראל', 'מוזיאון תל אביב', 'הבימה', 'הקאמרי', 'בית ליסין', 'צוותא', 'אצטדיון סמי עופר', 'אצטדיון טדי', 'בלומפילד',
    'מערת הנטיפים', 'בית גוברין', 'פארק תמנע', 'ריף הדולפינים', 'המצפה התת ימי', 'קניון עזריאלי', 'קניון רמת אביב', 'גרנד קניון', 'הקריון', 'ביג פאשן',
    'מלון המלך דוד', 'מלון בראשית', 'יערות הכרמל', 'עין גב', 'חמת גדר', 'פארק אריאל שרון', 'מיני ישראל', 'לטרון', 'נמל קיסריה', 'עכו העתיקה'
  ],
  'דמויות (דיסני וגיבורים) 🎭': [
    // גיבורי על
    'ספיידרמן', 'באטמן', 'סופרמן', 'וונדר וומן', 'איירון מן', 'קפטן אמריקה', 'הענק הירוק', 'ת׳ור', 'האלמנה השחורה', 'הפנתר השחור', 
    'אקוומן', 'דדפול', 'וולברין', 'הפלאש', 'גרוט', 'קפטן מארוול', 'דוקטור סטריינג׳', 'אנטמן', 'סייבורג', 'גרין לנטרן',
    'הג׳וקר', 'תנוס', 'לוקי', 'הארלי קווין', 'רובין', 'סטורם', 'מגנטו', 'פרופסור אקס', 'סייקלופס', 'ונום',
    'דרדוויל', 'המעניש', 'בלייד', 'גוסט ריידר', 'הוקאיי', 'ניק פיורי', 'דוקטור אוקטופוס', 'הגובלין הירוק', 'ביין', 'לקס לותר',
    // דיסני/פיקסאר
    'מיקי מאוס', 'אלזה', 'סימבה', 'אלאדין', 'בת הים הקטנה', 'שרק', 'באז שנות אור', 'וודי', 'נימו', 'מואנה', 
    'שלגיה', 'פו הדב', 'סטיץ׳', 'במבי', 'פיטר פן', 'פינוקיו', 'מולאן', 'הרקולס', 'טימון ופומבה', 'מיניון',
    'גרו (גנוב על הירח)', 'אולף', 'אנה', 'מלך האריות', 'רפונזל', 'סינדרלה', 'היפה והחיה', 'טרזן', 'דונלד דאק', 'גופי',
    'פלוטו', 'מיני מאוס', 'דייזי דאק', 'טינקרבל', 'קפטן הוק', 'ג׳פדטו', 'דמבו', '101 כלבים וגנבים', 'קרואלה דה ויל', 'אליס בארץ הפלאות',
    'הכובען המטורף', 'חתול צ׳שייר', 'פו הדב', 'חזרזיר', 'איה', 'טיגר', 'כריסטופר רובין', 'מוגלי', 'בלו הדוב', 'בגירה'
  ],
  'סרטים 🎬': [
    'טיטאניק', 'אווטאר', 'הארי פוטר', 'שר הטבעות', 'מלחמת הכוכבים', 'הנוקמים', 'מטריקס', 'פארק היורה', 'מלך האריות', 'לשבור את הקרח (Frozen)',
    'שרק', 'צעצוע של סיפור', 'מהיר ועצבני', 'שליחות קטלנית', 'בחזרה לעתיד', 'פורסט גאמפ', 'הלב', 'גלדיאטור', 'לב אמיץ', 'חגיגה בסנוקר',
    'גבעת חלפון', 'צ׳רלי וחצי', 'אלכס חולה אהבה', 'קזבלן', 'מבצע סבתא', 'אי.טי.', 'מלתעות', 'הקוסם מארץ עוץ', 'משימה בלתי אפשרית', 'שודדי הקאריביים',
    'משחקי הרעב', 'האביר האפל', 'מלך הסלים', 'אבא גנוב', 'ספיידרמן', 'ג׳יימס בונד', 'הסנדק', 'ספרות זולה', 'רוקי', 'החבר׳ה הטובים',
    'מועדון קרב', 'החוש השישי', 'שתיקת הכבשים', 'חומות של תקווה', 'המספריים של אדוארד', 'מלך האריות', 'למעלה (Up)', 'הקול בראש', 'וול-E', 'רטטוי',
    'משפחת סופר-על', 'מכוניות', 'מפלצות בע"מ', 'היפה והחיה', 'אלאדין', 'בת הים הקטנה', 'מולאן', 'פוקהונטס', 'טרזן', 'הגיבן מנוטרדאם',
    'אפס ביחסי אנוש', 'הלהקה', 'דיזנגוף 99', 'סאלח שבתי', 'השוטר אזולאי', 'תעלת בלאומילך', 'חסמבה', 'בחינת בגרות', 'אסקימו לימון', 'בלוז לחופש הגדול',
    'מציצים', 'זוהי סדום', 'ימים נוראים', 'ביקור התזמורת', 'ואלס עם באשיר', 'אושפיזין', 'הערת שוליים', 'לבנון', 'בופור', 'ללכת על המים'
  ],
  'מפורסמים (בארץ ובעולם) ⭐': [
    // ישראל
    'גל גדות', 'נועה קירל', 'בנימין נתניהו', 'אייל גולן', 'עומר אדם', 'סטטיק', 'בן אל תבורי', 'בר רפאלי', 'אסי עזר', 'רותם סלע',
    'שלמה ארצי', 'אריק איינשטיין', 'זוהר ארגוב', 'שרית חדד', 'עדן בן זקן', 'יהודה לוי', 'נינט טייב', 'רן דנקר', 'אדיר מילר', 'ציון ברוך',
    'שלום אסייג', 'גיא פינס', 'יונית לוי', 'דני קושמרו', 'חיים אתגר', 'אופירה אסייג', 'אייל ברקוביץ׳', 'ערן זהבי', 'מנור סולומון', 'דני אבדיה',
    'גל גברעם', 'אנה זק', 'סטפן לגר', 'מרגי', 'אליעד נחום', 'עידן רייכל', 'מוש בן ארי', 'דודו אהרון', 'משה פרץ', 'ליאור נרקיס',
    'יאיר לפיד', 'נפתלי בנט', 'גולדה מאיר', 'דוד בן גוריון', 'שמעון פרס', 'יצחק רבין', 'מנחם בגין', 'הרצל', 'חיים נחמן ביאליק', 'אליעזר בן יהודה',
    // עולם
    'דונלד טראמפ', 'ג׳ו ביידן', 'ברק אובמה', 'ולדימיר פוטין', 'המלכה אליזבת', 'מייקל ג׳קסון', 'מדונה', 'ביונסה', 'טיילור סוויפט', 'ג׳סטין ביבר',
    'קים קרדשיאן', 'קנייה ווסט', 'אילון מאסק', 'מארק צוקרברג', 'ביל גייטס', 'סטיב ג׳ובס', 'אלברט איינשטיין', 'מרילין מונרו', 'אלביס פרסלי', 'פרדי מרקורי',
    'בראד פיט', 'אנג׳לינה ג׳ולי', 'לאונרדו דיקפריו', 'טום קרוז', 'ג׳וני דפ', 'וויל סמית׳', 'ג׳ניפר אניסטון', 'דה רוק (דוויין ג׳ונסון)', 'וין דיזל', 'ג׳קי צ׳אן',
    'ליונל מסי', 'כריסטיאנו רונאלדו', 'ניימאר', 'מייקל ג׳ורדן', 'קובי בראיינט', 'לברון ג׳יימס', 'סרינה ויליאמס', 'רוג׳ר פדרר', 'טייגר וודס', 'מוחמד עלי',
    'הארי סטיילס', 'אד שירן', 'אריאנה גרנדה', 'ריהאנה', 'ליידי גאגא', 'אדל', 'שאקירה', 'ג׳ניפר לופז', 'סלינה גומז', 'מיילי סיירוס'
  ],
  'ספורט 🏆': [
    'כדורגל', 'כדורסל', 'טניס', 'שחייה', 'כדורעף', 'ג׳ודו', 'ריצה', 'התעמלות אמנותית', 'גלישת גלים', 'פינג פונג', 
    'אגרוף', 'באולינג', 'גולף', 'בייסבול', 'פוטבול', 'רכיבה על סוסים', 'סקי', 'קפיצה לגובה', 'הוקי', 'כדוריד',
    'קראטה', 'היאבקות', 'הרמת משקולות', 'אופניים', 'טריאתלון', 'מרתון', 'סייף', 'קשתות', 'חתירה', 'שיט',
    'בדמינטון', 'סקווש', 'רוגבי', 'קריקט', 'סנוקר', 'ביליארד', 'שחמט', 'דמקה', 'שש-בש', 'פוקר',
    'יוגה', 'פילאטיס', 'זומבה', 'אירובי', 'קרוספיט', 'פארקור', 'סקייטבורד', 'רולר בליידס', 'טיפוס קירות', 'גלישת רוח',
    'צניחה חופשית', 'בנג׳י', 'רפטינג', 'קיאקים', 'סאפ', 'מטקות', 'כדורשת', 'מחניים', 'תופסת', 'מחבואים',
    'קפיצה לרוחק', 'קפיצה במוט', 'הדיפת כדור ברזל', 'זריקת דיסקוס', 'הטלת כידון', 'מירוץ שליחים', 'שחייה צורנית', 'כדורמים', 'צלילה', 'דיג',
    'פורמולה 1', 'מירוץ מכוניות', 'מירוץ אופנועים', 'מוטוקרוס', 'טרקטורונים', 'רכיבה על אופניים', 'החלקה על הקרח', 'הוקי קרח', 'קרלינג', 'סנובורד',
    'מונדיאל', 'אולימפיאדה', 'ליגת האלופות', 'מכבי תל אביב', 'מכבי חיפה', 'בית"ר ירושלים', 'הפועל תל אביב', 'נבחרת ישראל', 'ברצלונה', 'ריאל מדריד'
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
  
  const [usedWords, setUsedWords] = useState({});

  const totalWordsCount = useMemo(() => {
    return Object.values(DATA_PACKS).reduce((acc, curr) => acc + curr.length, 0);
  }, []);

  // Update max allowed impostors when players change
  useEffect(() => {
    const maxAllowed = Math.max(1, Math.floor(players.length / 2));
    if (impostorCount > maxAllowed) {
      setImpostorCount(maxAllowed);
    }
  }, [players.length, impostorCount]);

  // Helpers for neon colors
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
          colorTheme: getRandomColorTheme(), // Assign random neon color
          avatarSeed: Date.now() + Math.random().toString() // Unique seed for the robot
        }
      ]);
      setNewPlayerName('');
    }
  };

  const removePlayer = (id) => {
    setPlayers(players.filter(p => p.id !== id));
  };

  const getUniqueWord = (category) => {
    const allWords = DATA_PACKS[category];
    const used = usedWords[category] || [];
    let availableWords = allWords.filter(word => !used.includes(word));
    if (availableWords.length === 0) {
      availableWords = allWords;
      setUsedWords(prev => ({ ...prev, [category]: [] }));
    }
    const selectedWord = availableWords[Math.floor(Math.random() * availableWords.length)];
    setUsedWords(prev => {
      const currentUsed = prev[category] || [];
      const newList = availableWords.length === allWords.length 
        ? [selectedWord] 
        : [...currentUsed, selectedWord];
      return { ...prev, [category]: newList };
    });
    return selectedWord;
  };

  const startGame = () => {
    if (players.length < 3) return;
    const categories = Object.keys(DATA_PACKS);
    const selectedCategory = categories[Math.floor(Math.random() * categories.length)];
    const selectedWord = getUniqueWord(selectedCategory);

    // Use Fisher-Yates Shuffle for robust randomness
    let shuffledPlayers = shuffleArray([...players]);
    let roles = shuffledPlayers.map(p => ({ ...p, role: 'citizen' }));
    
    // Pick unique random indices for impostors using Fisher-Yates logic
    let indices = Array.from({ length: roles.length }, (_, i) => i);
    indices = shuffleArray(indices);
    
    for (let i = 0; i < impostorCount; i++) {
      roles[indices[i]].role = 'impostor';
    }

    // Pick a starter randomly
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
    const maxImpostors = Math.max(1, Math.floor(players.length / 2));

    return (
      <div className="min-h-screen bg-[#0a0e17] text-slate-100 font-sans selection:bg-[#00f2ff] selection:text-[#0f172a]" dir="ltr">
        <LaserBackground />

        <div className="relative max-w-md mx-auto p-4 min-h-screen flex flex-col z-10">
          
          {/* Header Pill */}
          <div className="flex justify-between items-center bg-slate-900/50 backdrop-blur-md rounded-full px-4 py-3 mb-6 border border-white/10 shadow-[0_0_15px_rgba(139,92,246,0.2)]">
            <button className="text-cyan-400 p-1 hover:bg-white/5 rounded-full"><ArrowLeft size={24} /></button>
            <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 uppercase tracking-widest">
              Game Setup
            </h1>
            <div className="flex gap-2">
              <button 
                onClick={toggleFullScreen}
                className="text-cyan-400 p-1 hover:bg-white/5 rounded-full"
                title="Toggle Fullscreen"
              >
                <Maximize size={24} />
              </button>
              <button className="text-cyan-400 p-1 hover:bg-white/5 rounded-full"><Settings size={24} /></button>
            </div>
          </div>

          {/* Main Holographic Container */}
          <HoloContainer title="Players Joining">
            
            {/* Player List */}
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

            {/* Input New Player */}
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

            {/* Game Settings (Impostors Slider) */}
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
                  {/* Glowing bubble over thumb (visual approximation) */}
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
             <p className="text-slate-600 text-xs">V 1.0.6 | The Impostor</p>
          </div>
        </div>
      </div>
    );
  }

  // 2. REVEAL
  if (gameState === 'reveal') {
    const currentPlayer = gameData.players[revealIndex];
    const isImpostor = currentPlayer.role === 'impostor';

    return (
      <div className="min-h-screen bg-[#0a0e17] text-slate-100 flex flex-col font-sans relative" dir="ltr">
        <LaserBackground />
        
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto w-full relative z-10">
          {!isCardVisible ? (
             <HoloContainer>
                <div className="py-8 space-y-8">
                  {/* Big Avatar */}
                  <div className="relative w-32 h-32 mx-auto">
                      <div className="absolute inset-0 bg-[#00f2ff] rounded-full blur-2xl opacity-20 animate-pulse"></div>
                      <div className="relative bg-slate-800 rounded-full w-full h-full flex items-center justify-center ring-1 ring-[#00f2ff]/30 shadow-[0_0_30px_rgba(0,242,255,0.2)] overflow-hidden">
                        <img 
                          src={`https://api.dicebear.com/7.x/bottts/svg?seed=${currentPlayer.avatarSeed}`} 
                          alt="avatar" 
                          className="w-24 h-24 object-cover"
                        />
                      </div>
                  </div>
                  
                  <div>
                      <div className="text-[#00f2ff] text-sm tracking-[0.2em] uppercase mb-2 font-bold animate-pulse">Security Level: TOP SECRET</div>
                      <h2 className="text-2xl text-slate-300 font-medium">Pass device to</h2>
                      <h1 className="text-5xl font-bold mt-2 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                        {currentPlayer.name}
                      </h1>
                  </div>
                  
                  <StartButton onClick={() => setIsCardVisible(true)}>
                    REVEAL IDENTITY
                  </StartButton>
                </div>
             </HoloContainer>
          ) : (
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
                 </div>

                 <div className="py-6 px-4 bg-slate-900/80 rounded-xl border border-white/10 space-y-4">
                    {isImpostor ? (
                      <>
                        <p className="text-red-200 font-medium">Mission: Blend in & identify the secret word.</p>
                        <div className="pt-4 border-t border-white/10">
                          <span className="text-xs text-slate-500 block mb-1 uppercase tracking-wider">Category Hint</span>
                          <span className="text-xl font-bold text-white">{gameData.category}</span>
                        </div>
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

                 <button onClick={nextReveal} className="w-full py-4 rounded-xl border border-white/20 hover:bg-white/10 text-white font-bold transition-colors">
                    HIDE INTEL
                 </button>
               </div>
            </HoloContainer>
          )}
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
            <button 
              onClick={toggleFullScreen}
              className="bg-slate-900/50 p-3 rounded-full hover:bg-slate-700 transition-colors border border-white/10 text-cyan-400"
              title="Toggle Fullscreen"
            >
              <Maximize size={20} />
            </button>
            <button onClick={() => setGameState('setup')} className="bg-slate-900/50 p-3 rounded-full hover:bg-slate-700 transition-colors border border-white/10">
              <RotateCcw size={20} className="text-slate-300" />
            </button>
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
