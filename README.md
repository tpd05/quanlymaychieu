# QLMC - Hệ thống Quản lý Máy Chiếu

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-15.5.6-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.1.0-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-5.22.0-2D3748?style=for-the-badge&logo=prisma)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql)
![Ant Design](https://img.shields.io/badge/Ant_Design-5.27.5-0170FE?style=for-the-badge&logo=ant-design)

**Hệ thống quản lý máy chiếu thông minh với AI Assistant**

[Tính năng](#-tính-năng-chính) • [Cài đặt](#-cài-đặt) • [Cấu trúc](#-cấu-trúc-project) • [API](#-api-endpoints)

</div>

---

## Mục lục

- [Giới thiệu](#-giới-thiệu)
- [Tính năng chính](#-tính-năng-chính)
- [Công nghệ](#-công-nghệ-sử-dụng)
- [Yêu cầu hệ thống](#-yêu-cầu-hệ-thống)
- [Cài đặt](#-cài-đặt)
- [Cấu trúc Project](#-cấu-trúc-project)
- [Database Schema](#-database-schema)
- [API Endpoints](#-api-endpoints)
- [Hướng dẫn sử dụng](#-hướng-dẫn-sử-dụng)
- [Tài khoản mặc định](#-tài-khoản-mặc-định)
- [Scripts](#-scripts)
- [Deployment](#-deployment)

---

## Giới thiệu

**QLMC** là hệ thống quản lý máy chiếu toàn diện cho các trường học, tích hợp công nghệ AI để hỗ trợ người dùng 24/7. Hệ thống giúp tối ưu hóa việc đặt mượn, bảo trì và theo dõi tình trạng thiết bị một cách hiệu quả.

### Điểm nổi bật

- 🤖 **AI Assistant thông minh** - ChatWidget với khả năng tự học từ feedback người dùng
- 📊 **Dashboard trực quan** - Thống kê real-time cho từng vai trò
- 🔔 **Quản lý booking** - Đặt lịch, phê duyệt và theo dõi tự động
- 🔧 **Bảo trì thiết bị** - Lên lịch và quản lý công việc kỹ thuật
- 📈 **Thống kê chi tiết** - Biểu đồ sử dụng thiết bị, đánh giá và báo cáo
- 🎨 **Giao diện hiện đại** - Responsive, thân thiện với người dùng

---

## Tính năng chính

### Phân quyền theo vai trò

#### **Admin (Quản trị viên)**
- ✅ Quản lý thiết bị (CRUD, cập nhật trạng thái)
- ✅ Quản lý người dùng (thêm, sửa, xóa, phân quyền)
- ✅ Phê duyệt/từ chối lịch đặt
- ✅ Xem thống kê sử dụng thiết bị (biểu đồ, báo cáo)
- ✅ Quản lý yêu cầu hỗ trợ và phân công kỹ thuật viên
- ✅ Xem lịch sử AI tự học (AI Learning Logs)
- ✅ Thống kê feedback chatbot (Like/Dislike analytics)

#### **Teacher (Giáo viên)**
- ✅ Đặt mượn máy chiếu theo thời gian
- ✅ Xem lịch đặt của mình và lịch chung
- ✅ Đánh giá thiết bị sau khi sử dụng (1-5 sao)
- ✅ Gửi yêu cầu hỗ trợ kỹ thuật
- ✅ Sử dụng AI Assistant để tra cứu thông tin

#### **Technician (Kỹ thuật viên)**
- ✅ Xem yêu cầu hỗ trợ được phân công
- ✅ Cập nhật trạng thái công việc (Pending → In Progress → Resolved)
- ✅ Quản lý và cập nhật trạng thái thiết bị
- ✅ Xem lịch bảo trì theo calendar
- ✅ Xem lịch sử công việc đã hoàn thành

### AI Assistant & ChatWidget

- **ChatWidget tích hợp** trên mọi trang
- **RAG (Retrieval Augmented Generation)** với FAISS vector search
- **Feedback system** (Like/Dislike) để cải thiện câu trả lời
- **AI tự học hàng ngày** (00:00) từ feedback người dùng
- **Knowledge base** tự động cập nhật dựa trên điểm số feedback
- Hiển thị **nguồn tài liệu** (sources) kèm câu trả lời

### Thống kê & Báo cáo

- Biểu đồ thời gian sử dụng thiết bị (Bar chart)
- Biểu đồ trạng thái thiết bị (Pie chart)
- Biểu đồ đánh giá người dùng (Pie chart)
- Lịch sử AI Learning với top questions
- Analytics feedback chatbot (Like/Dislike ratio)

---

## Công nghệ sử dụng

### Frontend
- **Next.js 15.5.6** - React framework với App Router
- **React 19.1.0** - UI library
- **TypeScript 5** - Type safety
- **Ant Design 5.27.5** - UI components
- **Recharts 3.3.0** - Data visualization
- **Day.js 1.11.18** - Date manipulation

### Backend
- **Next.js API Routes** - RESTful API
- **Prisma 5.22.0** - ORM
- **MySQL 8.0** - Database
- **JWT (jsonwebtoken 9.0.2)** - Authentication
- **Bcrypt.js 2.4.3** - Password hashing
- **Zod 3.23.8** - Schema validation

### AI Backend (Python)
- **FastAPI** - Python web framework
- **LangChain** - LLM orchestration
- **FAISS** - Vector search
- **Sentence Transformers** - Embedding models
- **Google Generative AI** - LLM (Gemini)

### DevOps & Tools
- **Concurrently** - Run multiple processes
- **ESLint** - Code linting
- **Vercel** - Deployment platform (optional)
- **XAMPP** - Local MySQL server

---

## 💻 Yêu cầu hệ thống

### Bắt buộc
- **Node.js** >= 18.0.0
- **npm** hoặc **yarn**
- **MySQL** >= 8.0 (XAMPP hoặc standalone)
- **Python** >= 3.9 (cho AI backend)

### Khuyến nghị
- **RAM**: >= 8GB
- **Disk**: >= 10GB free space
- **OS**: Windows 10/11, macOS, Linux

---

## Cài đặt

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/qlmc.git
cd qlmc
```

### 2. Cài đặt Dependencies (Frontend)

```bash
npm install
```

### 3. Cấu hình Database

#### a. Khởi động MySQL (XAMPP)
- Mở XAMPP Control Panel
- Start **Apache** và **MySQL**

#### b. Tạo Database

```sql
CREATE DATABASE qlmc CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

#### c. Cấu hình `.env`

```bash
cp .env.example .env
```

Chỉnh sửa `.env`:

```env
# MySQL Connection
DATABASE_URL="mysql://root:@localhost:3306/qlmc"

# JWT Secret (đổi thành chuỗi ngẫu nhiên)
JWT_SECRET="your-super-secret-jwt-key-change-me"

# Cron Secret (để bảo vệ daily AI learning endpoint)
CRON_SECRET="your-cron-secret-key"

# Python Backend URL
NEXT_PUBLIC_PYTHON_BACKEND_URL="http://127.0.0.1:8001"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Chạy Prisma Migrations

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# (Optional) Seed database với dữ liệu mẫu
npm run seed
```

### 5. Cài đặt Python AI Backend

```bash
cd py-chatbot

# Tạo virtual environment
python -m venv .venv

# Kích hoạt virtual environment
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

# Cài đặt dependencies
pip install -r requirements.txt
```

#### Cấu hình Gemini API Key

Tạo file `py-chatbot/.env`:

```env
GOOGLE_API_KEY=your_gemini_api_key_here
```

> Lấy API key miễn phí tại: https://makersuite.google.com/app/apikey

### 6. Khởi động Development Server

#### Option 1: Tự động (Khuyến nghị)

```bash
npm run dev
```

Lệnh này sẽ tự động chạy:
- Next.js dev server (port 3000)
- Python FastAPI server (port 8001)

#### Option 2: Thủ công

**Terminal 1 - Frontend:**
```bash
npm run dev
```

**Terminal 2 - Python Backend:**
```bash
cd py-chatbot
.venv\Scripts\activate  # Windows
python -m uvicorn app.main:app --reload --port 8001
```

### 7. Truy cập ứng dụng

Mở trình duyệt và truy cập:
- **Frontend**: http://localhost:3000
- **Python API Docs**: http://127.0.0.1:8001/docs

---

## Cấu trúc Project

```
qlmc/
├── prisma/                    # Database schema & migrations
│   ├── schema.prisma         # Prisma schema definition
│   ├── seed.ts               # Database seeding script
│   └── migrations/           # Migration files
│
├── py-chatbot/               # Python AI Backend (FastAPI)
│   ├── app/                  # FastAPI application
│   │   ├── main.py          # Main FastAPI app
│   │   ├── chat.py          # Chat logic & RAG
│   │   └── knowledge.py     # Knowledge base management
│   ├── store/               # FAISS vector store
│   └── requirements.txt     # Python dependencies
│
├── scripts/                 # Automation scripts
│   ├── start-ai.js         # Start Python backend
│   ├── daily-ai-learning.js # Daily AI learning cron
│   └── generate_knowledge.py # Generate knowledge base
│
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── admin/         # Admin pages
│   │   ├── teacher/       # Teacher pages
│   │   ├── technician/    # Technician pages
│   │   ├── api/           # API Routes
│   │   ├── help/          # Help & documentation
│   │   └── profile/       # User profile
│   │
│   ├── components/        # React components
│   │   ├── ChatWidget/    # AI ChatWidget
│   │   └── layouts/       # Layout components
│   │
│   ├── lib/              # Utility libraries
│   └── utils/           # Helper functions
│
├── public/              # Static files
├── .env                # Environment variables (git-ignored)
├── package.json        # Node dependencies
└── README.md          # This file
```

---

## Database Schema

### Core Models

#### **User**
- id, userID (unique), fullName, email, password
- role: admin | teacher | technician
- avatar, isActive

#### **Projector**
- id, name, model, serialNumber (unique)
- room, building
- status: available | maintenance | broken
- purchaseDate, warrantyExpiry, timeUsed

#### **Booking**
- projectorId, userId, startTime, endTime
- purpose, status: pending | approved | rejected | completed

#### **SupportRequest**
- userId, projectorId, title, description
- priority: low | medium | high | urgent
- status: pending | in_progress | resolved | closed
- scheduledStartTime, scheduledEndTime

#### **ChatbotFeedback**
- userId, question, answer, feedback (like/dislike)
- sources (JSON), createdAt

#### **AILearningLog**
- totalFeedback, likeCount, dislikeCount
- documentsUpdated, topQuestions, improvements
- learningDate

---

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/check` - Check auth status
- `POST /api/auth/forgot-password/*` - Password recovery

### Admin APIs
- `GET /api/admin/users` - List users
- `POST /api/admin/users` - Create user
- `GET /api/admin/bookings` - List bookings
- `PATCH /api/admin/bookings/[id]` - Approve/reject
- `GET /api/admin/statistics` - Statistics
- `POST /api/admin/support/assign` - Assign technician

### Chatbot APIs
- `POST /api/chat` - Send message
- `POST /api/chatbot-feedback` - Submit feedback
- `GET /api/chatbot-feedback` - Get feedback (Admin)
- `POST /api/chatbot-learn` - Trigger AI learning (Cron)

### Cron Jobs
- `POST /api/cron/daily-ai-learning` - Daily AI learning

---

## Hướng dẫn sử dụng

### 1. Đăng nhập
Truy cập http://localhost:3000/login

### 2. Sử dụng ChatWidget
- Click icon AI ở góc dưới bên phải
- Gõ câu hỏi và nhấn Enter
- Đánh giá câu trả lời bằng 👍 hoặc 👎

### 3. Đặt lịch mượn máy chiếu (Teacher)
1. Vào `/teacher/booking`
2. Click "Đặt mượn mới"
3. Chọn thiết bị, thời gian, nhập mục đích
4. Gửi yêu cầu

### 4. Phê duyệt lịch đặt (Admin)
1. Vào `/admin/bookings`
2. Tab "Chờ duyệt"
3. Click "Duyệt" hoặc "Từ chối"

---

## Tài khoản mặc định

Sau khi chạy `npm run seed`:

### Admin
```
Email: admin@example.com
Password: ab1234@
UserID: admin
```

### Teacher
```
Email: teacher@gmail.com
Password: ab1234@
UserID: QNU8532553
```

### Technician
```
Email: technician@gmail.com
Password: ab1234@
UserID: QNU2127652
```

> **Lưu ý**: Đổi mật khẩu trong môi trường production!

---

## Scripts

```bash
npm run dev                # Start dev server
npm run build             # Build for production
npm run prisma:generate   # Generate Prisma Client
npm run prisma:migrate    # Run migrations
npm run prisma:studio     # Open Prisma Studio
npm run seed              # Seed database
npm run ai-learning       # Trigger AI learning manually
```

---

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Setup external MySQL database
5. Deploy Python backend separately
6. Setup cron job for daily AI learning

### Manual VPS

```bash
git clone repo
npm install && cd py-chatbot && pip install -r requirements.txt
npm run build
pm2 start npm --name "qlmc-web" -- start
pm2 start "python -m uvicorn app.main:app --port 8001" --name "qlmc-ai"
```

---

## Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Ant Design](https://ant.design/) - Enterprise UI Design
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [LangChain](https://www.langchain.com/) - LLM Framework
- [Google Gemini](https://deepmind.google/technologies/gemini/) - AI Model

---


</div>
