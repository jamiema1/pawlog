import {
  AspectRatio,
  Button,
  Card,
  Container,
  Divider,
  Group,
  Image,
  NumberInput,
  Paper,
  Pill,
  Select,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import classes from './PostGallery.module.css';
import axios from './api/axios';
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router';
import dayjs from 'dayjs';

export function PostsGallery() {

  const [posts, setPosts] = useState([]);
  const [tags, setTags] = useState([]);
  const [users, setUsers] = useState([]);

  const userRef = useRef(null);
  const createdDateRef = useRef(null);
  const minLikesRef = useRef(null);

  useEffect(() => {
    getPosts();
    getTags();
    getUsers();
  }, []);

  const getPosts = () => {
    const query = JSON.stringify({
      username: userRef.current?.value,
      created_at: createdDateRef.current?.value,
      minlikes: minLikesRef.current?.value,
    });

    axios.get(`/post/${query}`).then(res => {
      setPosts(res.data.data);
    }).catch(err => {
      alert(err);
    });
  };

  const getTags = () => {
    axios.get('/tag').then(res => {
      setTags(res.data.data);
    }).catch(err => {
      alert(err);
    });
  };

  const getUsers = () =>{ 
    axios.get('/user/postingUsers').then(res => {
      setUsers(res.data.data);
    }).catch(err => {
      alert(err);
    });
  };

  return (
    <Paper className={classes.container} py="xl">
      <Title className={classes.header}>
        Post Gallery
      </Title>
      <Group justify='space-between'>
        <Stack>
          <Group>
            <Select
              label="User"
              placeholder="Pick a value"
              data={users}
              ref={userRef}
              clearable
            />
            <DateInput
              label="Date"
              placeholder="Pick a value"
              minDate={dayjs('2025-07-01')}
              maxDate={dayjs('2025-07-07')}
              ref={createdDateRef}
              clearable
            />
            <NumberInput
              label="Likes"
              placeholder="Set a value"
              min={0}
              max={1000}
              ref={minLikesRef}
            />
          </Group>
          <Pill.Group>
            Popular Tags:
            {tags.map((tag) => (
              <Pill key={tag.tag_name}>{tag.tag_name}: {tag.count}</Pill>
            ))}
          </Pill.Group>
        </Stack>
        <Stack>
          <Button onClick={getPosts}>Filter</Button>
          <Text>Total: {posts.length}</Text>
        </Stack>
      </Group>
      <Container className={classes.galleryContainer}>
        <SimpleGrid cols={{ base: 2 }} spacing={{ base: 'lg' }}>
          {posts.map((post) => (
            <Link key={post.post_id} to={`/posts/${post.post_id}`}>
              <Card p="md" radius="md" className={classes.card}>
                <AspectRatio ratio={1920 / 1080}>
                  <Image
                    src={post.thumbnail}
                    radius="md"
                  />
                </AspectRatio>
                <Text className={classes.title} pt="sm">{post.title}</Text>
                <Text className={classes.author}>{post.author}</Text>
                <Text className={classes.date}>{new Date(post.created_at).toLocaleDateString()}</Text>
                <Divider size="xs" color='black' my='xs' />
                <Text className={classes.likes}>Likes: {post.likes}</Text>
              </Card>
            </Link>
          ))}
        </SimpleGrid>
        {posts.length === 0 && (
          <Text fs="italic" pt='xl'>
              Oops, there is no data for your search. Remove some filters before trying again.
          </Text>
        )}
      </Container>
    </Paper>
  );
}