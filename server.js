const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const MongoClient = require('mongodb').MongoClient;
const http = require('http').Server(app);

const url = 'mongodb://localhost:27017';
const dbName = 'myMongo';
const connectOption = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}

const transactionKururiDownload = async (data, res) => {
  let client;
  let login = false;
  try {
    client = await MongoClient.connect(url, connectOption);
    const db = client.db(dbName);
    const collection = db.collection('account');
      await collection.find({}).toArray( (err, docs) => {
        for (const doc of docs) {
          if (doc.mail == data.mail) {
            if (doc.password == data.password) {
              login = true;
              res.sendFile(__dirname + "/home.html");
            }
          }
        }
        if (!login) {
          res.send("login error");
        }
      });
  } catch (error) {
    console.log(error);
  } finally {
//    client.close();
  }
};

const transactionKururiInsert = async (data, res) => {
  let client;
  data = Object.assign(data, {date: new Date() });
  try {
    client = await MongoClient.connect(url, connectOption);
    const db = client.db(dbName);
    const collection = db.collection('account');
    const a = await collection.updateOne({mail:data.mail, password:data.password, name:data.name, date:data.date}, {$set:data}, true );
    if (a.result.n == 0) {
      await collection.insertOne(data);
    }
  } catch (error) {
    console.log(error);
  } finally {
    client.close();
  }
};


app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(__dirname + "/login.html");
});
app.get('/input.js', (req, res) => {
  res.sendFile(__dirname + "/input.js");
});

app.get('/signup', (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

app.post('/signup', async (req, res) => {
  let client;
  let exist = false;
  try {
    client = await MongoClient.connect(url, connectOption);
    const db = client.db(dbName);
    const collection = db.collection('account');
      await collection.find({}).toArray( (err, docs) => {
        console.log(docs);
        for (const doc of docs) {
          if (doc.mail == req.body.mail){
            console.log(req.body.mail);
            exist = true;
          }
        }

        let user = {mail:"", name:"", password:""};

        if (!exist && req.body.mail != "" && req.body.password != "") {
          user["mail"] = req.body.mail;
          user["password"] = req.body.password;
          user["name"] = user.mail.substr(0, user.mail.indexOf("@"));
          transactionKururiInsert(user, res);

          res.sendFile(__dirname + "/signuped.html");
        } else {
          res.sendFile(__dirname + "/signuperror.html");
        }
      });
  } catch (error) {
    console.log(error);
  } finally {
//    client.close();
  }
});

app.get('/home', async (req, res) => {
    try {
        const client2 = await MongoClient.connect(url, connectOption);
        const db2 = client2.db(dbName);
        const collection2 = db2.collection('worker');
        await collection2.find({}).toArray( (err, docs) => {
            res.json(docs);
        });

    } catch (error) {
      console.log(error);
    } finally {
    }

});

app.post('/home', async (req, res) => {
        console.log(req.body);
    let data = {
        name: req.body.name,
        birthday: req.body.birthday,
        joinday: req.body.joinday,
        group: req.body.group,
        job: req.body.job
    };
    let client;
    data = Object.assign(data, {date: new Date() });
    try {
        client = await MongoClient.connect(url, connectOption);
        const db = client.db(dbName);
        const collection = db.collection('worker');
        const a = await collection.updateOne({name:data.name, birthday: data.birthday, joinday: data.joinday, group: data.group, job: data.job, date:data.date}, {$set:data}, true );
        if (a.result.n == 0) {
            await collection.insertOne(data);
        }

        const client2 = await MongoClient.connect(url, connectOption);
        const db2 = client2.db(dbName);
        const collection2 = db2.collection('worker');
        await collection2.find({}).toArray( (err, docs) => {
            res.json(docs);
        });

    } catch (error) {
      console.log(error);
    } finally {
      client.close();
    }

    
});

app.post('/', (req, res) => {

  let user = {
    mail:"", name:"", password:""
  };

  user["mail"] = req.body.mail;
  user["password"] = req.body.password;
  user["name"] = user.mail.substr(0, user.mail.indexOf("@"));
  transactionKururiDownload(user, res);

});

http.listen(8080, () => {
  console.log('listening on :8080');
});
