import status from "http-status";
import { Role, UserStatus } from "../../../generated/prisma/enums";
import AppError from "../../error-helpers/AppError";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { IChangePassword, ILoginUser, IRegisterUser } from "./auth.interface";
import { IRequestUser } from "../../interfaces";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";
import { getAccessToken, getRefreshToken } from "../../utils/token";
import { verifyToken } from "../../utils/jwt";

const register = async (user: any) => {
  const { name, email, password, role, acceptTerms, rememberMe } = user;

  const data = await auth.api.signUpEmail({
    body: {
      name,
      email,
      password,
    },
  });

  if (!data.user) {
    throw new AppError(status.FORBIDDEN, "User not created");
  }

  try {
    const profile = await prisma.$transaction(async (tx) => {
      return await tx.profile.create({
        data: {
          userId: data.user?.id,
          name,
          email,
          // image: data.user.image,
        },
      });
    });

    const accessToken = getAccessToken({
      userId: data.user.id,
      role: data.user.role,
      email: data.user.email,
      name: data.user.name,
      status: data.user.status,
      isDeleted: data.user.isDeleted,
      emailVerified: data.user.emailVerified,
    });

    const refreshToken = getRefreshToken({
      userId: data.user.id,
      role: data.user.role,
      email: data.user.email,
      name: data.user.name,
      status: data.user.status,
      isDeleted: data.user.isDeleted,
      emailVerified: data.user.emailVerified,
    });

    return { ...data, accessToken, refreshToken };
  } catch (err) {
    console.log("Register Transition Error", err);
    // Only delete if the user was actually created
    const userExists = await prisma.user.findUnique({
      where: {
        id: data.user.id,
      },
    });

    if (userExists) {
      await prisma.user.delete({
        where: {
          id: userExists.id,
        },
      });
    }

    throw new AppError(status.FORBIDDEN, "User not created");
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
    throw new AppError(
      status.FORBIDDEN,
      "User not verified. Again send verification email.",
    );
  }

  if (data.user.status === UserStatus.PENDING) {
    throw new AppError(
      status.FORBIDDEN,
      "User pending. Please contact support team.",
    );
  }

  if (data.user.isDeleted || data.user.status === UserStatus.DELETED) {
    throw new AppError(
      status.FORBIDDEN,
      "User deleted. Please contact support team.",
    );
  }

  if (data.user.status === UserStatus.BLOCKED) {
    throw new AppError(
      status.FORBIDDEN,
      "User blocked. Please contact support team.",
    );
  }

  const accessToken = getAccessToken({
    userId: data.user.id,
    role: data.user.role,
    email: data.user.email,
    name: data.user.name,
    status: data.user.status,
    isDeleted: data.user.isDeleted,
    emailVerified: data.user.emailVerified,
  });

  const refreshToken = getRefreshToken({
    userId: data.user.id,
    role: data.user.role,
    email: data.user.email,
    name: data.user.name,
    status: data.user.status,
    isDeleted: data.user.isDeleted,
    emailVerified: data.user.emailVerified,
  });

  return { ...data, accessToken, refreshToken };
};

const logout = async (sessionToken: string) => {
  const result = await auth.api.signOut({
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`,
    }),
  });

  return result;
};
const verifyEmail = async (email: string, otp: string) => {
  const result = await auth.api.verifyEmailOTP({
    body: {
      email,
      otp,
    },
  });

  if (result.user.status === UserStatus.UNVERIFIED) {
    await prisma.user.update({
      where: {
        id: result.user.id,
      },
      data: {
        emailVerified: true,
        status: UserStatus.ACTIVE,
      },
    });
  }

  return result;
};

const sendVerifyOtp = async (
  email: string,
  type: "sign-in" | "email-verification" | "forget-password" | "change-email",
) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new AppError(status.FORBIDDEN, "User not found");
  }

  if (user.emailVerified) {
    throw new AppError(status.FORBIDDEN, "User already verified");
  }

  if (user.status === UserStatus.PENDING) {
    throw new AppError(
      status.FORBIDDEN,
      "User pending. Please contact support team.",
    );
  }

  if (user.isDeleted || user.status === UserStatus.DELETED) {
    throw new AppError(status.FORBIDDEN, "User not found.");
  }

  if (user.status === UserStatus.BLOCKED) {
    throw new AppError(
      status.FORBIDDEN,
      "User blocked. Please contact support team.",
    );
  }

  await auth.api.sendVerificationOTP({
    body: {
      email,
      type,
    },
  });
};

const changePassword = async (
  payload: IChangePassword,
  sessionToken: string,
) => {
  const { confirmPassword, newPassword, oldPassword } = payload;

  if (newPassword !== confirmPassword) {
    throw new AppError(status.FORBIDDEN, "Passwords do not match");
  }

  // 1. Change password and get the NEW session token
  const result = await auth.api.changePassword({
    body: {
      currentPassword: oldPassword,
      newPassword,
      revokeOtherSessions: true,
    },
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`,
    }),
  });

  // result.token is the new session token generated after revoking others
  const newToken = result?.token;

  if (!newToken) {
    throw new AppError(status.UNAUTHORIZED, "Failed to generate new session.");
  }

  // 2. Fetch updated session using the NEW token
  const updatedSession = await auth.api.getSession({
    headers: { 
      Authorization: `Bearer ${newToken}` 
    },
  });

  if (!updatedSession) {
    throw new AppError(status.UNAUTHORIZED, "Session invalidated. Please log in again.");
  }

  // 3. Update DB flags if necessary
  if (updatedSession.user.needPasswordChange) {
    await prisma.user.update({
      where: { id: updatedSession.user.id },
      data: { needPasswordChange: false },
    });
  }

  // 4. Generate your custom JWTs using the updated user data
  const tokenPayload = {
    userId: updatedSession.user.id,
    role: updatedSession.user.role,
    email: updatedSession.user.email,
    name: updatedSession.user.name,
    status: updatedSession.user.status,
    isDeleted: updatedSession.user.isDeleted,
    emailVerified: updatedSession.user.emailVerified,
  };

  const accessToken = getAccessToken(tokenPayload);
  const refreshToken = getRefreshToken(tokenPayload);

  // Return the new Better-Auth token along with your custom JWTs
  return { ...result, accessToken, refreshToken, token: newToken };
};

const forgotPassword = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new AppError(status.FORBIDDEN, "User not found");
  }

  if (!user.emailVerified) {
    throw new AppError(status.FORBIDDEN, "User not verified");
  }

  if (user.status === UserStatus.PENDING) {
    throw new AppError(
      status.FORBIDDEN,
      "User pending. Please contact support team.",
    );
  }

  if (user.isDeleted || user.status === UserStatus.DELETED) {
    throw new AppError(
      status.FORBIDDEN,
      "User not found. Please contact support team.",
    );
  }

  if (user.status === UserStatus.BLOCKED) {
    throw new AppError(
      status.FORBIDDEN,
      "User blocked. Please contact support team.",
    );
  }

  await auth.api.requestPasswordResetEmailOTP({
    body: {
      email,
    },
  });
};

const resetPassword = async (
  email: string,
  newPassword: string,
  otp: string,
) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new AppError(status.FORBIDDEN, "User not found");
  }

  if (!user.emailVerified) {
    throw new AppError(status.FORBIDDEN, "User not verified");
  }

  if (user.status === UserStatus.PENDING) {
    throw new AppError(
      status.FORBIDDEN,
      "User pending. Please contact support team.",
    );
  }

  if (user.isDeleted || user.status === UserStatus.DELETED) {
    throw new AppError(
      status.FORBIDDEN,
      "User not found. Please contact support team.",
    );
  }

  if (user.status === UserStatus.BLOCKED) {
    throw new AppError(
      status.FORBIDDEN,
      "User blocked. Please contact support team.",
    );
  }

  await auth.api.resetPasswordEmailOTP({
    body: {
      email,
      otp,
      password: newPassword,
    },
  });

  if (user.needPasswordChange) {
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        needPasswordChange: false,
      },
    });
  }

  await prisma.session.deleteMany({
    where: {
      userId: user.id,
    },
  });
};

const getMe = async (user: IRequestUser) => {
  const { userId } = user;
  const userData = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      profile: true,
      bookmarks: {
        include: {
          media: true,
        },
      },
      favorites: {
        include: {
          media: true,
        },
      },
      watchlists: {
        include: {
          media: true,
        },
      },
      subscription: true,
      purchases: true,
      _count: {
        select: {
          bookmarks: true,
          favorites: true,
          watchlists: true,
          reviews: true,
          comments: true,
          likes: true,
        },
      },
    },
  });

  if (!userData) {
    throw new AppError(status.NOT_FOUND, "User not found");
  }

  return { ...userData, meta: { ...userData._count } };
};

const getNewToken = async (refreshToken: string, sessionToken: string) => {
  const isSessionTokenExists = await prisma.session.findUnique({
    where: {
      token: sessionToken,
    },
    include: {
      user: true,
    },
  });

  if (!isSessionTokenExists) {
    throw new AppError(status.UNAUTHORIZED, "Invalid session token");
  }

  const verifiedRefreshToken = verifyToken(
    refreshToken,
    envVars.REFRESH_TOKEN_SECRET,
  );

  if (!verifiedRefreshToken.success && verifiedRefreshToken.err) {
    throw new AppError(status.UNAUTHORIZED, "Invalid refresh token");
  }

  const data = verifiedRefreshToken.data as JwtPayload;

  const newAccessToken = getAccessToken({
    userId: data.userId,
    role: data.role,
    name: data.name,
    email: data.email,
    status: data.status,
    isDeleted: data.isDeleted,
    emailVerified: data.emailVerified,
  });

  const newRefreshToken = getRefreshToken({
    userId: data.userId,
    role: data.role,
    name: data.name,
    email: data.email,
    status: data.status,
    isDeleted: data.isDeleted,
    emailVerified: data.emailVerified,
  });

  const { token } = await prisma.session.update({
    where: {
      token: sessionToken,
    },
    data: {
      token: sessionToken,
      expiresAt: new Date(Date.now() + 60 * 60 * 60 * 24 * 1000),
      updatedAt: new Date(),
    },
  });

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    sessionToken: token,
  };
};

const googleLoginSuccess = async (session: Record<string, any>) => {
  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  if (!user) {
    throw new AppError(status.UNAUTHORIZED, "Invalid session token");
  }

  const accessToken = getAccessToken({
    userId: user.id,
    role: user.role,
    name: user.name,
    email: user.email,
    status: user.status,
    isDeleted: user.isDeleted,
    emailVerified: user.emailVerified,
  });

  const refreshToken = getRefreshToken({
    userId: user.id,
    role: user.role,
    name: user.name,
    email: user.email,
    status: user.status,
    isDeleted: user.isDeleted,
    emailVerified: user.emailVerified,
  });

  return {
    accessToken,
    refreshToken,
  };
};

export const AuthService = {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  changePassword,
  verifyEmail,
  getMe,
  getNewToken,
  googleLoginSuccess,
  sendVerifyOtp,
};
