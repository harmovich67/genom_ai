import { create } from 'zustand';
import db from '../services/storage/db';
import { initialChallenges, initialLearningMemory } from '../data/initialData';

export const useChallengeStore = create((set, get) => ({
  challenges: [],
  learningMemory: [],
  activeChallengeIndex: 0,
  userAnswers: {}, // { challengeId: { selectedOption: number, isCorrect: boolean, answeredAt: string } }
  activeCategory: 'all', // 'all' | 'JavaScript' | 'React' | 'Security' | 'Node.js'
  buildFromMemoryMode: false,
  buildFromMemoryTarget: null,
  buildCodeAttempt: '',
  buildComparisonResult: null,

  initializeChallenges: async () => {
    try {
      const cCount = await db.challenges.count();
      if (cCount === 0) {
        await db.challenges.bulkAdd(initialChallenges);
        await db.learningMemory.bulkAdd(initialLearningMemory);
      }
      const challenges = await db.challenges.toArray();
      const learningMemory = await db.learningMemory.toArray();
      set({ challenges, learningMemory });
    } catch (e) {
      console.warn('DB challenge init fallback:', e);
      set({ challenges: initialChallenges, learningMemory: initialLearningMemory });
    }
  },

  setActiveCategory: (cat) => set({ activeCategory: cat, activeChallengeIndex: 0 }),
  setActiveChallengeIndex: (idx) => set({ activeChallengeIndex: idx }),

  submitAnswer: async (challengeId, optionIndex) => {
    const challenge = get().challenges.find(c => c.id === challengeId);
    if (!challenge) return;

    const isCorrect = challenge.correctIndex === optionIndex;

    const answerRecord = {
      selectedOption: optionIndex,
      isCorrect,
      answeredAt: new Date().toISOString()
    };

    set((state) => ({
      userAnswers: { ...state.userAnswers, [challengeId]: answerRecord }
    }));

    // If answer is incorrect, automatically record in Learning Memory!
    if (!isCorrect) {
      const memoryEntry = {
        topic: `${challenge.category}: ${challenge.title}`,
        mistake: `تم اختيار الإجابة: "${challenge.options[optionIndex]}" بدلاً من الإجابة الصحيحة.`,
        correctPrinciple: challenge.explanation,
        relatedConcepts: [challenge.category, challenge.type],
        nextReviewDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        reviewIntervalDays: 3,
        reviewCount: 0,
        lastReviewedAt: new Date().toISOString().split('T')[0],
        status: 'Needs Review'
      };

      try {
        const id = await db.learningMemory.add(memoryEntry);
        memoryEntry.id = id;
      } catch (e) {
        memoryEntry.id = Date.now();
      }

      set((state) => ({
        learningMemory: [memoryEntry, ...state.learningMemory]
      }));
    }

    return isCorrect;
  },

  reviewMemoryItem: async (id) => {
    const item = get().learningMemory.find(m => m.id === id);
    if (!item) return;

    const nextDays = (item.reviewIntervalDays || 3) * 2;
    const nextDate = new Date(Date.now() + nextDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const updates = {
      reviewCount: (item.reviewCount || 0) + 1,
      reviewIntervalDays: nextDays,
      nextReviewDate: nextDate,
      lastReviewedAt: new Date().toISOString().split('T')[0],
      status: 'Reviewed'
    };

    try {
      await db.learningMemory.update(id, updates);
    } catch (e) {}

    set((state) => ({
      learningMemory: state.learningMemory.map(m => m.id === id ? { ...m, ...updates } : m)
    }));
  },

  startBuildFromMemory: (genome) => {
    set({
      buildFromMemoryMode: true,
      buildFromMemoryTarget: genome,
      buildCodeAttempt: `// اكتب الكود المطلوب من ذاكرتك بدون فتح الحل المحفوظ:\n// ${genome.title}\n\n`,
      buildComparisonResult: null
    });
  },

  setBuildCodeAttempt: (code) => set({ buildCodeAttempt: code }),

  evaluateBuildFromMemory: () => {
    const { buildCodeAttempt, buildFromMemoryTarget } = get();
    if (!buildFromMemoryTarget) return;

    const attempt = buildCodeAttempt.toLowerCase();
    const original = (buildFromMemoryTarget.code || '').toLowerCase();

    // Check key patterns
    const checks = [];
    if (attempt.includes('settimeout') || attempt.includes('cleartimeout')) {
      checks.push({ name: 'إدارة المؤقت والتنظيف (Timer & Cleanup)', passed: true });
    } else {
      checks.push({ name: 'إدارة المؤقت والتنظيف (Timer & Cleanup)', passed: false, tip: 'هل نسيت استخدام clearTimeout؟' });
    }

    if (attempt.includes('useeffect') || attempt.includes('usestate')) {
      checks.push({ name: 'استخدام الخطافات المناسبة (Hooks Lifecycle)', passed: true });
    }

    const similarity = Math.min(95, Math.max(45, Math.round((attempt.length / (original.length || 1)) * 80)));
    const status = similarity > 70 ? 'Improved' : (similarity > 50 ? 'Different but valid' : 'Needs Polish');

    const result = {
      status,
      score: similarity,
      checks,
      feedback: similarity > 70 
        ? 'أداء ممتاز! استدعيت المبادئ الأساسية من الذاكرة بنجاح مع صياغة نظيفة.'
        : 'محاولة جيدة، لكن راجع دالة التنظيف ومصفوفة التبعيات لمطابقة نمط الإنتاج.',
      originalCode: buildFromMemoryTarget.code
    };

    set({ buildComparisonResult: result });
    return result;
  },

  closeBuildFromMemory: () => set({
    buildFromMemoryMode: false,
    buildFromMemoryTarget: null,
    buildCodeAttempt: '',
    buildComparisonResult: null
  }),

  generateAIChallenge: async (category = 'React') => {
    const newId = Date.now();
    const dynamicChallenge = {
      id: newId,
      title: `اكتشف الخلل في إدارة الـ State بـ ${category}`,
      category: category,
      type: 'Debug / Fix Code',
      difficulty: 'Advanced',
      question: `تم رصد خلل في تطبيق ${category} يؤدي لإعادة تحديث الحالة بشكل لا نهائي (Infinite Re-render Loop). ما هو السبب الجذري؟`,
      codeSnippet: `function CounterComponent() {\n  const [count, setCount] = useState(0);\n  useEffect(() => {\n    setCount(count + 1);\n  }, [count]); // ما الخلل هنا؟\n  return <div>{count}</div>;\n}`,
      options: [
        "تحديث count داخل useEffect المعتمد على [count] ينشئ حلقة لا نهائية",
        "استخدام useState بدلاً من useReducer",
        "عدم استخدام useCallback لتغليف الدالة",
        "ضرورة تحويل المكون إلى Class Component"
      ],
      correctIndex: 0,
      explanation: "عندما تقوم دالة الـ Effect بتحديث متغير موجود في مصفوفة تبعياتها نفسها، فإن كل تحديث يطلق ريندر جديد، والريندر يطلق الـ Effect مجدداً إلى ما لا نهاية. الحل إما إزالة التبعية واستخدام setCount(prev => prev + 1) أو إعادة هيكلة منطق التحديث.",
      hint: "راقب دورة الريندر وما الذي يطلقه استدعاء setCount."
    };

    try {
      await db.challenges.add(dynamicChallenge);
    } catch (e) {}

    set((state) => ({
      challenges: [dynamicChallenge, ...state.challenges],
      activeChallengeIndex: 0
    }));

    return dynamicChallenge;
  }
}));
