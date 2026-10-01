import { create } from 'zustand';
import { callGemini } from '../services/ai/gemini';
import { useGenomeStore } from './genomeStore';
import { searchKnowledgeBase } from '../services/search/fuzzySearch';

export const AI_MODES = [
  { id: 'explain', name: 'شرح كود', nameEn: 'Explain', icon: 'BookOpen', desc: 'تفكيك الكود المعقد وتبسيط منطقه خطوة بخطوة' },
  { id: 'debug', name: 'تصحيح أخطاء', nameEn: 'Debug', icon: 'Bug', desc: 'تحليل الأخطاء وحساب مستوى الثقة والوقاية' },
  { id: 'review', name: 'مراجعة هندسية', nameEn: 'Review', icon: 'CheckCheck', desc: 'فحص الأمان، الأداء، والتوافق مع أفضل الممارسات' },
  { id: 'brainstorm', name: 'عصف ذهني', nameEn: 'Brainstorm', icon: 'Lightbulb', desc: 'استكشاف بدائل معمارية وتصاميم واجهات ذكية' },
  { id: 'architect', name: 'تصميم معماري', nameEn: 'Architect', icon: 'Cpu', desc: 'تحديد قرارات البنية (ADR) وتدفق قواعد البيانات' },
  { id: 'teach', name: 'تعليم تفاعلي', nameEn: 'Teach', icon: 'GraduationCap', desc: 'شرح المفاهيم البرمجية العميقة وتدريب العقل' },
  { id: 'challenge', name: 'تحدي كود', nameEn: 'Challenge', icon: 'Trophy', desc: 'إنشاء تحديات برمجية مخصصة لاختبار فهمك' },
  { id: 'refactor', name: 'إعادة هيكلة', nameEn: 'Refactor', icon: 'Sparkles', desc: 'تحويل الكود إلى نمط نظيف بأعلى كفاءة' },
  { id: 'searchKnowledge', name: 'ابحث في مكتبتي', nameEn: 'Search My Knowledge', icon: 'Search', desc: 'فحص جينومك البرمجي الخاص والعثور على حلولك السابقة' },
];

export const useAIStore = create((set, get) => ({
  activeMode: 'explain',
  messages: [
    {
      id: 'welcome',
      role: 'assistant',
      content: `أهلاً بك يا حسام في **Genome AI** — مرشدك وذاكرتك البرمجية الذكية. 

أنا مبرمج ومصمم أنظمة متخصص، ولدي وصول مباشر إلى مكتبتك البرمجية (**Code Genome**)، مشاريعك، وسجل القرارات المعمارية.

اختر أحد الأنماط من الأعلى، أو اسألني مباشرة:
* "هل قمت بحل مشكلة مشابهة لـ Stale Closure سابقاً؟"
* "كيف أقوم بتأمين مسارات Webhook متجر سلة؟"
* "راجع هذا الكود واقترح تحسينات للأداء."`,
      timestamp: new Date().toLocaleTimeString('ar-SA')
    }
  ],
  inputPrompt: '',
  isGenerating: false,

  setActiveMode: (mode) => set({ activeMode: mode }),
  setInputPrompt: (val) => set({ inputPrompt: val }),

  sendMessage: async (customText) => {
    const text = customText || get().inputPrompt;
    if (!text.trim()) return;

    const userMsg = {
      id: Date.now(),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString('ar-SA')
    };

    set((state) => ({
      messages: [...state.messages, userMsg],
      inputPrompt: '',
      isGenerating: true
    }));

    const mode = get().activeMode;
    let systemInstruction = `You are Genome AI, a senior developer mentor for Code Genome platform. Respond in polite, modern Arabic with appropriate English technical terms. Active mode: ${mode}.`;

    // Special Mode: Search My Knowledge!
    if (mode === 'searchKnowledge') {
      const allGenomes = useGenomeStore.getState().genomes;
      const searchRes = searchKnowledgeBase({ query: text, genomes: allGenomes });
      const matchedCount = searchRes.genomes.length;

      let customReply = '';
      if (matchedCount > 0) {
        customReply = `وجدت **${matchedCount}** عنصر مطابق في مكتبتك الخاصة:\n\n`;
        searchRes.genomes.slice(0, 3).forEach((g, i) => {
          customReply += `### ${i + 1}. [${g.title}] (${g.technology} - ${g.type})\n`;
          customReply += `* **المشكلة التي يحلها:** ${g.problem || g.description}\n`;
          customReply += `* **درجة الاستعداد:** \`${g.status}\` | **الصعوبة:** \`${g.difficulty}\`\n\n`;
          customReply += `\`\`\`${g.language}\n${g.code.slice(0, 200)}...\n\`\`\`\n\n`;
        });
        customReply += `\n> 💡 **نصيحة جينوم:** يمكنك فتح أي من هذه العناصر مباشرة في المختبر وتطوير نسخة جديدة منها.`;
      } else {
        customReply = `بحثت في مكتبتك البرمجية ولم أجد تطابقاً مباشراً لكلمة "${text}". \n\nهل ترغب في أن نكتب حلاً جديداً معاً ونقوم بحفظه كـ **Code Genome** جديد؟`;
      }

      set((state) => ({
        messages: [
          ...state.messages,
          {
            id: Date.now() + 1,
            role: 'assistant',
            content: customReply,
            timestamp: new Date().toLocaleTimeString('ar-SA')
          }
        ],
        isGenerating: false
      }));
      return;
    }

    try {
      const response = await callGemini({
        prompt: text,
        systemInstruction,
        jsonMode: false
      });

      const replyContent = typeof response.data === 'string' 
        ? response.data 
        : (response.data?.message || JSON.stringify(response.data, null, 2));

      set((state) => ({
        messages: [
          ...state.messages,
          {
            id: Date.now() + 1,
            role: 'assistant',
            content: replyContent,
            source: response.source,
            timestamp: new Date().toLocaleTimeString('ar-SA')
          }
        ],
        isGenerating: false
      }));
    } catch (e) {
      console.error('AI chat error:', e);
      set((state) => ({
        messages: [
          ...state.messages,
          {
            id: Date.now() + 1,
            role: 'assistant',
            content: 'حدث خطأ مؤقت في الاتصال بالذكاء الاصطناعي. مكتبتك البرمجية آمنة ويمكنك مراجعة كافة الحلول محلياً.',
            timestamp: new Date().toLocaleTimeString('ar-SA')
          }
        ],
        isGenerating: false
      }));
    }
  },

  clearChat: () => set({
    messages: [
      {
        id: 'welcome_reset',
        role: 'assistant',
        content: 'تم بدء محادثة جديدة. كيف يمكنني مساعدتك برمجياً الآن؟',
        timestamp: new Date().toLocaleTimeString('ar-SA')
      }
    ]
  })
}));
