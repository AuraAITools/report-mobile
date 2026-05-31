import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAuth } from "./AuthProvider";
import Authorization from "./Authorization";
import { useGetInstitutionsByIds } from "@/features/institutions";
import {
  OutletWithInstitution,
  useGetAllOutletsAcrossInstitutions,
} from "@/features/outlets";
import type { GetInstitutionsByIdsQuery } from "@/generated/graphql/graphql";

type Institution = GetInstitutionsByIdsQuery["getInstitutionsByIds"][number];

type InstitutionAndOutletContextValue = {
  institutions: Institution[];
  outlets: OutletWithInstitution[];
  currentInstitution: Institution | undefined;
  currentOutlets: OutletWithInstitution[];
  currentOutlet: OutletWithInstitution | undefined;
  roles: string[];
  currentRoles: string[];
  changeCurrentInstitution: (institution: Institution) => void;
  changeCurrentOutlet: (outlet: OutletWithInstitution) => void;
  refetchContext: () => void;
};

const InstitutionAndOutletContext = createContext<
  InstitutionAndOutletContextValue | undefined
>(undefined);

export function InstitutionsAndOutletsProvider(props: PropsWithChildren) {
  const { isAuthenticated, tenant_ids, roles } = useAuth();

  const [currentInstitution, setCurrentInstitution] = useState<
    Institution | undefined
  >(undefined);
  const [currentOutlet, setCurrentOutlet] = useState<
    OutletWithInstitution | undefined
  >(undefined);
  const [currentRoles, setCurrentRoles] = useState<string[]>([]);

  const {
    data: institutions = [],
    refetch: refetchInstitutions,
  } = useGetInstitutionsByIds(tenant_ids);

  const { data: outlets = [] } = useGetAllOutletsAcrossInstitutions(tenant_ids);

  useEffect(() => {
    if (!currentInstitution && institutions.length > 0) {
      setCurrentInstitution(institutions[0]);
    }
  }, [institutions, currentInstitution]);

  useEffect(() => {
    if (!currentInstitution) return;
    const firstOutletInInstitution = outlets.find(
      (o) => o.institutionId === currentInstitution.id,
    );
    if (firstOutletInInstitution && !currentOutlet) {
      setCurrentOutlet(firstOutletInInstitution);
    }
  }, [currentInstitution, outlets, currentOutlet]);

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

  const currentOutlets = useMemo(
    () =>
      currentInstitution
        ? outlets.filter((o) => o.institutionId === currentInstitution.id)
        : [],
    [currentInstitution, outlets],
  );

  if (!isAuthenticated) {
    // Authorization renders the "Session Expired" screen when unauthenticated.
    return <Authorization>{props.children}</Authorization>;
  }

  if (tenant_ids.length === 0) {
    throw new Error("No institutions assigned to user");
  }

  return (
    <InstitutionAndOutletContext.Provider
      value={{
        institutions,
        outlets,
        currentInstitution,
        currentOutlets,
        currentOutlet,
        roles,
        currentRoles,
        changeCurrentInstitution: setCurrentInstitution,
        changeCurrentOutlet: setCurrentOutlet,
        refetchContext: () => {
          refetchInstitutions();
        },
      }}
    >
      {props.children}
    </InstitutionAndOutletContext.Provider>
  );
}

export function useInstitutionAndOutletsContext() {
  const context = useContext(InstitutionAndOutletContext);
  if (!context) {
    throw new Error(
      "useInstitutionAndOutletsContext must be used within InstitutionsAndOutletsProvider",
    );
  }
  return context;
}
