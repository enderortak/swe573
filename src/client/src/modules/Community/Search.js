import React from "react"
import { Search, Item } from "semantic-ui-react"
import _ from "lodash"
import ImageDisplay from "../../lib/components/ImageDisplay"
import CommunityView from "./View"
import ModalWrapper from "../../lib/components/Modal"


const initialState = { results: [], value: '' }

const resultRenderer = ({ title, description, image, community }) => (
<Item.Group>
    <ModalWrapper
    target={CommunityView}
    community={community}
    trigger={<Item as="a">
        <Item.Image size="large" >
            <ImageDisplay src={image}/>
        </Item.Image>
        <Item.Content>
            <Item.Header>{title}</Item.Header>
            <Item.Meta className="three-line-limited">{description.split("\\n")[0]}</Item.Meta>    
        </Item.Content>
    </Item>}
    />
</Item.Group>
)

export default class CommunitySearch extends React.Component{
    state =  initialState
    handleResultSelect = (e, { result }) => this.setState({ value: result.title })

    handleSearchChange = (e, { value }) => {
        this.setState({ value })
        debugger
        const source = this.props.communities.map(i => ({ community: i, title: i.name, description: i.description, image: i.image }))
        if (value.length < 1) return this.setState(initialState)

        this.setState({
            isLoading: false,
            results: source.filter(result => result.title.toLowerCase().includes(value)).slice(0, 5),
        })

    }
    render(){
        const { isLoading } = this.props
        const { results, value } = this.state
        return <Search
                fluid
                input={{ size:"large", icon: { name: 'search', circular: true, link: true },  placeholder: 'Search Community', fluid: true, style: { textAlign: "center"}}}
                loading={isLoading}
                onResultSelect={this.handleResultSelect}
                onSearchChange={_.debounce(this.handleSearchChange, 500, {
                leading: true,
                })}
                resultRenderer={resultRenderer}
                results={results}
                value={value}
                noResultsMessage={isLoading ? "Fetching communities" : "No matching communities."}

                {...this.props}
            />
    }
}
