import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [editingTodoId, setEditingTodoId] = useState(null);
    const [editingTodoText, setEditingTodoText] = useState('');

    useEffect(() => {
        // 模拟登录状态检查
        const checkLogin = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/checkLogin');
                setIsLoggedIn(response.data.isLoggedIn);
            } catch (error) {
                console.error('Login check failed:', error);
            }
        };
        checkLogin();
    }, []);

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/login', { username: 'user1', password: 'password1' });
            setIsLoggedIn(response.data.isLoggedIn);
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:5000/api/logout');
            setIsLoggedIn(false);
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const handleNewTodoChange = (event) => {
        setNewTodo(event.target.value);
    };

    const handleAddTodo = () => {
        if (newTodo.trim() !== '') {
            setTodos([...todos, { id: Date.now(), text: newTodo, completed: false }]);
            setNewTodo('');
        }
    };

    const handleEditTodo = (id, newText) => {
        setTodos(
            todos.map((todo) => (todo.id === id ? { ...todo, text: newText } : todo))
        );
    };

    const handleDeleteTodo = (id) => {
        setTodos(todos.filter((todo) => todo.id !== id));
    };

    const handleToggleTodo = (id) => {
        setTodos(
            todos.map((todo) =>
                todo.id === id ? { ...todo, completed: !todo.completed } : todo
            )
        );
    };

    const handleDeleteCompleted = () => {
        setTodos(todos.filter((todo) => !todo.completed));
    };

    const handleSelectAll = () => {
        const allCompleted = todos.every((todo) => todo.completed);
        setTodos(todos.map((todo) => ({ ...todo, completed: !allCompleted })));
    };

    const handleEditClick = (id, text) => {
        setEditingTodoId(id);
        setEditingTodoText(text);
    };

    const handleEditChange = (event) => {
        setEditingTodoText(event.target.value);
    };

    const handleEditSubmit = () => {
        if (editingTodoText.trim() !== '') {
            setTodos(
                todos.map((todo) =>
                    todo.id === editingTodoId ? { ...todo, text: editingTodoText } : todo
                )
            );
            setEditingTodoId(null);
            setEditingTodoText('');
        }
    };

    const handleCancelEdit = () => {
        setEditingTodoId(null);
        setEditingTodoText('');
    };

    if (!isLoggedIn) {
        return (
            <div style={{textAlign: 'center', marginTop: '50px'}}>
                <h2>Please log in</h2>
                <input type="text" placeholder="Username"/>
                <br/>
                <input type="password" placeholder="Password"/>
                <br/>
                <button onClick={handleLogin}>Login</button>
            </div>
        );
    }

    return (
        <div>
            <h2>Todo List</h2>
            <div>
                <input
                    type="text"
                    value={newTodo}
                    onChange={handleNewTodoChange}
                    placeholder="Enter a new todo"
                />
                <button onClick={handleAddTodo}>Add</button>
                <button onClick={handleDeleteCompleted}>Delete Completed</button>
                <button onClick={handleSelectAll}>Select All</button>
            </div>
            <ul>
                {todos.map((todo) => (
                    <li key={todo.id}>
                        <input
                            type="checkbox"
                            checked={todo.completed}
                            onChange={() => handleToggleTodo(todo.id)}
                        />
                        {editingTodoId === todo.id ? (
                            <>
                                <input
                                    type="text"
                                    value={editingTodoText}
                                    onChange={handleEditChange}
                                />
                                <button onClick={handleEditSubmit}>Save</button>
                                <button onClick={handleCancelEdit}>Cancel</button>
                            </>
                        ) : (
                            <>
                                <span>{todo.text}</span>
                                <button onClick={() => handleEditClick(todo.id, todo.text)}>
                                    Edit
                                </button>
                            </>
                        )}
                        <button onClick={() => handleDeleteTodo(todo.id)}>Delete</button>
                    </li>
                ))}
            </ul>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default App;