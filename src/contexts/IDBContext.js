import React, {useState} from 'react';
import {openDB} from 'idb/with-async-ittr';

const IDBContext = React.createContext({
  instance: null, setInstance: () => {},
});

export default IDBContext;

export function IDBProvider(props) {
  const [instance, setInstance] = useState(null);

  const open = async (addr) => {
    setInstance(await openDB(addr, 1));
  };

  const value = {
    instance, setInstance,
    open
  };

  return (
    <IDBContext.Provider value={value}>
      {props.children}
    </IDBContext.Provider>
  );
}