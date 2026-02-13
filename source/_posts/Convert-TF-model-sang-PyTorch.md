---
title: Convert TF model sang PyTorch
date: 2023-05-29 21:36:49
tags: Technical
---

## I. Giới thiệu

Còn nhớ hồi mình mới học về Machine Learning (cách đây khoảng 2-3 năm) các bài hướng dẫn trên Blog, YouTube, GitHub đều xài TensorFlow. PyTorch là một FrameWork được Facebook phát triển, tuy ra đời sau nhưng càng ngày càng nhận được sự quan tâm và sử dụng của cộng đồng, lý giải cho sự phát triển nhanh chóng của PyTorch có thể đến từ việc nó xây dựng trên Python (mà Python lại là ngôn ngữ chính được sử dụng trong các task về Machine Learning / Deep Learning), hiệu suất, tính tinh hoạt, tận dụng được việc tính toán song song trên nhiều GPU…

Một thống kê trên HuggingFace về mức độ phổ biến giữa 2 Framework, có đến 92% model sử dụng PyTorch để phát triển mô hình từ đó có thể thấy được mức độ phổ biến của PyTorch là như thế nào.

![Number of Models in HuggingFace](https://i.imgur.com/ZLFlavF.png)

Thêm một thống kê nữa để chỉ ra sự chuyển dịch của các nhà phát triển từ TensorFlow sang PyTorch.

![Tensor with PyTorch](https://i.imgur.com/xmb3jdv.png)

Chuyện là mình có một bài toán trong đó có sử dụng cả mô hình TF và PyTorch (được viết cũng một năm rồi), mấy hôm trước mình cần phải triển khai lại mô hình đó từ máy tính bàn sang máy tính nhúng Jetson, vì khác kiến trúc nhân bộ xử lý CPU nên nhiều thư viện bị conflict, không thể cài đặt một cách dễ dàng được. Vì vậy mình cần phải convert model TF sang PyTorch cho đồng bộ. Một hướng xử lý phổ biến đó là convert model TF sang ONNX.

![Tf to ONNX](https://i.imgur.com/dlY0hSt.png)

Tuy nhiên vì mô hình của mình khá nhỏ và đơn giản nên mình muốn tìm cách liệu có convert TF sang PyTorch một cách trực tiếp không? Câu trả lời là được và để thực hiện chúng ta chỉ cần thực hiện 2 bước chính như sau:

- Xây dựng lại model PyTorch có kiến trúc giống với model TensorFlow
- Tiến hành copy weights (các trọng số) từ checkpoints TF sang model PyTorch

Chi tiết thực hiện sẽ được trình bày trong mục 2

## II. Thực nghiệm

Mô hình TensorFlow của mình ở đây có nhiệm vụ phân loại 31 ký tự trong bảng chữ cái, kiến trúc model sẽ như sau

```python
# TensorFlow model
def _build_model_tensorflow(self):
        self.model = Sequential()
        self.model.add(Conv2D(32, (3, 3), padding="same", activation="relu", input_shape=(28, 28, 1)))
        self.model.add(Conv2D(32, (3, 3), activation="relu"))
        self.model.add(MaxPooling2D(pool_size=(2, 2)))
        self.model.add(Dropout(0.25))

        self.model.add(Conv2D(64, (3, 3), padding="same", activation="relu"))
        self.model.add(Conv2D(64, (3, 3), activation="relu"))
        self.model.add(MaxPooling2D(pool_size=(2, 2)))
        self.model.add(Dropout(0.25))

        self.model.add(Conv2D(64, (3, 3), padding="same", activation="relu"))
        self.model.add(Conv2D(64, (3, 3), activation="relu"))
        self.model.add(MaxPooling2D(pool_size=(2, 2)))
        self.model.add(Dropout(0.25))

        self.model.add(Flatten())
        self.model.add(Dense(512, activation="relu"))
        self.model.add(Dropout(0.5))
        self.model.add(Dense(32, activation="softmax"))
```

Có thể thấy đây là một mạng CNN với các lớp Conv2D, MaxPooling… rất cơ bản, bây giờ chúng ta cần build một model PyTorch với kiến trúc tương tự như vậy:

```python
class Build_Model_PyTorch(nn.Module):
    def __init__(self):
        super(Build_Model_PyTorch, self).__init__()

        self.conv1 = nn.Conv2d(1, 32, kernel_size=3, padding=1)
        self.conv2 = nn.Conv2d(32, 32, kernel_size=3)
        self.pool1 = nn.MaxPool2d(kernel_size=2, stride=2)
        self.dropout1 = nn.Dropout(0.25)

        self.conv3 = nn.Conv2d(32, 64, kernel_size=3, padding=1)
        self.conv4 = nn.Conv2d(64, 64, kernel_size=3)
        self.pool2 = nn.MaxPool2d(kernel_size=2, stride=2)
        self.dropout2 = nn.Dropout(0.25)

        self.conv5 = nn.Conv2d(64, 64, kernel_size=3, padding=1)
        self.conv6 = nn.Conv2d(64, 64, kernel_size=3)
        self.pool3 = nn.MaxPool2d(kernel_size=2, stride=2)
        self.dropout3 = nn.Dropout(0.25)

        self.fc1 = nn.Linear(64, 512)
        self.dropout4 = nn.Dropout(0.5)
        self.fc2 = nn.Linear(512, 32)

    def forward(self, x):
        x = self.conv1(x)
        x = nn.functional.relu(x)
        x = self.conv2(x)
        x = nn.functional.relu(x)
        x = self.pool1(x)
        x = self.dropout1(x)

        x = self.conv3(x)
        x = nn.functional.relu(x)
        x = self.conv4(x)
        x = nn.functional.relu(x)
        x = self.pool2(x)
        x = self.dropout2(x)

        x = self.conv5(x)
        x = nn.functional.relu(x)
        x = self.conv6(x)
        x = nn.functional.relu(x)
        x = self.pool3(x)
        x = self.dropout3(x)

        x = x.view(-1, 64)
        x = self.fc1(x)
        x = nn.functional.relu(x)
        x = self.dropout4(x)
        x = self.fc2(x)
        x = nn.functional.softmax(x, dim=1)

        return x
```

Thoạt nhìn qua thì thấy model PyTorch dài hơn TensorFlow nhỉ? Tuy nhiên nếu nhìn kỹ thì sẽ thấy các layer của model PyTorch hoàn toàn tương tự với TF (việc nhìn kỹ thì các bạn tự nhìn nhé 👀)

Sau khi đã build được kiến trúc model tương tự rồi, công việc tiếp theo là copy weights từ model cũ sang model mới

```python
from keras.models import load_model

# Load the TF model
keras_model = load_model("checkpoints/classify_character.h5")

# Get the TF model's weights as a NumPy array
keras_weights = keras_model.get_weights()

# Init PyTorch Model
torch_model = Build_Model_PyTorch()

# Copy weights
for i, (name, param) in enumerate(torch_model.named_parameters()):
        if "weight" in name:
            w = torch.from_numpy(keras_weights[i])

			# Convert dimensions
            if w.dim() == 3:
                w = w.t()
            elif w.dim() == 1:
                pass
            else:
                assert w.dim() == 4
                w = w.permute(3, 2, 0, 1)

            param.data = w

    # Save the PyTorch model's weights
    torch.save(torch_model.state_dict(), "checkpoints/classify_character.pt")
```

Ở đây có một điểm mà chúng ta cần lưu ý, mô hình TF làm việc với input [B, H, W, C] trong khi PyTorch lại input là [B, C, H, W] (Batch_size, Channel, Height, Width), chính vì vậy mới cần thêm `Convert dimensions`.

Ví dụ với sample bên dưới, input cho model TF là [1, 28, 28, 1] thì qua mô hình PyTorch sẽ là [1, 1, 28, 28].

![Samples](https://i.imgur.com/2FBZDsK.png)

## III. Kết quả

Từ trên xuống dưới lần lượt là kết quả dự đoán của mô hình TF và PyTorch.

![Compare TF with PyTorch](https://i.imgur.com/hU8J4p3.png)

Hy vọng hướng dẫn này sẽ hữu ích cho những bạn nào cần thực hiện convert model như mình.

Bái bai và hẹn gặp lại trong những bài viết tiếp theo 🫵

## IV. References

- [Code in GitHub](https://github.com/KudoKhang/CodeInBlog/tree/main/TF2Torch)
- [TensorFlow to ONNX](https://github.com/onnx/tensorflow-onnx)
- [PyTorch and TensorFlow in 2023](https://www.assemblyai.com/blog/pytorch-vs-tensorflow-in-2023/)
