const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

router.use((req, res, next) => {
  const { alert } = req.query;
  if (alert === 'booking') {
    res.locals.alert =
      "Your booking was successful! Please check your email for a confirmation. If your booking doesn't show up here immediately, please come back later.";
  }
  next();
});

// router.get('/', (req, res) => {
//   res.status(200).render('overview', {
//     tour: 'The Forest Hiker',
//     user: 'Sylvester'
//   });
// });

router.get(
  '/',
  bookingController.createBookingCheckout,
  authController.isLoggedIn,
  viewsController.getOverview
);

router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get('/me', authController.protect, viewsController.getAccount);
router.get('/signup', authController.isLoggedIn, viewsController.getSignUpForm);
router.get('/myTours', authController.protect, viewsController.getMyTours);

// to be used when we update user withpout api
router.post(
  '/submit-user-data',
  authController.protect,
  viewsController.updateUserData
);

router.get('/tour/:slug', authController.isLoggedIn, viewsController.getTour);
module.exports = router;
