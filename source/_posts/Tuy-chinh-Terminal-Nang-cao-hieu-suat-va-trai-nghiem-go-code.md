---
title: 'Tùy chỉnh Terminal: Nâng cao hiệu suất và trải nghiệm gõ code'
date: 2024-01-06 16:20:37
tags:
    - Performance
    - Technical
---

## I. Mở đầu

Là một lập trình viên, terminal chắc chắn là một công cụ mà bạn sẽ phải thao tác làm việc với nó mỗi ngày, tuy nhiên với terminal mặc định trông nó sẽ khá kùi pắp, giao diện xấu và chức năng hạn chế. Trong bài viết này mình sẽ hướng dẫn các bạn cách:

- Tùy biến terminal để nó trông màu mè, đẹp đẽ hơn.
- Cung cấp một số tips giúp nâng cao hiệu suất khi làm việc với terminal.

## II. Tùy chỉnh Terminal

Như đã nói từ đầu, terminal mặc định sẽ rất hạn chế chức năng và khả năng tùy chỉnh từ người dùng vì vậy việc đầu tiên chúng ta cần làm là thay ngay một terminal mới 🫵

Terminal mới mình chọn ở đây là `Tabby`, vì một số lý do sau:

- Đẹp
- Tương thích trên cả Mac và Linux (trước đó mình xài `Iterm2`, cũng khá đẹp nhưng chỉ có thể cài đặt trên Mac)
- Quản lý profile kết nối tới server

![[https://tabby.sh/](https://tabby.sh/)][tabby_image]

[https://tabby.sh/](https://tabby.sh/)

Sau khi cài đặt, terminal của chúng ta chưa thể màu mè được như hình minh họa từ trang chủ Tabby đâu, để được như vậy chúng ta cần cài thêm ZSH thay cho Shell mặc định và themes, plugins cho nó nữa.

### Bước 1: Cài đặt ZSH

Trong bài này mình sẽ hướng dẫn cài đặt trên Ubuntu, những hệ điều hành khác các bạn hoàn toàn có thể làm tương tự nhé.

Đầu tiên là cài đặt ZSH:

```jsx
sudo apt-get update
sudo apt-get install zsh
```

Đặt ZSH làm Shell mặc định

```jsx
chsh -s $(which zsh)
```

Sau khi đổi xong các bạn cần restart terminal để thay đổi được áp dụng. Lần đầu vào lại ZSH sẽ hỏi chúng ta về việc khởi tạo file configuration.

![ZSH][zsh_image]

Tại đây chúng ta chọn option 0 để tạo một file config rỗng vì phần config chúng ta sẽ dùng của oh-my-zsh framework sẽ được cài đặt ngay sau đây

### Bước 2: Cài đặt Oh-my-zsh framework

Oh-my-zsh là một framework mở rộng cho Zsh, nó cung cấp một bộ sưu tập các tính năng, themes và plugins để tùy chỉnh và nâng cao trải nghiệm sử dụng Zsh

Để cài đặt chúng ta chỉ cần:

```bash
sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

Sau khi cài đặt chúng ta sẽ thấy một giao diện như sau.

![Oh-my-zsh][oh_my_zsh_image]

Oh-my-zsh sẽ sử dụng file config `.zshrc` đã được khởi tạo trước đó và áp dụng những config thay đổi thêm vào.

Tới đây terminal của chúng ta đã trông màu mè hơn rất nhiều tuy nhiên vẫn chưa hết, chúng ta có thể nâng cao trải nghiệm với việc thay đổi themes và cài đặt thêm plugins

### Bước 3: Cài đặt themes

Themes mặc định của Oh-my-zsh là `robbyrussell` vì giao diện nó khá sơ sài nên chúng ta cần đổi qua theme màu mè khác để nó có thể hiển thị thêm nhiều thông tin.

Theme mình đang xài là `powerlevel10k`, để cài đặt chúng ta cần tải nó về với lệnh sau:

```bash
git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k
```

Tiếp đó, thay đổi nó trong config bằng cách mở file `~/.zshrc` và tìm tới dòng `ZSH_THEM=”robbyrussell”` sửa thành:

```bash
ZSH_THEME="powerlevel10k/powerlevel10k”
```

Để thay đổi có hiệu lực chúng ta có thể restart terminal hoặc:

```bash
source ~/.zshrc
```

Khi theme `powerlevel10k` được áp dụng thành công, chúng ta sẽ tiến hành tùy chỉnh từng bước từng bước theo hướng dẫn:

![powerlevel10k][p10k_image]

<aside>
💡 Nếu thiết lập xong mà muốn thay đổi, bạn có thể gõ `p10k configure` để tiến hành thiết lập lại

</aside>

Các bạn có thể thử nghiệm thêm các theme khác [tại đây](https://github.com/ohmyzsh/ohmyzsh/wiki/Themes).

### Bước 4: Cài đặt plugins

ZSH sẽ giúp việc thao tác với terminal thuận tiện hơn với kho plugins đa dạng. Sau đây mình sẽ thực hiện cài 2 plugins mà mình nghĩ bắt buộc phải có cho terminal.

### Đầu tiên: zsh-autosuggestions

Plugin này sẽ gợi ý command dựa trên lịch sử gõ của bạn, để cài đặt đầu tiên ta cần tải nó về:

```bash
git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
zsh-autosuggestions
```

Khai báo plugin trong config, các bạn mở file  `~/.zshrc` và tìm tới dòng:

```bash
plugins=(git)
```

Thêm `zsh-autosuggestions` vào:

```bash
plugins=(git zsh-autosuggestions)
```

Để thay đổi có hiệu lực chúng ta lại thực hiện:

```bash
source ~/.zshrc
```

<aside>
💡 File config được viết bằng BashScript các bạn chú ý không thêm dấu `,` kẻo gây lỗi nhé.

</aside>

### Tiếp theo: zsh-syntax-highlighting

`zsh-syntax-highlighting` giúp hiển thị các thành phần trong command với các màu khác nhau để thuận tiện cho việc gõ, ngoài ta những command không đúng sẽ được hiện màu đỏ, việc này sẽ giúp chúng ta nhìn ra sớm để kịp sửa đổi. Việc cài đặt hoàn toàn tương tự như trên, đầu tiên chúng ta cần tải plugin này về máy:

```bash
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
zsh-syntax-highlighting
```

Khai báo nó trong file config `~/.zshrc`:

```bash
plugins=(git zsh-autosuggestions zsh-syntax-highlighting)
```

Và cuối cùng là:

```bash
source ~/.zshrc
```

Như vậy là bạn đã biết cách cài một plugin cho ZSH, kho plugins cho ZSH rất nhiều, bạn có thể xem và cài thử [tại đây](https://github.com/ohmyzsh/ohmyzsh/wiki/Plugins).

## III. Nâng cao hiệu suất làm việc với shortcut và alias

### Shortcut cho Terminal

Phím tắt giúp bạn thực hiện các thao tác một cách nhanh chóng và hiệu quả hơn so với việc sử dụng chuột hoặc thao tác bằng cách thủ công. Điều này giảm thời gian mất khi bạn phải di chuyển chuột và thực hiện các thao tác trên giao diện người dùng.

Làm việc với terminal cũng vậy, việc biết và sử dụng shortcut sẽ giúp đôi tay của bạn lả lướt mượt mà hơn trên bàn phím. Sau đây là một số shortcut hữu ích mà mình thường dùng:

- `Ctrl + l`: Chức năng tương tự `clear`, giúp clear màn hình trong terminal.
- `Ctrl + k`: Xóa từ vị trí con trỏ đến cuối dòng.
- `Ctrl + u`: Xóa tự trị trí con trỏ tới đầu hàng.
- `Ctrl + a`: Di chuyển con trỏ về đầu dòng.
- `Ctrl + e`: Di chuyển chon trỏ tới cuối dòng.
- `Ctrl + w`: Xóa từng từ từ vị trí con trỏ về tới đầu hàng.
- `Ctrl + c`: Câu này chắc là quen thuộc nhất rồi, dừng lệnh đang chạy.
- `Ctrl + d`: Đóng terminal hoặc thoát khỏi shell hiện tại (Ví dụ đang ở trong container hoặc ssh tới server nào đó, chúng ta có thể dùng `Ctrl + d` để thoát ra khỏi môi trường đó)

Các bạn có thể tìm hiểu thêm các Shortcut [tại đây](https://itsfoss.com/linux-terminal-shortcuts/) để múa cho ngầu nhé.

### Alias

Alias trong terminal là một cách để tạo ra shortcut cho những câu lệnh mà chúng ta thường dùng, từ đó rút ngắn thời gian gõ, nâng cao hiệu suất làm việc.

Để thêm alias vào hệ thống chúng ta sẽ mở tệp cấu hình hệ thống `~/.zshrc` lên và tiến hành thêm vào cuối file như sau:

```bash
# Alias
alias hello='echo Hii, Chao Cau!'

# Để những sửa đổi trong ~/.zshrc có hiệu lực các bạn nhớ source ~/.zshrc nhé.
```

Hoặc chúng ta có thể thêm trực tiếp trên terminal như sau:

```bash
alias hello='echo Hii, Chao Cau!'
```

Sau đó khi gõ `hello` trên terminal chúng ta sẽ nhận được kết quả như sau:

![alias][alias_demo]

Như vậy các bạn đã hình dung ra alias là gì và cách để thêm nó vào hệ thống của mình rồi đúng không nào, sau đây mình sẽ đưa ra một số alias mình thường dùng để giúp workflow làm việc với Git và Docker được nhanh chóng mau lẹ hơn.

### Git

```bash
# Alias for Git
alias gst='git status'
alias gc='git commit'
alias gl='git pull'
alias gp='git push'
alias gco='git checkout'
alias gcb='git checkout -b'
alias gbr='git branch'
alias glog='git log --oneline --graph --all'
```

### Docker

```bash
# Alias for Docker
alias dps='docker ps'
alias dpsf="docker ps --format 'table {{.ID}}\t{{.Names}}\t{{.Status}}\t{{.Ports}}'"
alias dpsa='docker ps -a'
alias dpsaf="docker ps -a --format 'table {{.ID}}\t{{.Names}}\t{{.Status}}\t{{.Ports}}'"
alias dexec='docker exec -it'
alias drm='docker rm'
alias drmi='docker rmi'
alias dstopall='docker stop $(docker ps -q)'
alias dlogs='docker logs'
alias dc='docker compose'
```

Nội dung các dòng lệnh trên rất là cơ bản nên mình sẽ không giải thích chức năng cụ thể nhé.

<aside>
⚠️ Một số lưu ý khi đặt tên và sử dụng alias

</aside>

Những thiết lập alias sẽ chỉ hoạt động trên hệ thống của bạn và nếu chỉ mỗi bạn dùng thì bạn có thể thoải sáng tạo đặt tên, tuy nhiên mình muốn lưu ý một số điểm sau:

**Việc đặt tên**:

Việc đặt tên nên mang ý nghĩa gợi nhớ, liệu bạn có muốn đặt alias cho lệnh `git status` là `hello everybody, sau khi mình gõ dòng này trạng thái git sẽ xuất hiện trên terminal nè` hay `a`, `b`, `c`... chẳng hạn. Nếu bạn đặt bằng 1 chữ cái như trên thì tin tốt là bạn có thể giảm thời gian gõ từ 10 ký tự `git status` về 1, tuy nhiên khi số lượng alias tăng lên thì việc nhớ tên alias sẽ trở thành một vấn đề khó khăn.

Còn nếu bạn chọn cách đặt tên như cách đầu tiên thì... well, mình không có ý kiến gì cả, chỉ muốn khuyên bạn mỗi khi dùng hãy cẩn thận đừng để đồng nghiệp với sếp thấy bởi vì họ sẽ bắt đầu kì thị bạn đấy 🤧

Tránh những alias đã được sử dụng trong hệ thống trước đó, ví dụ ta có `nano` là trình edit văn bản mặc định trên Ubuntu, sẽ ra sao nếu chúng ta đặt một alias như sau

```bash
alias nano="echo hello"
```

Như vậy khi gõ `nano` trên terminal chúng ta sẽ nhận được dòng `hello` thay vì vào trình edit văn bản bằng `nano`.

Khi đặt 2 alias trùng tên nhau, hệ thống sẽ sử dụng alias cuối cùng

### Tra cứu alias và xóa alias

Để kiểm tra xem có những alias nào được khai báo trên hệ thống chúng ta gõ:

```bash
alias
```

Với câu lệnh trên, nó sẽ hiện ra danh sách alias đang có trên hệ thống. Chúng ta có thể kết hợp với `grep` để tìm kiếm một alias cụ thể:

```bash
alias | grep "git"
```

Và cuối cùng, nếu muốn xóa alias chùng ta sẽ sử dụng câu lệnh sau:

```bash
unalias alias1 alias2 alias3
```

## IV. Tổng kết

Qua bài viết này mình đã giới thiệu tới các bạn cách để màu mè hóa quy trình làm việc với terminal, hi vọng với những chia sẻ đó sẽ gíúp việc múa code của bạn thanh thoát và điệu nghệ hơn, từ đó đồng nghiệp kính nể, sếp càng iu quý, công ty tăng lương, sớm có tiền mua nhà, cưới vợ, sống một đời viên mãn 🫡.

![meme][meme]

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[tabby_image]: https://i.imgur.com/IxxS7W5.png
[zsh_image]: https://i.imgur.com/9myYTi0.png
[oh_my_zsh_image]: https://i.imgur.com/3W9BJ4X.png
[p10k_image]: https://i.imgur.com/fTHLEPL.png
[alias_demo]: https://i.imgur.com/VXLuZJf.png
[meme]: https://media4.giphy.com/media/XIqCQx02E1U9W/giphy.gif?cid=7941fdc6kizu2of4mhov6cxqscuoo5x3gyxzl967s14rbcvw&ep=v1_gifs_search&rid=giphy.gif&ct=g
