import React from 'react';
import logo from './logo.svg';
import './App.css';

import { withAuthenticator } from 'aws-amplify-react';
import { API, graphqlOperation, Storage } from 'aws-amplify';

const listTodos = `
query {
  listTodos {
    items {
      id name description completed
    }
  }
}`;

class App extends React.Component {
    state = { todos: [], people: [], file: null, fileName: '', fileURL: '' };

    async componentDidMount() {
      const todos = await API.graphql(graphqlOperation(listTodos));
      this.setState({ todos: todos.data.listTodos.items });
      const people = await API.get('PeopleAPI', '/people');
      this.setState({ people: people.data });
    }

    handleUpload = (e) => {
      const file = e.target.files[0];
      const fileName = file.name;
      const fileURL = URL.createObjectURL(file);
      this.setState({ file, fileName, fileURL });
    }

    saveFile = () => {
      Storage.put(this.state.fileName, this.state.file)
        .then(() => {
          Storage.get(this.state.fileName)
            .then((url) => {
              this.setState({ file: null, fileName: '', fileURL: url })
            })
            .catch(console.error)
        })
        .catch(console.error)
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
                <input type='file' onChange={this.handleUpload} />
                <img src={this.state.fileURL} alt='uploaded img' />
                <button onClick={this.saveFile}>Upload</button>
                <h2>Todo list</h2>
                {
                  this.state.todos.map((todo) => (
                    <div key={todo.name}>
                      <h3>{todo.name}</h3>
                      <p>{todo.description}</p>
                    </div>
                  ))
                }
                <h2>People list</h2>
                {
                  this.state.people.map((person) => (
                    <div key={person.name}>
                      <h3>{person.name}</h3>
                      <p>{person.hari_color}</p>
                    </div>
                  ))
                }
            </div>
        );
    }
}

export default withAuthenticator(App, { includeGreetings: true });
