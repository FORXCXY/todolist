const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// 模拟用户数据
const users = [
  { id: 1, username: 'user1', password: 'password1' },
  { id: 2, username: 'user2', password: 'password2' },
];

// 模拟登录状态
let isLoggedIn = false;

// 登录接口
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find((user) => user.username === username && user.password === password);
  
  if (user) {
    isLoggedIn = true;
    res.json({ isLoggedIn: true });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// 注销接口
app.post('/api/logout', (req, res) => {
  isLoggedIn = false;
  res.json({ isLoggedIn: false });
});

// 登录状态检查接口
app.get('/api/checkLogin', (req, res) => {
  res.json({ isLoggedIn });
});

// 启动服务器
const port = 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});