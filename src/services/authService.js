// src/services/authService.js
import api from "./api";

const authService = {
  register: async (name, email, password) => {
    try {
      const response = await api.post("/users", {
        name,
        email,
        password,
        isVerified: true,
      });
      return response.data;
    } catch (error) {
      console.error(
        "Register failed:",
        error.response?.data || error.message,
        error
      );
      const message =
        error.response?.data?.message || "Terjadi kesalahan saat pendaftaran.";
      throw new Error(message);
    }
  },

  // Login pengguna
  login: async (email, password) => {
    try {
      const response = await api.get(
        `/users?email=${email}&password=${password}`
      );
      const user = response.data[0];

      if (user) {
        const token = `dummy_jwt_token_for_user_id_${user.id}_${Date.now()}`;
        localStorage.setItem("token", token);
        localStorage.setItem("userId", user.id);
        return { ...user, id: user.id };
      } else {
        throw new Error("Email atau password salah.");
      }
    } catch (error) {
      console.error(
        "Login failed:",
        error.response?.data || error.message,
        error
      );
      const message =
        error.response?.data?.message || "Email atau password salah.";
      throw new Error(message);
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
  },

  getCurrentUser: async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) return null;

    try {
      const response = await api.get(`/users/${userId}`);
      const user = response.data;
      return {
        ...user,
        id: user.id,
        isVerified: user.isVerified !== undefined ? user.isVerified : true,
      };
    } catch (error) {
      console.error(
        "Failed to get current user:",
        error.response?.data || error.message,
        error
      );
      return null;
    }
  },

  changePassword: async (currentPassword, newPassword) => {
    try {
      console.log("Mock change password:", currentPassword, "->", newPassword);
      await new Promise((res) => setTimeout(res, 500));
      return { message: "Password berhasil diperbarui (mock)." };
    } catch (error) {
      console.error("Change password failed (mock):", error);
      throw new Error("Gagal memperbarui password (mock).");
    }
  },

  getTransactions: async (userId, typeFilter = null) => {
    try {
      let url = `/transactions?userId=${userId}&_expand=party`;
      if (typeFilter) {
        url += `&type=${typeFilter}`;
      }
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error("Error fetching transactions:", error);
      throw new Error("Gagal mengambil data transaksi.");
    }
  },

  addTransaction: async (data) => {
    try {
      console.log("Data yang dikirim ke server:", data);
      const response = await api.post("/transactions", data);
      return response.data;
    } catch (error) {
      console.error("Error adding transaction:", error);
      throw new Error("Gagal menambahkan transaksi.");
    }
  },

  updateTransaction: async (id, data) => {
    try {
      const response = await api.put(`/transactions/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating transaction:", error);
      throw new Error("Gagal memperbarui transaksi.");
    }
  },

  deleteTransaction: async (id) => {
    try {
      await api.delete(`/transactions/${id}`);
      return { message: "Transaksi berhasil dihapus." };
    } catch (error) {
      console.error("Error deleting transaction:", error);
      throw new Error("Gagal menghapus transaksi.");
    }
  },
  getDebts: async (userId) => {
    return authService.getTransactions(userId, "debt");
  },

  getReceivables: async (userId) => {
    return authService.getTransactions(userId, "receivable");
  },
  addDebt: async (data) => {
    return authService.addTransaction({ ...data, type: "debt" });
  },

  addReceivable: async (data) => {
    return authService.addTransaction({ ...data, type: "receivable" });
  },

  updateDebt: async (id, data) => {
    return authService.updateTransaction(id, { ...data, type: "debt" });
  },

  updateReceivable: async (id, data) => {
    return authService.updateTransaction(id, { ...data, type: "receivable" });
  },

  deleteDebt: async (id) => {
    return authService.deleteTransaction(id);
  },

  deleteReceivable: async (id) => {
    return authService.deleteTransaction(id);
  },
};

export default authService;
