import { Button, Text, Title } from '@mantine/core';
import classes from './RegistrationSuccessful.module.css';
import { Link } from 'react-router';

export function RegistrationSuccessful() {
  return (
    <div className={classes.outerWrapper}>
      <div className={classes.wrapper}>
        <div className={classes.body}>
          <Title className={classes.title}>Registration Successful</Title>
          <Text fw={500} fz="lg" mb={5}>
            Welcome to our community!
          </Text>
          <Text fz="sm" c="dimmed">
            Now you are connected to the world's premier network of pet owners. Continue to view your brand new profile.
          </Text>

          <div className={classes.controls}>
            <Link to='/posts'>
              <Button radius="md" size="md">
              Continue
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}