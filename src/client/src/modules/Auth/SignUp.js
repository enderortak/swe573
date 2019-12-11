import React from "react"
import { Modal } from "semantic-ui-react"
import FormBuilder from "../../lib/components/FormBuilder"
import { api } from "../../lib/service/ApiService";
import AuthService from "../../lib/service/AuthService";





export default class SignUp extends React.Component {
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
        const user = await api.user.create(this.state.form)
        this.setState({loading: false})
        if(user) {
            debugger;
            AuthService.login(user.username, this.state.form.password)
            this.setState({open: false})
        }
    }
    render(){
        const { loading, open } = this.state
        const fields = [
            { type: "Input", label: "", iconPosition:'left', icon:"user", placeholder: "Username", name: "username", onChange: this.handleChange, disabled: loading },
            { type: "Input", label: "", iconPosition:'left', icon:"id card", placeholder: "First Name", name: "firstName", onChange: this.handleChange, disabled: loading },
            { type: "Input", label: "", iconPosition:'left', icon:"id card", placeholder: "Last Name", name: "lastName", onChange: this.handleChange, disabled: loading },
            { type: "Input", label: "", iconPosition:'left', icon:"at", placeholder: "Email", name: "email", onChange: this.handleChange, disabled: loading },
            { type: "Input", label: "", iconPosition:'left', icon:"lock", placeholder: "Password", name: "password", password: true, onChange: this.handleChange, disabled: loading },
            { type: "Input", label: "", iconPosition:'left', icon:"lock", placeholder: "Verify Password", name: "verifyPassword", password: true, onChange: this.handleChange, disabled: loading },
        ]
        const actions=[
            { content: "Cancel", icon:"remove", labelPosition: "right", disabled: loading, onClick: this.close },
            { content: "Sign Up", primary: true, icon:"chevron right", labelPosition: "right", onClick: this.postForm, disabled: loading, loading }
          ]
        return <Modal size="tiny" trigger={this.props.trigger} onOpen={this.open} onClose={this.close} open={open}><FormBuilder title="Sign Up" {... {fields, actions }} /></Modal>
    }
}