import React from "react"
import { Dropdown } from "semantic-ui-react"
import { api } from "../service/ApiService"

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
        loading: false
    }
    handleChange = (e, { searchQuery, value }) => {
        this.setState({ searchQuery: "", selectedTags: value })
        this.props.onChange(e, {name: this.props.name, value})
    }

    handleSearchChange = async (e, { searchQuery }) => {
        if (searchQuery && searchQuery !==""){        
            await this.setState({ searchQuery, loading: true })
            const wikiSuggestions = await api.wiki.getTags(searchQuery)
            if (wikiSuggestions) await this.setState({ loading: false, suggestedTags: wikiSuggestions.map(i => ({key: i.id, text: i.label, value: i.label})) })
        }
        else this.setState({ loading: false, suggestedTags: [], searchQuery:"" })
    }


    render() {
        const { searchQuery, suggestedTags, selectedTags, loading } = this.state

        return (
        <Dropdown
            fluid
            multiple
            onChange={this.handleChange}
            onSearchChange={this.handleSearchChange}
            options={suggestedTags}
            placeholder='State'
            search
            searchQuery={searchQuery}
            selection
            value={selectedTags}
            loading={loading}
        />
        )
    }
}