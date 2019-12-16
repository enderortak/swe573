import React from "react"
import { Modal } from "semantic-ui-react"
import FormBuilder from "../../lib/components/FormBuilder"
import { api } from "../../lib/service/ApiService";
import AuthService from "../../lib/service/AuthService";


function validateEmail(email) {
    // var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}


export default class SignUp extends React.Component {
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
        const { username, password, firstName, lastName, email, verifyPassword } = this.state.form;
        const usernameError = 
            !username || username.length === 0 ? "Please enter your username" :
            username.length < 4 ? "Username should be at least 4 characters length" :
            !username.match(/^[0-9a-zA-Z]+$/) ? "Username may contain only numbers and letters":
            undefined;
        const firstNameError = 
            !firstName || firstName.length === 0 ? "Please enter your first name" :
            firstName.length < 2 ? "First name should be at least 2 characters length" :
            undefined;
        const lastNameError = 
            !lastName || lastName.length === 0 ? "Please enter your lastname" :
            lastName.length < 2 ? "Last name should be at least 4 characters length" :
            undefined;
        const emailError = 
            !email || email.length === 0 ? "Please enter your email" :
            !validateEmail(email) ? "Please enter a valid email address" :
            undefined;
        const passwordError = 
            !password || password.length === 0 ? "Please enter your password" :
            password.length < 8 ? "Password should be at least 8 characters length" :
            undefined;
        const verifyPasswordError = 
            !verifyPassword || verifyPassword.length === 0 ? "Please re-enter your password" :
            verifyPassword !==  password ? "Passwords do not match" :
            undefined;
        if(usernameError || passwordError || firstNameError || lastNameError || emailError || verifyPasswordError){
            this.setState({errors: {username: usernameError, password: passwordError, firstName: firstNameError, lastName: lastNameError, email: emailError, verifyPassword: verifyPasswordError} })
            return false;
        }
        else return true;
            
    }

    async postForm(){
        this.setState({serverError: undefined})
        if (this._validateForm()) {
            this.setState({loading: true})
            const result = await api.user.create(this.state.form)
            if (result instanceof Error) {
                this.setState({serverError: result})
            }
            else {
                const user = result
                console.log(result)
                await AuthService.login(user.username, this.state.form.password)
                this.close()
            }
            this.setState({loading: false})
            
        }
        this.setState({loading: false})
    }
    render(){
        const { loading, open, errors, serverError } = this.state
        const fields = [
            { type: "Input", label: "", iconPosition:'left', icon:"user", placeholder: "Username", name: "username", onChange: this._handleChange, disabled: loading, onKeyDown: this._handleKeyDown, error: errors.username  },
            { type: "Input", label: "", iconPosition:'left', icon:"id card", placeholder: "First Name", name: "firstName", onChange: this._handleChange, disabled: loading, onKeyDown: this._handleKeyDown, error: errors.firstName  },
            { type: "Input", label: "", iconPosition:'left', icon:"id card", placeholder: "Last Name", name: "lastName", onChange: this._handleChange, disabled: loading, onKeyDown: this._handleKeyDown, error: errors.lastName  },
            { type: "Input", label: "", iconPosition:'left', icon:"at", placeholder: "Email", name: "email", onChange: this._handleChange, disabled: loading, onKeyDown: this._handleKeyDown, error: errors.email  },
            { type: "Input", label: "", iconPosition:'left', icon:"lock", placeholder: "Password", name: "password", password: true, onChange: this._handleChange, disabled: loading, onKeyDown: this._handleKeyDown, error: errors.password  },
            { type: "Input", label: "", iconPosition:'left', icon:"lock", placeholder: "Verify Password", name: "verifyPassword", password: true, onChange: this._handleChange, disabled: loading, onKeyDown: this._handleKeyDown, error: errors.verifyPassword  },
        ]
        const actions=[
            { content: "Cancel", icon:"remove", labelPosition: "right", disabled: loading, onClick: this.close },
            { content: "Sign Up", primary: true, icon:"chevron right", labelPosition: "right", onClick: this.postForm, disabled: loading, loading }
          ]
        return <Modal size="tiny" trigger={this.props.trigger} onOpen={this.open} onClose={this.close} open={open}><FormBuilder title="Sign Up" {... {fields, actions }} error={serverError} /></Modal>
    }
}