export const userMaximums = {
  name: 128,
  password: 256
};

export const nameRules = [
  (v: string) => !!v || "Name is required",
  (v: string) =>
    v.length <= userMaximums.name ||
    `Name must be less than ${userMaximums.name} characters`
];

export const passwordRules = [
  (v: string) => !!v || "Password is required",
  (v: string) =>
    v.length <= userMaximums.password ||
    `Password is must be less than ${userMaximums.password} characters`
];
