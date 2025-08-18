---
title: Python Template Project cho một dự án AI
date: 2023-06-03 21:11:50
tags: Technical
---

# I. Mở đầu

Chúng ta thường nghe việc tổ chức source code, viết code sạch code đẹp (clean code) là một việc rất quan trọng trong công việc viết phần mềm, một source code được tổ chức tốt, code tuân theo convention sẽ giúp cho các lập trình viên có thể phối hợp phát triển dự án một cách dễ dàng hơn, giảm thiểu conflict, dễ dàng mở rộng thêm các tính năng mới và bảo trì sau này.

Trong bài viết này mình xin giới thiệu template cho một AI project mà mình đang áp dụng cho những dự án gần đây.

# II. Cấu trúc dự án

```bash
├── checkpoints
├── conf
│   └── config.yaml
├── data
│   └── logo.png
├── docker
│   ├── Dockerfile
│   └── Dockerfile.dev
├── docs
│   └── README.md
├── python_project_template
│   └── utils
│       ├── __init__.py
│       ├── config.py
│       ├── downloader.py
│       └── logger.py
├── scripts
│   ├── helpers
│   │   └── download_checkpoints.py
│   └── inference.py
└── tests
│    └── test_read_config.py
├── requirements.txt
├── .dockerignore
├── docker-compose.yml
├── .flake8
├── .gitignore
├── pyproject.toml
├── .pre-commit-config.yaml
├── README.md
```

Dưới đây sẽ là giải thích chức năng cho từng file và module

**checkpoints**: Thư mục chứa các checkpoint của mô hình phục vụ cho quá trình inference 🦥

**conf**: Chứa các config về đường dẫn, tham số… dưới dạng yaml. Việc gọi các tham số đó ra được thực hiện bởi thư viện [hydra](https://hydra.cc/docs/intro/) ䷅.

**data**: Chứa hình ảnh, video, dataset 🌆.

**docker**: File cấu hình Dockerfile định nghĩa cách xây dựng một image Docker cho dự án 🐳.

**docs**: Để giúp cho những lập trình viên khác cùng vào phát triển, cũng như hỗ trợ việc phát triển, bảo trì lâu dài viết document cho dự án là một việc mình nghĩ rất cần thiết, đây sẽ là nơi lưu documents 📝

**python_project_template**: Đây chính là nơi chứa toàn bộ code cho module chính của bạn, trong này sẽ bao gồm modeling, utils… những phần code để khởi chạy project sẽ được bỏ vào đây 👨🏻‍💻.

**scripts**: Chứa các scripts như download checkpoints, inference model… 🏃‍♂️.

**tests**: Để đảm bảo code được chạy đúng sau mỗi lần fix, update… chúng ta nên thiết kế các unit test để kiểm tra. Việc testing sẽ được thực hiện bởi thư viện [pytest](https://pypi.org/project/pytest/) 🧪.

**requirements.txt**: Khai báo các thư viện cần thiết để khởi chạy project 🗒️.

**.dockerignore**: File này được sử dụng khi bạn sử dụng Docker để xác định các file và thư mục sẽ không được đóng gói vào container Docker 🐳.

**docker-compose.yml:** File cấu hình docker-compose giúp khởi chạy, quản lý nhiều container một cách dễ dàng nhất 🐙.

**.flake8**: Đây là file cấu hình cho công cụ kiểm tra PEP8, một quy ước viết code Python. PEP8 giúp đảm bảo rằng code của bạn tuân thủ các quy tắc về định dạng, chuẩn mã hóa và phong cách viết code 👓.

**.gitignore**: File này xác định các file và thư mục sẽ không được theo dõi bởi Git. Git sử dụng file **`.gitignore`** để bỏ qua các file không cần thiết hoặc nhạy cảm, như file tạm thời, file log, hoặc file chứa thông tin cá nhân. Chúng ta nên dùng [template gitignore](https://www.toptal.com/developers/gitignore) để việc ignore được triệt để nhất 🐒.

**pyproject.toml**: Chứa các khai báo, cấu hình cho dự án. Bao gồm thông tin, mô tả của dự án, người phát triển. Ngoài ra một số tool như [black](https://github.com/psf/black), [poetry](https://python-poetry.org/)… sẽ sử dụng config được khai báo trong đây 🗒️.

**.pre-commit-config.yaml**: pre-commit là một công cụ giúp kiểm tra và tự động refactor code theo chuẩn PEP8 convention. Các kịch bản kiểm tra sẽ được thiết lập, định nghĩa tại đây ✅.

**README.md**: Và cuối cùng là file README.md nhằm mô tả, hướng dẫn những thông tin của project. Phần này mình follow theo repo [Best-README-Template](https://github.com/othneildrew/Best-README-Template) (~11k⭐)

Trên đây là template cho một AI module project mà mình đang áp dụng, tùy vào tính chất dự án mà bạn đang thực hiện, có thể thêm hoặc bớt để cho phù hợp nhất. Nếu bạn có ideas gì để giúp template này hoàn thiện hơn, rất welcome các bạn contributing để repo hoàn hoàn thiện hơn 🙆🏻‍♂️

# III. References

- [python-project-template](https://github.com/KudoKhang/python-project-template)
- [facetorch](https://github.com/tomas-gajarsky/facetorch) (template mình xây dựng học hỏi từ repo này mọi người nhé)
