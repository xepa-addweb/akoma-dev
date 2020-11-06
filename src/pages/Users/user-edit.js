import React, { Component, Fragment } from 'react';
import { Link } from "react-router-dom";
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
import { AvForm, AvField, AvRadioGroup, AvRadio, } from "availity-reactstrap-validation";
import Select from 'react-select'
import countryList from 'react-select-country-list'


const instance = axios.create();


class UserEdit extends Component {
    constructor(props) {
        super(props);
        this.options = [
            {label: 'System Admin', value: 1},
            {label: 'Client Admin', value: 2},
            {label: 'Agent', value: 3}
        ]
        this.state = {
            userId: this.props.match.params.id,
            user: {},
            options: this.options,
            value: null,
            showClients: false,
            roleValue: false,
            clientsData: []
        }
        
    }    

    onChangeInput(e, name) {
      console.log(e.target.value)

      let newState = this.state.user;
      newState[name] = e.target.value;
      this.setState({newState: newState});
    }

    componentDidMount() {
        instance.get('http://localhost:4000/users/user/'+this.state.userId)
            .then(response => {
                console.log('USER')
                console.log(response)
                this.setState({ user: response.data, roleValue: response.data.role._id });
                var userData = response.data
                console.log('ROLE'+response.data.role._id)
                if(userData.role.name  == 'Agent' || userData.role.name == 'Client Admin') {
                    this.setState({
                        showClients : true
                    })
                } else { 
                    this.setState({
                        showClients : false
                    })
                }
            })
            .catch(function (error){
                console.log(error);
            })
        
            instance.get('http://localhost:4000/clients/')
            .then(response => {
                console.log('CLIENTS')
                console.log(response)
                var clientData = response.data
                var client_users = []
                clientData.forEach(function(client) {
                    client_users.push({label :client.client_name, value : client._id})
                })
                this.setState({ clientsData: client_users });
            })
            .catch(function (error){
                console.log(error);
            })    
    }    

    onFormSubmit(e) {
      e.preventDefault();
      
      console.log(`Form submitted:`);
      console.log(`Username : ${this.state.user.username}`);
      console.log(`Email : ${this.state.user.email}`);

      var payload = {
        first_name : this.state.user.first_name,
        last_name : this.state.user.last_name,
        email : this.state.user.email,
        status : this.state.user.status,
        username : this.state.user.username,
        role: this.state.user.role
      }
      console.log('payload')
      console.log('user_id : ', this.state.userId );
      console.log(payload)
      instance.put('http://localhost:4000/users/edit/'+this.state.userId, payload)
      .then(res => {
        console.log(res.data)
        var title = 'Success'
        var message = "User edited successfully"
        toastr.success(message,title)
      e.target.reset();
        
      })
      .catch(error => {
        console.log(error)
        // e.target.reset();
        // console.log(error.response.data.error)
      });
  }

  changeHandler = value => {
    this.state.user.role = value.value;
  }  
  
    render() {
        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid>

                        {/* Render Breadcrumbs */}
                        <Breadcrumbs title="User" breadcrumbItem="Edit User" />
                        
                        <Row>
                            <Col lg="12">
                                <Card>
                                    <CardBody>
                                        <CardTitle className="mb-4">Edit User</CardTitle>
                                        <form className="needs-validation outer-repeater" onSubmit={e => this.onFormSubmit(e)}>
                                            <div data-repeater-list="outer-group" className="outer">
                                                <div data-repeater-item className="outer">
                                                    <FormGroup className="mb-4" row>
                                                        <Label htmlFor="first_name" className="col-form-label col-lg-2">First Name</Label>
                                                        <Col lg="10">
                                                        <input
                                                          name="first_name"
                                                          placeholder='First Name'
                                                          type="text"
                                                          value={this.state.user.first_name}
                                                          className="form-control"
                                                          id="first_name"
                                                          onChange={(e) => this.onChangeInput(e, 'first_name')}
                                                        />
                                                        </Col>
                                                    </FormGroup>
                                                    <FormGroup className="mb-4" row>
                                                        <Label htmlFor="last_name" className="col-form-label col-lg-2">Last Name</Label>
                                                        <Col lg="10">
                                                        <input
                                                          name="last_name"
                                                          placeholder='Last Name'
                                                          type="text"
                                                          value={this.state.user.last_name}
                                                          className="form-control"
                                                          id="last_name"
                                                          onChange={(e) => this.onChangeInput(e, 'last_name')}
                                                        />
                                                        </Col>
                                                    </FormGroup>
                                                    <FormGroup className="mb-4" row>
                                                        <Label htmlFor="email" className="col-form-label col-lg-2">Email</Label>
                                                        <Col lg="10">
                                                        <input
                                                          name="email"
                                                          placeholder='Email'
                                                          type="email"
                                                          value={this.state.user.email}
                                                          className="form-control"
                                                          id="email"
                                                          onChange={(e) => this.onChangeInput(e, 'email')} disabled style={{color : 'grey'}}
                                                        />
                                                        </Col>
                                                    </FormGroup>
                                                    <FormGroup className="mb-4" row>
                                                        <Label htmlFor="status" className="col-form-label col-lg-2">Status</Label>
                                                        <Col md="5">                                            
                                                        <div>
                                                        <div className="form-check mb-3">
                                                            <input 
                                                                className="form-check-input" 
                                                                type="radio" 
                                                                name="status" 
                                                                id="status1" 
                                                                value="active"
                                                                checked={this.state.user.status == 'active'? true: false}
                                                                onClick={(e) => this.onChangeInput(e, 'status')}  
                                                            />
                                                            <label className="form-check-label" htmlFor="status1">
                                                                active
                                                            </label>
                                                        </div>
                                                        <div className="form-check mb-3">
                                                            <input 
                                                                className="form-check-input" 
                                                                type="radio" 
                                                                name="status" 
                                                                id="status2" 
                                                                value="inactive"
                                                                checked={this.state.user.status == 'inactive'? true: false}
                                                                onClick={(e) => this.onChangeInput(e, 'status')}  
                                                            />
                                                            <label className="form-check-label" htmlFor="status2">
                                                                inactive
                                                            </label>
                                                        </div>
                                                        </div> 
                                                        </Col>
                                                    </FormGroup>
                                                    <FormGroup className="mb-4" row>
                                                        <Label htmlFor="username" className="col-form-label col-lg-2">Username</Label>
                                                        <Col lg="10">
                                                        <input
                                                          name="username"
                                                          placeholder='Username'
                                                          value={this.state.user.username}
                                                          type="text"
                                                          className="form-control"
                                                          id="username"
                                                          onChange={(e) => this.onChangeInput(e, 'username')} disabled style={{color : 'grey'}}
                                                        />
                                                        </Col>
                                                    </FormGroup>
                                                    <FormGroup className="mb-4 select2-container" row>
                                                        <Label htmlFor="role" className="col-form-label col-lg-2">Role</Label>
                                                        <Col lg="10">
                                                        {/* <input
                                                          name="country"
                                                          placeholder="country"
                                                          type="select"
                                                          errorMessage="Enter country"
                                                          className="form-control"
                                                          validate={{ required: { value: true } }}
                                                          id="country"
                                                          options={this.state.options}
                                                            value={this.state.value}
                                                            onChange={this.changeHandler}
                                                        /> */}
                                                        <Select
                                                            options={this.state.options}
                                                            onChange={this.changeHandler}
                                                            classNamePrefix="select2-selection"
                                                        />
                                                        </Col>
                                                    </FormGroup>  
                                                    {this.state.showClients &&
                                                    <FormGroup className="mb-4 select2-container" row>
                                                        <Label htmlFor="role" className="col-form-label col-lg-2">Client</Label>
                                                        <Col lg="10">
                                                        {/* <input
                                                          name="country"
                                                          placeholder="country"
                                                          type="select"
                                                          errorMessage="Enter country"
                                                          className="form-control"
                                                          validate={{ required: { value: true } }}
                                                          id="country"
                                                          options={this.state.options}
                                                            value={this.state.value}
                                                            onChange={this.changeHandler}
                                                        /> */}
                                                        <Select
                                                            options={this.state.clientsData}
                                                            onChange={this.changeClientHandler}
                                                            classNamePrefix="select2-selection"
                                                            value={this.state.roleValue}
                                                        />
                                                        </Col>
                                                    </FormGroup>
                                                    }  
                                                    <FormGroup className="mb-4" row>
                                                        <Label htmlFor="profileimage" className="col-form-label col-lg-2">Profile Image</Label>
                                                        <Col lg="10">
                                                        <div className="custom-file">
                                                            <Input id="profileimage" name="profileimage" type="file" className="custom-file-input" onChange={(e) => this.onChangeInput(e, 'profile_image')} />
                                                            <label className="custom-file-label" htmlFor="profileimage">Choose file</label>

                                                        </div>
                                                        </Col>
                                                    </FormGroup>
                                                </div>
                                            </div>
                                        <Row className="justify-content-end">
                                          <Col lg="10">
                                              <Button type="submit" color="primary">Submit</Button>{" "}
                                              <Button type="reset" color="secondary">Reset</Button>

                                          </Col>
                                        </Row>
                                        </form>
                                        

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

export default UserEdit;