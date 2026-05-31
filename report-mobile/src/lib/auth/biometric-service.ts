import * as LocalAuthentication from "expo-local-authentication";
import { Platform } from "react-native";
import { AuraSecureStore } from "@/lib/secure-store";

const BIOMETRIC_ENABLED_KEY = "biometric_enabled";
const BIOMETRIC_LAST_AUTH_KEY = "biometric_last_auth_timestamp";

export type BiometricCapability = {
  isHardwareAvailable: boolean;
  isEnrolled: boolean;
  supportedTypes: LocalAuthentication.AuthenticationType[];
};

export class BiometricService {
  private static _instance: BiometricService;
  private readonly store: AuraSecureStore;

  private constructor() {
    this.store = AuraSecureStore.getInstance();
  }

  static getInstance(): BiometricService {
    if (!BiometricService._instance) {
      BiometricService._instance = new BiometricService();
    }
    return BiometricService._instance;
  }

  /**
   * Checks hardware availability, enrollment status, and supported biometric types.
   */
  async getCapability(): Promise<BiometricCapability> {
    const [isHardwareAvailable, isEnrolled, supportedTypes] = await Promise.all([
      LocalAuthentication.hasHardwareAsync(),
      LocalAuthentication.isEnrolledAsync(),
      LocalAuthentication.supportedAuthenticationTypesAsync(),
    ]);

    return { isHardwareAvailable, isEnrolled, supportedTypes };
  }

  /**
   * Prompts the user for biometric authentication.
   * On success, records the authentication timestamp in secure store.
   */
  async authenticate(promptMessage?: string): Promise<boolean> {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: promptMessage ?? "Verify your identity",
      fallbackLabel: "Use passcode",
      disableDeviceFallback: false,
    });

    if (result.success) {
      await this.store.save(
        BIOMETRIC_LAST_AUTH_KEY,
        Date.now().toString(),
      );
    }

    if (__DEV__ && !result.success) {
      console.warn("Biometric auth failed:", result.error);
    }

    return result.success;
  }

  /**
   * Returns whether the user has opted in to biometric lock.
   */
  async isBiometricEnabled(): Promise<boolean> {
    const value = await this.store.getValueFor(BIOMETRIC_ENABLED_KEY);
    return value === "true";
  }

  /**
   * Enables or disables biometric lock.
   * When enabling, a biometric verification is performed first.
   */
  async setBiometricEnabled(enabled: boolean): Promise<boolean> {
    if (enabled) {
      const verified = await this.authenticate("Enable biometric lock");
      if (!verified) return false;
    }

    await this.store.save(BIOMETRIC_ENABLED_KEY, enabled ? "true" : "false");
    return true;
  }

  /**
   * Returns true if the time since the last biometric auth exceeds `timeoutMs`.
   */
  async isLockRequired(timeoutMs: number): Promise<boolean> {
    const raw = await this.store.getValueFor(BIOMETRIC_LAST_AUTH_KEY);
    if (!raw) return true;

    const lastAuth = parseInt(raw, 10);
    if (isNaN(lastAuth)) return true;

    return Date.now() - lastAuth > timeoutMs;
  }

  /**
   * Returns a human-readable label for the given biometric authentication type.
   */
  static getBiometricLabel(
    type: LocalAuthentication.AuthenticationType,
  ): string {
    switch (type) {
      case LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION:
        return Platform.OS === "ios" ? "Face ID" : "Face Recognition";
      case LocalAuthentication.AuthenticationType.FINGERPRINT:
        return Platform.OS === "ios" ? "Touch ID" : "Fingerprint";
      case LocalAuthentication.AuthenticationType.IRIS:
        return "Iris";
      default:
        return "Biometrics";
    }
  }
}
