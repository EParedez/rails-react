import React from 'react'
import ReactDOM from 'react-dom'
import EventList from "./EventList";
import EventForm from './EventForm';
import axios from "axios";

class Eventlite extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            events: props.events,
            title: '',
            start_datetime: '',
            location: ''
        }
    }

    handleInput = (e) => {
        const name = e.target.name;
        const newState = {};
        newState[name] = e.target.value;
        this.setState(newState);
        e.preventDefault();
    }

    handleSubmit = e => {
        axios({
            method: 'POST',
            url: '/events',
            data: { event: this.state },
            headers: {
                'X-CSRF-Token': document.querySelector("meta[name=csrf-token]").content
            }
        })
            .then(response => {
                console.log(response)
                this.handleNewEvent(response.data);
            })
            .catch(error => {
                console.log(error)
            })
        e.preventDefault();
    }

    handleNewEvent = (event) => {
        const events = [event, ...this.state.events];
        this.setState({events: events});
    }

    render(){
        return (
            <div>
                <EventForm handleSubmit = {this.handleSubmit} handleInput = {this.handleInput}
                           title = {this.state.title}
                           start_datetime = {this.state.start_datetime}
                           location = {this.state.location} />
                <EventList events={this.state.events} />
            </div>
        )
    }

}


document.addEventListener('DOMContentLoaded', () => {
    const node = document.getElementById('events_data')
    const data = JSON.parse(node.getAttribute('data'))
    ReactDOM.render(
        <Eventlite events={data} />,
       document.body.appendChild(document.createElement('div'))
    )
})