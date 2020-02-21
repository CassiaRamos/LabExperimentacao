import React, { useState } from 'react';

import 'styled-components/macro';

import Button from './Button';

const Login = () => {
	const [token, setToken] = useState('');
	return (
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
			<form
				css={{ width: '100%' }}
				onSubmit={e => {
					e.preventDefault();
					localStorage.setItem('token', token);
					window.location.reload();
				}}
			>
				<h1
					css={{
						color: 'purple',
						textAlign: 'center',
						fontSize: 48,
						marginTop: 12,
					}}
				>
					AUTENTICAÇÃO
				</h1>
				<input
					type="password"
					name="token"
					value={token}
					onChange={e => {
						setToken(e.target.value);
					}}
					placeholder="Coloque seu token do GitHub"
					css={{
						marginBottom: 16,
						borderRadius: 4,
						fontSize: 18,
						fontFamily: 'monospace',
						padding: '8px 16px',
						border: '1px solid purple',
						boxShadow: 'none',
						width: '100%',
						'&:focus, &:hover': {
							borderColor: 'rgb(210, 54, 105)',
						},
					}}
				/>
				<Button css={{ width: '100%', fontFamily: 'monospace' }}>AUTENTICAR</Button>
			</form>
		</section>
	);
};

export default Login;