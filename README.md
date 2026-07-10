# Kafe ve Restoran Otomasyon Sistemi

Bu proje, kafeler icin gelistirilmis kapsamli, modern ve hizli bir otomasyon sistemidir. Siparis yonetimi, stok takibi, musteri QR menusu ve detayli finansal raporlama gibi isletmelerin temel ihtiyaclarini tek bir platformda toplar. Sistem tamamen rol bazli calisir ve her personelin yalnizca kendi goreviyle ilgili ekranlari gormesini saglar.

## Mimari ve Teknolojiler

Sistem modern web teknolojileri uzerine insa edilmistir:

* Next.js 16 (App Router): Sunucu tarafli render (SSR) destegi, hizli sayfa yuklemeleri ve gelismis route yonetimi icin kullanildi.
* React 19: Etkilesimli kullanici arayuzleri icin guncel React surumu.
* TypeScript: Gelistirme asamasinda hata riskini en aza indiren statik tip guvenligi.
* Tailwind CSS: Sifirdan tasarlanmis, modern ve esnek bir dark tema arayuzu. (Sistem tamamen dark mode uzerine kurgulanmistir).
* Prisma ORM: Veritabani iletisimi, sema yonetimi ve iliskisel veri dogrulugu.
* NextAuth.js: Rol bazli oturum acma ve guvenli kimlik dogrulama sistemi.

## Rol Bazli Moduller

Otomasyon sistemi bes farkli temel rol uzerinden calisir:

1. Yonetici (Admin): Sistemin tam kontrolune sahiptir. Ciro raporlarini gorebilir, menuye urun ekleyip cikarabilir, personel ve stok yonetimini yapabilir.
2. Kasiyer: Guncel siparisleri takip eder, hesap alir, adisyon keser ve masalari kapatir.
3. Garson: Kendi yetki alanindaki masalarin siparislerini alir, yeni siparisleri sisteme girer ve mutfaga iletir.
4. Mutfak: Yiyecek siparislerini (hamburger, pizza vb.) ekraninda gorur. Hazirlanan urunleri "Hazir" konumuna getirir.
5. Barista: Sadece icecek siparislerini (kahve, smoothie vb.) gorur ve icecek hazirligini yonetir.

## Ozel Moduller

* QR Menu Entegrasyonu: Musteriler masalarinda bulunan QR kodlari okutarak kendi telefonlarindan detayli menuyu gorebilir. Bu menude urun detaylari, fotograflar, porsiyon secenekleri ve malzemeler (ekstralar) acikca secilebilir durumdadir.
* Dinamik Urun Ozellestirme: Urunler sadece isim ve fiyattan ibaret degildir. Burgerler icin "Double Patty" secenegi veya "Ekstra Peynir", kahveler icin "Yulaf Sutu" veya porsiyon (S/M/L) secenekleri eklenebilir.
* Stok Takibi (Ozet): Satilan urunlerin icerigine gore temel stok dusumleri (gelecek guncellemeler ile detaylandirilacaktir).

## Kurulum ve Calistirma

Projenin yerel ortamda (local) calistirilmasi icin Node.js v18.17 veya uzeri bir surumun kurulu olmasi gerekmektedir. Veritabani olarak PostgreSQL kullanilmistir.

### 1. Bagimliliklarin Yuklenmesi

Terminali acin ve proje dizinine gidin, ardindan paketleri yukleyin:

```bash
npm install
```

### 2. Ortam Degiskenleri Ayarlari

Projenin ana dizininde ".env" isimli bir dosya olusturun ve asagidaki bilgileri kendi veritabani ayarlariniza gore doldurun:

```env
DATABASE_URL="postgresql://kullanici_adi:sifre@localhost:5432/kafe_otomasyonu"
NEXTAUTH_SECRET="guvenli-ve-karma-bir-sifreleme-metni"
NEXTAUTH_URL="http://localhost:3000"
```
Not: Gelistirme ortaminda eger yerel PostgreSQL kurmak istemiyorsaniz, test amacli SQLite veya Docker uzerinden bir PostgreSQL konteyneri calistirabilirsiniz. Ancak Prisma semasi PostgreSQL'e gore optimize edilmistir.

### 3. Veritabaninin Hazirlanmasi

Veritabani tablolarini olusturmak ve senkronize etmek icin:

```bash
npx prisma db push
```

### 4. Ornek Verilerin (Seed) Yuklenmesi

Sistemin bos acilmamasi icin hazirlanmis ornek menuler, masalar, musteriler ve test hesaplari vardir. Bu verileri veritabanina yazmak icin:

```bash
npx tsx prisma/seed.ts
```
Bu islem birkac saniye surebilir. Tamamlandiginda terminalde "Kategoriler olusturuldu", "Urunler olusturuldu" gibi basari mesajlari goreceksiniz.

### 5. Projenin Baslatilmasi

Gelistirme sunucusunu calistirmak icin:

```bash
npm run dev
```

Sunucu basariyla ayaga kalktiginda tarayicinizdan http://localhost:3000 adresine giderek uygulamayi goruntuleyebilirsiniz.

## Test Kullanicilari

Seed komutunu calistirdiktan sonra sisteme asagidaki bilgilerle giris yapabilirsiniz:

* Yonetici (Admin): admin@kafe.com / admin123
* Kasiyer: kasiyer@kafe.com / kasiyer123
* Garson: garson@kafe.com / garson123
* Mutfak: mutfak@kafe.com / mutfak123
* Barista: barista@kafe.com / barista123

## Proje Klasor Yapisi

* src/app/ : Yonlendirmeler (routes) ve API endpoint'leri burada yer alir.
* src/components/ : Arayuz bilesenleri. 'ui' klasoru genel bilesenleri, 'dashboard', 'orders', 'menu' gibi klasorler ise sayfalara ozel yapilari icerir.
* src/lib/ : Veritabani baglantilari (prisma.ts) ve formatlama araclari (utils.ts) bulunur.
* prisma/ : Veritabani semasi ve seed dosyalari.
* public/ : Statik gorseller ve fontlar.