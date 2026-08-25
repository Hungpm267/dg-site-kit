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
