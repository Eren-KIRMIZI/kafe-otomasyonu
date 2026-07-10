# Kafe ve Restoran Otomasyon Sistemi

Bu proje, kafeler icin gelistirilmis kapsamli, modern ve hizli bir otomasyon sistemidir. Siparis yonetimi, stok takibi, musteri QR menusu ve detayli finansal raporlama gibi isletmelerin temel ihtiyaclarini tek bir platformda toplar. Sistem tamamen rol bazli calisir ve her personelin yalnizca kendi goreviyle ilgili ekranlari gormesini saglar.

---

<img width="550" height="486" alt="k0" src="https://github.com/user-attachments/assets/4b5ef340-ddad-408b-bf12-5c2be2347cde" />

<img width="1055" height="586" alt="k1" src="https://github.com/user-attachments/assets/41be27cf-481b-4050-9b6d-9157e98c27f9" />

<img width="1073" height="559" alt="k2" src="https://github.com/user-attachments/assets/e36ab2d1-3363-4a39-837e-1f144cbebd8a" />

<img width="1076" height="568" alt="k3" src="https://github.com/user-attachments/assets/3ad6a4bd-53bf-450d-a967-24d77c286689" />

<img width="1034" height="557" alt="k4" src="https://github.com/user-attachments/assets/056da624-ddfb-4902-9b29-0d6c05e4afce" />

<img width="1093" height="487" alt="k5" src="https://github.com/user-attachments/assets/0b49d50c-c193-4101-b74c-e81be9bb519d" />

<img width="1047" height="551" alt="k6" src="https://github.com/user-attachments/assets/86073195-2c04-4c2d-8083-919c9b21b0fe" />

<img width="1350" height="625" alt="k7" src="https://github.com/user-attachments/assets/c8a95367-4ca6-4539-bcad-ef17820e0052" />

<img width="1045" height="556" alt="k8" src="https://github.com/user-attachments/assets/d858ef90-a591-459c-91cb-c530ec37b9f4" />

<img width="1043" height="554" alt="k9" src="https://github.com/user-attachments/assets/b8343c20-9e78-4f7f-8076-70ef2859ec89" />

<img width="984" height="536" alt="k10" src="https://github.com/user-attachments/assets/b0aedac6-4c95-4f42-8e32-d96c66085614" />

<img width="1046" height="363" alt="k11" src="https://github.com/user-attachments/assets/c8b65a74-4e8a-4174-b73b-2b40fa58cd36" />

<img width="1025" height="414" alt="k12" src="https://github.com/user-attachments/assets/45e7b5dc-4662-4888-974f-a181ea2432be" />

<img width="1020" height="476" alt="k13" src="https://github.com/user-attachments/assets/5d55d4da-62ac-4f36-be3c-1f4741dd9aa1" />

<img width="1346" height="621" alt="k14" src="https://github.com/user-attachments/assets/e85835c8-f73d-4b31-bce8-99ce53dfbd7b" />

<img width="1331" height="565" alt="k15" src="https://github.com/user-attachments/assets/ba263249-deec-49de-b8c7-f3a38c762e63" />

---

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
