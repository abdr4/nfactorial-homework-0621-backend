import express from "express";
import bodyParser from "body-parser";
import { connect, getDB } from "./db.js";
import { ObjectId } from "mongodb";
const app = express();
const port = 8080;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

connect();

app.get('/todos', (req, res) => {
    getDB()
        .collection('todos')
        .find({})
        .toArray((err, result) => {
            if (err) {
                console.error(err);
                res.status(500).json({ err: err });
                return;
            }
            res.status(200).json(result);
        });
});

app.get('/todos/sort', (req, res) => {
    getDB()
      .collection("todos")
      .find({})
      .sort("priority") 
      .toArray((err, result) => {
        if (err) {
          console.error(err);
          res.status(500).json({ err: err });
          return;
        }
        res.status(200).json(result);
    });
});
app.get('/todos/search/:name', (req, res) => {
    getDB()
        .collection("todos")
        .find({ name: req.params.name })
        .toArray((err, result) => {
            if (err) {
              console.error(err);
              res.status(500).json({ err: err });
              return;
            }
            res.status(200).json(result);
    });
});
app.post('/todo', (req, res) => {
    const newProduct = req.body;
    const name = newProduct.name;
    const priority = newProduct.priority;
    getDB().
    collection('todos')
    .insertOne({'name': name, 'priority': priority});
    res.status(200).send();
});

app.delete('/todos/delete/:id', (req, res) => {
    getDB()
    .collection('todos')
    .deleteOne({_id: new ObjectId(req.params.id)}, (err) => {
        if (err) {
            res.status(500).json({err: err});
            return;
        }
        res.status(200).send();
    });
});

app.put('/todos/change', (req, res) => {
    const { _id, ...params } = req.body;
    
    // console.log(id);

    getDB()
    .collection('todos')
    .updateOne({ _id: new ObjectId(_id)}, { $set: { ...params } });

    res.status(200).send();
})

app.listen(port, () => {
    console.log('working')
});