// The Auth client makes RESTful API requests to the Auth server
import axios from 'axios';

export interface IResourceClient {
    loadResource(token: string, abortSignal: AbortSignal) : Promise<LoadResourceResult>;
}

type LoadResourceResult = {
    data: string,
}
type ErrorResult = {
    errorMessage: string
}

export class ResourceClient implements IResourceClient {
    private resourceEndpoint: string;

    constructor(resourceEndpoint: string) {

        this.resourceEndpoint = resourceEndpoint;
        
        console.log("Constructed Resource Client: " + this.resourceEndpoint);
    }

    async loadResource(token: string, abortSignal: AbortSignal) {
        const url = this.resourceEndpoint + "/secret";
        const result = await axios<LoadResourceResult | ErrorResult>({
            url,
            method: "GET",
            headers: {
                'Authorization': 'Bearer ' + token,
            },
            timeout: 10 * 1000,
            validateStatus: () => true,
            signal: abortSignal,
        });
        if (result.status === 200) {
            return result.data as LoadResourceResult;
        } else if (result.status === 500) {
            console.error("500 from load resource");
            console.error(result.data);
            throw new Error("Error: " + (result.data as ErrorResult).errorMessage);
        } else {
            throw new Error("Unexpected status: " + result.status);
        }
    }

}