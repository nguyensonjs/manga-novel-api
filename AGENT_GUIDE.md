# Hướng dẫn dành cho AI Agent (Agent Guidelines)

Chào Agent! Đây là các quy tắc và quy trình làm việc bạn **BẮT BUỘC** phải tuân thủ khi hỗ trợ Nguyễn Hồng Sơn trên dự án này.

## 1. Quy trình kết thúc nhiệm vụ
Sau khi thực hiện bất kỳ thay đổi nào về mã nguồn hoặc tài liệu, bạn phải thực hiện:
- **Bước 1:** Kiểm tra lỗi (linting/type check) nếu có thể.
- **Bước 2:** Thực hiện lệnh `git add .`.
- **Bước 3:** Tạo commit theo chuẩn **Conventional Commits** (ví dụ: `feat:`, `fix:`, `refactor:`, `docs:`, `chore:`).
- **Bước 4:** Thực hiện lệnh `git push` để đồng bộ lên GitHub ngay lập tức.

## 2. Tiêu chuẩn Mã nguồn
- Tuân thủ cấu trúc **Controller - Service Layer**. Controller chỉ nhận/trả data, logic nằm ở Service.
- Sử dụng **Strong Typing** cho Request và Response trong Controller (Generic Types).
- Luôn ưu tiên hiệu suất cao (sử dụng các tính năng native của Bun như `fetch`).
- Phải cập nhật `src/docs/swagger.ts` nếu thêm route mới.

## 3. Quản lý Tài liệu
- Nếu thay đổi logic API, hãy cập nhật đồng thời file `API.md`.
- Đảm bảo README.md luôn phản ánh đúng các tính năng hiện tại của dự án.

---
*Lưu ý: Luôn phản hồi bằng tiếng Việt có dấu một cách chuyên nghiệp.*
