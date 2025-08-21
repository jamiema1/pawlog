import {
  Button,
  Checkbox,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
  Center,
  Box,
  Group,
  Image
} from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';
import classes from './AuthenticationImage.module.css';
import axios from './api/axios';
import { Link, useNavigate } from 'react-router';
import { useState } from 'react';

export function AuthenticationImage() {
  const navigate = useNavigate();

  const [loginText, setLoginText] = useState({
    usernameText: '',
    passwordText: '',
    usernameError: '',
    passwordError: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginText((prev) => ({
      ...prev,
      [name]: value
    }));
  };
  
  function LoginRequirement({label}) {
    return (
      label ? <Text component="div" c={'red'} mt={5} size="sm">
        <Center inline>
          <IconX size={14} stroke={1.5} />
          <Box ml={7}>{label}</Box>
        </Center>
      </Text> : <></>
    );
  }

  function tryLogin(loginText, setLoginText) {
    axios.get('/user/loginUser',{ params: {
      username: loginText.usernameText,
      password: loginText.passwordText
    }})
      .then(function (response) {
        if (response.data.usernameerror) {
          setLoginText(prev => ({
            ...prev,
            usernameError: response.data.usernameerror,
            passwordError: ''
          }));
          return;
        } else {
          setLoginText(prev => ({
            ...prev,
            usernameError: ''
          }));
        }
      
        if (response.data.passworderror) {
          setLoginText(prev => ({
            ...prev,
            passwordError: response.data.passworderror,
            usernameError: ''
          }));
          return;
        } else {
          setLoginText(prev => ({
            ...prev,
            passwordError: ''
          }));
        }

        if (response.data.error) {
          console.error(response.data.error);
          alert(response.data.error);
          return;
        } 

        localStorage.setItem('username', loginText.usernameText);

        navigate('/posts');
      })
      .catch(function (error) {
        console.error(error);
        alert(error);
      });
  }

  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form}>
        <div className={classes.headerDiv}>
          <Group className={classes.header}>
            <Image
              radius="md"
              h={60}
              w={60}
              fit="contain"
              src="/dog-paw.svg"
            />
            <Title className={classes.title}>Pawlog</Title>
          </Group>
        </div>
        <TextInput
          label="Username"
          placeholder="Your username"
          size="md"
          radius="md"
          name="usernameText"
          value={loginText.usernameText}
          onChange={handleChange}
        />
        <LoginRequirement label={loginText.usernameError}/>
        <PasswordInput
          label="Password"
          placeholder="Your password"
          mt="md"
          size="md"
          radius="md"
          name="passwordText"
          value={loginText.passwordText}
          onChange={handleChange}
        />
        <LoginRequirement label={loginText.passwordError}/>
        <Checkbox label="Keep me logged in" mt="xl" size="md" />
        <Button fullWidth mt="xl" size="md" radius="md" onClick={() =>{tryLogin(loginText, setLoginText);}}>
          Login
        </Button>
        <Text ta="center" mt="md">
          Don&apos;t have an account?{' '}
          <Link to='/register'>
            Register
          </Link>
        </Text>
      
      </Paper>
    </div>
  );
}
