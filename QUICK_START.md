# QUICK START - Serna Health AI

Hướng dẫn chạy local nhanh trong 5-10 phút (không cần deploy).

## 1) Yêu cầu môi trường

- Python 3.10+
- Node.js 18+
- npm

## 2) Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

Cập nhật `backend/.env`:

```env
DEBUG=false
SECRET_KEY=replace-with-a-strong-secret-key
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
GEMINI_API_KEY=your-gemini-api-key
```

Chạy backend:

```bash
python app.py
```

Backend chạy tại `http://localhost:5001`.

## 3) Khởi tạo Supabase mới (nếu project cũ đã bị xóa)

1. Tạo project Supabase mới trên dashboard.
2. Vào SQL Editor và chạy file `supabase/sql/001_auth_baseline.sql`.
3. Vào Authentication > URL Configuration:
   - Site URL: `http://localhost:3000`
   - Redirect URL: `http://localhost:3000/home`
4. Vào Authentication > Providers và bật Email provider.

Chi tiết xem tại `supabase/SETUP.md`.

## 4) Frontend

```bash
cd frontend_v2
npm install
cp .env.example .env.local
```

Cập nhật `frontend_v2/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5001
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_SUPABASE_REDIRECT_URL=http://localhost:3000/home
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key
```

Chạy frontend:

```bash
npm run dev
```

Frontend chạy tại `http://localhost:3000`.

## 5) Kiểm tra nhanh chức năng

1. Đăng ký/đăng nhập.
2. Nhập form risk prediction (23 biến).
3. Upload ảnh CT để chạy:
   - Tumor segmentation
   - Cancer stage classification
4. Kiểm tra phần recommendations + chat.

## 6) Kiểm tra chất lượng code

```bash
cd frontend_v2
npm run lint
npm run typecheck
npm run build
```

## 7) Lỗi thường gặp

- **Không gọi được API**: kiểm tra `NEXT_PUBLIC_API_URL`.
- **Lỗi CORS**: kiểm tra `CORS_ORIGINS` trong backend `.env`.
- **Lỗi Supabase**: kiểm tra đủ biến `NEXT_PUBLIC_SUPABASE_*`.
- **Model không load**: kiểm tra file trong `backend/models/`.

