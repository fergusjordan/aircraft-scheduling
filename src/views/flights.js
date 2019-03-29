import React from 'react';

import '../styles/flights.css';

// =================================================================================================
class Flights extends React.Component {


	// =============================================================================================
	constructor( props ) {

		super( props );

		this.state = {
			flights: props.flights
		}
	}


	// =============================================================================================
	render() {

		const { flights } = this.state;

		// SORT BY EARLIEST DEPARTURE TIME
		flights.sort( ( a, b ) => a.departuretime - b.departuretime );

		return <div className="flights">

			<h1>Flights</h1>

			<div className="flights__list">

				{ flights.map( ( flight ) => {

					const id = flight.ident;

					return (
						<div key={ id } data-flight={ id } className="flight" onClick={ this.selectFlight.bind( this ) }>

							<div className="flight__header">
								<p>{ id }</p>
							</div>

							<div className="flight__details">

								<div className="flight__detail flight__detail_origin">
									<small>{ flight.origin }</small>
									<p>{ flight.readable_departure }</p>
								</div>

								<div className="flight__detail flight__detail_destination">
									<small>{ flight.destination }</small>
									<p>{ flight.readable_arrival }</p>
								</div>
							</div>
						</div>
					);

				} )}

			</div>

		</div>;
	}


	// =============================================================================================
	selectFlight() {


	}
}

export default Flights;