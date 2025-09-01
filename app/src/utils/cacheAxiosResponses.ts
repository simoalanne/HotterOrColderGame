import { setupCache } from 'axios-cache-interceptor';
import axios from 'axios';

// this modifies the axios instance to cache responses for 15 minutes. 15 minutes is a good base value as the weather api updates every 15 minutes.
setupCache(axios, {
  ttl: 1000 * 60 * 15,
});
