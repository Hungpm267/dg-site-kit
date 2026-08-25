# DG Site Kit — thiết kế (Pha 1, sớm hơn kế hoạch)

Ngày: 2026-08-25

## Bối cảnh

Theo tài liệu Notion "Lộ trình xây DG Site Kit", việc tách kit dùng chung chỉ nên
làm từ khách #4 (Pha 3). Hiện DG mới có 1 khách thật (The Future Language Centre,
repo `the-future-language-centre-website`). Người dùng chủ động quyết định dựng
kit ngay bây giờ vì đang không có việc gấp — chấp nhận đánh đổi: phần lớn kit sẽ
là skeleton chưa được kiểm chứng bằng khách thật, trừ phần Edu.

Đây **không phải** một bước "tách monorepo" (không pnpm workspace, không
Turborepo, không npm package riêng) — chỉ là một **repo template để clone**,
đúng tinh thần Pha 1/Pha 2 của lộ trình gốc nhưng dựng sẵn khung sớm hơn.

## Mục tiêu

Có một repo `dg-site-kit` để lần sau có khách mới, thay vì dựng lại từ đầu:
clone repo này, xóa nội dung ví dụ, thêm JSON khách mới, chọn layout, chỉnh theme.

## Không làm (ngoài phạm vi)

- Không pnpm workspace / Turborepo / npm package riêng.
- Không push GitHub (chỉ git local).
- Không viết mock content đầy đủ cho FnB/Retail/Landing (chỉ skeleton).
- Không sửa gì trong repo `the-future-language-centre-website` gốc — chỉ đọc và
  copy sang, giữ nguyên bản gốc.

## Cấu trúc repo

```
dg-site-kit/
├── src/
│   ├── components/
│   │   ├── sections/
│   │   │   ├── Hero.astro          (generic, từ client #1)
│   │   │   ├── WhyUs.astro         (generic, từ client #1)
│   │   │   ├── ContactBlock.astro  (generic, từ client #1)
│   │   │   ├── MapEmbed.astro      (generic, từ client #1)
│   │   │   ├── CourseIndex.astro   (Edu-specific, từ client #1)
│   │   │   ├── Activities.astro    (Edu-specific, từ client #1)
│   │   │   └── Testimonials.astro  (Edu-specific, từ client #1)
│   │   └── ui/
│   │       └── Icon.astro          (từ client #1)
│   ├── layouts/
│   │   ├── EduLayout.astro         (thật, từ client #1)
│   │   ├── LandingLayout.astro     (skeleton — header/footer/slot, TODO comment)
│   │   ├── FnBLayout.astro         (skeleton — header/footer/slot, TODO comment)
│   │   └── RetailLayout.astro      (skeleton — header/footer/slot, TODO comment)
│   ├── content/
│   │   ├── config.ts               (schema Zod, tổng quát hóa từ client #1)
│   │   └── clients/
│   │       └── _example-edu.json   (bản MOCK: hóa toàn bộ nội dung The Future)
│   ├── styles/
│   │   ├── global.css              (copy từ client #1)
│   │   └── themes/
│   │       ├── theme-teal.css      (copy nguyên trạng — theme mặc định DG)
│   │       └── theme-example.css   (copy từ theme-thefuture.css, đổi tên biến/comment generic)
│   └── pages/
│       └── index.astro             (render EduLayout + _example-edu.json — smoke test)
├── CLAUDE.md                        (tổng quát hóa từ CLAUDE.md client #1)
└── README.md                        ("cách bắt đầu khách mới")
```

## Chi tiết từng phần

### Layout thật (Edu)
Copy `EduLayout.astro` và các section Edu-specific/generic từ
`the-future-language-centre-website/src/`. Tổng quát hóa: bỏ hardcode riêng của
The Future Language Centre (nếu có), giữ nguyên props/schema interface vì đã
được kiểm chứng bằng 1 khách thật.

### Layout skeleton (Landing/FnB/Retail)
Chỉ tạo file `.astro` với cấu trúc tối thiểu (header, main slot, footer) và một
comment TODO ghi rõ: "Chưa có khách thật ở phân khúc này — định hình khi có khách
#2/#3 theo đúng nguyên tắc Rule-of-Three." Không tạo section component riêng,
không wire vào `pages/`, không cần build-test các layout này.

### Content schema & dữ liệu ví dụ
- `content/config.ts`: copy schema Zod từ client #1.
- `content/clients/_example-edu.json`: copy dữ liệu The Future Language Centre,
  nhưng **thay toàn bộ giá trị riêng khách** (tên, SĐT, địa chỉ, khóa học, giá...)
  bằng `"[MOCK: ...]"` theo đúng quy ước trong CLAUDE.md. File này chỉ để demo
  cấu trúc, không lộ dữ liệu khách thật ra kit dùng chung.

### Theme
- `theme-teal.css`: copy nguyên trạng, đây là theme mặc định DG.
- `theme-example.css`: copy từ `theme-thefuture.css`, đổi tên biến CSS/comment
  gắn với "thefuture" thành tên generic (ví dụ `--theme-primary` thay vì tên
  ngầm định gắn thương hiệu khách), làm ví dụ minh họa cách tạo theme mới.

### Tài liệu
- `README.md`: hướng dẫn quy trình bắt đầu khách mới — clone, xóa `_example-edu.json`
  và ảnh mẫu, tạo `content/clients/<ten-khach>.json` mới, chọn layout có sẵn hoặc
  tạo layout mới theo Rule-of-Three, chỉnh/tạo theme nếu khách có brand riêng.
  Không sửa component.
- `CLAUDE.md`: bản tổng quát từ CLAUDE.md client #1 — giữ 4 tiêu chí quyết định,
  quy tắc code (zero JS mặc định, không over-abstract, tách nội dung khỏi code,
  quy ước MOCK), bỏ phần "Bối cảnh" gắn riêng dự án The Future.

## Kiểm thử

`npm install` + `npm run build` (astro check + build) phải pass, dùng
`pages/index.astro` render EduLayout với `_example-edu.json` làm smoke test.
Đây là bài test duy nhất — 3 layout skeleton chưa wire vào pages nên không cần
build-test riêng cho chúng.

## Rủi ro / lưu ý

- Phần lớn giá trị của kit (FnB/Retail/Landing) chưa được kiểm chứng bằng khách
  thật — đúng như cảnh báo trong tài liệu roadmap gốc. Khi có khách #2/#3 thật,
  cần quay lại đối chiếu xem skeleton này có đúng hướng không, có thể phải viết
  lại phần lớn.
- Vì đây là làm sớm hơn kế hoạch (không phải khách #4), tránh dành quá nhiều thời
  gian đánh bóng 3 layout skeleton — mục tiêu chính của việc làm ngay bây giờ là
  có sẵn khung Edu để tái dùng nhanh cho khách #2 nếu trùng phân khúc, không phải
  hoàn thiện toàn bộ 4 phân khúc.
