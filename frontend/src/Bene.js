import React from 'react';
import axios from 'axios';

export default class Bene extends React.Component {
  state = {
    username: ''
  }

  handleChange = event => {
    this.setState({ username: event.target.value });
  }

  handleSubmit = event => {
    event.preventDefault();

    const users = {
      beneficiary: {

        username: this.state.username
      }
    
    };
  //  console.log(users)
  const info =users.beneficiary
   console.log(users.beneficiary)

    axios.post(`http://localhost:2000/beneficiary/add`, { ...users})
      .then(res => {
        
        // const info1=res.config.data;
        // res.data =info1;
        console.log(res);
        console.log(res.data);
        // console.log(info1);
  
      })

      
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>
            Person username:
            <input type="text" username="username" onChange={this.handleChange} />
          </label>
          <button type="submit">Add</button>
        </form>
      </div>
    )
  }
}