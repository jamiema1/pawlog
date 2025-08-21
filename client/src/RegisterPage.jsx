import {
  Button,
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
import { IconX } from '@tabler/icons-react';
import classes from './RegisterPage.module.css';
import axios from './api/axios';
import { Link } from 'react-router';
import { useState } from 'react';
import { useNavigate } from 'react-router';

function RegisterRequirement({label}) {
  return (
    label ? <Text component="div" c={'red'} mt={5} size="sm">
      <Center inline>
        <IconX size={14} stroke={1.5} />
        <Box ml={7}>{label}</Box>
      </Center>
    </Text> : <></>
  );
}

function tryRegister(RegisterText, setRegisterText, navigate) {
  axios.get('/user/addUser',{ params: {
    username: RegisterText.usernameText,
    password: RegisterText.passwordText,
    firstname: RegisterText.firstnameText,
    lastname: RegisterText.lastnameText
  }})
    .then(function (response) {
      if (response.data.usernameerror) {
        setRegisterText(prev => ({
          ...prev,
          usernameError: response.data.usernameerror,
          passwordError: '',
          firstnameError: '',
          lastnameError: ''
        }));
        return;
      } else {
        setRegisterText(prev => ({
          ...prev,
          usernameError: ''
        }));
      }
      
      if (response.data.passworderror) {
        setRegisterText(prev => ({
          ...prev,
          usernameError: '',
          passwordError: response.data.passworderror,
          firstnameError: '',
          lastnameError: ''
        }));
        return;
      } else {
        setRegisterText(prev => ({
          ...prev,
          passwordError: ''
        }));
      }

      if (response.data.firstnameerror) {
        setRegisterText(prev => ({
          ...prev,
          usernameError: '',
          passwordError: '',
          firstnameError: response.data.firstnameerror,
          lastnameError: ''
        }));
        return;
      } else {
        setRegisterText(prev => ({
          ...prev,
          firstnameError: ''
        }));
      }

      if (response.data.lastnameerror) {
        setRegisterText(prev => ({
          ...prev,
          usernameError: '',
          passwordError: '',
          firstnameError: '',
          lastnameError: response.data.lastnameerror
        }));
        return;
      } else {
        setRegisterText(prev => ({
          ...prev,
          lastnameError: ''
        }));
      }

      if (response.data.error) {
        console.error(response.data.error);
        alert(response.data.error);
        return;
      } 

      localStorage.setItem('username', RegisterText.usernameText);

      navigate('/registrationSuccessful');
    })
    .catch(function (error) {
      console.error(error);
      alert(error);
    });
}


export function RegisterPage() {
  let navigate = useNavigate();

  const [RegisterText, setRegisterText] = useState({
    usernameText: '',
    passwordText: '',
    firstnameText: '',
    lastnameText: '',
    usernameError: '',
    passwordError: '',
    firstnameError: '',
    lastnameError: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRegisterText((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // const getUsers = () => {
  //   axios.get('/user');
  // };

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
        <Title className={classes.titleSmall}>Create an Account</Title>
        <TextInput
          label="Username"
          placeholder="Your username"
          size="md"
          radius="md"
          name="usernameText"
          value={RegisterText.usernameText}
          onChange={handleChange}
        />
        <RegisterRequirement label={RegisterText.usernameError}/>
        <PasswordInput
          label="Password"
          placeholder="Your password"
          mt="md"
          size="md"
          radius="md"
          name="passwordText"
          value={RegisterText.passwordText}
          onChange={handleChange}
        />
        <RegisterRequirement label={RegisterText.passwordError}/>
        <TextInput
          label="First Name"
          placeholder="Your first name"
          size="md"
          mt="md"
          radius="md"
          name="firstnameText"
          value={RegisterText.firstnameText}
          onChange={handleChange}
        />
        <RegisterRequirement label={RegisterText.firstnameError}/>
        <TextInput
          label="Last Name"
          placeholder="Your last name"
          size="md"
          radius="md"
          mt="md"
          name="lastnameText"
          value={RegisterText.lastnameText}
          onChange={handleChange}
        />
        <RegisterRequirement label={RegisterText.lastnameError}/>
        <Button fullWidth mt="xl" size="md" radius="md" onClick={() =>{tryRegister(RegisterText, setRegisterText, navigate);}}>
          Create Account
        </Button>

        <Text ta="center" mt="md">
          Already have an account?{' '}
          <Link to='/'>
            Go back to login
          </Link>
        </Text>
      
      </Paper>
    </div>
  );
}
