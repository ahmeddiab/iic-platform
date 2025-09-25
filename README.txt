
# المنصّة الإلكترونية لشركة التأمين العراقية العامة (PWA)

## الملفات
- index.html — الصفحة الرئيسية.
- styles.css — التنسيقات.
- app.js — منطق الواجهة والحاسبة.
- manifest.webmanifest — تعريف PWA.
- service-worker.js — العمل دون اتصال وتخزين ملفات أساسية.
- offline.html — صفحة تظهر عند انقطاع الإنترنت.
- data/branches.json — عناوين الفروع (أضف جميع الفروع).
- icons/192.png و icons/512.png — أيقونات التطبيق.

## تشغيل محلي
1) افتح مجلّد المشروع ببرنامج VS Code وشغّل ملحق "Live Server" أو أي سيرفر محلي.
2) تفقّد الصفحة على: http://localhost:5500 (مثال).
3) جرّب التبويبات والحاسبة وتأكد من نتيجة القسط.

## نشر GitHub Pages (تجريبي)
1) أنشئ مستودعاً جديداً باسم iic-platform وارفَع كل الملفات.
2) من Settings > Pages اختر "Deploy from a branch" وحدد الفرع main والمجلّد root.
3) سيظهر رابط عام للموقع بلاحقة github.io.

## نشر رسمي على نطاق الشركة
- سلّم الملفات إلى قسم الحاسبة الإلكترونية لرفعها على نطاق فرعي مثل: app.iic.mof.gov.iq مع تفعيل HTTPS.
- تأكد من تفعيل نوع الملف webmanifest على الخادم (MIME: application/manifest+json).

## تضمين الاستمارة
- افتح Google Forms الرسمية > Send > <> Embed > انسخ iframe إلى صفحة index.html (قسم الاستمارات) أو forms.html منفصلة.
- ضع رابط التضمين داخل app.js في gform.src = 'رابط التضمين...'.

## تعديل الحاسبة
- حدّث جدول RATES في app.js بحسب جميع فئات المركبات المعتمدة.

## إضافة الفروع
- أضف بقية الفروع إلى data/branches.json بالحقول: name, phone, maps, lat, lng.
