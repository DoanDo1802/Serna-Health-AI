# Serna Health AI 🩺

**Nền tảng phân tích ung thư phổi End-to-End (AI-Powered Lung Cancer Analysis Platform)**

Serna Health AI là giải pháp toàn diện hỗ trợ các chuyên gia y tế trong việc đánh giá nguy cơ, phân đoạn vùng tổn thương và phân loại giai đoạn ung thư phổi thông qua sức mạnh của trí tuệ nhân tạo (AI).

---

## 🌟 Tính năng cốt lõi

*   **Risk Prediction**: Đánh giá nguy cơ ung thư (Thấp/Trung bình/Cao) dựa trên 23 thông số lâm sàng và lối sống.
*   **Tumor Segmentation**: Tự động phân đoạn vùng nghi ngờ tổn thương trên ảnh CT bằng mô hình U-Net.
*   **Stage Classification**: Phân loại tình trạng phổi (Bình thường / Lành tính / Ác tính) sử dụng YOLOv8.
*   **AI Medical Chat**: Hỗ trợ giải thích kết quả và đưa ra khuyến nghị y khoa thông qua mô hình ngôn ngữ lớn (Gemini LLM).
*   **Full End-to-End Pipeline**: Quy trình khép kín từ khâu tiếp nhận dữ liệu đến báo cáo tổng hợp.

---

## 🛠️ Công nghệ sử dụng

| Lớp (Layer) | Công nghệ chính |
| :--- | :--- |
| **Frontend** | [Next.js 15](https://nextjs.org/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS](https://tailwindcss.com/) |
| **Backend** | [Flask (Python)](https://flask.palletsprojects.com/), Modular Architecture |
| **Authentication** | [Supabase Auth](https://supabase.com/auth) |
| **AI Models** | [U-Net](https://arxiv.org/abs/1505.04597) (Segmentation), [XGBoost](https://xgboost.readthedocs.io/) (Risk), [YOLOv8](https://docs.ultralytics.com/) (Cls) |
| **LLM Engine** | [Google Gemini API](https://ai.google.dev/) |

---

## 📁 Cấu trúc dự án

```bash
serna-v2/
├── backend/            # API Service (Flask)
│   ├── models/         # AI Model files (.h5, .pkl, .pt)
│   ├── routes/         # API Endpoints
│   ├── services/       # Business & AI Logic
│   └── utils/          # Helper modules
├── frontend_v2/        # Web Application (Next.js)
│   ├── app/            # Next.js Pages & Routes
│   ├── components/     # UI Components (Shadcn/UI)
│   └── lib/            # Shared utilities & API calls
├── supabase/           # Database schema & Setup scripts
├── QUICK_START.md      # Hướng dẫn cài đặt nhanh
└── README.md           # Tài liệu dự án
```

---

## 🚀 Bắt đầu nhanh

Để cài đặt và chạy dự án dưới môi trường local, vui lòng làm theo hướng dẫn chi tiết tại:

👉 **[HƯỚNG DẪN CÀI ĐẶT NHANH (QUICK_START.md)](./QUICK_START.md)**

### Cấu hình môi trường (Tóm tắt)

1.  **Backend**: Cài đặt Python 3.10+, cài đặt dependencies từ `requirements.txt`.
2.  **Frontend**: Cài đặt Node.js 18+, chạy `npm install`.
3.  **Environment**: Cấu hình các file `.env` (Backend) và `.env.local` (Frontend) với các API Key cần thiết (Gemini, Supabase).

---

## 📸 Hình ảnh minh họa

| Dashboard & Phân tích | Phân đoạn vùng tổn thương |
|:---:|:---:|
| ![Demo 1](frontend_v2/public/images/demo1.jpg) | ![Demo 2](frontend_v2/public/images/demo_new1.jpeg) |

---

## ⚠️ Tuyên bố miễn trừ trách nhiệm (Medical Disclaimer)

Dự án này được phát triển cho mục đích nghiên cứu và hỗ trợ kỹ thuật. Kết quả trả về từ các mô hình AI **không thay thế** cho các chẩn đoán chuyên môn từ bác sĩ hoặc các cơ sở y tế có thẩm quyền. Vui lòng tham vấn chuyên gia y tế trước khi đưa ra bất kỳ quyết định nào liên quan đến sức khỏe.

---

## 🤝 Liên hệ & Đóng góp

Mọi phản hồi và đóng góp nhằm cải thiện hệ thống luôn được chào đón. Vui lòng tạo Issue hoặc Pull Request nếu bạn phát hiện lỗi hoặc có ý tưởng mới.

---
**Serna Health AI** - *Vì một cộng đồng khỏe mạnh hơn thông qua công nghệ.*

