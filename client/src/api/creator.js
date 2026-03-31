import API from './axios'

export const getCreatorProfile = () => 
    API.get('/creator/profile')

export const createProfile = (profileData) =>
    API.post('/creator/profile', profileData)

export const updateCreatorProfile = (profileData) =>
    API.patch('/creator/profile', profileData)

export const deactivateProfile = () => 
    API.delete('/creator/profile')

export const reactivateProfile = () =>
    API.patch('/creator/profile/reactivate')

export const getCreatorSkits = () => 
    API.get('/creator/skits')

export const uploadSkit = (formData, onUploadProgress) =>
    API.post('/creator/skits', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 120000,
        onUploadProgress
    })

export const updateSkit = (skitId, formData, onUploadProgress) => 
    API.patch(`/creator/skits/${skitId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 120000,
        onUploadProgress
    })

export const deleteSkit = (skitId) =>
    API.delete(`/creator/skits/${skitId}`)

export const getCreatorStats = () => 
    API.get('/creator/stats')