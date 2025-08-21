import { useState } from 'react';
import { Button, Group, Image, Stack, Title } from '@mantine/core';
import { Link, Outlet, useNavigate } from 'react-router';
import classes from './NavBar.module.css';

const links = [
  { link: '/posts', label: 'Posts' },
  { link: '/account', label: 'Account' },
  { link: '/summary', label: 'Admin' },
];

export function NavBar() {
  const navigate = useNavigate();

  const [active, setActive] = useState('Posts');

  const logOut = () => {
    localStorage.removeItem('username');
    navigate('/');
  };

  return (
    <Group className={classes.group}>
      <nav className={classes.navbar}>
        <Stack style={{ flexGrow: 1 }} mb='xl'>
          <Group className={classes.header}>
            <Image
              radius="md"
              h={30}
              w={30}
              fit="contain"
              src="/dog-paw.svg"
            />
            <Title>Pawlog</Title>
          </Group>
          <Stack justify='space-between' style={{ height: '100%' }}>
            <Stack>
              {links.map((item) => (
                <Link
                  key={item.label}
                  to={item.link}
                  data-active={item.label === active || undefined}
                  className={classes.link}
                  onClick={() => setActive(item.label)}>
                  {item.label}
                </Link>
              ))}
            </Stack>
            <Button onClick={logOut}>Log Out</Button>
          </Stack>
        </Stack>
      </nav>
      <Outlet />
    </Group>
  );
}