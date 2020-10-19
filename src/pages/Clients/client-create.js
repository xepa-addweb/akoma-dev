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
import { AvForm, AvField } from "availity-reactstrap-validation";
import Select from 'react-select'
import countryList from 'react-select-country-list'

const instance = axios.create();


class ClientCreate extends Component {
    constructor(props) {
        super(props);
        this.options = countryList().getData()
        this.state = {
            company_name: new Date(),
            endDate: new Date(),
            inputFields: [
                { name: "", file: "" }
            ],
            options: this.options,
            value: null,
        }
        this.startDateChange.bind(this);
        this.endDateChange.bind(this);
        this.handleAddFields.bind(this);
        this.handleRemoveFields.bind(this);
    }
    startDateChange = date => {
        this.setState({
            startDate: date
        });
    };

    endDateChange = date => {
        this.setState({
            endDate: date
        });
    };

    // Function for Create Input Fields
    handleAddFields = () => {
        var values = this.state.inputFields;
        values.push({ name: "", file: "" });
        this.setState({ inputFields: values });
    }

    // Function for Remove Input Fields
    handleRemoveFields = (index) => {
        var values = this.state.inputFields;
        values.splice(index, 1);
        this.setState({ inputFields: values });
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

      if(this.email == ''){
        return
      }

      var payload = {
        company_name : this.company_name,
        email : this.email,
        website : this.website,
        address : this.address,
        phone : this.phone
      }
      console.log('payload')
      console.log(payload)
      instance.post('http://localhost:4000/clients/create', payload)
      .then(res => {
        console.log(res.data)
        var title = 'Success'
        var message = "Client created successfully"
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
    this.setState({ value })
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
                                                          onChange={(e) => this.onChangeInput(e, 'website')}
                                                        />
                                                        </Col>
                                                    </FormGroup>
                                                    <FormGroup className="mb-4" row>
                                                        <Label htmlFor="country" className="col-form-label col-lg-2">Country</Label>
                                                        <Col lg="10">
                                                        {/* <AvField
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
                                                            value={this.state.value}
                                                            onChange={this.changeHandler}
                                                            className="form-control"
                                                        />
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

                                                        </div>
                                                        </Col>
                                                    </FormGroup>
                                                </div>
                                            </div>
                                        <Row className="justify-content-end">
                                          <Col lg="10">
                                              <Button type="submit" color="primary">Create Client</Button>{" "}
                                              <Button type="reset" color="secondary">Reset</Button>

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

export default ClientCreate;