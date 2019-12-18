import React from "react"
import { api } from "../../lib/service/ApiService"
import CommunityView from "./View"
import { Item, Dimmer, Loader, Placeholder} from "semantic-ui-react"
import ModalWrapper from "../../lib/components/Modal"
import ImageDisplay from "../../lib/components/ImageDisplay"
import _ from "lodash"


export default class CommunityList extends React.Component{
    state = {
        loading: true,
        communities: []
    }
    async componentDidMount(){
        const communities = await api.community.getAll()
        this.setState({communities, loading: false})
    }
    render(){
        let { communities, loading } = this.state
        if (communities){
            communities = communities.map(i => ({ ...i, updatedAt: Date.parse(i.updatedAt) }))
            communities = _.orderBy(communities, ['updatedAt'], ['desc']);
            communities = _.take(communities, 5)
        }
        return ( 
            <Dimmer.Dimmable as={Item.Group} divided style={{minHeight: "450px"}}>
            {loading &&
            <React.Fragment>
                {/* <Dimmer active inverted style={{opacity: 0.5}}>
                    <Loader inverted>Loading</Loader>
                </Dimmer> */}
                {[1,2,3,4,5].map(i => (
                    <Item key={"fcph-"+i}>
                        <Placeholder style={{flex: 1}} className="fcph">
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

            {!loading && communities && 
              communities.map(community => 
                    <ModalWrapper key={`featured-${community.id}`} target={CommunityView} id={community.id} trigger={
                        <Item as="a">
                            <Item.Image size="tiny"><ImageDisplay src={community.image}/></Item.Image>
                            <Item.Content verticalAlign='middle' header={community.name} description={community.description} />
                        </Item>
                    } />                
                )
            }
          </Dimmer.Dimmable>
        )
    }
}