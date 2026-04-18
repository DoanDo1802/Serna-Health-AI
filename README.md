# Serna Health AI

Nền tảng phân tích ung thư phổi end-to-end (Frontend + Backend + AI Models)

## Mục tiêu dự án

- Hỗ trợ đánh giá nguy cơ ung thư phổi từ dữ liệu bệnh nhân.
- Phân đoạn vùng nghi ngờ tổn thương trên ảnh CT.
- Phân loại giai đoạn (Normal / Benign / Malignant).
- Sinh khuyến nghị y khoa bằng LLM dựa trên kết quả mô hình.

## Giá trị kỹ thuật thể hiện trong portfolio

- Thiết kế full-stack: Next.js (UI) + Flask (API) + nhiều mô hình ML/DL.
- Tách lớp backend rõ ràng theo routes/services/models/utils.
- Kết hợp nhiều pipeline AI trong một luồng UX duy nhất.
- Có authentication bằng Supabase, chat AI theo ngữ cảnh bệnh nhân.

## Kiến trúc tổng quan

- **Frontend**: Next.js 15 + TypeScript + Tailwind + Radix UI
- **Backend**: Flask + CORS
- **Models**:
  - U-Net (`improved_unet_final.h5`) cho segmentation
  - XGBoost (`lung_cancer_xgb_model.pkl`) cho risk prediction
  - YOLO (`lungcancer-cls.pt`) cho cancer stage classification
- **AI Recommendation**: Gemini API
- **Auth/DB**: Supabase

## Tính năng chính

1. **Lung Cancer Risk Prediction**
   - Form 23 thông số sức khỏe/lối sống
   - Trả kết quả Low / Medium / High

2. **Tumor Segmentation**
   - Upload ảnh CT (PNG/JPG)
   - Trả mask và thông tin vùng nghi ngờ

3. **Cancer Stage Classification**
   - Phân loại: Normal / Benign / Malignant
   - Trả confidence score

4. **AI Recommendations + Chat**
   - Tổng hợp kết quả từ nhiều mô hình
   - Đưa ra nhận định và khuyến nghị y khoa dạng hội thoại

## Screenshot demo (không dùng video)

> Ảnh demo đang dùng asset sẵn có trong repo.

| Màn hình | Ảnh |
|---|---|

| UI sample 1 | ![Sample 1](frontend_v2/public/images/demo1.jpg) |
| UI sample 2 | ![Sample 2](frontend_v2/public/images/demo2.jpg) |
| UI sample 3 | ![Sample 3](frontend_v2/public/images/demo3.jpg) |


## Cấu trúc thư mục

```text
serna-v2/
├── backend/
│   ├── app.py
│   ├── config.py
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── utils/
├── frontend_v2/
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── public/
├── QUICK_START.md
└── README.md
```

## Chạy local

Xem hướng dẫn nhanh tại `QUICK_START.md`.

## Biến môi trường chính

### Backend (`backend/.env`)

- `DEBUG`
- `SECRET_KEY`
- `CORS_ORIGINS`
- `GEMINI_API_KEY`

### Frontend (`frontend_v2/.env.local`)

- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SUPABASE_REDIRECT_URL`

## Khôi phục Supabase khi bị xóa project

- Chạy SQL baseline tại `supabase/sql/001_auth_baseline.sql`.
- Làm theo checklist tại `supabase/SETUP.md`.
- Đảm bảo Auth đã bật Email provider và cấu hình redirect URL đúng.

## Giới hạn hiện tại

- Chưa deploy production trong phiên bản này (theo scope hiện tại).
- Kết quả AI recommendation mang tính hỗ trợ tham khảo, không thay thế chẩn đoán bác sĩ.

## Hướng phát triển tiếp

- Bổ sung integration/e2e tests cho luồng chẩn đoán.
- Đóng gói CI checks (lint, typecheck, build).
- Chuẩn hóa observability và error tracking.
- Triển khai staging/prod khi hoàn tất hardening.

