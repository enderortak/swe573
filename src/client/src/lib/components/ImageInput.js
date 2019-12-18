import React from "react"
import { Image } from "semantic-ui-react";
import FileInput from "react-simple-file-input";
import { blobToBinaryString } from 'blob-util'
function readFileAsync(file) {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result);
    };

    reader.onerror = reject;

    reader.readAsArrayBuffer(file);
  })
}
function parse(file) {
    // Always return a Promise
    return new Promise((resolve, reject) => {
      let content = '';
      const reader = new FileReader();
      // Wait till complete
      reader.onloadend = function(e) {
        content = e.target.result;
        const result = content.split(/\r\n|\n/);
        resolve(result);
      };
      // Make sure to handle error states
      reader.onerror = function(e) {
        reject(e);
      };
      reader.readAsText(file);
    });
  }

export default class ImageInput extends React.Component{
    state = {
        src: ""
    }
    onChange = async (event, file) => {
        // const blob2 = await parse(e.target.files[0])
        // const blob = e.target.files[0]
        // const blob2 = await parse(blob)
        this.setState({src: window.URL.createObjectURL(event.target.files[0])})
        this.props.onChange(event.target.files[0])
        // console.log("hey", event.target.result);
    }
    render(){
      const {onChange, type, ...restProps} = this.props
        return (
            <React.Fragment>
            {/* <FileInput
                readAs='binary'
                
                onLoad={ this.onChange }
            /> */}
            
            <input name="image" type="file"  onChange={this.onChange}  />
                <Image size="medium" src={this.state.src} />
            
            </React.Fragment>
        )
    }
}