\n# QLMC - Quản lý máy chiếu (Next.js + Prisma MySQL)
\nGiao diện hiện đại tone trắng/xám/xanh biển nhạt, vai trò: admin, teacher, technician.
\n## Yêu cầu môi trường
- XAMPP MySQL (chạy MySQL trên localhost:3306)
- Node.js 18+
\n## Cấu hình
1. Tạo file `.env` từ mẫu:
```
cp .env.example .env
```
Điền `DATABASE_URL` theo tài khoản MySQL của bạn, ví dụ:
```
DATABASE_URL="mysql://root:password@localhost:3306/qlmc"
JWT_SECRET="your-strong-secret"
```
Tạo database `qlmc` trong MySQL nếu chưa có.
\n## Cài đặt & khởi tạo DB
```
npm install
npm run prisma:generate
npm run prisma:migrate --name init
npm run seed
```

## Tự động cập nhật trạng thái booking (cron)

Để khi booking đã được duyệt (approved), đến khi hết thời gian mượn (endTime) hệ thống tự chuyển sang completed:

1) Cấu hình `CRON_SECRET` trong `.env`:

```
CRON_SECRET="your-strong-cron-key"
```

2) Tạo lịch gọi endpoint cron định kỳ (VD: mỗi 1-5 phút) bằng dịch vụ Scheduler (Vercel Cron, GitHub Actions, Windows Task Scheduler...):

- Endpoint: `GET /api/cron/complete-bookings`
- Header: `x-cron-key: <CRON_SECRET>` (hoặc query `?key=<CRON_SECRET>`)

3) Trong môi trường dev (không đặt `CRON_SECRET`), bạn có thể truy cập thủ công (cần đăng nhập admin):

```
http://localhost:3000/api/cron/complete-bookings
```

Endpoint sẽ cập nhật tất cả booking có `status = approved` và `endTime <= now` thành `completed` và trả về số lượng đã cập nhật.
\n## Chạy dev
```
npm run dev
```
\n## Đăng nhập mặc định
- username: admin
- password: admin123

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
