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
import countryList from 'react-select-country-list'
import ClientList from "./client-list";


const instance = axios.create();


class ClientEdit extends Component {
    constructor(props) {
        super(props);
        this.options = countryList().getData()
        console.log('fsdf')
        console.log(this.options)
        this.state = {            
            options: this.options,
            value: null,
            client_admins : [],
            current_client : {},
            profileLogo : ''
        }
    }

    componentDidMount() {
        // alert(this.props.match.params.id)
        var clientID = this.props.match.params.id
        instance.get('http://localhost:4000/clients/'+clientID)
        .then(response => {
            console.log('CLIENT EDIT')
            console.log(response)
            var clientData = response.data 
            var profileLogo = '../../src/public/clients/'+clientData.company_logo           
            this.setState({ current_client: clientData, profileLogo : profileLogo });
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
      console.log(`Company Name : ${this.company_name}`);
      console.log(`Email : ${this.email}`);
      console.log(`Country : ${this.country_code}`);


      if(this.email == ''){
        return
      }

      var payload = {
        company_name : this.company_name,
        email : this.email,
        website : this.website,
        address : this.address,
        phone : this.phone,
        country_code : this.country_code,
        client_admin : this.client_admin
      }
      console.log('payload')
      console.log(payload)
      instance.post('http://localhost:4000/clients/update/'+this.props.match.params.id, payload)
      .then(res => {
        console.log(res.data)
        var title = 'Success'
        var message = "Client updated successfully"
        toastr.success(message,title)
        this.onClickCancel()
        
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

  onClickCancel = () => {
        this.props.history.push('/clients');
  }
  
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
                                                        <Label htmlFor="companyname" className="col-form-label col-lg-2">Company Name</Label>
                                                        <Col lg="10">
                                                        <AvField
                                                          name="companyname"
                                                          placeholder="Company name"
                                                          type="text"
                                                          errorMessage="Enter Company Name"
                                                          className="form-control"
                                                          validate={{ required: { value: true } }}
                                                          id="companyname"
                                                          value={this.state.current_client.company_name}
                                                          onChange={(e) => this.onChangeInput(e, 'company_name')}
                                                        />
                                                        </Col>
                                                    </FormGroup>
                                                    <FormGroup className="mb-4" row>
                                                        <Label htmlFor="email" className="col-form-label col-lg-2">Email</Label>
                                                        <Col lg="10">
                                                        <AvField
                                                          name="email"
                                                          placeholder="Email"
                                                          type="email"
                                                          errorMessage="Enter Valid Email"
                                                          className="form-control"
                                                          validate={{ required: { value: true },email: { value: true } }}
                                                          id="email"
                                                          value={this.state.current_client.email}
                                                          onChange={(e) => this.onChangeInput(e, 'email')}
                                                        />
                                                        </Col>
                                                    </FormGroup>
                                                    <FormGroup className="mb-4" row>
                                                        <Label htmlFor="website" className="col-form-label col-lg-2">Website</Label>
                                                        <Col lg="10">
                                                        <AvField
                                                          name="website"
                                                          placeholder="Website"
                                                          type="text"
                                                          errorMessage="Enter website"
                                                          className="form-control"
                                                          validate={{ required: { value: true } }}
                                                          id="website"
                                                          value={this.state.current_client.website}
                                                          onChange={(e) => this.onChangeInput(e, 'website')}
                                                        />
                                                        </Col>
                                                    </FormGroup>
                                                    <FormGroup className="mb-4 select2-container" row>
                                                        <Label htmlFor="country" className="col-form-label col-lg-2">Country</Label>
                                                        <Col lg="10">
                                                        <AvField
                                                          name="country"
                                                          placeholder="country"
                                                          type="select"
                                                          errorMessage="Enter country"
                                                          className="form-control select2"
                                                          classNamePrefix="select2"
                                                          validate={{ required: { value: true } }}
                                                          id="country"
                                                          value={this.state.current_client.country_code}
                                                          onChange={(e) => this.onChangeInput(e, 'country_code')}>
                                                        <option>Select Country</option>        
                                                        {this.state.options && this.state.options.map((cname, i) =>
                                                        <option value={cname.value} key={cname.value}>{cname.label}</option>
                                                        )}        
                                                        </AvField>
                                                        
                                                        {/* <Select
                                                            options={this.state.options}
                                                            value={this.state.value}
                                                            onChange={this.changeHandler}
                                                            className="form-control"
                                                        /> */}
                                                        </Col>
                                                    </FormGroup>
                                                    <FormGroup className="mb-4" row>
                                                        <Label htmlFor="address" className="col-form-label col-lg-2">Address</Label>
                                                        <Col lg="10">
                                                        <AvField
                                                          name="address"
                                                          placeholder="Address"
                                                          type="textarea"
                                                          errorMessage="Enter address"
                                                          className="form-control"
                                                          validate={{ required: { value: true } }}
                                                          id="address"
                                                          value={this.state.current_client.address}
                                                          onChange={(e) => this.onChangeInput(e, 'address')}
                                                        />
                                                            {/* <Editor
                                                                toolbarClassName="toolbarClassName"
                                                                wrapperClassName="wrapperClassName"
                                                                editorClassName="editorClassName"
                                                                placeholder="Place Your Content Here..."
                                                            /> */}
                                                        </Col>
                                                    </FormGroup>
                                                    <FormGroup className="mb-4" row>
                                                        <Label htmlFor="phone" className="col-form-label col-lg-2">Phone</Label>
                                                        <Col lg="10">
                                                        <AvField
                                                          name="phone"
                                                          placeholder="Phone"
                                                          type="number"
                                                          errorMessage="Enter phone"
                                                          className="form-control"
                                                          validate={{ required: { value: true },pattern: {
                                                            value: "^[0-9]+$",
                                                            errorMessage: "Only Numbers"
                                                          } }}
                                                          id="phone"
                                                          value={this.state.current_client.phone}
                                                          onChange={(e) => this.onChangeInput(e, 'phone')}
                                                        />
                                                        </Col>
                                                    </FormGroup>
                                                    <FormGroup className="mb-4" row>
                                                        <Label htmlFor="companylogo" className="col-form-label col-lg-2">Company Logo</Label>
                                                        <Col lg="10">
                                                        <div className="custom-file">
                                                            <Input id="companylogo" name="companylogo" type="file" className="custom-file-input" onChange={(e) => this.onChangeInput(e, 'company_logo')} />
                                                            <label className="custom-file-label" htmlFor="companylogo">Choose file</label>
                                                        <img src={`/${this.state.current_client.company_logo}`} height="40px" width="40px"/>
                                                          
                                                        </div>

                                                        </Col>
                                                    </FormGroup>
                                                    <FormGroup className="mb-4" row>
                                                        <Label htmlFor="companylogo" className="col-form-label col-lg-2">Client Admin</Label>
                                                        <Col lg="10">
                                                        <AvField
                                                          name="client_admin"
                                                          placeholder="client_admin"
                                                          type="select"
                                                          errorMessage="Enter client_admin"
                                                          className="form-control select2"
                                                          classNamePrefix="select2"
                                                          validate={{ required: { value: true } }}
                                                          id="client_admin"
                                                          value={this.state.current_client.client_admin}
                                                          onChange={(e) => this.onChangeInput(e, 'client_admin')}>
                                                        <option>Select Client Admin</option>        
                                                        {this.state.client_admins && this.state.client_admins.map((cname, i) =>
                                                        <option value={cname.value} key={cname.value}  >{cname.label}</option>
                                                        )}        
                                                        </AvField>
                                                        </Col>
                                                    </FormGroup>
                                                </div>
                                            </div>
                                        <Row className="justify-content-end">
                                          <Col lg="10">
                                              <Button type="submit" color="primary">Update Client</Button>{" "}
                                              <Button id="b1" onClick ={this.onClickCancel}>Cancel</Button>
                                                <Route path="/clients" component={ClientList}/>

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

export default ClientEdit;