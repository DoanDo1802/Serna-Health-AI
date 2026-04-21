# Thiết lập Supabase (Supabase Configuration Guide) ⚡

Tài liệu này hướng dẫn chi tiết cách khởi tạo và cấu hình Supabase cho dự án Serna Health AI.

---

## 1. Khởi tạo Dự án
1. Truy cập [Supabase Dashboard](https://supabase.com/dashboard).
2. Tạo một dự án (Project) mới.
3. Đợi quá trình khởi tạo dự án hoàn tất.

---

## 2. Thiết lập Schema & Dữ liệu
1. Truy cập vào mục **SQL Editor** trên thanh menu trái.
2. Sao chép toàn bộ nội dung trong file [supabase/sql/001_auth_baseline.sql](../supabase/sql/001_auth_baseline.sql).
3. Nhấn **Run** để thực thi.

> **Lưu ý**: Tập lệnh này sẽ khởi tạo bảng `public.profiles`, thiết lập Row Level Security (RLS), các Policy bảo mật cơ bản và Trigger tự động tạo profile khi người dùng đăng ký tài khoản.

---

## 3. Cấu hình Authentication
Truy cập **Authentication** trên dashboard và thực hiện các bước sau:

### Kích hoạt Provider
- Tại mục **Providers**, đảm bảo **Email** đã được bật (Enabled).

### Cấu hình URL
Tại mục **URL Configuration**:
- **Site URL**: `http://localhost:3000`
- **Redirect URLs**:
    - `http://localhost:3000/home`
    - *(Bổ sung domain production nếu có)*

---

## 4. Cấu hình Frontend
Cập nhật các thông số từ dự án Supabase vào file `frontend_v2/.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_URL=your-project-url
SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SUPABASE_REDIRECT_URL=http://localhost:3000/home
```

---

## 5. Kiểm tra hệ thống (Verification)
1. Khởi động ứng dụng Next.js local.
2. Thực hiện đăng ký tài khoản mới tại trang `/register`.
3. Xác nhận email (nếu bật tính năng Confirm Email).
4. Đăng nhập và truy cập vào trang Dashboard (`/home`).

---

## 🛡️ Lưu ý về Bảo mật
*   **TUYỆT ĐỐI KHÔNG** chia sẻ `service_role` key trong mã nguồn frontend hoặc client-side.
*   Chỉ sử dụng `anon key` cho các tác vụ phía Client.
*   Quản lý thông tin nhạy cảm thông qua biến môi trường (`.env`) và **KHÔNG** commit các file này lên Git.
