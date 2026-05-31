import { createContext, PropsWithChildren, useContext, useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import { useAuth } from "./AuthProvider";
import { useInstitutionsContext } from "./InstitutionsProvider";
import Authorization from "./Authorization";
import { accountKeys, GetAccountByUserIdDocument } from "@/features/account";
import { graphqlClient } from "@/lib/graphql-client";
import type { GetAccountByUserIdQuery } from "@/generated/graphql/graphql";

type Account = GetAccountByUserIdQuery["getAccountByUserId"];

type AccountContextValue = {
  accounts: Account[];
  accountsByInstitutionId: Record<string, Account>;
  currentAccount: Account | undefined;
  isLoading: boolean;
  isError: boolean;
  refetchAccounts: () => void;
};

const AccountContext = createContext<AccountContextValue | undefined>(undefined);

export function AccountProvider(props: PropsWithChildren) {
  const { isAuthenticated, tenant_ids, userInfo } = useAuth();
  const { currentInstitution } = useInstitutionsContext();
  const userId = userInfo?.sub;

  const queries = useQueries({
    queries: tenant_ids.map((institutionId) => ({
      queryKey: userId
        ? accountKeys.byUserAndInstitution(institutionId, userId)
        : accountKeys.all,
      queryFn: ({ signal }: { signal: AbortSignal }) =>
        graphqlClient(
          GetAccountByUserIdDocument,
          { institutionId, userId: userId! },
          signal,
        ),
      enabled: !!userId,
      select: (data: GetAccountByUserIdQuery) => data.getAccountByUserId,
    })),
  });

  const { accounts, accountsByInstitutionId } = useMemo(() => {
    const byId: Record<string, Account> = {};
    const list: Account[] = [];
    queries.forEach((q, idx) => {
      if (q.data) {
        const institutionId = tenant_ids[idx];
        byId[institutionId] = q.data;
        list.push(q.data);
      }
    });
    return { accounts: list, accountsByInstitutionId: byId };
  }, [queries, tenant_ids]);

  const currentAccount = currentInstitution
    ? accountsByInstitutionId[currentInstitution.id]
    : undefined;

  const isLoading = queries.some((q) => q.isLoading);
  const isError = queries.some((q) => q.isError);

  const refetchAccounts = () => {
    queries.forEach((q) => q.refetch());
  };

  if (!isAuthenticated) {
    return <Authorization>{props.children}</Authorization>;
  }

  return (
    <AccountContext.Provider
      value={{
        accounts,
        accountsByInstitutionId,
        currentAccount,
        isLoading,
        isError,
        refetchAccounts,
      }}
    >
      {props.children}
    </AccountContext.Provider>
  );
}

export function useAccountContext() {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error("useAccountContext must be used within AccountProvider");
  }
  return context;
}
