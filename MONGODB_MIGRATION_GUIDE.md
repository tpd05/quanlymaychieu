# 🚀 HƯỚNG DẪN CHUYỂN DATABASE LÊN MONGODB ATLAS

## ✅ Đã hoàn thành

- ✅ **Prisma Schema** đã được cập nhật từ MySQL sang MongoDB
- ✅ Tất cả models đã tương thích với MongoDB

---

## 📋 BƯỚC TIẾP THEO

### **Bước 3: Cập nhật Environment Variables**

1. **Lấy Connection String từ MongoDB Atlas**
   - Vào MongoDB Atlas Dashboard
   - Click vào cluster của bạn → **"Connect"**
   - Chọn **"Drivers"** → Copy connection string
   - Connection string có dạng:
   ```
   mongodb+srv://qlmc_admin:<password>@qlmc-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

2. **Cập nhật file `.env`**

Mở file `.env` và thay thế `DATABASE_URL`:

```env
# CŨ (MySQL)
# DATABASE_URL="mysql://root:@localhost:3306/qlmc"

# MỚI (MongoDB Atlas)
DATABASE_URL="mongodb+srv://qlmc_admin:YOUR_PASSWORD@qlmc-cluster.xxxxx.mongodb.net/qlmc?retryWrites=true&w=majority"
```

**Lưu ý quan trọng:**
- Thay `YOUR_PASSWORD` bằng password của database user
- Thêm `/qlmc` trước dấu `?` để chỉ định tên database
- Giữ nguyên các biến khác (JWT_SECRET, CRON_SECRET, v.v.)

---

### **Bước 4: Generate Prisma Client mới**

Mở terminal và chạy:

```bash
# Xóa Prisma Client cũ
rm -rf node_modules/.prisma
rm -rf node_modules/@prisma

# Generate Prisma Client mới cho MongoDB
npm run prisma:generate
```

Output sẽ hiển thị:
```
✔ Generated Prisma Client (5.x.x) to ./node_modules/@prisma/client
```

---

### **Bước 5: Push Schema lên MongoDB Atlas**

⚠️ **LƯU Ý**: Không cần chạy migrations cho MongoDB. Dùng `db push` thay vì:

```bash
npx prisma db push
```

Lệnh này sẽ:
1. Kết nối đến MongoDB Atlas
2. Tạo collections dựa trên schema
3. Tạo indexes tự động

Output thành công:
```
✔ Your database is now in sync with your Prisma schema.
```

---

### **Bước 6: Seed Database (Tạo dữ liệu mẫu)**

Chạy seed để tạo users và dữ liệu mẫu:

```bash
npm run seed
```

Điều này sẽ tạo:
- 3 users (Admin, Teacher, Technician)
- Một số projectors mẫu
- Bookings mẫu

---

### **Bước 7: Kiểm tra Database**

#### Option 1: MongoDB Atlas UI
1. Vào MongoDB Atlas Dashboard
2. Click **"Browse Collections"** trên cluster
3. Chọn database **"qlmc"**
4. Xem các collections: `User`, `Projector`, `Booking`, v.v.

#### Option 2: Prisma Studio
```bash
npm run prisma:studio
```

Mở http://localhost:5555 để xem dữ liệu

---

### **Bước 8: Khởi động ứng dụng**

```bash
npm run dev
```

Server sẽ chạy trên http://localhost:3000

---

## 🔍 Kiểm tra kết nối

### Test 1: Login
1. Truy cập http://localhost:3000/login
2. Đăng nhập với tài khoản:
   - Email: `admin@qlmc.com`
   - Password: `Admin123!`

### Test 2: Xem dữ liệu
1. Vào Dashboard
2. Kiểm tra stats hiển thị đúng
3. Thử tạo booking mới

---

## 🔧 Troubleshooting

### Lỗi: "Authentication failed"

**Nguyên nhân**: Password hoặc username sai

**Giải pháp**:
1. Kiểm tra lại password trong MongoDB Atlas
2. Đảm bảo encode special characters trong password:
   ```
   # Nếu password có ký tự đặc biệt như @, #, $
   # VD: password là "P@ss123!"
   # Encode thành: "P%40ss123%21"
   ```

### Lỗi: "IP not whitelisted"

**Nguyên nhân**: IP chưa được cho phép

**Giải pháp**:
1. Vào MongoDB Atlas → **Network Access**
2. Add IP address hoặc chọn "Allow from anywhere"

### Lỗi: "Cannot find module @prisma/client"

**Nguyên nhân**: Prisma Client chưa được generate

**Giải pháp**:
```bash
npm run prisma:generate
```

### Lỗi: "Connection timeout"

**Nguyên nhân**: Firewall hoặc network issues

**Giải pháp**:
1. Kiểm tra internet connection
2. Tắt VPN nếu đang bật
3. Thử connection string với `mongodb+srv://` thay vì `mongodb://`

---

## 📊 So sánh MySQL vs MongoDB

| Tính năng | MySQL (Cũ) | MongoDB Atlas (Mới) |
|-----------|------------|---------------------|
| **Hosting** | Local (XAMPP) | Cloud (MongoDB Atlas) |
| **Scalability** | Limited | Unlimited |
| **Backup** | Manual | Automatic |
| **Connection** | Localhost only | Từ mọi nơi có internet |
| **Cost** | Free | Free (512MB) |
| **Migrations** | Phải chạy migrations | Chỉ cần `db push` |

---

## ⚠️ LƯU Ý QUAN TRỌNG

### 1. **Thay đổi về ID**
MongoDB sử dụng `ObjectId` thay vì `UUID`:
- Cũ: `"123e4567-e89b-12d3-a456-426614174000"`
- Mới: `"507f1f77bcf86cd799439011"`

### 2. **Indexes**
MongoDB tự động tạo index trên `_id`. Các @@index trong schema sẽ được tạo khi `db push`.

### 3. **Relations**
Relations vẫn hoạt động như MySQL, nhưng dựa trên ObjectId.

### 4. **Không cần migrations folder**
MongoDB không dùng migrations như MySQL. Bạn có thể xóa folder `prisma/migrations/` nếu muốn:
```bash
# OPTIONAL: Xóa migrations cũ (MySQL)
rm -rf prisma/migrations
```

---

## 🎉 Hoàn tất!

Sau khi hoàn thành các bước trên, database của bạn đã được chuyển lên MongoDB Atlas thành công!

### Kiểm tra cuối cùng:
- ✅ Đăng nhập được
- ✅ Xem được danh sách devices
- ✅ Tạo booking được
- ✅ ChatWidget hoạt động
- ✅ Stats hiển thị đúng

---

## 📚 Tài liệu tham khảo

- [Prisma MongoDB Docs](https://www.prisma.io/docs/concepts/database-connectors/mongodb)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [MongoDB Connection Strings](https://docs.mongodb.com/manual/reference/connection-string/)

---

## 💡 Tips & Best Practices

### 1. **Backup thường xuyên**
MongoDB Atlas tự động backup, nhưng bạn có thể tạo manual snapshots:
- Vào cluster → Backups → Create Snapshot

### 2. **Monitor usage**
- Vào cluster → Metrics để xem:
  - Operations/second
  - Connections
  - Storage used

### 3. **Security**
- Đổi password định kỳ
- Hạn chế IP access trong production
- Sử dụng environment variables cho credentials

### 4. **Performance**
- Tạo indexes cho các queries thường dùng
- Monitor slow queries trong Atlas UI

---

## 🆘 Cần hỗ trợ?

Nếu gặp vấn đề:
1. Check MongoDB Atlas logs: Cluster → Logs
2. Check app logs trong terminal
3. Verify connection string trong .env
4. Test connection với MongoDB Compass

---

**Made with ❤️ for QLMC Project**
