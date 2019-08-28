import React from 'react';
import logo from './logo.svg';
import './App.css';

import { withAuthenticator } from 'aws-amplify-react';
import { API, graphqlOperation } from 'aws-amplify';

const listTodos = `
query {
  listTodos {
    items {
      id name description completed
    }
  }
}`;

class App extends React.Component {
    state = { todos: [] };

    async componentDidMount() {
      const todos = await API.graphql(graphqlOperation(listTodos));
      this.setState({ todos: todos.data.listTodos.items })
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <p>
                        Edit <code>src/App.js</code> and save to reload.
                    </p>
                    <a
                        className="App-link"
                        href="https://reactjs.org"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Learn React
                    </a>
                </header>
                {
                  this.state.todos.map((todo, i) => (
                    <div>
                      <h3>{todo.name}</h3>
                      <p>{todo.description}</p>
                    </div>
                  ))
                }
            </div>
        );
    }
}

export default withAuthenticator(App, { includeGreetings: true });
