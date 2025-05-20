type verifyEmailDto = {
  email: string,
  otp: string
}

type LoginDto = {
  email: string;
  password: string;
}

type RegisterDto = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "User" | "Admin";
  status: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}