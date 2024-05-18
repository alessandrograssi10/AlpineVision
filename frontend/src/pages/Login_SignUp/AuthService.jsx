
const AuthServices = {
  isLoggedIn: () => {
    const token = localStorage.getItem('token');
    return !!token;
  },

  redirectIfNotLoggedIn() {
    if (!this.isLoggedIn()) {
      window.location.href = '/login'; 
    }
  },

  dologout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('emailUser');
    window.location.href = '/';
  }
};

export default AuthServices;
