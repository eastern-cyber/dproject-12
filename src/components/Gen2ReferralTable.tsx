import React, { useState, useEffect } from 'react';

interface User {
  userId: string;
  referrerId: string;
  email: string;
  name: string;
  tokenId: string;
  userCreated: string;
  planA: string;
}

const Gen2ReferralTable: React.FC = () => {
  const [referrerId, setReferrerId] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [gen1Users, setGen1Users] = useState<User[]>([]);
  const [gen2Users, setGen2Users] = useState<User[]>([]);

  useEffect(() => {
    // Fetch data from the JSON file
    const fetchData = async () => {
      try {
        const response = await fetch(
          'https://raw.githubusercontent.com/eastern-cyber/dproject-admin-1.0.2/main/public/dproject-users.json'
        );
        const data: User[] = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!referrerId || users.length === 0) {
      setGen1Users([]);
      setGen2Users([]);
      return;
    }

    // Generation 1: direct referrals
    const gen1 = users.filter(user => user.referrerId === referrerId);
    setGen1Users(gen1);

    // Generation 2: users referred by Gen 1 userIds
    const gen1Ids = gen1.map(user => user.userId);
    const gen2 = users.filter(user => gen1Ids.includes(user.referrerId));
    setGen2Users(gen2);

  }, [referrerId, users]);

  return (
    <div className="max-w-md mx-auto p-4 w-full">
      <input
        type="text"
        placeholder="ใส่เลขกระเป๋า..."
        value={referrerId}
        onChange={(e) => setReferrerId(e.target.value)}
        className="text-[18px] text-center border border-gray-400 p-2 rounded mt-4 w-full bg-gray-800 text-white break-all"
      />

      {(gen1Users.length > 0 || gen2Users.length > 0) && (
        <table className="table-auto w-full mt-4 border-collapse border border-gray-400">
          <thead>
            <tr>
              <th className="border border-gray-400 px-4 py-2">Gen</th>
              <th className="border border-gray-400 px-4 py-2">Number of Users</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-400 px-4 py-2 text-center">1</td>
              <td className="border border-gray-400 px-4 py-2 text-center">{gen1Users.length}</td>
            </tr>
            <tr>
              <td className="border border-gray-400 px-4 py-2 text-center">2</td>
              <td className="border border-gray-400 px-4 py-2 text-center">{gen2Users.length}</td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Gen2ReferralTable;