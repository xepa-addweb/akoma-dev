import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Container, Row, Col, Card, CardBody, Table, UncontrolledTooltip, Pagination, PaginationItem, PaginationLink, Button } from "reactstrap";

//Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';

//Import Images
import avatar2 from "../../assets/images/users/avatar-2.jpg";
import avatar3 from "../../assets/images/users/avatar-3.jpg";
import avatar4 from "../../assets/images/users/avatar-4.jpg";
import avatar5 from "../../assets/images/users/avatar-5.jpg";
import avatar7 from "../../assets/images/users/avatar-7.jpg";
import axios from 'axios'

import toastr from 'toastr'
import 'toastr/build/toastr.min.css'


const instance = axios.create();

// const Clients = props => (
//     <tr>
//         <td>{props.user.company_name}</td>
//         <td>{props.user.email}</td>
//         <td>{props.user.website}</td>
//         <td>
//             <Link to={"/clients/edit/"+props.user._id}>Edit</Link>{' '}
//             <Link to="/#" onClick={e => {e.preventDefault();
//                 this.onDeleteClick(props.user._id)}}>Delete</Link>
            
//         </td>
//     </tr>
// )
class ContactsList extends Component {
    constructor(props) {
        super(props);
        this.state = {clients: []};
    }

    componentDidMount() {
        instance.get('http://localhost:4000/clients/')
            .then(response => {
                console.log('CLIENTS')
                console.log(response)
                this.setState({ clients: response.data });
            })
            .catch(function (error){
                console.log(error);
            })
    }

    onDeleteClick(id) {
        instance.delete('http://localhost:4000/clients/delete/'+id)
            .then(response => {
                console.log('CLIENTS Delete')
                console.log(response)
                var title = 'Success'
                var message = "Client deleted successfully"
                toastr.success(message,title)
                this.setState({ clients: response.data });
            })
            .catch(function (error){
                console.log(error);
            })
    }
    render() {
        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid>

                        {/* Render Breadcrumbs */}
                        <Breadcrumbs title="Contacts" breadcrumbItem="Users List" />

                        <Row>
                            <Col lg="12">
                                <Card>
                                    <CardBody>
                                        <div className="table-responsive">
                                            <Table className="table-centered table-nowrap table-hover">
                                                <thead className="thead-light">
                                                    <tr>
                                                        <th scope="col">Company Name</th>
                                                        <th scope="col">Email</th>
                                                        <th scope="col">Website</th>
                                                        <th scope="col">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {this.state.clients.map((currentClient, i) =>
                                                    
                                                        <tr key={i}>
                                                            <td>{currentClient.company_name}</td>
                                                            <td>{currentClient.email}</td>
                                                            <td>{currentClient.website}</td>
                                                            <td>
                                                                <Link to={"/clients/edit/"+currentClient._id}>Edit</Link>{' '}
                                                                <Link to="/#" onClick={e => {e.preventDefault();
                                                                    this.onDeleteClick(currentClient._id)}}>Delete</Link>
                                                                
                                                            </td>
                                                        </tr>
                                                    )
                                                }
                                                {/* { this.clientList() } */}
                                                    {/* {
                                                        this.state.users.map((user, i) =>
                                                            <tr key={"_user_" + i} >
                                                                <td>
                                                                    {
                                                                        user.img === "Null"
                                                                            ? <div className="avatar-xs">
                                                                                <span className="avatar-title rounded-circle">
                                                                                    {user.name.charAt(0)}
                                                                                </span>
                                                                            </div>
                                                                            : <div>
                                                                                <img className="rounded-circle avatar-xs" src={user.img} alt="" />
                                                                            </div>
                                                                    }

                                                                </td>
                                                                <td>
                                                                    <h5 className="font-size-14 mb-1"><Link to="#" className="text-dark">{user.name}</Link></h5>
                                                                    <p className="text-muted mb-0">{user.designation}</p>
                                                                </td>
                                                                <td>{user.email}</td>
                                                                <td>
                                                                    <div>
                                                                        {
                                                                            user.skills.map((skill, key) =>
                                                                                <Link to="#" className="badge badge-soft-primary font-size-11 m-1" key={"_skill_" + key}>{skill.name}</Link>
                                                                            )
                                                                        }

                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    {user.projects}
                                                                </td>
                                                                <td>
                                                                    <ul className="list-inline font-size-20 contact-links mb-0">
                                                                        <li className="list-inline-item px-2">
                                                                            <Link to="#" id={"message" + user.id}>
                                                                                <i className="bx bx-message-square-dots"></i>
                                                                                <UncontrolledTooltip placement="top" target={"message" + user.id}>
                                                                                    Message
                                                                                </UncontrolledTooltip>
                                                                            </Link>
                                                                        </li>
                                                                        <li className="list-inline-item px-2">
                                                                            <Link to="#" id={"profile" + user.id}>
                                                                                <i className="bx bx-user-circle"></i>
                                                                                <UncontrolledTooltip placement="top" target={"profile" + user.id}>
                                                                                    Profile
                                                                                </UncontrolledTooltip>
                                                                            </Link>
                                                                        </li>
                                                                    </ul>
                                                                </td>
                                                            </tr>
                                                        )
                                                    } */}

                                                </tbody>
                                            </Table>
                                        </div>
                                        {/* <Row>
                                            <Col lg="12">
                                                <Pagination className="pagination pagination-rounded justify-content-center mt-4">
                                                    <PaginationItem disabled>
                                                        <PaginationLink previous href="#" />
                                                    </PaginationItem>
                                                    <PaginationItem>
                                                        <PaginationLink href="#">
                                                            1
                                                        </PaginationLink>
                                                    </PaginationItem>
                                                    <PaginationItem active>
                                                        <PaginationLink href="#">
                                                            2
                                                        </PaginationLink>
                                                    </PaginationItem>
                                                    <PaginationItem>
                                                        <PaginationLink href="#">
                                                            3
                                                        </PaginationLink>
                                                    </PaginationItem>
                                                    <PaginationItem>
                                                        <PaginationLink href="#">
                                                            4
                                                        </PaginationLink>
                                                    </PaginationItem>
                                                    <PaginationItem>
                                                        <PaginationLink href="#">
                                                            5
                                                        </PaginationLink>
                                                    </PaginationItem>
                                                    <PaginationItem>
                                                        <PaginationLink next href="#" />
                                                    </PaginationItem>
                                                </Pagination>
                                            </Col>
                                        </Row> */}
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

export default ContactsList;