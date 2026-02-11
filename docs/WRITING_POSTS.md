# Hướng dẫn viết bài (Writing Posts)

## 1. Tạo bài viết mới

Mở terminal tại thư mục gốc dự án và chạy lệnh:

```bash
hexo new "Tiêu đề bài viết của bạn"
```

Ví dụ:
```bash
hexo new "Hướng dẫn học ReactJS cơ bản"
```

Lệnh này sẽ tạo ra một file `.md` mới trong thư mục `source/_posts/` với tên file được chuẩn hóa (ví dụ: `huong-dan-hoc-reactjs-co-ban.md`).

## 2. Soạn thảo nội dung

Mở file vừa tạo trong `source/_posts/` bằng editor yêu thích (VS Code, Notepad...).

Phần đầu file là **Front-matter**, chứa thông tin bài viết:

```yaml
---
title: Hướng dẫn học ReactJS cơ bản
date: 2023-10-27 10:00:00
tags: [ReactJS, JavaScript, Frontend]
categories: Programming
---
```

Phía dưới `---` là nơi bạn viết nội dung bài bằng cú pháp Markdown.

### Một số cú pháp Markdown cơ bản:

- **In đậm**: `**nội dung**`
- *In nghiêng*: `*nội dung*`
- Tiêu đề: `# H1`, `## H2`, `### H3`...
- Link: `[text hiển thị](link url)`
- Ảnh: `![mô tả ảnh](link ảnh)`
- Code block:
  \`\`\`javascript
  console.log("Hello World");
  \`\`\`

## 3. Chèn ảnh

Để chèn ảnh, bạn nên copy file ảnh vào thư mục `source/images/` (tạo nếu chưa có) và dẫn link:

```markdown
![Mô tả ảnh](/images/ten-anh.png)
```

## 4. Xem trước (Preview)

Để xem bài viết hiển thị thế nào trên web local:

```bash
hexo server
```
(hoặc `hexo s`)

Truy cập [http://localhost:4000](http://localhost:4000) để xem.
