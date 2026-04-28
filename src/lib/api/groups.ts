import { apiClient } from "./client";
import {
  Group, GroupSchema,
  GroupsListResponse, GroupsListResponseSchema,
  CreateGroupPayload, UpdateGroupPayload,
} from "./types";

export interface FetchGroupsParams {
  searchQuery?: string;
  orderBy?:     "asc" | "desc";
}

export const groupsApi = {
  // GET /groups/?searchQuery=&orderBy=
  fetchAll: async (params: FetchGroupsParams = {}): Promise<GroupsListResponse> => {
    const { data } = await apiClient.get("/groups/", { params });
    return GroupsListResponseSchema.parse(data);
  },

  // POST /groups/  { name }
  create: async (payload: CreateGroupPayload): Promise<Group> => {
    const { data } = await apiClient.post("/groups/", payload);
    return GroupSchema.parse(data);
  },

  // GET /groups/:id
  fetchOne: async (id: string): Promise<Group> => {
    const { data } = await apiClient.get(`/groups/${id}`);
    return GroupSchema.parse(data);
  },

  // PATCH /groups/:id  { name }
  update: async (id: string, payload: UpdateGroupPayload): Promise<Group> => {
    const { data } = await apiClient.patch(`/groups/${id}`, payload);
    return GroupSchema.parse(data);
  },

  // DELETE /groups/:id
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/groups/${id}`);
  },
};
