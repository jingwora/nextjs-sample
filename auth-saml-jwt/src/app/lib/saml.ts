// nextjs/auth-saml-jwt/src/app/lib/saml.ts

import { SAML, SamlConfig } from "@node-saml/node-saml";
import { headers } from "next/headers";

// SAML Configuration
const samlConfig: SamlConfig = {
  callbackUrl: "http://localhost:3000/api/auth/callback", // Ensure this URL is valid and absolute
  entryPoint: "https://mocksaml.com/api/namespace/mock/saml/sso", // Mock SAML SSO URL
  issuer: "https://saml.example.com/entityid/mock", // Mock SAML Entity ID
  idpCert: `-----BEGIN CERTIFICATE-----
MIIC4jCCAcoCCQC33wnybT5QZDANBgkqhkiG9w0BAQsFADAyMQswCQYDVQQGEwJV
SzEPMA0GA1UECgwGQm94eUhRMRIwEAYDVQQDDAlNb2NrIFNBTUwwIBcNMjIwMjI4
MjE0NjM4WhgPMzAyMTA3MDEyMTQ2MzhaMDIxCzAJBgNVBAYTAlVLMQ8wDQYDVQQK
DAZCb3h5SFExEjAQBgNVBAMMCU1vY2sgU0FNTDCCASIwDQYJKoZIhvcNAQEBBQAD
ggEPADCCAQoCggEBALGfYettMsct1T6tVUwTudNJH5Pnb9GGnkXi9Zw/e6x45DD0
RuRONbFlJ2T4RjAE/uG+AjXxXQ8o2SZfb9+GgmCHuTJFNgHoZ1nFVXCmb/Hg8Hpd
4vOAGXndixaReOiq3EH5XvpMjMkJ3+8+9VYMzMZOjkgQtAqO36eAFFfNKX7dTj3V
pwLkvz6/KFCq8OAwY+AUi4eZm5J57D31GzjHwfjH9WTeX0MyndmnNB1qV75qQR3b
2/W5sGHRv+9AarggJkF+ptUkXoLtVA51wcfYm6hILptpde5FQC8RWY1YrswBWAEZ
NfyrR4JeSweElNHg4NVOs4TwGjOPwWGqzTfgTlECAwEAATANBgkqhkiG9w0BAQsF
AAOCAQEAAYRlYflSXAWoZpFfwNiCQVE5d9zZ0DPzNdWhAybXcTyMf0z5mDf6FWBW
5Gyoi9u3EMEDnzLcJNkwJAAc39Apa4I2/tml+Jy29dk8bTyX6m93ngmCgdLh5Za4
khuU3AM3L63g7VexCuO7kwkjh/+LqdcIXsVGO6XDfu2QOs1Xpe9zIzLpwm/RNYeX
UjbSj5ce/jekpAw7qyVVL4xOyh8AtUW1ek3wIw1MJvEgEPt0d16oshWJpoS1OT8L
r/22SvYEo3EmSGdTVGgk3x3s+A0qWAqTcyjr7Q4s/GKYRFfomGwz0TZ4Iw1ZN99M
m0eo2USlSRTVl7QHRTuiuSThHpLKQQ==
-----END CERTIFICATE-----`, // Mock SAML Certificate
  authnContext: ["urn:oasis:names:tc:SAML:2.0:ac:classes:X509"],
};

// Create SAML client
export const samlClient = new SAML(samlConfig);

// Helper function to get absolute URL
export function getAbsoluteUrl(path: string): string {
    try {
      const headersList = headers();
      console.log("Headers received:", Array.from(headersList.entries()));
  
      const host = headersList.get("host");
  
      if (!host) {
        console.error("Error: Host header is missing");
        throw new Error("Host header is missing");
      }
  
      const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
      const absoluteUrl = `${protocol}://${host}${path}`;
      console.log("Generated Absolute URL:", absoluteUrl);
      return absoluteUrl;
    } catch (error) {
      console.error("Failed to generate absolute URL:", error);
      throw new Error("Failed to generate absolute URL");
    }
  }

// Utility function to validate and parse SAML response
export async function validateSamlResponse(rawResponse: string) {
  try {
    console.log("Validating SAMLResponse...");
    const { profile } = await samlClient.validatePostResponseAsync({
      SAMLResponse: rawResponse,
    });

    console.log("Validated SAML Profile:", profile);
    return profile;
  } catch (error) {
    console.error("SAML validation failed:", error);
    throw new Error("Failed to validate SAML response.");
  }
}

// Utility function to generate the SAML login request URL
export async function generateAuthUrl() {
  try {
    const callbackUrl = getAbsoluteUrl("/api/auth/callback");
    console.log("Callback URL:", callbackUrl);

    const loginUrl = await samlClient.getAuthorizeUrlAsync(
      "state", // State for maintaining request/response consistency
      callbackUrl,
      {}
    );

    console.log("Generated SAML Auth URL:", loginUrl);
    return loginUrl;
  } catch (error) {
    console.error("Error generating SAML Auth URL:", error);
    throw new Error("Failed to generate SAML authentication URL.");
  }
}
