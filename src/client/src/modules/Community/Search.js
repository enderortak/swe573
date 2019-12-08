import React from "react"
import { Search } from "semantic-ui-react"
import _ from "lodash"
import { api } from "../../lib/service/ApiService"


const initialState = { isLoading: false, results: [], value: '' }

export default class CommunitySearch extends React.Component{
    state =  initialState
    handleResultSelect = (e, { result }) => this.setState({ value: result.title })

    handleSearchChange = async (e, { value }) => {
        this.setState({ isLoading: true, value })

        let source = await api.community.getAll()
        source = source.map(i => ({ ...i, title: i.name }))
        if (this.state.value.length < 1) return this.setState(initialState)

        const re = new RegExp(_.escapeRegExp(this.state.value), 'i')
        const isMatch = (result) => re.test(result.name)

        this.setState({
            isLoading: false,
            results: _.filter(source, isMatch),
        })

    }
    render(){
        const { isLoading, results, value } = this.state
        return <Search
                fluid
                input={{ size:"large", icon: { name: 'search', circular: true, link: true },  placeholder: 'Search Community', fluid: true, style: { textAlign: "center"}}}
                loading={isLoading}
                onResultSelect={this.handleResultSelect}
                onSearchChange={_.debounce(this.handleSearchChange, 500, {
                leading: true,
                })}
                results={results}
                value={value}
                {...this.props}
            />
    }
}
