import React from "react"
import { Modal, Table } from "semantic-ui-react"
import { api } from "../../lib/service/ApiService"
import ImageDisplay from "../../lib/components/ImageDisplay"


export default class CommunityView extends React.Component{
    state = {
        loading: true,
        community: {},
        open: false
    }
    open = () => this.setState({ open: true })
    close = () => this.setState({ open: false })
    async componentDidMount(){
        this.state.community = await api.community.get(this.props.id)
        this.setState({ loading: false })
    }
    render(){
        const { open, loading } = this.state
        const { name, description, tags, image, createdBy, createdAt, updatedBy, updatedAt } = this.state.community
        // debugger;
        console.log(image)
        if (image) window.k = image
        

        if (loading) return null;
        return (
        <Modal trigger={this.props.trigger} onOpen={this.open} onClose={this.close} open={open} image>

            <Modal.Header>{name}</Modal.Header>
            <Modal.Content image>
                <ImageDisplay size="medium" wrapped />
                <Modal.Description>
                    <Table definition>
                        <Table.Body>
                            {/* {
                                image && 
                                <Table.Row>
                                    <Table.Cell>Image</Table.Cell>
                                    { <Table.Cell><Image src={window.URL.createObjectURL(new Blob(image.data))} /></Table.Cell> }
                                    <Table.Cell><Image src={'data:image/png;base64,' + btoa(image.data)} /></Table.Cell>
                                </Table.Row>
                            } */}
                            <Table.Row cells={["Community Name", name]}></Table.Row>
                            <Table.Row cells={["Description", description]}></Table.Row>
                            <Table.Row cells={["Semantic Tags", tags]}></Table.Row>
                        </Table.Body>
                    </Table>
                </Modal.Description>
            </Modal.Content>
        </Modal>
        )
    }
}