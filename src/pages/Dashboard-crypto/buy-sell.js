import React, { Component } from 'react';
import { Col, Card, CardBody, InputGroup, Button, Label, Input, FormGroup, Nav, NavItem, NavLink, TabContent, TabPane, InputGroupAddon  } from "reactstrap";
import classnames from 'classnames';

class BuySell extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: '1',
        }
        this.toggleTab = this.toggleTab.bind(this);
    }
    
    toggleTab(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }

    render() {
        return (
            <React.Fragment>
                            <Col xl="4">
                                <Card>
                                    <CardBody>
                                        <h4 className="card-title mb-4">Buy / Sell</h4>

                                        <Nav pills className="bg-light rounded" role="tablist">
                                            <NavItem>
                                                <NavLink className={classnames({ active: this.state.activeTab === '1' })} onClick={() => { this.toggleTab('1'); }} >
                                                    Buy
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink className={classnames({ active: this.state.activeTab === '2' })} onClick={() => { this.toggleTab('2'); }} >
                                                    Sell
                                                </NavLink>
                                            </NavItem>
                                        </Nav>

                                        <TabContent activeTab={this.state.activeTab} className="mt-4" style={{minHeight: "340px"}}>
                                            <TabPane tabId="1">
                                                <div className="float-right ml-2">
                                                    <h5 className="font-size-14"><i className="bx bx-wallet text-primary font-size-16 align-middle mr-1"></i> $4235.23</h5>
                                                </div>
                                                <h5 className="font-size-14 mb-4">Buy Coin</h5>

                                                <div>

                                                    <FormGroup className="mb-3">
                                                        <Label>Payment method :</Label>
                                                        <select className="custom-select">
                                                            <option>Credit / Debit Card</option>
                                                            <option>Paypal</option>
                                                        </select>
                                                    </FormGroup>

                                                    <div>
                                                        <Label>Add Amount :</Label>
                                                        <InputGroup className="mb-3">
                                                            <InputGroupAddon addonType="prepend">
                                                            <Label className="input-group-text">Amount</Label>
                                                            </InputGroupAddon>
                                                            <select className="custom-select" style={{maxWidth: "90px"}}>
                                                                <option value="1" defaultValue>BTC</option>
                                                                <option value="2">ETH</option>
                                                                <option value="3">LTC</option>
                                                            </select>
                                                            <Input type="text" className="form-control"/>
                                                        </InputGroup>

                                                        <InputGroup className="mb-3">
                                                            <InputGroupAddon addonType="prepend">
                                                              <Label className="input-group-text">Price</Label>
                                                            </InputGroupAddon>
                                                            <Input type="text" className="form-control"/>
                                                            <InputGroupAddon addonType="append">
                                                                <Label className="input-group-text">$</Label>
                                                            </InputGroupAddon>
                                                        </InputGroup>

                                                        <InputGroup className="mb-3">
                                                            <InputGroupAddon addonType="prepend">
                                                              <Label className="input-group-text">Total</Label>
                                                            </InputGroupAddon>
                                                            <Input type="text" className="form-control"/>
                                                        </InputGroup>
                                                    </div>  

                                                    <div className="text-center">
                                                        <Button type="button" color="success" className="w-md">Buy Coin</Button>
                                                    </div>
                                                </div>
                                            </TabPane>
                                            <TabPane tabId="2">
                                                <div className="float-right ml-2">
                                                    <h5 className="font-size-14"><i className="bx bx-wallet text-primary font-size-16 align-middle mr-1"></i> $4235.23</h5>
                                                </div>
                                                <h5 className="font-size-14 mb-4">Sell Coin</h5>

                                                <div>

                                                    <FormGroup className="mb-3">
                                                        <Label>Email :</Label>
                                                        <Input type="email" className="form-control"/>
                                                    </FormGroup>

                                                    <div>
                                                        <Label>Add Amount :</Label>
                                                        <InputGroup className="mb-3">
                                                            <InputGroupAddon addonType="prepend">
                                                            <Label className="input-group-text">Amount</Label>
                                                            </InputGroupAddon>
                                                            <select className="custom-select" style={{maxWidth: "90px"}}>
                                                                <option value="1" defaultValue>BTC</option>
                                                                <option value="2">ETH</option>
                                                                <option value="3">LTC</option>
                                                            </select>
                                                            <Input type="text" className="form-control"/>
                                                        </InputGroup>

                                                        <InputGroup className="mb-3">
                                                            <InputGroupAddon addonType="prepend">
                                                              <Label className="input-group-text">Price</Label>
                                                            </InputGroupAddon>
                                                            <Input type="text" className="form-control"/>
                                                            <InputGroupAddon addonType="append">
                                                                <Label className="input-group-text">$</Label>
                                                            </InputGroupAddon>
                                                        </InputGroup>

                                                        <InputGroup className="mb-3">
                                                            <InputGroupAddon addonType="prepend">
                                                              <Label className="input-group-text">Total</Label>
                                                            </InputGroupAddon>
                                                            <Input type="text" className="form-control"/>
                                                        </InputGroup>
                                                    </div>  

                                                    <div className="text-center">
                                                        <Button type="button" color="danger" className="w-md">Sell Coin</Button>
                                                    </div>
                                                </div>
                                            </TabPane>
                                        </TabContent>
                                    </CardBody>
                                </Card>
                            </Col>
            </React.Fragment>
        );
    }
}

export default BuySell;