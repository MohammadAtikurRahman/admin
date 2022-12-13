

import React from 'react';
import axios from 'axios';

export default class Profile extends React.Component {
    state = {
        persons: []
    }

    componentDidMount() {
        axios.get(`https://jsonplaceholder.typicode.com/users`)
            .then(res => {
                const persons = res.data;
                this.setState({ persons });
            })
    }

    render() {
        return (
            //   <ul>
            //     {
            //       this.state.persons
            //         .map(person =>
            //           <li key={person.id}>{person.name}</li>
            //         )
            //     }
            //   </ul>

            <div className="container text-center p-5 border">
                <div className="row border p-3">
                    <h3>Beneficiary Name</h3>
                    <div className="col">


                        <div className="input-group">
                            <span className="input-group-text">Serial Number</span>
                            <input type="text" aria-label="First name" className="form-control" placeholder='123454'>
                            </input>

                        </div>

                    </div>
                    <div className="col">
                    <div className="input-group">
                            <span className="input-group-text"> ID of the Beneficiary</span>
                            <input type="text" aria-label="First name" className="form-control" placeholder='123454'>
                            </input>

                        </div>




                    
                    </div>
                    <div className="col">col</div>
                   
                </div>
                <div>
                    <br></br>
                </div>
                <div className="row border p-3">
                    <div className="col-8">col-8</div>
                    <div className="col-4">col-4</div>
                </div>
            </div>
        )
    }
}