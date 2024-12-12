export type SocialLoginRequest = {
  socialId: string;
  email: string;
  name: string;
  lat: number;
  lng: number;
  socialType: number;
  deviceToken: string;
  deviceType: number;
};

export type UpdateUserRequest = {
  gender: number;
  lat: number;
  lng: number;
  name: string;
  dob: string;
  unitOfMeasure: number;
};
