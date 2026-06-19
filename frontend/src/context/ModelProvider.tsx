import { createContext, useState } from "react";

interface IModelContext {
    showModel: boolean;
    setShowModel: React.Dispatch<React.SetStateAction<boolean>>
}

export const ModelContext = createContext<IModelContext | null>(null);

export const ModelProvider = ({ children }: { children: React.ReactNode }) => {

    const [showModel, setShowModel] = useState(false);

    return (
        <ModelContext.Provider value={{ showModel, setShowModel }}>
            {children}
        </ModelContext.Provider>
    )
}
