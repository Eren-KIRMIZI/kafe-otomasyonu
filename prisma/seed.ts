import { PrismaClient, UserRole, OrderStatus, OrderType, ReservationStatus, ShiftStatus } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

// Gercekci urun gorselleri (Unsplash)
const PRODUCT_IMAGES: Record<string, string> = {
  "Turk Kahvesi":  "https://images.unsplash.com/photo-1595928642581-f50f4f3453a5?w=600&q=80",
  "Filtre Kahve": "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80",
  "Espresso":      "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=600&q=80",
  "Cappuccino":    "https://images.unsplash.com/photo-1579992357154-faf4bde95b3d?w=600&q=80",
  "Latte":         "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=600&q=80",
  "Mocha":         "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&q=80",
  "Americano":     "https://images.unsplash.com/photo-1551030173-122aabc4489c?w=600&q=80",
  "Kola":          "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&q=80",
  "Ayran":         "https://images.unsplash.com/photo-1625938146369-adc83368bda7?w=600&q=80",
  "Meyve Suyu":    "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=600&q=80",
  "Smoothie":      "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=600&q=80",
  "Tiramisu":      "https://images.unsplash.com/photo-1571115177098-24edf4194043?w=600&q=80",
  "Cheesecake":    "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&q=80",
  "Brownie":       "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&q=80",
  "Klasik Hamburger": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80",
  "Cheeseburger":     "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600&q=80",
  "Chicken Burger":   "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=600&q=80",
  "Margarita Pizza":  "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&q=80",
  "Karisik Pizza":    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80",
  "Karadeniz Pizza":  "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=80",
  "Serpme Kahvalti":  "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=600&q=80",
  "Menemen":          "https://images.unsplash.com/photo-1542528180-0c79567c66de?w=600&q=80",
  "Simit Tabagi":     "https://images.unsplash.com/photo-1619604108873-1f1dbbe0d9e5?w=600&q=80",
  "Boyrek Tabagi":    "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&q=80",
};

async function main() {
  console.log("Seed başlatılıyor...");

  // Önce tüm eski verileri temizle
  await prisma.activityLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.shift.deleteMany();
  await prisma.staff.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.customerFavorite.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.inventoryMovement.deleteMany();
  await prisma.inventoryItem.deleteMany();
  await prisma.productExtraItem.deleteMany();
  await prisma.productExtra.deleteMany();
  await prisma.productSize.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.table.deleteMany();
  await prisma.setting.deleteMany();
  await prisma.user.deleteMany();
  await prisma.branch.deleteMany();

  console.log("Eski veriler silindi.");

  const branch = await prisma.branch.create({
    data: {
      name: "Merkez Şube",
      address: "İstanbul, Kadıköy, Bağdat Caddesi No:123",
      phone: "0216 555 0001",
      openingTime: "08:00",
      closingTime: "23:00",
      taxRate: 20,
      serviceFee: 10,
    },
  });

  const admin = await prisma.user.create({
    data: {
      name: "Admin Kullanıcı",
      email: "admin@kafe.com",
      password: hashPassword("admin123"),
      phone: "0555 000 0001",
      role: UserRole.ADMIN,
      branchId: branch.id,
    },
  });

  const cashier = await prisma.user.create({
    data: {
      name: "Ayşe Kasiyer",
      email: "kasiyer@kafe.com",
      password: hashPassword("kasiyer123"),
      phone: "0555 000 0002",
      role: UserRole.CASHIER,
      branchId: branch.id,
    },
  });

  const waiter = await prisma.user.create({
    data: {
      name: "Mehmet Garson",
      email: "garson@kafe.com",
      password: hashPassword("garson123"),
      phone: "0555 000 0003",
      role: UserRole.WAITER,
      branchId: branch.id,
    },
  });

  const kitchenStaff = await prisma.user.create({
    data: {
      name: "Ali Mutfak",
      email: "mutfak@kafe.com",
      password: hashPassword("mutfak123"),
      phone: "0555 000 0004",
      role: UserRole.KITCHEN,
      branchId: branch.id,
    },
  });

  const baristaUser = await prisma.user.create({
    data: {
      name: "Zeynep Barista",
      email: "barista@kafe.com",
      password: hashPassword("barista123"),
      phone: "0555 000 0005",
      role: UserRole.BARISTA,
      branchId: branch.id,
    },
  });

  console.log("Kullanicilar olusturuldu");

  // Kategoriler
  const [
    kahveler, sogukIcecekler, tatlilar, _pastalar, kahvalti, hamburgerler, pizzalar
  ] = await Promise.all([
    prisma.category.create({ data: { name: "Kahveler",        description: "Ozenle hazirlanan sicak ve soguk kahveler", sortOrder: 1, isActive: true, branchId: branch.id } }),
    prisma.category.create({ data: { name: "Soguk Icecekler", description: "Serinleten icecekler",                      sortOrder: 2, isActive: true, branchId: branch.id } }),
    prisma.category.create({ data: { name: "Tatlilar",        description: "Lezzetli tatlilar",                          sortOrder: 3, isActive: true, branchId: branch.id } }),
    prisma.category.create({ data: { name: "Pastalar",        description: "Gunluk taze pastalar",                       sortOrder: 4, isActive: true, branchId: branch.id } }),
    prisma.category.create({ data: { name: "Kahvalti",        description: "Zengin kahvalti secenekleri",               sortOrder: 5, isActive: true, branchId: branch.id } }),
    prisma.category.create({ data: { name: "Hamburger",       description: "El yapimi hamburgerler",                    sortOrder: 6, isActive: true, branchId: branch.id } }),
    prisma.category.create({ data: { name: "Pizza",           description: "Tas firin pizzalar",                        sortOrder: 7, isActive: true, branchId: branch.id } }),
  ]);

  console.log("Kategoriler olusturuldu");

  // Ürün Ekstraları (Tüm şubede ortak)
  const [extraYulafSutu, extraTamYagliSut, extraFindikSurubu, extraVanilya, extraEkSeker, extraBuzlu, extraCikolataTozu] = await Promise.all([
    prisma.productExtra.create({ data: { name: "Yulaf Sütü", price: 15, isActive: true, branchId: branch.id } }),
    prisma.productExtra.create({ data: { name: "Tam Yağlı Süt", price: 0, isActive: true, branchId: branch.id } }),
    prisma.productExtra.create({ data: { name: "Fındık Şurubu", price: 10, isActive: true, branchId: branch.id } }),
    prisma.productExtra.create({ data: { name: "Vanilya Şurubu", price: 10, isActive: true, branchId: branch.id } }),
    prisma.productExtra.create({ data: { name: "Ekstra Şeker", price: 0, isActive: true, branchId: branch.id } }),
    prisma.productExtra.create({ data: { name: "Buzlu Servis", price: 0, isActive: true, branchId: branch.id } }),
    prisma.productExtra.create({ data: { name: "Çikolata Tozu", price: 5, isActive: true, branchId: branch.id } }),
  ]);

  const burgerExtras = await Promise.all([
    prisma.productExtra.create({ data: { name: "Ekstra Peynir", price: 20, isActive: true, branchId: branch.id } }),
    prisma.productExtra.create({ data: { name: "Jalapeno", price: 10, isActive: true, branchId: branch.id } }),
    prisma.productExtra.create({ data: { name: "Ekstra Et", price: 40, isActive: true, branchId: branch.id } }),
    prisma.productExtra.create({ data: { name: "Glütensiz Ekmek", price: 15, isActive: true, branchId: branch.id } }),
  ]);

  const pizzaExtras = await Promise.all([
    prisma.productExtra.create({ data: { name: "Ekstra Mozarella", price: 25, isActive: true, branchId: branch.id } }),
    prisma.productExtra.create({ data: { name: "Ekstra Sucuk", price: 30, isActive: true, branchId: branch.id } }),
    prisma.productExtra.create({ data: { name: "Mantar Ekle", price: 15, isActive: true, branchId: branch.id } }),
  ]);

  console.log("Ekstralar olusturuldu");

  // Ürünleri oluştur - boyut ve ekstra bilgileriyle
  async function createProduct(data: {
    name: string;
    description: string;
    price: number;
    categoryId: string;
    isFood: boolean;
    isBeverage: boolean;
    preparationTime: number;
    sizes?: { name: string; priceModifier: number }[];
    extraIds?: string[];
  }) {
    const product = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        imageUrl: PRODUCT_IMAGES[data.name] || null,
        categoryId: data.categoryId,
        branchId: branch.id,
        isActive: true,
        isFood: data.isFood,
        isBeverage: data.isBeverage,
        preparationTime: data.preparationTime,
      },
    });

    if (data.sizes) {
      await Promise.all(
        data.sizes.map((s) =>
          prisma.productSize.create({ data: { productId: product.id, name: s.name, priceModifier: s.priceModifier } })
        )
      );
    }

    if (data.extraIds) {
      await Promise.all(
        data.extraIds.map((extraId) =>
          prisma.productExtraItem.create({ data: { productId: product.id, extraId } })
        )
      );
    }

    return product;
  }

  const coffeeExtras = [extraYulafSutu.id, extraTamYagliSut.id, extraFindikSurubu.id, extraVanilya.id, extraEkSeker.id, extraCikolataTozu.id];
  const coldExtras = [extraBuzlu.id, extraEkSeker.id];

  const [
    turkKahvesi, filtreKahve, espresso, cappuccino, latte, mocha, americano,
    kola, ayran, meyvesuyu, smoothie,
    tiramisu, cheesecake, brownie,
    klasikBurger, cheeseBurger, chickenBurger,
    margaritaPizza, karisikPizza, karadenizPizza,
    // Kahvalti
    serpeKahvalti, menemen, simitTabagi, boyrekTabagi,
  ] = await Promise.all([
    // Kahveler
    createProduct({ name: "Turk Kahvesi", description: "Geleneksel Turk kahvesi, istenilen sekerde", price: 80, categoryId: kahveler.id, isFood: false, isBeverage: true, preparationTime: 10, sizes: [{ name: "Tek", priceModifier: 0 }, { name: "Cift", priceModifier: 20 }], extraIds: [extraEkSeker.id, extraVanilya.id] }),
    createProduct({ name: "Filtre Kahve", description: "Ozel cekirdeklerden filtre kahve", price: 100, categoryId: kahveler.id, isFood: false, isBeverage: true, preparationTime: 5, sizes: [{ name: "Kucuk (S)", priceModifier: 0 }, { name: "Orta (M)", priceModifier: 20 }, { name: "Buyuk (L)", priceModifier: 35 }], extraIds: coffeeExtras }),
    createProduct({ name: "Espresso", description: "Yogun ve aromatik double shot espresso", price: 90, categoryId: kahveler.id, isFood: false, isBeverage: true, preparationTime: 3, sizes: [{ name: "Single", priceModifier: 0 }, { name: "Double", priceModifier: 15 }], extraIds: [extraEkSeker.id] }),
    createProduct({ name: "Cappuccino", description: "Espresso, buharda isitilmis sut ve kopuk", price: 110, categoryId: kahveler.id, isFood: false, isBeverage: true, preparationTime: 5, sizes: [{ name: "Kucuk (S)", priceModifier: 0 }, { name: "Orta (M)", priceModifier: 20 }, { name: "Buyuk (L)", priceModifier: 35 }], extraIds: coffeeExtras }),
    createProduct({ name: "Latte", description: "Kremsi sutlu latte, kadifemsi kopuk ile", price: 110, categoryId: kahveler.id, isFood: false, isBeverage: true, preparationTime: 5, sizes: [{ name: "Kucuk (S)", priceModifier: 0 }, { name: "Orta (M)", priceModifier: 20 }, { name: "Buyuk (L)", priceModifier: 35 }], extraIds: coffeeExtras }),
    createProduct({ name: "Mocha", description: "Espresso, cikolata sosu ve sutlu kopuk", price: 120, categoryId: kahveler.id, isFood: false, isBeverage: true, preparationTime: 7, sizes: [{ name: "Orta (M)", priceModifier: 0 }, { name: "Buyuk (L)", priceModifier: 20 }], extraIds: coffeeExtras }),
    createProduct({ name: "Americano", description: "Espresso ve sicak su ile hazirlanan Americano", price: 85, categoryId: kahveler.id, isFood: false, isBeverage: true, preparationTime: 4, sizes: [{ name: "Kucuk (S)", priceModifier: 0 }, { name: "Orta (M)", priceModifier: 15 }, { name: "Buyuk (L)", priceModifier: 25 }], extraIds: [extraEkSeker.id, extraBuzlu.id] }),
    // Soguk icecekler
    createProduct({ name: "Kola", description: "Coca-Cola 330ml", price: 50, categoryId: sogukIcecekler.id, isFood: false, isBeverage: true, preparationTime: 1, sizes: [{ name: "Kucuk (330ml)", priceModifier: 0 }, { name: "Buyuk (500ml)", priceModifier: 20 }] }),
    createProduct({ name: "Ayran", description: "Ev yapimi taze ayran", price: 40, categoryId: sogukIcecekler.id, isFood: false, isBeverage: true, preparationTime: 1 }),
    createProduct({ name: "Meyve Suyu", description: "Portakal veya karisik taze sikilmis", price: 60, categoryId: sogukIcecekler.id, isFood: false, isBeverage: true, preparationTime: 2, sizes: [{ name: "Kucuk (250ml)", priceModifier: 0 }, { name: "Buyuk (500ml)", priceModifier: 25 }] }),
    createProduct({ name: "Smoothie", description: "Gunun taze meyve smoothie'si", price: 90, categoryId: sogukIcecekler.id, isFood: false, isBeverage: true, preparationTime: 5, extraIds: coldExtras }),
    // Tatlilar
    createProduct({ name: "Tiramisu", description: "Italyan tarifi otantik tiramisu, mascarpone kremali", price: 120, categoryId: tatlilar.id, isFood: true, isBeverage: false, preparationTime: 2 }),
    createProduct({ name: "Cheesecake", description: "New York usulu cheesecake, cilek soslu", price: 130, categoryId: tatlilar.id, isFood: true, isBeverage: false, preparationTime: 2 }),
    createProduct({ name: "Brownie", description: "Sicak cikolatali brownie, dondurma ile", price: 100, categoryId: tatlilar.id, isFood: true, isBeverage: false, preparationTime: 3 }),
    // Hamburger
    createProduct({ name: "Klasik Hamburger", description: "180gr dana eti, marul, domates, ozel sos", price: 180, categoryId: hamburgerler.id, isFood: true, isBeverage: false, preparationTime: 15, sizes: [{ name: "Normal", priceModifier: 0 }, { name: "Double Patty", priceModifier: 60 }], extraIds: burgerExtras.map(e => e.id) }),
    createProduct({ name: "Cheeseburger", description: "Dana eti, cheddar peyniri, tursu, sarimsak mayo", price: 200, categoryId: hamburgerler.id, isFood: true, isBeverage: false, preparationTime: 15, sizes: [{ name: "Normal", priceModifier: 0 }, { name: "Double Patty", priceModifier: 60 }], extraIds: burgerExtras.map(e => e.id) }),
    createProduct({ name: "Chicken Burger", description: "Izgara tavuk gogsu, coleslaw, tatli biber sosu", price: 160, categoryId: hamburgerler.id, isFood: true, isBeverage: false, preparationTime: 12, extraIds: burgerExtras.map(e => e.id) }),
    // Pizza
    createProduct({ name: "Margarita Pizza", description: "San Marzano domates, taze mozzarella, feslagen", price: 200, categoryId: pizzalar.id, isFood: true, isBeverage: false, preparationTime: 20, sizes: [{ name: "26cm", priceModifier: 0 }, { name: "33cm", priceModifier: 50 }], extraIds: pizzaExtras.map(e => e.id) }),
    createProduct({ name: "Karisik Pizza", description: "Sucuk, tavuk, mantar, biber, mozzarella", price: 240, categoryId: pizzalar.id, isFood: true, isBeverage: false, preparationTime: 20, sizes: [{ name: "26cm", priceModifier: 0 }, { name: "33cm", priceModifier: 50 }], extraIds: pizzaExtras.map(e => e.id) }),
    createProduct({ name: "Karadeniz Pizza", description: "Hamsi, misir, sarimsak, yesil biber", price: 230, categoryId: pizzalar.id, isFood: true, isBeverage: false, preparationTime: 20, sizes: [{ name: "26cm", priceModifier: 0 }, { name: "33cm", priceModifier: 50 }], extraIds: pizzaExtras.map(e => e.id) }),
    // Kahvalti (onceden bos birakilmisti)
    createProduct({ name: "Serpme Kahvalti", description: "2 kisilik zengin serpme kahvalti tabagi", price: 350, categoryId: kahvalti.id, isFood: true, isBeverage: false, preparationTime: 15 }),
    createProduct({ name: "Menemen", description: "Taze domates, biber ve yumurta ile menemen", price: 95, categoryId: kahvalti.id, isFood: true, isBeverage: false, preparationTime: 10 }),
    createProduct({ name: "Simit Tabagi", description: "Simit, beyaz peynir, zeytin ve recel ile", price: 80, categoryId: kahvalti.id, isFood: true, isBeverage: false, preparationTime: 5 }),
    createProduct({ name: "Boyrek Tabagi", description: "Sigara boregi, su boregi ve gomlek boregi cesitleri", price: 110, categoryId: kahvalti.id, isFood: true, isBeverage: false, preparationTime: 5 }),
  ]);


  console.log("Urunler olusturuldu");

  // Masalar
  const tables: any[] = [];
  for (let i = 1; i <= 12; i++) {
    const table = await prisma.table.create({
      data: {
        number: i,
        capacity: i <= 4 ? 2 : i <= 8 ? 4 : 6,
        status: "EMPTY",
        branchId: branch.id,
        x: ((i - 1) % 4) * 150,
        y: Math.floor((i - 1) / 4) * 150,
        floor: i <= 4 ? 1 : i <= 8 ? 2 : 3,
      },
    });
    tables.push(table);
  }

  console.log("Masalar olusturuldu");

  // Örnek Siparişler (Mutfak ve Barista için)
  const now = new Date();

  // Sipariş 1: Masa 3 - Aktif, hazırlanıyor (kahve + yiyecek)
  const order1 = await prisma.order.create({
    data: {
      tableId: tables[2].id, // Masa 3
      branchId: branch.id,
      waiterId: waiter.id,
      status: OrderStatus.PREPARING,
      orderType: OrderType.DINE_IN,
      customerNote: "Cappuccino'yu yulaf sütü ile yapın",
      totalAmount: 420,
      finalAmount: 420,
      createdAt: new Date(now.getTime() - 8 * 60000),
    },
  });
  await prisma.orderItem.createMany({
    data: [
      { orderId: order1.id, productId: cappuccino.id, quantity: 2, unitPrice: 110, totalPrice: 220, size: "Orta (M)", note: "Yulaf sütü", status: OrderStatus.PREPARING },
      { orderId: order1.id, productId: klasikBurger.id, quantity: 1, unitPrice: 180, totalPrice: 180, note: "İyi pişmiş", status: OrderStatus.PREPARING },
    ],
  });
  await prisma.table.update({ where: { id: tables[2].id }, data: { status: "ORDERED" } });

  // Sipariş 2: Masa 5 - Yeni geldi
  const order2 = await prisma.order.create({
    data: {
      tableId: tables[4].id, // Masa 5
      branchId: branch.id,
      waiterId: waiter.id,
      status: OrderStatus.PENDING,
      orderType: OrderType.DINE_IN,
      totalAmount: 530,
      finalAmount: 530,
      createdAt: new Date(now.getTime() - 2 * 60000),
    },
  });
  await prisma.orderItem.createMany({
    data: [
      { orderId: order2.id, productId: margaritaPizza.id, quantity: 1, unitPrice: 200, totalPrice: 200, size: "33cm", status: OrderStatus.PENDING },
      { orderId: order2.id, productId: latte.id, quantity: 2, unitPrice: 110, totalPrice: 220, size: "Büyük (L)", note: "Şekersiz", status: OrderStatus.PENDING },
      { orderId: order2.id, productId: tiramisu.id, quantity: 1, unitPrice: 120, totalPrice: 120, status: OrderStatus.PENDING },
    ],
  });
  await prisma.table.update({ where: { id: tables[4].id }, data: { status: "ORDERED" } });

  // Sipariş 3: Masa 7 - Hazır, servis bekliyor
  const order3 = await prisma.order.create({
    data: {
      tableId: tables[6].id, // Masa 7
      branchId: branch.id,
      waiterId: waiter.id,
      status: OrderStatus.READY,
      orderType: OrderType.DINE_IN,
      totalAmount: 370,
      finalAmount: 370,
      createdAt: new Date(now.getTime() - 25 * 60000),
    },
  });
  await prisma.orderItem.createMany({
    data: [
      { orderId: order3.id, productId: karisikPizza.id, quantity: 1, unitPrice: 240, totalPrice: 240, size: "26cm", status: OrderStatus.READY },
      { orderId: order3.id, productId: kola.id, quantity: 2, unitPrice: 50, totalPrice: 100, size: "Büyük (500ml)", status: OrderStatus.READY },
    ],
  });
  await prisma.table.update({ where: { id: tables[6].id }, data: { status: "ORDERED" } });

  // Sipariş 4: Paket - Barista için kahve siparişi
  const order4 = await prisma.order.create({
    data: {
      branchId: branch.id,
      waiterId: cashier.id,
      status: OrderStatus.PENDING,
      orderType: OrderType.TAKEAWAY,
      customerNote: "Paket servis",
      totalAmount: 340,
      finalAmount: 340,
      createdAt: new Date(now.getTime() - 1 * 60000),
    },
  });
  await prisma.orderItem.createMany({
    data: [
      { orderId: order4.id, productId: latte.id, quantity: 1, unitPrice: 110, totalPrice: 110, size: "Büyük (L)", note: "Yulaf sütü, şekersiz", status: OrderStatus.PENDING },
      { orderId: order4.id, productId: mocha.id, quantity: 1, unitPrice: 120, totalPrice: 120, size: "Büyük (L)", status: OrderStatus.PENDING },
      { orderId: order4.id, productId: americano.id, quantity: 1, unitPrice: 85, totalPrice: 85, note: "Buzlu", status: OrderStatus.PENDING },
    ],
  });

  // Sipariş 5: Masa 1 - Hesap bekliyor
  const order5 = await prisma.order.create({
    data: {
      tableId: tables[0].id, // Masa 1
      branchId: branch.id,
      waiterId: waiter.id,
      status: OrderStatus.SERVED,
      orderType: OrderType.DINE_IN,
      totalAmount: 680,
      finalAmount: 680,
      createdAt: new Date(now.getTime() - 55 * 60000),
    },
  });
  await prisma.orderItem.createMany({
    data: [
      { orderId: order5.id, productId: cheeseBurger.id, quantity: 2, unitPrice: 200, totalPrice: 400, status: OrderStatus.SERVED },
      { orderId: order5.id, productId: cheesecake.id, quantity: 2, unitPrice: 130, totalPrice: 260, status: OrderStatus.SERVED },
    ],
  });
  await prisma.table.update({ where: { id: tables[0].id }, data: { status: "WAITING_BILL" } });

  console.log("Ornek siparisler olusturuldu");

  // Stok
  await Promise.all([
    prisma.inventoryItem.create({ data: { name: "Kahve Çekirdeği", unit: "kg", currentStock: 25, minimumStock: 5, maximumStock: 50, unitCost: 200, supplier: "Kahve Dünyası", supplierPhone: "0212 555 0001", branchId: branch.id } }),
    prisma.inventoryItem.create({ data: { name: "Süt", unit: "lt", currentStock: 40, minimumStock: 10, maximumStock: 80, unitCost: 30, supplier: "Sütaş", supplierPhone: "0212 555 0002", branchId: branch.id } }),
    prisma.inventoryItem.create({ data: { name: "Yulaf Sütü", unit: "lt", currentStock: 3, minimumStock: 5, maximumStock: 20, unitCost: 60, supplier: "Alpro", supplierPhone: "0212 555 0009", branchId: branch.id } }),
    prisma.inventoryItem.create({ data: { name: "Şeker", unit: "kg", currentStock: 15, minimumStock: 5, maximumStock: 30, unitCost: 20, supplier: "Şeker A.Ş.", supplierPhone: "0212 555 0003", branchId: branch.id } }),
    prisma.inventoryItem.create({ data: { name: "Çikolata", unit: "kg", currentStock: 8, minimumStock: 3, maximumStock: 20, unitCost: 80, supplier: "Çikolata Fabrikası", supplierPhone: "0212 555 0004", branchId: branch.id } }),
    prisma.inventoryItem.create({ data: { name: "Un", unit: "kg", currentStock: 30, minimumStock: 10, maximumStock: 50, unitCost: 15, supplier: "Un Fabrikası", supplierPhone: "0212 555 0005", branchId: branch.id } }),
    prisma.inventoryItem.create({ data: { name: "Domates Salçası", unit: "kg", currentStock: 5, minimumStock: 8, maximumStock: 20, unitCost: 25, supplier: "Tarım Kooperatifi", supplierPhone: "0212 555 0006", branchId: branch.id } }),
  ]);

  console.log("Stok olusturuldu");

  // Ayarlar
  await prisma.setting.createMany({
    data: [
      { key: "tax_rate", value: "20", branchId: branch.id },
      { key: "service_fee", value: "10", branchId: branch.id },
      { key: "currency", value: "TRY", branchId: branch.id },
      { key: "theme", value: "dark", branchId: branch.id },
      { key: "wifi_password", value: "kafe2024", branchId: branch.id },
    ],
  });

  // Musteriler
  const [musteriAhmet, musteriFatma, musteriHasan] = await Promise.all([
    prisma.customer.create({ data: { name: "Ahmet Yilmaz",  phone: "0555 111 1111", email: "ahmet@email.com",  loyaltyPoints: 500, totalSpent: 2500, visitCount: 12 } }),
    prisma.customer.create({ data: { name: "Fatma Demir",   phone: "0555 222 2222", email: "fatma@email.com",  loyaltyPoints: 350, totalSpent: 1800, visitCount: 8  } }),
    prisma.customer.create({ data: { name: "Hasan Kaya",    phone: "0555 333 3333", birthDate: new Date("1990-07-15"), loyaltyPoints: 800, totalSpent: 4200, visitCount: 25 } }),
    prisma.customer.create({ data: { name: "Zeynep Arslan", phone: "0555 444 4444", email: "zeynep@email.com", loyaltyPoints: 200, totalSpent: 980,  visitCount: 5  } }),
    prisma.customer.create({ data: { name: "Burak Celik",   phone: "0555 555 5555", email: "burak@email.com",  loyaltyPoints: 650, totalSpent: 3100, visitCount: 18 } }),
  ]);

  // Rezervasyonlar
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfter = new Date(now);
  dayAfter.setDate(dayAfter.getDate() + 2);

  await Promise.all([
    prisma.reservation.create({
      data: {
        customerId: musteriAhmet.id,
        tableId:    tables[3].id,
        branchId:   branch.id,
        date:       tomorrow,
        time:       "19:00",
        partySize:  4,
        status:     ReservationStatus.CONFIRMED,
        note:       "Dogum gunu kutlamasi, kek getiriyoruz",
      }
    }),
    prisma.reservation.create({
      data: {
        customerId: musteriFatma.id,
        tableId:    tables[7].id,
        branchId:   branch.id,
        date:       tomorrow,
        time:       "12:30",
        partySize:  2,
        status:     ReservationStatus.CONFIRMED,
      }
    }),
    prisma.reservation.create({
      data: {
        customerId: musteriHasan.id,
        branchId:   branch.id,
        date:       dayAfter,
        time:       "20:00",
        partySize:  6,
        status:     ReservationStatus.PENDING,
        note:       "Is yemegi, sessiz bir masa tercih edilir",
      }
    }),
    prisma.reservation.create({
      data: {
        customerId: musteriAhmet.id,
        branchId:   branch.id,
        date:       new Date(now.getTime() - 24 * 60 * 60 * 1000), // dun
        time:       "13:00",
        partySize:  2,
        status:     ReservationStatus.COMPLETED,
      }
    }),
  ]);

  console.log("Rezervasyonlar olusturuldu.");

  // Personel (Staff) kayitlari
  const [staffGarson, staffBarista, staffMutfak] = await Promise.all([
    prisma.staff.create({
      data: {
        userId:     waiter.id,
        branchId:   branch.id,
        hourlyRate: 120,
        startDate:  new Date("2025-01-15"),
        isActive:   true,
      }
    }),
    prisma.staff.create({
      data: {
        userId:     baristaUser.id,
        branchId:   branch.id,
        hourlyRate: 130,
        startDate:  new Date("2025-03-01"),
        isActive:   true,
      }
    }),
    prisma.staff.create({
      data: {
        userId:     kitchenStaff.id,
        branchId:   branch.id,
        hourlyRate: 140,
        startDate:  new Date("2024-11-01"),
        isActive:   true,
      }
    }),
  ]);

  // Vardiyalar (Shift)
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  await Promise.all([
    // Bugunun vardiyalari
    prisma.shift.create({ data: { staffId: staffGarson.id,  date: today, startTime: "09:00", endTime: "17:00", status: ShiftStatus.IN_PROGRESS } }),
    prisma.shift.create({ data: { staffId: staffBarista.id, date: today, startTime: "10:00", endTime: "18:00", status: ShiftStatus.IN_PROGRESS } }),
    prisma.shift.create({ data: { staffId: staffMutfak.id,  date: today, startTime: "11:00", endTime: "22:00", status: ShiftStatus.SCHEDULED   } }),
    // Dunun tamamlanmis vardiyalari
    prisma.shift.create({ data: { staffId: staffGarson.id,  date: yesterday, startTime: "09:00", endTime: "17:00", status: ShiftStatus.COMPLETED } }),
    prisma.shift.create({ data: { staffId: staffBarista.id, date: yesterday, startTime: "10:00", endTime: "18:00", status: ShiftStatus.COMPLETED } }),
    // Yarin icin planli
    prisma.shift.create({ data: { staffId: staffGarson.id,  date: tomorrow, startTime: "09:00", endTime: "17:00", status: ShiftStatus.SCHEDULED } }),
    prisma.shift.create({ data: { staffId: staffMutfak.id,  date: tomorrow, startTime: "11:00", endTime: "22:00", status: ShiftStatus.SCHEDULED } }),
  ]);

  console.log("Personel ve vardiyalar olusturuldu.");

  // Kuponlar
  await prisma.coupon.createMany({
    data: [
      { code: "HOSGELDIN10", discountType: "PERCENTAGE", discountValue: 10, minOrderAmount: 100, maxUsage: 100, currentUsage: 12, expiresAt: new Date("2026-12-31"), isActive: true, branchId: branch.id },
      { code: "50TLINDIRIM", discountType: "FIXED", discountValue: 50, minOrderAmount: 200, maxUsage: 50, currentUsage: 5, expiresAt: new Date("2026-12-31"), isActive: true, branchId: branch.id },
    ],
  });

  console.log("Seed tamamlandi!");
  console.log("\nGiris Bilgileri:");
  console.log("Admin:     admin@kafe.com / admin123");
  console.log("Kasiyer:   kasiyer@kafe.com / kasiyer123");
  console.log("Garson:    garson@kafe.com / garson123");
  console.log("Mutfak:    mutfak@kafe.com / mutfak123");
  console.log("Barista:   barista@kafe.com / barista123");
}

main()
  .catch((e) => {
    console.error("Seed hatasi:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
