// 'use strict';

class Todo {
    constructor(form, input, todoList, todoCompleted) {
        this.form = document.querySelector(form);
        this.input = document.querySelector(input);
        this.todoList = document.querySelector(todoList);
        this.todoCompleted = document.querySelector(todoCompleted);
        this.todoData = new Map(JSON.parse(localStorage.getItem('toDoList')));
    }

    addToStorage() {
        localStorage.setItem('toDoList', JSON.stringify([...this.todoData]))
    }

    render() {
        this.todoList.textContent = '';
        this.todoCompleted.textContent = '';
        this.todoData.forEach(this.createItem, this);
        this.addToStorage();
    }

    createItem(todo) {
        const li = document.createElement('li');
        li.classList.add('todo-item');
        li.key = todo.key;
        li.insertAdjacentHTML('beforeend', `
            <span class="text-todo">${todo.value}</span>
                 <div class="todo-buttons">
                 <button class="todo-remove"></button>
                 <button class="todo-complete"></button>
            </div>
        `);
        if (todo.completed) {
            this.todoCompleted.append(li);
        } else {
            this.todoList.append(li);
        }
    }

    addTodo(e) {
        e.preventDefault();

        if (this.input.value.trim()) {
            const newTodo = {
                value: this.input.value,
                completed: false,
                key: this.generateKey(),
            };
            this.todoData.set(newTodo.key, newTodo);
            this.render();
        } else {
            alert('Пустое дело добавить нельзя!');
        }
    }

    generateKey() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    deleteItem(elem) {
        let removeElem = elem.closest('.todo-item');
        this.todoData.forEach((item, key, map) => {
            if (key === removeElem.key) {
                map.delete(key);
            }
            this.render();
        });

    }

    completedItem(elem) {
        let completeElem = elem.closest('.todo-item');
        this.todoData.forEach((item, key) => {
            if (key === completeElem.key) {
                if (item.completed === false) {
                    item.completed = true
                } else item.completed = false;
                this.render();
            }
        });
    }

    handler() {
        const container = document.querySelector('.todo-container');
        container.addEventListener('click', (e) => {
            let target = e.target;
            if (target.classList.contains('todo-remove')) {
                this.deleteItem(target);
            } else if (target.classList.contains('todo-complete')) {
                this.completedItem(target);
            }
        })
    }

    init() {
        this.form.addEventListener('submit', this.addTodo.bind(this));
        this.render();
        this.handler();
    }
}

const todo = new Todo('.todo-control', '.header-input', '.todo-list', '.todo-completed');

todo.init();

