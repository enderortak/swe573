import React from "react"
import { Input, Form } from "semantic-ui-react";
import { DateInput as SDateInput, DateTimeInput as SDateTimeInput } from 'semantic-ui-calendar-react';
import Geosuggest from 'react-geosuggest';



const NumericInput = ({label, ...restProps}) => (
    <Form.Field>
        <label>{label}</label>
        <Input
            iconPosition='left'
            icon="sort numeric down"
            {...restProps}
        />
    </Form.Field>

)

const EmailInput = ({label, ...restProps}) => (
    <Form.Field>
        <label>{label}</label>
        <Input
            iconPosition='left'
            icon="at"
            {...restProps}
        />
    </Form.Field>
)

const UrlInput = ({label, ...restProps}) => (
    <Form.Field>
        <label>{label}</label>
        <Input
        label='http://'
            {...restProps}
        />
    </Form.Field>
)

class DateInput extends React.Component{
    state = {}
    render(){
        const {label, ...restProps} = this.props
        return (
            <Form.Field>
                <label>{label}</label>
                <SDateInput
                    placeholder="Date"
                    dateFormat="YYYY-MM-DD"
                    iconPosition="left"
                    {...restProps}
                    value={this.state.value}
                    onChange={ (e, { name, value }) => { this.setState({value}); this.props.onChange(e, {name, value}); } }
                />
            </Form.Field>
        )
    }
}

class DateTimeInput extends React.Component{
    state = {}
    render(){
        const {label, ...restProps} = this.props
        return (
            <Form.Field>
                <label>{label}</label>
                <SDateTimeInput
                    dateFormat="YYYY-MM-DD"
                    placeholder="Date"
                    iconPosition="left"
                    {...restProps}
                    value={this.state.value}
                    onChange={ (e, { name, value }) => { this.setState({value}); this.props.onChange(e, {name, value}); } }
                />
            </Form.Field>
        )
    }
}
class LocationInput extends React.Component{
    state = {}
    render(){
        const {label, ...restProps} = this.props
        return (
            <Form.Field>
                <label>{label}</label>
                <Geosuggest
                    onSuggestSelect={ (suggest) => { console.log(suggest); this.props.onChange(restProps.name, {name: restProps.name, value:suggest.location.lat+","+suggest.location.lng}); } }
                    placeholder="Type Location Name"
                    // {...restProps}
                    value={this.state.value}
                />
            </Form.Field>
        )
    }
}


export {
    NumericInput,
    EmailInput,
    UrlInput,
    DateInput,
    DateTimeInput,
    LocationInput
}