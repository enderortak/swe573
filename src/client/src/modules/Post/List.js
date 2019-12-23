import React from "react"
import { api } from "../../lib/service/ApiService"
import CommunityView from "./View"
import { Item, Dimmer, Loader, Placeholder} from "semantic-ui-react"
import ModalWrapper from "../../lib/components/Modal"
import ImageDisplay from "../../lib/components/ImageDisplay"
import _ from "lodash"
import PostView from "./View"


export default class PostList extends React.Component{
    state = {
        loading: true,
        posts: []
    }
    async componentDidMount(){
        const posts = await api.post.getAll()
        this.setState({posts, loading: false})
    }
    render(){
        let { posts, loading } = this.state

        if (posts){
            posts = posts.map(i => ({ ...i, updatedAt: Date.parse(i.updatedAt) }))
            posts = _.orderBy(posts, ['updatedAt'], ['desc']);
            posts = _.take(posts, 5)
        }
        return ( 
            
            <Dimmer.Dimmable as={Item.Group} divided style={{minHeight: "450px"}}>
            {loading &&
            <React.Fragment>
                {[1,2,3,4,5].map(i => (
                    <Item key={"lpph-"+i}>
                        <Placeholder style={{flex: 1}} className="lpph">
                            <Placeholder.Header image>
                                <Placeholder.Line />
                                <Placeholder.Line />
                                <Placeholder.Line />
                                <Placeholder.Line />
                            </Placeholder.Header>
                        </Placeholder>
                    </Item>
                ))}
            </React.Fragment>
            }

            {!loading && posts && 
              posts.map(post => 
                    <ModalWrapper updateHelper={this.props.updateHelper} key={`featured-${post.id}`} target={PostView} post={post} id={post.id} trigger={
                        <Item as="a">
                            <Item.Image size="tiny"><ImageDisplay src={post.image}/></Item.Image>
                            <Item.Content verticalAlign='middle'>
                                <Item.Header content={post.title} />
                                <Item.Description content={post.community.name} style={{display: "-webkit-box", WebkitLineClamp: 3, overflow: "hidden", textOverflow: "ellipsis", WebkitBoxOrient: "vertical"}} />
                            </Item.Content>
                        </Item>
                    } />                
                )
            }
          </Dimmer.Dimmable>
        )
    }
}