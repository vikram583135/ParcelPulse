import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
});

// Auth
export const login = (data) => api.post('/auth/login', data);
export const register = (data) => api.post('/auth/register', data);
export const getUsers = () => api.get('/users');
export const getUsersByRole = (role) => api.get(`/users/role/${role}`);

// Campaigns
export const createCampaign = (data) => api.post('/campaigns', data);
export const getCampaigns = () => api.get('/campaigns');
export const getCampaign = (id) => api.get(`/campaigns/${id}`);
export const getCampaignsByAdvertiser = (id) => api.get(`/campaigns/advertiser/${id}`);
export const activateCampaign = (id) => api.put(`/campaigns/${id}/activate`);
export const getCampaignDashboard = (id) => api.get(`/campaigns/${id}/dashboard`);

// Stickers
export const generateStickers = (data) => api.post('/stickers/generate', data);
export const issueStickersToAgent = (data) => api.post('/stickers/issue-to-agent', data);
export const assignStickersToRider = (data) => api.post('/stickers/assign-to-rider', data);
export const getStickersByCampaign = (id) => api.get(`/stickers/campaign/${id}`);
export const getStickersByAgent = (id) => api.get(`/stickers/agent/${id}`);
export const getAgentAvailableStickers = (id) => api.get(`/stickers/agent/${id}/available`);
export const getStickersByRider = (id) => api.get(`/stickers/rider/${id}`);
export const getRiderAvailableStickers = (id) => api.get(`/stickers/rider/${id}/available`);
export const getSticker = (id) => api.get(`/stickers/${id}`);
export const markStickerDamaged = (id) => api.put(`/stickers/${id}/damaged`);

// Placements
export const startPlacement = (formData) => api.post('/placements/start', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const endPlacement = (id, formData) => api.post(`/placements/${id}/end`, formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const getPlacementsByRider = (id) => api.get(`/placements/rider/${id}`);
export const getPlacementsByCampaign = (id) => api.get(`/placements/campaign/${id}`);
export const getPlacement = (id) => api.get(`/placements/${id}`);
export const getPlacementEvidence = (id) => api.get(`/placements/${id}/evidence`);

// Verification
export const getVerificationByPlacement = (id) => api.get(`/verifications/placement/${id}`);
export const getReviewRequired = () => api.get('/verifications/review-required');
export const adminDecision = (id, data) => api.put(`/verifications/${id}/decide`, data);

// Rewards
export const getRiderRewards = (id) => api.get(`/rewards/rider/${id}`);
export const getRiderRewardSummary = (id) => api.get(`/rewards/rider/${id}/summary`);
export const getCampaignRewardSummary = (id) => api.get(`/rewards/campaign/${id}`);

// Admin
export const getAdminDashboard = () => api.get('/admin/dashboard');
export const getAdminCampaigns = () => api.get('/admin/campaigns');
export const getAdminStickersOverview = () => api.get('/admin/stickers/overview');
export const getAdminRidersOverview = () => api.get('/admin/riders/overview');
export const getAuditLog = () => api.get('/admin/audit-log');

export default api;
