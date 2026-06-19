import { useContext } from "react";
import { ModelContext } from "../context/ModelProvider";

export function useModel(){
    const context = useContext(ModelContext);
    if(!context){
        throw new Error("use model inside model provider");
    }

    return context;
}