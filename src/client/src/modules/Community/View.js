import React from "react"
import { Modal, Table, Button } from "semantic-ui-react"
import { api } from "../../lib/service/ApiService"
import ImageDisplay from "../../lib/components/ImageDisplay"
import ModalWrapper from "../../lib/components/Modal"
import { arrayBufferToBinaryString,
    arrayBufferToBlob,
    base64StringToBlob,
    binaryStringToArrayBuffer,
    binaryStringToBlob,
    blobToArrayBuffer,
    blobToBase64String,
    blobToBinaryString,
    blobToDataURL,
    canvasToBlob,
    createBlob,
    createObjectURL,
    dataURLToBlob,
    imgSrcToBlob,
    imgSrcToDataURL,
    revokeObjectURL } from 'blob-util'
import AuthService from "../../lib/service/AuthService"
import CommunitySettings from "./Settings"
    window.arrayBufferToBinaryString = arrayBufferToBinaryString
    window.arrayBufferToBlob = arrayBufferToBlob
    window.base64StringToBlob = base64StringToBlob
    window.binaryStringToArrayBuffer = binaryStringToArrayBuffer
    window.binaryStringToBlob = binaryStringToBlob
    window.blobToArrayBuffer = blobToArrayBuffer
    window.blobToBase64String = blobToBase64String
    window.blobToBinaryString = blobToBinaryString
    window.blobToDataURL = blobToDataURL
    window.canvasToBlob = canvasToBlob
    window.createBlob = createBlob
    window.createObjectURL = createObjectURL
    window.dataURLToBlob = dataURLToBlob
    window.imgSrcToBlob = imgSrcToBlob
    window.imgSrcToDataURL = imgSrcToDataURL
    window.revokeObjectURL = revokeObjectURL
    function encode (input) {
        var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;
    
        while (i < input.length) {
            chr1 = input[i++];
            chr2 = i < input.length ? input[i++] : Number.NaN; // Not sure if the index 
            chr3 = i < input.length ? input[i++] : Number.NaN; // checks are needed here
    
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
    
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }
            output += keyStr.charAt(enc1) + keyStr.charAt(enc2) +
                      keyStr.charAt(enc3) + keyStr.charAt(enc4);
        }
        return output;
    }
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
    image(image){
        // return createObjectURL(arrayBufferToBlob(image.data))
        return "asd"
    }
    render(){
        const { open, loading } = this.state
        const { name, description, tags, image, isMember, isOwner } = this.state.community
        // , createdBy, createdAt, updatedBy, updatedAt
        console.log(image)
        // console.log(createObjectURL(image))
        if (image && !this.state.image) {
            window.k = image
            this.setState({image :this.image(image)})
        }

        if (loading) return null;
        return (
        <Modal trigger={this.props.trigger} onOpen={this.open} onClose={this.close} open={open} image>

            <Modal.Header>{name}</Modal.Header>
            <Modal.Content image>
                <ImageDisplay size="medium" wrapped />
                <Modal.Description>
                    <Table definition>
                        <Table.Body>
                            {
                                image && 
                                <Table.Row>
                                    <Table.Cell>Image</Table.Cell>
                                    {/* <Table.Cell><ImageDisplay src={'data:image/png;base64,'+encode(new Uint8Array(image.data))} /></Table.Cell> */}
                                    {/* <Table.Cell><Image src={'data:image/png;base64,' + btoa(image.data)} /></Table.Cell> */}
                                </Table.Row>
                            }
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
                            <Button icon="settings" labelPosition="left" primary label="Edit Community Settings"></Button>
                        }
                        community={this.state.community}
                    />
                }
                {!isOwner &&
                    (isMember ? 
                        <Button icon="remove user" labelPosition="left" primary onClick={this.unsubscribe} label="Leave Community"></Button> :
                        <Button icon="add user" labelPosition="left" primary onClick={this.subscribe} label="Join Community">Join</Button>
                    )
                }
                <Button icon="remove" labelPosition="right" content="Close" onClick={this.close} />
            </Modal.Actions>
        </Modal>
        )
    }
}