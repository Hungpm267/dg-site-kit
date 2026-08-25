# CLAUDE.md — Hướng dẫn cho Claude Code

Đây là **DG Site Kit** — repo template dùng để clone khi bắt đầu website khách
mới (dịch vụ Nhóm A của DashGrow). File này là quy ước kỹ thuật; khi làm việc
trong repo đã clone từ kit cho một khách cụ thể, người dùng sẽ cung cấp bối
cảnh khách đó (tên, ngành, nội dung) trực tiếp trong câu lệnh.

## Stack bắt buộc

| Layer | Công nghệ |
|---|---|
| Framework | Astro (+ React islands chỉ khi thật sự cần) |
| CSS | Tailwind CSS |
| Deploy | Cloudflare Pages |
| Ảnh | `<Image />` của `astro:assets` |
| Nội dung | Astro Content Collections (JSON + schema Zod) |

**KHÔNG dùng, kể cả khi thấy phù hợp hơn:** Next.js, Vercel, shadcn/ui,
framer-motion, styled-components, bất kỳ CSS-in-JS nào.

**KHÔNG tự thêm dependency mới.** Nếu thấy cần một package, hãy dừng lại và
hỏi trước, kèm lý do và phương án thay thế không cần package.

## 4 tiêu chí quyết định (áp dụng cho MỌI đề xuất)

1. **Rẻ nhất có thể** — ưu tiên free tier, không tạo chi phí cố định hàng tháng.
2. **Nhanh gọn lẹ** — giải pháp đơn giản, ít cấu hình. Tránh over-engineering.
3. **Scale được khi cần** — bắt đầu tối giản, có đường nâng cấp rõ ràng. Không
   đầu tư trước cho nhu cầu chưa tồn tại.
4. **Đúng quy mô khách hàng** — SMB không cần giải pháp enterprise.

## Quy tắc code

### Zero JS mặc định
Chỉ thêm `client:*` directive khi thành phần đó thật sự cần tương tác. Menu
mobile, accordion, carousel — ưu tiên HTML/CSS thuần (xem `Testimonials.astro`,
`EduLayout.astro` header mobile menu bằng `<details>`).

### KHÔNG over-abstract
Viết component đơn giản nhất chạy được cho khách hiện tại. **Rule-of-Three**:
một component/layout chỉ được tổng quát hóa/đưa vào trạng thái "đã proven" khi
đã dùng thật ở lần thứ ba. `LandingLayout`/`FnBLayout`/`RetailLayout` trong kit
này CÒN LÀ SKELETON chính vì lý do đó — không tự ý dựng đầy đủ khi chưa có
khách thật.

### Tách nội dung khỏi code
Mọi nội dung riêng của khách nằm trong `src/content/clients/*.json`, có schema
Zod validate ở `src/content.config.ts`. Component chỉ nhận props, không
hardcode nội dung.

### Nội dung nháp (mockup) vs nội dung thật
Mọi giá trị nháp phải bọc `"[MOCK: ...]"`. Ảnh mẫu dùng SVG tự vẽ
(`src/assets/placeholder-*.svg`) — **không** copy ảnh thật của bất kỳ khách nào
vào kit dùng chung. Trước khi build production: `grep -rn "MOCK:" src/` phải
trả về rỗng.

### Commit
Commit từng bước nhỏ, có ý nghĩa.

## Sàn chất lượng bắt buộc (mọi site trước khi giao khách)

- [ ] Responsive xuống 375px (iPhone SE) không vỡ layout, kiểm tra **mọi trang**
- [ ] Lighthouse Performance ≥ 95, chạy cho **mọi trang** (`EduLayout` có 5 trang + 404)
- [ ] Mỗi trang đúng một `<h1>` — trang con truyền `headingLevel="h1"` cho section đầu tiên
- [ ] Ảnh dùng `<Image />`, có `width`/`height`, format WebP/AVIF
- [ ] Focus bàn phím nhìn thấy được, tôn trọng `prefers-reduced-motion`
- [ ] Meta title/description riêng từng trang, Open Graph, favicon đầy đủ
- [ ] Không có JS nào tải mà không cần thiết
- [ ] `grep -rn "MOCK:" src/` trả về rỗng

## Khi không chắc

Dừng lại và hỏi, thay vì đoán: cần thêm dependency, nội dung thật chưa có, có
vẻ cần tương tác phức tạp, yêu cầu ngoài phạm vi đã thống nhất.
