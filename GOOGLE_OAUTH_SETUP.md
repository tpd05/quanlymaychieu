# Hướng Dẫn Cấu Hình Google OAuth

## Các Thay Đổi Đã Thực Hiện

### 1. Database Schema
- Thêm `googleEmail` (optional) - email từ Google
- Thêm `googleId` (optional) - Google user ID
- `email` giờ là optional - không bắt buộc khi admin tạo user

### 2. Tính Năng Mới
- **Admin**: Tạo user không cần email
- **Profile**: Tab "Liên kết Google" để link tài khoản
- **Forgot Password**: Hỗ trợ email Google và email thường

## Cấu Hình Google OAuth

### Bước 1: Tạo Google OAuth Client

1. Vào [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới hoặc chọn project hiện có
3. Vào **APIs & Services > Credentials**
4. Click **Create Credentials > OAuth client ID**
5. Chọn **Web application**
6. Cấu hình:
   - **Name**: QLMC OAuth Client
   - **Authorized JavaScript origins**: 
     - `http://localhost:3000`
     - `https://your-production-domain.com`
   - **Authorized redirect URIs**:
     - `http://localhost:3000/api/auth/google/callback`
     - `https://your-production-domain.com/api/auth/google/callback`
7. Lưu **Client ID** và **Client Secret**

### Bước 2: Cập Nhật .env

Thêm vào file `.env`:

```env
# Google OAuth
GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret_here
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Lưu ý**: 
- `NEXT_PUBLIC_*` để dùng ở client-side
- Production phải đổi `NEXT_PUBLIC_APP_URL` thành domain thật

### Bước 3: Chạy Migration

```powershell
npx prisma generate
```

Nếu dùng MongoDB, schema đã tự cập nhật. Nếu MySQL/Postgres cần migration:

```powershell
npx prisma migrate dev --name add_google_oauth
```

## Cách Sử Dụng

### Cho User (Giáo viên, Kỹ thuật viên, Admin)

1. Đăng nhập vào hệ thống
2. Vào trang **Hồ sơ của tôi**
3. Chọn tab **Liên kết Google**
4. Click **Liên kết với Google**
5. Đăng nhập Google và cho phép truy cập
6. Hệ thống sẽ lưu email Google

### Quên Mật Khẩu

- Nhập **email thường** hoặc **email Google** đã liên kết
- Mã xác thực sẽ gửi đến email đó
- Đặt lại mật khẩu mới (≥8 ký tự, có hoa, thường, số, ký tự đặc biệt)

### Admin Tạo User

- Email giờ là **tùy chọn**
- User có thể tự liên kết Google sau khi đăng nhập
- Nếu cần quên mật khẩu mà không có email: phải liên kết Google trước

## API Endpoints Mới

### POST /api/user/link-google
Link tài khoản Google với user hiện tại.

**Request:**
```json
{
  "googleEmail": "user@gmail.com",
  "googleId": "123456789"
}
```

**Response:**
```json
{
  "message": "Liên kết tài khoản Google thành công",
  "user": { ... }
}
```

### DELETE /api/user/link-google
Hủy liên kết Google account.

### GET /api/auth/google/callback
Xử lý OAuth callback từ Google (tự động redirect).

## Kiểm Tra Tính Năng

### Test Flow Hoàn Chỉnh

1. **Admin tạo user không có email:**
   ```
   - Fullname: Test User
   - Email: (để trống)
   - Password: TestPass1@
   - Role: teacher
   ```

2. **User đăng nhập và link Google:**
   - Login với userID + password
   - Vào Profile > Liên kết Google
   - Hoàn tất OAuth flow

3. **Test forgot password:**
   - Logout
   - Vào /forgot-password
   - Nhập email Google đã link
   - Nhận mã → đặt lại mật khẩu

### Troubleshooting

**Lỗi "Chưa cấu hình Google OAuth":**
- Kiểm tra `.env` có `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
- Restart dev server sau khi thêm env

**Lỗi redirect_uri_mismatch:**
- Kiểm tra Google Console callback URI khớp với `NEXT_PUBLIC_APP_URL/api/auth/google/callback`

**Email send failed:**
- Kiểm tra SMTP settings trong `.env`
- Test bằng Ethereal.email cho development

## Security Notes

- Google OAuth chỉ lấy email, không lưu access token
- User có thể hủy liên kết bất cứ lúc nào
- Một Google account chỉ link được với một user
- Email validation vẫn áp dụng nếu nhập thủ công

## Rollback (Nếu Cần)

Nếu muốn bỏ tính năng:

1. Xóa fields trong schema: `googleEmail`, `googleId`
2. Run `npx prisma generate`
3. Restore admin form: email required
4. Remove OAuth routes và profile tab
