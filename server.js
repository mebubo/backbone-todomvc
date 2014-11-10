var application_root = __dirname,
    express = require('express'),
    bodyParser = require('body-parser'),
    path = require('path'),
    mongoose = require('mongoose');

var app = express();

app.use(express.static(path.join(application_root, 'site')));
app.use(bodyParser.json());

var port = 3333;

app.listen(port, function () {
    console.log('Listening on %d in %s mode', port, app.settings.env);
});

mongoose.connect('mongodb://localhost/todos');

var Todo = new mongoose.Schema({
    name: String,
    checked: Boolean
});

var TodoModel = mongoose.model('Todo', Todo);

app.get('/api/todos', function (request, response) {
    return TodoModel.find(function(err, todos) {
        if (!err) {
            return response.send(todos);
        } else {
            return console.warn(err);
        }
    })
});

app.post('/api/todos', function (request, response) {
    console.log(request.body);
    var todo = new TodoModel({
        name: request.body.name,
        checked: request.body.checked
    });

    return todo.save(function(err) {
        if (!err) {
            console.log("created");
            return response.send(todo);
        } else {
            console.warn(err);
        }
    })
});

app.delete('/api/todos/:id', function(request, response) {
    return TodoModel.findById(request.params.id, function(err, todo) {
        return todo.remove(function(err) {
            if (!err) {
                return response.send('');
            } else {
                console.warn(err);
            }
        })
    })
});

app.put('/api/todos/:id', function (request, response) {
    return TodoModel.findById(request.params.id, function(err, todo) {
        todo.name = request.body.name;
        todo.checked = request.body.checked;

        return todo.save(function(err) {
            if (!err) {
                return response.send(todo);
            } else {
                console.warn(err);
            }
        })
    })
});