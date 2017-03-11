import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import layout from 'styles/layout.scss';
import BlogPreviewList from 'components/BlogComponents/BlogPreviewList';
import BlogPost from 'components/BlogComponents/BlogPost';
import LoadingIndicator from 'components/LoadingIndicator';

import {
  getPostBySlug,
  getPosts,
} from './actions';
import {
  makeSelectFocusedPost,
  makeSelectPosts,
  makeSelectLoading,
} from './selectors';

class Blog extends Component {
  componentDidMount() {
    const {
      onGetPost,
      onGetPosts,
      routeParams,
    } = this.props;

    // Load content based on if this container is being used to display
    // all posts or a single post specified by the route pathing
    if (routeParams) {
      // Get and render the single post foxued by the user
      console.log(`Retrieve blog post: ${routeParams.postSlug}`);
      onGetPost(routeParams.postSlug);
    } else {
      // On mount, fetch posts from the API to populate the redux store
      // The template below will populate itself based on the store's contents
      console.log('Blog mounted, loading all posts');
      onGetPosts();
    }
  }

  render() {
    const {
      focusedPost,
      loading,
      posts,
      routeParams,
    } = this.props;

    // Display a single blog post or a list of previews depending on location in the app
    const BlogContainerContent = routeParams ?
      focusedPost && <BlogPost post={focusedPost} /> :
      posts && <BlogPreviewList posts={posts} />;

    return (
      <section id="content" className={layout.container}>
        {loading ? <LoadingIndicator /> : BlogContainerContent}
      </section>
    );
  }
}

Blog.propTypes = {
  focusedPost: PropTypes.object,
  loading: PropTypes.bool,
  onGetPost: PropTypes.func,
  onGetPosts: PropTypes.func,
  posts: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]),
  routeParams: PropTypes.object,
};

const mapDispatchToProps = (dispatch) => ({
  onGetPost: (slug) => dispatch(getPostBySlug(slug)),
  onGetPosts: () => dispatch(getPosts()),
});

const mapStateToProps = createStructuredSelector({
  focusedPost: makeSelectFocusedPost(),
  posts: makeSelectPosts(),
  loading: makeSelectLoading(),
});

// Wrap the component to inject dispatch and state
export default connect(mapStateToProps, mapDispatchToProps)(Blog);
