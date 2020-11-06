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
import SimpleReactValidator from 'simple-react-validator';


const instance = axios.create();


class TwitterKeyCreate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: this.props.match.params.id,
            clientsData : [],
            consumer_key : '',
            consumer_secret : '',
            access_token : '',
            access_token_secret : '',
            client_selected : ''
        }
        this.validator = new SimpleReactValidator({autoForceUpdate: this});
       
    }

    onChangeInput(e, name) {
      console.log(e.target.value)
      this[name] = e.target.value
    }

    componentDidMount() {
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
      console.log(`Form submitted:`);

      var payload = {
        twitter_consumer_key : this.consumer_key,
        twitter_consumer_secret : this.consumer_secret,
        twitter_access_token : this.access_token,
        twitter_access_token_secret : this.access_token_secret,
        client : this.client
      }
      console.log('payload')
      console.log(payload)
      instance.post('http://localhost:4000/clients/update_service', payload)
      .then(res => {
        console.log(res.data)
        var title = 'Success'
        var message = "Details updated successfully"
        toastr.success(message,title)
        this.setState({consumer_key : '', consumer_secret : '', access_token : '', access_token_secret : '', client_selected : ''})
        e.target.reset();
        
      })
      .catch(error => {
        console.log(error)
        // e.target.reset();
        // console.log(error.response.data.error)
      });
  }

  changeSelectHandler = value => {
    this.client = value.value;
  }

//   onEditButtonClick() {
//     //   alert('ds')
//   }

    render() {
        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid>

                        {/* Render Breadcrumbs */}
                        <Breadcrumbs title="Twitter" breadcrumbItem="Twitter" />
                        
                        <Row>
                            <Col lg="12">
                                <Card>
                                    <CardBody>
                                        <CardTitle className="mb-4">Create Access Key</CardTitle>
                                        <form className="needs-validation outer-repeater" onSubmit={e => this.onFormSubmit(e)}>
                                            <div data-repeater-list="outer-group" className="outer">
                                                <div data-repeater-item className="outer">
                                                    <FormGroup className="mb-4 select2-container" row>
                                                        <Label htmlFor="role" className="col-form-label col-lg-2">Client</Label>
                                                        <Col lg="10">
                                                        
                                                        <Select
                                                            options={this.state.clientsData}
                                                            onChange={(e) => this.changeSelectHandler(e, 'client')}
                                                            classNamePrefix="select2-selection"
                                                            // value={this.state.client_selected} 
                                                        />
                                                        {this.validator.message('client', this.client, 'required', { className: 'text-danger' })}

                                                        </Col>
                                                    </FormGroup>
                                                    <FormGroup className="mb-4" row>
                                                        <Label htmlFor="consumer_key" className="col-form-label col-lg-2">Consumer Key</Label>
                                                        <Col lg="10">
                                                        <input
                                                        //   value={this.state.consumer_key}
                                                          name="consumer_key"
                                                          placeholder="Consumer Key"
                                                          type="text"
                                                          className="form-control"
                                                          id="consumer_key"
                                                          onChange={(e) => this.onChangeInput(e, 'consumer_key')}
                                                        />
                                                        {this.validator.message('consumer_key', this.consumer_key, 'required', { className: 'text-danger' })}

                                                        </Col>
                                                    </FormGroup>
                                                    <FormGroup className="mb-4" row>
                                                        <Label htmlFor="consumer_secret" className="col-form-label col-lg-2">Consumer Secret</Label>
                                                        <Col lg="10">
                                                        <input
                                                        //   value={this.state.consumer_secret}
                                                          name="consumer_secret"
                                                          placeholder="Consumer Secret"
                                                          type="text"
                                                          className="form-control"
                                                          id="consumer_secret"
                                                          onChange={(e) => this.onChangeInput(e, 'consumer_secret')}
                                                        />
                                                        {this.validator.message('consumer_secret', this.consumer_secret, 'required', { className: 'text-danger' })}

                                                        </Col>
                                                    </FormGroup>
                                                    <FormGroup className="mb-4" row>
                                                        <Label htmlFor="access_token" className="col-form-label col-lg-2">Access Token</Label>
                                                        <Col lg="10">
                                                        <input
                                                        //   value={this.state.access_token}
                                                          name="access_token"
                                                          placeholder="Access Token"
                                                          type="text"
                                                          className="form-control"
                                                          id="access_token"
                                                          onChange={(e) => this.onChangeInput(e, 'access_token')}
                                                        />
                                                        {this.validator.message('access_token', this.access_token, 'required', { className: 'text-danger' })}

                                                        </Col>
                                                    </FormGroup>
                                                    <FormGroup className="mb-4" row>
                                                        <Label htmlFor="access_token_secret" className="col-form-label col-lg-2">Access Token Secret</Label>
                                                        <Col lg="10">
                                                        <input
                                                        //   value={this.state.access_token_secret}
                                                          name="access_token_secret"
                                                          placeholder="Access Token Secret"
                                                          type="text"
                                                          className="form-control"
                                                          id="access_token_secret"
                                                          onChange={(e) => this.onChangeInput(e, 'access_token_secret')}
                                                        />
                                                        {this.validator.message('access_token_secret', this.access_token_secret, 'required', { className: 'text-danger' })}

                                                        </Col>
                                                    </FormGroup>
                                                </div>
                                            </div>
                                        <Row className="justify-content-end">
                                          <Col lg="10">
                                              <Button type="submit" color="primary">Submit</Button>{" "}
                                              <Button type="reset" color="secondary">Reset</Button>{" "}
                                              {/* <Button type="reset" color="secondary" onClick={this.onEditButtonClick}>Edit</Button> */}


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

export default TwitterKeyCreate;