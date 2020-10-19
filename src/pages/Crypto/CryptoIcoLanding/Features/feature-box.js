import React, { Component } from 'react';

class FeatureBox extends Component {
    render() {
        return (
            <React.Fragment>
                                <div className="mt-4 mt-md-auto">
                                    <div className="d-flex align-items-center mb-2">
                                        <div className="features-number font-weight-semibold display-4 mr-3">{this.props.num}</div>
                                        <h4 className="mb-0">{this.props.title}</h4>
                                    </div>
                                    <p className="text-muted">{this.props.desc}</p>
                                    <div className="text-muted mt-4">
                                        {
                                            this.props.features.map((feature, key) =>
                                                <p key={key} className={feature.id === 1 ? "mb-2" : ""}><i className="mdi mdi-circle-medium text-success mr-1"></i>{feature.desc}</p>
                                            )
                                        }
                                    </div>
                                </div>
            </React.Fragment>
        );
    }
}

export default FeatureBox;