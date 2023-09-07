import { createContext, useContext } from "react";
import { IResourceClient } from "../clients/resourceClient";

const ResourceClientContext = createContext<null | IResourceClient>(null);

export default ResourceClientContext;

export function useResourceClient() {
    return useContext(ResourceClientContext);
}