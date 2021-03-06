import React, { Component, Fragment } from 'react';
import { Link, Route } from "react-router-dom";
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
import SimpleReactValidator from 'simple-react-validator';


const instance = axios.create();


class ClientCreate extends Component {
    constructor(props) {
        super(props);
        this.options = countryList().getData()
        console.log('fsdf')
        console.log(this.options)
        this.state = {            
            options: this.options,
            value: null,
            client_admins : []
        }
        this.validator = new SimpleReactValidator({autoForceUpdate: this});
        
    }

    componentDidMount() {
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

      
         this.validator.showMessages();
    
        console.log('111111111')
        // console.log(this.company_logo.File)
        var payload = {
            company_name : this.company_name,
            client_name : this.client_name,
            email : this.email,
            website : this.website,
            address : this.address,
            phone : this.phone,
            country_code : this.country_code,
            client_admin : this.client_admin,
            company_logo : 'client_'+this.logo_name
        }
        console.log('payload')
        console.log(payload)
        instance.post('http://localhost:4000/clients/create', payload)
        .then(res => {
            console.log(res.data)
            var title = 'Success'
            var message = "Client created successfully"
            toastr.success(message,title)
            this.props.history.push('/clients');
            
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

  //Select
    handleSelectGroup = country_code => {
        this.country_code =  country_code.value;
    };
    handleMulti = client_admin => {
        var clientAdmins = []
        client_admin.forEach(function(cax) {
            clientAdmins.push(cax.value)
        })
        this.client_admin = clientAdmins;
    }

    onFileChange(e) {
        e.preventDefault();
        this.company_logo = e.target.files[0]
        console.log('LOGO '+e.target.files[0].name)  
        this.logo_name = e.target.files[0].name
        const data = new FormData()
        data.append('file', this.company_logo)
        console.log('File Data')
        console.log(data)
        instance.post("http://localhost:4000/clients/upload", data, { // receive two parameter endpoint url ,form data 
        })
        .then(res => { // then print response status
                      
            console.log(res.statusText)
        })
        .catch(error => {
            console.log(error)
            // e.target.reset();
            // console.log(error.response.data.error)
        }); 
          
        // this.company_logo = e.target.files[0]
    }
  
    render() {
        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid>

                        {/* Render Breadcrumbs */}
                        <Breadcrumbs title="Clients" breadcrumbItem="Create Client" />
                        
                        <Row>
                            <Col lg="12">
                                <Card>
                                    <CardBody>
                                        <CardTitle className="mb-4">Create Client</CardTitle>
                                        <form className="needs-validation outer-repeater" onSubmit={e => this.onFormSubmit(e)}>
                                            <div data-repeater-list="outer-group" className="outer">
                                                <div data-repeater-item className="outer">
                                                    <FormGroup className="mb-4" row>
                                                        <Label htmlFor="companyname" className="col-form-label col-lg-2">Company Name</Label>
                                                        <Col lg="10">
                                                        <input
                                                          name="companyname"
                                                          placeholder="Company name"
                                                          type="text"
                                                          className="form-control"
                                                          id="companyname"
                                                          onChange={(e) => this.onChangeInput(e, 'company_name')}
                                                        />
                                                        {this.validator.message('company_name', this.company_name, 'required', { className: 'text-danger' })}
                                                        </Col>
                                                    </FormGroup>
                                                    <FormGroup className="mb-4" row>
                                                        <Label htmlFor="clientname" className="col-form-label col-lg-2">Client Name</Label>
                                                        <Col lg="10">
                                                        <input
                                                          name="clientname"
                                                          placeholder="Client name"
                                                          type="text"
                                                          className="form-control"
                                                          id="clientname"
                                                          onChange={(e) => this.onChangeInput(e, 'client_name')}
                                                        />
                                                        {this.validator.message('client_name', this.client_name, 'required', { className: 'text-danger' })}
                                                        </Col>
                                                    </FormGroup>
                                                    <FormGroup className="mb-4" row>
                                                        <Label htmlFor="email" className="col-form-label col-lg-2">Email</Label>
                                                        <Col lg="10">
                                                        <input
                                                          name="email"
                                                          placeholder="Email"
                                                          type="email"
                                                          className="form-control"
                                                          id="email"
                                                          onChange={(e) => this.onChangeInput(e, 'email')}
                                                        />
                                                        {this.validator.message('email', this.email, 'required|email', { className: 'text-danger' })}
                                                        </Col>
                                                    </FormGroup>
                                                    <FormGroup className="mb-4" row>
                                                        <Label htmlFor="website" className="col-form-label col-lg-2">Website</Label>
                                                        <Col lg="10">
                                                        <input
                                                          name="website"
                                                          placeholder="Website"
                                                          type="text"
                                                          className="form-control"
                                                          id="website"
                                                          onChange={(e) => this.onChangeInput(e, 'website')}
                                                        />
                                                        {this.validator.message('website', this.website, 'required|url', { className: 'text-danger' })}

                                                        </Col>
                                                    </FormGroup>
                                                    <FormGroup className="mb-4 select2-container" row>
                                                        <Label htmlFor="country" className="col-form-label col-lg-2">Country</Label>
                                                        <Col lg="10">
                                                        <Select
                                                          name="country"
                                                          id="country"
                                                          options={this.state.options}
                                                          classNamePrefix="select2-selection"
                                                          onChange={this.handleSelectGroup}
                                                            
                                                        />
                                                        {this.validator.message('country', this.country_code, 'required', { className: 'text-danger' })}
                                                        
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
                                                        <input
                                                          name="address"
                                                          placeholder="Address"
                                                          type="textarea"
                                                          className="form-control"
                                                          id="address"
                                                          onChange={(e) => this.onChangeInput(e, 'address')}
                                                        />
                                                        {/* {this.validator.message('address', this.address, 'required', { className: 'text-danger' })} */}

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
                                                        <input
                                                          name="phone"
                                                          placeholder="Phone"
                                                          type="number"
                                                          id="phone"
                                                          className="form-control"
                                                          onChange={(e) => this.onChangeInput(e, 'phone')}
                                                        />
                                                        {this.validator.message('phone', this.phone, 'required|numeric', { className: 'text-danger' })}

                                                        </Col>
                                                    </FormGroup>
                                                    <FormGroup className="mb-4" row>
                                                        <Label htmlFor="companylogo" className="col-form-label col-lg-2">Company Logo</Label>
                                                        <Col lg="10">
                                                        <div className="custom-file">
                                                            <Input id="companylogo" name="companylogo" type="file" className="custom-file-input" onChange={(e) => this.onFileChange(e)} />
                                                            <label className="custom-file-label" htmlFor="companylogo">Choose file</label>

                                                        </div>
                                                        {/* {this.validator.message('company_logo', this.company_logo, 'required|numeric', { className: 'text-danger' })} */}

                                                        </Col>
                                                    </FormGroup>
                                                    <FormGroup className="mb-4 select2-container" row>
                                                        <Label htmlFor="companylogo" className="col-form-label col-lg-2">Client Admin</Label>
                                                        <Col lg="10">
                                                        <Select
                                                          name="client_admin"
                                                          id="client_admin"
                                                          isMulti={true}
                                                          options={this.state.client_admins}
                                                          classNamePrefix="select2-selection"   
                                                          onChange={this.handleMulti}   
                                                        />
                                                        {/* {this.validator.message('phone', this.phone, 'required|numeric', { className: 'text-danger' })} */}

                                                        </Col>
                                                    </FormGroup>
                                                </div>
                                            </div>
                                        <Row className="justify-content-end">
                                          <Col lg="10">
                                              <Button type="submit" color="primary">Create Client</Button>{" "}
                                              <Button type="reset" color="secondary">Reset</Button>
                                              <Route path="/clients" component={ClientList}/>                 
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

export default ClientCreate;