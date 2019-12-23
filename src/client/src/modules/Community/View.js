import React from "react"
import { Modal, Table, Button, Header } from "semantic-ui-react"
import { api } from "../../lib/service/ApiService"
import ImageDisplay from "../../lib/components/ImageDisplay"
import ModalWrapper from "../../lib/components/Modal"
import CommunitySettings from "./Settings"
import CreatePost from "../Post/Create"
import CommunityPostList from "../Post/ListCommunity"

export default class CommunityView extends React.Component{
    state = {
        subLoading: false,
        community: this.props.community,
        open: false,
        image: null
    }
    constructor(props){
        super(props)
        this.subscribe = this.subscribe.bind(this)
        this.unsubscribe = this.unsubscribe.bind(this)
    }
    open = () => this.setState({ open: true })
    close = () => this.setState({ open: false })
    async subscribe(){
        this.setState(state => ({...state, subLoading: true}))
        await api.community.join(this.state.community.id)
        this.setState(state => ({...state, community:{...state.community, isMember: true}, subLoading: false}))
    }
    async unsubscribe(){
        this.setState(state => ({...state, subLoading: true}))
        await api.community.leave(this.state.community.id)
        this.setState(state => ({...state, community:{...state.community, isMember: false}, subLoading: false}))
    }
    render(){
        const { open, subLoading } = this.state
        const { name, description, tags, image, isMember, isOwner } = this.state.community
        // , createdBy, createdAt, updatedBy, updatedAt
        // console.log(createObjectURL(image))
        return (
        <Modal trigger={this.props.trigger} onOpen={this.open} onClose={this.close} open={open}>

            <Modal.Content>
            <Header as='h2' style={{display: "flex"}}>
                <ImageDisplay bordered src={image} style={{width: "10em"}}/>
                <Header.Content style={{padding: "1em"}}>
                    {name}
                    <Header.Subheader>{description.split("\\n").map(p => <p>{p}</p>)}</Header.Subheader>
                    <Header.Subheader>{tags}</Header.Subheader>
                    
                </Header.Content>
            </Header>
                
                <Modal.Description>
                    <CommunityPostList community={this.state.community}/>
                </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
                {
                    isOwner && 
                    <ModalWrapper
                        updateHelper={this.props.updateHelper}
                        target={CommunitySettings}
                        trigger={
                            <Button icon="settings" labelPosition="left" primary label="Edit Community Settings"  loading={subLoading} disabled={subLoading} />
                        }
                        community={this.state.community}
                    />
                }
                {!isOwner &&
                    (isMember ? 
                        <Button icon="remove user" loading={subLoading} disabled={subLoading} labelPosition="left" primary onClick={this.unsubscribe} label="Leave Community" /> :
                        <Button icon="add user"  loading={subLoading} disabled={subLoading} labelPosition="left" primary onClick={this.subscribe} label="Join Community" />
                    )
                }
                {(isOwner || isMember) &&
                    (
                    <ModalWrapper
                        updateHelper={this.props.updateHelper}
                        target={CreatePost}
                        trigger={
                            <Button icon="plus" labelPosition="left" primary label="Create Post" loading={subLoading} disabled={subLoading} />
                        }
                        community={this.props.community}
                    />
                    )
                }
                <Button icon="remove" labelPosition="right" content="Close" onClick={this.close} />
            </Modal.Actions>
        </Modal>
        )
    }
}