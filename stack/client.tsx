import { StackClientApp } from "@stackframe/stack";

export const stackClientApp = new StackClientApp({
  tokenStore: "nextjs-cookie",
  theme: {
    appearance: "light", 
    primaryColor: "#000000", 
    backgroundColor: "#ffffff",
    textColor: "#000000", 
  }
});

