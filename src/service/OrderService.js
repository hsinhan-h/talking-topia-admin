import { getAllOrders, updateOrderItem } from '@/api/index';

export const OrderService = {
    getOrders() {
        return new Promise((resolve, reject) => {
            getAllOrders()
                .then((data) => {
                    console.log(data);
                    resolve(data.body);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },
    updateOrder(orderID, orderStatusId) {
        return new Promise((resolve, reject) => {
            updateOrderItem(orderID, orderStatusId)
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
