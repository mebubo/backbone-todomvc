var TodoModel = Backbone.Model.extend({
    defaults: {
        checked: false
    },
    toggle: function() {
        this.set("checked", !this.get("checked"));
        this.save();
    }
})

var TodoCollection = Backbone.Collection.extend({
    model: TodoModel,
    localStorage: new Backbone.LocalStorage('todos-list')
})

var todos = new TodoCollection()

var TodoView = Backbone.View.extend({
    tagName: "li",
    events: {
        "click .toggle": "toggle",
        "click .destroy": "clear",
        "dblclick label" : "edit",
        "keypress .edit": "updateOnEnter"
    },
    clear: function() {
        this.model.destroy();
        this.remove();
    },
    template: _.template($("#item-template").html()),
    render: function () {
        this.$el.html(this.template(this.model.toJSON()))
    },
    toggle: function () {
        this.model.toggle();
    },
    edit: function () {
        this.$el.addClass("editing");
    },
    updateOnEnter: function(e) {
        if (e.keyCode == 13) {
            var name = this.$(".edit").val().trim()
            if (name) {
                this.model.save({name: name});
            }
            this.$el.removeClass("editing");
        }
    }
});

var AppView = Backbone.View.extend({
    el: "#todo-app",
    initialize: function() {
        this.listenTo(todos, 'reset', this.addAll);
        this.listenTo(todos, 'change', this.addAll);
        this.listenTo(todos, 'add', this.addOne)
        todos.fetch({reset: true});
    },
    events: {
        "keypress #add-item": "keypressed"
    },
    keypressed: function(e) {
        if (e.keyCode == 13) {
            this.createNewItem();
        }
    },
    createNewItem: function() {
        var name = this.$("#add-item").val()
        if (name.trim()) {
            todos.create({name: name.trim()});
        }
        this.$("#add-item").val('')
    },
    addOne: function(model) {
        var view = new TodoView({model: model});
        view.render();
        this.$("#todo-ul").append(view.el)
    },
    addAll: function () {
        this.$("#todo-ul").html('');
        todos.each(this.addOne, this);
    }
})

var appView = new AppView();
