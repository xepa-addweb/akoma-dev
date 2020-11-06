import React, { Component, Fragment } from 'react';
import { Link, BrowserRouter as Router, Route,Switch, Redirect } from "react-router-dom";
import { Container, Row, Col, Card, CardBody, CardTitle, Input, Form, FormGroup, Label, Button, Badge } from "reactstrap";

// Import Editor
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

//Import Date Picker
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

//Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';
import axios from 'axios'
import toastr from 'toastr'
import 'toastr/build/toastr.min.css'
import { AvForm, AvField } from "availity-reactstrap-validation";
import Select from 'react-select'


const instance = axios.create();


class MailSettings extends Component {
    constructor(props) {
        super(props);
        this.state = {  
            Settings : {}
        }
    }

    componentDidMount() {
        instance.get('http://localhost:4000/settings')
        .then(response => {
            console.log('Settings')
            console.log(response)
            var settingData = response.data        
            this.setState({ Settings: settingData });
        })
        .catch(function (error){
            console.log(error);
        })

        instance.get('http://localhost:4000/users/')
            .then(response => {
                console.log('USERS')
                console.log(response)
                var clientAdmins = response.data
                var client_adminData = []
                clientAdmins.forEach(function(cadmin) {
                    client_adminData.push({label :cadmin.first_name+' '+cadmin.last_name, value : cadmin._id})
                })
                this.setState({ client_admins: client_adminData });
            })
            .catch(function (error){
                console.log(error);
            })
    }
    

    onChangeInput(e, name) {
      console.log(e.target.value)
      this[name] = e.target.value
    }

    onFormSubmit(e) {
      e.preventDefault();
      
      console.log(`Form submitted:`);
    //   console.log(`Company Name : ${this.company_name}`);
    //   console.log(`Email : ${this.email}`);
    //   console.log(`Country : ${this.country_code}`);

      var payload = {
        server : this.server,
        auth_username : this.auth_username,
        auth_password : this.auth_password,
        port : this.port,
        from_address : this.from_address
      }
      console.log('payload')
      console.log(payload)
      instance.post('http://localhost:4000/settings/update/'+this.state.Settings._id, payload)
      .then(res => {
        console.log(res.data)
        var title = 'Success'
        var message = "Mail Settings updated successfully"
        toastr.success(message,title)
      })
      .catch(error => {
        console.log(error)
        // e.target.reset();
        // console.log(error.response.data.error)
      });
  }

  changeHandler = value => {
    this.setState({ value })
  }

//   onClickCancel = () => {
//         this.props.history.push('/clients');
//   }
  
    render() {
        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid>

                        {/* Render Breadcrumbs */}
                        <Breadcrumbs title="Clients" breadcrumbItem="Edit Client" />
                        
                        <Row>
                            <Col lg="12">
                                <Card>
                                    <CardBody>
                                        <CardTitle className="mb-4">Create Client</CardTitle>
                                        <AvForm className="needs-validation outer-repeater" onSubmit={e => this.onFormSubmit(e)}>
                                            <div data-repeater-list="outer-group" className="outer">
                                                <div data-repeater-item className="outer">
                                                    <FormGroup className="mb-4" row>
                                                        <Label htmlFor="server" className="col-form-label col-lg-2">Server</Label>
                                                        <Col lg="10">
                                                        <AvField
                                                          name="server"
                                                          placeholder="Server"
                                                          type="text"
                                                          errorMessage="Enter Server"
                                                          className="form-control"
                                                          validate={{ required: { value: true } }}
                                                          id="server"
                                                          value={this.state.Settings.server}
                                                          onChange={(e) => this.onChangeInput(e, 'server')}
                                                        />
                                                        </Col>
                                                    </FormGroup>
                                                    <FormGroup className="mb-4" row>
                                                        <Label htmlFor="port" className="col-form-label col-lg-2">Port</Label>
                                                        <Col lg="10">
                                                        <AvField
                                                          name="port"
                                                          placeholder="Port"
                                                          type="number"
                                                          errorMessage="Enter Port"
                                                          className="form-control"
                                                          validate={{ required: { value: true } }}
                                                          id="port"
                                                          value={this.state.Settings.port}
                                                          onChange={(e) => this.onChangeInput(e, 'port')}
                                                        />
                                                        </Col>
                                                    </FormGroup>
                                                    <FormGroup className="mb-4" row>
                                                        <Label htmlFor="auth_username" className="col-form-label col-lg-2">Auth Username</Label>
                                                        <Col lg="10">
                                                        <AvField
                                                          name="auth_username"
                                                          placeholder="Auth Username"
                                                          type="text"
                                                          errorMessage="Enter Auth Username"
                                                          className="form-control"
                                                          validate={{ required: { value: true } }}
                                                          id="auth_username"
                                                          value={this.state.Settings.auth_username}
                                                          onChange={(e) => this.onChangeInput(e, 'auth_username')}
                                                        />
                                                        </Col>
                                                    </FormGroup>
                                                    <FormGroup className="mb-4" row>
                                                        <Label htmlFor="auth_password" className="col-form-label col-lg-2">Auth Password</Label>
                                                        <Col lg="10">
                                                        <input
                                                          name="auth_password"
                                                          placeholder="Auth Password"
                                                          type="password"
                                                          errorMessage="Enter Auth Password"
                                                          className="form-control"
                                                          id="auth_password"
                                                        //   value={this.state.Settings.auth_password}
                                                          onChange={(e) => this.onChangeInput(e, 'auth_password')}
                                                        />
                                                        </Col>
                                                    </FormGroup>
                                                    <FormGroup className="mb-4" row>
                                                        <Label htmlFor="from_address" className="col-form-label col-lg-2">From Address</Label>
                                                        <Col lg="10">
                                                        <AvField
                                                          name="from_address"
                                                          placeholder="From Address"
                                                          type="text"
                                                          errorMessage="Enter Auth Username"
                                                          className="form-control"
                                                          validate={{ required: { value: true } }}
                                                          id="from_address"
                                                          value={this.state.Settings.from_address}
                                                          onChange={(e) => this.onChangeInput(e, 'from_address')}
                                                        />
                                                        </Col>
                                                    </FormGroup>
                                                    
                                                </div>
                                            </div>
                                        <Row className="justify-content-end">
                                          <Col lg="10">
                                              <Button type="submit" color="primary">Update Settings</Button>{" "}
                                              {/* <Button id="b1" onClick ={this.onClickCancel}>Cancel</Button>
                                                <Route path="/clients" component={ClientList}/> */}

                                          </Col>
                                        </Row>
                                        </AvForm>
                                        

                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                        

                    </Container>
                </div>
            </React.Fragment>
        );
    }
}

export default MailSettings;