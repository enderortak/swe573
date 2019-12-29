import React from "react"
import { Dropdown, Label, Icon } from "semantic-ui-react"
import { api } from "../service/ApiService"
import _ from "lodash"

const options = [1,2,3,4,5].map(i => ({
    key: i,
    text: i + "" + i + "" + i,
    value: i,
  }))

export class WikiDataTagInput extends React.Component{
    state = {
        suggestedTags: [],
        selectedTags: [],
        searchQuery: "",
        loading: false,
        titleSuggestions: []
    }
    async componentDidUpdate(prevProps, prevState, snapshot){
        if (prevProps.title !== this.props.title){
            if (this.props.title && this.props.title !== "" ){   
                    const titleSegments = this.props.title.split(" ")
                    const wikiSuggestions = (await Promise.all(titleSegments.map(async i => await api.wiki.getTags(i,5)))).flat()
                    this.setState(state => ({ ...state, titleSuggestions: wikiSuggestions ? wikiSuggestions.map(j => ({key: j.id, text: j.label, value: j.label})) : [] }))            
            }
            else this.setState(state => ({ ...state, titleSuggestions: [] }))
        }
    }
    handleChange = (e, { searchQuery, value }) => {
        this.setState(state =>({ searchQuery: "", selectedTags: value }))
        this.props.onChange(e, {name: this.props.name, value: value.join(",")})
    }

    handleSearchChange = async (e, { searchQuery }) => {
        this.setState(state =>({ ...state, searchQuery }))

        if (searchQuery && searchQuery !=="") this.updateSuggestedTags(searchQuery)
        else this.setState(state => ({ ...state, loading: false, suggestedTags: [], searchQuery:"" }))
    }
    updateSuggestedTags = async (searchQuery) => {
        this.setState(state => ({ ...state, loading: true }))
        const wikiSuggestions = await api.wiki.getTags(searchQuery, 5)
        this.setState(state => ({ ...state, loading: false, suggestedTags: wikiSuggestions ? wikiSuggestions.map(i => ({key: i.id, text: i.label, value: i.label})) : [] }))
    }
    addExternalTag = option => this.setState(state => ({ ...state, titleSuggestions: state.titleSuggestions.filter(i => i.text !== option.text), selectedTags: [ ...state.selectedTags, option.text ] }))
    // this.state.selectedTags.length === 0
    render() {
        const { searchQuery, suggestedTags, selectedTags, loading, titleSuggestions } = this.state

        return ([
        <Dropdown
        allowAdditions={true}
            fluid
            multiple
            onChange={this.handleChange}
            onSearchChange={this.handleSearchChange}
            options={[...suggestedTags, ...selectedTags.map(i => ({text: i, value: i}))]}
            search
            searchQuery={searchQuery}
            selection
            value={selectedTags}
            loading={loading}
        />,
        <div style={{padding: "1em 0"}}>
            {
                titleSuggestions.map(i =>
                    <Label tag style={{marginBottom: "0.5em", paddingRight: 0, marginRight: "1em"}}>
                        {i.text}
                        <Label.Detail><a href="#" onClick={() => this.addExternalTag(i)}><Icon name="plus circle" /></a></Label.Detail>
                    </Label>
                )
            }
        </div>
        ]
        )
    }
}