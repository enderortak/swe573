import React from "react";
import { Form, Message, Label, Modal, Button } from "semantic-ui-react";
// import LocationInput from "./LocationInput";
import LocationSearchInput from "./LocationSearchInput"
import ImageInput from "./ImageInput";


Form.Location = LocationSearchInput
Form.Image = ImageInput


export default class FormBuilder extends React.Component {
  renderRadio(props) {
    const { options, label: lbl, error, ...radioRest } = props;
    const direction = props.direction || "horizontal";
    return (
      <Form.Field {...radioRest} error={!!error}>
        <label>{lbl}</label>
        {!!error && (
          <Label
            prompt
            pointing="below"
            basic
            content={error}
            style={{ marginBottom: "1em" }}
          />
        )}
        <div
          style={{
            display: "flex",
            flexDirection: direction === "vertical" ? "column" : "row"
          }}
        >
          {options.map(option => (
            <Form.Radio
              {...option}
              label={option.text}
              style={{ padding: "0 0.5em", margin: "0" }}
            />
          ))}
        </div>
      </Form.Field>
    );
  }
  render() {
    const { fields, actions, additionalContent,  title, error, ...formRest } = this.props;

    return (
      <React.Fragment>
        <Modal.Header dividing content={title} />
        <Modal.Content>
            <Form error={!!error} {...formRest}>
            {fields.map(field => {
                const { type, password, ...rest } = field;
                if (type === "Radio") return this.renderRadio(rest);
                const InputComponent = Form[type];
                return <InputComponent type={password?"password": undefined} {...rest} />;
            })}
            <Message
                error
                icon="warning"
                header="Error"
                content={error}
            />
            
            </Form>
        </Modal.Content>
        {
          additionalContent &&
          <Modal.Content>
            {additionalContent}
          </Modal.Content>
        }
        <Modal.Actions>
          {actions.map(action => (
            <Button {...action} style={{ marginLeft: "0.5em" }} />
          ))}
        </Modal.Actions>
      </React.Fragment>
    );
  }
}