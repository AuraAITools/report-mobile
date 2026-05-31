import * as SecureStore from "expo-secure-store";

export interface ISecureStore {
  save(key: string, value: string): Promise<void>;
  getValueFor(key: string): Promise<string | null>;
  deleteItemFor(key: string): Promise<void>;
  saveBiometricProtected(key: string, value: string): Promise<void>;
  getBiometricProtected(key: string): Promise<string | null>;
}

export class AuraSecureStore implements ISecureStore {
  private static _instance: AuraSecureStore;
  private constructor() {}

  public static getInstance() {
    if (!AuraSecureStore._instance) {
      return (AuraSecureStore._instance = new AuraSecureStore());
    }
    return AuraSecureStore._instance;
  }

  public async save(key: string, value: string): Promise<void> {
    return SecureStore.setItemAsync(key, value);
  }

  public async getValueFor(key: string): Promise<string | null> {
    return SecureStore.getItemAsync(key);
  }

  public async deleteItemFor(key: string) {
    return SecureStore.deleteItemAsync(key);
  }

  /**
   * Save a value that requires biometric authentication to read.
   * Uses iOS Secure Enclave / Android Keystore with biometric access control.
   */
  public async saveBiometricProtected(
    key: string,
    value: string
  ): Promise<void> {
    return SecureStore.setItemAsync(key, value, {
      requireAuthentication: true,
      authenticationPrompt:
        "Authenticate to access your secure credentials",
    });
  }

  /**
   * Retrieve a value stored with biometric protection.
   * The OS will automatically prompt for biometric authentication.
   */
  public async getBiometricProtected(
    key: string
  ): Promise<string | null> {
    return SecureStore.getItemAsync(key, {
      requireAuthentication: true,
      authenticationPrompt: "Authenticate to unlock Aura Report",
    });
  }
}