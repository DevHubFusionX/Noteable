import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { groupsApi, FetchGroupsParams } from "@/lib/api/groups";
import { queryKeys } from "@/lib/api/queryKeys";
import { useUiStore } from "@/lib/stores/uiStore";
import { CreateGroupPayload, UpdateGroupPayload } from "@/lib/api/types";

export const useGroups = (params: FetchGroupsParams = {}) =>
  useQuery({
    queryKey:  queryKeys.groups.list(params),
    queryFn:   () => groupsApi.fetchAll(params),
    staleTime: 10 * 60_000,
  });

export const useGroup = (id: string | null) =>
  useQuery({
    queryKey:  queryKeys.groups.detail(id ?? ""),
    queryFn:   () => groupsApi.fetchOne(id!),
    enabled:   !!id,
    staleTime: 10 * 60_000,
  });

export const useCreateGroup = () => {
  const qc            = useQueryClient();
  const { showToast } = useUiStore();

  return useMutation({
    mutationFn: (payload: CreateGroupPayload) => groupsApi.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["groups"], exact: false });
      showToast("Group created", "success");
    },
    onError: (err: Error) => showToast(err.message, "error"),
  });
};

export const useUpdateGroup = () => {
  const qc            = useQueryClient();
  const { showToast } = useUiStore();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateGroupPayload }) =>
      groupsApi.update(id, payload),
    onSuccess: (group) => {
      qc.setQueryData(queryKeys.groups.detail(group.id), group);
      qc.invalidateQueries({ queryKey: ["groups"], exact: false });
      showToast("Group updated", "success");
    },
    onError: (err: Error) => showToast(err.message, "error"),
  });
};

export const useDeleteGroup = () => {
  const qc            = useQueryClient();
  const { showToast } = useUiStore();

  return useMutation({
    mutationFn: (id: string) => groupsApi.delete(id),
    onSuccess: (_, id) => {
      qc.removeQueries({ queryKey: queryKeys.groups.detail(id) });
      qc.invalidateQueries({ queryKey: ["groups"], exact: false });
      qc.invalidateQueries({ queryKey: ["notes"], exact: false });
      showToast("Group deleted", "info");
    },
    onError: (err: Error) => showToast(err.message, "error"),
  });
};
