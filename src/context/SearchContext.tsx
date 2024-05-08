import { FC, ReactNode, createContext, useContext, useState } from "react";

interface ContextProps {
  searchGroupName?: string;
  handleChangeGroupName: (groupName: string | undefined) => void;
}

interface ProviderProps {
  children: ReactNode;
}

const SearchContext = createContext<ContextProps | undefined>(undefined);

const SearchContextProvider: FC<ProviderProps> = ({ children }) => {
  const [searchGroupName, setSearchGroupName] = useState<string>();

  const handleChangeGroupName = (groupName: string | undefined) => {
    setSearchGroupName(groupName);
  };

  return (
    <SearchContext.Provider
      value={{
        searchGroupName,
        handleChangeGroupName,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const UseSearchContext = (): ContextProps => {
  const searchContext = useContext(SearchContext);
  if (!searchContext) {
    throw new Error("SearchContext failed.");
  }
  return searchContext;
};
export default SearchContextProvider;
