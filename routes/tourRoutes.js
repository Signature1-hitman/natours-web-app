const express = require('express');
const tourController = require('./../controllers/tourController');
const authController = require('./../controllers/authController');
// const reviewController=require('./../controllers/reviewController')
const reviewRouter= require('./../routes/reviewRoutes')
const router = express.Router();


// router.param('id', tourController.checkID);
router.use('/:tourId/reviews',reviewRouter)
router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(authController.protect,authController.restrictTo('admin','lead-guide','guides'),tourController.getMonthlyPlan);
router.route('/tours-within/:distance/center/:latlng/unit/:unit').get(tourController.getToursWithin)

router
  .route('/')
  .get(tourController.getAllTours)
  .post(authController.protect,authController.restrictTo('admin','lead-guide'), tourController.createTour);
  router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances)

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(authController.protect,authController.restrictTo('admin','lead-guide'), tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );
// router.route('/:tourId/reviews').post(
//   authController.protect,
//   authController.restrictTo('user'),
//   reviewController.createReview)
module.exports = router;
//https://www.google.com/maps/place/San+Francisco,+CA,+USA/@37.7317629,-122.447661,16z/data=!4m5!3m4!1s0x80859a6d00690021:0x4a501367f076adff!8m2!3d37.7749295!4d-122.4194155