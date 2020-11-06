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
class UsersList extends Component {
    constructor(props) {
        super(props);
        const userObj = JSON.parse(localStorage.getItem("authUser"))
        var userGrants = userObj.role.name
        var userClient = ''
        console.log('dasdasdasf')
        console.log(userObj.client)
        var userClientArr = userObj.client
        if(userClientArr.length > 0) {
         userClient = userClientArr[0]
        }
        this.state = {users: [],
        userGrants : userGrants,
        userClient : userClient
        };
    }

    componentDidMount() {
        const userRole = this.state.userGrants
        const userClient = this.state.userClient
        console.log('CLIENNT')
        console.log(userClient)
        if(userRole == 'Super User' || userRole == 'System User') {
        instance.get('http://localhost:4000/users/')
            .then(response => {
                console.log('USERS')
                console.log(response)
                this.setState({ users: response.data });
            })
            .catch(function (error){
                console.log(error);
            })
        } else {
            instance.get('http://localhost:4000/users/userByClient/'+userClient)
            .then(response => {
                console.log('USERS')
                console.log(response)
                this.setState({ users: response.data });
            })
            .catch(function (error){
                console.log(error);
            })  
        }
    }

    onDeleteClick(id) {
        console.log('user_del: ', id);
        instance.delete('http://localhost:4000/users/delete/'+id)
            .then(response => {
                console.log('Users Delete')
                console.log(response)
                var title = 'Success'
                var message = "User deleted successfully"
                toastr.success(message,title)
                this.setState({ users: response.data });
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
                                                        <th scope="col">First Name</th>
                                                        <th scope="col">Last Name</th>
                                                        <th scope="col">Username</th>
                                                        <th scope="col">Email</th>
                                                        <th scope="col">Status</th>
                                                        <th scope="col">Role</th>
                                                        <th scope="col">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {this.state.users.map((currentUser, i) => {
                                                    var roleName= ''
                                                    if(currentUser.role == 1) {
                                                        roleName = 'System Admin'
                                                    }
                                                    else if(currentUser.role == 2) {
                                                        roleName = 'Client Admin'
                                                    }
                                                    else {
                                                        roleName = 'Agent'
                                                    }
                                                    return (
                                                        <tr key={i}>
                                                            <td>{currentUser.first_name}</td>
                                                            <td>{currentUser.last_name}</td>
                                                            <td>{currentUser.username}</td>
                                                            <td>{currentUser.email}</td>
                                                            <td>{currentUser.status}</td>
                                                            <td>{currentUser.role.name}</td>
                                                            <td>
                                                                {this.state.userGrants != 'System User' &&
                                                                <Link to={"/user_edit/"+currentUser._id}>Edit</Link>
                                                                }{' '}
                                                                {this.state.userGrants != 'System User' &&
                                                                <Link to="/#" onClick={e => {e.preventDefault();
                                                                    this.onDeleteClick(currentUser._id)}}>Delete</Link>
                                                                }
                                                            </td>
                                                        </tr>
                                                    )
                                                    })
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

export default UsersList;