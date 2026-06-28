import Reservation from "../models/Reservation.js";

const generateBookingId = async () => {

    const count = await Reservation.countDocuments();

    return `HY${1001 + count}`;

}

export default generateBookingId;