import * as SecureStore from "expo-secure-store";

export interface ISecureStore {
  save(key: string, value: string): Promise<void>;
  getValueFor(key: string): Promise<string|null>
  deleteItemFor(key:string): Promise<void>
}

export class AuraSecureStore implements ISecureStore {
  private static _instance: AuraSecureStore;
  private constructor() {
  }

  public static getInstance() {
    if (!AuraSecureStore._instance) {
      return AuraSecureStore._instance = new AuraSecureStore(); 
    }
    return AuraSecureStore._instance;
  }

  public async save(key: string, value: string): Promise<void> {
    return SecureStore.setItemAsync(key,value);
  }

  public async getValueFor(key: string): Promise<string | null> {
    return SecureStore.getItemAsync(key);
  }

  public async deleteItemFor(key: string){
    return SecureStore.deleteItemAsync(key)
  }
}