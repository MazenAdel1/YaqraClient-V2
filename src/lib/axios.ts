import ax from "axios";

export const axios = ax.create({
  baseURL: `${process.env.SERVER_URL}/api`,
  timeout: 5000,
});
