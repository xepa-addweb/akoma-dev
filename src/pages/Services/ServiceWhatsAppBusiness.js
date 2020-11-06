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
import SimpleReactValidator from 'simple-react-validator';


const instance = axios.create();

class ServiceWhatsAppBusiness extends Component {
    constructor(props) {
        super(props);
        this.state = {
            serviceProviderData : [],
            clientsData : [],
            showExtraFields : false
        }
        this.validator = new SimpleReactValidator({autoForceUpdate: this});

       
    }

    onChangeInput(e, name) {
      console.log(e.target.value)
      this[name] = e.target.value
    }

    componentDidMount() {
        var serviceProviderData = [
           { label : 'Karix', value : 'Karix' },
           { label : 'Positus', value : 'Positus' }
        ]
        this.setState({serviceProviderData : serviceProviderData})

        //Client Data
        instance.get('http://localhost:4000/clients/')
        .then(response => {
            console.log('CLIENTS')
            // console.log(response)
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
      this.validator.showMessages();
      if(this.service_provider == '' || this.client == '') {
          return false
      }
      
      console.log(`Form submitted:`);
      var payload = {
        client : this.client,
        service_provider : this.service_provider
      }
      if(this.business_description != '') {
          payload.business_description = this.business_description
      }
      if(this.address != '') {
        payload.address = this.address
      }
      if(this.email != '') {
        payload.email = this.email
      }
      if(this.website != '') {
        payload.websites = this.website
      }
      if(this.vertical != '') {
        payload.vertical = this.vertical
      }
      if(this.about != '') {
        payload.about = this.about
      }
     

    //   var payload = {
    //     business_description : this.business_description,
    //     address : this.address,
    //     email : this.email,
    //     website : this.website,
    //     vertical : this.vertical,
    //     about : this.about,
    //     service_provider : this.service_provider,
    //     client : this.client
    //   }
      console.log('payload')
      console.log(payload)
      instance.post('http://localhost:4000/service/update/whatsapp_details', payload)
      .then(res => {
        console.log(res.data)
        var title = 'Success'
        var message = "Details updated successfully"
        toastr.success(message,title)
        // e.target.reset();
        
      })
      .catch(error => {
        console.log(error)
        // e.target.reset();
        // console.log(error.response.data.error)
      });
      e.target.reset();
  }

  changeSelectHandler(e, name) {
      console.log(e.value)
      console.log(name)
    this[name] = e.value;

    if(name == 'client') {
        this.setState({showExtraFields : true})
    }
  }

    render() {
        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid>

                        {/* Render Breadcrumbs */}
                        <Breadcrumbs title="Service" breadcrumbItem="WhatsApp Business" />
                        
                        <Row>
                            <Col lg="12">
                                <Card>
                                    <CardBody>
                                        <CardTitle className="mb-4">Create Access Key</CardTitle>
                                        <form className="needs-validation outer-repeater" onSubmit={e => this.onFormSubmit(e)}>
                                            <div data-repeater-list="outer-group" className="outer">
                                                <div data-repeater-item className="outer">
                                                    <FormGroup className="mb-4 select2-container" row>
                                                        <Label htmlFor="role" className="col-form-label col-lg-2">Service Provider</Label>
                                                        <Col lg="10">
                                                        
                                                        <Select
                                                            options={this.state.serviceProviderData}
                                                            onChange={(e) => this.changeSelectHandler(e, 'service_provider')}
                                                            classNamePrefix="select2-selection"
                                                        />
                                                        {this.validator.message('service_provider', this.service_provider, 'required', { className: 'text-danger' })}

                                                        </Col>
                                                    </FormGroup>
                                                    <FormGroup className="mb-4 select2-container" row>
                                                        <Label htmlFor="role" className="col-form-label col-lg-2">Client</Label>
                                                        <Col lg="10">
                                                        
                                                        <Select
                                                            options={this.state.clientsData}
                                                            onChange={(e) => this.changeSelectHandler(e, 'client')}
                                                            classNamePrefix="select2-selection"
                                                        />
                                                        {this.validator.message('client', this.client, 'required', { className: 'text-danger' })}

                                                        </Col>
                                                    </FormGroup>
                                                    {this.state.showExtraFields &&
                                                    <FormGroup className="mb-4" row>
                                                        <Label htmlFor="business_description" className="col-form-label col-lg-2">Business Description</Label>
                                                        <Col lg="10">
                                                        <textarea
                                                        //   value={this.business_description}
                                                          name="business_description"
                                                          placeholder="Business Description"
                                                          className="form-control"
                                                          id="business_description"
                                                          onChange={(e) => this.onChangeInput(e, 'business_description')}
                                                          maxLength={"256"}
                                                        />
                                                        {/* {this.validator.message('business_description', this.business_description, 'required', { className: 'text-danger' })} */}

                                                        </Col>
                                                    </FormGroup>
                                                    }
                                                    {this.state.showExtraFields &&
                                                    <FormGroup className="mb-4" row>
                                                        <Label htmlFor="address" className="col-form-label col-lg-2">Address</Label>
                                                        <Col lg="10">
                                                        <textarea
                                                        //   value={this.address}
                                                          name="address"
                                                          placeholder="Address"
                                                          className="form-control"
                                                          id="address"
                                                          onChange={(e) => this.onChangeInput(e, 'address')} 
                                                          maxLength={"256"}
                                                        />
                                                        {/* {this.validator.message('address', this.address, 'required', { className: 'text-danger' })} */}

                                                        </Col>
                                                    </FormGroup>
                                                    }
                                                    {this.state.showExtraFields &&
                                                    <FormGroup className="mb-4" row>
                                                        <Label htmlFor="vertical" className="col-form-label col-lg-2">Vertical</Label>
                                                        <Col lg="10">
                                                        <input
                                                        //   value={this.vertical}
                                                          name="vertical"
                                                          placeholder="Vertical"
                                                          type="text"
                                                          className="form-control"
                                                          id="vertical"
                                                          onChange={(e) => this.onChangeInput(e, 'vertical')}
                                                        />
                                                        {/* {this.validator.message('vertical', this.vertical, 'required', { className: 'text-danger' })} */}

                                                        </Col>
                                                    </FormGroup>
                                                    }
                                                    {this.state.showExtraFields &&
                                                    <FormGroup className="mb-4" row>
                                                        <Label htmlFor="email" className="col-form-label col-lg-2">Email</Label>
                                                        <Col lg="10">
                                                        <input
                                                        //   value={this.email}
                                                          name="email"
                                                          placeholder="Email"
                                                          type="email"
                                                          className="form-control"
                                                          id="email"
                                                          onChange={(e) => this.onChangeInput(e, 'email')}
                                                        />
                                                        {this.validator.message('email', this.email, 'email', { className: 'text-danger' })}

                                                        </Col>
                                                    </FormGroup>
                                                    }
                                                    {this.state.showExtraFields &&
                                                    <FormGroup className="mb-4" row>
                                                        <Label htmlFor="website" className="col-form-label col-lg-2">Website</Label>
                                                        <Col lg="10">
                                                        <input
                                                        //   value={this.website}
                                                          name="website"
                                                          placeholder="Website"
                                                          type="text"
                                                          className="form-control"
                                                          id="website"
                                                          onChange={(e) => this.onChangeInput(e, 'website')}
                                                        />
                                                        {this.validator.message('website', this.website, 'url', { className: 'text-danger' })}

                                                        </Col>
                                                    </FormGroup>
                                                    }
                                                    {this.state.showExtraFields &&
                                                    <FormGroup className="mb-4" row>
                                                        <Label htmlFor="about" className="col-form-label col-lg-2">About</Label>
                                                        <Col lg="10">
                                                        <input
                                                        //   value={this.about}
                                                          name="about"
                                                          placeholder="About"
                                                          type="text"
                                                          className="form-control"
                                                          id="about"
                                                          onChange={(e) => this.onChangeInput(e, 'about')}
                                                        />
                                                        {/* {this.validator.message('about', this.about, 'required', { className: 'text-danger' })} */}

                                                        </Col>
                                                    </FormGroup>
                                                    }
                                                    
                                                </div>
                                            </div>
                                        <Row className="justify-content-end">
                                          <Col lg="10">
                                              <Button type="submit" color="primary">Save</Button>{" "}
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

export default ServiceWhatsAppBusiness;