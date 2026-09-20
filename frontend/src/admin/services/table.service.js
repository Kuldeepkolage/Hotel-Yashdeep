import api from "./api.js";

const statusToApi = (status) => {
  const map = { available: "Available", reserved: "Reserved", occupied: "Occupied", maintenance: "Maintenance" };
  return map[status] || status;
};

const normalizeTable = (table) => {
  if (!table) return table;
  return {
    ...table,
    floor: table.floor || "Ground",
    section: table.section || table.location || "Indoor",
    status: String(table.status || "Available").toLowerCase(),
  };
};

const normalizePayload = (data = {}) => ({
  ...data,
  tableNumber: Number(data.tableNumber),
  capacity: Number(data.capacity),
  status: statusToApi(data.status),
  floor: data.floor,
  section: data.section,
  location: data.location || data.section || "Indoor",
});

const unwrap = (response) => response?.data?.data ?? response?.data ?? {};

export const tableService = {
  async getTables(params = {}) {
    const response = await api.get("/tables", { params });
    const payload = unwrap(response);
    return {
      ...payload,
      tables: (payload.tables || []).map(normalizeTable),
    };
  },

  async getStats() {
    const response = await api.get("/tables/stats");
    return unwrap(response);
  },

  async getTable(id) {
    const response = await api.get(`/tables/${id}`);
    const payload = unwrap(response);
    return { ...payload, ...(payload?._id ? normalizeTable(payload) : {}) };
  },

  async createTable(data) {
    const response = await api.post("/tables", normalizePayload(data));
    return normalizeTable(unwrap(response));
  },

  async updateTable(id, data) {
    const response = await api.put(`/tables/${id}`, normalizePayload(data));
    return normalizeTable(unwrap(response));
  },

  async deleteTable(id) {
    const response = await api.delete(`/tables/${id}`);
    return unwrap(response);
  },

  async updateTableStatus(id, status) {
    const response = await api.put(`/tables/${id}`, { status: statusToApi(status) });
    return normalizeTable(unwrap(response));
  },
};

export default tableService;
