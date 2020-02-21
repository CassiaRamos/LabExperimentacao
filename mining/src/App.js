import React from 'react';
import 'styled-components/macro';
import { createGlobalStyle } from 'styled-components';
import Login from './Login';
import Button from './Button';

const receivedToken = localStorage.getItem('token');

const accessToken = 'bearer' + localStorage.getItem('token')

const query = `query RepositoriosPopulares {
  search(query: "stars:>100", type: REPOSITORY, first: 100) {
    nodes {
      ... on Repository {
        nameWithOwner
        createdAt
        pullRequests {
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

let repos = fetch('http://api.github.com/graphql', {
  method: 'POST',
  headers: {
    Authorization: accessToken,
  },
  body: JSON.stringify({
    query: query,
  }),
})
  .then(res => res.json())
  .then(json => console.log(json));

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
});

function App() {
  return (
    <>
      <Global/>
      {receivedToken ? (
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
      ) : ( <
        Login/>
      )}
      <ul>
        <l>{repos.nameWithOwner}</l>
      </ul>
    </>
  );
}

export default App;
