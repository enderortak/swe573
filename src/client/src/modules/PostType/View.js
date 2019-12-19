import React from "react"
import { Modal, List, Button, Table, Icon } from "semantic-ui-react"
import { api } from "../../lib/service/ApiService";
import ImageDisplay from "../../lib/components/ImageDisplay"





export default class ViewPostType extends React.Component {
    state={
        loading: true,
        open: false,
        postType: {}
    }
    async componentDidMount(){
        this.setState(state=>({ ...state, loading: true }))
        const postType = await api.postType.get(this.props.id)
        this.setState(state=>({ ...state, postType, loading: false }))
    }
    open = () => this.setState({ open: true })
    close = () => this.setState({ open: false })


    render(){
        const { open, loading } = this.state
        const { name, image, fields } = this.state.postType
        // , createdBy, createdAt, updatedBy, updatedAt
        // console.log(createObjectURL(image))

        if (loading) return null;
        return (
        <Modal trigger={this.props.trigger} onOpen={this.open} onClose={this.close} open={open}>
            <Modal.Header>{name}</Modal.Header>
            <Modal.Content image>
                <ImageDisplay size="medium" wrapped src={image}/>
                <Modal.Description>
                    <Table definition>
                        <Table.Body>
                            <Table.Row cells={["Post Type Name", name]}></Table.Row>
                            <Table.Row cells={["Fields", <List style={{padding: "1em"}}>{fields.map(field =><List.Item><Icon name='right triangle' /><List.Content><List.Header>{field.name}</List.Header><List.Description>{field.fieldType}</List.Description></List.Content></List.Item>)}</List>]}></Table.Row>
                        </Table.Body>
                    </Table>
                </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
                <Button icon="remove" labelPosition="right" content="Close" onClick={this.close} />
            </Modal.Actions>
        </Modal>
        )
    }
}