export const initialGenomes = [
  {
    id: 1,
    title: "خطاف التهدئة للبحث التفاعلي (useDebounce Hook)",
    englishTitle: "useDebounce Hook for Search Inputs",
    description: "خطاف مخصص في React لتأخير تنفيذ عمليات البحث وتحديث الحالة حتى يتوقف المستخدم عن الكتابة لتفادي إرهاق الخادم.",
    problem: "عند كتابة المستخدم في حقل البحث، يتم إطلاق استدعاءات API بعد كل حرف مما يسبب ضغطاً هائلاً واستجابات غير متزامنة.",
    solution: "استخدام setTimeout مع دالة تنظيف clearTimeout داخل useEffect لضمان إطلاق البحث بعد انقضاء فترة الخمول المحددة.",
    code: `import { useState, useEffect } from 'react';

/**
 * useDebounce Hook
 * @param {any} value - القيمة المراد تأخيرها
 * @param {number} delay - مدة التأخير بالمللي ثانية (الافتراضي 300ms)
 * @returns {any} القيمة المهدأة
 */
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // ضبط مؤقت لتحديث القيمة بعد انتهاء التأخير
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // تنظيف المؤقت عند تغير القيمة قبل اكتمال المدة (Stale Closure Prevention)
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}`,
    language: "javascript",
    technology: "React",
    framework: "React 18+",
    type: "React Hook",
    status: "Production Ready",
    difficulty: "Intermediate",
    tags: ["React", "Hooks", "Performance", "Search", "State"],
    inputs: "value (any), delay (number)",
    outputs: "debouncedValue (any)",
    complexity: "O(1) Time, O(1) Space",
    performance: "يقلل استدعاءات شبكة البحث بنسبة تصل إلى 85% أثناء الكتابة السريعة.",
    security: "لا توجد مخاطر أمنية مباشرة، يساعد في منع هجمات Denial-of-Service الناتجة عن إغراق الخادم بطلبات الإكمال التلقائي.",
    compatibility: "React 16.8+، يعمل في كافة المتصفحات الحديثة وبيئات Next.js / Remix.",
    exampleUsage: `function SearchComponent() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => {
    if (debouncedSearch) {
      fetchSearchResults(debouncedSearch);
    }
  }, [debouncedSearch]);

  return <input value={search} onChange={e => setSearch(e.target.value)} />;
}`,
    testCases: "1. الكتابة السريعة لأكثر من 5 أحرف تؤدي لتحديث واحد فقط.\\n2. إفراغ الحقل يحدّث القيمة المهدأة فور انتهاء المهلة.\\n3. تغيير مدة delay ديناميكياً يعيد ضبط المؤقت بسلاسة.",
    relatedConcepts: ["useEffect", "Event Loop", "Closure", "Throttle vs Debounce"],
    relatedBugs: ["React Stale Closure in WebSocket Listener"],
    relatedProjects: ["منصة عمرة الذكية", "محرك وميض لتصحيح لغة الكيبورد"],
    personalNotes: "اعتمدت هذا النمط في كافة حقول البحث بالمنصة، ممتاز جداً مع React Query.",
    aiExplanation: "يقوم هذا الخطاف بفصل وتأخير تحديث القيمة عن طريق إدارة دورة حياة مؤقت الـ browser مع ضمان استدعاء دالة التنظيف عند كل render لتجنب تسريب الذاكرة أو تنفيذ طلبات قديمة.",
    confidence: "99%",
    lastReviewed: "2026-09-28",
    isFavorite: true,
    createdAt: "2026-08-10T10:00:00Z",
    updatedAt: "2026-09-28T14:30:00Z"
  },
  {
    id: 2,
    title: "التحقق من توقيع خطافات الويب لمتجر سلة (Salla Webhook Validator)",
    englishTitle: "Salla Webhook HMAC Signature Validator",
    description: "التحقق الأمني المشفر من صحة التواقيع الرقمية للطلبات الواردة من خطافات سلة الإلكترونية لمنع هجمات التزييف.",
    problem: "قد يقوم مخترق بإرسال طلبات دفع وهمية إلى مسار الـ Webhook الخاص بك دون أن تكون صادرة فعلياً من خوادم منصة سلة.",
    solution: "حساب HMAC-SHA256 باستخدام المفتاح السري المخصص من سلة ومطابقة الناتج مع ترويسة x-salla-signature باستخدام crypto.timingSafeEqual لمنع هجمات التوقيت.",
    code: `import crypto from 'crypto';

/**
 * دالة التحقق الآمن من Webhook منصة سلة
 * @param {Buffer|string} rawBody - محتوى الطلب الخام كما استُلم بدون JSON.parse
 * @param {string} signatureHeader - الترويسة القادمة من سلة (x-salla-signature)
 * @param {string} secretKey - المفتاح السري المخصص للـ Webhook
 * @returns {boolean} هل التوقيع سليم وصادر من سلة؟
 */
export function verifySallaWebhookSignature(rawBody, signatureHeader, secretKey) {
  if (!signatureHeader || !secretKey) return false;

  // توليد التوقيع المتوقع باستخدام HMAC SHA256
  const calculatedSignature = crypto
    .createHmac('sha256', secretKey)
    .update(rawBody)
    .digest('hex');

  const trustedBuffer = Buffer.from(calculatedSignature, 'utf8');
  const signatureBuffer = Buffer.from(signatureHeader, 'utf8');

  // التحقق الآمن عبر دالة المقارنة ذات الوقت الثابت لمنع Timing Attacks
  if (trustedBuffer.length !== signatureBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(trustedBuffer, signatureBuffer);
}`,
    language: "javascript",
    technology: "Salla",
    framework: "Node.js / Express",
    type: "Security Pattern",
    status: "Production Ready",
    difficulty: "Advanced",
    tags: ["Salla", "Security", "Webhook", "Cryptography", "Node.js"],
    inputs: "rawBody (Buffer), signatureHeader (string), secretKey (string)",
    outputs: "isValid (boolean)",
    complexity: "O(N) حيث N طول نص الطلب",
    performance: "عملية التشفير سريعة جداً ولا تستهلك أكثر من 1.2ms لكل طلب.",
    security: "حماية حاسمة من تزييف طلبات الطلبات وإشعارات تغيير الحالة المالية.",
    compatibility: "Node.js 14+ وبيئات خوادم Express / Fastify / NestJS.",
    exampleUsage: `app.post('/api/salla/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const signature = req.headers['x-salla-signature'];
  const isValid = verifySallaWebhookSignature(req.body, signature, process.env.SALLA_WEBHOOK_SECRET);

  if (!isValid) {
    return res.status(401).json({ error: 'Invalid webhook signature' });
  }

  const payload = JSON.parse(req.body.toString());
  // معالجة الحدث بأمان...
  res.status(200).send('OK');
});`,
    testCases: "1. توقيع خاطئ يعيد 401 Unauthorized.\\n2. مسودة طلب متطابقة تماماً تعيد true.\\n3. تعديل بايت واحد في نص الطلب يؤدي لرفض المعاملة.",
    relatedConcepts: ["HMAC", "Timing Attacks", "Webhooks", "Salla API", "Buffer Security"],
    relatedBugs: ["Salla Webhook 401 Signature Mismatch"],
    relatedProjects: ["حزمة سلة للمتاجر الإلكترونية"],
    personalNotes: "ملاحظة مهمة: تأكد من استخدام express.raw() قبل استدعاء express.json() لأن إعادة تسلسل الـ JSON تفسد التوقيع.",
    aiExplanation: "تستخدم هذه الشفرة دالة timingSafeEqual وهي من أدوات الأمن السيبراني المتقدمة التي تمنع المهاجمين من استنتاج التوقيع عبر تحليل الفارق الزمني لمعالجة البايتات.",
    confidence: "98%",
    lastReviewed: "2026-09-25",
    isFavorite: true,
    createdAt: "2026-08-15T12:00:00Z",
    updatedAt: "2026-09-25T09:15:00Z"
  },
  {
    id: 3,
    title: "حاجز المصادقة وتدوير مفاتيح JWT في Express (JWT Auth Guard)",
    englishTitle: "Express JWT Authentication with Token Rotation",
    description: "نمط متكامل لحماية المسارات وإدارة انتهاء صلاحية Access Token مع التجديد التلقائي عبر HttpOnly Refresh Cookie.",
    problem: "تخزين مفاتيح المصادقة في LocalStorage يجعل التطبيق عرضة لهجمات XSS، وانتهاء الجلسة بشكل مفاجئ يزعج المستخدم.",
    solution: "فصل التوكن إلى Access Token قصير الأمد في الذاكرة أو الترويسة و Refresh Token آمن في كوكيز مشفرة ومحمية بـ HttpOnly و SameSite.",
    code: `import jwt from 'jsonwebtoken';

export const authGuard = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'المصادقة مطلوبة، لم يتم العثور على التوكن' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = decoded;
    return next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        code: 'TOKEN_EXPIRED', 
        message: 'انتهت صلاحية الجلسة، يرجى التجديد عبر refresh token' 
      });
    }
    return res.status(403).json({ error: 'التوكن غير صالح أو تم التلاعب به' });
  }
};`,
    language: "javascript",
    technology: "Node.js",
    framework: "Express",
    type: "API Pattern",
    status: "Production Ready",
    difficulty: "Intermediate",
    tags: ["Auth", "Security", "JWT", "Express", "Node.js"],
    inputs: "Authorization Header (Bearer Token)",
    outputs: "req.user attached to request",
    complexity: "O(1) Time",
    performance: "التحقق من التوقيع محلي بواسطة المفتاح العام دون الحاجة للاستعلام من قاعدة البيانات في كل مسار.",
    security: "حماية ضد XSS و CSRF عند دمجها مع HttpOnly Cookies.",
    compatibility: "Express 4+, Fastify, Koa.",
    exampleUsage: `router.get('/profile', authGuard, (req, res) => {
  res.json({ message: 'أهلاً بك', userId: req.user.id });
});`,
    testCases: "1. طلب بدون ترويسة يعيد 401.\\n2. توكن منتهي الصلاحية يعيد رمز الخطأ TOKEN_EXPIRED.\\n3. توكن صحيح يمرر التنفيذ للـ handler التالي.",
    relatedConcepts: ["JWT", "Stateless Authentication", "Bearer Tokens", "Cookie Security"],
    relatedBugs: [],
    relatedProjects: ["منصة عمرة الذكية", "نظام العيادات الطبية الموحد"],
    personalNotes: "قمت بدمج هذا مع Redis Blacklist في حال تسجيل الخروج قبل انتهاء التوكن.",
    aiExplanation: "هذا الوسيط يعتمد على بنية stateless token verification مما يحافظ على سرعة استجابة الخادم ويسمح بالتوسع الأفقي بدون مشاركة حالة الجلسة.",
    confidence: "95%",
    lastReviewed: "2026-09-20",
    isFavorite: false,
    createdAt: "2026-07-22T08:00:00Z",
    updatedAt: "2026-09-20T11:00:00Z"
  },
  {
    id: 4,
    title: "إجراء خادم Next.js 14 مع التحقق والواجهة المتفائلة (Server Action with Zod)",
    englishTitle: "Next.js 14 Server Action with Zod & Optimistic UI",
    description: "نمط رسمي لتنفيذ عمليات الخادم المباشرة من مكونات React مع معالجة الأخطاء والتحقق من صحة المدخلات بدون مسارات API منفصلة.",
    problem: "كتابة مسار API منفصل مع fetch يدوي وإدارة حالات التحميل لكل عملية بسيطة يؤدي لتكرار الكود وتشتته.",
    solution: "استخدام توجيه 'use server' مع مكتبة Zod والتحقق المباشر من FormData وإعادة تحديث الـ Cache بواسطة revalidatePath.",
    code: `'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const TaskSchema = z.object({
  title: z.string().min(3, 'العنوان يجب أن يتكون من 3 أحرف على الأقل').max(100),
  priority: z.enum(['low', 'medium', 'high']),
});

export async function createProjectTask(prevState, formData) {
  const validatedFields = TaskSchema.safeParse({
    title: formData.get('title'),
    priority: formData.get('priority'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'بيانات غير صالحة، يرجى مراجعة الحقول',
    };
  }

  try {
    // محاكاة إدخال في قاعدة البيانات
    // await db.task.create({ data: validatedFields.data });
    
    revalidatePath('/projects');
    return {
      success: true,
      message: 'تم إضافة المهمة بنجاح إلى المشروع',
    };
  } catch (error) {
    return {
      success: false,
      message: 'فشلت عملية الحفظ في قاعدة البيانات',
    };
  }
}`,
    language: "javascript",
    technology: "Next.js",
    framework: "Next.js 14+ App Router",
    type: "Component / Action",
    status: "Production Ready",
    difficulty: "Advanced",
    tags: ["Next.js", "Server Actions", "Zod", "Validation", "React"],
    inputs: "prevState (object), formData (FormData)",
    outputs: "{ success: boolean, message: string, errors?: object }",
    complexity: "O(1) Time",
    performance: "يقلل حجم حزمة الجافاسكريبت المرسلة للعميل بنسبة 40% لنقل المنطق بالكامل للخادم.",
    security: "يمنع حقن البيانات الخبيثة عبر فحص Zod الصارم قبل لمس قاعدة البيانات.",
    compatibility: "Next.js 14.0+ مع React 19 / 18.2.",
    exampleUsage: `function TaskForm() {
  const [state, formAction] = useActionState(createProjectTask, null);
  return (
    <form action={formAction}>
      <input name="title" />
      {state?.errors?.title && <p className="text-red-500">{state.errors.title[0]}</p>}
      <button type="submit">حفظ المهمة</button>
    </form>
  );
}`,
    testCases: "1. إرسال نص أقل من 3 أحرف يعيد رسالة الخطأ المترجمة.\\n2. إرسال بيانات مطابقة يحدث الـ path وينجح بدون أخطاء.",
    relatedConcepts: ["React Server Components", "App Router", "Schema Validation", "Optimistic Updates"],
    relatedBugs: [],
    relatedProjects: ["منصة عمرة الذكية"],
    personalNotes: "النمط المفضل حالياً لجميع النماذج في مشروعات Next.js الحديثة.",
    aiExplanation: "يجري استدعاء هذا الإجراء عبر RPC داخلي مشفر مع إتاحة إمكانية العمل حتى في حال بطء أو انقطاع جافاسكريبت العميل المؤقت.",
    confidence: "97%",
    lastReviewed: "2026-09-29",
    isFavorite: true,
    createdAt: "2026-08-30T14:00:00Z",
    updatedAt: "2026-09-29T16:00:00Z"
  },
  {
    id: 5,
    title: "تأمين طلبات ووردبريس المخصصة بواسطة Nonce و Capabilities",
    englishTitle: "WordPress REST API Secure Endpoint Pattern",
    description: "نمط كتابة مسار REST API آمن داخل إضافات WordPress مع التحقق من صلاحيات المدير وتفادي CSRF.",
    problem: "الكثير من إضافات ووردبريس تفتح مسارات بدون فحص wp_verify_nonce وصلاحيات current_user_can مما يسبب ثغرات تحكم حرجة.",
    solution: "تسجيل المسار باستخدام register_rest_route وتطبيق دالة permission_callback صارمة تفحص Nonce والصلاحيات المناسبة.",
    code: `add_action('rest_api_init', function () {
    register_rest_route('kawkap/v1', '/settings', [
        'methods'  => 'POST',
        'callback' => 'kawkap_update_settings_handler',
        'permission_callback' => function ($request) {
            // 1. التحقق من صلاحية إدارة الخيارات
            if (!current_user_can('manage_options')) {
                return new WP_Error(
                    'rest_forbidden', 
                    esc_html__('عفواً، لا تملك الصلاحيات الكافية لتعديل الإعدادات.', 'kawkap'), 
                    ['status' => 403]
                );
            }

            // 2. التحقق من توكن ووردبريس الأمني (X-WP-Nonce)
            $nonce = $request->get_header('x_wp_nonce');
            if (!wp_verify_nonce($nonce, 'wp_rest')) {
                return new WP_Error(
                    'rest_invalid_nonce', 
                    esc_html__('انتهت صلاحية جلسة الأمان، يرجى إعادة تحميل الصفحة.', 'kawkap'), 
                    ['status' => 403]
                );
            }

            return true;
        },
        'args' => [
            'api_key' => [
                'required'          => true,
                'sanitize_callback' => 'sanitize_text_field',
            ],
        ],
    ]);
});`,
    language: "php",
    technology: "WordPress",
    framework: "WordPress 6.0+",
    type: "WordPress Solution",
    status: "Production Ready",
    difficulty: "Intermediate",
    tags: ["WordPress", "Security", "REST API", "PHP", "Nonce"],
    inputs: "WP_REST_Request with headers & sanitized params",
    outputs: "WP_REST_Response or WP_Error",
    complexity: "O(1)",
    performance: "فحص الصلاحيات سريع ومخزن في ذاكرة الكائن المؤقتة (Object Cache).",
    security: "سد ثغرات CSRF وثغرات تصعيد الصلاحيات Privilege Escalation.",
    compatibility: "WordPress 5.0+ حتى أحدث إصدار 6.6.",
    exampleUsage: `fetch('/wp-json/kawkap/v1/settings', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-WP-Nonce': wpApiSettings.nonce
  },
  body: JSON.stringify({ api_key: 'sec_test_123' })
});`,
    testCases: "1. طلب من زائر غير مسجل يعيد 403 rest_forbidden.\\n2. توكن Nonce خاطئ يعيد 403 rest_invalid_nonce.\\n3. مدير النظام المصادق يمر بنجاح.",
    relatedConcepts: ["WordPress Hooks", "Nonce Lifecycle", "REST Security", "Sanitization"],
    relatedBugs: [],
    relatedProjects: ["محرك وميض لتصحيح لغة الكيبورد"],
    personalNotes: "لا تعتمد أبداً على check_ajax_referer في مسارات REST بل استخدم ترويسة X-WP-Nonce مع wp_verify_nonce('wp_rest').",
    aiExplanation: "التطبيق السليم لـ permission_callback هو المعيار الذهبي في ووردبريس لأنه يُنفذ قبل استدعاء الـ callback الأساسي مما يوفر استهلاك الموارد ويضمن الحماية.",
    confidence: "99%",
    lastReviewed: "2026-09-18",
    isFavorite: false,
    createdAt: "2026-07-15T11:20:00Z",
    updatedAt: "2026-09-18T10:00:00Z"
  },
  {
    id: 6,
    title: "القفل الموزع في Redis لمنع النفاذ الزائد للمخزون (Redis Distributed Lock)",
    englishTitle: "Redis Distributed Lock for High-Concurrency Checkout",
    description: "نمط قفل ذري باستخدام Redis لمنع هجمات Race Condition ونفاذ المخزون بالسالب أثناء حملات العروض والتخفيضات الكبرى.",
    problem: "عند ضغط 1,000 عميل على زر الشراء لنفس القطعة الأخيرة في نفس الميللي ثانية، تقرأ الخوادم نفس الرصيد وتبيع أضعاف المخزون الفعلي.",
    solution: "استخدام أمر SET resource_name my_random_value NX PX 3000 لإنشاء قفل ذري ينتهي تلقائياً وتفادي التعليق الأبدي مع التحرير عبر Lua Script.",
    code: `import Redis from 'ioredis';
import { randomUUID } from 'crypto';

const redis = new Redis(process.env.REDIS_URL);

/**
 * تنفيذ عملية آمنة داخل قفل موزع
 * @param {string} lockKey - اسم القفل (مثال: 'lock:product:942')
 * @param {number} ttlMs - أقصى مدة للقفل بالميللي ثانية
 * @param {Function} task - الدالة المطلوب تنفيذها بأمان
 */
export async function withDistributedLock(lockKey, ttlMs = 5000, task) {
  const lockToken = randomUUID();
  
  // NX: تعيين القيمة فقط إذا لم تكن موجودة | PX: تحديد المهلة بالمللي ثانية
  const acquired = await redis.set(lockKey, lockToken, 'PX', ttlMs, 'NX');

  if (!acquired) {
    throw new Error('المنتج قيد المعالجة لطلب آخر حالياً، يرجى المحاولة بعد لحظات');
  }

  try {
    return await task();
  } finally {
    // تحرير القفل بواسطة سكربت Lua لضمان أننا لا نحذف قفل مستخدم آخر انتهت مدتنا واستحوذ عليه هو
    const releaseLuaScript = \`
      if redis.call("get", KEYS[1]) == ARGV[1] then
        return redis.call("del", KEYS[1])
      else
        return 0
      end
    \`;
    await redis.eval(releaseLuaScript, 1, lockKey, lockToken);
  }
}`,
    language: "javascript",
    technology: "Redis",
    framework: "Node.js / ioredis",
    type: "Architecture Decision",
    status: "Production Ready",
    difficulty: "Advanced",
    tags: ["Redis", "Concurrency", "High Load", "E-commerce", "Locks"],
    inputs: "lockKey (string), ttlMs (number), task (async function)",
    outputs: "task result or throws Concurrency Error",
    complexity: "O(1) Time complexity",
    performance: "يستغرق حيازة القفل أقل من 0.5ms في شبكة داخلية.",
    security: "يمنع الخسائر المالية الضخمة الناتجة عن تكرار الشراء أو التجاوز المالي.",
    compatibility: "Redis 2.6.12+ ومتوافق مع Upstash / AWS ElastiCache.",
    exampleUsage: `await withDistributedLock('lock:checkout:item_88', 3000, async () => {
  const item = await db.product.findUnique({ where: { id: 88 } });
  if (item.stock < 1) throw new Error('نفد المخزون');
  await db.product.update({ where: { id: 88 }, data: { stock: item.stock - 1 } });
  await createInvoice();
});`,
    testCases: "1. 50 طلب متزامن لنفس العنصر بمخزون 1 ينتج عنها طلب ناجح واحد فقط و49 رفض نظيف.\\n2. انهيار الخادم يحرر القفل تلقائياً بعد انقضاء الـ TTL.",
    relatedConcepts: ["Redlock Algorithm", "Atomic Operations", "Race Conditions", "Lua Scripting"],
    relatedBugs: ["Sequelize Transaction Deadlock during Concurrent Checkout"],
    relatedProjects: ["منصة عمرة الذكية", "سوق سلة الرقمي"],
    personalNotes: "هذا النمط أنقذنا حرفياً في تخفيضات يوم التأسيس عندما وصل الضغط إلى 8,000 عملية في الدقيقة.",
    aiExplanation: "السر في هذا النمط هو استخدام معرف عشوائي لكل مالك قفل مع تنفيذ سكربت Lua ذري لضمان عدم حذف القفل بالخطأ إذا تأخرت العملية عن مهلة الـ TTL.",
    confidence: "98%",
    lastReviewed: "2026-09-22",
    isFavorite: true,
    createdAt: "2026-08-01T15:00:00Z",
    updatedAt: "2026-09-22T17:00:00Z"
  }
];

export const initialProjects = [
  {
    id: 1,
    name: "منصة عمرة الذكية (Umrah Booking Platform)",
    description: "بوابة متكاملة لإدارة رحلات وباقات العمرة، الحجوزات الفورية، وإصدار التأشيرات والربط مع بوابات الدفع الإلكتروني ومزودي الفنادق.",
    stack: ["Node.js", "Express", "Next.js", "MySQL", "Redis", "Sequelize"],
    goals: [
      "معالجة ما يزيد عن 10,000 حجز يومي دون أي تعليق في العمليات المالية.",
      "مزامنة المقاعد والفنادق في الوقت الفعلي مع محركات الحجز المركزية.",
      "إتاحة تجربة مستخدم عربية فائقة السرعة على أجهزة الجوال."
    ],
    tasks: [
      { id: 101, title: "تحسين فهارس جداول الحجوزات المركبة (Composite Indexing)", completed: true },
      { id: 102, title: "تطبيق القفل الموزع لمنع الحجز المزدوج لنفس الغرفة", completed: true },
      { id: 103, title: "الربط مع بوابة إشعار الرسائل النصية والواتساب", completed: false },
      { id: 104, title: "إعادة بناء شاشة تصفح الفنادق باستخدام React Virtualization", completed: false }
    ],
    architectureNotes: "تعتمد المنصة معمارية Modular Monolith مجهزة للتحول التدريجي إلى Microservices مع Redis Cluster للتخزين المؤقت وحماية العمليات.",
    relatedSnippets: [1, 3, 4, 6],
    bugs: [
      "Sequelize Transaction Deadlock during Concurrent Checkout",
      "React Stale Closure in WebSocket Listener"
    ],
    decisions: [
      "اعتماد Sequelize Transactions مع READ COMMITTED لعمليات الحجز",
      "استخدام Redis Lock في مسارات إصدار التذاكر الفورية"
    ],
    aiContext: "مشروع يعتمد معايير أمان بنكية صارمة، ممنوع استخدام العمليات غير المتزامنة غير المحمية داخل مسارات الدفع، لغة الواجهة العربية القياسية.",
    progress: 78,
    timeline: "إطلاق تجريبي: منتصف أكتوبر 2026",
    createdAt: "2026-06-01T10:00:00Z"
  },
  {
    id: 2,
    name: "محرك وميض لتصحيح لغة الكيبورد (Wamid Keyboard Corrector)",
    description: "أداة ذكية وإضافة متصفح تقوم باكتشاف الكتابة الخاطئة عند نسيان تبديل اللغة (مثال: 'hghkh' -> 'الانا') وتصحيحها فورياً دون إعادة الكتابة.",
    stack: ["React", "JavaScript", "Tailwind CSS", "Chrome Extension API", "WordPress"],
    goals: [
      "دقة تصحيح فورية تتجاوز 98% لكافة الكلمات الشائعة.",
      "استهلاك ذاكرة أقل من 15 ميجابايت على المتصفح.",
      "توفير واجهة تفاعلية خفيفة جداً تظهر كقائمة منبثقة سريعة."
    ],
    tasks: [
      { id: 201, title: "بناء خريطة مطابقة المفاتيح العربية والإنجليزية (Key Matrix)", completed: true },
      { id: 202, title: "معالجة أحرف الشفت والهمزات والتنوين", completed: true },
      { id: 203, title: "إضافة اختصار لوحة المفاتيح المزدوج (Double Shift)", completed: true },
      { id: 204, title: "إطلاق إضافة ووردبريس للمحرر الكلاسيكي وغوتنبرغ", completed: false }
    ],
    architectureNotes: "يعمل المحرك بنظام Local Finite State Machine بدون إرسال أي نص إلى خوادم خارجية حفاظاً على سرية وخصوصية المستخدم التامة.",
    relatedSnippets: [1, 5],
    bugs: [
      "WordPress Nonce Verification Failure in Rest API",
      "Vite Tailwind Dynamic Class Missing in Production"
    ],
    decisions: [
      "اعتماد التخزين المحلي التام لحماية خصوصية مدخلات المستخدم الحساسة"
    ],
    aiContext: "تطبيق فائق السرعة، كل الميلي ثواني فارقة، لا يجوز الاعتماد على مكتبات خارجية ثقيلة داخل معالج لوحة المفاتيح.",
    progress: 92,
    timeline: "جاهز للنشر على Chrome Web Store",
    createdAt: "2026-07-15T09:00:00Z"
  },
  {
    id: 3,
    name: "حزمة سلة للمتاجر الإلكترونية (Salla Commerce Kit)",
    description: "مكتبة جاهزة وقابلة لإعادة الاستخدام للربط العميق مع منصة سلة، معالجة خطافات الويب، مزامنة الفواتير، وإنشاء تطبيقات سلة السحابية.",
    stack: ["Node.js", "Salla API", "TypeScript / JS", "Express", "Tailwind CSS"],
    goals: [
      "توفير كود نموذجي معتمد وموثق لجميع خطافات سلة الحساسة.",
      "تسهيل الحصول على توثيق سلة الرسمي للمطورين الجدد."
    ],
    tasks: [
      { id: 301, title: "إعداد مدقق التوقيعات الرقمية (HMAC Validator)", completed: true },
      { id: 302, title: "بناء معالج الـ OAuth2 التلقائي لتجديد المفاتيح", completed: true },
      { id: 303, title: "إنشاء لوحة فحص الـ Webhooks التجريبية (Simulator)", completed: false }
    ],
    architectureNotes: "تجريد كامل لمنطق المصادقة والتعامل مع أخطاء معدل الطلبات (Rate Limiting 429) عبر استراتيجية Exponential Backoff.",
    relatedSnippets: [2, 3],
    bugs: ["Salla Webhook 401 Signature Mismatch"],
    decisions: [],
    aiContext: "بيئة تجارة إلكترونية سعودية، توثيق دقيق لكافة أحداث الطلبات، الشحن، وإلغاء العمليات.",
    progress: 65,
    timeline: "قيد التطوير الفعال",
    createdAt: "2026-08-05T12:00:00Z"
  }
];

export const initialBugs = [
  {
    id: 1,
    title: "إغلاق قديم (Stale Closure) في مستمع WebSocket داخل React",
    problem: "رسائل الدردشة المباشرة لا تظهر إلا بعد إعادة تحميل الصفحة، ومستمع الرسائل يتعامل مع حالة فارغة دائماً.",
    error: "TypeError: Cannot read properties of undefined (reading 'roomId')",
    environment: "React 18.2 / Socket.io-client / Vite",
    whatHappened: "تم تسجيل مستمع socket.on('message') داخل useEffect مع مصفوفة تبعيات فارغة []، مما جعل المستمع يحتفظ بالنسخة الأولى فقط من الحالة.",
    whatTried: "إضافة المتغيرات لمصفوفة التبعيات سبب إعادة فتح اتصال الـ Socket في كل ريندر مما سبب تكرار الرسائل وتجميد الواجهة.",
    rootCause: "مفهوم JavaScript Closure يلتقط المتغيرات في لحظة إنشاء الدالة، ومع [] لا يتم تجديد الدالة الملتقطة.",
    solution: "استخدام useRef للاحتفاظ بأحدث مرجع للدالة المعالجة، أو استخدام دالة التحديث setState(prev => ...) دون الحاجة للاعتماد على الحالة الخارجية.",
    finalCode: `const latestHandlerRef = useRef(handleNewMessage);
latestHandlerRef.current = handleNewMessage;

useEffect(() => {
  const listener = (data) => latestHandlerRef.current(data);
  socket.on('message', listener);
  return () => socket.off('message', listener);
}, [socket]);`,
    prevention: "عند التعامل مع اشتراكات أحداث طويلة الأمد، استخدم دائماً Ref Pattern أو Custom Hook مثل useEvent Callback.",
    confidence: "Known",
    relatedGenomes: [1],
    createdAt: "2026-09-10T14:00:00Z"
  },
  {
    id: 2,
    title: "تعارض وقفل ميت (Deadlock) في معاملات Sequelize عند ضغط الدفع المتزامن",
    problem: "فشل 15% من عمليات الدفع وظهور خطأ Deadlock found when trying to get lock; try restarting transaction في سجلات MySQL.",
    error: "SequelizeDatabaseError: Deadlock found when trying to get lock; try restarting transaction (code: ER_LOCK_DEADLOCK)",
    environment: "Node.js 20 / MySQL 8.0 / Sequelize ORM 6.35",
    whatHappened: "المعاملة A قامت بتحديث جدول Users ثم جدول Bookings، بينما في نفس اللحظة المعاملة B قامت بتحديث Bookings ثم Users، فانتظرت كل معاملة الأخرى.",
    whatTried: "زيادة مهلة innodb_lock_wait_timeout ولكن ذلك ضاعف زمن الانتظار وزاد من تراكم الطلبات.",
    rootCause: "عدم توحيد ترتيب تحديث الجداول عبر كافة مسارات المعاملات البرمجية، بالإضافة لغياب الفهارس على الأعمدة المشروطة في WHERE.",
    solution: "1. توحيد ترتيب التحديثات دائماً: الحجز أولاً ثم المستخدم.\\n2. استخدام SELECT ... FOR UPDATE بترتيب تصاعدي لمعرفات السجلات (IDs Order).",
    finalCode: `await sequelize.transaction({ isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED }, async (t) => {
  // فرز المعرفات دائماً لتجنب تعارض الترتيب
  const sortedIds = [...bookingIds].sort((a, b) => a - b);
  for (const id of sortedIds) {
    await Booking.findByPk(id, { lock: t.LOCK.UPDATE, transaction: t });
  }
  // التحديث المنظم...
});`,
    prevention: "فرض قاعدة معمارية: يجب أن تصل جميع المعاملات إلى الجداول والمصفوفات بنفس الترتيب المحدد في السجلات المعمارية (ADR).",
    confidence: "Known",
    relatedGenomes: [6],
    createdAt: "2026-09-14T11:30:00Z"
  },
  {
    id: 3,
    title: "عدم تطابق توقيع سلة (401 Signature Mismatch) بسبب إعادة تسلسل JSON",
    problem: "كل إشعارات الـ Webhooks الواردة من متجر سلة يتم رفضها بكود 401 رغم صحة المفتاح السري 100%.",
    error: "HTTP 401 Unauthorized - Invalid webhook signature",
    environment: "Node.js 18 / Express 4.18 / Salla Webhooks",
    whatHappened: "تم تطبيق كود التحقق بعد استخدام express.json()، وعند تحويل JSON.stringify(req.body) تغير ترتيب المفاتيح ومسافات النص الخام فأصبح الـ Hash مختلفاً.",
    whatTried: "محاولة إعادة صياغة الـ JSON بمكتبات مختلفة مثل fast-json-stable-stringify دون جدوى لأن التوقيع محسوب على البايتات الأصلية تماماً.",
    rootCause: "توقيع HMAC يُحسب على البايتات الدقيقة كما أُرسلت في الشبكة، وأي قراءة للـ Body بعد Parse تلغي دقة التوقيع.",
    solution: "حفظ الـ rawBody كـ Buffer خام باستخدام خيار verify في express.json() واستخدامه حصرياً في التحقق.",
    finalCode: `app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));`,
    prevention: "احفظ دائماً النص الخام الأصلي لأي مزود Webhook خارجي قبل تمريره لأي محلل نصوص.",
    confidence: "Known",
    relatedGenomes: [2],
    createdAt: "2026-09-19T16:45:00Z"
  }
];

export const initialIdeas = [
  {
    id: 1,
    title: "إضافة ووردبريس لاكتشاف لغة الكيبورد الخاطئة وتصحيحها فورياً",
    rawPrompt: "أريد بناء إضافة ووردبريس ومحرر غوتنبرغ تكتشف عندما يكتب الكاتب بالعربي والكيبورد إنجليزي أو العكس وتقوم بتصحيحها فورياً بضغطة زر.",
    problem: "يقضي صناع المحتوى والمدونون ساعات طويلة في إعادة كتابة فقرات كاملة تمت كتابتها باللغة الإنجليزية بالخطأ (مثل 'sghl uhgd' بدلاً من 'سلام عليكم').",
    targetUsers: "المدونون العرب، المحررون، ومسؤولو متاجر ووكومرس وووردبريس.",
    coreFeatures: [
      "اكتشاف فوري للنص المشوه عبر تحليل الترددات الحرفية.",
      "زر عائم صغير يظهر عند التحديد لتحويل النص فوراً.",
      "اختصار لوحة مفاتيح عالمي (Ctrl + Shift + X).",
      "دعم محرر المكونات غوتنبرغ والمحرر الكلاسيكي."
    ],
    mvp: "مكون خفيف في لوحة التحكم يقوم بتحويل الحقل المحدد محلياً بنظام خريطة المفاتيح دون استدعاء أي سيرفر خارجي.",
    architecture: "JavaScript Vanilla في الواجهة الأمامية مع ربط عبر WordPress Asset API ومكون Gutenberg Toolbar Format.",
    techStack: ["WordPress Plugin API", "JavaScript ES6", "Gutenberg React Components", "PHP 8.1"],
    risks: ["تداخل الاختصارات مع إضافات ووردبريس الأخرى مثل Yoast SEO أو Elementor."],
    phases: [
      "المرحلة 1: بناء دالة التحويل الأساسية وخوارزمية المفاتيح.",
      "المرحلة 2: دمج الزر مع Gutenberg RichText Toolbar.",
      "المرحلة 3: النشر على متجر إضافات WordPress.org الرسمي مجاناً."
    ],
    dbRequirements: "جدول إعدادات ووردبريس الافتراضي wp_options لتخزين تفضيلات الاختصارات والمظهر فقط.",
    uiScreens: ["شاشة إعدادات خفيفة في لوحة تحكم ووردبريس", "شريط أدوات التحويل السريع داخل المحرر"],
    monetization: "إضافة مجانية بالكامل للمجتمع مع تقديم نسخة احترافية للمؤسسات تتضمن فحص القواعد والإملاء بالذكاء الاصطناعي.",
    futureRoadmap: "تطوير امتداد للمتصفح يعمل على فيسبوك وتويتر ومنصات البريد.",
    isTurnedToProject: true,
    createdAt: "2026-09-01T10:00:00Z"
  },
  {
    id: 2,
    title: "محلل استهلاك كويريات قواعد بيانات متاجر سلة وزد (Salla Query Profiler)",
    rawPrompt: "نظام يراقب استعلامات SQL لتطبيقات سلة وزد ويكتشف الاختناقات والمشاكل مثل N+1 Queries قبل أن تؤثر على أداء المتجر في المواسم.",
    problem: "الكثير من تطبيقات المتاجر تنهار في أوقات التخفيضات بسبب كويريات بطيئة وغير مفهرسة تسحب بيانات كل المنتجات دفعة واحدة.",
    targetUsers: "مطورو تطبيقات المتاجر الإلكترونية في السعودية والخليج، الشركات البرمجية المتعاقدة مع منصات سلة وزد.",
    coreFeatures: [
      "اكتشاف كويريات N+1 وتنبيه المطور فوراً.",
      "اقتراح فهارس مركبة (Composite Indexes) جاهزة للنسخ بنقرة واحدة.",
      "حساب زمن تنفيذ العمليات المالية وحساب متوسط الـ Latency.",
      "تقرير أسبوعي ذكي بالذكاء الاصطناعي لتطوير أداء الكود."
    ],
    mvp: "ميدل وير خفيف لـ Express/Laravel يسجل الكويريات البطيئة التي تتجاوز 100ms ويعرضها في لوحة تحكم محلية.",
    architecture: "Agent محلي خفيف يجمع مقاييس الأداء بدون إرسال بيانات المستخدمين + لوحة تحكم ويب تفاعلية.",
    techStack: ["Node.js", "React", "Recharts", "MySQL Slow Query Log", "Tailwind CSS"],
    risks: ["تأثير الميدل وير نفسه على أداء السيرفر إذا لم يُصمم بشكل غير متزامن بالكامل."],
    phases: [
      "المرحلة 1: بناء مكتبة التتبع الخفيفة لمسارات الـ SQL.",
      "المرحلة 2: لوحة القيادة التفاعلية مع مقاييس الملي ثانية.",
      "المرحلة 3: محرك الذكاء الاصطناعي لتقديم مقترحات الفهرسة."
    ],
    dbRequirements: "تخزين محلي مؤقت في SQLite أو DuckDB لضمان السرعة الفائقة.",
    uiScreens: ["لوحة القيادة المباشرة للطلبات", "سجل الكويريات البطيئة مع مفسر EXPLAIN"],
    monetization: "اشتراك شهري SaaS للمتاجر الكبرى والشركات البرمجية.",
    futureRoadmap: "إضافة تكاملات آلية لـ PostgreSQL و Prisma و Sequelize.",
    isTurnedToProject: false,
    createdAt: "2026-09-12T15:00:00Z"
  }
];

export const initialDecisions = [
  {
    id: 1,
    projectId: 1,
    title: "اعتماد معاملات Sequelize مع READ COMMITTED لعمليات الدفع والحجز",
    decision: "تقرر اعتماد عزل المعاملات بمستوى READ COMMITTED مع توحيد ترتيب تحديث الجداول لتفادي الـ Deadlocks.",
    context: "واجهت منصة العمرة أخطاء اختناق متكررة أثناء حملات المواسم عند محاولة عدة عملاء حجز نفس الغرفة الفندقية في نفس اللحظة.",
    optionsConsidered: [
      "الاعتماد على التحديث التلقائي الافتراضي بدون معاملات (رُفض لمخاطر التناقض المالي).",
      "استخدام عزل SERIALIZABLE الكامل (رُفض لأنه بطيء جداً ويسبب تعليق السيرفر تحت الضغط العالي).",
      "استخدام READ COMMITTED مع أقفال صفوف محددة SELECT ... FOR UPDATE (تم الاعتماد)."
    ],
    chosenApproach: "تنفيذ عزل READ COMMITTED مع فرز معرفات السجلات تصاعدياً واستخدام Redis Lock كحماية أولى قبل الوصول لقاعدة البيانات.",
    reason: "يمنع القفل الميت تماماً ويحافظ على سرعة الاستجابة تحت الضغط مع ضمان سلامة الأرصدة المالية.",
    consequences: "يتطلب من جميع المطورين الالتزام الصارم بدوال المعاملات الموحدة في src/services/transactionHelper.js.",
    date: "2026-08-20",
    aiReview: "قرار هندسي سليم ومثالي لتطبيقات التجارة الإلكترونية عالية الأحمال، متوافق مع معايير ACID وقواعد أفضل الممارسات في MySQL 8.0.",
    createdAt: "2026-08-20T10:00:00Z"
  },
  {
    id: 2,
    projectId: 2,
    title: "اعتماد بنية التخزين المحلي التام (Offline-First) لحماية الخصوصية",
    decision: "تقرر أن يعمل محرك وميض بدون إرسال أي نص مكتوب من المستخدم إلى أي خادم خارجي أو سحابي نهائياً.",
    context: "يتعامل المحرك مع لوحة مفاتيح المستخدم مباشرة، وأي إرسال عبر الشبكة قد يعرض كلمات المرور والبيانات البنكية لخطر التسريب.",
    optionsConsidered: [
      "استخدام نموذج ذكاء اصطناعي سحابي لتحسين دقة التحويل (رُفض لمخاطر الخصوصية وبطء الاستجابة).",
      "تضمين قاموس محلي وخوارزمية تبديل المفاتيح مباشرة في متصفح العميل (تم الاعتماد)."
    ],
    chosenApproach: "تطوير آلة حالات محدودة (FSM) في الجافاسكريبت تعمل في زمن استجابة 0ms داخل الذاكرة المحلية.",
    reason: "احترام خصوصية المستخدم وحصول الإضافة على شارة الأمان العالي في متاجر المتصفحات.",
    consequences: "حجم الحزمة يجب أن يظل صغيراً جداً، والاعتماد على الخوارزميات الخفيفة بدلاً من الشبكات العصبية الكبيرة.",
    date: "2026-07-20",
    aiReview: "قرار استراتيجي ممتاز يبني ثقة المستخدمين ويزيل أعباء تكاليف استضافة الخوادم بنسبة 100%.",
    createdAt: "2026-07-20T14:00:00Z"
  }
];

export const initialChallenges = [
  {
    id: 1,
    title: "توقع ترتيب تنفيذ الـ Event Loop في JavaScript",
    category: "JavaScript",
    type: "Predict Output",
    difficulty: "Intermediate",
    question: "ما هو الترتيب الدقيق للأرقام التي ستتم طباعتها في الكونسول عند تنفيذ الكود التالي؟",
    codeSnippet: `console.log('1');

setTimeout(() => {
  console.log('2');
}, 0);

Promise.resolve().then(() => {
  console.log('3');
}).then(() => {
  console.log('4');
});

console.log('5');`,
    options: [
      "1, 2, 3, 4, 5",
      "1, 5, 3, 4, 2",
      "1, 5, 2, 3, 4",
      "1, 3, 5, 4, 2"
    ],
    correctIndex: 1,
    explanation: "التنفيذ المتزامن يطبع 1 ثم 5. بعد ذلك يفرغ مكدس المكالمات ويقوم محرك الجافاسكريبت بمعالجة طابور المهام الدقيقة (Microtasks Queue / Promises) فيطبع 3 ثم 4. وأخيراً ينفذ طابور المهام الكبيرة (Macrotasks / setTimeout) فيطبع 2.",
    hint: "تذكر أن الـ Microtasks مثل الـ Promises لها أولوية تنفيذ أعلى دائماً من setTimeout حتى لو كان زمنه 0ms."
  },
  {
    id: 2,
    title: "إصلاح الإغلاق القديم في خطاف التهدئة",
    category: "React",
    type: "Fix Bug",
    difficulty: "Advanced",
    question: "ما هو التعديل الضروري في دالة التنظيف داخل useEffect لضمان عدم تنفيذ دوال قديمة عند تغير المدخلات بسرعة؟",
    codeSnippet: `useEffect(() => {
  const timer = setTimeout(() => {
    onSearch(query);
  }, delay);

  // ما الذي ينقص هنا؟
}, [query, delay]);`,
    options: [
      "clearTimeout(timer) في دالة الإرجاع return () => ...",
      "استخدام await قبل setTimeout",
      "حذف [query, delay] من مصفوفة التبعيات",
      "تحويل onSearch إلى دالة متزامنة فقط"
    ],
    correctIndex: 0,
    explanation: "دالة التنظيف (Cleanup Function) ضرورية جداً لحذف المؤقت السابق بواسطة clearTimeout(timer) قبل بدء مؤقت جديد، وبدونها ستطلق كل المؤقتات السابقة استدعاءات متداخلة.",
    hint: "فكر في دورة حياة الـ Effect وما يحدث عند عمل re-render قبل انقضاء مهلة الـ delay."
  },
  {
    id: 3,
    title: "سد ثغرة SQL Injection في كويري خام",
    category: "Security",
    type: "Security",
    difficulty: "Advanced",
    question: "أي من الخيارات التالية يمثل الطريقة الآمنة لتمرير مدخلات المستخدم في كويري MySQL بدون ثغرات حقن؟",
    codeSnippet: `// كود مصاب بثغرة خطيرة:
const query = "SELECT * FROM users WHERE email = '" + req.body.email + "'";`,
    options: [
      "db.query('SELECT * FROM users WHERE email = ?', [req.body.email])",
      "استبدال علامات التنصيص الفردية بمزدوجة فقط",
      "استخدام eval() لتنظيف المتغير قبل الدمج",
      "إضافة encodeURIComponent قبل الدمج المباشر"
    ],
    correctIndex: 0,
    explanation: "استخدام الاستعلامات المعلمة (Parameterized Queries / Prepared Statements) يضمن أن قاعدة البيانات تعامل المدخلات كبيانات نصية بحتة وليس كأوامر SQL تنفيذية، مما يمنع ثغرة SQL Injection بنسبة 100%.",
    hint: "ابحث عن الاستعلامات المجهزة مسبقاً (Prepared Statements) ورمز الـ Placeholder."
  }
];

export const initialLearningMemory = [
  {
    id: 1,
    topic: "React Effects & WebSocket Subscriptions",
    mistake: "نسيان دالة التنظيف socket.off في useEffect تسبب في تكرار الرسائل 4 مرات بعد التنقل بين الصفحات.",
    correctPrinciple: "أي اشتراك في Event Listener أو Socket يجب أن يقابله دائماً دالة إرجاع تنظيف مطابقة تماماً لإلغاء الاشتراك.",
    relatedConcepts: ["Memory Leaks", "Cleanup Functions", "Socket.io", "React Lifecycle"],
    nextReviewDate: "2026-10-03",
    reviewIntervalDays: 3,
    reviewCount: 2,
    lastReviewedAt: "2026-09-30",
    status: "Active"
  },
  {
    id: 2,
    topic: "MySQL Indexing & Function Calls in WHERE",
    mistake: "كتابة WHERE DATE(created_at) = '2026-10-01' تسبب في إيقاف استخدام الفهرس ومسح الجدول بالكامل (Full Table Scan).",
    correctPrinciple: "لا تستخدم أي دالة على عمود مفهرس داخل WHERE بل اجعل المقارنة بنطاق صريح: WHERE created_at >= '2026-10-01 00:00:00' AND created_at <= '2026-10-01 23:59:59'.",
    relatedConcepts: ["Index SARGability", "Query Optimization", "MySQL Execution Plan", "EXPLAIN"],
    nextReviewDate: "2026-10-05",
    reviewIntervalDays: 5,
    reviewCount: 1,
    lastReviewedAt: "2026-09-29",
    status: "Active"
  }
];

export const initialPersonalStack = [
  { id: 1, category: "Frontend", name: "React", level: "Expert", icon: "Atom" },
  { id: 2, category: "Frontend", name: "Next.js", level: "Expert", icon: "Layers" },
  { id: 3, category: "Frontend", name: "Vue.js", level: "Comfortable", icon: "Code2" },
  { id: 4, category: "Frontend", name: "Tailwind CSS", level: "Expert", icon: "Palette" },
  { id: 5, category: "Backend", name: "Node.js", level: "Expert", icon: "Server" },
  { id: 6, category: "Backend", name: "Express", level: "Expert", icon: "Cpu" },
  { id: 7, category: "CMS & Commerce", name: "Salla API", level: "Expert", icon: "ShoppingBag" },
  { id: 8, category: "CMS & Commerce", name: "Zid API", level: "Comfortable", icon: "Store" },
  { id: 9, category: "CMS & Commerce", name: "WordPress", level: "Comfortable", icon: "Globe" },
  { id: 10, category: "Database", name: "MySQL", level: "Expert", icon: "Database" },
  { id: 11, category: "Database", name: "Redis", level: "Comfortable", icon: "Zap" },
  { id: 12, category: "DevOps", name: "Docker", level: "Comfortable", icon: "Box" },
  { id: 13, category: "Learning", name: "Rust", level: "Learning", icon: "Sparkles" }
];
