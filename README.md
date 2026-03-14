# node-api-course

API Node.js sử dụng Bun, TypeScript, Express, MongoDB, Swagger UI, CORS, và logger terminal.

## Cài đặt

```bash
bun install
```

Tạo file `.env` từ [.env.example](file:///d:/Learn/node-api-course/.env.example):

```env
PORT=3333
MONGODB_URI=mongodb://localhost:27017/bun-api
JWT_SECRET=your-secret
CORS_ORIGIN=http://localhost:3000
```

## Chạy project

Chế độ dev:

```bash
bun run dev
```

Chế độ start:

```bash
bun run start
```

Kiểm tra kiểu dữ liệu (Type check):

```bash
bun run typecheck
```

Base URL mặc định:

```text
http://localhost:3333
```

## CORS

Server đã bật CORS.

- `CORS_ORIGIN=*`: cho phép mọi nguồn (origin)
- `CORS_ORIGIN=http://localhost:3000`: chỉ cho phép frontend này

Nếu không thiết lập, mặc định là `*`.

## Logger

Server đã có request logger để log đẹp hơn trong terminal.

Mỗi request sẽ hiển thị:
- method (phương thức)
- path (đường dẫn)
- status code có màu (mã trạng thái)
- thời gian phản hồi (response time)

Ví dụ:

```text
[11:45:10] GET /api/users 200 12.4ms
```

## Tài liệu API (API Docs)

Sau khi chạy server, mở Swagger UI tại:

```text
http://localhost:3333/docs
```

Mở Scalar tại:

```text
http://localhost:3333/scalar
```

Mở Redoc tại:

```text
http://localhost:3333/redoc
```

Cả Swagger UI và Redoc đều dùng chung cấu hình OpenAPI spec:
- `http://localhost:3333/openapi.json`

Tài liệu hiển thị các endpoint hiện có:
- `GET /`
- `POST /api/register`
- `POST /api/login`
- `GET /api/me`
- `GET /api/users`
- `GET /api/users/:id`
- `POST /api/documents/upload`
- `POST /api/documents/upload/chunk`
- `GET /api/documents`
- `GET /api/documents/:id`
- `GET /api/documents/:id/view`

- **Swagger UI**: Phù hợp để thử nghiệm trực tiếp (`Try it out`)
- **Scalar**: Phù hợp để đọc và kiểm thử (giao diện hiện đại)
- **Redoc**: Phù hợp để xem đặc tả (spec) đẹp và dễ quét thông tin

## Kiểm thử API nhanh bằng curl

### Kiểm tra sức khỏe (Health check)

```bash
curl http://localhost:3333/
```

### Đăng ký tài khoản

Windows PowerShell:

```powershell
curl.exe -X POST http://localhost:3333/api/register `
  -H "Content-Type: application/json" `
  -d "{\"name\":\"Son\",\"email\":\"son@example.com\",\"password\":\"123456\"}"
```

macOS/Linux:

```bash
curl -X POST http://localhost:3333/api/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Son","email":"son@example.com","password":"123456"}'
```

Kết quả mong đợi:
- HTTP `201`
- Trả về người dùng vừa tạo

Lỗi thường gặp:
- HTTP `400`: thiếu `name`, `email`, hoặc `password`
- HTTP `409`: email đã tồn tại

### Đăng nhập

Windows PowerShell:

```powershell
curl.exe -X POST http://localhost:3333/api/login `
  -H "Content-Type: application/json" `
  -d "{\"email\":\"son@example.com\",\"password\":\"123456\"}"
```

macOS/Linux:

```bash
curl -X POST http://localhost:3333/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"son@example.com","password":"123456"}'
```

Kết quả mong đợi:

```json
{
  "token": "..."
}
```

Lỗi thường gặp:
- HTTP `400`: thiếu `email` hoặc `password`
- HTTP `401`: sai email hoặc mật khẩu

### Lấy danh sách người dùng

```bash
curl http://localhost:3333/api/users
```

### Lấy thông tin người dùng hiện tại bằng token

Windows PowerShell:

```powershell
curl.exe http://localhost:3333/api/me `
  -H "Authorization: Bearer <your-token>"
```

macOS/Linux:

```bash
curl http://localhost:3333/api/me \
  -H "Authorization: Bearer <your-token>"
```

Kết quả mong đợi:
- HTTP `200`
- Trả về thông tin người dùng hiện tại (không kèm `password`)

Lỗi thường gặp:
- HTTP `401`: thiếu token, token sai định dạng, hoặc token hết hạn
- HTTP `404`: người dùng trong token không còn tồn tại

### Lấy chi tiết người dùng theo ID

```bash
curl http://localhost:3333/api/users/<user-id>
```

Kết quả mong đợi:
- HTTP `200`
- Trả về thông tin người dùng (không kèm `password`)

Lỗi thường gặp:
- HTTP `404`: không tìm thấy người dùng
- HTTP `400`: `id` không đúng định dạng MongoDB

### Tải lên tài liệu (Upload)

Cần token đăng nhập trước.

Windows PowerShell:

```powershell
curl.exe -X POST http://localhost:3333/api/documents/upload `
  -H "Authorization: Bearer <your-token>" `
  -F "files=@C:\path\to\document.pdf" `
  -F "files=@C:\path\to\slide.pptx"
```

macOS/Linux:

```bash
curl -X POST http://localhost:3333/api/documents/upload \
  -H "Authorization: Bearer <your-token>" \
  -F "files=@/path/to/document.pdf" \
  -F "files=@/path/to/slide.pptx"
```

Kết quả mong đợi:
- HTTP `201`
- Trả về danh sách metadata của các file vừa tải lên

Lỗi thường gặp:
- HTTP `400`: không có file, sai form-data, hoặc file vượt giới hạn
- HTTP `401`: thiếu token hoặc token không hợp lệ

### Tải lên tài liệu theo từng phần (Chunk upload)

Dùng khi file lớn và frontend muốn gửi từng phần nhỏ.

Mỗi request gửi:
- `file`: phần hiện tại (chunk)
- `uploadId`: ID của phiên tải lên
- `originalName`: tên file gốc
- `chunkIndex`: vị trí phần, bắt đầu từ `0`
- `totalChunks`: tổng số phần
- `mimeType`: tùy chọn

Windows PowerShell:

```powershell
curl.exe -X POST http://localhost:3333/api/documents/upload/chunk `
  -H "Authorization: Bearer <your-token>" `
  -F "file=@C:\path\to\chunk-0.part" `
  -F "uploadId=lesson-01-pdf" `
  -F "originalName=lesson-01.pdf" `
  -F "chunkIndex=0" `
  -F "totalChunks=4" `
  -F "mimeType=application/pdf"
```

Kết quả:
- HTTP `200`: đã nhận phần này, chưa đủ file
- HTTP `201`: đã nhận đủ các phần và đã ghép file thành công

Khi hoàn tất, phản hồi `201` sẽ trả về metadata của tài liệu vừa tạo.

### Lấy danh sách tài liệu

```bash
curl http://localhost:3333/api/documents
```

### Lấy metadata của một tài liệu

```bash
curl http://localhost:3333/api/documents/<document-id>
```

### Xem file theo ID tài liệu

```bash
curl http://localhost:3333/api/documents/<document-id>/view
```

Hoặc mở file trực tiếp:

```text
http://localhost:3333/uploads/documents/<file-name>
```

## Các đường dẫn (Routes) hiện có

- `GET /`: kiểm tra sức khỏe (health check)
- `POST /api/register`: tạo người dùng mới
- `POST /api/login`: đăng nhập và nhận JWT
- `GET /api/me`: lấy thông tin người dùng đang đăng nhập
- `GET /api/users`: trả về danh sách người dùng từ MongoDB
- `GET /api/users/:id`: trả về chi tiết một người dùng
- `POST /api/documents/upload`: tải lên một hoặc nhiều tệp tài liệu
- `POST /api/documents/upload/chunk`: tải lên tệp lớn theo từng phần
- `GET /api/documents`: trả về danh sách tài liệu
- `GET /api/documents/:id`: trả về metadata của tài liệu
- `GET /api/documents/:id/view`: xem tệp tài liệu theo ID
