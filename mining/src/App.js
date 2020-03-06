import React, { Component } from 'react';
import 'styled-components/macro';
import { CSVLink } from "react-csv";
import { createGlobalStyle } from 'styled-components';
import Login from './Login';
import Button from './Button';

var after = "", resposta = [], atual = 0, repos, resultado, csv;
const limite = 20;
const receivedToken = localStorage.getItem('token');
const accessToken = 'bearer' + localStorage.getItem('token')
const headers = [
  { label: 'nameWithOwner', key: 'nameWithOwner' },
  { label: 'createdAt', key: 'createdAt' },
  { label: 'pullRequests', key: 'pullRequests.totalCount' },
  { label: 'releases', key: 'releases.totalCount' },
  { label: 'updatedAt', key: 'updatedAt' },
  { label: 'primaryLanguage', key: 'primaryLanguage.name'},
  { label: 'closedIssues', key: 'closedIssues.totalCount' },
  { label: 'totalIssues', key: 'totalIssues.totalCount' },
  { label: 'stargazers', key: 'stargazers.totalCount' },
];
const Global = createGlobalStyle({
  body: {
    backgroundColor: '#fff',
    color: '#000',
    fontFamily: '"Segoe UI", "Roboto"',
    padding: 0,
    margin: 0,
    borderTop: '4px solid purple',
  },
  '*': {
    boxSizing: 'border-box',
  },
})

function replacer(key, value) {
  if (value === null) {
    return " ";
  }
  return value;
}


class App extends Component {
  state = {
    loadButton: false
  }

  componentDidMount() {
    const getResultado = async () => {
      try {
        const query = `query RepositoriosPopulares {
                search(query: "stars:>100", type: REPOSITORY, first:10${after}) {
                  pageInfo {
                    hasNextPage
                    endCursor
                  }
                  nodes {
                    ... on Repository {
                      nameWithOwner
                      createdAt
                      pullRequests (states: MERGED){
                        totalCount
                      }
                      releases {
                        totalCount
                      }
                      updatedAt
                      primaryLanguage {
                        name
                      }
                      closedIssues: issues(states: CLOSED) {
                        totalCount
                      }
                      totalIssues: issues {
                        totalCount
                      }
                      stargazers {
                        totalCount
                      }
                    }
                  }
                }
              }`;
    
    repos = await fetch('http://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: accessToken,
      },
      body: JSON.stringify({
        query: query,
      }),
    })
    .then(res => res.json());

      resultado = repos.data.search;
        if (resultado.pageInfo.hasNextPage && atual < limite) {
          after = `, after: "${resultado.pageInfo.endCursor}"`;
          resposta = resposta.concat(resultado.nodes);
          atual += 10;
          console.log("Dados retornados: " + atual);
          await getResultado();
        } else {
          csv = JSON.stringify(resposta, replacer);
          csv = JSON.parse(csv);
          this.setState({
            loadButton: true
          })
        }
      } catch (e) {
        console.log(e);
        await getResultado();
      }
    }
    getResultado()
  }

  render() {
    return (
      <>
        <Global/>
        {receivedToken ? (
          <section
          css={{
            width: '100%',
            maxWidth: 420,
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: 'calc(100vh - 4px)',
            fontFamily: 'monospace',
            padding: '0 16px',
          }}
        >
          <div>
            {this.state.loadButton ? (
            <CSVLink data={csv} headers={headers} filename={"repositorios.csv"}>
                Download CSV
            </CSVLink>) :
            (<h1>Loading...</h1>)}
          </div>
          <Button
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            css={{
              display: 'grid',
              gridTemplateColumns: '80px repeat(auto-fit, 300px)',
              height: 'calc(5vh - 4px)',
              overflow: 'hidden',
              alignItems: 'center',
              margin: '20px',
            }}
          >
            SAIR
        </Button> 
        </section>
        ) : ( <Login/>
        )}
      </>
    );
  }
}

export default App;