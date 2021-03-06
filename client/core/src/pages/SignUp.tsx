import React, { RefObject, ChangeEvent } from "react";
import connectPropsAndActions from "../shared/connect";
import AppState from "../models/client/AppState";
import { Redirect } from "react-router-dom";
import UserActionCreator from "../models/client/UserActionCreator";
import Gender from "../models/Gender";
import { Container, Form, Button, Icon, Radio, Header } from "semantic-ui-react";
import { CONTAINER_STYLE } from "../shared/styles";
import ResponsiveFormField from "../components/shared/ResponsiveFormField";
import { FormattedMessage, injectIntl, WrappedComponentProps as IntlProps, MessageDescriptor } from "react-intl";
import { PrimitiveType } from "intl-messageformat";

interface Props extends IntlProps {
    state: AppState;
    actions: UserActionCreator;
}

interface States {
    selectedGender: Gender;
}

const DEFAULT_SELECTED_GENDER: Gender = Gender.MALE;

class SignUp extends React.Component<Props, States> {
    private getString: (descriptor: MessageDescriptor, values?: Record<string, PrimitiveType>) => string;
    private emailRef: RefObject<HTMLInputElement>;
    private passwordRef: RefObject<HTMLInputElement>;
    private confirmPasswordRef: RefObject<HTMLInputElement>;
    private nameRef: RefObject<HTMLInputElement>;
    constructor(props: Props) {
        super(props);
        this.getString = this.props.intl.formatMessage;
        this.emailRef = React.createRef();
        this.passwordRef = React.createRef();
        this.confirmPasswordRef = React.createRef();
        this.nameRef = React.createRef();
        this.state = {
            selectedGender: DEFAULT_SELECTED_GENDER
        };
    }
    render(): React.ReactElement<any> {
        if (!this.props.state.redirectTask.redirected) {
            return <Redirect to={this.props.state.redirectTask.to} />;
        } else if (!this.props.state.userState.currentUser) {
            const loading: boolean = this.props.state.userState.loading;
            return (<Container text style={CONTAINER_STYLE}>
                <Header size={"medium"}>
                    <FormattedMessage id="page.me.sign_up"/>
                </Header>
                <Form>
                    <ResponsiveFormField>
                        <label>
                            <FormattedMessage id="user.email"/>
                        </label>
                        <input placeholder={this.getString({ id: "user.email"})} ref={this.emailRef} />
                    </ResponsiveFormField>
                    <ResponsiveFormField>
                        <label>
                            <FormattedMessage id="user.password"/>
                        </label>
                        <input type="password" placeholder={this.getString({ id: "user.password"})} ref={this.passwordRef} />
                    </ResponsiveFormField>
                    <ResponsiveFormField>
                        <label>
                            <FormattedMessage id="user.confirm_password"/>
                        </label>
                        <input type="password" placeholder={this.getString({ id: "user.confirm_password"})} ref={this.confirmPasswordRef} />
                    </ResponsiveFormField>
                    <ResponsiveFormField>
                        <label>
                            <FormattedMessage id="user.name"/>
                        </label>
                        <input placeholder={this.getString({ id: "user.name"})} ref={this.nameRef} />
                    </ResponsiveFormField>
                    <Form.Group inline>
                        <label>
                            <FormattedMessage id="user.gender"/>
                        </label>
                            {
                                Object.values(Gender).map(this.renderGenderRadio)
                            }
                    </Form.Group>
                    <Button primary type="submit" onClick={ this.signUp } loading={loading} disabled={loading}>
                        <Icon name="check circle outline" />
                        <FormattedMessage id="component.button.submit"/>
                    </Button>
                </Form>
            </Container>);
        } else {
            return <Redirect to="/" />;
        }
    }
    private renderGenderRadio = (gender: string): React.ReactElement<any> | undefined => {
        return <Form.Field
            key={gender}
            control={Radio}
            label={this.getString({ id: `user.gender.${gender}`})}
            value={gender}
            checked={this.state.selectedGender === gender}
            onChange={this.onSelectedGenderChange} />;
    };
    private onSelectedGenderChange = (event: ChangeEvent, data: any): void => {
        this.setState({
            selectedGender: data.value as Gender
        });
    }
    private signUp = (): void => {
        const email: any = this.emailRef.current && this.emailRef.current.value;
        const password: any = this.passwordRef.current && this.passwordRef.current.value;
        const confirmPassword: any = this.confirmPasswordRef.current && this.confirmPasswordRef.current.value;
        const name: any = this.nameRef.current && this.nameRef.current.value;
        const gender: Gender = this.state.selectedGender;
        this.props.actions.signUp(email, password, confirmPassword, name, gender);
    }
}

export default injectIntl(connectPropsAndActions(SignUp));