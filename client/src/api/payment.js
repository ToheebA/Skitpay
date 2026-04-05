import API from './axios'

export const initializePayment = (creatorProfileId) =>
    API.post(`/payments/initialize/${creatorProfileId}`)

export const verifyPayment = (reference) =>
    API.get(`/payments/verify/${reference}`)