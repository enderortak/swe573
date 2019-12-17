import React from "react"
import { api } from "../../lib/service/ApiService"
import CommunityView from "./View"
import { Item } from "semantic-ui-react"
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
        let { communities } = this.state
        if (communities){
            communities = communities.map(i => ({ ...i, updatedAt: Date.parse(i.updatedAt) }))
            communities = _.orderBy(communities, ['updatedAt'], ['desc']);
            communities = _.take(communities, 5)
        }
        return (
            <Item.Group>
            {communities && 
              communities.map(community => 
                    <ModalWrapper key={`featured-${community.id}`} target={CommunityView} id={community.id} trigger={
                        <Item as="a">
                            <Item.Image size="tiny"><ImageDisplay /></Item.Image>
                            <Item.Content verticalAlign='middle' header={community.name} description={community.description} />
                        </Item>
                    } />                
                )
            }
          </Item.Group>
        )
    }
}