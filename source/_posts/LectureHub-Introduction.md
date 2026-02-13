---
title: LectureHub Introduction
date: 2025-08-18 14:19:32
tags:
    - Technical
    - Production
categories:
    - LectureHub
---

## I. Mở đầu

Ngoài là một software engineer mình còn có nghề tay trái dạy lập trình cho các bạn nhỏ cấp 1, trong quá trình giảng dạy mình thường phải tìm bài tập cho các bạn nhỏ luyện tập, hai nguồn tài liệu mình thường tham khảo nhất đó là [codemath][codemath_url] và [lqdoj][lqdoj_url] (cả hai đều là hệ thống ra đề và chấm bài online được xây dựng dựa trên mã nguồn mở DMOJ). Nói là code cấp 1 nhưng không có nghĩa là bài nào cũng dễ, phải thừa nhận có khá nhiều bài toán hóc búa khiến mình phải mất rất nhiều thời gian để tìm ra lời giải (cũng có nhiều khi tìm mãi mà không ra 😅). Nếu đổi lại vị trí của người giải bài là một học sinh cấp 1 thì rất có thể có gặp các tình huống này:

- Làm mãi không AC được một bài --> Chán nản, từ bỏ luyện tập.

- Google thì khả năng sẽ không có, đăng lên các group hỏi bài như Facebook thì khả năng cũng không ai rảnh để ngồi giải cho.

- Hỏi AI thì sẽ hên xui vì AI không phải bài nào cũng ra, chưa kể đến việc học sinh có thể sớm bị phụ thuộc vào AI dẫn tới nhiều hệ quả lười tư duy, sáng tạo.

Không chỉ học sinh gặp khó khăn, mà ngay cả giáo viên khi chuẩn bị bài giảng, hướng dẫn học sinh cũng mất khá nhiều thời gian để làm bài, viết lời giải và minh họa phù hợp.

Đó chính là **nỗi đau thực tế** mà mình muốn giải quyết bằng **LectureHub**.

## II. LectureHub là gì?

![lecturehub homepage][lecturehub_homepage]
<center><i>Giao diện trang web</i></center>

[LectureHub][lecturehub_url] là một nền tảng giúp học sinh và giáo viên **tra cứu code, bài giảng, và lời giải** cho các nền tảng ra bài toán tin học.

Điểm đặc biệt của LectureHub so với việc tự tìm kiếm rải rác trên Google hoặc hỏi AI:

- 👨‍💻 **Code bài giải chính xác**: Code đã được AC trên chính nền tảng ra đề.
- 🎓 **Không chỉ là code bài giải**: Nền tảng sẽ bao gồm cả bài giảng, sơ đồ thuật toán, trợ lý AI hỏi đáp để giúp cho người dùng có thể thực hiểu được bài toán.
- 📂 **Thao tác đơn giản, giao diện thân thiện**: Chỉ với mã đề và một click chuột bạn sẽ có ngay toàn bộ lời giải cho bài toán.
- 🌐 **Khả năng mở rộng**: không chỉ dừng lại ở tra cứu, mà có thể trở thành kho tài liệu học tập lớn cho cộng đồng.

LectureHub tự hào là nền tảng đầu tiên đi đầu trong việc xây dựng kho bài giải cho các bài toán tin ở Việt Nam.

## III. Vì sao mình xây dựng LectureHub?

![Developing][meme_dog_typing]

Mình từng là một người học đến người dạy, trong suốt quá trình đó, mình nhận thấy:

- Việc học tin học thường tốn nhiều thời gian **tìm kiếm nguồn tài liệu** đáng tin cậy.

- Các nền tảng như Codemath, LQDOJ… tập trung vào **ra đề & chấm bài**, nhưng lại thiếu một **hệ sinh thái tra cứu và học tập liền mạch**.

[LectureHub][lecturehub_url] ra đời từ nhu cầu cá nhân đó. Nhưng đồng thời, dự án này cũng là cơ hội để mình:

- Rèn luyện và showcase những kỹ năng phát triển một sản phầm phần mềm hoàn chỉnh, bao gồm:
  - Phân tích nhu cầu và thiết kế hệ thống.
  - Kỹ năng Coding, chọn và áp dụng các stack phù hợp.
  - Kỹ năng triển khai sản phẩm, giám sát, bảo trì và nâng cấp.
  - Cách quảng bá sản phẩm, các chiến lược marketing xây dựng thương hiệu, thu hút người dùng.

- Ghi chép lại hành trình phát triển, biến nó thành một **series chia sẻ kiến thức trên blog cá nhân**.

- Đóng góp giá trị cho cộng đồng học sinh, giáo viên và developer.

## IV. Giá trị cốt lõi LectureHub mang lại

- 👩‍🎓 **Với học sinh**: tiết kiệm thời gian tìm kiếm, học thêm nhiều cách giải, dễ dàng so sánh các tư duy.

- 👨‍🏫 **Với giáo viên**: có thêm nguồn tư liệu, ví dụ minh họa cho bài giảng.

- 👨‍💻 **Với developer**: thông qua series blog, có thể học hỏi về **system design, backend, cloud, AI** từ một dự án thực tế.

## V. Roadmap phát triển

[LectureHub][lecturehub_url] không chỉ dừng lại ở phiên bản MVP. Mình đã vạch ra một lộ trình như sau:

- **Giai đoạn 1**: Xây dựng kho code bài giải.

- **Giai đoạn 2**: Xây dựng webapp để thuận tiện tra cứu code/bài giảng.

- **Giai đoạn 3**: Tích hợp **AI hỗ trợ học tập** – giải thích bài toán.

- **Giai đoạn 4**: Mở rộng thành **cộng đồng chia sẻ**: học sinh, giáo viên, developer có thể cùng nhau đóng góp.

## VI. Series blog này có gì?

Song song với việc phát triển [LectureHub][lecturehub_url], mình sẽ viết một **series blog** để chia sẻ hành trình xây dựng:

1. **Thiết kế hệ thống** – Kiến trúc tổng thể của LectureHub. Bao gồm: Repo Design, Database Design, Architecture Design

2. **Deployment** – Ứng dụng sẽ được triển khai trên AWS cloud, vì vậy mình cũng chia sẻ thêm về các AWS Service phổ biến cho việc xây dựng một website.

3. **Ứng dụng AI** – Tích hợp RAG, chatbot hỗ trợ giải thích bài toán.

4. **Các tính năng phụ trợ** - Tạo bộ đề ngẫu nhiên, code bài giải ở nhiều ngôn ngữ khác nhau, tạo slide bài giảng... (nhóm chức năng này sẽ triển khai sau cùng tùy vào hứng thú của người dùng)

Mỗi bài viết sẽ hướng tới **note lại các kiến thức kỹ thuật**, vừa mang lại **giá trị học tập cho cộng đồng**.

## VII. Lời kết

[LectureHub][lecturehub_url] là dự án xuất phát từ nhu cầu cá nhân, nhưng mình tin rằng nó có thể mang lại giá trị lớn cho cộng đồng học sinh, giáo viên, và những ai yêu thích tin học.

Series blog này sẽ là hành trình từ **ý tưởng → thiết kế → code → deploy → tích hợp với công nghệ AI**.
Nếu bạn quan tâm đến backend, cloud, hay AI trong giáo dục, hãy theo dõi để cùng khám phá.

👉 Cùng đón chờ bài viết đầu tiên về series này nhé: **LectureHub Overview – Thiết kế hệ thống**.

<!-- <figure style="text-align:center;">
  <img src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExYzV2NnF3emkwNmZoN3RiYnlsNXBocm80bGV2eTIwZ202aGNocnZyaiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/BDQmMy3ZM8sgRNFkhe/giphy.gif"
       alt="Chờ đợi bài viết đầu tiên của series LectureHub">
  <figcaption><i>Please waitting...</i></figcaption>
</figure> -->

![Meme][meme_waitting]
<center><i>Please waitting...</i></center>

## VIII. References

- Website: https://www.lecturehub.tech
- Github: https://github.com/LectureHubTeam
- Fanpage: https://www.facebook.com/profile.php?id=61579127122566

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[codemath_url]: https://laptrinh.codemath.vn/problems/
[lqdoj_url]: https://lqdoj.edu.vn/problems/
[lecturehub_url]: https://www.lecturehub.tech/
[lecturehub_homepage]: https://i.postimg.cc/N0WLckfz/lecturehub-homepage.png
[meme_waitting]: https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExYzV2NnF3emkwNmZoN3RiYnlsNXBocm80bGV2eTIwZ202aGNocnZyaiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/BDQmMy3ZM8sgRNFkhe/giphy.gif
[meme_dog_typing]: https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExcjQ4eWo2MTAzdHdxeW5iajdqZmMwaGtkM3hvMHVranB0ODRmeDl3ciZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/mCRJDo24UvJMA/giphy.gif
