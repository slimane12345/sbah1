
import React, { useState } from 'react';
import type { SavedAddress } from '../../types';
import AddressModal from './AddressModal';
import { useLanguage } from '../../contexts/LanguageContext.tsx';

interface SavedAddressesProps {
    addresses: SavedAddress[];
    onSave: (address: SavedAddress) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
}

const SavedAddresses: React.FC<SavedAddressesProps> = ({ addresses, onSave, onDelete }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState<SavedAddress | null>(null);
    const { t } = useLanguage();

    const handleSave = async (address: SavedAddress) => {
        await onSave(address);
        setIsModalOpen(false);
        setEditingAddress(null);
    };

    const handleDelete = (addressId: string) => {
        if (window.confirm(t('confirmDeleteAddress'))) {
            onDelete(addressId);
        }
    };

    const handleEdit = (address: SavedAddress) => {
        setEditingAddress(address);
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setEditingAddress(null);
        setIsModalOpen(true);
    };

    return (
        <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">{t('savedAddresses')}</h3>
                    <button
                        onClick={handleAddNew}
                        className="text-sm font-semibold text-blue-600 hover:underline"
                    >
                        {t('addNewAddress')}
                    </button>
                </div>
                <div className="mt-6 space-y-4">
                    {addresses.map(address => (
                        <div key={address.id} className="border p-4 rounded-lg flex justify-between items-start">
                            <div>
                                <p className="font-bold">
                                    {address.name}
                                    {address.isDefault && <span className="mx-2 text-xs font-normal bg-green-100 text-green-800 px-2 py-0.5 rounded-full">{t('default')}</span>}
                                </p>
                                <p className="text-sm text-gray-600">{address.details}</p>
                            </div>
                            <div>
                                <button onClick={() => handleEdit(address)} className="text-sm font-medium text-blue-600 hover:text-blue-800">{t('edit')}</button>
                                <button onClick={() => handleDelete(address.id)} className="mx-2 text-sm font-medium text-red-600 hover:text-red-800">{t('delete')}</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {isModalOpen && (
                <AddressModal
                    address={editingAddress}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSave}
                />
            )}
        </div>
    );
};

export default SavedAddresses;
