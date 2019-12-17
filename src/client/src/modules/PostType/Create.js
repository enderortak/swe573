import React from "react"
import { Modal, Header, Item, Button, Segment, Message, Input, Dropdown } from "semantic-ui-react"
import FormBuilder from "../../lib/components/FormBuilder"
import { api } from "../../lib/service/ApiService";





export default class CreatePostType extends React.Component {
    state={
        loading: false,
        open: false,
        errors: {},
        form: { communityId: this.props.communityId, fields: [] },
        fieldForm: {},
        fieldEditorVisible: false
    }
    constructor(props){
        super(props);
        this.postForm = this.postForm.bind(this);
        this._handleChange = this._handleChange.bind(this);
        this._handleImageChange = this._handleImageChange.bind(this);
        this._handleFieldEditorChange = this._handleFieldEditorChange.bind(this);
        this._handleAddField = this._handleAddField.bind(this)
        this._validateForm = this._validateForm.bind(this);
    }

    open = () => this.setState({ open: true })
    close = () => this.setState({ open: false })
    showFieldEditor = () => this.setState({ fieldEditorVisible: true })
    hideFieldEditor = () => this.setState({ fieldEditorVisible: false })

    _handleChange(e, { name, value }) { 
        this.setState( state => ({ ...state, form: { ...state.form, [name]: value }, errors: {...state.errors, [name]: undefined } })); 
    }

    _handleFieldEditorChange(e, { name, value }) {
        this.setState( state => ({ ...state, fieldForm: { ...state.fieldForm, [name]: value }, errors: {...state.errors, [name]: undefined } })); 
      }
    
    _validateForm() {
        const { name } = this.state.form;
        const nameError = 
            !name || name.length === 0 ? "Please enter a name for the post type" :
            name.length < 4 ? "Post type name should be at least 4 characters length" :
            undefined;
        if(nameError){
            this.setState({errors: {name: nameError}})
            return false;
        }
        else return true;
            
    }
    

    _handleImageChange(binaryString){
        this.setState( state => ({ ...state, form: { ...state.form, image: binaryString }})); 
    }
    _handleAddField(){
        this.setState(state => ({ ...state, form: {...state.form, fields: [ ...state.form.fields, { name: state.fieldForm.fieldName, type: state.fieldForm.type}]}}))
        this.hideFieldEditor()
    }
    async postForm(){
        this.setState({serverError: undefined})
        if (this._validateForm()) {
            this.setState({loading: true})
            const result = await api.postType.create(this.state.form)
            if (result instanceof Error) {
                this.setState({serverError: result.message})
            }
            else this.close()

            this.setState({loading: false})
            //todo: post fields
            
        }
        this.setState({loading: false})
    }
    render(){
        const { loading, open, errors, serverError, form: {fields}, fieldEditorVisible } = this.state
        const formFields = [
            { type: "Input", label: "Post Type Name", name: "name", onChange: this._handleChange, disabled: loading, error: errors.name },
            // { type: "Image", label: "Tags", name: "image", onChange: this._handleImageChange, disabled: loading }
        ]
        const actions=[
            { content: "Cancel", icon:"remove", labelPosition: "right", disabled: loading, onClick: this.close },
            { content: "Create", primary: true, icon:"plus sign", labelPosition: "right", onClick: this.postForm, disabled: loading || !fields || fields.length ===  0, loading }
          ]
        const fieldList = fields && fields.length > 0 ?
          <React.Fragment>
              <Header>Fields</Header>
              <Item.Group divided>
                  {
                      fields.map(field => 
                          <Item key={`posttype-item-${field.id}`} style={{justifyContent: "space-between"}}>
  
                                  <Item.Header as='h4' style={{flex: 1}}>{field.name}</Item.Header>
                                  <div>
                                      <Button basic icon="edit"/>
                                      <Button basic icon="remove"/>
                                  </div>
                          </Item>)
                  }
                <Item style={{justifyContent: "space-between"}}>
                    <Input placeholder="Field Name" name="fieldName" onChange={this._handleFieldEditorChange}/>
                    <Dropdown selection options={[{text: "asd", value: "1"}, {text: "qwe", value: "2"}]} />
                    <Button basic icon="plus" text="Add" onClick={this._handleAddField} />
                </Item>)
              </Item.Group>
          </React.Fragment>
          :
          !fieldEditorVisible && <Message
            info
            icon='info'
            content='No fields for this post type'
        />
        const addFieldButton = <Segment basic textAlign="right">
                                    <Button icon="plus" labelPosition="left" primary label="Add Field" onClick={this.showFieldEditor}></Button>
                                </Segment>
                  
        return <Modal trigger={this.props.trigger} onOpen={this.open} onClose={this.close} open={open}><FormBuilder title="Create Post Type" {... {fields: formFields, actions }} error={serverError} additionalContent={[fieldList, addFieldButton]} /></Modal>
    }
}