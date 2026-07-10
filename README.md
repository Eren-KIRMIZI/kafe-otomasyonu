# Kafe & Restoran Otomasyon Sistemi

Kafeler için geliştirilmiş otomasyon sistemi.

Bu proje; sipariş yönetimi, masa takibi, QR menü, stok kontrolü, rol bazlı kullanıcı sistemi ve finansal raporlama gibi işletmelerin günlük operasyonlarını tek bir platform üzerinden yönetebilmesini sağlar.

---

## Ekran Görüntüleri

### Giriş

<p align="center">
  <img src="https://github.com/user-attachments/assets/4b5ef340-ddad-408b-bf12-5c2be2347cde" width="550">
</p>

### Yönetim Paneli

<img src="https://github.com/user-attachments/assets/41be27cf-481b-4050-9b6d-9157e98c27f9">

###

<img src="https://github.com/user-attachments/assets/e36ab2d1-3363-4a39-837e-1f144cbebd8a">

<img src="https://github.com/user-attachments/assets/3ad6a4bd-53bf-450d-a967-24d77c286689">

### 
<img src="https://github.com/user-attachments/assets/056da624-ddfb-4902-9b29-0d6c05e4afce">

<img src="https://github.com/user-attachments/assets/0b49d50c-c193-4101-b74c-e81be9bb519d">

###

<img src="https://github.com/user-attachments/assets/86073195-2c04-4c2d-8083-919c9b21b0fe">

### 

<img src="https://github.com/user-attachments/assets/c8a95367-4ca6-4539-bcad-ef17820e0052">

<img src="https://github.com/user-attachments/assets/d858ef90-a591-459c-91cb-c530ec37b9f4">

### 

<img src="https://github.com/user-attachments/assets/b8343c20-9e78-4f7f-8076-70ef2859ec89">

<img src="https://github.com/user-attachments/assets/b0aedac6-4c95-4f42-8e32-d96c66085614">

###

<img src="https://github.com/user-attachments/assets/c8b65a74-4e8a-4174-b73b-2b40fa58cd36">

<img src="https://github.com/user-attachments/assets/45e7b5dc-4662-4888-974f-a181ea2432be">

###

<img src="https://github.com/user-attachments/assets/5d55d4da-62ac-4f36-be3c-1f4741dd9aa1">

<img src="https://github.com/user-attachments/assets/e85835c8-f73d-4b31-bce8-99ce53dfbd7b">

<img src="https://github.com/user-attachments/assets/ba263249-deec-49de-b8c7-f3a38c762e63">

---

# Özellikler

## Sipariş Yönetimi

- Masa bazlı sipariş oluşturma
- Sipariş güncelleme
- Adisyon yönetimi
- Hesap kapatma
- Sipariş durumu takibi
- Garson sipariş ekranı
- Mutfak sipariş ekranı
- Barista sipariş ekranı

---

## QR Menü

Müşteriler masalarındaki QR kodu okutarak;

- Menüye erişebilir
- Ürün detaylarını görebilir
- Ürün görsellerini inceleyebilir
- Porsiyon seçebilir
- Ekstra malzeme ekleyebilir
- Fiyatları görüntüleyebilir

---

## Menü Yönetimi

Yönetici panelinden;

- Kategori oluşturma
- Ürün ekleme
- Ürün silme
- Ürün güncelleme
- Ürün görseli ekleme
- Fiyat düzenleme
- Ürün durumunu değiştirme

işlemleri gerçekleştirilebilir.

---

## Dinamik Ürün Özelleştirme

Her ürün;

- Boy seçeneği
- Ekstra malzemeler
- Çoklu seçenek grupları
- Farklı fiyatlandırmalar

ile tamamen özelleştirilebilir.

Örnek:

**Burger**

- Double Patty
- Ekstra Peynir
- Soğan Halkası
- Jalapeno
- Bacon

**Kahve**

- Small
- Medium
- Large
- Yulaf Sütü
- Laktozsuz Süt
- Extra Shot

---

## Masa Yönetimi

- Masa oluşturma
- Masa silme
- Masa durumları
- Dolu / Boş takibi
- Sipariş geçmişi

---

## Stok Takibi

Sistem satılan ürünlerin içeriklerine göre temel stok düşümü yapmaktadır.

Örneğin;

Bir Cheeseburger satıldığında;

- Burger Ekmeği
- Köfte
- Peynir
- Marul

stoklarından otomatik olarak düşülmektedir.

---

## Finans

Yönetici panelinden;

- Günlük ciro
- Haftalık ciro
- Aylık ciro
- Toplam satış
- En çok satan ürünler
- Sipariş istatistikleri

takip edilebilir.

---

## Personel Yönetimi

Desteklenen roller;

- Admin
- Kasiyer
- Garson
- Mutfak
- Barista

Her rol yalnızca kendi yetkisine ait ekranları görüntüleyebilir.

---

# Kullanılan Teknolojiler

| Teknoloji | Açıklama |
|-----------|----------|
| Next.js 16 | App Router |
| React 19 | Kullanıcı Arayüzü |
| TypeScript | Tip Güvenliği |
| Tailwind CSS | Arayüz Tasarımı |
| Prisma ORM | Veritabanı |
| PostgreSQL | Veritabanı |
| NextAuth.js | Kimlik Doğrulama |

---

# Proje Yapısı

```
src
│
├── app
│   ├── api
│   ├── dashboard
│   ├── login
│   └── menu
│
├── components
│   ├── dashboard
│   ├── menu
│   ├── orders
│   └── ui
│
├── lib
│
├── hooks
│
├── types
│
└── prisma
```

---

# Kurulum

## 1. Projeyi Klonlayın

```bash
git clone https://github.com/kullanici/proje.git

cd proje
```

---

## 2. Bağımlılıkları Kurun

```bash
npm install
```

---

## 3. .env Dosyasını Oluşturun

```env
DATABASE_URL="postgresql://kullanici:sifre@localhost:5432/kafe"

NEXTAUTH_SECRET="secret"

NEXTAUTH_URL="http://localhost:3000"
```

---

## 4. Veritabanını Oluşturun

```bash
npx prisma db push
```

---

## 5. Örnek Verileri Yükleyin

```bash
npx tsx prisma/seed.ts
```

---

## 6. Uygulamayı Başlatın

```bash
npm run dev
```

Tarayıcıdan;

```
http://localhost:3000
```

adresine giderek uygulamayı çalıştırabilirsiniz.

---

# Test Hesapları

| Rol | E-posta | Şifre |
|------|----------|--------|
| Admin | admin@kafe.com | admin123 |
| Kasiyer | kasiyer@kafe.com | kasiyer123 |
| Garson | garson@kafe.com | garson123 |
| Mutfak | mutfak@kafe.com | mutfak123 |
| Barista | barista@kafe.com | barista123 |

---

# Rol Bazlı Yetkilendirme

### Admin

- Tam yetki
- Finans
- Personel
- Menü
- Stok
- Raporlama

### Kasiyer

- Hesap alma
- Adisyon
- Masa kapatma

### Garson

- Sipariş oluşturma
- Sipariş düzenleme
- Masa yönetimi

### Mutfak

- Yemek siparişleri
- Hazır durumuna getirme

### Barista

- İçecek siparişleri
- Hazırlama süreci

---

# Güvenlik

- NextAuth Authentication
- Rol Bazlı Yetkilendirme
- Protected Routes
- Server Actions
- Prisma ORM
- TypeScript
---
