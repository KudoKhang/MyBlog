# Cấu trúc dự án (Project Structure)

Dưới đây là mô tả các thành phần chính trong source code của blog:

## Các file cấu hình chính

- **`_config.yml`**: File cấu hình quan trọng nhất của Hexo. Chứa các setting như tiêu đề blog, tác giả, ngôn ngữ, timezone, và cấu hình deploy.
- **`package.json`**: File quản lý các thư viện (dependencies) và các scripts chạy lệnh tự động.
- **`scaffolds/`**: Chứa các template (khuôn mẫu) cho bài viết mới. Khi bạn chạy lệnh `hexo new`, Hexo sẽ dùng file trong này để tạo bài.

## Thư mục nội dung

- **`source/`**: Đây là nơi chứa toàn bộ nội dung bài viết và các file nguồn.
  - `_posts/`: Chứa các file Markdown (`.md`) của bài viết.
  - Các folder khác (nếu có) như `about/`, `tags/` sẽ tương ứng với các trang tĩnh.

## Thư mục giao diện

- **`themes/Chic/`**: Chứa source code của theme đang sử dụng (Chic). Nếu muốn chỉnh sửa giao diện sâu (HTML/CSS/JS), bạn sẽ sửa trong này.
  - `_config.config.yml` (hoặc `_config.yml` trong folder theme): Cấu hình riêng cho giao diện (menu, social links, avatar...).

## Thư mục được tạo ra (Generated)

- **`public/`**: Thư mục này chứa website tĩnh (HTML/CSS/JS) sau khi chạy lệnh `hexo generate`. Đây chính là nội dung sẽ được đẩy lên GitHub Pages để hiển thị cho người xem. **Không sửa trực tiếp file trong này** vì nó sẽ bị ghi đè mỗi khi build.
- **`node_modules/`**: Chứa các thư viện đã cài đặt. Không cần quan tâm chi tiết, chỉ cần biết nó được tạo ra khi chạy `npm install`.
