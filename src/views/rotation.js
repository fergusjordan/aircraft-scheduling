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

		const { selectedAircraft, flights } = this.props,
			  dayDuration = 60 * 60 * 24;

		flights.sort( ( a, b ) => a.departuretime - b.departuretime );

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

			<div className="aircraft-timeline">

				<div className="aircraft-timeline__labels">
					<p>00:00</p>
					<p>12:00</p>
				</div>

				<div className="aircraft-timeline__track">

					{ flights.map( ( flight ) => {

						const id = flight.ident,
							  start = flight.departuretime / dayDuration,
							  end = ( flight.arrivaltime + ( 40 * 60 ) ) / dayDuration; // ADD 40 MINUTES TO END OF FLIGHT TO ACCOUNT FOR TURNAROUND

						return (
							<div key={ id } className="aircraft-timeline__track-block" style={ {
								left: start * 100 + '%',
								width: ( end * 100 ) - ( start * 100 ) + '%'
							} }>
								{/* ADD A BLOCK FOR TURNAROUND THAT LASTS 40 MINUTES */}
								<div className="aircraft-timeline__track-turnaround" style={ {
									width: ( ( 40 * 60 / dayDuration ) / ( end - start ) * 100 ) + '%'
								} } />
							</div>
						);

					} )}

				</div>

			</div>

		</div>;
	}


	removeFlight( e ) {

		const flight = e.currentTarget.dataset.flight;

		this.props.removeFlight( flight );
	}
}

export default AircraftRotation;