import { motion, AnimatePresence } from "motion/react";
import { X, Shield, FileText, Cookie, AlertTriangle, BookOpen, Eye, ShieldAlert } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

interface TermsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const termsEN = [
    {
        title: "1. Definitions", items: [
            "Platform / Website: The PHASEX website, applications, interfaces, and all related analytical tools and services.",
            "User: Any individual accessing or using the platform or creating an account.",
            "Content: All data, charts, indicators, classifications, market states, analytics, text, visualizations, or outputs provided by PHASEX.",
            "Subscription: Any paid or free plan granting access to features, analytics, or platform tools.",
        ]
    },
    { title: "2. Acceptance of Terms", text: "By accessing or using PHASEX, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.\nIf you do not agree with any part of these terms, you must discontinue use of the platform." },
    {
        title: "3. Nature of the Service", text: "PHASEX provides quantitative market analysis tools and structural market representations designed for informational, analytical, and educational purposes.\nPHASEX does not provide financial advice, investment recommendations, or trading signals.\nNothing on the platform should be interpreted as:", items: [
            "Financial advice",
            "Investment advice",
            "A solicitation to buy or sell any financial instrument",
        ], after: "Users remain fully responsible for their own trading and investment decisions."
    },
    {
        title: "4. Eligibility", text: "By using the platform, you confirm that:", items: [
            "You are at least the legal age in your jurisdiction.",
            "You have the legal capacity to enter into binding agreements.",
            "Your use of the platform complies with applicable laws and regulations.",
        ]
    },
    {
        title: "5. Account Security", text: "Users are responsible for maintaining the confidentiality of their login credentials.\nPHASEX is not responsible for unauthorized access resulting from:", items: [
            "Account sharing",
            "Weak passwords",
            "Failure to secure login information",
        ], after: "Users must immediately notify the platform if suspicious activity is detected."
    },
    {
        title: "6. Service Availability", text: "PHASEX strives to maintain reliable service but does not guarantee uninterrupted availability.\nThe platform may experience:", items: [
            "Maintenance periods",
            "Technical interruptions",
            "System updates",
            "Data delays",
        ], after: "PHASEX is not liable for any losses caused by service interruptions."
    },
    {
        title: "7. Data Sources", text: "Market data and analytics may rely on third-party data providers.\nDue to variations between data feeds, brokers, or exchanges:", items: [
            "Prices may differ",
            "Data timing may vary",
            "Chart structures may not exactly match other platforms",
        ], after: "PHASEX does not guarantee absolute accuracy of third-party data."
    },
    {
        title: "8. Intellectual Property", text: "All intellectual property rights related to PHASEX are owned by the platform or its licensors, including:", items: [
            "Algorithms",
            "Structural charting models",
            "Interface design",
            "Databases",
            "Brand elements",
        ], after: "Users may not copy, distribute, reverse engineer, resell, or extract data from the platform without written permission."
    },
    {
        title: "9. Prohibited Use", text: "Users may not:", items: [
            "Use PHASEX for illegal activities",
            "Attempt to disrupt or hack the system",
            "Resell platform access",
            "Misrepresent PHASEX outputs as guaranteed trading signals",
        ], after: "Violation may result in account suspension or termination."
    },
    { title: "10. Subscriptions and Payments", text: "Access to certain features may require a paid subscription.\nSubscription terms, pricing, and features are clearly described on the platform.\nPHASEX reserves the right to modify subscription plans or pricing with appropriate notice." },
    { title: "11. Refund Policy", text: "Subscription payments are generally non-refundable unless explicitly stated otherwise.\nUsers are responsible for reviewing the subscription terms before completing payment." },
    { title: "12. Disclaimer of Warranties", text: "The platform is provided \"as is\" and \"as available.\"\nPHASEX makes no warranties regarding:", items: ["Accuracy", "Reliability", "Continuous availability", "Suitability for trading decisions"] },
    { title: "13. Limitation of Liability", text: "To the fullest extent permitted by law, PHASEX shall not be liable for:", items: ["Trading losses", "Financial damages", "Loss of profits", "Indirect or consequential damages"], after: "arising from the use of the platform." },
    { title: "14. Indemnification", text: "Users agree to indemnify and hold harmless PHASEX from claims, damages, or legal expenses resulting from misuse of the platform or violation of these terms." },
    { title: "15. Termination", text: "PHASEX reserves the right to suspend or terminate accounts that violate platform rules or threaten system integrity." },
    { title: "16. Amendments", text: "These Terms may be updated periodically. Continued use of the platform constitutes acceptance of the updated terms." },
    { title: "17. Governing Law", text: "These Terms shall be governed by the UAE laws of the jurisdiction in UAE operates." },
    { title: "18. Contact", text: "For legal inquiries or support:\nSupport Email: phasexai@gmail.com" },
];

const termsAR = [
    {
        title: "1. التعريفات", items: [
            "المنصة / الموقع: موقع وتطبيق PHASEX وخدماته الرقمية وأي واجهات أو أدوات مرتبطة به.",
            "المستخدم: أي شخص يصل إلى المنصة أو ينشئ حسابًا أو يستخدم الخدمات.",
            "المحتوى: كل ما تعرضه المنصة من بيانات، تصنيفات، حالات سوق، شارتات، مؤشرات، نصوص، أو مخرجات تحليلية.",
            "الاشتراك: أي خطة مدفوعة/تجريبية تتيح الوصول إلى محتوى أو مزايا إضافية.",
        ]
    },
    { title: "2. القبول والاستخدام", text: "باستخدامك PHASEX أو إنشاء حساب، فإنك توافق على هذه الشروط والأحكام. إذا لم توافق، يجب التوقف عن استخدام المنصة." },
    {
        title: "3. طبيعة الخدمة وعدم تقديم المشورة", items: [
            "PHASEX منصة تحليل كمي وتمثيل سوقي، وتعرض \"حالات سوق\" ومخرجات تحليلية لأغراض معلوماتية/بحثية/تعليمية.",
            "لا تُعد أي مادة في PHASEX توصية استثمارية أو نصيحة مالية أو دعوة للشراء/البيع، ولا تمثل استشارة شخصية تناسب ظروفك.",
        ]
    },
    {
        title: "4. أهلية الاستخدام", text: "يقر المستخدم بأنه:", items: [
            "بلغ السن القانوني في بلد إقامته.",
            "يملك الأهلية القانونية للتعاقد.",
            "استخدامه لا يخالف الأنظمة/القوانين المحلية أو قيود الجهات الرقابية في دولته.",
        ]
    },
    {
        title: "5. الحسابات والأمان", items: [
            "المستخدم مسؤول عن سرية بيانات الدخول (اسم المستخدم/كلمة المرور) وعن جميع الأنشطة التي تتم عبر حسابه.",
            "يجب إخطار الإدارة فورًا عند الاشتباه بأي اختراق أو استخدام غير مصرح به.",
        ]
    },
    {
        title: "6. حدود الخدمة والتوفر", items: [
            "قد تتعرض المنصة لانقطاعات، صيانة، تحديثات، أو تغييرات وظيفية.",
            "لا نضمن أن الخدمة ستكون متاحة بشكل دائم أو دون أخطاء أو دون تأخير.",
        ]
    },
    {
        title: "7. مصادر البيانات والأطراف الثالثة", items: [
            "قد تعتمد المنصة على مزودين خارجيين للبيانات أو البنية التحتية أو بوابات الدفع.",
            "قد تختلف الأسعار/البيانات بين مزود وآخر بسبب فروقات التسعير أو التأخير أو اختلاف التوقيت.",
            "PHASEX غير مسؤولة عن أخطاء أو تأخير مزود خارجي خارج سيطرتها.",
        ]
    },
    {
        title: "8. الملكية الفكرية", items: [
            "جميع حقوق الملكية الفكرية (الاسم، العلامة، الواجهات، الخوارزميات، الشارتات، التصاميم، النصوص، قواعد البيانات) مملوكة لـ PHASEX أو للمرخصين لها.",
            "يُحظر نسخ أو إعادة نشر أو بيع أو إعادة توزيع أو الهندسة العكسية أو استخراج الخوارزميات أو المحتوى بأي وسيلة دون إذن كتابي.",
        ]
    },
    {
        title: "9. الاستخدامات المحظورة", text: "يُحظر على المستخدم:", items: [
            "استخدام المنصة في أي نشاط غير قانوني أو احتيالي.",
            "محاولة اختراق أو تعطيل الخدمة أو جمع بيانات غير مصرح بها.",
            "إعادة بيع الاشتراك أو مشاركة الحساب على نحو يخالف سياسة الاشتراك.",
            "تقديم ادعاءات مضللة بأن PHASEX تضمن الربح أو تقدم إشارات مضمونة.",
        ]
    },
    {
        title: "10. الاشتراكات والدفع", items: [
            "الأسعار، المزايا، مدة الاشتراك، والتجديد (إن وجد) موضحة داخل صفحة الخطط.",
            "قد يتم تعديل الأسعار أو المزايا مستقبلًا مع إشعار مناسب عبر المنصة أو البريد.",
        ]
    },
    {
        title: "11. سياسة الاسترجاع والإلغاء", items: [
            "يمكنك إلغاء التجديد في أي وقت من إعدادات الحساب، ويسري الإلغاء اعتبارًا من نهاية دورة الفوترة الحالية.",
            "الاشتراكات غير قابلة للاسترجاع بعد التفعيل ما لم يُذكر خلاف ذلك.",
        ]
    },
    {
        title: "12. إخلاء المسؤولية", items: [
            "يتم تقديم المحتوى \"كما هو\" و\"حسب التوفر\".",
            "لا نقدم أي ضمانات صريحة أو ضمنية بخصوص الدقة، الملاءمة لغرض معين، عدم الانقطاع، أو النتائج.",
        ]
    },
    {
        title: "13. حدود المسؤولية", text: "إلى الحد الذي يسمح به القانون:", items: [
            "لا تتحمل PHASEX أو فريقها أي مسؤولية عن أي خسائر مالية/تجارية/عرضية/تبعية ناتجة عن استخدام المنصة أو الاعتماد على محتواها.",
            "المستخدم يتحمل وحده مسؤولية قراراته التداولية ونتائجها.",
        ]
    },
    {
        title: "14. التعويض (Indemnity)", text: "يوافق المستخدم على تعويض PHASEX عن أي مطالبات أو أضرار أو تكاليف ناتجة عن:", items: [
            "إساءة استخدام المنصة",
            "انتهاك هذه الشروط",
            "انتهاك حقوق طرف ثالث",
        ]
    },
    {
        title: "15. الإيقاف وإنهاء الخدمة", text: "يحق لـ PHASEX:", items: [
            "تعليق/إغلاق الحساب عند الاشتباه بسلوك مخالف أو إساءة استخدام أو انتهاك أمني.",
            "إنهاء الخدمة كليًا أو جزئيًا وفق تقديرها مع إشعار مناسب عند الإمكان.",
        ]
    },
    { title: "16. التعديلات", text: "قد نقوم بتحديث هذه الشروط من وقت لآخر. استمرارك باستخدام المنصة بعد التحديث يعني قبولك للشروط المعدلة." },
    { title: "17. القانون والاختصاص", text: "تخضع هذه الشروط لقوانين الإمارات العربية المتحدة، وتكون المحاكم المختصة في الإمارات العربية المتحدة هي المرجع عند النزاع، ما لم تُلزم القوانين بخلاف ذلك." },
    { title: "18. التواصل", text: "للاستفسارات القانونية أو الدعم:\nphasexai@gmail.com" },
];

const termsTR = [
    {
        title: "1. Tanımlar", items: [
            "Platform / Web Sitesi: PHASEX web sitesi, uygulamaları, arayüzleri ve tüm ilgili analitik araçlar ve hizmetler.",
            "Kullanıcı: Platforma erişen, kullanan veya hesap oluşturan herhangi bir birey.",
            "İçerik: PHASEX tarafından sağlanan tüm veriler, grafikler, göstergeler, sınıflandırmalar, piyasa durumları, analitikler, metinler, görselleştirmeler veya çıktılar.",
            "Abonelik: Özelliklere, analitiklere veya platform araçlarına erişim sağlayan ücretli veya ücretsiz herhangi bir plan.",
        ]
    },
    { title: "2. Şartların Kabulü", text: "PHASEX'e erişerek veya kullanarak, bu Şartlar ve Koşulları okuduğunuzu, anladığınızı ve bunlara bağlı kalmayı kabul ettiğinizi onaylarsınız.\nBu şartların herhangi bir bölümünü kabul etmiyorsanız, platformu kullanmayı bırakmalısınız." },
    {
        title: "3. Hizmetin Doğası", text: "PHASEX, bilgilendirme, analitik ve eğitim amaçlı tasarlanmış nicel piyasa analiz araçları ve yapısal piyasa gösterimleri sunar.\nPHASEX finansal tavsiye, yatırım önerileri veya işlem sinyalleri sağlamaz.\nPlatformdaki hiçbir şey şu şekilde yorumlanmamalıdır:", items: [
            "Finansal tavsiye",
            "Yatırım tavsiyesi",
            "Herhangi bir finansal enstrümanı alma veya satma teklifi",
        ], after: "Kullanıcılar kendi işlem ve yatırım kararlarından tamamen sorumludur."
    },
    {
        title: "4. Uygunluk", text: "Platformu kullanarak şunları onaylarsınız:", items: [
            "Yargı alanınızdaki yasal yaşta olduğunuzu.",
            "Bağlayıcı anlaşmalara girmek için yasal kapasiteye sahip olduğunuzu.",
            "Platformu kullanımınızın geçerli yasa ve düzenlemelere uygun olduğunu.",
        ]
    },
    {
        title: "5. Hesap Güvenliği", text: "Kullanıcılar giriş kimlik bilgilerinin gizliliğini korumaktan sorumludur.\nPHASEX şunlardan kaynaklanan yetkisiz erişimlerden sorumlu değildir:", items: [
            "Hesap paylaşımı",
            "Zayıf şifreler",
            "Giriş bilgilerinin güvenliğini sağlayamama",
        ], after: "Kullanıcılar şüpheli etkinlik tespit edildiğinde platformu derhal bilgilendirmelidir."
    },
    {
        title: "6. Hizmet Kullanılabilirliği", text: "PHASEX güvenilir bir hizmet sunmaya çalışır ancak kesintisiz kullanılabilirliği garanti etmez.\nPlatform şunları yaşayabilir:", items: [
            "Bakım dönemleri",
            "Teknik kesintiler",
            "Sistem güncellemeleri",
            "Veri gecikmeleri",
        ], after: "PHASEX, hizmet kesintilerinden kaynaklanan kayıplardan sorumlu değildir."
    },
    {
        title: "7. Veri Kaynakları", text: "Piyasa verileri ve analitikler üçüncü taraf veri sağlayıcılarına dayanabilir.\nVeri akışları, brokerler veya borsalar arasındaki farklılıklar nedeniyle:", items: [
            "Fiyatlar farklılık gösterebilir",
            "Veri zamanlaması değişebilir",
            "Grafik yapıları diğer platformlarla tam olarak eşleşmeyebilir",
        ], after: "PHASEX, üçüncü taraf verilerinin mutlak doğruluğunu garanti etmez."
    },
    {
        title: "8. Fikri Mülkiyet", text: "PHASEX ile ilgili tüm fikri mülkiyet hakları platforma veya lisans verenlerine aittir, bunlara şunlar dahildir:", items: [
            "Algoritmalar",
            "Yapısal grafik modelleri",
            "Arayüz tasarımı",
            "Veritabanları",
            "Marka unsurları",
        ], after: "Kullanıcılar yazılı izin olmaksızın platformdan veri kopyalayamaz, dağıtamaz, tersine mühendislik yapamaz, satamaz veya çıkaramaz."
    },
    {
        title: "9. Yasaklanmış Kullanım", text: "Kullanıcılar şunları yapamaz:", items: [
            "PHASEX'i yasa dışı faaliyetler için kullanmak",
            "Sistemi kesintiye uğratmaya veya hacklemeye çalışmak",
            "Platform erişimini yeniden satmak",
            "PHASEX çıktılarını garantili işlem sinyalleri olarak yanlış tanıtmak",
        ], after: "İhlal, hesabın askıya alınmasına veya sonlandırılmasına neden olabilir."
    },
    { title: "10. Abonelikler ve Ödemeler", text: "Belirli özelliklere erişim ücretli bir abonelik gerektirebilir.\nAbonelik koşulları, fiyatlandırma ve özellikler platformda açıkça belirtilmiştir.\nPHASEX, uygun bildirimde bulunarak abonelik planlarını veya fiyatlandırmayı değiştirme hakkını saklı tutar." },
    { title: "11. İade Politikası", text: "Abonelik ödemeleri, aksi açıkça belirtilmedikçe genel olarak iade edilmez.\nKullanıcılar ödemeyi tamamlamadan önce abonelik şartlarını gözden geçirmekten sorumludur." },
    { title: "12. Garanti Reddi", text: "Platform \"olduğu gibi\" ve \"mevcut olduğu şekilde\" sağlanır.\nPHASEX şunlarla ilgili hiçbir garanti vermez:", items: ["Doğruluk", "Güvenilirlik", "Kesintisiz kullanılabilirlik", "İşlem kararları için uygunluk"] },
    { title: "13. Sorumluluğun Sınırlandırılması", text: "Yasaların izin verdiği en geniş ölçüde, PHASEX şunlardan sorumlu olmayacaktır:", items: ["İşlem kayıpları", "Finansal zararlar", "Kar kaybı", "Dolaylı veya sonuçsal zararlar"], after: "platformun kullanımından kaynaklanan." },
    { title: "14. Tazminat", text: "Kullanıcılar, platformun kötüye kullanılmasından veya bu şartların ihlalinden kaynaklanan talepler, zararlar veya yasal masraflar için PHASEX'i tazmin etmeyi ve zarar görmemesini sağlamayı kabul eder." },
    { title: "15. Fesih", text: "PHASEX, platform kurallarını ihlal eden veya sistem bütünlüğünü tehdit eden hesapları askıya alma veya sonlandırma hakkını saklı tutar." },
    { title: "16. Değişiklikler", text: "Bu Şartlar periyodik olarak güncellenebilir. Platformun kullanılmaya devam edilmesi, güncellenmiş şartların kabul edildiği anlamına gelir." },
    { title: "17. Geçerli Yasa", text: "Bu Şartlar BAE yasalarına tabi olacaktır." },
    { title: "18. İletişim", text: "Yasal sorular veya destek için:\nDestek E-postası: phasexai@gmail.com" },
];

const termsRU = [
    {
        title: "1. Определения", items: [
            "Платформа / Веб-сайт: Веб-сайт PHASEX, приложения, интерфейсы и все связанные аналитические инструменты и услуги.",
            "Пользователь: Любое физическое лицо, получающее доступ к платформе, использующее ее или создающее учетную запись.",
            "Контент: Все данные, графики, индикаторы, классификации, состояния рынка, аналитика, текст, визуализации или результаты, предоставляемые PHASEX.",
            "Подписка: Любой платный или бесплатный план, предоставляющий доступ к функциям, аналитике или инструментам платформы.",
        ]
    },
    { title: "2. Принятие условий", text: "Осуществляя доступ к PHASEX или используя его, вы подтверждаете, что прочитали, поняли и согласны соблюдать настоящие Условия и положения.\nЕсли вы не согласны с какой-либо частью этих условий, вы должны прекратить использование платформы." },
    {
        title: "3. Характер услуги", text: "PHASEX предоставляет инструменты количественного анализа рынка и структурные представления рынка, предназначенные для информационных, аналитических и образовательных целей.\nPHASEX не предоставляет финансовых консультаций, инвестиционных рекомендаций или торговых сигналов.\nНичто на платформе не должно толковаться как:", items: [
            "Финансовая консультация",
            "Инвестиционная консультация",
            "Предложение о покупке или продаже любого финансового инструмента",
        ], after: "Пользователи несут полную ответственность за свои собственные торговые и инвестиционные решения."
    },
    {
        title: "4. Право на использование", text: "Используя платформу, вы подтверждаете, что:", items: [
            "Вы достигли совершеннолетия в вашей юрисдикции.",
            "Вы обладаете дееспособностью для заключения обязательных соглашений.",
            "Использование вами платформы соответствует применимым законам и правилам.",
        ]
    },
    {
        title: "5. Безопасность учетной записи", text: "Пользователи несут ответственность за сохранение конфиденциальности своих учетных данных для входа.\nPHASEX не несет ответственности за несанкционированный доступ в результате:", items: [
            "Совместного использования учетной записи",
            "Слабых паролей",
            "Неспособности обезопасить информацию для входа",
        ], after: "Пользователи должны немедленно уведомить платформу в случае обнаружения подозрительной активности."
    },
    {
        title: "6. Доступность службы", text: "PHASEX стремится поддерживать надежное обслуживание, но не гарантирует бесперебойную доступность.\nНа платформе могут возникать:", items: [
            "Периоды технического обслуживания",
            "Технические перебои",
            "Обновления системы",
            "Задержки данных",
        ], после: "PHASEX не несет ответственности за любые убытки, вызванные перебоями в обслуживании."
    },
    {
        title: "7. Источники данных", text: "Рыночные данные и аналитика могут зависеть от сторонних поставщиков данных.\nИз-за различий между потоками данных, брокерами или биржами:", items: [
            "Цены могут отличаться",
            "Время поступления данных может варьироваться",
            "Структуры графиков могут не полностью совпадать с другими платформами",
        ], after: "PHASEX не гарантирует абсолютную точность данных сторонних поставщиков."
    },
    {
        title: "8. Интеллектуальная собственность", text: "Все права на интеллектуальную собственность, связанные с PHASEX, принадлежат платформе или ее лицензиарам, включая:", items: [
            "Алгоритмы",
            "Структурные модели графиков",
            "Дизайн интерфейса",
            "Базы данных",
            "Элементы бренда",
        ], after: "Пользователи не могут копировать, распространять, реконструировать, перепродавать или извлекать данные с платформы без письменного разрешения."
    },
    {
        title: "9. Запрещенное использование", text: "Пользователям запрещается:", items: [
            "Использовать PHASEX для незаконной деятельности",
            "Пытаться нарушить работу системы или взломать ее",
            "Перепродавать доступ к платформе",
            "Представлять результаты PHASEX как гарантированные торговые сигналы",
        ], after: "Нарушение может привести к приостановке или удалению учетной записи."
    },
    { title: "10. Подписки и платежи", text: "Для доступа к некоторым функциям может потребоваться платная подписка.\nУсловия подписки, цены и функции четко описаны на платформе.\nPHASEX оставляет за собой право изменять планы подписки или цены с соответствующим уведомлением." },
    { title: "11. Политика возврата средств", text: "Платежи за подписку, как правило, не подлежат возврату, если прямо не указано иное.\nПользователи несут ответственность за ознакомление с условиями подписки перед завершением платежа." },
    { title: "12. Отказ от гарантий", text: "Платформа предоставляется \"как есть\" и \"по мере доступности\".\nPHASEX не дает никаких гарантий в отношении:", items: ["Точности", "Надежности", "Бесперебойной доступности", "Пригодности для принятия торговых решений"] },
    { title: "13. Ограничение ответственности", text: "В максимальной степени, разрешенной законом, PHASEX не несет ответственности за:", items: ["Торговые убытки", "Финансовые убытки", "Упущенную выгоду", "Косвенный или последующий ущерб"], after: "возникшие в результате использования платформы." },
    { title: "14. Возмещение ущерба", text: "Пользователи соглашаются возместить ущерб и оградить PHASEX от претензий, убытков или судебных издержек, возникших в результате ненадлежащего использования платформы или нарушения настоящих условий." },
    { title: "15. Прекращение действия", text: "PHASEX оставляет за собой право приостановить или закрыть учетные записи, которые нарушают правила платформы или угрожают целостности системы." },
    { title: "16. Поправки", text: "Настоящие Условия могут периодически обновляться. Продолжение использования платформы означает принятие обновленных условий." },
    { title: "17. Применимое право", text: "Настоящие Условия регулируются законодательством ОАЭ." },
    { title: "18. Контакты", text: "По правовым вопросам или вопросам поддержки:\nАдрес электронной почты службы поддержки: phasexai@gmail.com" },
];

export function TermsModal({ isOpen, onClose }: TermsModalProps) {
    const { language } = useLanguage();
    const isRTL = language === "ar";
    const accent = "#00e5a0";
    const accentG = "rgba(0,229,160,";
    const terms = language === "ar" ? termsAR : language === "ru" ? termsRU : language === "tr" ? termsTR : termsEN;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                >
                    {/* Backdrop */}
                    <motion.div
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        onClick={onClose}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    />

                    {/* Modal */}
                    <motion.div
                        className="relative w-full max-w-3xl max-h-[85vh] rounded-2xl overflow-hidden flex flex-col"
                        dir={isRTL ? "rtl" : "ltr"}
                        style={{
                            background: "linear-gradient(160deg, rgba(14,20,33,0.98) 0%, rgba(8,12,22,0.99) 100%)",
                            border: `1px solid ${accentG}0.15)`,
                            boxShadow: `0 25px 80px rgba(0,0,0,0.6), 0 0 60px ${accentG}0.1)`,
                        }}
                        initial={{ opacity: 0, y: 40, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 40, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    >
                        {/* Top LED */}
                        <motion.div className="absolute top-0 left-0 right-0 h-[2px] z-30"
                            style={{ background: `linear-gradient(90deg, transparent 5%, ${accent} 30%, ${accent} 70%, transparent 95%)` }}
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 2, repeat: Infinity }} />

                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: `1px solid ${accentG}0.1)` }}>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                                    style={{ background: `${accentG}0.1)`, border: `1px solid ${accentG}0.2)` }}>
                                    <Shield className="w-5 h-5" style={{ color: accent }} />
                                </div>
                                <div>
                                    <h2 className="text-lg font-black text-white">
                                        {language === "ar" ? "الشروط والأحكام" : language === "tr" ? "Şartlar ve Koşullar" : language === "ru" ? "Условия и положения" : "Terms and Conditions"}
                                    </h2>
                                    <p className="text-[11px] text-gray-500 font-medium">PHASEX Platform</p>
                                </div>
                            </div>
                            <motion.button
                                onClick={onClose}
                                whileHover={{ scale: 1.1, rotate: 90 }}
                                whileTap={{ scale: 0.9 }}
                                className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:text-white transition-colors cursor-pointer"
                                style={{ background: "rgba(255,255,255,0.05)" }}
                            >
                                <X className="w-5 h-5" />
                            </motion.button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6" style={{ scrollbarWidth: "thin", scrollbarColor: `${accent}30 transparent` }}>
                            {terms.map((section, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.03 }}
                                    className="rounded-xl p-5"
                                    style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}
                                >
                                    <h3 className="text-sm font-black mb-3 flex items-center gap-2" style={{ color: accent }}>
                                        <FileText className="w-4 h-4 flex-shrink-0" />
                                        {section.title}
                                    </h3>
                                    {section.text && (
                                        <p className="text-[13px] text-gray-400 leading-relaxed mb-2 whitespace-pre-line">{section.text}</p>
                                    )}
                                    {section.items && (
                                        <ul className={`space-y-1.5 ${isRTL ? "pr-4" : "pl-4"}`}>
                                            {section.items.map((item, j) => (
                                                <li key={j} className="text-[13px] text-gray-400 leading-relaxed flex items-start gap-2">
                                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: accent, opacity: 0.5 }} />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                    {(section as any).after && (
                                        <p className="text-[13px] text-gray-400 leading-relaxed mt-2">{(section as any).after}</p>
                                    )}
                                </motion.div>
                            ))}

                            {/* Contact */}
                            <div className="text-center py-4" style={{ borderTop: `1px solid rgba(255,255,255,0.04)` }}>
                                <p className="text-xs text-gray-500">
                                    © 2024 PHASE X AI. {language === "ar" ? "جميع الحقوق محفوظة" : language === "tr" ? "Tüm hakları saklıdır." : language === "ru" ? "Все права защищены." : "All rights reserved."}
                                </p>
                            </div>
                        </div>

                        {/* Bottom LED */}
                        <motion.div className="absolute bottom-0 left-0 right-0 h-[1px]"
                            style={{ background: `linear-gradient(90deg, transparent 10%, ${accent}50 40%, ${accent}50 60%, transparent 90%)` }}
                            animate={{ opacity: [0.2, 0.6, 0.2] }}
                            transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }} />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// Export a simple button component for the footer
export function TermsButton({ onClick }: { onClick: () => void }) {
    const { t } = useLanguage();
    const accent = "#00e5a0";
    const accentG = "rgba(0,229,160,";

    return (
        <motion.button
            onClick={onClick}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold cursor-pointer transition-all"
            style={{
                background: `${accentG}0.06)`,
                border: `1px solid ${accentG}0.15)`,
                color: accent,
            }}
        >
            <FileText className="w-3.5 h-3.5" />
            {t("termsAndConditions")}
        </motion.button>
    );
}

/* ═══════════ COOKIE POLICY ═══════════ */

const cookieEN = [
    { title: "What Are Cookies", text: "Cookies are small text files stored on your device when you visit a website. They allow websites to recognize your device and improve the user experience." },
    {
        title: "How PHASEX Uses Cookies", text: "PHASEX uses cookies for purposes including:", items: [
            "Maintaining secure login sessions",
            "Improving website functionality",
            "Understanding how users interact with the platform",
            "Enhancing performance and stability",
        ]
    },
    {
        title: "Types of Cookies We Use", subsections: [
            { sub: "Essential Cookies", desc: "Required for the basic operation of the platform, including account authentication and security." },
            { sub: "Performance Cookies", desc: "Help analyze website traffic and platform usage in order to improve functionality." },
            { sub: "Functional Cookies", desc: "Allow the platform to remember certain user preferences." },
        ]
    },
    { title: "Managing Cookies", text: "Most web browsers allow users to control or disable cookies through browser settings.\nDisabling certain cookies may impact the functionality of the platform." },
    { title: "Third-Party Cookies", text: "Some cookies may be placed by trusted third-party services used for analytics, hosting, or infrastructure support." },
    { title: "Changes to This Policy", text: "PHASEX may update this Cookie Policy as needed to reflect platform improvements or legal requirements." },
];

const cookieAR = [
    { title: "ما هي ملفات الارتباط", text: "ملفات الارتباط (Cookies) هي ملفات نصية صغيرة يتم تخزينها على جهاز المستخدم عند زيارة الموقع." },
    {
        title: "كيفية استخدام ملفات الارتباط", text: "تستخدم PHASEX ملفات الارتباط من أجل:", items: [
            "الحفاظ على جلسات تسجيل الدخول",
            "تحسين أداء الموقع",
            "فهم كيفية استخدام المنصة",
            "تحسين تجربة المستخدم",
        ]
    },
    {
        title: "أنواع ملفات الارتباط", subsections: [
            { sub: "ملفات أساسية", desc: "ضرورية لعمل الموقع بشكل صحيح." },
            { sub: "ملفات الأداء", desc: "تساعد في تحليل استخدام الموقع." },
            { sub: "ملفات الوظائف", desc: "تسمح للموقع بتذكر تفضيلات المستخدم." },
        ]
    },
    { title: "التحكم في ملفات الارتباط", text: "يمكن للمستخدم التحكم في ملفات الارتباط أو تعطيلها من خلال إعدادات المتصفح.\nتعطيل بعض الملفات قد يؤثر على وظائف الموقع." },
    { title: "ملفات الارتباط من أطراف ثالثة", text: "قد يتم وضع بعض ملفات الارتباط من خدمات طرف ثالث موثوقة تُستخدم للتحليلات أو الاستضافة أو دعم البنية التحتية." },
    { title: "التغييرات على هذه السياسة", text: "قد تقوم PHASEX بتحديث سياسة ملفات الارتباط حسب الحاجة لتعكس تحسينات المنصة أو المتطلبات القانونية." },
];

const cookieTR = [
    { title: "Çerezler Nedir", text: "Çerezler, bir web sitesini ziyaret ettiğinizde cihazınızda depolanan küçük metin dosyalarıdır. Web sitelerinin cihazınızı tanımasına ve kullanıcı deneyimini iyileştirmesine olanak tanır." },
    {
        title: "PHASEX Çerezleri Nasıl Kullanır", text: "PHASEX, çerezleri aşağıdakiler dahil çeşitli amaçlar için kullanır:", items: [
            "Güvenli giriş oturumlarını sürdürmek",
            "Web sitesi işlevselliğini artırmak",
            "Kullanıcıların platformla nasıl etkileşimde bulunduğunu anlamak",
            "Performans ve kararlılığı artırmak",
        ]
    },
    {
        title: "Kullandığımız Çerez Türleri", subsections: [
            { sub: "Temel Çerezler", desc: "Hesap kimlik doğrulaması ve güvenlik dahil olmak üzere platformun temel çalışması için gereklidir." },
            { sub: "Performans Çerezleri", desc: "İşlevselliği artırmak için web sitesi trafiğini ve platform kullanımını analiz etmeye yardımcı olur." },
            { sub: "İşlevsel Çerezler", desc: "Platformun belirli kullanıcı tercihlerini hatırlamasını sağlar." },
        ]
    },
    { title: "Çerezleri Yönetmek", text: "Çoğu web tarayıcısı, kullanıcıların tarayıcı ayarları aracılığıyla çerezleri kontrol etmesine veya devre dışı bırakmasına olanak tanır.\nBelirli çerezleri devre dışı bırakmak platformun işlevselliğini etkileyebilir." },
    { title: "Üçüncü Taraf Çerezleri", text: "Analiz, barındırma veya altyapı desteği için kullanılan güvenilir üçüncü taraf hizmetleri tarafından bazı çerezler yerleştirilebilir." },
    { title: "Bu Politikadaki Değişiklikler", text: "PHASEX, platform iyileştirmelerini veya yasal gereksinimleri yansıtmak için bu Çerez Politikasını gerektiğinde güncelleyebilir." },
];

const cookieRU = [
    { title: "Что такое файлы cookie", text: "Файлы cookie — это небольшие текстовые файлы, сохраняемые на вашем устройстве при посещении веб-сайта. Они позволяют сайтам распознавать ваше устройство и улучшать пользовательский опыт." },
    {
        title: "Как PHASEX использует файлы cookie", text: "PHASEX использует файлы cookie для следующих целей:", items: [
            "Поддержание безопасных сеансов входа",
            "Улучшение функциональности веб-сайта",
            "Понимание того, как пользователи взаимодействуют с платформой",
            "Повышение производительности и стабильности",
        ]
    },
    {
        title: "Типы файлов cookie, которые мы используем", subsections: [
            { sub: "Строго необходимые", desc: "Требуются для базовой работы платформы, включая аутентификацию аккаунта и безопасность." },
            { sub: "Эксплуатационные", desc: "Помогают анализировать трафик веб-сайта и использование платформы для улучшения функциональности." },
            { sub: "Функциональные", desc: "Позволяют платформе запоминать определенные предпочтения пользователя." },
        ]
    },
    { title: "Управление файлами cookie", text: "Большинство веб-браузеров позволяют пользователям контролировать или отключать файлы cookie через настройки браузера.\nОтключение определенных файлов cookie может повлиять на функциональность платформы." },
    { title: "Сторонние файлы cookie", text: "Некоторые файлы cookie могут размещаться надежными сторонними сервисами, используемыми для аналитики, хостинга или поддержки инфраструктуры." },
    { title: "Изменения в данной политике", text: "PHASEX может обновлять данную Политику использования файлов cookie по мере необходимости для отражения улучшений платформы или юридических требований." },
];

export function CookiePolicyModal({ isOpen, onClose }: TermsModalProps) {
    const { language } = useLanguage();
    const isRTL = language === "ar";
    const accent = "#00e5a0";
    const accentG = "rgba(0,229,160,";
    const sections = language === "ar" ? cookieAR : language === "ru" ? cookieRU : language === "tr" ? cookieTR : cookieEN;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        onClick={onClose}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    />

                    <motion.div
                        className="relative w-full max-w-3xl max-h-[85vh] rounded-2xl overflow-hidden flex flex-col"
                        dir={isRTL ? "rtl" : "ltr"}
                        style={{
                            background: "linear-gradient(160deg, rgba(14,20,33,0.98) 0%, rgba(8,12,22,0.99) 100%)",
                            border: `1px solid ${accentG}0.15)`,
                            boxShadow: `0 25px 80px rgba(0,0,0,0.6), 0 0 60px ${accentG}0.1)`,
                        }}
                        initial={{ opacity: 0, y: 40, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 40, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    >
                        <motion.div className="absolute top-0 left-0 right-0 h-[2px] z-30"
                            style={{ background: `linear-gradient(90deg, transparent 5%, ${accent} 30%, ${accent} 70%, transparent 95%)` }}
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 2, repeat: Infinity }} />

                        <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: `1px solid ${accentG}0.1)` }}>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                                    style={{ background: `${accentG}0.1)`, border: `1px solid ${accentG}0.2)` }}>
                                    <Cookie className="w-5 h-5" style={{ color: accent }} />
                                </div>
                                <div>
                                    <h2 className="text-lg font-black text-white">
                                        {language === "ar" ? "سياسة ملفات الارتباط" : language === "tr" ? "Çerez Politikası" : language === "ru" ? "Политика использования файлов cookie" : "Cookie Policy"}
                                    </h2>
                                    <p className="text-[11px] text-gray-500 font-medium">PHASEX Platform</p>
                                </div>
                            </div>
                            <motion.button
                                onClick={onClose}
                                whileHover={{ scale: 1.1, rotate: 90 }}
                                whileTap={{ scale: 0.9 }}
                                className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:text-white transition-colors cursor-pointer"
                                style={{ background: "rgba(255,255,255,0.05)" }}
                            >
                                <X className="w-5 h-5" />
                            </motion.button>
                        </div>

                        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6" style={{ scrollbarWidth: "thin", scrollbarColor: `${accent}30 transparent` }}>
                            {sections.map((section, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="rounded-xl p-5"
                                    style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}
                                >
                                    <h3 className="text-sm font-black mb-3 flex items-center gap-2" style={{ color: accent }}>
                                        <Cookie className="w-4 h-4 flex-shrink-0" />
                                        {section.title}
                                    </h3>
                                    {section.text && (
                                        <p className="text-[13px] text-gray-400 leading-relaxed mb-2 whitespace-pre-line">{section.text}</p>
                                    )}
                                    {section.items && (
                                        <ul className={`space-y-1.5 ${isRTL ? "pr-4" : "pl-4"}`}>
                                            {section.items.map((item, j) => (
                                                <li key={j} className="text-[13px] text-gray-400 leading-relaxed flex items-start gap-2">
                                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: accent, opacity: 0.5 }} />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                    {(section as any).subsections && (
                                        <div className="space-y-3 mt-2">
                                            {(section as any).subsections.map((sub: any, j: number) => (
                                                <div key={j} className="rounded-lg p-3" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.03)" }}>
                                                    <h4 className="text-[13px] font-bold text-white mb-1">{sub.sub}</h4>
                                                    <p className="text-[12px] text-gray-500 leading-relaxed">{sub.desc}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            ))}

                            <div className="text-center py-4" style={{ borderTop: `1px solid rgba(255,255,255,0.04)` }}>
                                <p className="text-xs text-gray-500">
                                    © 2024 PHASE X AI. {language === "ar" ? "جميع الحقوق محفوظة" : language === "tr" ? "Tüm hakları saklıdır." : language === "ru" ? "Все права защищены." : "All rights reserved."}
                                </p>
                            </div>
                        </div>

                        <motion.div className="absolute bottom-0 left-0 right-0 h-[1px]"
                            style={{ background: `linear-gradient(90deg, transparent 10%, ${accent}50 40%, ${accent}50 60%, transparent 90%)` }}
                            animate={{ opacity: [0.2, 0.6, 0.2] }}
                            transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }} />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export function CookieButton({ onClick }: { onClick: () => void }) {
    const { t } = useLanguage();
    const accent = "#00e5a0";
    const accentG = "rgba(0,229,160,";

    return (
        <motion.button
            onClick={onClick}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold cursor-pointer transition-all"
            style={{
                background: `${accentG}0.06)`,
                border: `1px solid ${accentG}0.15)`,
                color: accent,
            }}
        >
            <Cookie className="w-3.5 h-3.5" />
            {t("cookiePolicy")}
        </motion.button>
    );
}

/* ═══════════ LEGAL DISCLAIMER ═══════════ */

const disclaimerEN = [
    { text: "The information, tools, and analytical representations provided by PHASEX are intended for informational and educational purposes only." },
    { text: "PHASEX does not provide financial, investment, or trading advice." },
    {
        text: "Nothing displayed on the platform should be interpreted as:", items: [
            "Investment advice",
            "A recommendation to buy or sell financial instruments",
            "A guarantee of future market performance",
        ]
    },
    { text: "Financial markets involve significant risk, and users remain fully responsible for their trading decisions and financial outcomes." },
    { text: "PHASEX does not guarantee the accuracy, completeness, or reliability of any market data, analysis, or visual representations." },
    { text: "Past market behavior does not guarantee future results." },
    { text: "By using the PHASEX platform, users acknowledge and accept full responsibility for any actions taken based on platform information." },
];

const disclaimerAR = [
    { text: "المعلومات والأدوات والتحليلات المعروضة على منصة PHASEX مخصصة لأغراض تعليمية ومعلوماتية فقط." },
    { text: "لا تقدم PHASEX أي نصائح مالية أو استثمارية." },
    {
        text: "ولا ينبغي تفسير أي محتوى على المنصة على أنه:", items: [
            "توصية استثمارية",
            "دعوة لشراء أو بيع أي أداة مالية",
            "ضمان لتحقيق أرباح",
        ]
    },
    { text: "تنطوي الأسواق المالية على مخاطر كبيرة، ويتحمل المستخدم وحده المسؤولية الكاملة عن قراراته الاستثمارية." },
    { text: "لا تضمن PHASEX دقة أو اكتمال أو موثوقية البيانات أو التحليلات المعروضة." },
    { text: "الأداء السابق للأسواق لا يضمن النتائج المستقبلية." },
];

const disclaimerTR = [
    { text: "PHASEX tarafından sağlanan bilgiler, araçlar ve analitik temsiller yalnızca bilgilendirme ve eğitim amaçlıdır." },
    { text: "PHASEX finansal, yatırım veya ticari danışmanlık hizmeti sunmaz." },
    {
        text: "Platformda görüntülenen hiçbir şey şu şekilde yorumlanmamalıdır:", items: [
            "Yatırım tavsiyesi",
            "Finansal enstrümanları alma veya satma önerisi",
            "Gelecekteki piyasa performansının garantisi",
        ]
    },
    { text: "Finansal piyasalar önemli riskler içerir ve kullanıcılar yatırım kararları ve finansal sonuçlarından tamamen kendileri sorumludur." },
    { text: "PHASEX hiçbir piyasa verisinin, analizinin veya görsel temsillerin doğruluğunu, eksiksizliğini veya güvenilirliğini garanti etmez." },
    { text: "Geçmiş piyasa davranışı gelecekteki sonuçları garanti etmez." },
    { text: "Kullanıcılar PHASEX platformunu kullanarak, platform bilgilerine dayanarak alınan eylemler için tam sorumluluğu üstlendiklerini onaylar ve kabul eder." },
];

const disclaimerRU = [
    { text: "Информация, инструменты и аналитические данные, предоставляемые PHASEX, предназначены исключительно для информационных и образовательных целей." },
    { text: "PHASEX не предоставляет финансовых, инвестиционных или торговых консультаций." },
    {
        text: "Ничто из представленного на платформе не должно интерпретироваться как:", items: [
            "Инвестиционный совет",
            "Рекомендация покупать или продавать финансовые инструменты",
            "Гарантия будущих результатов на рынке",
        ]
    },
    { text: "Финансовые рынки сопряжены со значительными рисками, и пользователи несут полную ответственность за свои торговые решения и финансовые результаты." },
    { text: "PHASEX не гарантирует точность, полноту или надежность рыночных данных, аналитики или визуальных представлений." },
    { text: "Прошлое поведение рынка не гарантирует будущих результатов." },
    { text: "Используя платформу PHASEX, пользователи признают и принимают на себя полную ответственность за любые действия, предпринятые на основе информации платформы." },
];

export function LegalDisclaimerModal({ isOpen, onClose }: TermsModalProps) {
    const { language } = useLanguage();
    const isRTL = language === "ar";
    const accent = "#ff6e40";
    const accentG = "rgba(255,110,64,";
    const sections = language === "ar" ? disclaimerAR : language === "ru" ? disclaimerRU : language === "tr" ? disclaimerTR : disclaimerEN;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <motion.div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
                    <motion.div className="relative w-full max-w-3xl max-h-[85vh] rounded-2xl overflow-hidden flex flex-col"
                        dir={isRTL ? "rtl" : "ltr"}
                        style={{
                            background: "linear-gradient(160deg, rgba(14,20,33,0.98) 0%, rgba(8,12,22,0.99) 100%)",
                            border: `1px solid ${accentG}0.15)`,
                            boxShadow: `0 25px 80px rgba(0,0,0,0.6), 0 0 60px ${accentG}0.1)`,
                        }}
                        initial={{ opacity: 0, y: 40, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 40, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 100, damping: 20 }}>
                        <motion.div className="absolute top-0 left-0 right-0 h-[2px] z-30"
                            style={{ background: `linear-gradient(90deg, transparent 5%, ${accent} 30%, ${accent} 70%, transparent 95%)` }}
                            animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2, repeat: Infinity }} />
                        <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: `1px solid ${accentG}0.1)` }}>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                                    style={{ background: `${accentG}0.1)`, border: `1px solid ${accentG}0.2)` }}>
                                    <AlertTriangle className="w-5 h-5" style={{ color: accent }} />
                                </div>
                                <div>
                                    <h2 className="text-lg font-black text-white">
                                        {language === "ar" ? "إخلاء المسؤولية القانونية" : language === "tr" ? "Yasal Uyarı" : language === "ru" ? "Отказ от ответственности" : "Legal Disclaimer"}
                                    </h2>
                                    <p className="text-[11px] text-gray-500 font-medium">PHASEX Platform</p>
                                </div>
                            </div>
                            <motion.button onClick={onClose} whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}
                                className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:text-white transition-colors cursor-pointer"
                                style={{ background: "rgba(255,255,255,0.05)" }}>
                                <X className="w-5 h-5" />
                            </motion.button>
                        </div>
                        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4" style={{ scrollbarWidth: "thin", scrollbarColor: `${accent}30 transparent` }}>
                            {/* Warning banner */}
                            <div className="rounded-xl p-4 flex items-start gap-3" style={{ background: `${accentG}0.06)`, border: `1px solid ${accentG}0.15)` }}>
                                <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: accent }} />
                                <p className="text-[13px] font-bold" style={{ color: accent }}>
                                    {language === "ar" ? "⚠️ تحذير: الأسواق المالية تنطوي على مخاطر عالية. قد تخسر رأس مالك بالكامل."
                                        : language === "tr" ? "⚠️ Uyarı: Finansal piyasalar önemli riskler içerir. Tüm sermayenizi kaybedebilirsiniz."
                                        : language === "ru" ? "⚠️ Внимание: Финансовые рынки несут значительный риск. Вы можете потерять весь свой капитал."
                                        : "⚠️ Warning: Financial markets carry significant risk. You may lose your entire capital."}
                                </p>
                            </div>
                            {sections.map((section, i) => (
                                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }} className="rounded-xl p-5"
                                    style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
                                    <p className="text-[13px] text-gray-400 leading-relaxed">{section.text}</p>
                                    {section.items && (
                                        <ul className={`space-y-1.5 mt-2 ${isRTL ? "pr-4" : "pl-4"}`}>
                                            {section.items.map((item, j) => (
                                                <li key={j} className="text-[13px] text-gray-400 leading-relaxed flex items-start gap-2">
                                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: accent, opacity: 0.5 }} />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </motion.div>
                            ))}
                            <div className="text-center py-4" style={{ borderTop: `1px solid rgba(255,255,255,0.04)` }}>
                                <p className="text-xs text-gray-500">© 2024 PHASE X AI. {isRTL ? "جميع الحقوق محفوظة" : "All rights reserved."}</p>
                            </div>
                        </div>
                        <motion.div className="absolute bottom-0 left-0 right-0 h-[1px]"
                            style={{ background: `linear-gradient(90deg, transparent 10%, ${accent}50 40%, ${accent}50 60%, transparent 90%)` }}
                            animate={{ opacity: [0.2, 0.6, 0.2] }} transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }} />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export function LegalDisclaimerButton({ onClick }: { onClick: () => void }) {
    const { t } = useLanguage();
    return (
        <motion.button onClick={onClick} whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold cursor-pointer transition-all"
            style={{ background: "rgba(255,110,64,0.06)", border: "1px solid rgba(255,110,64,0.15)", color: "#ff6e40" }}>
            <AlertTriangle className="w-3.5 h-3.5" />
            {t("legalDisclaimer")}
        </motion.button>
    );
}

/* ═══════════ PHASEX MANIFESTO ═══════════ */

const manifestoEN = [
    {
        title: "The Market Is Not Noise", paragraphs: [
            "Financial markets are often described as chaotic systems driven by randomness and speculation.",
            "Charts flash endlessly with price movements, indicators compete for attention, and traders are left navigating a landscape of conflicting signals.",
            "But markets are not noise.", "They are systems.",
            "Systems shaped by structure, pressure, rhythm, and behavioral cycles.",
            "The problem has never been the market itself.", "The problem has been the way we try to observe it.",
        ]
    },
    {
        title: "The Failure of Indicator Stacking", paragraphs: [
            "For decades, market analysis has relied on an ever-growing collection of indicators.",
            "Oscillators, moving averages, bands, channels, signals layered upon signals.", "Each promising clarity.",
            "Yet the result has often been the opposite.",
            "More indicators create more interpretations.", "More interpretations create more confusion.",
            "Complexity has been mistaken for insight.", "PHASEX was created to challenge that assumption.",
        ]
    },
    {
        title: "A Structural View of Markets", paragraphs: [
            "Markets do not move randomly from tick to tick.", "They evolve through structural states.",
            "Moments of expansion.", "Moments of contraction.", "Periods of directional pressure.", "Cycles of oscillation and equilibrium.",
            "Instead of chasing signals, PHASEX observes these states.",
            "It reconstructs market behavior through a framework designed to reveal the underlying structure of price movement.",
        ]
    },
    {
        title: "From Indicators to States", paragraphs: [
            "PHASEX replaces fragmented signals with a unified structural language.",
            "The platform represents market behavior through distinct analytical states:",
        ], states: ["Phase State", "Displacement State", "Reference State", "Oscillation State", "Direction State", "Envelope State"],
        after: ["Each state captures a different dimension of market dynamics.", "Together, they form a coherent system for observing how markets evolve."]
    },
    {
        title: "Clarity Over Complexity", paragraphs: [
            "Financial markets generate vast streams of data, but insight rarely comes from adding more noise.",
            "True understanding comes from seeing structure.", "PHASEX was built with a simple philosophy:",
        ], highlights: ["Reduce noise.", "Reveal structure.", "Observe behavior."],
        after: ["By reconstructing price movement into interpretable states, PHASEX allows traders and analysts to observe markets with a level of clarity rarely achieved through traditional tools."]
    },
    {
        title: "Not Prediction. Observation.", paragraphs: [
            "PHASEX does not attempt to predict the future.", "It seeks to make the present visible.",
            "When structure becomes clear, behavior becomes understandable.",
            "And when behavior becomes understandable, decisions become more informed.",
        ]
    },
    {
        title: "A New Language for Market Structure", paragraphs: [
            "Markets have long been viewed through the lens of indicators.", "PHASEX proposes a different language.",
            "A language of states, structure, and behavior.",
            "A language designed not to overwhelm traders with signals, but to help them see the market as it truly is.",
        ]
    },
    {
        title: "The Vision", paragraphs: [
            "PHASEX was created with a simple yet ambitious goal:",
            "To redefine how financial markets are visualized and understood.",
            "Not through more indicators.", "But through deeper structure.",
        ]
    },
];

const manifestoAR = [
    {
        title: "السوق ليس ضجيجًا", paragraphs: [
            "غالبًا ما توصف الأسواق المالية بأنها أنظمة فوضوية تحكمها العشوائية والمضاربة.",
            "تتحرك الرسوم البيانية بلا توقف، تتزاحم المؤشرات، ويجد المتداول نفسه وسط كم هائل من الإشارات المتضاربة.",
            "لكن السوق ليس ضجيجًا.", "إنه نظام.",
            "نظام يتشكل من بنية، وضغوط، وإيقاعات، ودورات سلوكية.",
            "المشكلة لم تكن يومًا في السوق نفسه.", "المشكلة كانت في الطريقة التي نحاول بها رؤيته.",
        ]
    },
    {
        title: "فشل تكديس المؤشرات", paragraphs: [
            "لعقود طويلة اعتمد التحليل المالي على إضافة المزيد من المؤشرات.",
            "مؤشرات زخم، متوسطات متحركة، نطاقات سعرية، قنوات… إشارات فوق إشارات.", "كل واحدة تعد بالمزيد من الوضوح.",
            "لكن النتيجة غالبًا كانت عكس ذلك.",
            "المزيد من المؤشرات يعني المزيد من التفسيرات.", "والمزيد من التفسيرات يعني المزيد من الارتباك.",
            "لقد تم الخلط بين التعقيد والبصيرة.", "وهنا جاءت فكرة PHASEX.",
        ]
    },
    {
        title: "رؤية بنيوية للسوق", paragraphs: [
            "السوق لا يتحرك بشكل عشوائي من لحظة إلى أخرى.", "بل يتطور عبر حالات بنيوية.",
            "لحظات توسّع.", "لحظات انكماش.", "فترات ضغط اتجاهي.", "ودورات من التذبذب والتوازن.",
            "بدلاً من مطاردة الإشارات، تقوم PHASEX برصد هذه الحالات.",
            "وتعيد بناء سلوك السوق ضمن إطار تحليلي يكشف البنية الحقيقية للحركة السعرية.",
        ]
    },
    {
        title: "من المؤشرات إلى الحالات", paragraphs: [
            "تستبدل PHASEX الإشارات المتفرقة بلغة تحليلية موحدة قائمة على الحالات البنيوية.",
            "تمثل المنصة سلوك السوق من خلال مجموعة من الحالات:",
        ], states: ["Phase State", "Displacement State", "Reference State", "Oscillation State", "Direction State", "Envelope State"],
        after: ["كل حالة تكشف بعدًا مختلفًا من ديناميكيات السوق.", "ومجتمعةً تشكل نظامًا متكاملًا لفهم حركة الأسواق."]
    },
    {
        title: "الوضوح قبل التعقيد", paragraphs: [
            "تولد الأسواق المالية كمًا هائلًا من البيانات.",
            "لكن الفهم الحقيقي لا يأتي من إضافة المزيد من الضجيج.", "بل من رؤية البنية.",
            "لقد بُنيت PHASEX على فلسفة بسيطة:",
        ], highlights: ["تقليل الضجيج.", "إظهار البنية.", "فهم السلوك."],
        after: ["ومن خلال إعادة بناء حركة السعر في صورة حالات قابلة للفهم، تمنح PHASEX المتداولين رؤية أكثر وضوحًا لديناميكيات السوق."]
    },
    {
        title: "ليس تنبؤًا… بل رؤية", paragraphs: [
            "PHASEX لا تحاول التنبؤ بالمستقبل.", "بل تسعى إلى جعل الحاضر مرئيًا.",
            "وعندما تصبح البنية واضحة، يصبح السلوك مفهومًا.",
            "وعندما يصبح السلوك مفهومًا، تصبح القرارات أكثر وعيًا.",
        ]
    },
    {
        title: "لغة جديدة لفهم السوق", paragraphs: [
            "لطالما تم تفسير الأسواق عبر المؤشرات.", "لكن PHASEX تقترح لغة مختلفة.",
            "لغة قائمة على الحالات والبنية والسلوك.",
            "لغة لا تهدف إلى إغراق المتداول بالإشارات، بل إلى مساعدته على رؤية السوق كما هو.",
        ]
    },
    {
        title: "الرؤية", paragraphs: [
            "نشأت PHASEX من هدف بسيط لكنه طموح:",
            "إعادة تعريف الطريقة التي يتم بها تصور وفهم الأسواق المالية.",
            "ليس عبر المزيد من المؤشرات.", "بل عبر بنية أعمق.",
        ]
    },
];

const manifestoTR = [
    {
        title: "Piyasa Gürültü Değildir", paragraphs: [
            "Finansal piyasalar genellikle rastgelelik ve spekülasyonla yönlendirilen kaotik sistemler olarak tanımlanır.",
            "Grafikler fiyat hareketleriyle durmaksızın yanıp söner, göstergeler dikkat çekmek için yarışır ve yatırımcılar çelişkili sinyaller arasında gezinmek zorunda kalır.",
            "Ancak piyasalar gürültü değildir.", "Onlar sistemlerdir.",
            "Yapı, baskı, ritim ve davranış döngüleri ile şekillenen sistemler.",
            "Sorun hiçbir zaman piyasanın kendisi olmadı.", "Sorun her zaman onu gözlemleme şeklimizdeydi.",
        ]
    },
    {
        title: "Gösterge İstiflemesinin Başarısızlığı", paragraphs: [
            "On yıllardır, piyasa analizi sürekli artan bir göstergeler koleksiyonuna dayandırıldı.",
            "Osilatörler, hareketli ortalamalar, bantlar, kanallar, sinyallerin üzerine yığılan sinyaller.", "Her biri netlik vaat ediyor.",
            "Ancak sonuç genellikle tam tersi oldu.",
            "Daha fazla gösterge daha fazla yorumlama yaratır.", "Daha fazla yorumlama daha fazla kafa karışıklığı yaratır.",
            "Karmaşıklık, içgörü ile karıştırıldı.", "PHASEX bu duruma meydan okumak için yaratıldı.",
        ]
    },
    {
        title: "Piyasalara Yapısal Bir Bakış", paragraphs: [
            "Piyasalar anlık olarak rastgele hareket etmez.", "Yapısal durumlar yoluyla evrimleşirler.",
            "Genişleme anları.", "Daralma anları.", "Yönlü baskı dönemleri.", "Osilasyon ve denge döngüleri.",
            "PHASEX sinyalleri kovalamak yerine bu durumları gözlemler.",
            "Fiyat hareketinin altında yatan yapıyı ortaya çıkarmak için tasarlanmış bir çerçeve aracılığıyla piyasa davranışını yeniden inşa eder.",
        ]
    },
    {
        title: "Göstergelerden Durumlara", paragraphs: [
            "PHASEX, parçalanmış sinyalleri birleşik bir yapısal dille değiştirir.",
            "Platform, piyasa davranışını farklı analitik durumlar aracılığıyla temsil eder:",
        ], states: ["Faz Durumu", "Yer Değiştirme Durumu", "Referans Durumu", "Osilasyon Durumu", "Yön Durumu", "Zarf Durumu"],
        after: ["Her durum piyasa dinamiklerinin farklı bir boyutunu yakalar.", "Birlikte, piyasaların nasıl evrimleştiğini gözlemlemek için tutarlı bir sistem oluştururlar."]
    },
    {
        title: "Karmaşıklık Yerine Netlik", paragraphs: [
            "Finansal piyasalar devasa veri akışları üretir, ancak içgörü nadiren daha fazla gürültü eklemekten gelir.",
            "Gerçek anlayış yapıyı görmekten gelir.", "PHASEX basit bir felsefeyle inşa edildi:",
        ], highlights: ["Gürültüyü azalt.", "Yapıyı ortaya çıkar.", "Davranışı gözlemle."],
        after: ["PHASEX, fiyat hareketini yorumlanabilir durumlara dönüştürerek yatırımcıların ve analistlerin piyasaları geleneksel araçlarla nadiren elde edilen bir netlik düzeyinde gözlemlemesini sağlar."]
    },
    {
        title: "Tahmin Değil. Gözlem.", paragraphs: [
            "PHASEX geleceği tahmin etmeye çalışmaz.", "Şimdiki zamanı görünür kılmaya çalışır.",
            "Yapı netleştiğinde, davranış anlaşılabilir hale gelir.",
            "Ve davranış anlaşılabilir hale geldiğinde, kararlar daha bilinçli hale gelir.",
        ]
    },
    {
        title: "Piyasa Yapısı İçin Yeni Bir Dil", paragraphs: [
            "Piyasalar uzun zamandır göstergelerin merceğinden görüldü.", "PHASEX farklı bir dil öneriyor.",
            "Durumların, yapının ve davranışın dili.",
            "Yatırımcıları sinyallere boğmak için değil, piyasayı olduğu gibi görmelerine yardımcı olmak için tasarlanmış bir dil.",
        ]
    },
    {
        title: "Vizyon", paragraphs: [
            "PHASEX basit ama iddialı bir hedefle yaratıldı:",
            "Finansal piyasaların görselleştirilme ve anlaşılma şeklini yeniden düşünmek.",
            "Daha fazla gösterge aracılığıyla değil.", "Daha derin bir yapı aracılığıyla.",
        ]
    },
];

const manifestoRU = [
    {
        title: "Рынок — это не шум", paragraphs: [
            "Финансовые рынки часто описывают как хаотичные системы, движимые случайностью и спекуляциями.",
            "Графики бесконечно мигают изменениями цен, индикаторы соревнуются за внимание, а трейдеры вынуждены ориентироваться в ландшафте противоречивых сигналов.",
            "Но рынки — это не шум.", "Это системы.",
            "Системы, формируемые структурой, давлением, ритмом и поведенческими циклами.",
            "Проблема никогда не была в самом рынке.", "Проблема всегда заключалась в том, как мы пытаемся его наблюдать.",
        ]
    },
    {
        title: "Провал накопления индикаторов", paragraphs: [
            "На протяжении десятилетий анализ рынка опирался на постоянно растущую коллекцию индикаторов.",
            "Осцилляторы, скользящие средние, ленты, каналы, сигналы, наслаивающиеся на сигналы.", "И каждый обещает ясность.",
            "Но результат часто оказывался противоположным.",
            "Больше индикаторов создает больше интерпретаций.", "Больше интерпретаций создает больше путаницы.",
            "Сложность ошибочно принимается за понимание.", "PHASEX был создан, чтобы бросить вызов этому.",
        ]
    },
    {
        title: "Структурный взгляд на рынки", paragraphs: [
            "Рынки не движутся случайным образом от тика к тику.", "Они развиваются через структурные состояния.",
            "Моменты расширения.", "Моменты сжатия.", "Периоды направленного давления.", "Циклы колебаний и равновесия.",
            "Вместо того чтобы гоняться за сигналами, PHASEX наблюдает за этими состояниями.",
            "Он реконструирует поведение рынка через структуру, предназначенную для раскрытия базовой структуры движения цен.",
        ]
    },
    {
        title: "От индикаторов к состояниям", paragraphs: [
            "PHASEX заменяет фрагментированные сигналы единым структурным языком.",
            "Платформа представляет поведение рынка через различные аналитические состояния:",
        ], states: ["Состояние фазы", "Состояние смещения", "Эталонное состояние", "Состояние колебаний", "Состояние направления", "Состояние огибающей"],
        after: ["Каждое состояние фиксирует разное измерение динамики рынка.", "Вместе они образуют согласованную систему для наблюдения за эволюцией рынков."]
    },
    {
        title: "Ясность важнее сложности", paragraphs: [
            "Финансовые рынки генерируют огромные потоки данных, но понимание редко приходит от добавления большего количества шума.",
            "Истинное понимание приходит от видения структуры.", "PHASEX был построен с простой философией:",
        ], highlights: ["Уменьшить шум.", "Раскрыть структуру.", "Наблюдать поведение."],
        after: ["Реконструируя движение цены в интерпретируемые состояния, PHASEX позволяет трейдерам и аналитикам наблюдать за рынками с уровнем ясности, редко достигаемым с помощью традиционных инструментов."]
    },
    {
        title: "Не предсказание. Наблюдение.", paragraphs: [
            "PHASEX не пытается предсказать будущее.", "Он стремится сделать видимым настоящее.",
            "Когда структура становится ясной, поведение становится понятным.",
            "А когда поведение становится понятным, решения становятся более обоснованными.",
        ]
    },
    {
        title: "Новый язык для структуры рынка", paragraphs: [
            "Рынки долгое время рассматривались через призму индикаторов.", "PHASEX предлагает другой язык.",
            "Язык состояний, структуры и поведения.",
            "Язык, разработанный не для того, чтобы ошеломлять трейдеров сигналами, а для того, чтобы помочь им видеть рынок таким, каков он есть на самом деле.",
        ]
    },
    {
        title: "Видение", paragraphs: [
            "PHASEX был создан с простой, но амбициозной целью:",
            "Переосмыслить то, как визуализируются и понимаются финансовые рынки.",
            "Не через увеличение количества индикаторов.", "А через более глубокую структуру.",
        ]
    },
];

export function ManifestoModal({ isOpen, onClose }: TermsModalProps) {
    const { language } = useLanguage();
    const isRTL = language === "ar";
    const accent = "#a855f7";
    const accentG = "rgba(168,85,247,";
    const sections = language === "ar" ? manifestoAR : language === "ru" ? manifestoRU : language === "tr" ? manifestoTR : manifestoEN;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <motion.div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
                    <motion.div className="relative w-full max-w-3xl max-h-[85vh] rounded-2xl overflow-hidden flex flex-col"
                        dir={isRTL ? "rtl" : "ltr"}
                        style={{
                            background: "linear-gradient(160deg, rgba(14,20,33,0.98) 0%, rgba(8,12,22,0.99) 100%)",
                            border: `1px solid ${accentG}0.15)`,
                            boxShadow: `0 25px 80px rgba(0,0,0,0.6), 0 0 60px ${accentG}0.1)`,
                        }}
                        initial={{ opacity: 0, y: 40, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 40, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 100, damping: 20 }}>
                        <motion.div className="absolute top-0 left-0 right-0 h-[2px] z-30"
                            style={{ background: `linear-gradient(90deg, transparent 5%, ${accent} 30%, ${accent} 70%, transparent 95%)` }}
                            animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2, repeat: Infinity }} />
                        <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: `1px solid ${accentG}0.1)` }}>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                                    style={{ background: `${accentG}0.1)`, border: `1px solid ${accentG}0.2)` }}>
                                    <BookOpen className="w-5 h-5" style={{ color: accent }} />
                                </div>
                                <div>
                                    <h2 className="text-lg font-black text-white">
                                        {language === "ar" ? "مانيفستو PHASEX" : language === "tr" ? "PHASEX Bildirgesi" : language === "ru" ? "Манифест PHASEX" : "PHASEX Manifesto"}
                                    </h2>
                                    <p className="text-[11px] text-gray-500 font-medium">{language === "ar" ? "انظر إلى السوق كنظام" : language === "tr" ? "Piyasayı bir sistem olarak görün" : language === "ru" ? "Рассматривайте рынок как систему" : "See the market as a system"}</p>
                                </div>
                            </div>
                            <motion.button onClick={onClose} whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}
                                className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:text-white transition-colors cursor-pointer"
                                style={{ background: "rgba(255,255,255,0.05)" }}>
                                <X className="w-5 h-5" />
                            </motion.button>
                        </div>
                        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6" style={{ scrollbarWidth: "thin", scrollbarColor: `${accent}30 transparent` }}>
                            {sections.map((section, i) => (
                                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }} className="rounded-xl p-5"
                                    style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
                                    <h3 className="text-base font-black mb-4 flex items-center gap-2" style={{ color: accent }}>
                                        <BookOpen className="w-4 h-4 flex-shrink-0" />
                                        {section.title}
                                    </h3>
                                    {section.paragraphs.map((p, j) => (
                                        <p key={j} className={`text-[13px] leading-relaxed mb-1.5 ${p.startsWith("But ") || p.startsWith("They are systems") || p.startsWith("The problem") ||
                                            p.startsWith("لكن") || p.startsWith("إنه نظام") || p.startsWith("المشكلة") ||
                                            p.startsWith("بل") || p.startsWith("Not ") || p.startsWith("PHASEX") ||
                                            p.startsWith("Ancak ") || p.startsWith("Onlar ") || p.startsWith("Sorun ") || 
                                            p.startsWith("Но ") || p.startsWith("Это ") || p.startsWith("Проблема ") || p.startsWith("Не ") 
                                            ? "text-white font-bold" : "text-gray-400"
                                            }`}>{p}</p>
                                    ))}
                                    {(section as any).states && (
                                        <div className="flex flex-wrap gap-2 my-3">
                                            {(section as any).states.map((s: string, j: number) => (
                                                <span key={j} className="px-3 py-1.5 rounded-lg text-[12px] font-bold"
                                                    style={{ background: `${accentG}0.1)`, color: accent, border: `1px solid ${accentG}0.2)` }}>
                                                    {s}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    {(section as any).highlights && (
                                        <div className="my-3 space-y-1">
                                            {(section as any).highlights.map((h: string, j: number) => (
                                                <p key={j} className="text-[14px] font-black" style={{ color: accent }}>{h}</p>
                                            ))}
                                        </div>
                                    )}
                                    {(section as any).after && (section as any).after.map((a: string, j: number) => (
                                        <p key={j} className="text-[13px] text-gray-400 leading-relaxed mt-1.5">{a}</p>
                                    ))}
                                </motion.div>
                            ))}

                            {/* Final signature */}
                            <div className="text-center py-6">
                                <motion.p className="text-2xl font-black mb-2" style={{ color: accent }}
                                    animate={{ textShadow: [`0 0 20px ${accentG}0.3)`, `0 0 40px ${accentG}0.5)`, `0 0 20px ${accentG}0.3)`] }}
                                    transition={{ duration: 3, repeat: Infinity }}>
                                    PHASEX
                                </motion.p>
                                <p className="text-sm text-gray-500 font-medium italic">
                                    {language === "ar" ? "انظر إلى السوق كنظام." : language === "tr" ? "Piyasayı bir sistem olarak görün." : language === "ru" ? "Рассматривайте рынок как систему." : "See the market as a system."}
                                </p>
                            </div>
                        </div>
                        <motion.div className="absolute bottom-0 left-0 right-0 h-[1px]"
                            style={{ background: `linear-gradient(90deg, transparent 10%, ${accent}50 40%, ${accent}50 60%, transparent 90%)` }}
                            animate={{ opacity: [0.2, 0.6, 0.2] }} transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }} />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export function ManifestoButton({ onClick }: { onClick: () => void }) {
    const { t } = useLanguage();
    return (
        <motion.button onClick={onClick} whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold cursor-pointer transition-all"
            style={{ background: "rgba(168,85,247,0.06)", border: "1px solid rgba(168,85,247,0.15)", color: "#a855f7" }}>
            <BookOpen className="w-3.5 h-3.5" />
            {t("manifesto")}
        </motion.button>
    );
}

/* ═══════════ PRIVACY POLICY ═══════════ */

const privacyEN = [
    { title: "Introduction", text: "PHASEX respects your privacy and is committed to protecting your personal data. This Privacy Policy explains how we collect, use, process, and safeguard information when you use our website and services.\nBy accessing or using the PHASEX platform, you agree to the practices described in this policy." },
    {
        title: "Information We Collect", subsections: [
            { sub: "Personal Information", desc: "Information that can identify you directly, such as:", items: ["Name", "Email address", "Account credentials", "Payment information (processed by third-party payment providers)"] },
            { sub: "Technical Information", desc: "When you access PHASEX, certain technical data may be collected automatically, including:", items: ["IP address", "Device type", "Browser type", "Operating system", "Access timestamps", "Usage activity within the platform"] },
            { sub: "Analytical Data", desc: "We may collect usage analytics to improve the performance, security, and functionality of the platform." },
        ]
    },
    {
        title: "How We Use Your Information", text: "We use collected information for purposes including:", items: [
            "Creating and managing user accounts",
            "Providing access to platform features",
            "Improving system performance and user experience",
            "Detecting fraud or unauthorized activity",
            "Communicating service updates or support responses",
        ], after: "PHASEX does not sell personal data to third parties."
    },
    {
        title: "Data Sharing", text: "Your information may be shared only under limited circumstances:", items: [
            "With service providers supporting infrastructure, hosting, or payments",
            "When required by applicable law or legal obligations",
            "To protect the security or integrity of the platform",
        ]
    },
    { title: "Data Security", text: "PHASEX implements reasonable technical and organizational measures to protect user data from unauthorized access, misuse, or disclosure.\nHowever, no internet transmission or storage system can be guaranteed to be completely secure." },
    { title: "Data Retention", text: "Personal information is retained only as long as necessary to provide services, comply with legal obligations, or resolve disputes." },
    {
        title: "User Rights", text: "Depending on your jurisdiction, you may have the right to:", items: [
            "Access your personal data",
            "Request correction of inaccurate data",
            "Request deletion of personal information",
            "Withdraw consent where applicable",
        ], after: "Requests can be submitted through the platform's support contact."
    },
    { title: "Third-Party Services", text: "PHASEX may integrate third-party tools or services. These providers operate under their own privacy policies, and PHASEX is not responsible for their practices." },
    { title: "Policy Updates", text: "This Privacy Policy may be updated periodically. Continued use of the platform after updates constitutes acceptance of the revised policy." },
    { title: "Contact", text: "For privacy-related inquiries:\nSupport Email: phasexai@gmail.com" },
];

const privacyAR = [
    { title: "المقدمة", text: "تحترم PHASEX خصوصية مستخدميها وتلتزم بحماية بياناتهم الشخصية. توضح هذه السياسة كيفية جمع البيانات واستخدامها ومعالجتها وحمايتها عند استخدام الموقع أو خدمات المنصة.\nباستخدام منصة PHASEX فإنك توافق على الممارسات الموضحة في هذه السياسة." },
    {
        title: "المعلومات التي نقوم بجمعها", subsections: [
            { sub: "المعلومات الشخصية", desc: "مثل:", items: ["الاسم", "البريد الإلكتروني", "بيانات تسجيل الدخول", "معلومات الدفع (تتم معالجتها عبر مزودي دفع خارجيين)"] },
            { sub: "المعلومات التقنية", desc: "عند استخدام الموقع قد يتم جمع بعض البيانات التقنية تلقائيًا مثل:", items: ["عنوان IP", "نوع الجهاز", "نوع المتصفح", "نظام التشغيل", "وقت الوصول إلى الموقع", "نشاط الاستخدام داخل المنصة"] },
            { sub: "بيانات التحليل", desc: "قد يتم جمع بيانات إحصائية لتحسين أداء المنصة وتطوير خدماتها." },
        ]
    },
    {
        title: "كيفية استخدام المعلومات", text: "نستخدم المعلومات التي يتم جمعها لأغراض تشمل:", items: [
            "إنشاء وإدارة حسابات المستخدمين",
            "تقديم خدمات المنصة",
            "تحسين الأداء وتجربة المستخدم",
            "اكتشاف الأنشطة غير المصرح بها",
            "التواصل مع المستخدمين بشأن التحديثات أو الدعم الفني",
        ], after: "لا تقوم PHASEX ببيع البيانات الشخصية لأي طرف ثالث."
    },
    {
        title: "مشاركة البيانات", text: "قد تتم مشاركة البيانات في حالات محدودة مثل:", items: [
            "مع مزودي الخدمات التقنية أو الدفع",
            "عند وجود التزام قانوني",
            "لحماية أمن المنصة أو مستخدميها",
        ]
    },
    { title: "حماية البيانات", text: "تتخذ PHASEX إجراءات تقنية وتنظيمية معقولة لحماية البيانات من الوصول غير المصرح به أو الاستخدام غير المشروع.\nومع ذلك لا يمكن ضمان الأمان الكامل لأي نظام يعمل عبر الإنترنت." },
    { title: "الاحتفاظ بالبيانات", text: "يتم الاحتفاظ بالبيانات فقط للمدة اللازمة لتقديم الخدمات أو الامتثال للمتطلبات القانونية." },
    {
        title: "حقوق المستخدم", text: "قد يحق للمستخدمين حسب القوانين المحلية:", items: [
            "الوصول إلى بياناتهم الشخصية",
            "تصحيح البيانات غير الدقيقة",
            "طلب حذف البيانات",
            "سحب الموافقة عند الحاجة",
        ]
    },
    { title: "خدمات الأطراف الثالثة", text: "قد تستخدم PHASEX خدمات أو أدوات تابعة لطرف ثالث. وتخضع هذه الخدمات لسياسات الخصوصية الخاصة بها." },
    { title: "تحديثات السياسة", text: "قد يتم تعديل هذه السياسة من وقت لآخر. استمرار استخدام المنصة يعني الموافقة على التعديلات." },
];

const privacyTR = [
    { title: "Giriş", text: "PHASEX gizliliğinize saygı duyar ve kişisel verilerinizi korumaya kararlıdır. Bu Gizlilik Politikası, web sitemizi ve hizmetlerimizi kullandığınızda bilgileri nasıl topladığımızı, kullandığımızı, işlediğimizi ve koruduğumuzu açıklar.\nPHASEX platformuna erişerek veya onu kullanarak bu politikada açıklanan uygulamaları kabul etmiş olursunuz." },
    {
        title: "Topladığımız Bilgiler", subsections: [
            { sub: "Kişisel Bilgiler", desc: "Sizi doğrudan tanımlayabilen bilgiler:", items: ["Ad", "E-posta adresi", "Hesap kimlik bilgileri", "Ödeme bilgileri (üçüncü taraf ödeme sağlayıcıları tarafından işlenir)"] },
            { sub: "Teknik Bilgiler", desc: "PHASEX'e eriştiğinizde bazı teknik veriler otomatik olarak toplanabilir:", items: ["IP adresi", "Cihaz türü", "Tarayıcı türü", "İşletim sistemi", "Erişim zaman damgaları", "Platform içindeki kullanım etkinlikleri"] },
            { sub: "Analitik Veriler", desc: "Platformun performansını, güvenliğini ve işlevselliğini geliştirmek için kullanım analitikleri toplayabiliriz." },
        ]
    },
    {
        title: "Bilgilerinizi Nasıl Kullanıyoruz", text: "Toplanan bilgileri aşağıdakiler dahil çeşitli amaçlar için kullanırız:", items: [
            "Kullanıcı hesapları oluşturmak ve yönetmek",
            "Platform özelliklerine erişim sağlamak",
            "Sistem performansını ve kullanıcı deneyimini iyileştirmek",
            "Dolandırıcılık veya yetkisiz etkinlikleri tespit etmek",
            "Hizmet güncellemeleri veya destek yanıtları iletmek",
        ], after: "PHASEX kişisel verileri üçüncü taraflara satmaz."
    },
    {
        title: "Veri Paylaşımı", text: "Bilgileriniz yalnızca sınırlı durumlarda paylaşılabilir:", items: [
            "Altyapı, barındırma veya ödemeleri destekleyen hizmet sağlayıcılarla",
            "Geçerli yasa veya yasal yükümlülükler gerektirdiğinde",
            "Platformun güvenliğini veya bütünlüğünü korumak için",
        ]
    },
    { title: "Veri Güvenliği", text: "PHASEX, kullanıcı verilerini yetkisiz erişimden, kötüye kullanımdan veya ifşadan korumak için makul teknik ve organizasyonel önlemler uygular.\nAncak, hiçbir internet iletimi veya depolama sisteminin tamamen güvenli olduğu garanti edilemez." },
    { title: "Veri Saklama", text: "Kişisel bilgiler yalnızca hizmet sağlamak, yasal yükümlülüklere uymak veya anlaşmazlıkları çözmek için gerekli olduğu sürece saklanır." },
    {
        title: "Kullanıcı Hakları", text: "Yargı alanınıza bağlı olarak şunlara hakkınız olabilir:", items: [
            "Kişisel verilerinize erişmek",
            "Yanlış verilerin düzeltilmesini talep etmek",
            "Kişisel bilgilerin silinmesini talep etmek",
            "Mümkün olduğunda onayı geri çekmek",
        ], after: "Talepler, platformun destek iletişimi aracılığıyla gönderilebilir."
    },
    { title: "Üçüncü Taraf Hizmetleri", text: "PHASEX, üçüncü taraf araçlarını veya hizmetlerini entegre edebilir. Bu sağlayıcılar kendi gizlilik politikaları altında çalışırlar ve PHASEX uygulamalarından sorumlu değildir." },
    { title: "Politika Güncellemeleri", text: "Bu Gizlilik Politikası periyodik olarak güncellenebilir. Güncellemelerden sonra platformun kullanılmaya devam edilmesi, revize edilen politikanın kabul edildiği anlamına gelir." },
    { title: "İletişim", text: "Gizlilikle ilgili sorularınız için:\nDestek E-postası: phasexai@gmail.com" },
];

const privacyRU = [
    { title: "Введение", text: "PHASEX уважает вашу конфиденциальность и стремится защищать ваши персональные данные. В настоящей Политике конфиденциальности объясняется, как мы собираем, используем, обрабатываем и защищаем информацию, когда вы используете наш веб-сайт и услуги.\nПолучая доступ к платформе PHASEX или используя ее, вы соглашаетесь с практикой, описанной в данной политике." },
    {
        title: "Информация, которую мы собираем", subsections: [
            { sub: "Персональная информация", desc: "Информация, с помощью которой вас можно идентифицировать напрямую, например:", items: ["Имя", "Адрес электронной почты", "Учетные данные", "Платежная информация (обрабатывается сторонними поставщиками платежных услуг)"] },
            { sub: "Техническая информация", desc: "При доступе к PHASEX некоторые технические данные могут собираться автоматически, включая:", items: ["IP-адрес", "Тип устройства", "Тип браузера", "Операционная система", "Временные метки доступа", "Активность использования платформы"] },
            { sub: "Аналитические данные", desc: "Мы можем собирать аналитику использования для улучшения производительности, безопасности и функциональности платформы." },
        ]
    },
    {
        title: "Как мы используем вашу информацию", text: "Мы используем собранную информацию для следующих целей:", items: [
            "Создание и управление учетными записями пользователей",
            "Обеспечение доступа к функциям платформы",
            "Улучшение производительности системы и пользовательского опыта",
            "Распознавание мошенничества или несанкционированной активности",
            "Информирование об обновлениях службы или ответы на запросы в службу поддержки",
        ], after: "PHASEX не продает персональные данные третьим лицам."
    },
    {
        title: "Обмен данными", text: "Ваша информация может быть передана только в ограниченных случаях:", items: [
            "Поставщикам услуг, поддерживающим инфраструктуру, хостинг или платежи",
            "Когда этого требует применимое законодательство или юридические обязательства",
            "Для защиты безопасности или целостности платформы",
        ]
    },
    { title: "Безопасность данных", text: "PHASEX принимает разумные технические и организационные меры для защиты пользовательских данных от несанкционированного доступа, ненадлежащего использования или раскрытия.\nОднако никакая система передачи или хранения данных в Интернете не может быть гарантированно полностью безопасной." },
    { title: "Хранение данных", text: "Персональная информация хранится только до тех пор, пока это необходимо для предоставления услуг, соблюдения юридических обязательств или разрешения споров." },
    {
        title: "Мои права", text: "В зависимости от вашей юрисдикции вы можете иметь право на:", items: [
            "Доступ к вашим персональным данным",
            "Запрос на исправление неточных данных",
            "Запрос на удаление персональной информации",
            "Отзыв согласия, где это применимо",
        ], after: "Запросы могут быть отправлены через контактную службу поддержки платформы."
    },
    { title: "Сторонние сервисы", text: "PHASEX может интегрировать сторонние инструменты или сервисы. Эти поставщики работают в соответствии со своими собственными политиками конфиденциальности, и PHASEX не несет ответственности за их действия." },
    { title: "Обновления политики", text: "Настоящая Политика конфиденциальности может периодически обновляться. Продолжение использования платформы после обновлений означает принятие пересмотренной политики." },
    { title: "Контактная информация", text: "По вопросам, связанным с конфиденциальностью:\nАдрес электронной почты службы поддержки: phasexai@gmail.com" },
];

export function PrivacyPolicyModal({ isOpen, onClose }: TermsModalProps) {
    const { language } = useLanguage();
    const isRTL = language === "ar";
    const accent = "#06b6d4";
    const accentG = "rgba(6,182,212,";
    const sections = language === "ar" ? privacyAR : language === "ru" ? privacyRU : language === "tr" ? privacyTR : privacyEN;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <motion.div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
                    <motion.div className="relative w-full max-w-3xl max-h-[85vh] rounded-2xl overflow-hidden flex flex-col"
                        dir={isRTL ? "rtl" : "ltr"}
                        style={{
                            background: "linear-gradient(160deg, rgba(14,20,33,0.98) 0%, rgba(8,12,22,0.99) 100%)",
                            border: `1px solid ${accentG}0.15)`,
                            boxShadow: `0 25px 80px rgba(0,0,0,0.6), 0 0 60px ${accentG}0.1)`,
                        }}
                        initial={{ opacity: 0, y: 40, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 40, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 100, damping: 20 }}>
                        <motion.div className="absolute top-0 left-0 right-0 h-[2px] z-30"
                            style={{ background: `linear-gradient(90deg, transparent 5%, ${accent} 30%, ${accent} 70%, transparent 95%)` }}
                            animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2, repeat: Infinity }} />
                        <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: `1px solid ${accentG}0.1)` }}>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                                    style={{ background: `${accentG}0.1)`, border: `1px solid ${accentG}0.2)` }}>
                                    <Eye className="w-5 h-5" style={{ color: accent }} />
                                </div>
                                <div>
                                    <h2 className="text-lg font-black text-white">
                                        {language === "ar" ? "سياسة الخصوصية" : language === "tr" ? "Gizlilik Politikası" : language === "ru" ? "Политика конфиденциальности" : "Privacy Policy"}
                                    </h2>
                                    <p className="text-[11px] text-gray-500 font-medium">PHASEX Platform</p>
                                </div>
                            </div>
                            <motion.button onClick={onClose} whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}
                                className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:text-white transition-colors cursor-pointer"
                                style={{ background: "rgba(255,255,255,0.05)" }}>
                                <X className="w-5 h-5" />
                            </motion.button>
                        </div>
                        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6" style={{ scrollbarWidth: "thin", scrollbarColor: `${accent}30 transparent` }}>
                            {sections.map((section, i) => (
                                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.04 }} className="rounded-xl p-5"
                                    style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
                                    <h3 className="text-sm font-black mb-3 flex items-center gap-2" style={{ color: accent }}>
                                        <Eye className="w-4 h-4 flex-shrink-0" />
                                        {section.title}
                                    </h3>
                                    {section.text && (
                                        <p className="text-[13px] text-gray-400 leading-relaxed mb-2 whitespace-pre-line">{section.text}</p>
                                    )}
                                    {(section as any).items && (
                                        <ul className={`space-y-1.5 ${isRTL ? "pr-4" : "pl-4"}`}>
                                            {(section as any).items.map((item: string, j: number) => (
                                                <li key={j} className="text-[13px] text-gray-400 leading-relaxed flex items-start gap-2">
                                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: accent, opacity: 0.5 }} />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                    {(section as any).after && (
                                        <p className="text-[13px] text-gray-400 leading-relaxed mt-2 font-medium">{(section as any).after}</p>
                                    )}
                                    {(section as any).subsections && (
                                        <div className="space-y-3 mt-2">
                                            {(section as any).subsections.map((sub: any, j: number) => (
                                                <div key={j} className="rounded-lg p-3" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.03)" }}>
                                                    <h4 className="text-[13px] font-bold text-white mb-1">{sub.sub}</h4>
                                                    <p className="text-[12px] text-gray-500 leading-relaxed">{sub.desc}</p>
                                                    {sub.items && (
                                                        <ul className={`space-y-1 mt-1.5 ${isRTL ? "pr-3" : "pl-3"}`}>
                                                            {sub.items.map((item: string, k: number) => (
                                                                <li key={k} className="text-[12px] text-gray-500 flex items-start gap-2">
                                                                    <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: accent, opacity: 0.4 }} />
                                                                    {item}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                            <div className="text-center py-4" style={{ borderTop: `1px solid rgba(255,255,255,0.04)` }}>
                                <p className="text-xs text-gray-500">© 2024 PHASE X AI. {isRTL ? "جميع الحقوق محفوظة" : "All rights reserved."}</p>
                            </div>
                        </div>
                        <motion.div className="absolute bottom-0 left-0 right-0 h-[1px]"
                            style={{ background: `linear-gradient(90deg, transparent 10%, ${accent}50 40%, ${accent}50 60%, transparent 90%)` }}
                            animate={{ opacity: [0.2, 0.6, 0.2] }} transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }} />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export function PrivacyPolicyButton({ onClick }: { onClick: () => void }) {
    const { t } = useLanguage();
    return (
        <motion.button onClick={onClick} whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold cursor-pointer transition-all"
            style={{ background: "rgba(6,182,212,0.06)", border: "1px solid rgba(6,182,212,0.15)", color: "#06b6d4" }}>
            <Eye className="w-3.5 h-3.5" />
            {t("privacyPolicy")}
        </motion.button>
    );
}

/* ═══════════ RISK DISCLOSURE ═══════════ */

const riskEN = [
    {
        title: "1. Trading Risk", text: "Trading financial markets involves significant risk and may result in the loss of part or all of invested capital.\nFinancial instruments such as:", items: [
            "Forex", "Indices", "Commodities", "Stocks", "Cryptocurrencies", "Futures", "CFDs",
        ], after: "carry a high degree of risk."
    },
    { title: "2. Leverage Risk", text: "Leverage can magnify both profits and losses.\nUnder certain conditions, losses may exceed the initial deposit depending on the financial instrument and broker policies." },
    {
        title: "3. Market Volatility", text: "Financial markets may experience rapid price movements caused by:", items: [
            "Economic news", "Political events", "Market liquidity changes", "Institutional flows",
        ], after: "Such movements may cause unexpected trading outcomes."
    },
    {
        title: "4. Analytical Tools Limitation", text: "PHASEX provides quantitative market representations and analytical tools, including structural market states and chart models.\nThese tools:", items: [
            "Do not guarantee profitable outcomes",
            "Do not predict market behavior with certainty",
            "Should not be relied upon as the sole basis for trading decisions.",
        ]
    },
    {
        title: "5. Technical Risks", text: "Technical issues such as:", items: [
            "Internet disruptions", "Server failures", "Platform outages", "Data delays",
        ], after: "may impact the availability or accuracy of information."
    },
    { title: "6. Data Variations", text: "Market prices may differ across brokers or exchanges.\nTherefore, chart patterns and structural representations displayed on PHASEX may vary from other trading platforms." },
    {
        title: "7. User Responsibility", text: "Users are fully responsible for:", items: [
            "Risk management", "Position sizing", "Stop-loss placement", "Financial decisions",
        ], after: "PHASEX does not manage or control user trading accounts."
    },
    { title: "8. No Guarantee of Profit", text: "Past market behavior or analytical representations do not guarantee future performance.\nNo system, model, or analytical tool can eliminate trading risk." },
    { title: "9. Acknowledgment", text: "By using PHASEX, you acknowledge that you understand and accept the risks associated with financial market trading." },
];

const riskAR = [
    { title: "1. طبيعة المخاطر", text: "التداول في الأسواق المالية (العملات، المؤشرات، السلع، الأسهم، العملات الرقمية، المشتقات، العقود مقابل الفروقات، والعقود الآجلة) ينطوي على مخاطر مرتفعة وقد يؤدي إلى خسارة جزئية أو كاملة لرأس المال." },
    { title: "2. الرافعة المالية", text: "استخدام الرافعة المالية قد يضاعف الأرباح كما قد يضاعف الخسائر بسرعة. قد تخسر أكثر من الإيداع الأولي حسب نوع المنتج والوسيط وشروطه." },
    {
        title: "3. تقلبات السوق والانزلاق السعري", text: "الأسعار قد تتحرك بسرعة عالية، وقد يحدث:", items: [
            "فجوات سعرية", "انزلاق سعري", "اتساع سبريد", "تأخيرات تنفيذ",
        ], after: "ما قد يؤدي إلى نتائج مختلفة عن المتوقع."
    },
    {
        title: "4. الاعتماد على التحليل والمخرجات", text: "PHASEX يقدم تمثيلات وتحليلات كمية (Market States) تساعد على الفهم، لكنها:", items: [
            "لا تضمن نتائج", "لا تمنع الخسارة",
            "وقد تخطئ، أو تتأثر بظروف استثنائية (أخبار، أزمات، تدخلات، سيولة ضعيفة).",
        ]
    },
    { title: "5. المخاطر التقنية", text: "قد تتعرض المنصة أو مزودو البيانات/الإنترنت/الجهاز المستخدم لانقطاعات أو تأخير أو أعطال. قد يؤثر ذلك على تحديث البيانات أو عرضها." },
    { title: "6. اختلاف بيانات الوسطاء", text: "قد تختلف الأسعار والشموع والبيانات بين مزود وآخر (Broker/Data Feed)، لذلك قد تختلف النتائج أو الإشارات البصرية من منصة لأخرى." },
    {
        title: "7. مسؤولية المستخدم", text: "أنت المسؤول الوحيد عن:", items: [
            "قرارات التداول", "إدارة المخاطر", "تحديد حجم الصفقة", "استخدام وقف الخسارة",
            "مراجعة ملاءمة المنتج لخبرتك ووضعك المالي",
        ]
    },
    {
        title: "8. لا ضمانات", text: "لا تقدم PHASEX أي ضمانات بخصوص:", items: [
            "الدقة الكاملة", "استمرارية التوفر", "تحقيق أرباح", "عدم الخسارة",
        ]
    },
    { title: "9. توصية عامة", text: "لا تتداول بأموال لا تستطيع تحمل خسارتها. إن لم تكن متأكدًا من مخاطر المنتجات المالية، استشر مختصًا مرخصًا.\nباستخدامك PHASEX، فإنك تقر بأنك قرأت هذا الإفصاح وفهمته وتقبلت المخاطر كاملة." },
];

const riskTR = [
    {
        title: "1. İşlem Riski", text: "Finansal piyasalarda işlem yapmak önemli riskler içerir ve yatırılan sermayenin bir kısmının veya tamamının kaybedilmesiyle sonuçlanabilir.\nAşağıdakiler gibi finansal araçlar:", items: [
            "Forex", "Endeksler", "Emtialar", "Hisseler", "Kripto paralar", "Vadeli İşlemler", "CFD'ler",
        ], after: "yüksek derecede risk taşır."
    },
    { title: "2. Kaldıraç Riski", text: "Kaldıraç hem kârı hem de zararı büyütebilir.\nBelirli koşullar altında, zararlar finansal araca ve broker politikalarına bağlı olarak ilk yatırılan tutarı aşabilir." },
    {
        title: "3. Piyasa Dalgalanması", text: "Finansal piyasalar şunlardan kaynaklanan hızlı fiyat hareketleri yaşayabilir:", items: [
            "Ekonomik haberler", "Siyasi olaylar", "Piyasa likidite değişiklikleri", "Kurumsal akışlar",
        ], after: "Bu tür hareketler beklenmedik işlem sonuçlarına yol açabilir."
    },
    {
        title: "4. Analitik Araçların Sınırlamaları", text: "PHASEX, yapısal piyasa durumları ve grafik modelleri de dahil olmak üzere nicel piyasa temsilleri ve analitik araçlar sunar.\nBu araçlar:", items: [
            "Kârlı sonuçları garanti etmez",
            "Piyasa davranışını kesin olarak tahmin etmez",
            "İşlem kararları için tek temel olarak güvenilmemelidir.",
        ]
    },
    {
        title: "5. Teknik Riskler", text: "Şunlar gibi teknik sorunlar:", items: [
            "İnternet kesintileri", "Sunucu arızaları", "Platform kesintileri", "Veri gecikmeleri",
        ], after: "bilgilerin kullanılabilirliğini veya doğruluğunu etkileyebilir."
    },
    { title: "6. Veri Varyasyonları", text: "Piyasa fiyatları brokerler veya borsalar arasında farklılık gösterebilir.\nBu nedenle, PHASEX'te görüntülenen grafik formasyonları ve yapısal temsiller diğer işlem platformlarından farklı olabilir." },
    {
        title: "7. Kullanıcı Sorumluluğu", text: "Kullanıcılar şunlardan tamamen sorumludur:", items: [
            "Risk yönetimi", "Pozisyon boyutlandırma", "Zarar durdurma yerleşimi", "Finansal kararlar",
        ], after: "PHASEX, kullanıcıların işlem hesaplarını yönetmez veya kontrol etmez."
    },
    { title: "8. Kâr Garantisi Yok", text: "Geçmiş piyasa davranışı veya analitik temsiller gelecekteki performansı garanti etmez.\nHiçbir sistem, model veya analitik araç işlem riskini ortadan kaldıramaz." },
    { title: "9. Onay", text: "PHASEX'i kullanarak, finansal piyasa işlemlerine ilişkin riskleri anladığınızı ve kabul ettiğinizi onaylarsınız." },
];

const riskRU = [
    {
        title: "1. Торговый риск", text: "Торговля на финансовых рынках сопряжена со значительным риском и может привести к потере части или всего инвестированного капитала.\nФинансовые инструменты, такие как:", items: [
            "Форекс", "Индексы", "Сырьевые товары", "Акции", "Криптовалюты", "Фьючерсы", "CFD",
        ], after: "несут в себе высокую степень риска."
    },
    { title: "2. Риск кредитного плеча", text: "Кредитное плечо может увеличить как прибыль, так и убытки.\nПри определенных условиях убытки могут превысить первоначальный депозит в зависимости от финансового инструмента и политики брокера." },
    {
        title: "3. Волатильность рынка", text: "На финансовых рынках могут происходить быстрые колебания цен, вызванные:", items: [
            "Экономическими новостями", "Политическими событиями", "Изменением ликвидности рынка", "Институциональными потоками",
        ], after: "Такие движения могут привести к неожиданным результатам торгов."
    },
    {
        title: "4. Ограничения аналитических инструментов", text: "PHASEX предоставляет количественные представления рынка и аналитические инструменты, включая структурные состояния рынка и модели графиков.\nЭти инструменты:", items: [
            "Не гарантируют прибыльных результатов",
            "Не предсказывают поведение рынка с уверенностью",
            "Не должны использоваться в качестве единственной основы для принятия торговых решений.",
        ]
    },
    {
        title: "5. Технические риски", text: "Технические проблемы, такие как:", items: [
            "Перебои с интернетом", "Сбои серверов", "Перебои в работе платформы", "Задержки данных",
        ], after: "могут повлиять на доступность или точность информации."
    },
    { title: "6. Вариации данных", text: "Рыночные цены могут отличаться у разных брокеров или бирж.\nПоэтому графические паттерны и структурные представления, отображаемые на PHASEX, могут отличаться от других торговых платформ." },
    {
        title: "7. Ответственность пользователя", text: "Пользователи несут полную ответственность за:", items: [
            "Управление рисками", "Определение размера позиции", "Размещение стоп-лоссов", "Финансовые решения",
        ], after: "PHASEX не управляет и не контролирует торговые счета пользователей."
    },
    { title: "8. Отсутствие гарантии прибыли", text: "Прошлое поведение рынка или аналитические представления не гарантируют результатов в будущем.\nНи одна система, модель или аналитический инструмент не могут устранить торговый риск." },
    { title: "9. Подтверждение", text: "Используя PHASEX, вы подтверждаете, что понимаете и принимаете риски, связанные с торговлей на финансовых рынках." },
];

export function RiskDisclosureModal({ isOpen, onClose }: TermsModalProps) {
    const { language } = useLanguage();
    const isRTL = language === "ar";
    const accent = "#ef4444";
    const accentG = "rgba(239,68,68,";
    const sections = language === "ar" ? riskAR : language === "ru" ? riskRU : language === "tr" ? riskTR : riskEN;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <motion.div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
                    <motion.div className="relative w-full max-w-3xl max-h-[85vh] rounded-2xl overflow-hidden flex flex-col"
                        dir={isRTL ? "rtl" : "ltr"}
                        style={{
                            background: "linear-gradient(160deg, rgba(14,20,33,0.98) 0%, rgba(8,12,22,0.99) 100%)",
                            border: `1px solid ${accentG}0.15)`,
                            boxShadow: `0 25px 80px rgba(0,0,0,0.6), 0 0 60px ${accentG}0.1)`,
                        }}
                        initial={{ opacity: 0, y: 40, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 40, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 100, damping: 20 }}>
                        <motion.div className="absolute top-0 left-0 right-0 h-[2px] z-30"
                            style={{ background: `linear-gradient(90deg, transparent 5%, ${accent} 30%, ${accent} 70%, transparent 95%)` }}
                            animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2, repeat: Infinity }} />
                        <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: `1px solid ${accentG}0.1)` }}>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                                    style={{ background: `${accentG}0.1)`, border: `1px solid ${accentG}0.2)` }}>
                                    <ShieldAlert className="w-5 h-5" style={{ color: accent }} />
                                </div>
                                <div>
                                    <h2 className="text-lg font-black text-white">
                                        {language === "ar" ? "إفصاح المخاطر" : language === "tr" ? "Risk Açıklaması" : language === "ru" ? "Уведомление о рисках" : "Risk Disclosure"}
                                    </h2>
                                    <p className="text-[11px] text-gray-500 font-medium">PHASEX Platform</p>
                                </div>
                            </div>
                            <motion.button onClick={onClose} whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}
                                className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:text-white transition-colors cursor-pointer"
                                style={{ background: "rgba(255,255,255,0.05)" }}>
                                <X className="w-5 h-5" />
                            </motion.button>
                        </div>
                        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4" style={{ scrollbarWidth: "thin", scrollbarColor: `${accent}30 transparent` }}>
                            {/* Risk warning banner */}
                            <div className="rounded-xl p-4 flex items-start gap-3" style={{ background: `${accentG}0.08)`, border: `1px solid ${accentG}0.2)` }}>
                                <ShieldAlert className="w-6 h-6 flex-shrink-0 mt-0.5" style={{ color: accent }} />
                                <div>
                                    <p className="text-[13px] font-black mb-1" style={{ color: accent }}>
                                        {language === "ar" ? "⚠️ تحذير مخاطر عالية" : language === "tr" ? "⚠️ YÜKSEK RİSK UYARISI" : language === "ru" ? "⚠️ ПРЕДУПРЕЖДЕНИЕ О ВЫСОКОМ РИСКЕ" : "⚠️ HIGH RISK WARNING"}
                                    </p>
                                    <p className="text-[12px] text-gray-400">
                                        {language === "ar" ? "التداول في الأسواق المالية ينطوي على مخاطر كبيرة. قد تخسر رأس مالك بالكامل."
                                            : language === "tr" ? "Finansal piyasalarda işlem yapmak önemli riskler içerir. Yatırım yaptığınız tüm sermayeyi kaybedebilirsiniz."
                                            : language === "ru" ? "Торговля на финансовых рынках сопряжена со значительным риском. Вы можете потерять весь инвестированный капитал."
                                            : "Trading financial markets involves significant risk. You may lose your entire invested capital."}
                                    </p>
                                </div>
                            </div>
                            {sections.map((section, i) => (
                                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.04 }} className="rounded-xl p-5"
                                    style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
                                    <h3 className="text-sm font-black mb-3 flex items-center gap-2" style={{ color: accent }}>
                                        <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                                        {section.title}
                                    </h3>
                                    {section.text && (
                                        <p className="text-[13px] text-gray-400 leading-relaxed mb-2 whitespace-pre-line">{section.text}</p>
                                    )}
                                    {section.items && (
                                        <ul className={`space-y-1.5 ${isRTL ? "pr-4" : "pl-4"}`}>
                                            {section.items.map((item, j) => (
                                                <li key={j} className="text-[13px] text-gray-400 leading-relaxed flex items-start gap-2">
                                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: accent, opacity: 0.5 }} />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                    {(section as any).after && (
                                        <p className="text-[13px] text-gray-400 leading-relaxed mt-2">{(section as any).after}</p>
                                    )}
                                </motion.div>
                            ))}
                            <div className="text-center py-4" style={{ borderTop: `1px solid rgba(255,255,255,0.04)` }}>
                                <p className="text-[11px] text-gray-600">PHASEX — Structural Market Intelligence Platform</p>
                                <p className="text-xs text-gray-500 mt-1">© 2024 PHASE X AI. {language === "ar" ? "جميع الحقوق محفوظة" : language === "tr" ? "Tüm hakları saklıdır." : language === "ru" ? "Все права защищены." : "All rights reserved."}</p>
                            </div>
                        </div>
                        <motion.div className="absolute bottom-0 left-0 right-0 h-[1px]"
                            style={{ background: `linear-gradient(90deg, transparent 10%, ${accent}50 40%, ${accent}50 60%, transparent 90%)` }}
                            animate={{ opacity: [0.2, 0.6, 0.2] }} transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }} />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export function RiskDisclosureButton({ onClick }: { onClick: () => void }) {
    const { t } = useLanguage();
    return (
        <motion.button onClick={onClick} whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold cursor-pointer transition-all"
            style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)", color: "#ef4444" }}>
            <ShieldAlert className="w-3.5 h-3.5" />
            {t("riskDisclosure")}
        </motion.button>
    );
}
