# Hướng Dẫn Chuyển Tài Khoản GitHub Ở Local

## Cách 1: Xóa Credential Cũ (Windows)

### Bước 1: Xóa Git Credential trong Windows Credential Manager

```powershell
# Mở Credential Manager
control /name Microsoft.CredentialManager

# Hoặc xóa bằng lệnh:
cmdkey /list | Select-String git
cmdkey /delete:git:https://github.com
```

### Bước 2: Xóa credential qua Git

```bash
git credential-manager-core erase
# Hoặc
git credential reject
```

Sau đó nhập:
```
protocol=https
host=github.com
```
Nhấn Enter 2 lần.

### Bước 3: Push lại (sẽ hỏi login)

```bash
cd D:\file\project\qlmc
git push origin main
```

→ Cửa sổ browser sẽ mở, đăng nhập tài khoản mới.

---

## Cách 2: Cấu Hình Git Config Cho Repo Này

```bash
cd D:\file\project\qlmc

# Đặt username và email cho repo này (thay YOUR_USERNAME và YOUR_EMAIL)
git config user.name "YOUR_GITHUB_USERNAME"
git config user.email "YOUR_GITHUB_EMAIL"

# Kiểm tra
git config user.name
git config user.email
```

---

## Cách 3: Sử dụng Personal Access Token

### Bước 1: Tạo Personal Access Token trên GitHub

1. Đăng nhập GitHub → Settings → Developer settings
2. Personal access tokens → Tokens (classic) → Generate new token
3. Chọn quyền: `repo` (full control)
4. Copy token (chỉ hiện 1 lần!)

### Bước 2: Push với Token

```bash
cd D:\file\project\qlmc

# Cách 1: Nhập token khi Git hỏi password
git push origin main
# Username: YOUR_GITHUB_USERNAME
# Password: PASTE_YOUR_TOKEN_HERE

# Cách 2: Đặt token vào remote URL
git remote set-url origin https://YOUR_TOKEN@github.com/YOUR_USERNAME/qlmc.git
git push origin main
```

---

## Cách 4: Sử dụng SSH Key (Recommended)

### Bước 1: Tạo SSH Key

```powershell
# Kiểm tra SSH key đã có chưa
ls ~/.ssh

# Tạo mới (nếu chưa có)
ssh-keygen -t ed25519 -C "your_email@example.com"
# Nhấn Enter 3 lần (mặc định)

# Copy public key
cat ~/.ssh/id_ed25519.pub | clip
```

### Bước 2: Thêm SSH Key vào GitHub

1. GitHub → Settings → SSH and GPG keys → New SSH key
2. Paste key đã copy → Add SSH key

### Bước 3: Đổi Remote sang SSH

```bash
cd D:\file\project\qlmc
git remote set-url origin git@github.com:YOUR_USERNAME/qlmc.git
git push origin main
```

---

## Quick Commands (Chọn 1 trong các cách trên)

### Option A: Xóa credential và login lại

```powershell
cd D:\file\project\qlmc
git credential-manager-core erase
git push origin main
# → Sẽ mở browser để login
```

### Option B: Dùng Personal Access Token

```bash
cd D:\file\project\qlmc
git config user.name "YOUR_NEW_USERNAME"
git config user.email "YOUR_NEW_EMAIL"
git remote set-url origin https://YOUR_TOKEN@github.com/YOUR_NEW_USERNAME/qlmc.git
git push origin main
```

### Option C: SSH (Sau khi setup SSH key)

```bash
cd D:\file\project\qlmc
git remote set-url origin git@github.com:YOUR_NEW_USERNAME/qlmc.git
git push origin main
```

---

## Lưu Ý

- **Cách 1** (Credential Manager): Đơn giản nhất, sẽ hỏi login lại
- **Cách 3** (Token): Tốt cho CI/CD, không cần browser
- **Cách 4** (SSH): An toàn nhất, không cần nhập password mỗi lần

Chọn cách phù hợp với workflow của bạn!
