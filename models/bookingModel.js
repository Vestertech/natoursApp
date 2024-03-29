const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      required: [true, 'Booking must have a bookingId'],
      unique: true
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Booking must belong to a tour']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Booking must belong to a user']
    },
    price: {
      type: Number,
      required: [true, 'Booking must have a price']
    },
    paid: {
      type: Boolean,
      default: true
    },
    tourDate: {
      type: Date,
      required: [true, 'Booking must have a date']
    },
    paidAt: {
      type: Date,
      required: [true, 'Booking must have a paidAt date']
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true
  }
);

bookingSchema.pre('/^find/', function(next) {
  this.populate('user').populate({
    path: 'user',
    select: 'name email '
  });
  return next();
});

const bookings = mongoose.model('Booking', bookingSchema);

module.exports = bookings;
