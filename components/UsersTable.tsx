import React from 'react';
import type { SystemUser } from '../types';
import UserTypeBadge from './UserTypeBadge';
import ActivityStatusBadge from './ActivityStatusBadge';
import VerificationStatusBadge from './VerificationStatusBadge';

interface UsersTableProps {
  users: SystemUser[];
}

const UsersTable: React.FC<UsersTableProps> = ({ users }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المستخدم</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">رقم الهاتف</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">نوع المستخدم</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الحالة</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">التحقق</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">تاريخ الانضمام</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">إجراءات</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                <div className="flex items-center">
                  <img className="h-10 w-10 rounded-full object-cover ml-4" src={user.avatarUrl} alt={user.fullName} />
                  <div>
                    <div className="font-semibold">{user.fullName}</div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.phone}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <UserTypeBadge type={user.userType} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <ActivityStatusBadge isActive={user.isActive} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <VerificationStatusBadge isVerified={user.isVerified} />
              </td>
               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.createdAt}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                 <button className="text-indigo-600 hover:text-indigo-900 ml-4">تعديل</button>
                 <button className="text-red-600 hover:text-red-900">تعطيل</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;