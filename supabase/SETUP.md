# Supabase Setup (Fresh Project)

Hướng dẫn khởi tạo lại Supabase khi project cũ đã bị xóa.

## 1) Tạo project Supabase mới

- Vào Supabase Dashboard
- Create new project
- Chờ project khởi tạo xong

## 2) Chạy SQL bootstrap

- Mở SQL Editor
- Copy toàn bộ nội dung từ `supabase/sql/001_auth_baseline.sql`
- Run

SQL này tạo bảng `public.profiles`, bật RLS, policies cơ bản và trigger tự tạo profile khi user đăng ký.

## 3) Cấu hình Auth

Trong Authentication > Providers:
- Bật Email provider

Trong Authentication > URL Configuration:
- Site URL (local): `http://localhost:3000`
- Additional Redirect URLs:
  - `http://localhost:3000/home`
  - (nếu cần) domain deploy của bạn sau này

## 4) Cập nhật biến môi trường frontend

Trong `frontend_v2/.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_URL=your-project-url
SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SUPABASE_REDIRECT_URL=http://localhost:3000/home
```

## 5) Kiểm tra nhanh

1. Chạy app local.
2. Đăng ký user mới ở `/register`.
3. Xác nhận email.
4. Đăng nhập lại và vào `/home`.

## Security notes

- Không đưa `service_role` key vào frontend.
- Chỉ dùng `anon key` ở phía client.
- Giữ secret trong `.env.local`, không commit file chứa secret.
