import { deleteReview, getAllReviewData } from '@/api/index';


export const ReviewService ={
    getReviews(){
        return new Promise((resolve, reject) => {
            getAllReviewData()
                .then((response) => {
                    console.log(response.body); 
                    resolve(response.body);     
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },
    deleteReview(reviewId) {
        return new Promise((resolve, reject) => {
            deleteReview(reviewId)
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