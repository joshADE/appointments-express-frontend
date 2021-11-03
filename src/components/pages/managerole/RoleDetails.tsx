import React, { memo } from "react";
import { useUnappointRoleMutation } from "../../../app/services/appointments";
import {
  StoreWithDetails,
  UserAndRoleForStore,
} from "../../../features/store/storeTypes";
import PersonList from "../../shared/PersonList";
import { CgUserRemove } from "react-icons/cg";

interface RoleDetailsProps {
  selectedStore: StoreWithDetails | undefined;
  usersAndRoles: UserAndRoleForStore[] | undefined;
  currentUserIsOwner: boolean;
  isLoading: boolean;
}

const RoleDetails: React.FC<RoleDetailsProps> = ({
  selectedStore,
  usersAndRoles,
  currentUserIsOwner,
  isLoading,
}) => {
  const [unappoint, { isLoading: isUnappointing }] = useUnappointRoleMutation();

  const managers = usersAndRoles?.filter(({ role }) => role.name === "Manager");
  const owner = usersAndRoles?.filter(({ role }) => role.name === "Owner");

  const unAppointPerson = async (
    role: string,
    storeId: number,
    username: string
  ) => {
    try {
      await unappoint({ role, storeId, username }).unwrap();
      alert("Succesfully unappointed");
    } catch (err) {
      alert("Failed to perform action");
    }
  };

  if (isLoading) {
    return <div className="h-full animate-pulse">
        <div className="w-28 h-5 bg-gray-400 mb-1" />
        <div className="w-10 h-5 bg-gray-400 mb-1" />
        <div className="mb-1">
            {Array(1).fill(null).map((e, i) => <div key={i} className={`inline-block rounded-3xl w-8 h-8 bg-gray-400 ring-2 ring-white ${i > 0 ? '-ml-2':''}`} />)}
        </div>
        <div className="w-10 h-5 bg-gray-400 mb-1" />
        <div className="mb-1">
            {Array(5).fill(null).map((e, i) => <div key={i} className={`inline-block rounded-3xl w-8 h-8 bg-gray-400 ring-2 ring-white ${i > 0 ? '-ml-2':''}`} />)}
        </div>
        
    </div>;
  }

  return (
    <div className="h-full">
      {!selectedStore ? (
        <div className="h-full text-center p-5 text-xs text-gray-500">
          Must select a store to view roles
        </div>
      ) : (
        <>
          <h2 className="font-extrabold text-xl pb-3">
            {selectedStore.store.name}
          </h2>
          <h3 className="font-bold text-base">Owner</h3>
          {owner && <PersonList people={owner} />}
          <h3 className="font-bold text-base">Managers</h3>
          {managers && (
            <PersonList
              people={managers}
              render={(urs) => (
                <div className="border border-white text-white p-1 rounded-sm">
                  {" "}
                  {currentUserIsOwner ? (
                    <button
                      className="text-sm p-1 hover:bg-white hover:text-black w-full flex items-center"
                      disabled={isUnappointing}
                      onClick={() =>
                        unAppointPerson(
                          urs.role.name,
                          urs.store.id,
                          urs.user.username
                        )
                      }
                    >
                      <CgUserRemove className="mr-2" />
                      <span>Unappoint</span>
                    </button>
                  ) : (
                    <span>Only owner can unappoint</span>
                  )}
                </div>
              )}
            />
          )}
        </>
      )}
    </div>
  );
};

export default memo(RoleDetails);
