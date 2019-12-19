import React from "react"
import { Modal, Table, Button, Header } from "semantic-ui-react"
import { api } from "../../lib/service/ApiService"
import ImageDisplay from "../../lib/components/ImageDisplay"
import ModalWrapper from "../../lib/components/Modal"
import CommunitySettings from "./Settings"

export default class CommunityView extends React.Component{
    state = {
        loading: true,
        community: {},
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
    async componentDidMount(){
        const community = await api.community.get(this.props.id)
        this.setState(state=>({...state, community, loading: false }))
    }
    async subscribe(){
        this.setState(state => ({...state, loading: true}))
        await api.community.join(this.state.community.id)
        this.setState(state => ({...state, community:{...state.community, isMember: true}, loading: false}))
    }
    async unsubscribe(){
        this.setState(state => ({...state, loading: true}))
        await api.community.leave(this.state.community.id)
        this.setState(state => ({...state, community:{...state.community, isMember: false}, loading: false}))
    }
    render(){
        const { open, loading } = this.state
        const { name, description, tags, image, isMember, isOwner } = this.state.community
        // , createdBy, createdAt, updatedBy, updatedAt
        // console.log(createObjectURL(image))

        if (loading) return null;
        return (
        <Modal trigger={this.props.trigger} onOpen={this.open} onClose={this.close} open={open}>

            <Modal.Content>
            <Header as='h2' style={{display: "flex"}}>
                <ImageDisplay bordered src={image} style={{width: "10em"}}/>
                <Header.Content style={{padding: "1em"}}>
                    {name}
                    <Header.Subheader>{description}</Header.Subheader>
                    <Header.Subheader>{tags}</Header.Subheader>
                    
                </Header.Content>
            </Header>
                
                <Modal.Description>
                    <Table definition>
                        <Table.Body>
                            <Table.Row cells={["Community Name", name]}></Table.Row>
                            <Table.Row cells={["Description", description]}></Table.Row>
                            <Table.Row cells={["Semantic Tags", tags]}></Table.Row>
                        </Table.Body>
                    </Table>
                </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
                {
                    isOwner && 
                    <ModalWrapper
                        target={CommunitySettings}
                        trigger={
                            <Button icon="settings" labelPosition="left" primary label="Edit Community Settings" />
                        }
                        community={this.state.community}
                    />
                }
                {!isOwner &&
                    (isMember ? 
                        <Button icon="remove user" labelPosition="left" primary onClick={this.unsubscribe} label="Leave Community" /> :
                        <Button icon="add user" labelPosition="left" primary onClick={this.subscribe} label="Join Community" />
                    )
                }
                <Button icon="remove" labelPosition="right" content="Close" onClick={this.close} />
            </Modal.Actions>
        </Modal>
        )
    }
}