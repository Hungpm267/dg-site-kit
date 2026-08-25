# DG Site Kit

Repo template để clone khi bắt đầu khách mới thuộc phân khúc **Nhóm A** (website
giới thiệu, không backend riêng). Không phải monorepo, không phải npm package —
chỉ là một repo Astro proven, sẵn sàng để copy.

Xem lý do và phạm vi ở `docs/superpowers/specs/2026-08-25-dg-site-kit-design.md`.

## Trạng thái từng layout

| Layout | Trạng thái | Ghi chú |
|---|---|---|
| `EduLayout` | **Đã proven** — copy từ khách #1 (trung tâm ngoại ngữ) | Dùng ngay cho khách Edu tiếp theo |
| `LandingLayout` | Skeleton, chưa có khách thật | Định hình khi có khách #2/#3 phân khúc landing 1 CTA |
| `FnBLayout` | Skeleton, chưa có khách thật | Định hình khi có khách #2/#3 phân khúc quán cafe/nhậu |
| `RetailLayout` | Skeleton, chưa có khách thật | Định hình khi có khách #2/#3 phân khúc bán lẻ |

## Bắt đầu khách mới (phân khúc Edu — layout đã proven)

1. Clone repo này sang thư mục dự án khách mới, `npm install`.
2. Xóa `src/content/clients/_example-edu.json` và 5 ảnh mẫu trong `src/assets/`
   (`placeholder-*.svg`).
3. Thêm ảnh thật của khách vào `src/assets/`.
4. Tạo `src/content/clients/<ten-khach>.json` theo đúng schema ở
   `src/content.config.ts`. Nội dung chưa có → bọc `"[MOCK: ...]"`, không bịa
   số/giá/địa chỉ nghe hợp lý như thật.
5. Sửa `src/pages/index.astro`: đổi `'_example-edu'` trong `getEntry('clients', ...)`
   thành slug file JSON mới.
6. Nếu khách có bộ màu riêng: copy `src/styles/themes/theme-teal.css` hoặc
   `theme-example.css` thành `theme-<khach>.css`, đổi giá trị token (giữ nguyên
   TÊN token), sửa dòng `@import` trong `src/styles/global.css`. Đồng thời sửa
   `content="..."` của thẻ `<meta name="theme-color">` trong `EduLayout.astro`
   cho khớp `--color-brand-900` mới.
7. Sửa `site` trong `astro.config.mjs` sang domain thật khi khách chốt.
8. Trước khi build production: `grep -rn "MOCK:" src/` phải trả về rỗng.
9. **Không sửa component nào** (`src/components/`, `src/layouts/EduLayout.astro`)
   trừ khi cả 3 khách Edu liên tiếp cùng cần một thay đổi giống nhau
   (nguyên tắc Rule-of-Three).

## Bắt đầu khách mới (phân khúc Landing/FnB/Retail — layout còn là skeleton)

Chưa có gì để "chỉ đổi JSON" ở đây — các layout này chưa được kiểm chứng bằng
khách thật. Khi có khách #1 thật của một trong ba phân khúc này: viết
`content.config.ts` riêng cho phân khúc đó, dựng section components theo đúng
nhu cầu khách đó (không cố tổng quát hóa trước), rồi mới cân nhắc đưa layout đó
vào trạng thái "đã proven" như `EduLayout` — sau khi dùng thật lần thứ ba.

## Lệnh

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # astro check + build ra dist/
npm run preview
```
