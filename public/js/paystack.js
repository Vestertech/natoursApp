/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export default async tourId => {
  try {
    const session = await axios.get(
      `/api/v1/bookings/checkout-session/${tourId}`
    );
    if (session.data.status === 'success') {
      window.location.replace(session.data.transaction.data.authorization_url);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
