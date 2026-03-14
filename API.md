# Hướng dẫn Kiểm thử API (API Testing Guide)

Tài liệu này cung cấp các ví dụ chi tiết để kiểm thử các endpoint của hệ thống bằng lệnh `curl`.

## Kiểm thử nhanh bằng lệnh curl

### Kiểm tra sức khỏe (Health check)
```bash
curl http://localhost:3333/
```

### 1. Quản lý người dùng (Authentication & Users)

#### Đăng ký tài khoản
**Windows PowerShell:**
```powershell
curl.exe -X POST http://localhost:3333/api/register `
  -H "Content-Type: application/json" `
  -d "{\"name\":\"Son\",\"email\":\"son@example.com\",\"password\":\"123456\"}"
```
**macOS/Linux:**
```bash
curl -X POST http://localhost:3333/api/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Son","email":"son@example.com","password":"123456"}'
```

#### Đăng nhập
```bash
curl -X POST http://localhost:3333/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"son@example.com","password":"123456"}'
```
*Phản hồi sẽ trả về một `token`. Hãy sử dụng token này cho các yêu cầu cần xác thực.*

#### Lấy thông tin cá nhân (Profile)
```bash
curl http://localhost:3333/api/me -H "Authorization: Bearer <your-token>"
```

#### Danh sách & Chi tiết người dùng
```bash
# Tất cả người dùng
curl http://localhost:3333/api/users

# Chi tiết theo ID
curl http://localhost:3333/api/users/<user-id>
```

---

### 2. Quản lý tài liệu (Documents)

#### Tải lên tài liệu (Upload)
```bash
curl -X POST http://localhost:3333/api/documents/upload \
  -H "Authorization: Bearer <your-token>" \
  -F "files=@/path/to/document.pdf"
```

#### Tải lên theo từng phần (Chunk Upload)
Dùng cho file lớn. Cần lặp lại cho từng chunk.
```bash
curl -X POST http://localhost:3333/api/documents/upload/chunk \
  -H "Authorization: Bearer <your-token>" \
  -F "file=@/path/to/chunk-0.part" \
  -F "uploadId=my-upload-id" \
  -F "originalName=file.pdf" \
  -F "chunkIndex=0" \
  -F "totalChunks=5"
```

#### Truy xuất tài liệu
```bash
# Danh sách tài liệu
curl http://localhost:3333/api/documents

# Metadata tài liệu
curl http://localhost:3333/api/documents/<document-id>

# Xem/Tải file trực tiếp
curl http://localhost:3333/api/documents/<document-id>/view
```

## Danh sách các Routes hiện có

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/` | Health check |
| POST | `/api/register` | Đăng ký tài khoản |
| POST | `/api/login` | Đăng nhập nhận JWT |
| GET | `/api/me` | Lấy profile cá nhân |
| GET | `/api/users` | Danh sách người dùng |
| GET | `/api/users/:id` | Chi tiết người dùng |
| POST | `/api/documents/upload` | Upload file(s) |
| POST | `/api/documents/upload/chunk` | Upload file lớn theo phần |
| GET | `/api/documents` | Danh sách tài liệu |
| GET | `/api/documents/:id` | Metadata tài liệu |
| GET | `/api/documents/:id/view` | Xem file tài liệu |
