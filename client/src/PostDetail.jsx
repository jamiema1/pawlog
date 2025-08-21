import {
  Container,
  Title,
  Text,
  Image,
  Divider,
  TextInput,
  Button,
  Stack,
  NumberInput,
  Group,
} from '@mantine/core';
import { useEffect, useRef, useState } from 'react';
import axios from './api/axios';
import classes from './PostDetail.module.css';
import { useNavigate, useParams } from 'react-router';

export function PostDetail() {
  const navigate = useNavigate();

  const { id } = useParams();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);

  const userIdRef = useRef(null);
  const commentRef = useRef(null);

  useEffect(() => {
    fetchPost();
  }, []);

  const fetchPost = async () => {
    try {
      const res = await axios.get(`/postSingle/${id}`);
      const postComments = await axios.get(`/postSingle/comments/${id}`);

      setPost(res.data);
      setComments(postComments.data);
    } catch (err) {
      setPost(null);
      setComments([]); 
      console.error(err);
      alert(err);
    }
  };

  const handleAddComment = async () => {
    const userId = userIdRef.current.value;
    const newComment = commentRef.current.value;

    const sanitizeComment = (comment) => {
      return comment.replace(/[^a-zA-Z0-9 .,!?'"()-]/g, '');
    };

    try {
      await axios.post('/postSingle/comments', {
        postId: parseInt(id),
        userId: userId,
        content: sanitizeComment(newComment),
      });

      const updatedComments = await axios.get(`/postSingle/comments/${id}`);
      setComments(updatedComments.data);
      userIdRef.current.value = null
      commentRef.current.value = null
    } catch (err) {
      alert(`Failed to post comment - Invalid User ID: ${userId}`);
      console.error('Failed to post comment:', err);
    }
  };

  const deletePost = () => {
    axios.delete(`/postSingle/${id}`).then(() => {
      alert('Successfully deleted post');
      navigate('/posts');
    }).catch(() => {
      alert('Failed to delete post');
    });
  };

  return (
    <Container className={classes.container} py="xl">
      <Group justify='space-between' mb='xl'>
        <Button onClick={() => navigate(-1)}>
        Go Back
        </Button>
        <Button onClick={deletePost}>
        Delete
        </Button>
      </Group>

      {post && (
        <Stack>
          <Title>{post.title}</Title>
          <Text size="sm">
            By {post.author} • {new Date(post.created_at).toLocaleString()}
          </Text>
          <Image
            maw={200}
            mah={200}
            src={post.thumbnail || '/loginwrapper.jpg'}
            mt="md"
            radius="md"
          />
          <Divider my="md" />
          <Text size="md">{post.content}</Text>
          <Divider my="md" />
          <Text>Likes: {post.likes}</Text>
          <Divider my="md" />
          <Title order={3}>Comments</Title>
          {comments.length === 0 ? (
            <Text>No comments yet</Text>
          ) : (
            comments.map((comment) => (
              <div key={comment.COMMENT_ID}>
                <Text size="sm">
                  {comment.USERNAME} • {new Date(comment.CREATED_AT).toLocaleString()}
                </Text>
                <Text mb="sm">{comment.CONTENT}</Text>
              </div>
            ))
          )}
          <Divider my="md" />
          <Title order={3}>Add a Comment</Title>
          <NumberInput
            label="User ID"
            placeholder="e.g. 1"
            min={1}
            ref={userIdRef}
            mb="sm"
          />
          <TextInput
            label="Comment"
            placeholder="Write your comment..."
            ref={commentRef}
            mb="sm"
          />
          <Button onClick={handleAddComment}>Post Comment</Button>
        </Stack>
      )}
    </Container>
    
  );
}