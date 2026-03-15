# Hướng dẫn Kiểm thử API (API Testing Guide)

Tài liệu này cung cấp các ví dụ chi tiết để kiểm thử các endpoint của hệ thống bằng lệnh `curl`.

## Kiểm thử nhanh bằng lệnh curl

### Kiểm tra sức khỏe (Health check)
```bash
curl http://localhost:3333/
```

### 1. Xác thực & Người dùng (Auth & Users)

#### Đăng ký tài khoản
```bash
curl -X POST http://localhost:3333/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Son","email":"son@example.com","password":"123456"}'
```

#### Đăng nhập
```bash
curl -X POST http://localhost:3333/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"son@example.com","password":"123456"}'
```
*Phản hồi trả về `token` dùng cho các header `Authorization: Bearer <token>`.*

#### Lấy thông tin cá nhân
```bash
curl http://localhost:3333/api/users/me -H "Authorization: Bearer <your-token>"
```

---

### 2. OTruyen Proxy (Dữ liệu truyện tranh)

Sử dụng backend làm trung gian để lấy dữ liệu từ OTruyen API.

#### Lấy dữ liệu Trang chủ
```bash
curl http://localhost:3333/api/otruyen/home
```

#### Danh sách truyện theo loại
`type` gồm: `truyen-moi`, `sap-ra-mat`, `dang-phat-hanh`, `hoan-thanh`.
```bash
curl "http://localhost:3333/api/otruyen/danh-sach/truyen-moi?page=1"
```

#### Chi tiết truyện tranh
```bash
curl http://localhost:3333/api/otruyen/truyen-tranh/dao-hai-tac
```

#### Tìm kiếm truyện
```bash
curl "http://localhost:3333/api/otruyen/tim-kiem?keyword=naruto&page=1"
```

---

### 3. Lưu trữ & Quản lý truyện local (Comics Local)

Dữ liệu được đồng bộ từ OTruyen về database riêng để tùy chỉnh và tăng tốc độ.

#### Đồng bộ truyện mới nhất
```bash
# Đồng bộ trang 1
curl -X POST http://localhost:3333/api/comics/sync

# Đồng bộ trang cụ thể
curl -X POST "http://localhost:3333/api/comics/sync?page=2"
```

#### Get paginated comic list (English)
```bash
# Lấy trang 1, 20 truyện, sắp xếp theo ngày cập nhật mới nhất
curl "http://localhost:3333/api/comics?page=1&limit=20&sort=-updatedAt"
```

#### Get comic details by slug (English)
```bash
curl http://localhost:3333/api/comics/dao-hai-tac
```

#### Trigger Smart Sync (New only)
```bash
curl -X POST http://localhost:3333/api/comics/sync-new
```

#### Tiếp tục đồng bộ (Resume)
Kích hoạt lại quá trình đồng bộ sâu từ trang cuối cùng đã lưu thành công trong `sync-state.json`.

```bash
curl -X POST http://localhost:3333/api/comics/sync-resume
```

#### Trigger Full Sync (Background)
```bash
curl -X POST "http://localhost:3333/api/comics/sync-all?page=1"
```

---

### 4. Quản lý tài liệu (Documents)

#### Tải lên tài liệu
```bash
curl -X POST http://localhost:3333/api/documents/upload \
  -H "Authorization: Bearer <your-token>" \
  -F "files=@/path/to/document.pdf"
```

#### Tải lên theo từng phần (Chunk Upload)
```bash
curl -X POST http://localhost:3333/api/documents/upload/chunk \
  -H "Authorization: Bearer <your-token>" \
  -F "file=@/path/to/chunk-0.part" \
  -F "uploadId=my-upload-id" \
  -F "originalName=file.pdf" \
  -F "chunkIndex=0" \
  -F "totalChunks=5"
```

## Danh sách các Routes hiện có

| Method | Endpoint | Nhóm | Mô tả |
|--------|----------|------|-------|
| GET | `/` | System | Health check |
| POST | `/api/auth/register` | Auth | Đăng ký |
| POST | `/api/auth/login` | Auth | Đăng nhập |
| GET | `/api/users/me` | Users | Profile cá nhân |
| GET | `/api/users` | Users | Danh sách user |
| GET | `/api/otruyen/home` | Proxy | Trang chủ truyện |
| GET | `/api/otruyen/danh-sach/:type` | Proxy | DS theo loại |
| GET | `/api/otruyen/truyen-tranh/:slug` | Proxy | Chi tiết truyện |
| GET | `/api/otruyen/tim-kiem` | Proxy | Tìm kiếm truyện |
| POST | `/api/comics/sync` | Comics | Sync latest page |
| POST | `/api/comics/sync-all` | Comics | Đồng bộ sâu toàn bộ (Background) |
| POST | `/api/comics/sync-new` | Comics | Chỉ đồng bộ truyện mới (Background) |
| POST | `/api/comics/sync-resume` | Comics | Tiếp tục đồng bộ từ trạng thái đã lưu |
| GET | `/api/comics` | Comics | Get paginated list |
| GET | `/api/comics/:slug` | Comics | Get detail by slug |
| POST | `/api/documents/upload` | Docs | Upload file |
| POST | `/api/documents/upload/chunk` | Docs | Upload theo phần |
| GET | `/api/documents/:id/view` | Docs | Xem file |
