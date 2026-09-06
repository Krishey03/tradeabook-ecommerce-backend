const axios = require("axios");
require('dotenv').config();

const baseUrl = process.env.KHALTI_GATEWAY_URL.endsWith('/')
  ? process.env.KHALTI_GATEWAY_URL.slice(0, -1)
  : process.env.KHALTI_GATEWAY_URL;

async function verifyKhaltiPayment(pidx) {
  const headersList = {
    "Authorization": `Key ${process.env.KHALTI_SECRET_KEY}`,
    "Content-Type": "application/json",
  };

  const bodyContent = JSON.stringify({ pidx });

  console.log("Making verification request with pidx:", pidx);
  console.log("Using URL:", `${baseUrl}/api/v2/epayment/lookup/`);

  const reqOptions = {
    url: `${baseUrl}/api/v2/epayment/lookup/`,
    method: "POST",
    headers: headersList,
    data: bodyContent,
    timeout: 10000,
  };

  try {
    const response = await axios.request(reqOptions);
    console.log("Full verification response:", JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.error("Error verifying Khalti payment:", error.response?.data || error.message);
    throw error;
  }
}

async function initializeKhaltiPayment(details) {
  console.log("Initializing Khalti payment with details:", details);
  const headersList = {
    "Authorization": `Key ${process.env.KHALTI_SECRET_KEY}`,
    "Content-Type": "application/json",
  };

  const payload = {
    ...details,
    purchase_order_id: details.purchase_order_id.toString(),
    purchase_order_name: details.purchase_order_name,
    amount: details.amount,
    return_url: details.return_url,
    website_url: details.website_url,
  };

  console.log("Initializing Khalti payment with payload:", JSON.stringify(payload, null, 2));

  const reqOptions = {
    url: `${baseUrl}/api/v2/epayment/initiate/`,
    method: "POST",
    headers: headersList,
    data: JSON.stringify(payload),
  };

  try {
    const response = await axios.request(reqOptions);
    console.log("Khalti initialization response:", JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.error("Error initializing Khalti payment:", error.response?.data || error.message);
    throw error;
  }
}

module.exports = { verifyKhaltiPayment, initializeKhaltiPayment };