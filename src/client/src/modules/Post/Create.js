import React from "react"
import { Modal, List } from "semantic-ui-react"
import FormBuilder from "../../lib/components/FormBuilder"
import { api } from "../../lib/service/ApiService";





export default class CreatePost extends React.Component {
    state={
        loading: false,
        open: false,
        errors: {},
        form: {
            communityId: this.props.community.id,
            fieldValues:[]
        }
    }
    constructor(props){
        super(props);
        this.postForm = this.postForm.bind(this);
        this._handleChange = this._handleChange.bind(this);
        this._handleDynamicFieldChange = this._handleDynamicFieldChange.bind(this);        
        this._handleImageChange = this._handleImageChange.bind(this);
        this._handleKeyDown = this._handleKeyDown.bind(this);
        this._validateForm = this._validateForm.bind(this);
    }

    open = () => this.setState({ open: true })
    close = () => this.setState({ open: false })
    selectPostType = postType => this.setState(state=> ({...state, postType, form: {...state.form, postTypeId: postType.id}}))
    _handleChange(e, { name, value }) { 
        this.setState( state => ({ ...state, form: { ...state.form, [name]: value }, errors: {...state.errors, [name]: undefined } })); 
    }
    _handleDynamicFieldChange(e, { name, value }) { 
        this.setState( state => ({ ...state, form: { ...state.form, fieldValues: [...state.form.fieldValues.filter(i => i.fieldId!==name), {fieldId: name, value }]}, errors: {...state.errors, [name]: undefined } })); 
    }
    _handleKeyDown(e) {
        if (e.key === "Enter") this.postForm()
      }
    
    _validateForm() {
        const { title } = this.state.form;
        const titleError = 
            !title || title.length === 0 ? "Please enter a post title" :
            title.length < 4 ? "Title should be at least 4 characters length" :
            undefined;
        if(titleError){
            this.setState({errors: {name: titleError}})
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
            const { form } = this.state
            form.fieldValues = JSON.stringify(form.fieldValues)
            const result = await api.post.create(form)
            if (result instanceof Error) {
                this.setState({serverError: result.message})
            }
            else this.close()

            this.setState({loading: false})
            
        }
        this.setState({loading: false})
    }
    render(){
        const { loading, open, errors, serverError, postType, form } = this.state
        const { community }= this.props
        const postTypeSelection = (
            <React.Fragment>
                <Modal.Header>Select a post type</Modal.Header>
                <Modal.Content>
                    {
                            community.postTypes.map(availablePostType=>(
                                <List divided relaxed>
                                    <List.Item as="a" onClick={() => this.selectPostType(availablePostType)}>
                                        <List.Icon name='chevron right' size='large' verticalAlign='middle' />
                                        <List.Content>
                                            <List.Header>{availablePostType.name}</List.Header>
                                        </List.Content>
                                        
                                    </List.Item>
                                </List>
                        ))
                    }
                </Modal.Content>
            </React.Fragment>
        )
        const inputFields = postType ? [
            { type: "Input", label: "Title", name: "title", onChange: this._handleChange, disabled: loading, error: errors.title },
            

                ...postType.fields.map(f => ({
                    type: f.fieldType.name,
                    label: f.name,
                    name: f.id,
                    onChange: this._handleDynamicFieldChange,
                    disabled: loading,
                    error: errors[f.name]
                })),
            { type: "Tag", label: "Semantic Tags", name: "tags", onChange: this._handleChange, disabled: loading, title: form.title }

        ] : []
        const actions=[
            { content: "Cancel", icon:"remove", labelPosition: "right", disabled: loading, onClick: this.close },
            { content: "Create", primary: true, icon:"plus sign", labelPosition: "right", onClick: this.postForm, disabled: loading, loading }
          ]
        return <Modal trigger={this.props.trigger} onOpen={this.open} onClose={this.close} open={open}>
            {
                !postType ?
                postTypeSelection:
                <FormBuilder 
                    image={{name: "image", onChange: this._handleImageChange, disabled: loading}}
                    title={postType.name}
                    {... {fields: inputFields, actions }}
                    error={serverError}
                />
            }
            
        </Modal>
    }
}