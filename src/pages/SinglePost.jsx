import React, { useContext, useState, useRef } from 'react';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';
import moment from 'moment';
import { Grid, Card, Image, Button, Icon, Label, Form, Popup } from 'semantic-ui-react';

import { AuthContext } from '../context/auth';
import LikeButton from '../components/LikeButton';
import DeleteButton from '../components/DeleteButton';

function SinglePost(props) {
    const postId = props.match.params.postId;

    const { user } = useContext(AuthContext);

    const [comment, setComment] = useState('');

    const commentInputRef = useRef(null);

    const { data: { getPost } = {} } = useQuery(FETCH_POST_QUERY, {
        variables: {
            postId
        }
    });

    const [createComment] = useMutation(CREATE_COMMENT_MUTATION, {
        update() {
            setComment('');
            commentInputRef.current.blur();
        },
        variables: {
            postId,
            body: comment
        }
    }) 

    function deletePostCallback() {
        props.history.push('/');
    }

    let postMarkup;
    if(!getPost) {
        postMarkup = <p>Loading post....</p>
    }
    else {
        const { id, body, createdAt, username, likes, likeCount, comments, commentCount } = getPost;

        postMarkup = (
            <Grid>
                <Grid.Row>
                    <Grid.Column width={window.innerWidth<500 ? '6' : '3'}>
                        <Image
                            src='https://react.semantic-ui.com/images/avatar/large/molly.png'
                            size="small"
                            float="right"
                            className="singleImage"
                        />
                    </Grid.Column>
                    <Grid.Column width={window.innerWidth<500 ? '10' : '10'}>
                        <Card className="singlePostCard">
                            <Card.Content>
                                <Card.Header>{username}</Card.Header>
                                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                                <Card.Description>{body}</Card.Description>
                            </Card.Content>
                            <hr />
                            <Card.Content extra>
                                <LikeButton user={user} post={{ id, likeCount, likes }} />
                                <Popup
                                    content="Comment"
                                    inverted
                                    trigger={
                                        <Button as="div" labelPosition="right" onClick={() => console.log('Commented')}>
                                            <Button basic color="blue">
                                                <Icon name="comments" />
                                            </Button>
                                            <Label basic color="blue" pointing="left">
                                                {commentCount}
                                            </Label>
                                        </Button>
                                    }
                                />
                                {user && user.username === username && (
                                    <DeleteButton postId={id} callback={deletePostCallback} />
                                )}
                            </Card.Content>
                        </Card>
                    </Grid.Column>
                    <Grid.Column width={window.innerWidth<500 ? '16' : '13'} style={{ marginTop: 20 }}>
                        {user && (
                            <Card fluid>
                                <Card.Content>
                                    <p>Post a comment</p>
                                    <Form>
                                        <div className="ui action input fluid">
                                            <input
                                                type="text"
                                                placeholder="comment..."
                                                name="comment"
                                                value={comment}
                                                onChange={event => setComment(event.target.value)}
                                                ref={commentInputRef}
                                            />
                                            <button type="submit" className="ui button teal" disabled={comment.trim() === ''} onClick={createComment}>comment</button>
                                        </div>
                                    </Form>
                                </Card.Content>
                            </Card>
                        )}
                        {comments.map((comment) => (
                            <Card fluid key={comment.id}>
                                <Card.Content>
                                    {user && user.username === comment.username && (
                                        <DeleteButton postId={id} commentId={comment.id} />
                                    )}
                                    <Card.Header>{comment.username}</Card.Header>
                                    <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                                    <Card.Description>{comment.body}</Card.Description>
                                </Card.Content>
                            </Card>
                        ))}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }

    return postMarkup;
}

const CREATE_COMMENT_MUTATION = gql`
    mutation($postId: ID!, $body: String!) {
        createComment(postId: $postId, body: $body) {
            id 
            comments {
                id body createdAt username
            }
            commentCount
        }
    }
`;

const FETCH_POST_QUERY = gql`
    query($postId: ID!) {
        getPost(postId: $postId) {
            id
            body
            createdAt
            username
            likeCount
            likes {
                username
            }
            commentCount
            comments {
                id
                username
                createdAt
                body
            }
        }
    }
`

export default SinglePost;