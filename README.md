## **1. Yêu cầu hệ thống**
- NodeJS (version 16.13.0)
- Docker (version 20.10.10)

## **2. Sơ đồ tổng quan hệ thống**
![diagram](https://user-images.githubusercontent.com/54698417/142372447-08ca75fd-14bf-4661-929d-eb8286124b42.png)

## **3. Tổ chức source**
- Thư mục ```auth```: chứa source code API dùng để đăng ký người dùng muốn truy cập hệ thống, lấy token chứng thực và xác thực thông tin của người dùng muốn sử dụng hệ thống.
- Thư mục ```receive-data```: chứa source code API nhận dữ liệu từ phía client gửi lên. Sau đó gửi message vào hàng đợi của RabbitMQ Server.
- Thư mục ```import-transaction```: chứa source code nhận và xử lý message trong hàng đợi của RabbitMQ. Sau đó insert vào cơ sở dữ liệu.

## **4. Hướng dẫn sử dụng**

**_Bước 1: Run docker_**

Tại thư mục gốc của project chạy lệnh: ```docker-compose up -d --build```

**_Bước 2: Run source_**
+ Tại thư mục ```auth```: Chạy lệnh: ```npm install```. Sau đó chạy lệnh: ```npm run start```
+ Tại thư mục ```receive-data```: Chạy lệnh: ```npm install```. Sau đó chạy lệnh: ```npm run start```
+ Tại thư mục ```import-transaction```: Chạy lệnh: ```npm install```. Sau đó chạy lệnh: ```npm run start```

**_Bước 3: Tạo thông tin chứng thực cho người dùng_**

Để người dùng có thể sử dụng hệ thống thì họ cần phải đăng ký thông tin với server chứng thực (Auth Server)
Thông tin đăng ký đơn giản bao gồm: email, username và password. Mỗi một email chỉ dùng đăng ký một lần. Người dùng có thể thay đổi tên hoặc mật khẩu cũng như xóa tài khoản khi không còn sử dụng.

**Lệnh đăng ký mới tài khoản chứng thực:**

```
curl -H "Content-Type: application/json" -X POST http://localhost:3200/auth/register -d "{\"email\":\"{{email_of_user}}\",\"username\":\"{{name_of_user}}\",\"password\":\"{{password_of_user}}\"}"
```
**Lệnh cập nhật thông tin tài khoản:**

```
curl -H "Content-Type: application/json" -X POST http://localhost:3200/auth/update -d "{\"email\":\"{{email_of_user}}\",\"username\":\"{{name_of_user}}\",\"password\":\"{{password_of_user}}\"}"
```
**Lệnh xóa thông tin tài khoản:**

```
curl -H "Content-Type: application/json" -X POST http://localhost:3200/auth/delete -d "{\"email\":\"{{email_of_user}}\"}"
```

Chú thích:

```{{email_of_user}}```: Thông tin email của người dùng

```{{name_of_user}}```: Thông tin tên người dùng

```{{password_of_user}}```: Thông tin mật khẩu của người dùng

**_Bước 4: Run API để import transaction_**

Sau khi đã tạo thành công thông tin dùng để xác thực hệ thống, người dùng có thể gọi API get token từ server Auth để sử dụng. Tại header khi call API import transaction vào hệ thống phải bao gồm token. Việc xác thực token được thực hiện thông qua API /auth/verify của server Auth.

Để lấy token, người dùng cần cung cấp thông tin gồm email, username và password. 

**Lệnh get token như sau:**

```
curl -H "Content-Type: application/json" -X POST http://localhost:3200/auth/token -d "{\"email\":\"{{email_of_user}}\",\"username\":\"{{name_of_user}}\",\"password\":\"{{password_of_user}}\"}"
```

Thông tin chú thích tương tự như bước 3

Sau khi đã get token thành công, người dùng có thể sử dụng token này để xác thực khi call API import transaction. 

**Lệnh call API import-transaction như sau:**

```
curl --location --request POST "http://localhost:3000/data-import/upload" --header "Authorization: Bearer {{token}}" --form "file=@\"{{path_of_file}}\""
```

Chú thích:

```{{token}}```: Giá trị token vừa lấy ở bước trên

```{{path_of_file}}```: Đường dẫn tuyệt đối đến file cần import (File cần import phải là csv hoặc excel)

Lưu ý: Các lệnh curl được run trên Command Prompt


## **5. Hướng dẫn test**

Tại thư mục ```receive-data```: Run ```npm test```

Tại thư mục ```import-transaction```: Run ```npm test```
