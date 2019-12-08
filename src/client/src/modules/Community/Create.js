import React from "react"
import { Modal } from "semantic-ui-react"
import FormBuilder from "../../lib/components/FormBuilder"
import { api } from "../../lib/service/ApiService";





export default class CreateCommunity extends React.Component {
    state={
        loading: false,
        open: false,
        form: {createdById:1, updatedById:1}
    }
    constructor(props){
        super(props);
        this.postForm = this.postForm.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleImageChange = this.handleImageChange.bind(this);
    }

    open = () => this.setState({ open: true })
    close = () => this.setState({ open: false })

    handleChange(e, { name, value }) { 
        this.setState( state => ({ ...state, form: { ...state.form, [name]: value }})); 
    }

    handleImageChange(blob){
        this.setState( state => ({ ...state, form: { ...state.form, image: blob }})); 
    }
    async postForm(){
        this.setState({loading: true})
        const community = await api.community.create(this.state.form)
        this.setState({loading: false})
        if(community) this.setState({open: false})
    }
    render(){
        const { loading, open } = this.state
        const fields = [
            { type: "Input", label: "Community", name: "name", onChange: this.handleChange, disabled: loading },
            { type: "TextArea", label: "Description", name: "description", onChange: this.handleChange, disabled: loading },
            { type: "Input", label: "Tags", name: "tags", onChange: this.handleChange, disabled: loading },
            { type: "Image", label: "Tags", name: "tags", onChange: this.handleImageChange, disabled: loading }
        ]
        const actions=[
            { content: "Cancel", icon:"remove", labelPosition: "right", disabled: loading, onClick: this.close },
            { content: "Create", primary: true, icon:"plus sign", labelPosition: "right", onClick: this.postForm, disabled: loading, loading }
          ]
        return <Modal trigger={this.props.trigger} onOpen={this.open} onClose={this.close} open={open}><FormBuilder title="Create Community" {... {fields, actions }} /></Modal>
    }
}