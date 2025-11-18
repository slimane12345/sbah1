
import React, { useState, useEffect } from 'react';
import type { SavedAddress } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext.tsx';

interface AddressModalProps {
    address: SavedAddress | null;
    onClose: () => void;
    onSave: (address: SavedAddress) => void;
}

const AddressModal: React.FC<AddressModalProps> = ({ address, onClose, onSave }) => {
    const [name, setName] = useState('');
    const [details, setDetails] = useState('');
    const [isDefault, setIsDefault] = useState(false);
    const { t } = useLanguage();

    useEffect(() => {
        if (address) {
            setName(address.name);
            setDetails(address.details);
            setIsDefault(address.isDefault);
        } else {
            setName('');
            setDetails('');
            setIsDefault(false);
        }
    }, [address]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            id: address?.id || '0', // '0' signifies a new address
            name,
            details,
            isDefault,
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg m-4" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <div className="p-6">
                        <h2 className="text-xl font-bold mb-4">{address ? t('editAddress') : t('addAddress')}</h2>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="addressName" className="block text-sm font-medium text-gray-700">{t('addressNameLabel')}</label>
                                <input
                                    type="text"
                                    id="addressName"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    className="mt-1 w-full border-gray-300 rounded-md shadow-sm"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="addressDetails" className="block text-sm font-medium text-gray-700">{t('addressDetailsLabel')}</label>
                                <textarea
                                    id="addressDetails"
                                    rows={3}
                                    value={details}
                                    onChange={e => setDetails(e.target.value)}
                                    className="mt-1 w-full border-gray-300 rounded-md shadow-sm"
                                    placeholder={t('addressDetailsPlaceholder')}
                                    required
                                />
                            </div>
                            <div className="flex items-center">
                                <input
                                    id="isDefault"
                                    type="checkbox"
                                    checked={isDefault}
                                    onChange={e => setIsDefault(e.target.checked)}
                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                                />
                                <label htmlFor="isDefault" className="mx-2 block text-sm text-gray-900">
                                    {t('setDefaultAddress')}
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-6 py-3 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
                            {t('cancel')}
                        </button>
                        <button type="submit" className="btn-customer-primary">
                            {t('save')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddressModal;
