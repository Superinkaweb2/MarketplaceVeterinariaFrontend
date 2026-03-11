import { api } from "../../../../shared/http/api";
import type { AxiosResponse } from "axios";
import type { DeliveryTrackingDTO } from "../../cliente/services/deliveryService";

export const deliveryEmpresaService = {
    getRatings: (): Promise<AxiosResponse<DeliveryTrackingDTO[]>> => 
        api.get("/deliveries/empresa/ratings"),
};
