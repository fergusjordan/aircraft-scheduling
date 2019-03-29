import React from 'react';

import '../styles/rotation.css';

// =================================================================================================
class AircraftRotation extends React.Component {


	// =============================================================================================
	constructor( props ) {

		super( props );
	}


	// =============================================================================================
	render() {

		const { selectedAircraft, flights } = this.props;

		return <div className="aircraft-rotation">

			<div className="aircraft-rotation__header">

				<h1>Rotation { selectedAircraft.ident }</h1>

			</div>

			<div className="aircraft-rotation__flights">

				{ flights.map( ( flight ) => {

					const id = flight.ident;

					return (
						<div key={ id } data-flight={ id } className="flight" onClick={ this.removeFlight.bind( this ) }>

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


	removeFlight( e ) {

		const flight = e.currentTarget.dataset.flight;

		this.props.selectFlight( flight );
	}
}

export default AircraftRotation;