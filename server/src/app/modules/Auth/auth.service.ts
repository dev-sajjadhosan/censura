import { Role, UserStatus } from "../../../generated/prisma/enums";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { ILoginUser, IRegisterUser } from "./auth.interface";

const register = async (user: IRegisterUser) => {
  const { name, email, password, role } = user;

  const data = await auth.api.signUpEmail({
    body: {
      name,
      email,
      password,
      role: Role.USER,
    },
  });

  if (!data.user) {
    throw new Error("User not created");
  }

  try {
    const profile = await prisma.profile.create({
      data: {
        userId: data.user.id,
        name,
        email,
        image: data.user.image,
      },
    });
    return { ...data, profile };
  } catch (err) {
    console.log("Register Transition Error", err);
    await prisma.user.delete({
      where: {
        id: data.user.id,
      },
    });
    throw new Error("User not created");
  }
};

const login = async (user: ILoginUser) => {
  const { email, password } = user;
  const data = await auth.api.signInEmail({
    body: {
      email,
      password,
    },
  });

  if (data.user.status === UserStatus.UNVERIFIED) {
    // send verification email
    throw new Error("User not verified. Again send verification email.");
  }

  if (data.user.status === UserStatus.PENDING) {
    throw new Error("User pending. Please contact support team.");
  }

  if (data.user.isDeleted || data.user.status === UserStatus.DELETED) {
    throw new Error("User deleted. Please contact support team.");
  }

  if (data.user.status === UserStatus.BLOCKED) {
    throw new Error("User blocked. Please contact support team.");
  }

  // access token set here

  // refresh token set here

  return { ...data };
};

export const AuthService = {
  register,
  login,
};
