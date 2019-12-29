import React from "react"
import { Modal } from "semantic-ui-react"
import FormBuilder from "../../lib/components/FormBuilder"
import { api } from "../../lib/service/ApiService";





export default class CreateCommunity extends React.Component {
    state={
        loading: false,
        open: false,
        errors: {},
        form: {}
    }
    constructor(props){
        super(props);
        this.postForm = this.postForm.bind(this);
        this._handleChange = this._handleChange.bind(this);
        this._handleImageChange = this._handleImageChange.bind(this);
        this._handleKeyDown = this._handleKeyDown.bind(this);
        this._validateForm = this._validateForm.bind(this);
    }

    open = () => this.setState({ open: true })
    close = () => this.setState({ open: false })

    _handleChange(e, { name, value }) { 
        this.setState( state => ({ ...state, form: { ...state.form, [name]: value }, errors: {...state.errors, [name]: undefined } })); 
    }

    _handleKeyDown(e) {
        if (e.key === "Enter") this.postForm()
      }
    
    _validateForm() {
        const { name, description } = this.state.form;
        const nameError = 
            !name || name.length === 0 ? "Please enter a community name" :
            name.length < 4 ? "Community name should be at least 4 characters length" :
            undefined;
        const descriptionError = 
            !description || description.length === 0 ? "Please enter a description for the community" :
            undefined;
        if(nameError || descriptionError){
            this.setState({errors: {name: nameError, description: descriptionError}})
            return false;
        }
        else return true;
            
    }

    _handleImageChange(binaryString){
        this.setState( state => ({ ...state, form: { ...state.form, image: binaryString }})); 
    }
    async postForm(){
        this.setState({serverError: undefined})
        if (this._validateForm()) {
            this.setState({loading: true})
            const result = await await api.community.create(this.state.form)
            if (result instanceof Error) {
                this.setState({serverError: result.message})
            }
            else this.close()

            this.setState({loading: false})
            
        }
        this.setState({loading: false})
    }
    render(){
        const { loading, open, errors, serverError, form } = this.state
        const fields = [
            { type: "Input", label: "Community", name: "name", onChange: this._handleChange, disabled: loading, error: errors.name },
            { type: "TextArea", label: "Description", name: "description", onChange: this._handleChange, disabled: loading, error: errors.description },
            { type: "Tag", label: "Semantic Tags", name: "tags", onChange: this._handleChange, disabled: loading, title: form.name },
        ]
        const actions=[
            { content: "Cancel", icon:"remove", labelPosition: "right", disabled: loading, onClick: this.close },
            { content: "Create", primary: true, icon:"plus sign", labelPosition: "right", onClick: this.postForm, disabled: loading, loading }
          ]
        return <Modal trigger={this.props.trigger} onOpen={this.open} onClose={this.close} open={open}><FormBuilder image={{name: "image", onChange: this._handleImageChange, disabled: loading}} title="Create Community" {... {fields, actions }} error={serverError} /></Modal>
    }
}