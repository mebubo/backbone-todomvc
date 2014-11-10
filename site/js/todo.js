var TodoModel = Backbone.Model.extend({
    defaults: {
        checked: false
    },
    idAttribute: '_id',
    toggle: function () {
        this.set("checked", !this.get("checked"));
        this.save();
    }
});

var TodoCollection = Backbone.Collection.extend({
    model: TodoModel,
    url: '/api/todos'
});

var todos = new TodoCollection();

var TodoView = Backbone.View.extend({
    tagName: "li",
    events: {
        "click .toggle": "toggle",
        "click .destroy": "clear",
        "dblclick label": "edit",
        "keypress .edit": "updateOnEnter",
        "blur .edit": "close"
    },
    initialize: function () {
        this.listenTo(this.model, 'change', this.render);
    },
    clear: function () {
        this.model.destroy();
        this.remove();
    },
    template: _.template($("#item-template").html()),
    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        this.$el.toggleClass('completed', this.model.get('checked'));
    },
    toggle: function () {
        this.model.toggle();
    },
    edit: function () {
        this.$el.addClass("editing");
        this.$(".edit").focus();
    },
    close: function () {
        var name = this.$(".edit").val().trim();
        if (name) {
            this.model.save({name: name});
        }
        this.$el.removeClass("editing");
    },
    updateOnEnter: function (e) {
        if (e.keyCode == 13) {
            this.close();
        }
    }
});

var AppView = Backbone.View.extend({
    el: "#todo-app",
    initialize: function () {
        this.$list = this.$("#todo-list");
        this.listenTo(todos, 'reset', this.addAll);
        this.listenTo(todos, 'add', this.addOne);
        todos.fetch({reset: true});
    },
    events: {
        "keypress #add-item": "createOnEnter"
    },
    createOnEnter: function (e) {
        if (e.keyCode == 13) {
            var name = this.$("#add-item").val().trim();
            if (name) {
                todos.create({name: name});
            }
            this.$("#add-item").val('')
        }
    },
    addOne: function (model) {
        var view = new TodoView({model: model});
        view.render();
        this.$list.append(view.el)
    },
    addAll: function () {
        this.$list.html('');
        todos.each(this.addOne, this);
    }
});

$(function () {
    new AppView;
});
