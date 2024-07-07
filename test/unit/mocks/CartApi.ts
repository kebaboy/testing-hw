import { LOCAL_STORAGE_CART_KEY } from "../../../src/client/api";
import { CartState } from "../../../src/common/types";

export class MockCartApi {
    private store: { [key: string]: string } = {};

    constructor(initialState: CartState = {}) {
        this.setState(initialState);
    }

    getState(): CartState {
        try {
            const json = this.store[LOCAL_STORAGE_CART_KEY] || '{}';
            return JSON.parse(json) as CartState || {};
        } catch {
            return {};
        }
    }

    setState(cart: CartState) {
        this.store[LOCAL_STORAGE_CART_KEY] = JSON.stringify(cart);
    }
}