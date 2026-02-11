# Git Workflow & Deployment

Quy trình làm việc chuẩn để lưu trữ code và cập nhật website.

## 1. Lưu trữ Source Code (Git Workflow)

Mỗi khi viết bài xong hoặc sửa cấu hình, bạn cần lưu lại thay đổi lên GitHub repository (nhánh chứa source, thường là `master` hoặc `main` hoặc `source`).

```bash
# 1. Kiểm tra trạng thái thay đổi
git status

# 2. Thêm tất cả thay đổi vào Git
git add .

# 3. Commit (lưu) thay đổi với ghi chú
git commit -m "Thêm bài viết mới về ReactJS"

# 4. Đẩy lên server GitHub
git push origin master
```
*(Lưu ý: Thay `master` bằng `main` hoặc tên nhánh chính của bạn nếu khác).*

## 2. Deploy lên GitHub Pages

Để người khác đọc được bài viết mới trên internet (ví dụ: `kudokhang.github.io`), bạn cần **Deploy**.

**Cách 1: Chạy từng lệnh**

```bash
# Xóa file build cũ để tránh lỗi cache
hexo clean

# Build ra file tĩnh (HTML/CSS) vào folder public
hexo generate

# Đẩy folder public lên nhánh gh-pages của repository
hexo deploy
```

**Cách 2: Chạy lệnh gộp (Khuyên dùng)**

```bash
hexo clean && hexo g -d
```
*(Lệnh này sẽ clean, sau đó generate và deploy luôn).*

### Lưu ý quan trọng:
- Lệnh `git push` chỉ lưu code nguồn (file .md, config).
- Lệnh `hexo deploy` mới thực sự cập nhật nội dung hiển thị trên website.
- Bạn nên thực hiện cả 2 bước (Git Push & Hexo Deploy) để đảm bảo an toàn dữ liệu và cập nhật web.
