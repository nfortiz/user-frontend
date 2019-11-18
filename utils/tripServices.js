const expenses = {};

const getTrips = async () => {
    return await fetch('../mocks/expenses.json')
        .then(resp => resp.json())
        .then(data => {
            expenses.trips = data;
            return expenses.trips;
        });
    ;

};

const newTrip = (trip) => {
    return expenses.trips.push(trip)

};

export { getTrips, newTrip };