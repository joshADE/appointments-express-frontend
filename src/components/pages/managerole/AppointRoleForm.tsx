import React, { useState, useEffect, memo } from 'react'
import { useAppointRoleMutation } from '../../../app/services/appointments';
import { StoreWithDetails } from '../../../features/store/storeTypes';
import { Button } from "../../shared/Button";
import RadioButton from '../../shared/RadioButton';
import { CgUserAdd } from "react-icons/cg";

interface AppointRoleFormProps {
    selectedStore: StoreWithDetails | undefined;
    currentUserIsOwner: boolean;
    isLoading: boolean;
    isFetching: boolean;
}

const AppointRoleForm: React.FC<AppointRoleFormProps> = ({
    selectedStore,
    currentUserIsOwner,
    isLoading,
    isFetching,
}) => {
        
        const [role, setRole] = useState('');
        const [username, setUsername] = useState('');

        const [appointRole, { isLoading: isAppointing}] = useAppointRoleMutation();

        useEffect(() => {
          setRole('');
        }, [selectedStore])

        const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            if (!selectedStore){
              alert("Must select a store first!");
            }
            else {
              try {
                await appointRole({ role, storeId: selectedStore.store.id, username}).unwrap();
                alert(`Successfuly appointed ${username} ${role} role`);
                setRole('');
                setUsername('');
              } catch (err) {
                alert("Failed to appoint");
              }
            }
        }


        const buttonDisabled = !role || isAppointing;

        if (isLoading) {
          return <div className="h-full animate-pulse">
          <div className="w-28 h-5 bg-gray-400 mb-1" />
          <div className="w-10 h-5 bg-gray-400 mb-1" />
          <div className="mb-1 flex flex-wrap items-center">

          </div>
          <div className="w-36 h-5 bg-gray-400 mb-1" />
          <div className="border border-gray-900 rounded-md w-28 h-7 bg-gray-400 mb-1" />
          <div className="w-36 h-5 bg-gray-400 mb-1" />
      </div>;
        }
          


        return (
          !selectedStore? (
            <div className="h-full text-center p-5 text-xs text-gray-500">
              Must select a store to appoint roles
            </div>
          ):
        <form className="h-full" onSubmit={handleSubmit}>
          <h2 className="font-extrabold text-xl pb-3">Appoint Role</h2>
          <h3 className="font-semibold text-sm">Role</h3>
          <div 
            className="flex items-center flex-wrap"
          >
            {isFetching?
            <>
              <div className="w-16 h-5 bg-gray-400 mb-1 mr-2 animate-pulse" />
              <div className="w-16 h-5 bg-gray-400 mb-1 mr-2 animate-pulse" />
            </>:
            currentUserIsOwner?
            <span className="mr-4">
              <label className="flex items-center"><RadioButton selected={role} name="role" value="Manager" onChange={setRole} className="mr-2" /> <span>Manager</span></label>
            </span>:
            <div className="h-full text-center bg-green-50 bg-opacity-90 rounded p-5 text-xs text-gray-500">
              Must be owner to appoint manager
            </div>}
          </div>
          <h3 className="font-semibold text-sm">Username of user to appoint (all lowercase)</h3>
          <input value={username} onChange={e => setUsername(e.target.value)} type="text" required className="border w-40 border-gray-400 rounded-md px-2 py-0.5 focus:border-gray-700 bg-gray-200 focus:outline-none" />
          <Button 
            type="submit"
            className={`mt-2 flex items-center text-gray-500 ${buttonDisabled ? '': 'hover:text-gray-900'}`}
            disabled={buttonDisabled}
          >
            <CgUserAdd className="mx-2" />
            <span>Appoint</span>
          </Button>
          
        </form>
        );
}

export default memo(AppointRoleForm);