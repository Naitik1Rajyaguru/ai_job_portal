// src/components/Register.js
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import config from "../config";
import styled from "styled-components";
import axios from "axios";
import useAuth from "../auth/useAuth";
import Cookies from 'js-cookie';

const Container = styled.div`
  width: 350px;
  padding: 30px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
  color: #333;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  padding: 12px 15px;
  margin: 8px 0;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
`;

const RoleSelect = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

const RoleButton = styled.button`
  background-color: ${(props) => (props.selected ? "#007bff" : "#f0f0f0")};
  color: ${(props) => (props.selected ? "white" : "black")};
  padding: 10px 20px;
  margin: 0 5px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const ErrorMessage = styled.p`
  color: red;
  text-align: center;
  margin-bottom: 10px;
`;

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [orgName, setOrgName] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);

    if (role === "admin") {
      const orgNameFormatted = orgName
        .replace(/[^a-zA-Z0-9]+/g, "-")
        .toLowerCase(); // Format org name
      const emailRegex = new RegExp(
        `^[a-zA-Z0-9._-]+@${orgNameFormatted}\\.com$`
      );

      if (!emailRegex.test(email)) {
        setError(
          `Invalid admin email format. Example: xyz@${orgNameFormatted}.com`
        );
        return;
      }
    }

    try {
      const response = await axios.post(`${config.apiBaseUrl}/register`, {
        email,
        password,
        role,
        orgName,
      });

      if (response.status === 201) {
        Cookies.set('userData', JSON.stringify(response.data.user), { expires: config.cookieExpiryDays });
        login({ email, role });
        navigate(role === "admin" ? "/admin" : "/user");
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("An error occurred during registration.");
      }
    }
  };

  return (
    <Container>
      <Title>Register</Title>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <RoleSelect>
        <RoleButton selected={role === "user"} onClick={() => setRole("user")}>
          User
        </RoleButton>
        <RoleButton
          selected={role === "admin"}
          onClick={() => setRole("admin")}
        >
          Admin
        </RoleButton>
      </RoleSelect>
      <Form onSubmit={handleRegister}>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {role === "admin" && (
          <Input
            type="text"
            placeholder="Organization Name"
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
          />
        )}
        <button type="submit">Register</button>
      </Form>
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </Container>
  );
};

export default Register;
