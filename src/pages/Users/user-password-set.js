import React, { Component } from 'react';

import { Row, Col, CardBody, Card, Alert,Container, Button } from "reactstrap";

// Redux
import { connect } from 'react-redux';
import { withRouter, Link, Route } from 'react-router-dom';

// availity-reactstrap-validation
import { AvForm, AvField } from 'availity-reactstrap-validation';

// actions
import { loginUser,apiError } from '../../store/actions';

// import images
import profile from "../../assets/images/profile-img.png";
// import logo from "../../assets/images/logo.svg";
import logo from "../../assets/images/akoma_logo.png";
import toastr from 'toastr'
import 'toastr/build/toastr.min.css'
import LoginPage from "../Authentication/Login";


import base64 from 'base-64'
import axios from 'axios'
const instance = axios.create();


class UserPasswordSet extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userData : {},
            showForm : true
        }

        // handleValidSubmit
        this.handleValidSubmit = this.handleValidSubmit.bind(this);
    }

    // handleValidSubmit
    handleValidSubmit(event) {
        // this.props.loginUser(values, this.props.history);
        event.preventDefault();      
        console.log(`Form submitted:`);
        var payload = {
            password : this.password
        }
        console.log('payload')
        console.log(payload)
        instance.put('http://localhost:4000/users/update-password/'+this.state.userData._id, payload)
        .then(res => {
            console.log(res.data)
            // var title = 'Success'
            // var message = "Password set successfully. Please login."
            // toastr.success(message,title)
            // event.target.reset();
            this.setState({showForm : false})
            
        })
        .catch(error => {
            console.log(error)
            // e.target.reset();
            // console.log(error.response.data.error)
        });
    }

    componentDidMount() {
        this.props.apiError("");
        // alert(this.props.match.params.id)
        var userID = this.props.match.params.id
        var emailDecoded = base64.decode(userID)
        console.log('userDECODED'+emailDecoded)
        instance.get('http://localhost:4000/users/getByEmail/'+emailDecoded)
        .then(response => {
            console.log('CLIENT EDIT')
            console.log(response)
            var userDetails = response.data    
            console.log('EMAIL')
            console.log(userDetails)      
            this.setState({ userData: userDetails });
        })
        .catch(function (error){
            console.log(error);
        })
    }

    onChangeInput(e, name) {
    console.log(e.target.value)
    this[name] = e.target.value
    }

    onClickLogin = () => {
            this.props.history.push('/login');
    }

    render() {

        return (
            <React.Fragment>
                <div className="home-btn d-none d-sm-block">
                    <Link to="/" className="text-dark"><i className="bx bx-home h2"></i></Link>
                </div>
                <div className="account-pages my-5 pt-sm-5">
                    <Container>
                        <Row className="justify-content-center">
                            <Col md={8} lg={6} xl={5}>
                                {this.state.userData.is_password_set &&
                                <Card className="overflow-hidden">
                                    <div className="bg-soft-primary">
                                        <Row>
                                            <Col className="col-7">
                                                <div className="text-primary p-4">
                                                    <h5 className="text-primary">Welcome Back!</h5>
                                                    <p>Sorry! Link is expired to set password</p>
                                                </div>
                                            </Col>                                           
                                        </Row>
                                    </div>
                                </Card>
                                }
                                {!this.state.userData.is_password_set &&
                                <Card className="overflow-hidden">
                                    <div className="bg-soft-primary">
                                        <Row>
                                            <Col className="col-7">
                                                <div className="text-primary p-4">
                                                    <h5 className="text-primary">Welcome !</h5>
                                                    <p>Set up your Password.</p>
                                                </div>
                                            </Col>
                                            <Col className="col-5 align-self-end">
                                                <img src={profile} alt="" className="img-fluid" />
                                            </Col>
                                        </Row>
                                    </div>
                                    <CardBody className="pt-0">
                                        <div>
                                            <Link to="/">
                                                <div className="avatar-md profile-user-wid mb-4">
                                                    <span className="avatar-title rounded-circle bg-light">
                                                        <img src={logo} alt="" className="rounded-circle" height="34" />
                                                    </span>
                                                </div>
                                            </Link>
                                        </div>
                                        {this.state.showForm == true &&
                                        <div className="p-2">

                                            <AvForm className="form-horizontal" onValidSubmit={e => this.handleValidSubmit(e)}>

                                                {this.props.error && this.props.error ? <Alert color="danger">{this.props.error}</Alert> : null}

                                                <div className="form-group">
                                                    <AvField name="email" label="Email" value={this.state.userData.email} className="form-control" placeholder="Enter email" type="email" required style={{color : 'grey'}} disabled />
                                                </div>

                                                <div className="form-group">
                                                    <AvField name="password" label="Password" value="" type="password" required placeholder="Enter Password" onChange={(e) => this.onChangeInput(e, 'password')} />
                                                </div>
                                                <div className="form-group">
                                                    <AvField name="password" label="Confirm Password" value="" type="password" required placeholder="Confirm Password" validate={{match:{value:'password'}}} onChange={(e) => this.onChangeInput(e, 'confirm_password')} />
                                                </div>
                                                <div className="mt-3">
                                                    <button className="btn btn-primary btn-block waves-effect waves-light" type="submit">Set Up</button>
                                                </div>

                                            </AvForm>
                                        </div>
                                        }
                                        {this.state.showForm == false &&
                                        <div className="p-2">

                                           <p>Thank you! Your password has been set now.</p>
                                           <h2>Please Login</h2>
                                           <Button id="b1" onClick ={this.onClickLogin}>Login</Button>
                                                <Route path="/login" component={LoginPage}/>
                                        </div>
                                        }
                                    </CardBody>
                                </Card>
                                }
                            </Col>
                        </Row>
                    </Container>
                </div>
            </React.Fragment>
        );
    }
}

const mapStatetoProps = state => {
    const { error } = state.Login;
    return { error };
}

export default withRouter(connect(mapStatetoProps, { loginUser,apiError })(UserPasswordSet));

