import PropTypes from "prop-types"
import React, { Component } from "react"
import ImagePlaceholder from "./lib/images/image-placeholder.png"
import HeroImage from "./lib/images/hero.png"
import Logo from "./lib/images/logo.svg"
import "./App.css"
import {
  Button,
  Container,
  Divider,
  Dropdown,
  Grid,
  Header,
  Icon,
  Image,
  Item,
  List,
  Menu,
  Responsive,
  Segment,
  Sidebar,
  Visibility,
  Card,
  Placeholder
} from "semantic-ui-react"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TestModalView from "./lib/components/TestModalView"
import ModalWrapper from "./lib/components/Modal"
import CreateCommunity from "./modules/Community/Create"
import CommunitySearch from "./modules/Community/Search"
import CommunityList from "./modules/Community/List"
import AuthService from "./lib/service/AuthService"
import * as jwt from 'jsonwebtoken'
import SignUp from "./modules/Auth/SignUp"
import LogIn from "./modules/Auth/LogIn"
import PostList from "./modules/Post/List"
import { api } from "./lib/service/ApiService"
import _ from "lodash"
import PostView from "./modules/Post/View"

// Heads up!
// We using React Static to prerender our docs with server side rendering, this is a quite simple solution.
// For more advanced usage please check Responsive docs under the "Usage" section.
const getWidth = () => {
  const isSSR = typeof window === "undefined"
  return isSSR ? Responsive.onlyTablet.minWidth : window.innerWidth
}

/* eslint-disable react/no-multi-comp */
/* Heads up! HomepageHeading uses inline styling, however it"s not the best practice. Use CSS or styled components for
 * such things.
 */
const HomepageHeading = ({ mobile, user, communities, loading }) => (
  <Container text>
    {
      //   <Header
      //   as="h1"
      //   content="Get Together"
      //   inverted
      //   style={{
      //     fontSize: mobile ? "2em" : "4em",
      //     fontWeight: "normal",
      //     marginBottom: 0,
      //     marginTop: mobile ? "1.5em" : "3em",
      //   }}
      // />
    }
    <Image bordered rounded src={Logo} style={{ display: "inline" }} />
    <Header
      as="h2"
      content="Together, we are stronger!"
      inverted
      style={{
        fontSize: mobile ? "1.5em" : "1.7em",
        fontWeight: "normal",
        marginTop: "0.5em",
        marginBottom: mobile ? "0.5em" : "1em",
      }}
    />
    <Header
      as="h3"
      content="Get started:"
      inverted
      style={{
        fontWeight: "normal",
        margin: "0.7em"
      }}
    />
    <ModalWrapper target={user?CreateCommunity:LogIn} trigger={
      <Button color="green" size="huge">
        Create a Community
        <Icon name="right arrow" />
      </Button>
    } />
    <Divider inverted horizontal>Or</Divider>
    <CommunitySearch communities={communities} isLoading={loading}/>

  </Container>
)

HomepageHeading.propTypes = {
  mobile: PropTypes.bool,
}

/* Heads up!
 * Neither Semantic UI nor Semantic UI React offer a responsive navbar, however, it can be implemented easily.
 * It can be more complicated, but you can create really flexible markup.
 */
class DesktopContainer extends Component {
  state = {}

  hideFixedMenu = () => this.setState({ fixed: false })
  showFixedMenu = () => this.setState({ fixed: true })

  render() {
    const { children, user, loading } = this.props
    const { fixed } = this.state

    return (
      <Responsive getWidth={getWidth} minWidth={Responsive.onlyTablet.minWidth}>
        <Visibility
          once={false}
          onBottomPassed={this.showFixedMenu}
          onBottomPassedReverse={this.hideFixedMenu}
        >
          <div style={{ backgroundImage: `url(${HeroImage})` }}>
            <Segment
              inverted
              textAlign="center"
              style={{ minHeight: 700, padding: "1em 0em", background: "rgba(27, 28, 29, 0.9)" }}
              vertical
            >
              <Menu
                fixed={fixed ? "top" : null}
                inverted={!fixed}
                pointing={!fixed}
                secondary={!fixed}
                size="large"
              >
                <Container>
                  <Menu.Item as="a" active>
                    Home
                </Menu.Item>
                  <Menu.Item as="a">Advanced Search</Menu.Item>
                  <Menu.Item position="right">
                    {!user &&
                      <React.Fragment>
                        <ModalWrapper target={LogIn} trigger={<Button as="a" inverted={!fixed}>Log in</Button>} />
                        <ModalWrapper target={SignUp} trigger={<Button as="a" inverted={!fixed} primary={fixed} style={{ marginLeft: "0.5em" }}>Sign Up</Button>} />
                      </React.Fragment>
                    }
                    {user &&
                      <Dropdown
                        trigger={
                        <Button id="account-dropdown" as="a" inverted={!fixed} icon labelPosition='left' style={{ marginLeft: "0.5em", paddingRight: "2.5em" }}>
                          <Icon><Image src={ImagePlaceholder} /></Icon>
                          {user.fullName}
                          <Icon name='dropdown' style={{ left: "inherit", right: 0 }} />
                        </Button>
                      }
                        options={[{ key: 'signout', text: 'Sign Out', icon: 'sign-out', onClick: () => AuthService.logout() }]}
                        direction="left"
                        icon={null}
                      />

                    }
                  </Menu.Item>
                </Container>
              </Menu>
              <HomepageHeading communities={this.props.communities} user={user} loading={loading}/>
            </Segment>
          </div>
        </Visibility>

        {children}
      </Responsive>
    )
  }
}

DesktopContainer.propTypes = {
  children: PropTypes.node,
}

class MobileContainer extends Component {
  state = {}

  handleSidebarHide = () => this.setState({ sidebarOpened: false })

  handleToggle = () => this.setState({ sidebarOpened: true })

  render() {
    const { children, user } = this.props
    const { sidebarOpened } = this.state

    return (
      <Responsive
        as={Sidebar.Pushable}
        getWidth={getWidth}
        maxWidth={Responsive.onlyMobile.maxWidth}
      >
        <Sidebar
          as={Menu}
          animation="push"
          inverted
          onHide={this.handleSidebarHide}
          vertical
          visible={sidebarOpened}
        >
          <Menu.Item as="a" active>
            Home
          </Menu.Item>
          <Menu.Item as="a">Work</Menu.Item>
          <Menu.Item as="a">Company</Menu.Item>
          <Menu.Item as="a">Careers</Menu.Item>
          <ModalWrapper target={LogIn} trigger={
            <Menu.Item as="a">Log in</Menu.Item>
          } />

          <ModalWrapper target={SignUp} trigger={
            <Menu.Item as="a">Sign Up</Menu.Item>
          } />

        </Sidebar>

        <Sidebar.Pusher dimmed={sidebarOpened}>
          <Segment
            inverted
            textAlign="center"
            style={{ minHeight: 350, padding: "1em 0em" }}
            vertical
          >
            <Container>
              <Menu inverted pointing secondary size="large">
                <Menu.Item onClick={this.handleToggle}>
                  <Icon name="sidebar" />
                </Menu.Item>
                <Menu.Item position="right">
                  <ModalWrapper target={LogIn} trigger={
                    <Button as="a" inverted>
                      Log in
                  </Button>
                  } />

                  <ModalWrapper target={SignUp} trigger={
                    <Button as="a" inverted style={{ marginLeft: "0.5em" }}>
                      Sign Up
                    </Button>
                  } />

                </Menu.Item>
              </Menu>
            </Container>
            <HomepageHeading mobile user={user} />
          </Segment>

          {children}
        </Sidebar.Pusher>
      </Responsive>
    )
  }
}

MobileContainer.propTypes = {
  children: PropTypes.node,
}

const ResponsiveContainer = ({ children, user, communities, loading }) => (
  <div>
    <DesktopContainer communities={communities} user={user} loading={loading}>{children}</DesktopContainer>
    <MobileContainer communities={communities} user={user} loading={loading}>{children}</MobileContainer>
  </div>
)

ResponsiveContainer.propTypes = {
  children: PropTypes.node,
}

class HomepageLayout extends React.Component {
  constructor(props) {
    super(props);
    this.subscribeCommunity = this.subscribeCommunity.bind(this)
    this.unsubscribeCommunity = this.unsubscribeCommunity.bind(this)
    this.state = {
      user: null, communities: [], loading: true
    };
  }
  async componentDidMount() {
    AuthService.token.subscribe(x => this.setState({ user: x ? jwt.decode(x) : null }));
    const communities = await api.community.getAll()
    const posts = await api.post.getAll()
    this.setState({communities, posts, loading: false})
  }
  
  async subscribeCommunity(id){    
    await api.community.join(id)
    this.setState(state => ({...state, communities: state.communities.map(i => ({ ...i, isMember: i.id === id ? true : i.isMember }))}))
  }
  async unsubscribeCommunity(id){    
    await api.community.leave(id)
    this.setState(state => ({...state, communities: state.communities.map(i => ({ ...i, isMember: i.id === id ? false : i.isMember }))}))
  }
  render() {
    const { user, communities, posts, loading } = this.state;
    const randomPost = posts ? posts[_.random(posts.length-1)] : undefined
    const postOfTheMonth = posts ? _.orderBy(posts, [function (o) {
        return o.likes.length;
    }], ['desc'])[0] : undefined
    return (

      <ResponsiveContainer communities={communities} user={user} loading={loading}>


        
        <Segment vertical style={{ padding: "8em 0em" }} >
          <Container>
            <Grid divided>
              <Grid.Row>
                <Grid.Column width={8} style={{ padding: "0 2rem" }}>
                  <Header as="h3" dividing content="Latest Posts" />
                  <Item.Group>
                    <PostList posts={posts} loading={loading}/>
                  </Item.Group>
                </Grid.Column>
                <Grid.Column width={8} style={{ padding: "0 2rem" }}>
                  <Header as="h3" dividing content="Featured Communities" />
                  <CommunityList communities={communities} loading={loading} subscribeCommunity={this.subscribeCommunity} unsubscribeCommunity={this.unsubscribeCommunity}/>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Container>
        </Segment>
        <Segment style={{ padding: "0em" }} vertical>
          <Grid celled="internally" stackable>
            <Grid.Row textAlign="center">
              <Grid.Column width={8} style={{ paddingBottom: "4em", paddingTop: "4em" }}>
                <Header as="h3" style={{ fontSize: "2em" }} textAlign="center" icon>
                  <Icon name="trophy" style={{background: "-webkit-linear-gradient(gold, darkgoldenrod)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"}} />
                  Post of the Month
                </Header>
              </Grid.Column>
              <Grid.Column width={8}>
              {
                !postOfTheMonth &&
                <Card className="post">
                  <Placeholder><Placeholder.Image square /></Placeholder>
                  <Card.Content>
                    <Placeholder>
                        <Placeholder.Header>
                          <Placeholder.Line length='medium' />
                          <Placeholder.Line length='very long' />
                        </Placeholder.Header>
                        <Placeholder.Paragraph>
                          <Placeholder.Line length='long' />
                        </Placeholder.Paragraph>
                      </Placeholder>
                  </Card.Content>
                </Card>
              }
              {
                postOfTheMonth && 
                <ModalWrapper
                  target={PostView}
                  post={postOfTheMonth}
                  trigger={
                    <Card className="post">
                      <Image src={postOfTheMonth.image || ImagePlaceholder} />
                      <Card.Content>
                            <Card.Header content={postOfTheMonth.title} />
                            <Card.Meta content={postOfTheMonth.community.name} />
                      </Card.Content>
                    </Card>
                  }
                />
              }
              </Grid.Column>
            </Grid.Row>
            <Grid.Row textAlign="center">
              <Grid.Column width={8} style={{ paddingBottom: "4em", paddingTop: "4em" }}>
                <Header as="h3" style={{ fontSize: "2em" }} textAlign="center" icon>
                  <Icon name="refresh" style={{background: "-webkit-linear-gradient(cornflowerblue, limegreen)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"}} />
                  Random Post
                </Header>
              </Grid.Column>
              <Grid.Column width={8}>
              {
                !randomPost &&
                <Card className="post">
                  <Placeholder><Placeholder.Image square /></Placeholder>
                  <Card.Content>
                    <Placeholder>
                        <Placeholder.Header>
                          <Placeholder.Line length='medium' />
                          <Placeholder.Line length='very long' />
                        </Placeholder.Header>
                        <Placeholder.Paragraph>
                          <Placeholder.Line length='long' />
                        </Placeholder.Paragraph>
                      </Placeholder>
                  </Card.Content>
                </Card>
              }
              {
                randomPost && 
                <ModalWrapper
                  target={PostView}
                  post={randomPost}
                  trigger={
                    <Card className="post">
                      <Image src={randomPost.image || ImagePlaceholder} />
                      <Card.Content>
                            <Card.Header content={randomPost.title} />
                            <Card.Meta content={randomPost.community.name} />
                      </Card.Content>
                    </Card>
                  }
                />
              }
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
        <Segment inverted vertical style={{ padding: "5em 0em" }}>
          <Container>
            <Grid divided inverted stackable>
              <Grid.Row>
                <Grid.Column width={3}>
                  <Header inverted as="h4" content="About" />
                  <List link inverted>
                    <List.Item as="a">Sitemap</List.Item>
                    <List.Item as="a">Contact Us</List.Item>
                    <List.Item as="a">Legal Disclaimer</List.Item>
                  </List>
                </Grid.Column>
                <Grid.Column width={13}>
                  <Header as="h4" inverted>
                    About the Project
                  </Header>
                  <p>This software was developed for SWE 573 course of the Software Engineering graduate program provided by Boğaziçi University.</p>
                  <p>Information on this website are for demonstration purposes, and are not created by real people.</p>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Container>
        </Segment>
        
        <ToastContainer />
      </ResponsiveContainer>
    )
  }
}

export default HomepageLayout