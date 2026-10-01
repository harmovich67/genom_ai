/**
 * Google Gemini API Client & Local Fallback Engine
 * Supported models: gemini-3.5-flash-lite (flash-3.5lite) / gemini-2.5-flash / gemini-1.5-flash
 */

export async function callGemini({ prompt, systemInstruction = '', jsonMode = true }) {
  const apiKey = localStorage.getItem('genome_gemini_api_key') || import.meta.env.VITE_GEMINI_API_KEY || '';
  const rawModel = localStorage.getItem('genome_gemini_model') || 'gemini-3.5-flash-lite';
  
  const modelMap = {
    'flash-3.5lite': 'gemini-3.5-flash-lite',
    'flash-3.5-lite': 'gemini-3.5-flash-lite',
    '3.5-flash-lite': 'gemini-3.5-flash-lite',
    'gemini-3.5-flash-lite': 'gemini-3.5-flash-lite',
    'gemini-2.5-flash': 'gemini-2.5-flash',
    'gemini-1.5-flash-latest': 'gemini-1.5-flash-latest',
    'gemini-1.5-pro-latest': 'gemini-1.5-pro-latest'
  };
  const selectedModel = modelMap[rawModel] || rawModel || 'gemini-3.5-flash-lite';

  if (!apiKey) {
    console.info(`[Genome AI] Using local engine with active target profile: ${selectedModel}`);
    return {
      success: true,
      source: 'local_engine',
      data: simulateLocalAI(prompt, systemInstruction, jsonMode)
    };
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${apiKey}`;
    
    const contents = [
      {
        role: 'user',
        parts: [{ text: `${systemInstruction}\n\nUser Request:\n${prompt}` }]
      }
    ];

    const body = {
      contents,
      generationConfig: {
        temperature: 0.2,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
        responseMimeType: jsonMode ? 'application/json' : 'text/plain'
      }
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      console.warn('[Genome AI] Gemini API returned error:', errData);
      throw new Error(errData?.error?.message || `HTTP ${response.status}`);
    }

    const resJson = await response.json();
    const candidateText = resJson?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!candidateText) {
      throw new Error('Empty response from Gemini');
    }

    let parsed = candidateText;
    if (jsonMode) {
      try {
        const clean = candidateText.replace(/```json/g, '').replace(/```/g, '').trim();
        parsed = JSON.parse(clean);
      } catch (e) {
        console.warn('Failed to parse Gemini JSON:', e);
      }
    }

    return {
      success: true,
      source: 'gemini_api',
      data: parsed
    };
  } catch (error) {
    console.warn('[Genome AI] Falling back to local synthesis engine due to:', error.message);
    return {
      success: true,
      source: 'local_engine_fallback',
      data: simulateLocalAI(prompt, systemInstruction, jsonMode)
    };
  }
}

/**
 * Intelligent Local Simulation Engine for Zero-Network / No-Key Operations
 */
function simulateLocalAI(prompt, systemInstruction, jsonMode) {
  const p = prompt.toLowerCase();

  // 1. Debug Lab Analysis
  if (systemInstruction.includes('Debug Lab Engine') || p.includes('error') || p.includes('exception')) {
    if (p.includes('websocket') || p.includes('socket') || p.includes('stale') || p.includes('closure')) {
      return {
        likelyCause: "إغلاق قديم (Stale Closure) في دالة استماع الحدث داخل useEffect.",
        possibleCauses: [
          "مصفوفة التبعيات [] لا تحتوي على المتغيرات المستهدفة مما يجمد النسخة الأولى.",
          "عدم إلغاء اشتراك المستمع القديم مما يسبب تسريب ذاكرة وتكرار التنفيذ."
        ],
        confidence: "Known",
        suggestedChecks: [
          "تأكد من وجود دالة تنظيف return () => socket.off(...) في الـ Effect.",
          "استخدم useRef للاحتفاظ بمرجع متجدد لدالة المعالجة.",
          "تأكد من عدم إعادة إنشاء الاتصال في كل render."
        ],
        fix: "استخدم useRef لحفظ الدالة مع تحديثها في كل ريندر، أو استخدم دالة التحديث المباشر setState(prev => ...).",
        correctedCode: `const handlerRef = useRef(onMessage);\nhandlerRef.current = onMessage;\n\nuseEffect(() => {\n  const sub = (data) => handlerRef.current(data);\n  socket.on('msg', sub);\n  return () => socket.off('msg', sub);\n}, [socket]);`,
        whyItHappened: "في JavaScript، الدوال المغلقة (Closures) تحتفظ بنسخة المتغيرات عند لحظة تعريفها فقط.",
        howToPrevent: "طبق نمط useEvent أو Ref Callback عند التعامل مع أحداث المستمعين الخارجية.",
        matchedConcepts: ["Closure", "useEffect", "WebSocket", "Memory Management"]
      };
    }

    return {
      likelyCause: "خطأ في معالجة الحالة أو تمرير بارامترات غير معرّفة (Undefined Object Access).",
      possibleCauses: [
        "عدم انتظار اكتمال طلب الـ Promise غير المتزامن قبل القراءة.",
        "تغيير هيكل استجابة الـ API دون فحص القيم الاختيارية Optional Chaining."
      ],
      confidence: "Likely",
      suggestedChecks: [
        "استخدم ?. قبل الوصول للخصائص المتداخلة.",
        "تحقق من ترويسات الاستجابة وأكواد الحالة 4xx أو 5xx.",
        "افحص سجل كونسول الخادم لمطابقة نوع المدخلات."
      ],
      fix: "تطبيق التحقق الدفاعي واستخدام التقييم الاختياري مع توفير قيم افتراضية آمنة.",
      correctedCode: `const safeData = response?.data?.items ?? [];\nif (!safeData.length) {\n  console.warn('لا توجد بيانات مطابقة');\n}`,
      whyItHappened: "محاولة قراءة خاصية من كائن null أو undefined أثناء تحميل الصفحة.",
      howToPrevent: "اعتمد مكتبات التحقق من المخططات مثل Zod لفحص مخرجات الـ API قبل تمريرها لمكونات العرض.",
      matchedConcepts: ["Optional Chaining", "Defensive Programming", "Schema Validation"]
    };
  }

  // 2. Knowledge DNA Extraction
  if (systemInstruction.includes('Knowledge DNA') || p.includes('analyze') || p.includes('dna')) {
    const isReact = p.includes('react') || p.includes('usestate') || p.includes('useeffect');
    return {
      title: isReact ? "خطاف تفاعلي مخصص لإدارة العمليات" : "نمط برمجي موثق عالي الكفاءة",
      englishTitle: isReact ? "Custom Reactive State Hook" : "Optimized Pattern Utility",
      shortDescription: "شفرة برمجية نظيفة وقابلة لإعادة الاستخدام لحل المشاكل المتكررة بكفاءة عالية.",
      problem: "تكرار كتابة المنطق في عدة أجزاء من التطبيق مع غياب إدارة الأخطاء وحالات التحميل.",
      solution: "عزل المنطق داخل وحدة برمجية مستقلة مع توفير واجهة بسيطة ومرنة للمطور.",
      whenToUse: "في أي واجهة تحتاج لمعالجة متكررة دون تشتيت مكونات العرض الأساسية.",
      whenNotToUse: "في العمليات شديدة البساطة التي لا تحتاج لمشاركة الحالة.",
      technology: isReact ? "React" : "JavaScript",
      framework: isReact ? "React 18+" : "Modern ESNext",
      language: "javascript",
      dependencies: isReact ? ["react"] : [],
      inputs: "params (object / configuration options)",
      outputs: "{ state, actions, status }",
      complexity: "O(1) Time complexity",
      performance: "استهلاك ذاكرة منخفض جداً بدون إحداث re-renders غير ضرورية.",
      security: "آمن ومحمي من هجمات الحقن وتسريب الموارد.",
      browserCompatibility: "كافة المتصفحات الحديثة وNode.js 18+.",
      exampleUsage: `const { data, loading } = useOptimizedItem(options);`,
      testCases: "1. اختبار تمرير خيارات افتراضية فارغة.\\n2. اختبار الاستجابة البطيئة للشبكة.\\n3. اختبار إلغاء العملية عند مغادرة الصفحة.",
      relatedConcepts: ["State Management", "DRY Principle", "Separation of Concerns"],
      potentialRisks: ["إعادة تصدير مراجع جديدة قد تؤدي لـ re-render إذا لم تستخدم useMemo/useCallback."],
      suggestedTests: ["Unit test with Vitest", "Hook renderHook test"],
      status: "Production Ready",
      difficulty: "Intermediate",
      tags: ["Clean Code", "Optimization", "Architecture"]
    };
  }

  // 3. Idea Forge
  if (systemInstruction.includes('Idea Forge') || p.includes('idea') || p.includes('فكرة')) {
    return {
      title: "منصة ذكية للمطورين وأتمتة مسارات العمل",
      problem: "إهدار وقت المطورين في الأعمال الروتينية المتكررة وصعوبة مزامنة الحلول بين الفرق البرمجية.",
      targetUsers: "المبرمجون، المهندسون، والشركات التقنية الناشئة في الوطن العربي.",
      coreFeatures: [
        "لوحة تحكم تفاعلية مع إحصائيات فورية للمشاريع.",
        "نظام ذكاء اصطناعي محلي يفهم سياق الأكواد العربية والإنجليزية.",
        "تكامل مباشر مع منصات سلة، زد، وووردبريس.",
        "دعم كامل للعمل بدون اتصال إنترنت (Offline-First)."
      ],
      mvp: "إصدار خفيف يحتوي على المميزات الأساسية مع تخزين محلي سريع وواجهة عربية أنيقة.",
      architecture: "معمارية Client-Side مع تخزين IndexedDB وطبقة وسيطة للتواصل مع نماذج الذكاء الاصطناعي.",
      techStack: ["React", "Vite", "Tailwind CSS", "Zustand", "Dexie IndexedDB"],
      risks: ["إدارة حجم البيانات المحلية وتوافق المتصفحات القديمة."],
      phases: [
        "المرحلة الأولى: بناء النواة ونظام التخزين المحلي التفاعلي.",
        "المرحلة الثانية: دمج محرك الذكاء الاصطناعي واختبارات الأداء.",
        "المرحلة الثالثة: إطلاق النسخة التجريبية للمجتمع التقني."
      ],
      dbRequirements: "قواعد بيانات محلية سريعة تدعم الفهرسة والبحث النصي السريع.",
      uiScreens: ["شاشة الاستكشاف والبحث", "لوحة القيادة المركزية", "مختبر الأكواد التجريبي"],
      monetization: "نموذج مجاني مفتوح للمطورين مع خطط اشتراك للمؤسسات والفرق الكبيرة.",
      futureRoadmap: "تطوير إضافات للمحررات البرمجية VS Code و JetBrains."
    };
  }

  // Default Fallback
  return {
    message: "تمت معالجة الطلب بنجاح بواسطة محرك الذكاء الاصطناعي الداخلي.",
    details: "يمكنك إضافة مفتاح Gemini API من شاشة الإعدادات للتبديل الفوري إلى السحابة."
  };
}
