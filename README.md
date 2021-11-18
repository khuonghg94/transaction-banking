1. Yêu cầu hệ thống
- NodeJS (version 16.13.0)
- Docker (version 20.10.10)
2. Sơ đồ tổng quan hệ thống
![diagram](https://user-images.githubusercontent.com/54698417/142372447-08ca75fd-14bf-4661-929d-eb8286124b42.png)
3. Tổ chức source
- Thư mục auth: chứa source code API dùng để đăng ký người dùng muốn truy cập hệ thống, lấy token chứng thực và xác thực thông tin của người dùng muốn sử dụng hệ thống.
- Thư mục receive-data: chứa source code API nhận dữ liệu từ phía client gửi lên. Sau đó gửi message vào hàng đợi của RabbitMQ Server.
- Thư mục import-transaction: chứa source code nhận và xử lý messagen trong hàng đợi của RabbitMQ. Sau đó insert vào cơ sở dữ liệu.
4. Hướng dẫn sử dụng 
- Bước 1: Run docker
Tại thư mục gốc của project chạy lệnh: docker-compose up -d --build
- Bước 2: Run source
+ Tại thư mục auth: Chạy lệnh: npm install. Sau đó chạy lệnh: npm run start
+ Tại thư mục receive-data: Chạy lệnh: npm install. Sau đó chạy lệnh: npm run start
+ Tại thư mục import-transaction: Chạy lệnh: npm install. Sau đó chạy lệnh: npm run start
- Bước 3: Tạo thông tin chứng thực cho người dùng
Để người dùng có thể sử dụng hệ thống thì họ cần phải đăng ký thông tin với server chứng thực (Auth Server)
Thông tin đăng ký đơn giản bao gồm: email, username và password. Mỗi một email chỉ dùng đăng ký một lần. Người dùng có thể thay đổi tên hoặc mật khẩu cũng như xóa tài khoản khi không còn sử dụng.
c. Run test:

