import React from "react"
import { Modal } from "semantic-ui-react"
import FormBuilder from "../../lib/components/FormBuilder"
import { api } from "../../lib/service/ApiService";
import AuthService from "../../lib/service/AuthService";





export default class LogIn extends React.Component {
    state={
        loading: false,
        open: false
    }
    constructor(props){
        super(props);
        this.postForm = this.postForm.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    open = () => this.setState({ open: true })
    close = () => this.setState({ open: false })

    handleChange(e, { name, value }) { 
        this.setState( state => ({ ...state, form: { ...state.form, [name]: value }})); 
    }

    async postForm(){
        this.setState({loading: true})
        const {username, password} = this.state.form
        const token = await AuthService.login(username, password)
        this.setState({loading: false})
        this.close()
    }
    render(){
        const { loading, open } = this.state
        const fields = [
            { type: "Input", label: "", iconPosition:'left', icon:"user", placeholder: "Username", name: "username", onChange: this.handleChange, disabled: loading },
            { type: "Input", label: "", iconPosition:'left', icon:"lock", placeholder: "Password", name: "password", password: true, onChange: this.handleChange, disabled: loading }
        ]
        const actions=[
            { content: "Cancel", icon:"remove", labelPosition: "right", disabled: loading, onClick: this.close },
            { content: "Log In", primary: true, icon:"chevron right", labelPosition: "right", onClick: this.postForm, disabled: loading, loading }
          ]
        return <Modal size="tiny" trigger={this.props.trigger} onOpen={this.open} onClose={this.close} open={open}><FormBuilder title="Log In" {... {fields, actions }} /></Modal>
    }
}