export function queryKeyFactory(resourceKeyName: string) {
  let resourceQueryKeys = {
    all: [resourceKeyName] as const,
    lists: () => [resourceQueryKeys.all, "list"], // global scoped cache
    // institution scoped cache
    institutionLists: (institutionId?: string) => [
      institutionId,
      ...resourceQueryKeys.lists(),
    ],
    outletLists: (institutionId?: string, outletId?: string) => [
      // outlet scoped cache
      institutionId,
      outletId,
      ...resourceQueryKeys.lists(),
    ],
    details: () => [...resourceQueryKeys.all, "detail"] as const,
    detail: (id: string) => [...resourceQueryKeys.details(), id] as const,

    // --- Website-aligned scoped helpers (used by GraphQL hooks) ---
    institutionScopedList: (institutionId: string | undefined) => [
      "institutions",
      institutionId,
      resourceKeyName,
      "list",
    ],
    institutionScopedById: (
      institutionId: string | undefined,
      resourceId: string | undefined,
    ) => ["institutions", institutionId, resourceKeyName, resourceId],
    outletScopedList: (
      institutionId: string | undefined,
      outletId: string | undefined,
    ) => [
      "institutions",
      institutionId,
      "outlets",
      outletId,
      resourceKeyName,
      "list",
    ],
    outletScopedById: (
      institutionId: string | undefined,
      outletId: string | undefined,
      resourceId: string | undefined,
    ) => [
      "institutions",
      institutionId,
      "outlets",
      outletId,
      resourceKeyName,
      resourceId,
    ],
  };
  return resourceQueryKeys;
}
