// src/components/User.js
import React from 'react';
import useAuth from '../auth/useAuth';
import styled from 'styled-components';

const Container = styled.div`
    text-align: center;
    padding: 20px;
`;

const User = () => {
  const { user, logout } = useAuth();

  return (
    <Container>
      <h2>User Page</h2>
      <p>Welcome, {user?.email}!</p>
      <button onClick={logout}>Logout</button>
    </Container>
  );
};

export default User;