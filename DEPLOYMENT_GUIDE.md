# 🚀 Hướng Dẫn Deployment Serna Health AI lên Vercel

## 📋 Yêu Cầu Trước Khi Bắt Đầu

- ✅ Tài khoản GitHub (đã có)
- ✅ Tài khoản Vercel (tạo miễn phí tại https://vercel.com)
- ✅ Project đã push lên GitHub
- ✅ Backend API đã deploy (xem phần Backend Deployment)

---

## 🔧 PHẦN 1: BACKEND DEPLOYMENT (Flask API)

### Option 1: Deploy Backend lên Render.com (Khuyến Nghị)

#### Bước 1: Tạo Tài Khoản Render
1. Truy cập https://render.com
2. Đăng ký với GitHub account
3. Authorize Render để truy cập repositories

#### Bước 2: Tạo Web Service
1. Click "New +" → "Web Service"
2. Chọn repository `Serna-Health-AI`
3. Điền thông tin:
   - **Name**: `serna-health-api`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `cd backend && gunicorn app:app`
   - **Region**: Chọn gần nhất (Singapore hoặc Tokyo)

#### Bước 3: Cấu Hình Environment Variables
Trong Render dashboard, vào "Environment":
```
FLASK_ENV=production
FLASK_DEBUG=0
SECRET_KEY=your-production-secret-key
GEMINI_API_KEY=your-gemini-api-key
CORS_ORIGINS=https://your-frontend-domain.vercel.app
```

#### Bước 4: Deploy
- Click "Create Web Service"
- Chờ build hoàn thành (5-10 phút)
- Lấy URL: `https://serna-health-api.onrender.com`

---

## 🎨 PHẦN 2: FRONTEND DEPLOYMENT (Next.js lên Vercel)

### Bước 1: Kết Nối GitHub với Vercel

1. Truy cập https://vercel.com
2. Đăng nhập với GitHub account
3. Click "Add New..." → "Project"
4. Chọn repository `Serna-Health-AI`

### Bước 2: Cấu Hình Project

**Framework Preset**: Chọn `Next.js`

**Root Directory**: 
- Click "Edit" → Chọn `frontend_v2`

**Build Settings**:
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### Bước 3: Cấu Hình Environment Variables

Trong Vercel dashboard, vào "Settings" → "Environment Variables":

```
NEXT_PUBLIC_API_URL=https://serna-health-api.onrender.com
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_APP_NAME=Serna Health AI
NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

**Lưu ý**: Chỉ các biến bắt đầu với `NEXT_PUBLIC_` mới có thể truy cập từ browser

### Bước 4: Deploy

1. Click "Deploy"
2. Chờ build hoàn thành (3-5 phút)
3. Lấy URL: `https://serna-health-ai.vercel.app`

---

## 🔐 PHẦN 3: CẤU HÌNH CORS & API

### Cập Nhật Backend CORS

Trong `backend/app.py`, cập nhật CORS:

```python
from flask_cors import CORS

CORS(app, resources={
    r"/api/*": {
        "origins": [
            "https://serna-health-ai.vercel.app",
            "http://localhost:3000"
        ],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})
```

### Cập Nhật Frontend API URL

Trong `frontend_v2/.env.local`:

```
NEXT_PUBLIC_API_URL=https://serna-health-api.onrender.com
```

---

## 📱 PHẦN 4: KIỂM TRA & TESTING

### Test Backend API

```bash
curl https://serna-health-api.onrender.com/api/health
```

Kỳ vọng response:
```json
{"status": "ok"}
```

### Test Frontend

1. Truy cập https://serna-health-ai.vercel.app
2. Kiểm tra:
   - ✅ Trang login/register tải đúng
   - ✅ Có thể upload ảnh
   - ✅ API call thành công
   - ✅ Recommendations hiển thị

---

## 🔄 PHẦN 5: CONTINUOUS DEPLOYMENT

### Tự Động Deploy Khi Push Code

**Vercel**: Tự động deploy khi push lên `main` branch

**Render**: Tự động deploy khi push lên `main` branch

### Disable Auto-Deploy (Nếu Cần)

1. Vercel: Settings → Git → Uncheck "Deploy on push"
2. Render: Settings → Auto-Deploy → Disable

---

## 🐛 TROUBLESHOOTING

### Frontend Build Fails

**Lỗi**: `Module not found`
- **Giải pháp**: Kiểm tra `frontend_v2/package.json` có đầy đủ dependencies

**Lỗi**: `TypeScript errors`
- **Giải pháp**: Chạy `npm run build` locally để kiểm tra

### API Connection Failed

**Lỗi**: `CORS error`
- **Giải pháp**: Kiểm tra `NEXT_PUBLIC_API_URL` đúng và backend CORS config

**Lỗi**: `API timeout`
- **Giải pháp**: Render free tier có thể chậm, nâng cấp plan nếu cần

### Environment Variables Not Working

**Lỗi**: Variables undefined
- **Giải pháp**: 
  - Frontend: Chỉ `NEXT_PUBLIC_*` variables mới accessible
  - Rebuild sau khi thêm variables
  - Kiểm tra typo trong tên variables

---

## 📊 PHẦN 6: MONITORING & LOGS

### Xem Logs Vercel

1. Vercel Dashboard → Project → Deployments
2. Click deployment → Logs
3. Xem real-time logs

### Xem Logs Render

1. Render Dashboard → Service
2. Xem "Logs" tab
3. Xem real-time logs

---

## 💰 PHẦN 7: PRICING & LIMITS

### Vercel (Frontend)
- **Free**: 100GB bandwidth/month, unlimited deployments
- **Pro**: $20/month, 1TB bandwidth

### Render (Backend)
- **Free**: Auto-sleep sau 15 phút inactivity
- **Starter**: $7/month, always on
- **Standard**: $12/month, 2GB RAM

---

## ✅ CHECKLIST DEPLOYMENT

- [ ] Backend deployed lên Render
- [ ] Frontend deployed lên Vercel
- [ ] Environment variables cấu hình đúng
- [ ] CORS config cập nhật
- [ ] API URL cập nhật trong frontend
- [ ] Test API connection
- [ ] Test login/register
- [ ] Test image upload
- [ ] Test recommendations
- [ ] Kiểm tra logs không có errors

---

## 🎉 HOÀN THÀNH!

Sau khi hoàn thành tất cả bước, project của bạn sẽ:
- ✅ Accessible từ internet
- ✅ Auto-deploy khi push code
- ✅ Có SSL certificate (HTTPS)
- ✅ Có monitoring & logs
- ✅ Scalable & reliable

**Frontend URL**: https://serna-health-ai.vercel.app
**Backend URL**: https://serna-health-api.onrender.com

---

## 📞 SUPPORT

- Vercel Docs: https://vercel.com/docs
- Render Docs: https://render.com/docs
- Next.js Docs: https://nextjs.org/docs
- Flask Docs: https://flask.palletsprojects.com

