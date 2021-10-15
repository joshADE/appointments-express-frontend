import React, { useState, useEffect } from 'react'
import { useAppointRoleMutation } from '../../../app/services/appointments';
import { StoreWithDetails } from '../../../features/store/storeTypes';
import { Button } from "../../shared/Button";
import RadioButton from '../../shared/RadioButton';

interface AppointRoleFormProps {
    selectedStore: StoreWithDetails;
    currentUserIsOwner: boolean;
}

const AppointRoleForm: React.FC<AppointRoleFormProps> = ({
    selectedStore,
    currentUserIsOwner
}) => {
        
        const [role, setRole] = useState('');
        const [username, setUsername] = useState('');

        const [appointRole, { isLoading: isAppointing}] = useAppointRoleMutation();

        useEffect(() => {
          setRole('');
        }, [selectedStore])

        const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            try {
              await appointRole({ role, storeId: selectedStore.store.id, username}).unwrap();
              alert(`Successfuly appointed ${username} ${role} role`);
              setRole('');
              setUsername('');
            } catch (err) {
              alert("Failed to appoint");
            }
        }

        return (
        <form className="h-full" onSubmit={handleSubmit}>
          <h2 className="font-extrabold text-xl pb-3">Appoint Role</h2>
          <h3 className="font-bold text-base">Role</h3>
          <div 
            className="flex items-center flex-wrap"
          >
            {currentUserIsOwner?
            <span className="mr-4">
              <label className="flex items-center"><RadioButton selected={role} name="role" value="Manager" onChange={setRole} className="mr-2" /> <span>Manager</span></label>
            </span>:
            <div className="h-full text-center bg-green-50 bg-opacity-90 rounded p-5 text-xs text-gray-500">
              Must be owner to appoint manager
            </div>}
          </div>
          <h3 className="font-bold text-base">Username of user to appoint (all lowercase)</h3>
          <input value={username} onChange={e => setUsername(e.target.value)} type="text" required className="border border-black bg-gray-200 focus:outline-none" />
          <Button 
            type="submit"
            className="block mt-2"
            disabled={!role || isAppointing}
          >
            Appoint
          </Button>
          
        </form>
        );
}

export default AppointRoleForm