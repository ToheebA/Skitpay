import API from './axios'

export const getAllCreators = (params) => 
    API.get('/creators', { params })

export const getAllSkits = (params) =>
    API.get('/skits', { params })

export const getSkit = (skitId) => 
    API.get(`/skits/${skitId}`)

export const likeSkit = (skitId) =>
    API.post(`/skits/${skitId}/like`)

export const getSubscriptions = (params) =>
    API.get('/subscriptions', { params })

export const activateSubscription = (creatorProfileId) => 
    API.post(`/subscriptions/${creatorProfileId}`)

export const cancelSubscription = (subscriptionId) =>
    API.delete(`/subscriptions/${subscriptionId}`)