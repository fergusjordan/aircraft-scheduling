// GET MONTH NAME FROM DATE
const getMonthName = function( month ) {

	const months = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];

	return months[ month ];
};


// SHAMELESSLY LIFTED FROM https://community.shopify.com/c/Shopify-Design/Ordinal-Number-in-javascript-1st-2nd-3rd-4th/m-p/72156
const getNumberWithOrdinal = function( n ) {
	var s=[ 'th', 'st', 'nd', 'rd' ],
		v = n % 100;

	return n + ( s [ (v - 20 ) % 10 ] || s[ v ] || s[ 0 ] );
};

Date.prototype.formatDate = function() {

	let day = this.getDate(),
		month = this.getMonth(),
		year = this.getFullYear();

	return getNumberWithOrdinal( day ) + ' ' + getMonthName( month ) + ' ' + year;
};