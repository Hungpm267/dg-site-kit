# DG Site Kit

Repo template để clone khi bắt đầu khách mới thuộc phân khúc **Nhóm A** (website
giới thiệu, không backend riêng). Không phải monorepo, không phải npm package —
chỉ là một repo Astro proven, sẵn sàng để copy.

Xem lý do và phạm vi ở `docs/superpowers/specs/2026-08-25-dg-site-kit-design.md`.

## Trạng thái từng layout

| Layout | Trạng thái | Ghi chú |
|---|---|---|
| `EduLayout` | **Đã proven** — copy từ khách #1 (trung tâm ngoại ngữ) | Website 5 trang + 404, không phải one-page nữa |
| `LandingLayout` | Skeleton, chưa có khách thật | Định hình khi có khách #2/#3 phân khúc landing 1 CTA |
| `FnBLayout` | Skeleton, chưa có khách thật | Định hình khi có khách #2/#3 phân khúc quán cafe/nhậu |
| `RetailLayout` | Skeleton, chưa có khách thật | Định hình khi có khách #2/#3 phân khúc bán lẻ |

## Cấu trúc trang của `EduLayout` (đa trang)

Cập nhật 2026-08-25 theo khách #1: site không còn là one-page cuộn dọc, mà là
5 trang tĩnh + trang lỗi. Mỗi file `.astro` trong `src/pages/` gọi cùng bộ
section component, chỉ khác cách phối/cắt dữ liệu — không có routing động
(`[slug].astro`), vì 5 trang cố định thì mở file nào biết trang đó có gì.

| URL | File | Nội dung |
|---|---|---|
| `/` | `index.astro` | Hero, 3 khóa nổi bật, 3 lý do, 1 cảm nhận, 4 hoạt động, CTA — bản tóm tắt, KHÔNG lặp lại nội dung trang con |
| `/khoa-hoc` | `khoa-hoc.astro` | Đủ danh sách khóa học |
| `/ve-chung-toi` | `ve-chung-toi.astro` | `About` (nếu có) + đủ "Vì sao chọn" |
| `/hoat-dong` | `hoat-dong.astro` | Đủ hoạt động + carousel cảm nhận |
| `/lien-he` | `lien-he.astro` | CTA, liên hệ, cơ sở, bản đồ |
| `/404` | `404.astro` | Trang lỗi, link về 4 trang trên |

Hai quy tắc bắt buộc khi đụng vào các trang này:

- **Mỗi trang đúng một `h1`.** Trang chủ lấy `h1` từ `Hero`; mỗi trang con
  không có `Hero` nên section đầu tiên nhận prop `headingLevel="h1"` (mặc định
  của mọi section là `h2`).
- **Trang chủ không lặp lại nội dung trang con.** Cắt dữ liệu ngay trong
  `index.astro` (`.slice()`, `.filter()`) rồi truyền vào đúng component cũ —
  không tạo component "phiên bản trang chủ" riêng. `CourseIndex`, `WhyUs`,
  `Activities` nhận thêm prop `more?: { label, href }` cho link "xem tất cả",
  chỉ trang chủ truyền.

`about` là field optional trong schema — khách chưa có nội dung giới thiệu thì
`ve-chung-toi.astro` tự bỏ qua `About`, dồn `h1` sang `WhyUs`. Không dựng khối
rỗng, không bịa nội dung cho đủ trang.

`EduLayout` nhận thêm `title?`/`description?` để mỗi trang có SEO riêng; không
truyền thì rơi về `seo` trong JSON. Điều hướng trong `EduLayout` dùng path
(`/khoa-hoc`...) chứ không phải anchor, đánh dấu trang đang xem bằng
`aria-current="page"` so khớp `Astro.url.pathname`.

## Bắt đầu khách mới (phân khúc Edu — layout đã proven)

1. Clone repo này sang thư mục dự án khách mới, `npm install`.
2. Xóa `src/content/clients/_example-edu.json` và 5 ảnh mẫu trong `src/assets/`
   (`placeholder-*.svg`). Thay luôn `public/favicon.svg` bằng logo/favicon riêng
   của khách — nếu không, site khách vẫn hiện favicon teal mặc định của DG.
3. Thêm ảnh thật của khách vào `src/assets/`.
4. Tạo `src/content/clients/<ten-khach>.json` theo đúng schema ở
   `src/content.config.ts`. Nội dung chưa có → bọc `"[MOCK: ...]"`, không bịa
   số/giá/địa chỉ nghe hợp lý như thật.
5. Đổi `'_example-edu'` thành slug file JSON mới trong `getEntry('clients', ...)`
   ở **cả 6 file** `src/pages/*.astro` (`index`, `khoa-hoc`, `ve-chung-toi`,
   `hoat-dong`, `lien-he`, `404`).
6. Nếu khách có bộ màu riêng: copy `src/styles/themes/theme-teal.css` hoặc
   `theme-example.css` thành `theme-<khach>.css`, đổi giá trị token (giữ nguyên
   TÊN token), sửa dòng `@import` trong `src/styles/global.css`. Đồng thời sửa
   `content="..."` của thẻ `<meta name="theme-color">` trong `EduLayout.astro`
   cho khớp `--color-brand-900` mới.
7. Sửa `site` trong `astro.config.mjs` sang domain thật khi khách chốt.
8. Trước khi build production: `npm run build && npm run verify` phải trả về PASS.
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
