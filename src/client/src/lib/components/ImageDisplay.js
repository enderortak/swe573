import React from "react"
import { Image } from "semantic-ui-react"
import Placeholder from "./../images/image-placeholder.png"


const ImageDisplay = ({src, ...rest}) => <Image src={src || Placeholder} {...rest} /> 

export default ImageDisplay;