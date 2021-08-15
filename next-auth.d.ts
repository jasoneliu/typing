import "next-auth";

declare module "next-auth" {
  interface Session {
    // add id to User - for querying tests based on user id
    // remove null and undefined types from User
    // remove image (profile picture) from User
    user: {
      id: string;
      name: string;
      email: string;
    };
  }
}
