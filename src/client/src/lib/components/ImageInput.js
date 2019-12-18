import React from "react"
import { Button, Dimmer } from "semantic-ui-react";
import ImageDisplay from "./ImageDisplay";

export default class ImageInput extends React.Component{
    state = {
        src: "",  active: false
    }
    handleShow = () => this.setState({ active: true })
    handleHide = () => this.setState({ active: false })
    onChange = (event, file) => {
        // const blob2 = await parse(e.target.files[0])
        // const blob = e.target.files[0]
        // const blob2 = await parse(blob)
        event.persist()
        this.setState(state => ({...state, src: window.URL.createObjectURL(event.target.files[0])}))
        this.props.onChange(event.target.files[0])
        // console.log("hey", event.target.result);
    }
    render(){
      const {onChange, type, ...restProps} = this.props
      const { active, src } = this.state;
      const content = <Button primary basic id="select-image" as="label"><input type="file" name="image" onChange={this.onChange} style={{display: "none"}} {...restProps}/>Select Image</Button>
        return (
            <Dimmer.Dimmable
              blurring
              as={ImageDisplay}
              dimmed={active}
              dimmer={{ active, content, style: {background: "none"} }}
              onMouseEnter={this.handleShow}
              onMouseLeave={this.handleHide}
              size='medium'
              src={src}
            />
        )
    }
}