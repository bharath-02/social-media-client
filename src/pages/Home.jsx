import React, { useContext } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Grid, Transition } from 'semantic-ui-react';

import { AuthContext } from '../context/auth';
import PostCard from '../components/PostCard';
import PostForm from '../components/PostForm';
import { FETCH_POSTS_QUERY } from '../util/graphql';

function Home() {
    const { user } = useContext(AuthContext);
    const { loading, data: { getPosts: posts } = {} } = useQuery(FETCH_POSTS_QUERY);
    
    return (
        <Grid doubling columns={window.innerWidth>550 ? 'three' : 'zero' }>
            <Grid.Row className="post-container">
                {user && (
                    <Grid.Column>
                        <PostForm />
                    </Grid.Column>
                )}
            </Grid.Row>
            <Grid.Row className="page-title">
                <h1>Recent Posts</h1>
            </Grid.Row>
            <Grid.Row>
                {loading ? (
                    <h1>Loading Posts...</h1>
                ) : (
                    <Transition.Group duration={1000}>
                        {posts && posts.map(post => (
                            <Grid.Column key={post.id} style={{ marginBottom: 21 }}>
                                <PostCard post={post} />
                            </Grid.Column>
                        ))}
                    </Transition.Group>
                )}
            </Grid.Row>
        </Grid>
    )
}

export default Home;