import React from 'react';
import axios from 'axios';


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            todos: [],
            newTodo: '',
            isLoggedIn: false,
            editingTodoId: null,
            editingTodoText: '',
            username: '',
            password: ''
        };
    }
    componentDidMount() {
        // 模拟登录状态检查
        axios.get('http://localhost:5000/api/checkLogin')
           .then(response => {
                this.setState({ isLoggedIn: response.data.isLoggedIn });
                console.log('Login check success:', response.data.isLoggedIn);
           }).catch(error => {
                console.error('Login check failed:', error);
            });
    }
    handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/login', { username: this.state.username, password: this.state.password });
            this.setState({ isLoggedIn: response.data.isLoggedIn });
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    handleLogout = async () => {
        try {
            await axios.post('http://localhost:5000/api/logout');
            this.setState({ isLoggedIn: false });
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    handleNewTodoChange = (event) => {
        this.setState({ newTodo: event.target.value });
    };

    handleAddTodo = () => {
        if (this.state.newTodo.trim() !== '') {
            this.setState(prevState => ({
                todos: [...prevState.todos, { id: Date.now(), text: this.state.newTodo, completed: false }],
                newTodo: ''
            }));
        }
    };


    handleDeleteTodo = (id) => {
        this.setState(prevState => ({
            todos: prevState.todos.filter(todo => todo.id !== id),
            editingTodoId: null,
            editingTodoText: ''
        }))
    };

    handleToggleTodo = (id) => {
        this.setState(prevState => ({
            todos: prevState.todos.map(todo => (todo.id === id ? {...todo, completed: !todo.completed} : todo)),
            editingTodoId: null,
            editingTodoText: ''
        }))
    };

    handleDeleteCompleted = () => {
        this.setState(prevState => ({
            todos: prevState.todos.filter(todo => !todo.completed),
            editingTodoId: null,
            editingTodoText: ''
        }))
    };

    handleSelectAll = () => {
        const allCompleted = this.state.todos.every((todo) => todo.completed);
        this.setState(prevState => ({
            todos: prevState.todos.map(todo => ({...todo, completed: !allCompleted})),
            editingTodoId: null,
            editingTodoText: ''

        }))
    };

    handleEditClick = (id, text) => {
        console.log(id, text);
        this.setState({
            editingTodoId: id,
            editingTodoText: text
        })
    };

    handleEditChange = (event) => {
        this.setState({
            editingTodoText: event.target.value
        })
    };

    handleEditSubmit = () => {
        if (this.state.editingTodoText.trim() !== '') {
            this.setState(prevState => ({
                todos: prevState.todos.map(todo => (todo.id === prevState.editingTodoId ? {...todo, text: prevState.editingTodoText} : todo)),
                editingTodoId: null,
                editingTodoText: ''
        }))
        }
    };

    handleCancelEdit = () => {
        this.setState({
            editingTodoId: null,
            editingTodoText: ''
        })
    };
    render() {
        // console.log(this.state);
        const { isLoggedIn, todos, newTodo, editingTodoId, editingTodoText } = this.state;
        // console.log(isLoggedIn);
        if (!isLoggedIn) {
                return (
                    <>
                    <div style={{textAlign: 'center', marginTop: '50px'}}>
                        <h2>Please log in</h2>
                        <input type="text" placeholder="Username" value={this.state.username} onChange={(e) => this.setState({username: e.target.value})}/>
                        <br/>
                        <input type="password" placeholder="Password" value={this.state.password} onChange={(e) => this.setState({password: e.target.value})}/>
                        <br/>
                        <button onClick={this.handleLogin}>Login</button>
                    </div>
                    </>
                );
        }

        return (
            <>
                <div>
                <h2>Todo List</h2>
                <div>
                <input
                type="text"
                value={newTodo}
                onChange={this.handleNewTodoChange}
                placeholder="Enter a new todo"
            />
                <button onClick={this.handleAddTodo}>Add</button>
                <button onClick={this.handleDeleteCompleted}>Delete Completed</button>
                <button onClick={this.handleSelectAll}>Select All</button>
            </div>
                <ul>
                    {todos.map((todo) => (
                        <li key={todo.id}>
                            <input
                                type="checkbox"
                                checked={todo.completed}
                                onChange={() => this.handleToggleTodo(todo.id)}
                            />
                            {editingTodoId === todo.id ? (
                                <>
                                    <input
                                        type="text"
                                        value={editingTodoText}
                                        onChange={this.handleEditChange}
                                    />
                                    <button onClick={this.handleEditSubmit}>Save</button>
                                    <button onClick={this.handleCancelEdit}>Cancel</button>
                                </>
                            ) : (
                                <>
                                    <span>{todo.text}</span>
                                    <button onClick={() => this.handleEditClick(todo.id, todo.text)}>
                                        更改
                                    </button>
                                </>
                            )}
                            <button onClick={() => this.handleDeleteTodo(todo.id)}>删除</button>
                        </li>
                    ))}
                </ul><button onClick={this.handleLogout}>注销</button>
            </div>
        </>
    )}

}
export default App;