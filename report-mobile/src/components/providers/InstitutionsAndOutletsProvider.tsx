"use client";
import { InstitutionsApi } from "@/lib/hooks/institutions-queries";
import { OutletsApis } from "@/lib/hooks/outlets-queries";
import { BaseInstitution } from "@/types/data/Institution";
import { BaseOutlet } from "@/types/data/Outlet";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { UnauthenticatedScreen } from "./Authorization";
import { useAuth } from "./AuthProvider";
type BaseOutletContext = BaseOutlet & { institution_id: string };

type StatusType = "pending" | "success" | "error";
type InstitutionAndOutletContext = {
  institutions: BaseInstitution[];
  outlets: BaseOutletContext[];
  currentInstitution: BaseInstitution | undefined;
  currentOutlets: BaseOutletContext[];
  currentOutlet: BaseOutletContext | undefined;
  roles: string[];
  currentRoles: string[];
  changeCurrentInstitution: (institution: BaseInstitution) => void;
  changeCurrentOutlet: (outlet: BaseOutletContext) => void;
  refetchContext: () => void;
};

const InstitutionAndOutletContext = createContext<
  InstitutionAndOutletContext | undefined
>(undefined);

export function InstitutionsAndOutletsProvider(props: PropsWithChildren) {
  const { session } = useAuth();
  const [currentInstitution, setCurrentInstitution] = useState<
    BaseInstitution | undefined
  >(undefined);
  const [currentOutlet, setCurrentOutlet] = useState<
    BaseOutletContext | undefined
  >(undefined);
  const [currentRoles, setCurrentRoles] = useState<string[] | undefined>();

  if (!session) {
    console.error("no session");
    return <UnauthenticatedScreen />;
  }

  // get institutions
  const {
    data: institutions = [],
    isError: fetchInstitutionError,
    isPending: fetchInstitutionIsPending,
    refetch: refetchInstitutions,
  } = InstitutionsApi.useGetInstitutionByIds(session.user.ext_attrs.tenant_ids);

  // get outlets
  const {
    data: outlets = [],
    isError: fetchOutletError,
    isPending: fetchOutletsPending,
  } = OutletsApis.useGetAllOutletsOfInstitutionIds(
    session.user.ext_attrs.tenant_ids
  );

  // set curr institution
  useEffect(() => {
    console.log("Institutions effect triggered", {
      currentInstitution,
      institutions,
      hasUndefined: institutions.some((inst) => inst === undefined),
    });

    if (
      !currentInstitution &&
      institutions.length > 0 &&
      institutions.every((inst) => inst !== undefined) // succesfully get all institution details
    ) {
      setCurrentInstitution(institutions[0]);
    }
  }, [institutions]);

  // set current outlet
  useEffect(() => {
    console.log(`outlets ;${JSON.stringify(outlets, null, 2)}`);
    if (
      !outlets.some((outletPromise) => outletPromise === undefined) &&
      outlets.length > 0 &&
      !currentOutlet &&
      !!currentInstitution
    ) {
      setCurrentOutlet(outlets[0]);
    }
  }, [currentInstitution, outlets]);

  // Update roles when institution changes
  useEffect(() => {
    if (currentInstitution && session) {
      const newRoles = session.user.roles
        .filter((role) => role.startsWith(currentInstitution.id))
        .map((role) => role.substring(currentInstitution.id.length + 1));
      console.log(`roles updated to ${JSON.stringify(newRoles, null, 2)}`);
      setCurrentRoles(newRoles);
    }
  }, [currentInstitution, session]);

  // when user sets a new institution context
  function changeCurrentInstitution(institution: BaseInstitution) {
    setCurrentInstitution(institution);
    console.log(
      `change institution context to ${JSON.stringify(institution, null, 2)}`
    );
  }

  function changeCurrentOutlet(outlet: BaseOutletContext) {
    setCurrentOutlet(outlet);
  }

  // Authentication check
  if (sessionStatus !== "authenticated") {
    return <UnauthenticatedScreen />;
  }

  // Validation checks
  if (!session.user.ext_attrs.tenant_ids.length) {
    throw new Error("No institutions assigned to user");
  }

  return (
    <InstitutionAndOutletContext.Provider
      value={{
        institutions: institutions,
        outlets: outlets,
        currentInstitution: currentInstitution,
        currentOutlets: !!currentInstitution
          ? outlets.filter((o) => o.institution_id === currentInstitution.id)
          : [],
        roles: session.user.roles,
        currentRoles: currentRoles ?? [],
        changeCurrentInstitution,
        changeCurrentOutlet,
        currentOutlet,
        refetchContext: refetchInstitutions,
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
      "useInstitutionContext must be used within InstitutionsAndOutletsProvider"
    );
  }
  return context;
}
