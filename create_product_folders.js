const fs = require('fs');
const path = require('path');

// Danh sách tên sản phẩm từ database (đã được cập nhật path)
const productNames = [
    'Nike-Air-Zoom-Pegasus-40',
    'Nike-Air-Force-1',
    'Nike-Air-Max-270',
    'Nike-Air-Max-90',
    'Nike-Air-Max-95',
    'Nike-Air-Max-97',
    'Nike-Air-Max-Plus',
    'Nike-Air-Max-200',
    'Nike-Air-Max-720',
    'Nike-Air-Max-2090',
    'Nike-Air-Max-270-React',
    'Nike-Air-Max-90-React',
    'Nike-Air-Max-95-React',
    'Nike-Air-Max-97-React',
    'Nike-Air-Max-Plus-React',
    'Adidas-Superstar',
    'Adidas-Ultraboost-21',
    'Adidas-NMD-R1',
    'Adidas-Yeezy-Boost-350-V2',
    'Adidas-Yeezy-Boost-700',
    'Adidas-Yeezy-Boost-500',
    'Adidas-Yeezy-Slide',
    'Adidas-Yeezy-Foam-Runner',
    'Adidas-Yeezy-Quantum',
    'Adidas-Yeezy-450',
    'Adidas-Yeezy-380',
    'Adidas-Yeezy-700-V3',
    'Converse-Chuck-Taylor-All-Star',
    'Converse-One-Star',
    'Converse-Jack-Purcell',
    'Converse-1970s',
    'Converse-Fastbreak',
    'Converse-All-Star-BB-Evo',
    'Converse-All-Star-Pro-BB',
    'Converse-All-Star-BB',
    'Converse-All-Star-BB-Evo-Low',
    'Converse-All-Star-BB-Evo-High',
    'Converse-All-Star-BB-Pro',
    'Puma-RS-X',
    'Puma-Cali',
    'Puma-Mayze',
    'Puma-Smash',
    'Puma-Basket-Classic',
    'Puma-Suede-Classic',
    'Puma-Clyde',
    'Puma-Speedcat',
    'Puma-Future-Rider',
    'Puma-Thunder-Spectra',
    'Puma-Cell-Venom',
    'Puma-Cell-Atom',
    'Puma-Cell-Death',
    'Puma-Cell-King',
    'Puma-Cell-Venom-Pro',
    'Puma-Cell-Atom-Pro',
    'Puma-Cell-Death-Pro',
    'Puma-Cell-King-Pro',
    'New-Balance-574',
    'New-Balance-990',
    'New-Balance-997',
    'New-Balance-998',
    'New-Balance-999',
    'New-Balance-1500',
    'New-Balance-1600',
    'New-Balance-1700',
    'New-Balance-2000',
    'New-Balance-3000',
    'New-Balance-4000',
    'New-Balance-5000',
    'New-Balance-6000',
    'New-Balance-7000',
    'New-Balance-8000',
    'New-Balance-9000',
    'New-Balance-1000',
    'New-Balance-1100',
    'New-Balance-1200',
    'New-Balance-1300',
    'New-Balance-1400'
];

const baseDir = path.join(__dirname, 'public', 'images', 'products');

console.log('🚀 Bắt đầu tạo thư mục sản phẩm...');
console.log(`📁 Thư mục gốc: ${baseDir}`);

// Tạo thư mục gốc nếu chưa có
if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir, { recursive: true });
    console.log('✅ Đã tạo thư mục gốc products');
}

let createdCount = 0;
let existingCount = 0;

// Tạo thư mục cho từng sản phẩm
productNames.forEach(productName => {
    const productDir = path.join(baseDir, productName);
    
    if (!fs.existsSync(productDir)) {
        fs.mkdirSync(productDir, { recursive: true });
        console.log(`✅ Đã tạo: ${productName}`);
        createdCount++;
    } else {
        console.log(`ℹ️  Đã tồn tại: ${productName}`);
        existingCount++;
    }
});

console.log('\n📊 Kết quả:');
console.log(`✅ Đã tạo mới: ${createdCount} thư mục`);
console.log(`ℹ️  Đã tồn tại: ${existingCount} thư mục`);
console.log(`📁 Tổng cộng: ${productNames.length} thư mục`);

console.log('\n📋 Hướng dẫn tiếp theo:');
console.log('1. Mỗi thư mục sản phẩm cần có 3 file: 1.png, 2.png, 3.png');
console.log('2. File 1.png sẽ được sử dụng làm MainImage');
console.log('3. Cả 3 file sẽ được sử dụng cho ThumbnailImages và DetailImages');
console.log('4. Bạn có thể tải hình ảnh từ internet hoặc sử dụng hình ảnh có sẵn');

// Tạo file placeholder cho mỗi thư mục
console.log('\n🖼️  Tạo file placeholder...');
productNames.forEach(productName => {
    const productDir = path.join(baseDir, productName);
    
    // Tạo file 1.png placeholder
    const file1Path = path.join(productDir, '1.png');
    if (!fs.existsSync(file1Path)) {
        fs.writeFileSync(file1Path, '');
        console.log(`📄 Đã tạo placeholder: ${productName}/1.png`);
    }
    
    // Tạo file 2.png placeholder
    const file2Path = path.join(productDir, '2.png');
    if (!fs.existsSync(file2Path)) {
        fs.writeFileSync(file2Path, '');
        console.log(`📄 Đã tạo placeholder: ${productName}/2.png`);
    }
    
    // Tạo file 3.png placeholder
    const file3Path = path.join(productDir, '3.png');
    if (!fs.existsSync(file3Path)) {
        fs.writeFileSync(file3Path, '');
        console.log(`📄 Đã tạo placeholder: ${productName}/3.png`);
    }
});

console.log('\n🎉 Hoàn thành! Tất cả thư mục và file placeholder đã được tạo.');
console.log('💡 Bây giờ bạn có thể thay thế các file placeholder bằng hình ảnh thực tế của sản phẩm.');
