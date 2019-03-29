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
		}
	}


	// =============================================================================================
	render() {

		const { date, aircrafts, flights, selectedAircraft } = this.state;

		// GET FLIGHTS THAT HAVE BEEN SELECTED BY THIS CURRENT AIRCRAFT
		const selectedFlights = flights.filter( flight => {
			return selectedAircraft.flights.indexOf( flight.ident ) > -1;
		} );

		// GET FLIGHTS THAT HAVENT BEEN SELECTED BY ANY AIRCRAFT
		// NOTE: GUESSING HERE THAT THE FLIGHTS ARE ALL AVAILABLE FLIGHTS AND NOT ONES SPECIFICALLY AVAILABLE TO THIS FLIGHT
		const unselectedFlights = flights.filter( flight => {
			return !aircrafts.find( aircraft => aircraft.flights.indexOf( flight.ident ) > -1 );
		} );

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
					flights={ selectedFlights }
				/>

				<FlightsView
					flights={ unselectedFlights }
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
}

export default App;