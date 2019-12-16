import React from "react"
import { Modal } from "semantic-ui-react"
import FormBuilder from "../../lib/components/FormBuilder"
import AuthService from "../../lib/service/AuthService";





export default class LogIn extends React.Component {
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
        this._handleKeyDown = this._handleKeyDown.bind(this);
        this._validateForm = this._validateForm.bind(this);
    }

    open = () => this.setState({ open: true })
    close = () => this.setState({ open: false })

    _handleChange(e, { name, value }) { 
        this.setState( state => ({ ...state, form: { ...state.form, [name]: value }, errors: {...state.errors, [name]: undefined } })); 
    }

    _handleKeyDown(e) {
        if (e.key === 'Enter') this.postForm()
      }
    
    _validateForm() {
        const { username, password } = this.state.form;
        const usernameError = 
            !username || username.length === 0 ? "Please enter your username" :
            username.length < 4 ? "Username should be at least 4 characters length" :
            !username.match(/^[0-9a-zA-Z]+$/) ? "Username may contain only numbers and letters":
            undefined;
        const passwordError = 
            !password || password.length === 0 ? "Please enter your password" :
            password.length < 8 ? "Password should be at least 8 characters length" :
            undefined;
        if(usernameError || passwordError){
            this.setState({errors: {username: usernameError, password: passwordError}})
            return false;
        }
        else return true;
            
    }
    async postForm(){
        this.setState({serverError: undefined})
        if (this._validateForm()) {
            this.setState({loading: true})
            const {username, password} = this.state.form
            const result = await AuthService.login(username, password)
            if (result instanceof Error) {
                this.setState({serverError: result})
            }
            else this.close()
            this.setState({loading: false})
            
        }
    }
    render(){
        const { loading, open, errors, serverError } = this.state
        const fields = [
            { type: "Input", label: "", iconPosition:'left', icon:"user", placeholder: "Username", name: "username", onChange: this._handleChange, disabled: loading, onKeyDown: this._handleKeyDown, error: errors.username },
            { type: "Input", label: "", iconPosition:'left', icon:"lock", placeholder: "Password", name: "password", password: true, onChange: this._handleChange, disabled: loading, onKeyDown: this._handleKeyDown, error: errors.password }
        ]
        const actions=[
            { content: "Cancel", icon:"remove", labelPosition: "right", disabled: loading, onClick: this.close },
            { content: "Log In", primary: true, icon:"chevron right", labelPosition: "right", onClick: this.postForm, disabled: loading, loading }
          ]
        return <Modal size="tiny" trigger={this.props.trigger} onOpen={this.open} onClose={this.close} open={open}><FormBuilder title="Log In" {... {fields, actions }}  error={serverError && serverError.message}/></Modal>
    }
}