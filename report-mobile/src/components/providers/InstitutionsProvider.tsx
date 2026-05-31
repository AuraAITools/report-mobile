import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "./AuthProvider";
import Authorization from "./Authorization";
import { useGetInstitutionsByIds } from "@/features/institutions";
import type { GetInstitutionsByIdsQuery } from "@/generated/graphql/graphql";

type Institution = GetInstitutionsByIdsQuery["getInstitutionsByIds"][number];

type InstitutionsContextValue = {
  institutions: Institution[];
  currentInstitution: Institution | undefined;
  roles: string[];
  currentRoles: string[];
  changeCurrentInstitution: (institution: Institution) => void;
  refetchContext: () => void;
};

const InstitutionsContext = createContext<InstitutionsContextValue | undefined>(
  undefined,
);

export function InstitutionsProvider(props: PropsWithChildren) {
  const { isAuthenticated, tenant_ids, roles } = useAuth();

  const [currentInstitution, setCurrentInstitution] = useState<
    Institution | undefined
  >(undefined);
  const [currentRoles, setCurrentRoles] = useState<string[]>([]);

  const { data: institutions = [], refetch: refetchInstitutions } =
    useGetInstitutionsByIds(tenant_ids);

  useEffect(() => {
    if (!currentInstitution && institutions.length > 0) {
      setCurrentInstitution(institutions[0]);
    }
  }, [institutions, currentInstitution]);

  useEffect(() => {
    if (!currentInstitution) {
      setCurrentRoles([]);
      return;
    }
    const prefix = `${currentInstitution.id}_`;
    const next = roles
      .filter((r) => r.startsWith(prefix))
      .map((r) => r.substring(prefix.length));
    setCurrentRoles(next);
  }, [currentInstitution, roles]);

  if (!isAuthenticated) {
    return <Authorization>{props.children}</Authorization>;
  }

  if (tenant_ids.length === 0) {
    throw new Error("No institutions assigned to user");
  }

  return (
    <InstitutionsContext.Provider
      value={{
        institutions,
        currentInstitution,
        roles,
        currentRoles,
        changeCurrentInstitution: setCurrentInstitution,
        refetchContext: () => {
          refetchInstitutions();
        },
      }}
    >
      {props.children}
    </InstitutionsContext.Provider>
  );
}

export function useInstitutionsContext() {
  const context = useContext(InstitutionsContext);
  if (!context) {
    throw new Error(
      "useInstitutionsContext must be used within InstitutionsProvider",
    );
  }
  return context;
}
