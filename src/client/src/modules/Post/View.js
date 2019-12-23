import React from "react"
import { Modal, Table, Button, Header, Icon, Label } from "semantic-ui-react"
import { api } from "../../lib/service/ApiService"
import ImageDisplay from "../../lib/components/ImageDisplay"
import ModalWrapper from "../../lib/components/Modal"
import AuthService from "../../lib/service/AuthService"
import { formatDate } from "../../lib/utility"
import { DateTimeDisplay, DateDisplay, LocationDisplay } from "../../lib/components/EntityDisplay"

export default class PostView extends React.Component{
    state = {
        loading: true,
        post: {},
        open: false,
        image: null,
        likeLoading: false
    }
    constructor(props){
        super(props)
        this.like = this.like.bind(this)
        this.dislike = this.dislike.bind(this)
    }
    open = () => this.setState({ open: true })
    close = () => this.setState({ open: false })
    async componentDidMount(){
        this.setState(state=>({...state, post: this.props.post, loading: false }))
    }
    async like(){
        this.setState(state => ({...state, likeLoading: true}))
        await api.post.like(this.state.post.id)
        this.setState(state => ({...state, post:{...state.post, hasLiked: true, likes: [...state.post.likes, { tempLike: true }]}, likeLoading: false}))
    }
    async dislike(){
        this.setState(state => ({...state, likeLoading: true}))
        await api.post.dislike(this.state.post.id)
        const user = AuthService.user;
        this.setState(state => ({...state, post:{...state.post, hasLiked: false, likes: state.post.likes.filter(i => !(i.tempLike || i.createdById !== user.id) )}, likeLoading: false}))
    }
    render(){
        const { open, loading, likeLoading } = this.state
        const { title, community, tags, hasLiked, likes, fieldValues, owner, isOwner, createdAt, image } = this.state.post
        // , createdBy, , updatedBy, updatedAt
        // console.log(createObjectURL(image))

        if (loading) return null;
        return (
        <Modal trigger={this.props.trigger} onOpen={this.open} onClose={this.close} open={open}>

            <Modal.Content>
            <Header as='h2' style={{display: "flex"}}>
                <ImageDisplay bordered src={image} rounded style={{width: "15em"}}/>
                <Header.Content style={{padding: "1em"}}>
                    {title}
                    <Header.Subheader><b>Communty: </b>{community.name}</Header.Subheader>

                    <Header.Subheader><b>Author: </b>{owner.fullName}</Header.Subheader>
                    <Header.Subheader><b>Created At: </b>{formatDate(createdAt)}</Header.Subheader>
                    <Header.Subheader><b>Tags: </b><br />{tags}</Header.Subheader>

                </Header.Content>

            </Header>

                
                <Modal.Description>
                    <Table definition>
                        <Table.Body>
                            {
                                fieldValues && fieldValues.map(fieldValue => {
                                    const fieldComponendDictionary = {
                                        "Date and Time": DateTimeDisplay,
                                        "Date": DateDisplay,
                                        "Geolocation": LocationDisplay
                                    }
                                    const DisplayComponent = fieldComponendDictionary[fieldValue.field.fieldType.name]
                                    return(
                                    <Table.Row cells={[fieldValue.field.name, DisplayComponent ? <Table.Cell><DisplayComponent value={fieldValue.value} /></Table.Cell> : fieldValue.value]} />
                                    )
                                })
                            }

                        </Table.Body>
                    </Table>
                </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
                {
                    AuthService.user &&
                    <Button loading={likeLoading} size="mini" as='div' labelPosition='right' onClick={hasLiked ? this.dislike : this.like}>
                        <Button color='red' active={hasLiked}>
                            <Icon name={hasLiked ? "heart" : "heart outline"} />
                            Like
                        </Button>
                        <Label as='a' basic color='red' pointing='left'>
                            {likes.length}
                        </Label>
                    </Button>
                }
                {
                    isOwner &&
                    <Button primary icon="edit" labelPosition="right" content="Edit" />
                }
                <Button icon="remove" labelPosition="right" content="Close" onClick={this.close} />
            </Modal.Actions>
        </Modal>
        )
    }
}