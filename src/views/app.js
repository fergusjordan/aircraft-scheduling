import React from 'react';
import AircraftsRotationView from './rotation';
import AircraftsView from './aircrafts';
import FlightsView from './flights';


import Aircrafts from '../aircrafts.json';
import Flights from '../flights.json';

// TODO: FETCH FROM API
import Axios from '../../node_modules/axios/dist/axios.min';

import '../styles/app.css';

// =================================================================================================
class App extends React.Component {


	// =============================================================================================
	constructor( props ) {

		super( props );

		this.state = {
			aircrafts: Aircrafts,
			flights: Flights,
			selectedAircraft: Aircrafts[ 0 ] // DEFAULT TO SELECT FIRST AIRCRAFT
		}
	}


	// =============================================================================================
	render() {
		
		return <div className="flight-controller">

			<AircraftsView />

			<AircraftsRotationView />

			<FlightsView />

		</div>;
	}
}

export default App;