// Script tạo 100 sản phẩm đa dạng cho website UTH Shoes
const products = [];

// Danh sách categories
const categories = [
  { name: 'Giày thể thao', description: 'Giày thể thao nam nữ đa dạng mẫu mã' },
  { name: 'Giày chạy bộ', description: 'Giày chạy bộ chuyên nghiệp' },
  { name: 'Giày đá banh', description: 'Giày đá banh chính hãng' },
  { name: 'Giày tây', description: 'Giày tây công sở nam' },
  { name: 'Dép', description: 'Dép nam nữ thoải mái' },
  { name: 'Giày búp bê', description: 'Giày búp bê nữ đẹp' },
  { name: 'Giày cao gót', description: 'Giày cao gót nữ thanh lịch' },
  { name: 'Giày lười', description: 'Giày lười nam nữ thoải mái' },
  { name: 'Giày boot', description: 'Giày boot nam nữ thời trang' },
  { name: 'Giày sandal', description: 'Giày sandal nữ mùa hè' }
];

// Danh sách brands
const brands = [
  { name: 'UTH Shoes', description: 'Thương hiệu giày Việt Nam chất lượng cao' },
  { name: 'UTH Sport', description: 'Thương hiệu giày thể thao chuyên nghiệp' },
  { name: 'UTH Fashion', description: 'Thương hiệu giày thời trang cao cấp' },
  { name: 'UTH Kids', description: 'Thương hiệu giày trẻ em an toàn' }
];

// Danh sách màu sắc
const colors = [
  { name: 'Đen', code: 'BLACK' },
  { name: 'Trắng', code: 'WHITE' },
  { name: 'Xanh dương', code: 'BLUE' },
  { name: 'Đỏ', code: 'RED' },
  { name: 'Xanh lá', code: 'GREEN' },
  { name: 'Vàng', code: 'YELLOW' },
  { name: 'Hồng', code: 'PINK' },
  { name: 'Nâu', code: 'BROWN' },
  { name: 'Xám', code: 'GRAY' },
  { name: 'Tím', code: 'PURPLE' }
];

// Danh sách sizes
const sizes = ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45'];

// Danh sách features
const features = [
  'Phần upper gồm da tổng hợp phủ mịn và lưới mesh',
  'Thiết kế cổ thấp basic, form ôm vừa chân',
  'Đế IP siêu nhẹ, có rãnh chống trượt',
  'Hỗ trợ di chuyển linh hoạt',
  'Công nghệ đệm đế tiên tiến',
  'Chất liệu cao cấp, bền bỉ',
  'Thiết kế thời trang, dễ phối đồ',
  'Phù hợp cho mọi lứa tuổi',
  'Đế cao su chống trượt',
  'Lót trong mềm mại, thoáng khí'
];

// Danh sách benefits
const benefits = [
  'Cam kết chính hãng UTH Shoes 100%',
  'Bảo hành 03 tháng',
  'Đổi size trong vòng 7 ngày',
  'Đổi trả hàng trong vòng 7 ngày',
  'Free ship đơn hàng 1.5 Triệu',
  'Hỗ trợ giao hàng 2h khi chọn Grab',
  'Tư vấn chọn size miễn phí',
  'Hỗ trợ thanh toán trả góp 0%',
  'Tích điểm thưởng cho mỗi đơn hàng',
  'Chăm sóc khách hàng 24/7'
];

// Hàm tạo tên file ảnh
function generateImageName(productName, color, type) {
  const cleanName = productName
    .toLowerCase()
    .replace(/[đ]/g, 'd')
    .replace(/[ăâ]/g, 'a')
    .replace(/[ê]/g, 'e')
    .replace(/[ôơ]/g, 'o')
    .replace(/[ư]/g, 'u')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-');
  
  const cleanColor = color.toLowerCase().replace(/[đ]/g, 'd');
  
  return `${cleanName}-${cleanColor}-${type}.jpg`;
}

// Hàm tạo sản phẩm
function createProduct(id, name, category, price, originalPrice, discount, description, color) {
  const mainImage = generateImageName(name, color, 'main');
  const sideImage = generateImageName(name, color, 'side');
  const topImage = generateImageName(name, color, 'top');
  const detailImage = generateImageName(name, color, 'detail');
  
  return {
    id: id,
    Name: name,
    MainImage: `/images/products/${mainImage}`,
    Price: price,
    OriginalPrice: originalPrice,
    Discount: discount,
    Category: category,
    Brand: 'UTH Shoes',
    Colors: [color],
    Description: description,
    Features: features.slice(0, 4),
    Benefits: benefits.slice(0, 6),
    Images: [
      `/images/products/${mainImage}`,
      `/images/products/${sideImage}`,
      `/images/products/${topImage}`,
      `/images/products/${detailImage}`
    ]
  };
}

// Tạo danh sách sản phẩm
let productId = 1;

// 1. Giày thể thao (20 sản phẩm)
const sportShoes = [
  'Giày Thể Thao UTH Shoes Helio Teen Nam',
  'Giày Thể Thao UTH Shoes Helio Teen Nữ',
  'Giày Thể Thao UTH Shoes Sport Pro Nam',
  'Giày Thể Thao UTH Shoes Sport Pro Nữ',
  'Giày Thể Thao UTH Shoes Active Nam',
  'Giày Thể Thao UTH Shoes Active Nữ',
  'Giày Thể Thao UTH Shoes Dynamic Nam',
  'Giày Thể Thao UTH Shoes Dynamic Nữ',
  'Giày Thể Thao UTH Shoes Energy Nam',
  'Giày Thể Thao UTH Shoes Energy Nữ',
  'Giày Thể Thao UTH Shoes Power Nam',
  'Giày Thể Thao UTH Shoes Power Nữ',
  'Giày Thể Thao UTH Shoes Speed Nam',
  'Giày Thể Thao UTH Shoes Speed Nữ',
  'Giày Thể Thao UTH Shoes Flex Nam',
  'Giày Thể Thao UTH Shoes Flex Nữ',
  'Giày Thể Thao UTH Shoes Core Nam',
  'Giày Thể Thao UTH Shoes Core Nữ',
  'Giày Thể Thao UTH Shoes Prime Nam',
  'Giày Thể Thao UTH Shoes Prime Nữ'
];

sportShoes.forEach(name => {
  colors.slice(0, 5).forEach(color => {
    const price = Math.floor(Math.random() * 200000) + 500000;
    const originalPrice = Math.floor(price * 1.2);
    const discount = Math.floor(Math.random() * 20) + 10;
    
    products.push(createProduct(
      productId++,
      `${name} Màu ${color.name}`,
      'Giày thể thao',
      price,
      originalPrice,
      discount,
      `${name} với thiết kế hiện đại, phù hợp cho hoạt động thể thao và dạo phố. Màu ${color.name} nổi bật, dễ phối đồ.`,
      color.name
    ));
  });
});

// 2. Giày chạy bộ (15 sản phẩm)
const runningShoes = [
  'Giày Chạy Bộ UTH Shoes Runner Pro',
  'Giày Chạy Bộ UTH Shoes Runner Elite',
  'Giày Chạy Bộ UTH Shoes Runner Max',
  'Giày Chạy Bộ UTH Shoes Runner Light',
  'Giày Chạy Bộ UTH Shoes Runner Comfort',
  'Giày Chạy Bộ UTH Shoes Runner Speed',
  'Giày Chạy Bộ UTH Shoes Runner Trail',
  'Giày Chạy Bộ UTH Shoes Runner Street',
  'Giày Chạy Bộ UTH Shoes Runner Track',
  'Giày Chạy Bộ UTH Shoes Runner Marathon',
  'Giày Chạy Bộ UTH Shoes Runner Sprint',
  'Giày Chạy Bộ UTH Shoes Runner Endurance',
  'Giày Chạy Bộ UTH Shoes Runner Performance',
  'Giày Chạy Bộ UTH Shoes Runner Stability',
  'Giày Chạy Bộ UTH Shoes Runner Cushion'
];

runningShoes.forEach(name => {
  colors.slice(0, 4).forEach(color => {
    const price = Math.floor(Math.random() * 300000) + 700000;
    const originalPrice = Math.floor(price * 1.15);
    const discount = Math.floor(Math.random() * 15) + 10;
    
    products.push(createProduct(
      productId++,
      `${name} Màu ${color.name}`,
      'Giày chạy bộ',
      price,
      originalPrice,
      discount,
      `${name} với công nghệ đệm đế tiên tiến, phù hợp cho cả người mới bắt đầu và vận động viên chuyên nghiệp. Màu ${color.name} năng động.`,
      color.name
    ));
  });
});

// 3. Giày đá banh (10 sản phẩm)
const footballShoes = [
  'Giày Đá Banh UTH Shoes Football Elite',
  'Giày Đá Banh UTH Shoes Football Pro',
  'Giày Đá Banh UTH Shoes Football Classic',
  'Giày Đá Banh UTH Shoes Football Modern',
  'Giày Đá Banh UTH Shoes Football Speed',
  'Giày Đá Banh UTH Shoes Football Control',
  'Giày Đá Banh UTH Shoes Football Power',
  'Giày Đá Banh UTH Shoes Football Light',
  'Giày Đá Banh UTH Shoes Football Comfort',
  'Giày Đá Banh UTH Shoes Football Premium'
];

footballShoes.forEach(name => {
  colors.slice(0, 3).forEach(color => {
    const price = Math.floor(Math.random() * 400000) + 1000000;
    const originalPrice = Math.floor(price * 1.25);
    const discount = Math.floor(Math.random() * 20) + 15;
    
    products.push(createProduct(
      productId++,
      `${name} Màu ${color.name}`,
      'Giày đá banh',
      price,
      originalPrice,
      discount,
      `${name} với thiết kế chuyên nghiệp, đế bám tốt và chất liệu cao cấp. Màu ${color.name} nổi bật trên sân cỏ.`,
      color.name
    ));
  });
});

// 4. Giày tây (10 sản phẩm)
const formalShoes = [
  'Giày Tây UTH Shoes Business Classic',
  'Giày Tây UTH Shoes Business Modern',
  'Giày Tây UTH Shoes Business Premium',
  'Giày Tây UTH Shoes Business Elite',
  'Giày Tây UTH Shoes Business Comfort',
  'Giày Tây UTH Shoes Business Style',
  'Giày Tây UTH Shoes Business Professional',
  'Giày Tây UTH Shoes Business Executive',
  'Giày Tây UTH Shoes Business Manager',
  'Giày Tây UTH Shoes Business Director'
];

formalShoes.forEach(name => {
  colors.slice(0, 4).forEach(color => {
    const price = Math.floor(Math.random() * 300000) + 800000;
    const originalPrice = Math.floor(price * 1.2);
    const discount = Math.floor(Math.random() * 20) + 15;
    
    products.push(createProduct(
      productId++,
      `${name} Màu ${color.name}`,
      'Giày tây',
      price,
      originalPrice,
      discount,
      `${name} với thiết kế cổ điển, phù hợp cho môi trường làm việc chuyên nghiệp. Màu ${color.name} thanh lịch.`,
      color.name
    ));
  });
});

// 5. Dép (15 sản phẩm)
const slippers = [
  'Dép UTH Shoes Comfort Slide',
  'Dép UTH Shoes Comfort Flip',
  'Dép UTH Shoes Comfort Sport',
  'Dép UTH Shoes Comfort Home',
  'Dép UTH Shoes Comfort Beach',
  'Dép UTH Shoes Comfort Pool',
  'Dép UTH Shoes Comfort Garden',
  'Dép UTH Shoes Comfort Kitchen',
  'Dép UTH Shoes Comfort Bathroom',
  'Dép UTH Shoes Comfort Living',
  'Dép UTH Shoes Comfort Bedroom',
  'Dép UTH Shoes Comfort Balcony',
  'Dép UTH Shoes Comfort Terrace',
  'Dép UTH Shoes Comfort Patio',
  'Dép UTH Shoes Comfort Deck'
];

slippers.forEach(name => {
  colors.slice(0, 5).forEach(color => {
    const price = Math.floor(Math.random() * 150000) + 200000;
    const originalPrice = Math.floor(price * 1.3);
    const discount = Math.floor(Math.random() * 25) + 20;
    
    products.push(createProduct(
      productId++,
      `${name} Màu ${color.name}`,
      'Dép',
      price,
      originalPrice,
      discount,
      `${name} với đế mềm và thiết kế hiện đại, phù hợp cho mọi lứa tuổi. Màu ${color.name} dễ thương.`,
      color.name
    ));
  });
});

// 6. Giày búp bê (10 sản phẩm)
const dollShoes = [
  'Giày Búp Bê UTH Shoes Princess',
  'Giày Búp Bê UTH Shoes Queen',
  'Giày Búp Bê UTH Shoes Angel',
  'Giày Búp Bê UTH Shoes Fairy',
  'Giày Búp Bê UTH Shoes Star',
  'Giày Búp Bê UTH Shoes Moon',
  'Giày Búp Bê UTH Shoes Rainbow',
  'Giày Búp Bê UTH Shoes Butterfly',
  'Giày Búp Bê UTH Shoes Flower',
  'Giày Búp Bê UTH Shoes Heart'
];

dollShoes.forEach(name => {
  colors.slice(5, 10).forEach(color => {
    const price = Math.floor(Math.random() * 200000) + 400000;
    const originalPrice = Math.floor(price * 1.25);
    const discount = Math.floor(Math.random() * 20) + 20;
    
    products.push(createProduct(
      productId++,
      `${name} Màu ${color.name}`,
      'Giày búp bê',
      price,
      originalPrice,
      discount,
      `${name} với thiết kế dễ thương, phù hợp cho các cô gái trẻ. Màu ${color.name} nữ tính.`,
      color.name
    ));
  });
});

// 7. Giày cao gót (10 sản phẩm)
const highHeels = [
  'Giày Cao Gót UTH Shoes Elegant',
  'Giày Cao Gót UTH Shoes Graceful',
  'Giày Cao Gót UTH Shoes Sophisticated',
  'Giày Cao Gót UTH Shoes Refined',
  'Giày Cao Gót UTH Shoes Polished',
  'Giày Cao Gót UTH Shoes Classy',
  'Giày Cao Gót UTH Shoes Chic',
  'Giày Cao Gót UTH Shoes Fashionable',
  'Giày Cao Gót UTH Shoes Trendy',
  'Giày Cao Gót UTH Shoes Stylish'
];

highHeels.forEach(name => {
  colors.slice(5, 10).forEach(color => {
    const price = Math.floor(Math.random() * 300000) + 600000;
    const originalPrice = Math.floor(price * 1.2);
    const discount = Math.floor(Math.random() * 20) + 15;
    
    products.push(createProduct(
      productId++,
      `${name} Màu ${color.name}`,
      'Giày cao gót',
      price,
      originalPrice,
      discount,
      `${name} với thiết kế thanh lịch, phù hợp cho các dịp đặc biệt. Màu ${color.name} quyến rũ.`,
      color.name
    ));
  });
});

// 8. Giày lười (10 sản phẩm)
const loafers = [
  'Giày Lười UTH Shoes Casual',
  'Giày Lười UTH Shoes Relaxed',
  'Giày Lười UTH Shoes Easy',
  'Giày Lười UTH Shoes Simple',
  'Giày Lười UTH Shoes Basic',
  'Giày Lười UTH Shoes Minimal',
  'Giày Lười UTH Shoes Clean',
  'Giày Lười UTH Shoes Neat',
  'Giày Lười UTH Shoes Tidy',
  'Giày Lười UTH Shoes Orderly'
];

loafers.forEach(name => {
  colors.slice(0, 5).forEach(color => {
    const price = Math.floor(Math.random() * 200000) + 400000;
    const originalPrice = Math.floor(price * 1.15);
    const discount = Math.floor(Math.random() * 15) + 10;
    
    products.push(createProduct(
      productId++,
      `${name} Màu ${color.name}`,
      'Giày lười',
      price,
      originalPrice,
      discount,
      `${name} với thiết kế thoải mái, phù hợp cho cuộc sống hàng ngày. Màu ${color.name} dễ phối đồ.`,
      color.name
    ));
  });
});

// Xuất danh sách sản phẩm
console.log(`Đã tạo ${products.length} sản phẩm`);
console.log('Danh sách sản phẩm:', products);

// Tạo file JSON
const fs = require('fs');
fs.writeFileSync('100_products.json', JSON.stringify(products, null, 2));
console.log('Đã lưu danh sách sản phẩm vào file 100_products.json');

// Tạo file SQL (đảm bảo Unicode với tiền tố N cho NVARCHAR)
let sqlContent = '-- Script thêm 100 sản phẩm cho database shopgiay\n';
sqlContent += 'USE [shopgiay]\nGO\n\n';

function escapeSqlUnicode(text) {
  return String(text).replace(/'/g, "''");
}

products.forEach(product => {
  const name = escapeSqlUnicode(product.Name);
  const brand = escapeSqlUnicode(product.Brand);
  const category = escapeSqlUnicode(product.Category);
  const description = escapeSqlUnicode(product.Description);
  const mainImage = escapeSqlUnicode(product.MainImage);
  const thumbnailImages = escapeSqlUnicode(JSON.stringify(product.Images.slice(1)));
  const detailImages = escapeSqlUnicode(JSON.stringify(product.Images));

  sqlContent += `INSERT INTO [dbo].[Products] ([Name], [BrandID], [CategoryID], [Price], [OriginalPrice], [Discount], [Description], [MainImage], [ThumbnailImages], [DetailImages], [InStock], [StockQuantity])\n`;
  sqlContent += `VALUES (N'${name}', (SELECT [BrandID] FROM [dbo].[Brands] WHERE [Name] = N'${brand}'), (SELECT [CategoryID] FROM [dbo].[Categories] WHERE [Name] = N'${category}'), ${product.Price}, ${product.OriginalPrice}, ${product.Discount}, N'${description}', N'${mainImage}', N'${thumbnailImages}', N'${detailImages}', 1, ${Math.floor(Math.random() * 50) + 50});\n\n`;
});

fs.writeFileSync('insert_100_products.sql', sqlContent);
console.log('Đã lưu script SQL vào file insert_100_products.sql');
