import { getDashboardData } from '@/api/index';
export const DashboardService = {
    getData() {
        return new Promise((resolve, reject) => {
            getDashboardData()
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
