import React, {useContext} from 'react';
import { Card, Image, Button, Label, Icon, Popup } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import moment from 'moment';

import { AuthContext } from '../context/auth';
import LikeButton from './LikeButton';
import DeleteButton from './DeleteButton';

export default function PostCard(props) {
    const { user } = useContext(AuthContext);

    const { body, createdAt, id, username, likeCount, commentCount, likes } = props.post;

    return (
        <Card fluid>
            <Card.Content as={Link} to={`/posts/${id}`}>
                <Image
                floated='right'
                size='mini'
                src='https://react.semantic-ui.com/images/avatar/large/molly.png'
                />
                <Card.Header>{username}</Card.Header>
                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                <Card.Description>{body}</Card.Description>
            </Card.Content>
            <Card.Content extra>
                <LikeButton user={user} post={{ id, likes, likeCount }}  />
                <Popup 
                    content="Comment on post"
                    inverted
                    trigger={
                        <Button labelPosition='right' as={Link} to={`/Posts/${id}`}>
                            <Button color='blue' basic>
                                <Icon name='comment' />
                            </Button>
                            <Label basic color='blue' pointing='left'>
                                {commentCount}
                            </Label>
                        </Button>
                    }
                />
                {user && user.username === username && <DeleteButton postId={id} />}
            </Card.Content>
        </Card>
    )
}
