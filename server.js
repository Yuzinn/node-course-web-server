const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
const port = process.env.PORT || 3000;

var app = express();

//더 작게 쪼개진 템플릿을 다른 템플릿에서 사용하겠다는 의미이다.
//동일한 부분을 반복해야할 때 유용하다. 
hbs.registerPartials(__dirname + '/views/partials');
//view engine을 hbs로 쓰겠다는 의미이다. 
app.set('view engine', 'hbs');
//app.use는 express내의 내장함수를 이용하고 싶을때 사용한다. Middleware라고 한다.
//public 폴더내의 내용들을 마치 get을 사용한것처럼 접근할 수 있게 된다.
app.use((req, res, next) => {
  // next();를 하지 않으면 다음으로 넘어가지 않는다. 따라서 미리 체크해야할 사항을 확인할 수 있다.
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`;

  console.log(log);
  fs.appendFile('server.log', log + '\n');
  next();
});

app.use((req, res, next) => {
  res.render('maintenance.hbs');
});

app.use(express.static(__dirname + '/public'));


//반복해야하는 함수를 등록한다. 
hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
});

app.get('/', (req, res) => {
  res.render('home.hbs', {
    pageTitle: 'Home Page',
    welcomeMessage: 'Welcome to my homepage'
  });
});

app.get('/about', (req, res) => {
  //템플릿을 보내게 해준다.
  //두번째 인자로는 템플릿으로 보낼 데이터를 적는다.
  res.render('about.hbs', {
    pageTitle: 'About Page',
  });
});

app.get('/bad', (req, res) => {
  res.send({
    error: 'Unable to connect to this server'
  });
})

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});