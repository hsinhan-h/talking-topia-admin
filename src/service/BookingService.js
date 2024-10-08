import { deleteBookingItem, getAllBookings, updateBookingItem } from '@/api/index';

export const BookingService = {
    getBookings() {
        return new Promise((resolve, reject) => {
            getAllBookings()
                .then((data) => {
                    console.log(data);
                    resolve(data.body);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },
    updateBooking(bookingID, bookingDate, bookingTime) {
        return new Promise((resolve, reject) => {
            updateBookingItem(bookingID, bookingDate, bookingTime)
                .then((data) => {
                    console.log(data);
                    resolve(data.body);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },
    deleteBooking(bookingID) {
        return new Promise((resolve, reject) => {
            deleteBookingItem(bookingID)
                .then((data) => {
                    console.log(data);
                    resolve(data.body);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }
};
