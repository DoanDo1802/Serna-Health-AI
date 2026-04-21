# Hướng dẫn cài đặt - Serna Health AI 🚀

Tài liệu này hướng dẫn các bước thiết lập môi trường để chạy dự án Serna Health AI dưới môi trường local.

---

## 📋 Yêu cầu hệ thống

*   **Python**: 3.10 trở lên
*   **Node.js**: 18.x trở lên
*   **Trình quản lý gói**: npm hoặc pnpm
*   **Tài khoản & API Key**:
    *   Google Gemini API Key
    *   Supabase Project (URL & Anon Key)

---

## 🔧 1. Thiết lập Backend (Flask)

Dịch vụ backend xử lý việc tải mô hình AI và cung cấp API.

```bash
# Di chuyển vào thư mục backend
cd backend

# Khởi tạo môi trường ảo (Virtual Environment)
python3 -m venv venv
source venv/bin/activate

# Cài đặt các thư viện cần thiết
pip install -r requirements.txt

# Tạo file cấu hình môi trường
cp .env.example .env
```

### Cấu hình `backend/.env`:
```env
DEBUG=false
SECRET_KEY=your_secret_key_here
CORS_ORIGINS=http://localhost:3000
GEMINI_API_KEY=your_gemini_api_key
```

### Chạy Backend:
```bash
python app.py
```
> Mặc định Backend sẽ chạy tại: `http://localhost:5001`

---

## ⚙️ 2. Thiết lập Database & Auth (Supabase)

1.  Tạo một Project mới trên [Supabase Dashboard](https://supabase.com/).
2.  **Khởi tạo Schema**: Vào mục **SQL Editor** và thực thi nội dung file `supabase/sql/001_auth_baseline.sql`.
3.  **Cấu hình Authentication**:
    *   Vào **Authentication > URL Configuration**:
        *   Site URL: `http://localhost:3000`
        *   Redirect URL: `http://localhost:3000/home`
    *   Vào **Authentication > Providers**: Bật **Email provider**.

---

## 💻 3. Thiết lập Frontend (Next.js)

Giao diện người dùng hiện đại xây dựng trên Next.js 15.

```bash
# Di chuyển vào thư mục frontend_v2
cd frontend_v2

# Cài đặt dependencies
npm install

# Tạo file cấu hình môi trường
cp .env.example .env.local
```

### Cấu hình `frontend_v2/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5001
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SUPABASE_REDIRECT_URL=http://localhost:3000/home
```

### Chạy Frontend:
```bash
npm run dev
```
> Mở trình duyệt tại: `http://localhost:3000`

---

## ✅ 4. Kiểm tra chức năng

1.  **Xác thực**: Đăng ký và đăng nhập vào hệ thống.
2.  **Dự đoán nguy cơ**: Hoàn thành form rủi ro để nhận đánh giá sơ bộ.
3.  **Phân tích hình ảnh**: Tải lên ảnh CT để chạy Segmentation (U-Net) và Phân loại giai đoạn (YOLOv8).
4.  **Tư vấn AI**: Đặt câu hỏi cho AI dựa trên kết quả phân tích.

---

## 🛠️ Xử lý sự cố (Troubleshooting)

*   **API Connection Error**: Đảm bảo Backend đang chạy và `NEXT_PUBLIC_API_URL` chính xác.
*   **CORS Policy**: Kiểm tra cấu hình `CORS_ORIGINS` trong backend `.env`.
*   **Model Not Found**: Kiểm tra sự hiện diện của các file model trong `backend/models/`.
*   **Auth Issues**: Kiểm tra các khóa Supabase và cấu hình Redirect URL trên dashboard.

