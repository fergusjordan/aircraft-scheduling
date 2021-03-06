import React from 'react';

import '../styles/aircrafts.css';

// =================================================================================================
class Aircrafts extends React.Component {


	// =============================================================================================
	constructor( props ) {

		super( props );
	}


	// =============================================================================================
	render() {

		const { aircrafts, selected } = this.props;

		return <div className="aircrafts">

			<h1>Aircrafts</h1>

			<div className="aircrafts__list">

				{ aircrafts.map( ( aircraft ) => {

					const id = aircraft.ident;

					let coverage = 0;

					aircraft.flights.map( flight => {
						coverage = coverage + ( flight.arrivaltime - flight.departuretime + ( 40 * 60 ) );
					});

					// DIVIDE COVERAGE IN SECONDS BY DURATION OF DAY
					coverage /= 60 * 60 * 24;

					return (
						<div key={ id } data-aircraft={ id } className={ 'aircraft' + ( id === selected.ident ? ' aircraft_selected' : '' ) } onClick={ this.changeAircraft.bind( this ) }>
							<p>{ id }</p>
							<p>({ Math.round( coverage * 100 ).toString() }%)</p>
						</div>
					);

				} )}

			</div>

		</div>;
	}


	// =============================================================================================
	changeAircraft( e ) {

		const aircraft = e.currentTarget.dataset.aircraft;

		// DONT UPDATE IF SAME
		if ( aircraft === this.props.selected ) return false;

		// UPDATE PARENT STATE
		this.props.changeAircraft( aircraft );
	}
}

export default Aircrafts;