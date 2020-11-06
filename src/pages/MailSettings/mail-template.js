import React, { Component, Fragment } from 'react';
import { Link, BrowserRouter as Router, Route,Switch, Redirect } from "react-router-dom";
import { Container, Row, Col, Card, CardBody, CardTitle, Input, Form, FormGroup, Label, Button, Badge } from "reactstrap";

// Import Editor
// import { Editor } from 'react-draft-wysiwyg';
// import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
// import {EditorState, convertFromRaw, convertToRaw} from "draft-js";
import { Editor } from "@tinymce/tinymce-react";

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


class MailTemplate extends Component {
    constructor(props) {
        super(props);
        this.state = {  
            MailTemplate : {}
        }
        this.onEditorChange = this.onEditorChange.bind(this);
    }

    componentDidMount() {
        instance.get('http://localhost:4000/template')
        .then(response => {
            console.log('TEMPLATE')
            console.log(response)
            var mailData = response.data        
            this.setState({ MailTemplate: mailData });
           
        })
        .catch(function (error){
            console.log(error);
        })       
    }
    

    onChangeInput(e, name) {
      console.log(e.target.value)
      this[name] = e.target.value
    }

    onEditorChange(content, editor) {
        console.log(content)
        this.content = content
    }

    onFormSubmit(e) {
      e.preventDefault();
      
      console.log(`Form submitted:`);
    //   console.log(`Company Name : ${this.company_name}`);
    //   console.log(`Email : ${this.email}`);
    //   console.log(`Country : ${this.country_code}`);
    
      var payload = {
        subject : this.subject,
        content : this.content
      }
      console.log('payload')
      console.log(payload)
      instance.post('http://localhost:4000/template/update/'+this.state.MailTemplate._id, payload)
      .then(res => {
        console.log(res.data)
        var title = 'Success'
        var message = "Mail Template updated successfully"
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
                                                        <Label htmlFor="subject" className="col-form-label col-lg-2">Subject</Label>
                                                        <Col lg="10">
                                                        <AvField
                                                          name="subject"
                                                          placeholder="subject"
                                                          type="text"
                                                          errorMessage="Enter subject"
                                                          className="form-control"
                                                          validate={{ required: { value: true } }}
                                                          id="subject"
                                                          value={this.state.MailTemplate.subject}
                                                          onChange={(e) => this.onChangeInput(e, 'subject')}
                                                        />
                                                        </Col>
                                                    </FormGroup>
                                                    <FormGroup className="mb-4" row>
                                                    <Label htmlFor="server" className="col-form-label col-lg-2">Content</Label>
                                                    <Col lg="10">
                                                        <Editor
                                                            
                                                            value={this.state.MailTemplate.content}
                                                            editorState={this.state.editorState}
                                                            onEditorChange={this.onEditorChange}   
                                                        />
                                                    </Col>
                                                    </FormGroup>
                                                    
                                                </div>
                                            </div>
                                        <Row className="justify-content-end">
                                          <Col lg="10">
                                              <Button type="submit" color="primary">Update Template</Button>{" "}
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

export default MailTemplate;