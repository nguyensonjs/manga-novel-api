# node-api-course

API Node.js dung Bun, TypeScript, Express, MongoDB, Swagger UI, CORS, va logger terminal.

## Cai dat

```bash
bun install
```

Tao file `.env` tu [.env.example](/d:/Learn/node-api-course/.env.example):

```env
PORT=3333
MONGODB_URI=mongodb://localhost:27017/bun-api
JWT_SECRET=your-secret
CORS_ORIGIN=http://localhost:3000
```

## Chay project

Che do dev:

```bash
bun run dev
```

Che do start:

```bash
bun run start
```

Type check:

```bash
bun run typecheck
```

Base URL mac dinh:

```text
http://localhost:3333
```

## CORS

Server da bat CORS.

- `CORS_ORIGIN=*`: cho phep moi origin
- `CORS_ORIGIN=http://localhost:3000`: chi cho phep frontend nay

Neu khong set, mac dinh la `*`.

## Logger

Server da co request logger de log dep hon trong terminal.

Moi request se hien:
- method
- path
- status code co mau
- thoi gian response

Vi du:

```text
[11:45:10] GET /api/users 200 12.4ms
```

## API Docs

Sau khi chay server, mo Swagger UI tai:

```text
http://localhost:3333/docs
```

Mo Scalar tai:

```text
http://localhost:3333/scalar
```

Mo Redoc tai:

```text
http://localhost:3333/redoc
```

Ca Swagger UI va Redoc deu dung cung OpenAPI spec:
- `http://localhost:3333/openapi.json`

Doc hien cac endpoint hien co:
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

- Swagger UI phu hop de `Try it out`
- Scalar phu hop de doc dep va test ngon hon
- Redoc phu hop de doc spec cho dep va de scan

## Test API nhanh bang curl

### Health check

```bash
curl http://localhost:3333/
```

### Dang ky tai khoan

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

Ket qua mong doi:
- HTTP `201`
- Tra ve user vua tao

Loi thuong gap:
- HTTP `400`: thieu `name`, `email`, hoac `password`
- HTTP `409`: email da ton tai

### Dang nhap

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

Ket qua mong doi:

```json
{
  "token": "..."
}
```

Loi thuong gap:
- HTTP `400`: thieu `email` hoac `password`
- HTTP `401`: sai email hoac password

### Lay danh sach user

```bash
curl http://localhost:3333/api/users
```

### Lay thong tin user hien tai bang token

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

Ket qua mong doi:
- HTTP `200`
- Tra ve thong tin user hien tai khong kem `password`

Loi thuong gap:
- HTTP `401`: thieu token, token sai dinh dang, hoac token het han
- HTTP `404`: user trong token khong con ton tai

### Lay chi tiet user theo id

```bash
curl http://localhost:3333/api/users/<user-id>
```

Ket qua mong doi:
- HTTP `200`
- Tra ve thong tin user khong kem `password`

Loi thuong gap:
- HTTP `404`: khong tim thay user
- HTTP `400`: `id` khong dung dinh dang MongoDB

### Upload tai lieu

Can token dang nhap truoc.

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

Ket qua mong doi:
- HTTP `201`
- Tra ve danh sach metadata cua cac file vua upload

Loi thuong gap:
- HTTP `400`: khong co file, sai form-data, hoac file vuot gioi han
- HTTP `401`: thieu token hoac token khong hop le

### Upload tai lieu theo chunks

Dung khi file lon va frontend muon gui tung phan nho.

Moi request gui:
- `file`: chunk hien tai
- `uploadId`: id cua phien upload
- `originalName`: ten file goc
- `chunkIndex`: vi tri chunk, bat dau tu `0`
- `totalChunks`: tong so chunks
- `mimeType`: tuy chon

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

Ket qua:
- HTTP `200`: da nhan chunk, chua du file
- HTTP `201`: da nhan du chunks va da ghep file thanh cong

Khi hoan tat, response `201` se tra ve metadata cua tai lieu vua tao.

### Lay danh sach tai lieu

```bash
curl http://localhost:3333/api/documents
```

### Lay metadata cua 1 tai lieu

```bash
curl http://localhost:3333/api/documents/<document-id>
```

### Xem file theo document id

```bash
curl http://localhost:3333/api/documents/<document-id>/view
```

Hoac mo file truc tiep:

```text
http://localhost:3333/uploads/documents/<file-name>
```

## Cac route hien co

- `GET /`: health check
- `POST /api/register`: tao user moi
- `POST /api/login`: dang nhap va nhan JWT
- `GET /api/me`: lay thong tin user dang dang nhap
- `GET /api/users`: tra ve danh sach user tu MongoDB
- `GET /api/users/:id`: tra ve chi tiet 1 user
- `POST /api/documents/upload`: upload 1 hoac nhieu file tai lieu
- `POST /api/documents/upload/chunk`: upload file lon theo tung chunks
- `GET /api/documents`: tra ve danh sach tai lieu
- `GET /api/documents/:id`: tra ve metadata cua tai lieu
- `GET /api/documents/:id/view`: xem file tai lieu theo id
