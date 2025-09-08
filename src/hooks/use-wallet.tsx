import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import * as fcl from '@onflow/fcl';

// Configure FCL for Flow blockchain
fcl.config({
  'app.detail.title': 'Learning Platform',
  'app.detail.icon': 'https://placekitten.com/g/200/200',
  'accessNode.api': 'https://rest-testnet.onflow.org', // Testnet
  'discovery.wallet': 'https://fcl-discovery.onflow.org/testnet/authn', // Testnet
  '0xProfile': '0xba1132bc08f82fe2', // Flow profile contract address
});

interface WalletContextType {
  user: any;
  account: string | null; // For backward compatibility
  isConnecting: boolean;
  connectWallet: () => Promise<string | null>;
  disconnectWallet: () => void;
  getBalance: () => Promise<string | null>;
  executeTransaction: (code: string, args?: any[]) => Promise<string | null>;
  executeScript: (code: string, args?: any[]) => Promise<any>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    // Listen for authentication changes
    const unsubscribe = fcl.currentUser.subscribe(setUser);
    return () => unsubscribe();
  }, []);

  const connectWallet = useCallback(async (): Promise<string | null> => {
    setIsConnecting(true);
    
    try {
      const currentUser = await fcl.authenticate();
      return currentUser.addr || null;
    } catch (error) {
      console.error('Error connecting wallet:', error);
      return null;
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnectWallet = useCallback(async () => {
    await fcl.unauthenticate();
  }, []);

  const getBalance = useCallback(async (): Promise<string | null> => {
    if (!user?.addr) return null;
    
    try {
      const balance = await fcl.query({
        cadence: `
          import FlowToken from 0x7e60df042a9c0868
          import FungibleToken from 0x9a0766d93b6608b7

          pub fun main(address: Address): UFix64 {
            let account = getAccount(address)
            let vaultRef = account.getCapability(/public/flowTokenBalance)
              .borrow<&FlowToken.Vault{FungibleToken.Balance}>()
              ?? panic("Could not borrow Balance reference to the Vault")
            return vaultRef.balance
          }
        `,
        args: (arg: any, t: any) => [arg(user.addr, t.Address)],
      });
      return balance.toString();
    } catch (error) {
      console.error('Error getting balance:', error);
      return null;
    }
  }, [user]);

  const executeTransaction = useCallback(async (code: string, args: any[] = []): Promise<string | null> => {
    if (!user?.addr) return null;
    
    try {
      const transactionId = await fcl.mutate({
        cadence: code,
        args: (arg: any, t: any) => args,
        proposer: fcl.currentUser,
        payer: fcl.currentUser,
        authorizations: [fcl.currentUser],
        limit: 1000,
      });
      
      return transactionId;
    } catch (error) {
      console.error('Error executing transaction:', error);
      return null;
    }
  }, [user]);

  const executeScript = useCallback(async (code: string, args: any[] = []): Promise<any> => {
    try {
      const result = await fcl.query({
        cadence: code,
        args: (arg: any, t: any) => args,
      });
      return result;
    } catch (error) {
      console.error('Error executing script:', error);
      return null;
    }
  }, []);

  const value = {
    user,
    account: user?.addr || null, // For backward compatibility
    isConnecting,
    connectWallet,
    disconnectWallet,
    getBalance,
    executeTransaction,
    executeScript,
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
};