import React from 'react';
import AircraftsRotationView from './rotation';
import AircraftsView from './aircrafts';
import FlightsView from './flights';

import Aircrafts from '../aircrafts.js';
import Flights from '../flights.js';

// TODO: FETCH FROM API
import Axios from '../../node_modules/axios/dist/axios.min';

import '../styles/app.css';
import aircrafts from "../aircrafts";

// =================================================================================================
class App extends React.Component {


	// =============================================================================================
	constructor( props ) {

		super( props );

		const today = new Date().getDate();

		// GIVE A FLIGHTS ARRAY TO EACH AIRCRAFT
		const aircrafts = Aircrafts.map( aircraft => {
			return Object.assign( aircraft, { flights: [] } );
		});

		this.state = {
			date: new Date( new Date().setDate( today + 1 ) ).setHours( 0,0,0,0 ), // CURRENTLY ONLY SUPPORTS TOMORROW
			aircrafts: aircrafts,
			flights: Flights,
			selectedAircraft: aircrafts[ 0 ] // DEFAULT TO SELECT FIRST AIRCRAFT
		};
	}


	// =============================================================================================
	render() {

		const { date, aircrafts, flights, selectedAircraft } = this.state;

		// SORT BY EARLIEST DEPARTURE TIME
		flights.sort( ( a, b ) => a.departuretime - b.departuretime );

		const selectedFlights = selectedAircraft.flights;

		selectedFlights.sort( ( a, b ) => a.departuretime - b.departuretime );

		// GET FLIGHTS THAT HAVENT BEEN SELECTED BY ANY AIRCRAFT
		let unselectedFlights = flights.filter( flight => {
			return !selectedFlights.find( selectedFlight => flight.ident === selectedFlight.ident );
		} );

		// FILTER FLIGHTS INTO AN ARRAY WITH ONES THAT CAN BE SELECTED BASED ON ALREADY SELECTED FLIGHTS
		let selectableFlights = [];

		// FILTER UNSELECTED FLIGHTS BY WHICH ONES WILL BE AVAILABLE BASED ON WHATS ALREADY SELECTED
		if ( selectedFlights.length ) {

				// LOOP THROUGH UNSELECTED FLIGHTS TO FIND ONES THAT COULD BE SELECTED
				unselectedFlights.forEach( flight => {

					// IF WE ALREADY MARKED THIS FLIGHT AS SELECTABLE › DONT CONTINUE
					if ( selectableFlights.find( selectable => flight.ident === selectable.ident ) ) return;

					selectedFlights.forEach( ( selectedFlight, index ) => {

						// CHECK INITIAL AVAILABILITY
						let available = this.flightAvailability( flight, selectedFlight );

						// IF THIS FLIGHT IS AVAILABLE › CHECK WE DONT CONFLICT WITH A PREVIOUS FLIGHT
						if ( available && index > 0 )
							available = this.flightAvailability( flight, selectedFlights[ index - 1 ] );

						// CHECK AGAINST NEXT
						else if ( available && index < selectedFlights.length - 1 )
							available = this.flightAvailability( flight, selectedFlights[ index + 1 ] );

						// IF STILL AVAILABLE › PUSH TO SELECTABLE ARRAY
						if ( available ) selectableFlights.push( flight );
					});
				});

		// IF NO SELECTED FLIGHTS › WE CAN SELECT ANY THAT ARENT SELECTED YET
		} else selectableFlights = unselectedFlights;

		return <div className="flight-controller-container">

			<p className="flight-controller-container__date">{ new Date( date ).formatDate() }</p>

			<div className="flight-controller">

				<AircraftsView
					aircrafts={ aircrafts }
					selected={ selectedAircraft }
					changeAircraft={ changedAircraft => { this.changeAircraft( changedAircraft ) } }
				/>

				<AircraftsRotationView
					selectedAircraft={ selectedAircraft }
					flights={ selectedAircraft.flights }
					removeFlight={ selectedFlight => { this.updateFlights( selectedFlight ) } }
				/>

				<FlightsView
					flights={ selectableFlights }
					selectFlight={ selectedFlight => { this.updateFlights( selectedFlight ) } }
				/>

			</div>
		</div>;
	}


	// =============================================================================================
	changeAircraft( id ) {

		const aircraft = this.state.aircrafts.find( aircraft => {
			return aircraft.ident === id;
		});

		this.setState( prevState => ({
			selectedAircraft: aircraft
		}) );
	}


	// =============================================================================================
	updateFlights( id ) {

		let { selectedAircraft } = this.state;

		let flights = selectedAircraft.flights;

		// AIRCRAFT DIDNT HAVE THIS FLIGHT YET › ADD IT
		if ( flights.indexOf( id ) < 0 ) flights.push( id );

		// ELSE › AIRCRAFT ALREADY HAD THIS FLIGHT SELECTED › REMOVE IT
		else flights.splice( flights.indexOf( id ), 1 );

		// IMMUTABLY UPDATE AIRCRAFT
		selectedAircraft = { ...selectedAircraft, flights: flights };


	flightAvailability( flight, selectedFlight ) {

		const roundTrip = selectedFlight.origin === flight.destination && selectedFlight.destination === flight.origin,
			  timeBeforeDeparture = ( flight.arrivaltime + ( 60 * 40 ) < selectedFlight.departuretime ),
			  timeAfterArrival = ( selectedFlight.arrivaltime + ( 60 * 40 ) < flight.departuretime );

		// IF WE HAVE A ROUND TRIP › CHECK AGAINST ARRIVAL OR DEPARTURE TIME
		if ( roundTrip ) return timeBeforeDeparture || timeAfterArrival;

		// IF FLIGHT IS LANDING AT ORIGIN OF SELECTED FLIGHT › CHECK WE HAVE TIME TO FLY BEFORE SELECTED FLIGHT DEPARTURE
		else if ( selectedFlight.origin === flight.destination )
			return timeBeforeDeparture;

		// ELSE IF SELECTED FLIGHT WILL LAND AT ORIGIN OF THIS FLIGHT › CHECK THE FLIGHT DEPARTS AFTER WE LAND
		else if ( selectedFlight.destination === flight.origin )
			return timeAfterArrival;

		return false;
	}
}

export default App;