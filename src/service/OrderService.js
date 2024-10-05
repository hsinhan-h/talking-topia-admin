import { getAllOrders, updateOrder } from '@/api/index';

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
    updateOrder() {
        return new Promise((resolve, reject) => {
            updateOrder()
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
