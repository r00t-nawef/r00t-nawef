# 📸 دليل إضافة الصور والشعارات

هذا الدليل يشرح كيف تضيف الصور واللوقوهات للموقع.

## 📁 هيكل المجلدات

```
website/
└── public/
    ├── logo.png              # شعار الموقع الرئيسي
    └── clients/              # شعارات العملاء
        ├── flynas.png
        ├── saudi-airlines.png
        ├── gea.png
        ├── stc.png
        ├── mobily.png
        ├── ministry-education.png
        ├── sabic.png
        ├── neom.png
        ├── spl.png
        └── cst.png
```

## 🎨 1. إضافة شعار الموقع (Logo)

### الخطوات:

1. احفظ شعار R00T باسم `logo.png`
2. انسخه إلى المجلد:
   ```bash
   cp /path/to/your/logo.png website/public/logo.png
   ```

### المواصفات المطلوبة:
- **الحجم الموصى به**: عرض 200-400px، ارتفاع 80-120px
- **الصيغة**: PNG مع خلفية شفافة (أو SVG)
- **الألوان**: يفضل أن يكون ملون أو أبيض (الموقع خلفيته داكنة)

### ملاحظات:
- إذا ما حطيت اللوقو، الموقع راح يستخدم نص "R00T" كبديل
- اللوقو يظهر في الـ Navbar (شريط التنقل أعلى الصفحة)

---

## 🏢 2. إضافة شعارات العملاء

### قائمة الشعارات المطلوبة:

| الاسم | اسم الملف |
|------|----------|
| Flynas | `flynas.png` |
| Saudi Airlines | `saudi-airlines.png` |
| GEA | `gea.png` |
| STC | `stc.png` |
| Mobily | `mobily.png` |
| Ministry of Education | `ministry-education.png` |
| SABIC | `sabic.png` |
| NEOM | `neom.png` |
| SPL | `spl.png` |
| CST | `cst.png` |

### الخطوات:

1. جهز شعارات العملاء بالأسماء الصحيحة
2. انسخهم للمجلد:
   ```bash
   cp /path/to/logos/* website/public/clients/
   ```

### المواصفات المطلوبة:
- **الحجم الموصى به**: 300x300px (مربع) أو 400x200px (مستطيل)
- **الصيغة**: PNG مع خلفية شفافة
- **الألوان**:
  - يفضل شعارات بيضاء/رمادية فاتحة (الموقع يحولها لأبيض)
  - أو شعارات ملونة (الموقع راح يطبق filter عليها)

### ملاحظات:
- الموقع فيه نظام Fallback: إذا ما لقى الصورة، راح يعرض اسم الشركة كنص
- الشعارات تظهر في قسم "Trusted By Industry Leaders"

---

## 🖼️ 3. طريقة النسخ السريعة

### إذا عندك الملفات في Google Drive:

1. حمّل المجلد من Google Drive
2. افتح Terminal في مجلد المشروع
3. نفذ الأوامر:

```bash
# نسخ اللوقو الرئيسي
cp ~/Downloads/r00t-logo.png website/public/logo.png

# نسخ شعارات العملاء
cp ~/Downloads/clients-logos/flynas.png website/public/clients/flynas.png
cp ~/Downloads/clients-logos/stc.png website/public/clients/stc.png
# ... إلخ
```

### أو باستخدام finder/file explorer:

1. افتح مجلد `website/public/`
2. اسحب وحط اللوقو مباشرة
3. افتح مجلد `clients/`
4. اسحب وحط شعارات العملاء

---

## ✅ 4. التأكد من الصور

بعد ما تضيف الصور، شغّل الموقع وتأكد:

```bash
cd website
npm run dev
```

افتح المتصفح على `http://localhost:5173` وتحقق من:
- [ ] اللوقو يظهر في الـ Navbar أعلى الصفحة
- [ ] شعارات العملاء تظهر في قسم "Clients"
- [ ] الصور واضحة ومو مشوهة

---

## 🎨 5. تعديل أسماء الملفات (إذا لزم الأمر)

إذا أسماء ملفاتك مختلفة، عدّل الملف:

**الملف**: `website/src/components/Clients.jsx`

```jsx
const clients = [
  { name: 'Flynas', logo: '/clients/flynas.png' },  // غيّر الاسم هنا
  { name: 'Saudi Airlines', logo: '/clients/saudi-airlines.png' },
  // ... إلخ
];
```

---

## 🔧 6. تحسين الصور (اختياري)

لتحسين الأداء، يفضل:

1. **ضغط الصور**:
   - استخدم [TinyPNG](https://tinypng.com) لضغط الصور
   - أو استخدم ImageOptim (Mac) / PngOptimizer (Windows)

2. **تحويل لـ WebP** (لسرعة أفضل):
   ```bash
   # إذا عندك ImageMagick
   convert logo.png logo.webp
   ```

3. **استخدام SVG** (أفضل للوقوهات):
   - لو عندك الشعارات بصيغة SVG، استخدمها بدل PNG
   - SVG أخف وأوضح في كل الأحجام

---

## ❓ استكشاف المشاكل

### المشكلة: الصور ما تظهر

**الحلول:**

1. **تأكد من اسم الملف**:
   ```bash
   ls website/public/clients/
   ```
   الأسماء لازم تكون بالضبط مثل ما في الكود

2. **تأكد من صيغة الملف**:
   - الموقع يدعم: PNG, JPG, SVG, WebP
   - تأكد أن الامتداد صحيح (.png وليس .PNG)

3. **تأكد من المسار**:
   - الملفات لازم تكون في `public/` مو `src/`
   - المسار في الكود يبدأ بـ `/` مثل: `/logo.png`

4. **امسح الـ cache**:
   ```bash
   cd website
   rm -rf node_modules/.vite
   npm run dev
   ```

### المشكلة: الصور مشوهة أو مو واضحة

**الحلول:**

1. استخدم صور أكبر (على الأقل 300x300 للعملاء)
2. استخدم PNG بدل JPG للوقوهات
3. استخدم SVG للأفضلية المطلقة

### المشكلة: الصور كبيرة جداً (حجم الملف)

**الحلول:**

1. اضغط الصور باستخدام TinyPNG
2. حوّل لـ WebP
3. استخدم SVG

---

## 📞 مساعدة إضافية

إذا واجهتك أي مشكلة:

1. تأكد أن الملفات في المكان الصحيح
2. تأكد من أسماء الملفات
3. شيّك console في المتصفح (F12) للأخطاء
4. جرب امسح cache وأعد تشغيل الموقع

---

**ملاحظة**: كل الصور في مجلد `public/` راح تكون متاحة في الموقع مباشرة.
