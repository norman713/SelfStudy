import axiosInstance from "./axiosConfig";

const userApi = {
  getUserInfo(userId: string) {
    let url = "/users/" + userId

    return axiosInstance.get(url);
  },
  updateUserInfo(userId: string, userData: { username: string; dateOfBirth: string; gender: string }) {
    let url = "/users/" + userId;

    // Send a PATCH request to update user info
    return axiosInstance.patch(url, userData);
  },

  login(email: string, password: string) {
    const url = "/api/auth/cred";
    const body = { email, password };
    return axiosInstance.post(url, body);
  },


}
export default userApi;