# نظام إدارة المرتجعات لسلة
## Salla Returns Management System

نظام متكامل لإدارة طلبات استرجاع المنتجات للمتاجر الإلكترونية على منصة سلة.

---

## 🎯 المميزات

### للعملاء:
- ✅ تقديم طلب استرجاع باستخدام رقم الطلب ورقم الجوال
- ✅ إدخال معلومات الحساب البنكي (الآيبان + اسم البنك)
- ✅ تتبع حالة طلب الاسترجاع
- ✅ الحصول على رقم مرجعي لطلب الاسترجاع

### للتجار:
- ✅ عرض جميع طلبات الاسترجاع
- ✅ فلترة الطلبات حسب الحالة والتاريخ
- ✅ عرض تفاصيل كل طلب استرجاع
- ✅ تحديث حالة الطلب (جديد - مقبول - مرفوض - تم الاسترجاع)
- ✅ إحصائيات شاملة عن طلبات الاسترجاع

### التكامل مع سلة:
- ✅ OAuth 2.0 للمصادقة
- ✅ Webhooks للتحديثات التلقائية
- ✅ التحقق من صحة الطلبات من API سلة
- ✅ جلب تفاصيل الطلبات والمنتجات

---

## 🚀 التثبيت والإعداد

### المتطلبات:
- Node.js (v16 أو أحدث)
- MySQL (v8 أو أحدث)
- npm أو yarn

### 1. تثبيت المكتبات

```bash
npm install
```

### 2. إعداد قاعدة البيانات

أنشئ قاعدة بيانات جديدة:

```sql
CREATE DATABASE salla_returns CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

قم باستيراد الجداول:

```bash
mysql -u root -p salla_returns < src/database/schema.sql
```

أو استخدم أي أداة MySQL GUI (مثل phpMyAdmin أو MySQL Workbench) لتنفيذ ملف `src/database/schema.sql`.

### 3. تكوين البيئة

انسخ ملف `.env.example` إلى `.env` وعدل القيم:

```bash
cp .env.example .env
```

عدل ملف `.env`:

```env
# Server Configuration
PORT=3000
NODE_ENV=production
BASE_URL=https://api.bhgxx.sa

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=salla_returns

# Salla API Configuration
SALLA_APP_ID=1564212722
SALLA_CLIENT_ID=0e4bb2ec-5c2d-4cc2-a6df-8379e93fe391
SALLA_CLIENT_SECRET=5aaccb5df7b9cc71925006314cef45f2e20473d4e1f41ac02e59789455f0ecf5
SALLA_WEBHOOK_SECRET=c2c7b42b1c9d4bf4de52ee280f088d5d3f93e03880160f19bcacd0e0ffd218bb
SALLA_WEBHOOK_URL=https://api.bhgxx.sa/webhook/salla
SALLA_API_URL=https://api.salla.dev

# JWT Secret
JWT_SECRET=your-secure-secret-key

# Frontend URL
FRONTEND_URL=https://bhgxx.sa
```

### 4. تشغيل السيرفر

للتطوير:
```bash
npm run dev
```

للإنتاج:
```bash
npm start
```

---

## 📁 بنية المشروع

```
salla-returns-management/
├── src/
│   ├── controllers/
│   │   ├── returnController.js      # معالجة طلبات الاسترجاع
│   │   └── webhookController.js     # معالجة webhooks من سلة
│   ├── database/
│   │   ├── connection.js            # اتصال قاعدة البيانات
│   │   └── schema.sql               # جداول قاعدة البيانات
│   ├── services/
│   │   └── sallaService.js          # التعامل مع Salla API
│   ├── routes/
│   │   └── index.js                 # مسارات API
│   └── server.js                    # نقطة الدخول الرئيسية
├── public/
│   ├── customer/
│   │   └── index.html               # صفحة العملاء
│   └── merchant/
│       └── index.html               # لوحة تحكم التاجر
├── .env                             # متغيرات البيئة
├── .env.example                     # مثال لمتغيرات البيئة
├── package.json
└── README.md
```

---

## 🔗 API Endpoints

### للعملاء (Customer):

#### إرسال طلب استرجاع
```http
POST /api/returns/submit
Content-Type: application/json

{
  "storeId": "store-id",
  "orderId": "123456",
  "customerPhone": "0501234567",
  "customerName": "أحمد محمد",
  "iban": "SA0000000000000000000000",
  "bankName": "الراجحي",
  "reason": "سبب الاسترجاع"
}
```

#### تتبع طلب استرجاع
```http
GET /api/returns/track/:returnNumber
```

### للتجار (Merchant):

#### جلب جميع الطلبات
```http
GET /api/merchant/returns?storeId=store-id&status=new&page=1&limit=20
```

#### جلب إحصائيات الطلبات
```http
GET /api/merchant/returns/stats?storeId=store-id
```

#### جلب تفاصيل طلب محدد
```http
GET /api/merchant/returns/:id?storeId=store-id
```

#### تحديث حالة طلب
```http
PUT /api/merchant/returns/:id/status
Content-Type: application/json

{
  "storeId": "store-id",
  "status": "approved",
  "notes": "ملاحظات اختيارية"
}
```

### Webhooks:

#### استقبال webhooks من سلة
```http
POST /api/webhook/salla
```

#### اختبار webhook
```http
GET /api/webhook/salla/test
```

---

## 🔐 تكوين سلة (Salla Configuration)

### في لوحة تحكم Salla Partner:

1. **رابط Webhook:**
   ```
   https://api.bhgxx.sa/api/webhook/salla
   ```

2. **الأحداث المطلوبة (Webhook Events):**
   - `app.store.authorize` - عند تثبيت التطبيق
   - `app.store.token` - عند تحديث التوكن
   - `order.created` - (اختياري) عند إنشاء طلب جديد
   - `order.updated` - (اختياري) عند تحديث طلب

3. **الصلاحيات المطلوبة (Permissions):**
   - `orders.read` - قراءة الطلبات
   - `orders.write` - تعديل حالة الطلبات
   - `customers.read` - قراءة معلومات العملاء

---

## 🌐 رفع النظام على السيرفر

### 1. إعداد Nginx

أنشئ ملف `/etc/nginx/sites-available/api.bhgxx.sa`:

```nginx
server {
    listen 80;
    server_name api.bhgxx.sa;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

فعّل الموقع:
```bash
sudo ln -s /etc/nginx/sites-available/api.bhgxx.sa /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 2. تثبيت SSL

```bash
sudo certbot --nginx -d api.bhgxx.sa
```

### 3. إعداد PM2 لإدارة التطبيق

```bash
npm install -g pm2
pm2 start src/server.js --name salla-returns
pm2 save
pm2 startup
```

---

## 📱 الواجهات

### صفحة العملاء:
```
https://bhgxx.sa/customer/?store=STORE_ID
```

### لوحة تحكم التاجر:
```
https://bhgxx.sa/merchant/?store=STORE_ID
```

---

## 📊 قاعدة البيانات

### الجداول الرئيسية:

1. **stores** - معلومات المتاجر المثبتة
2. **return_requests** - طلبات الاسترجاع
3. **return_items** - المنتجات المسترجعة
4. **return_status_history** - تاريخ تغيير الحالات
5. **webhook_logs** - سجل الـ webhooks

---

## 🔧 التطوير والاختبار

### تشغيل وضع التطوير:
```bash
npm run dev
```

### اختبار الـ API:
```bash
# اختبار الـ health check
curl http://localhost:3000/api/health

# اختبار الـ webhook
curl http://localhost:3000/api/webhook/salla/test
```

---

## 📝 ملاحظات مهمة

1. **الأمان:**
   - تأكد من تغيير `JWT_SECRET` في الإنتاج
   - استخدم HTTPS دائماً في الإنتاج
   - احفظ المفاتيح السرية في مكان آمن

2. **قاعدة البيانات:**
   - قم بعمل نسخ احتياطي دوري
   - استخدم indexes للأداء الأفضل

3. **Salla Webhooks:**
   - تأكد من أن webhook URL متاح وعام
   - تحقق من توقيع الـ webhooks للأمان

4. **المراقبة:**
   - راقب logs باستخدام PM2
   - راقب أداء قاعدة البيانات

---

## 🆘 الدعم

للمشاكل أو الاستفسارات، يرجى التواصل مع فريق التطوير.

---

## 📄 الترخيص

MIT License - يمكن استخدام وتعديل النظام بحرية.
