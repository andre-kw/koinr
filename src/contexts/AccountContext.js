import React, {useState} from 'react';

const AccountContext = React.createContext({
  address: '', setAddress: () => {},
  abis: [], setABIs: () => {},
  // tokens: []
  /*positions: [
    {
      in: true,
      at: new Date(),
      amount: 345000000,
      
    }
  ],*/
});

export default AccountContext;

export function AccountProvider(props) {
  const [address, setAddress] = useState('');
  const [abis, setABIs] = useState([]);

  const value = {
    address, setAddress,
    abis, setABIs,
  };

  return (
    <AccountContext.Provider value={value}>
      {props.children}
    </AccountContext.Provider>
  );
}