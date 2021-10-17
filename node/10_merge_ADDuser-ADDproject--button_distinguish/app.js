var express = require('express');
var fs = require('fs');
var app = express();
let kara_array=[];

//ルート設定(ejsのhrefとかsrcをルートパスなら効くようにする)
app.use(express.static('views'));

//文字列加工設定
var bodyParser = require('body-parser');

//SQL設定
var mysql      = require('mysql2');
let connection;
function connect(){
  connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'pooh1111',
      database: 'test'
  });
  connection.connect();
}

// EJS設定
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

/*読み込み時処理*/
app.get('/', function (req, res) {

  get_project_data_each_user
  (1)
  .then(project_array =>{
    /*console.log("point1 DB取得後プロジェクトarray表示");
    console.log(project_array);*/

    let shaped_project_array = shape_array_for_projects_table(project_array);
    /*console.log("point2 整形後プロジェクトarray表示");
    console.log(shaped_project_array)*/

    get_all_task_data()
    .then(task_array =>{
      /*console.log("point3 DB取得後タスクarray表示");
      console.log(task_array);*/

      let shaped_task_array = shape_array_for_tasks_table(task_array);
      /*console.log("point4 整形後タスクarray表示");
      console.log(shaped_task_array)*/

      res.render('projects', {message_list_for_project:shaped_project_array,message_list_for_task: shaped_task_array});
    })
  })

});

/*Post時処理*/
app.post('/', (req, res) => {
  /*プロジェクト追加*/
  if (typeof(req.body.project_message)==="string") {
    let newproject;

    if (req.body.project_message.length > 0) {
      newproject = req.body.project_message;
    }

    return new Promise((resolve, reject) => {
      insert_newproject(newproject, 1)
      .then(array =>{
        get_project_data_each_user
        (1)
        .then(project_array =>{
          let shaped_project_array = shape_array_for_projects_table(project_array);

          get_all_task_data()
          .then(task_array =>{
            let shaped_task_array = shape_array_for_tasks_table(task_array);

            res.render('projects', {message_list_for_project:shaped_project_array,message_list_for_task: shaped_task_array});
          })
        })
      })
    });
  }else if(typeof(req.body.user_message)==="string") {
    let newuser;

    if (req.body.user_message.length > 0) {
      newuser = req.body.user_message;
    }

    return new Promise((resolve, reject) => {
      insert_newuser(newuser)
      .then(array =>{
        let diplay_array=[];
        get_project_data_each_user
        (1)
        .then(array =>{
          project_array=array;

          console.log("point1 DB取得後プロジェクトarray表示");
          console.log(project_array);

          let shaped_project_array = shape_array_for_projects_table(project_array);
          console.log("point2 整形後プロジェクトarray表示");
          console.log(shaped_project_array)

          get_all_task_data()
          .then(array =>{
            task_array=array;

            console.log("point3 DB取得後タスクarray表示");
            console.log(task_array);

            let shaped_task_array = shape_array_for_tasks_table(task_array);
            console.log("point4 整形後タスクarray表示");
            console.log(shaped_task_array)

            res.render('projects', {message_list_for_project:shaped_project_array,message_list_for_task: shaped_task_array});
          })
        })
      })
    });
  }


})

/*ポート3000で待機！*/
app.listen(3000, function () {});

/*以下関数集*/
function get_project_data_each_user(user_id){
  return new Promise((resolve, reject) => {
    connect();

    data = `select * from projects where user_id= ${user_id};`

    connection.query(data, function (err, results) {
      if(err) throw err;

      resolve(results);
    });

    connection.end();
  });
}

function get_all_task_data(){
  return new Promise((resolve, reject) => {
    connect();

    connection.query('select * from tasks;', function (err, results) {
      if(err) throw err;
      resolve(results);
    });

    connection.end();
  });
}

function insert_newuser(newuser){
  return new Promise((resolve, reject) => {
    connect();

    data = `INSERT INTO users(name) VALUES ("${newuser}");`
    connection.query(data, function (err, results) {
      if(err) throw err;
      resolve(results);
    });
    connection.end();
  });
}

function insert_newproject(newproject, current_user_id){
  return new Promise((resolve, reject) => {
    connect();

    data = `insert into projects (project_name,user_id)values("${newproject}", "${current_user_id}");`
    connection.query(data, function (err, results) {
      if(err) throw err;
      resolve(results);
    });
    connection.end();
  });
}

function shape_array_for_projects_table(array){
  let shaped_array=[];

  for (var i = 0; i < array.length; i++) {
    shaped_array[i]={id:0,project_name:"kara",user_id:0};//初期化
    shaped_array[i].id = array[i].id;
    shaped_array[i].project_name = array[i].project_name;
    shaped_array[i].user_id = array[i].user_id;
  }
  return(shaped_array);
}

function shape_array_for_tasks_table(array){
  let shaped_array=[];

  for (var i = 0; i < array.length; i++) {
    shaped_array[i]={id:0,task_name:"kara",project_id:0,phase:null,start:null,finish:null,comment:null};//初期化

    shaped_array[i].id = array[i].id;
    shaped_array[i].task_name = array[i].task_name;
    shaped_array[i].project_id = array[i].project_id;
    shaped_array[i].phase = array[i].phase;
    shaped_array[i].start = array[i].start;
    shaped_array[i].finish = array[i].finish;
    shaped_array[i].comment = array[i].comment;
  }
  return(shaped_array);
}
