# Project template

- Trong thực tế, việc setup project thường là do leader hoặc người có nhiều kinh nghiệm React thực hiện

- Project template sẽ được lưu trữ trên một store online có thể là gitlab, github, bitbucket,...

- Đối với những dự án khi phát triển sau này, project template sẽ được đem ra để setup dự án giúp giảm nhanh quá trình khởi tạo dự án khi bắt đầu

- Ở đây mình có sẵn một project template đã phát triển qua nhiều dự án và tổng hợp lại, mọi người có thể clone về để tìm hiểu hoặc sử dụng nó để phát triển dự án cá nhân của mình

https://github.com/dangthuyenvuong/spacedev-react-project-template

# Tạo dự án bằng vitejs

### Bước 1: tạo dự án bằng vitejs 
> `npm create vite@latest`

### Bước 2: Clean và tạo cấu trúc folder dự án

- `public`: Những public asset, có thể truy cập từ bên ngoài

`src/`

- `assets`: Internal asset

- `components`: Danh sách component sử dụng lại

- `hooks`: custom hook

- `config`: File config sử dụng cho toàn dự án

- `layouts`: Component dạng layout

- `pages`: Component dạng page

- `services`: Chưa các api

- `stories`: global state

- `utils`: function dạng helper dùng cho dự án

- `routers`: routers cho toàn dự án 


### Bước 3: Cài đặt các package sử dụng cho dự án

`yarn add react-router-dom @reduxjs/toolkit axios classnames lodash moment redux react-redux styled-components`

`yarn add tailwindcss postcss autoprefixer -D`


### Bước 4: Tạo những file có trong dự án

1. Cài đặt jsonconfig.json và vite.config.js

2. Cài đặt tailwind

3. utils: https, token, cache, validate, handleError, currency

4. config: path, index

5. hooks: useQuery, useAuth, useForm, useScrollTop

6. components: PrivateRoute, AuthRoute

7. stores: index, auth

8. layouts: MainLayout

9. routers

10. vercel.json (Chỉ cho dự án demo)

### Ngoài những thứ cơ bản trên thì vẫn còn rất nhiều thứ phải setup ví dụ: theme, system design, eslint, prettier,.... Những module nâng cao đó sẽ được hướng dẫn setup trong các video sau


# Connect code với git lưu trữ project-template