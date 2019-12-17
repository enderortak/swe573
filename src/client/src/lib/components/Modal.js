import React from "react"

export default class ModalWrapper extends React.Component{
    render(){
        const { trigger, target: Target, ...rest} = this.props
        return(
            <Target trigger={trigger} {...rest}/>
        )
    }
}