# node-api-course

Dự án API Node.js nhanh chóng và mạnh mẽ được xây dựng bằng **Bun**, **TypeScript**, và **Express**.

## 🚀 Tính năng chính

- ⚡ **Bun Runtime**: Hiệu năng cực cao.
- 🔷 **TypeScript**: Code an toàn, dễ bảo trì.
- 🍃 **MongoDB & Mongoose**: Quản lý dữ liệu linh hoạt.
- 🔐 **JWT Auth**: Xác thực người dùng bảo mật.
- 📁 **File Management**: Hỗ trợ upload file thường và upload theo chunk (từng phần).
- 📜 **API Documentation**: Tích hợp sẵn Swagger, Scalar và Redoc.

## 🛠 Cài đặt & Chạy

### 1. Cài đặt dependency
```bash
bun install
```

### 2. Cấu hình môi trường
Tạo file `.env` từ `.env.example` và cấu hình các biến cần thiết (MongoDB URI, JWT Secret, v.v.).

### 3. Chạy ứng dụng
```bash
# Chế độ phát triển (Auto-reload)
bun run dev

# Chế độ Production
bun run start
```

## 📖 Tài liệu API

Sau khi khởi chạy, bạn có thể truy cập tài liệu API tại:

- **Swagger UI**: `http://localhost:3333/docs` (Dùng để test trực tiếp)
- **Scalar**: `http://localhost:3333/scalar` (Giao diện hiện đại)
- **Redoc**: `http://localhost:3333/redoc` (Dễ đọc đặc tả)

Chi tiết về các **Endpoints** và **Hướng dẫn sử dụng curl** có thể xem tại:
👉 [**Tài liệu API chi tiết (API.md)**](./API.md)

## 🎨 Log hệ thống

Hệ thống tích hợp sẵn Logger đẹp mắt trong terminal giúp theo dõi request/response dễ dàng:
`[11:45:10] GET /api/users 200 12.4ms`
