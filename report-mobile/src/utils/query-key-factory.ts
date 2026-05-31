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
  };
  return resourceQueryKeys;
}
