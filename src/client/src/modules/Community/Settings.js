import React from "react"
import { Modal, Item, Header, Button, Segment } from "semantic-ui-react"
import FormBuilder from "../../lib/components/FormBuilder"
import { api } from "../../lib/service/ApiService";
import ModalWrapper from "../../lib/components/Modal";
import CreatePostType from "../PostType/Create";
import ViewPostType from "../PostType/View";





export default class CommunitySettings extends React.Component {
    state={
        loading: false,
        open: false,
        errors: {},
        form: {},
        postTypes: []
    }
    constructor(props){
        super(props);
        this.postForm = this.postForm.bind(this);
        this._handleChange = this._handleChange.bind(this);
        this._handleImageChange = this._handleImageChange.bind(this);
        this._handleKeyDown = this._handleKeyDown.bind(this);
        this._validateForm = this._validateForm.bind(this);
    }
    async componentDidMount(){
        const postTypes = await api.postType.getCommunityPostTypes(this.props.community.id)
        this.setState(state=>({...state, postTypes, loading: false}))
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
            const result = await api.community.create(this.state.form)
            if (result instanceof Error) {
                this.setState({serverError: result.message})
            }
            else this.close()

            this.setState({loading: false})
            
        }
        this.setState({loading: false})
    }
    render(){
        const { loading, open, errors, serverError, postTypes } = this.state
        const {community} = this.props
        const fields = [
            { type: "Input", value: community.name,  label: "Community", name: "name", onChange: this._handleChange, disabled: loading, error: errors.name },
            { type: "TextArea", value: community.description, label: "Description", name: "description", onChange: this._handleChange, disabled: loading, error: errors.description },
            { type: "Input", value: community.tags, label: "Semantic Tags", name: "tags", onChange: this._handleChange, disabled: loading }
        ]
        const actions=[
            { content: "Cancel", icon:"remove", labelPosition: "right", disabled: loading, onClick: this.close },
            { content: "Save Settings", primary: true, icon:"save", labelPosition: "right", onClick: this.postForm, disabled: loading, loading }
          ]
        const postTypeList = postTypes && postTypes.length > 0 &&
        <React.Fragment>
            <Header>Post Types</Header>
            <Item.Group divided>
                {
                    postTypes.map(postType => 
                        <ModalWrapper
                            updateHelper={this.props.updateHelper}
                            target={ViewPostType}
                            id={postType.id}
                            trigger={
                                    <Item key={`posttype-item-${postType.id}`} as="a" style={{justifyContent: "space-between", alignItems: "center"}}>

                                            <Item.Header as='h4' style={{flex: 1, margin: 0}}>{postType.name}</Item.Header>
                                            <div>
                                                <Button basic icon="edit" disabled={postType.name === "Basic"}/>
                                                <Button basic icon="remove" disabled={postType.name === "Basic"}/>
                                            </div>
                                    </Item>
                                }
                        />
                        )
                }
                
            </Item.Group>
            <Segment basic textAlign="right">

                <ModalWrapper
                    updateHelper={this.props.updateHelper}
                    target={CreatePostType}
                    trigger={<Button icon="plus" labelPosition="left" primary label="Add Post Type"></Button>}
                    communityId={community.id}
                />
                
            </Segment>

        </React.Fragment>
        return <Modal trigger={this.props.trigger} onOpen={this.open} onClose={this.close} open={open}>
            <FormBuilder title="Create Community" {... {fields, actions }} error={serverError} additionalContent={postTypeList} />
        </Modal>
    }
}