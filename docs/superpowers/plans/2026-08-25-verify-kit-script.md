# Plan: automated quality-gate script for dg-site-kit

Ngày: 2026-08-25
Spec: không có spec riêng — quy chiếu theo `CLAUDE.md` mục "Sàn chất lượng bắt buộc"
tại root repo `dg-site-kit`.

## Vấn đề

`CLAUDE.md` liệt kê một checklist bắt buộc trước khi giao khách (mọi trang
đúng 1 `h1`, không còn `MOCK:` trong `src/`, v.v.) nhưng checklist này hoàn
toàn thủ công — người dùng phải tự chạy `grep` và tự đếm `<h1>` trong từng
trang `dist/`. Dễ quên, không lặp lại được, không chạy tự động khi có khách
mới clone kit.

Cả 2 mục sau đã có tiền lệ được kiểm tra tay ngay trong phiên làm việc trước
(gõ `grep -rn "MOCK:" src/` và đếm `<h1>` bằng vòng lặp shell) — nay đóng gói
lại thành 1 script Node chạy được lặp lại, không cần dependency mới (chỉ dùng
`node:fs`, `node:path`).

## Phạm vi

**Có:**
- Một script Node độc lập (`scripts/verify-kit.mjs`) kiểm tra 2 điều:
  1. `src/` không còn chuỗi `MOCK:` nào (glob đệ quy, đọc UTF-8, báo từng
     file + số dòng nếu có match — giống định dạng output của `grep -n`).
  2. Mọi file `*.html` trong `dist/` (đệ quy) chứa đúng **1** thẻ `<h1` — báo
     rõ file nào có 0 hoặc ≥2, không chỉ báo "fail" chung chung.
- Wire thành script `npm run verify` trong `package.json` — **không** đổi
  script `build` hiện có (không được làm build fail khi đang phát triển với
  nội dung MOCK — verify là bước riêng, chạy trước khi giao khách).
- Cập nhật `README.md` và `CLAUDE.md`: thay các dòng hướng dẫn chạy tay
  (`grep -rn "MOCK:" src/`, đếm `<h1>` thủ công) bằng hướng dẫn chạy
  `npm run verify`.

**KHÔNG bao gồm:**
- Không thêm test framework (Vitest, Jest...) — đây không phải unit test,
  là một kiểm tra quy ước nội dung/HTML, dùng script thuần đủ.
- Không chạy Lighthouse tự động (cần Chrome headless — công cụ ngoài, ngoài
  phạm vi 1 script Node đơn giản).
- Không tự động hóa việc build trước khi verify — script `verify` giả định
  `dist/` đã tồn tại (người dùng tự chạy `npm run build` trước, hoặc CI làm
  điều đó). Nếu `dist/` không tồn tại, script báo lỗi rõ ràng, không tự ý
  chạy build giùm (build có thể mất hàng chục giây, không nên ẩn trong lệnh
  verify).

## Global Constraints

- Không thêm dependency mới vào `package.json` (đúng CLAUDE.md của kit) —
  chỉ dùng Node built-in modules (`node:fs`, `node:path`, `node:process`).
- Script phải chạy được bằng `node scripts/verify-kit.mjs` trực tiếp (ESM,
  khớp `"type": "module"` đã có trong `package.json`), không cần build/transpile.
- Exit code: `0` nếu cả 2 kiểm tra đều pass, `1` nếu có bất kỳ vi phạm nào —
  để dùng được trong CI sau này (không tự thêm CI trong plan này).
- Output tiếng Việt, khớp giọng văn hiện có trong `CLAUDE.md`/`README.md` của
  kit (ngắn gọn, có bullet, không hoa mỹ).
- Không sửa bất kỳ file trong `src/` hay nội dung example client — plan này
  chỉ thêm tooling.

## Task 1: Viết `scripts/verify-kit.mjs` và wire vào `package.json`

Tạo file mới `scripts/verify-kit.mjs` (thư mục `scripts/` chưa tồn tại ở
root repo, tạo mới) với nội dung sau, đúng cấu trúc, đúng thông điệp:

```js
#!/usr/bin/env node
// Kiểm tra sàn chất lượng bắt buộc trước khi giao khách — xem CLAUDE.md.
// Chạy: npm run verify (yêu cầu đã `npm run build` trước — không tự build giùm).

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

function walk(dir, filterExt) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      out.push(...walk(full, filterExt));
    } else if (extname(full) === filterExt) {
      out.push(full);
    }
  }
  return out;
}

function checkMock() {
  const files = walk('src', '.json')
    .concat(walk('src', '.astro'))
    .concat(walk('src', '.svg'))
    .concat(walk('src', '.ts'))
    .concat(walk('src', '.css'));

  const hits = [];
  for (const file of files) {
    const lines = readFileSync(file, 'utf8').split('\n');
    lines.forEach((line, i) => {
      if (line.includes('MOCK:')) {
        hits.push(`${file}:${i + 1}`);
      }
    });
  }
  return hits;
}

function checkH1() {
  let distFiles;
  try {
    distFiles = walk('dist', '.html');
  } catch {
    return { error: 'Không tìm thấy dist/ — chạy `npm run build` trước.' };
  }

  const problems = [];
  for (const file of distFiles) {
    const html = readFileSync(file, 'utf8');
    const count = (html.match(/<h1[\s>]/g) ?? []).length;
    if (count !== 1) {
      problems.push(`${file}: ${count} thẻ <h1> (cần đúng 1)`);
    }
  }
  return { problems };
}

let ok = true;

console.log('— Kiểm tra "MOCK:" còn sót trong src/ —');
const mockHits = checkMock();
if (mockHits.length > 0) {
  ok = false;
  console.log(`✗ Còn ${mockHits.length} dòng chứa "MOCK:":`);
  mockHits.forEach((h) => console.log(`  ${h}`));
} else {
  console.log('✓ Không còn nội dung MOCK trong src/');
}

console.log('\n— Kiểm tra mỗi trang đúng 1 <h1> —');
const h1Result = checkH1();
if (h1Result.error) {
  ok = false;
  console.log(`✗ ${h1Result.error}`);
} else if (h1Result.problems.length > 0) {
  ok = false;
  console.log(`✗ ${h1Result.problems.length} trang sai số lượng <h1>:`);
  h1Result.problems.forEach((p) => console.log(`  ${p}`));
} else {
  console.log('✓ Mọi trang trong dist/ đều đúng 1 <h1>');
}

console.log('');
if (!ok) {
  console.log('Kết quả: FAIL — sửa các mục trên trước khi giao khách.');
  process.exit(1);
} else {
  console.log('Kết quả: PASS — sẵn sàng giao khách (về 2 mục này).');
  process.exit(0);
}
```

Sau đó thêm script vào `package.json`, đặt sau `"preview"`:

```json
"verify": "node scripts/verify-kit.mjs"
```

**Test thủ công bắt buộc trước khi coi task hoàn thành** (ghi lại output
trong báo cáo):
1. Chạy `npm run build` rồi `npm run verify` trên `_example-edu.json` hiện
   tại (chứa nhiều `MOCK:` có chủ đích) → script phải **FAIL**, liệt kê đúng
   số dòng MOCK, exit code 1 (`echo $?` sau khi chạy để xác nhận).
2. Xác nhận phần kiểm tra `<h1>` báo **PASS** trong cùng lần chạy đó (6 trang
   hiện tại của kit đều đã đúng 1 h1 — xem lịch sử build gần nhất) — tức là
   2 kiểm tra độc lập với nhau, MOCK fail không che mất kết quả h1.
3. Xóa tạm `dist/` (`rm -rf dist`) và chạy `npm run verify` lại → phải báo
   đúng thông điệp "Không tìm thấy dist/..." và exit code 1, KHÔNG crash với
   stack trace Node thô.
4. Phục hồi lại bằng `npm run build` sau khi test xong (không để `dist/`
   thiếu khi task kết thúc — dù `dist/` bị gitignore nên không ảnh hưởng git
   status, nhưng để lại trạng thái sạch cho task sau).

Không cần viết vào file JSON hay sửa bất kỳ nội dung `src/` nào — MOCK vẫn
còn trong `_example-edu.json` là đúng thiết kế (đây là file mẫu, không phải
production).

## Task 2: Cập nhật README.md và CLAUDE.md để dùng `npm run verify`

Trong `CLAUDE.md`, mục "Sàn chất lượng bắt buộc (mọi site trước khi giao
khách)":
- Thay dòng `- [ ] Mỗi trang đúng một <h1> — trang con truyền headingLevel="h1" cho section đầu tiên`
  và dòng `- [ ] grep -rn "MOCK:" src/ trả về rỗng` bằng **một** dòng duy nhất:
  `- [ ] npm run build && npm run verify trả về PASS (kiểm tra MOCK còn sót +
  mỗi trang đúng 1 <h1>)`
- Giữ nguyên các dòng checklist khác (Lighthouse, responsive, focus, ảnh...)
  — verify script không kiểm tra những mục đó, đừng ngụ ý là nó có.

Trong `README.md`, mục "Bắt đầu khách mới (phân khúc Edu...)", bước hiện có
`8. Trước khi build production: grep -rn "MOCK:" src/ phải trả về rỗng.` —
đổi thành:
`8. Trước khi build production: npm run build && npm run verify phải trả về
PASS.`

Không đụng phần nào khác của 2 file này. Đây là task chỉ sửa docs, không sửa
code — nếu thấy cần sửa thêm chỗ nào khác trong 2 file, dừng lại, không tự ý
mở rộng phạm vi.

**Xác nhận trước khi coi task hoàn thành:** `grep -n "grep -rn" README.md
CLAUDE.md` phải trả về rỗng (không còn hướng dẫn chạy `grep -rn` tay ở cả 2
file) — đính kèm output của lệnh grep này (rỗng) trong báo cáo.
