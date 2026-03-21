import status from "http-status";
import { Role, UserStatus } from "../../../generated/prisma/enums";
import AppError from "../../error-helpers/AppError";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { IChangePassword, ILoginUser, IRegisterUser } from "./auth.interface";
import { tokenUtils } from "../../utils/token";
import { IRequestUser } from "../../interfaces";
import { jwtUtils } from "../../utils/jwt";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";

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
    throw new AppError(status.FORBIDDEN, "User not created");
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

    const accessToken = tokenUtils.getAccessToken({
      userId: data.user.id,
      role: data.user.role,
      email: data.user.email,
      name: data.user.name,
      status: data.user.status,
      isDeleted: data.user.isDeleted,
      emailVerified: data.user.emailVerified,
    });

    const refreshToken = tokenUtils.getRefreshToken({
      userId: data.user.id,
      role: data.user.role,
      email: data.user.email,
      name: data.user.name,
      status: data.user.status,
      isDeleted: data.user.isDeleted,
      emailVerified: data.user.emailVerified,
    });

    return { ...data, profile, accessToken, refreshToken };
  } catch (err) {
    console.log("Register Transition Error", err);
    await prisma.user.delete({
      where: {
        id: data.user.id,
      },
    });
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

  const accessToken = tokenUtils.getAccessToken({
    userId: data.user.id,
    role: data.user.role,
    email: data.user.email,
    name: data.user.name,
    status: data.user.status,
    isDeleted: data.user.isDeleted,
    emailVerified: data.user.emailVerified,
  });

  const refreshToken = tokenUtils.getRefreshToken({
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

  if (result.status && !result.user.emailVerified) {
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

const changePassword = async (
  payload: IChangePassword,
  sessionToken: string,
) => {
  const session = await auth.api.getSession({
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`,
    }),
  });

  if (!session) {
    throw new AppError(status.UNAUTHORIZED, "invalid session token!");
  }

  const { confirmPassword, newPassword, oldPassword } = payload;

  if (newPassword !== confirmPassword) {
    throw new AppError(status.FORBIDDEN, "Password not match");
  }

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

  if (session.user.needPasswordChange) {
    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        needPasswordChange: false,
      },
    });
  }

  const accessToken = tokenUtils.getAccessToken({
    userId: session.user.id,
    role: session.user.role,
    email: session.user.email,
    name: session.user.name,
    status: session.user.status,
    isDeleted: session.user.isDeleted,
    emailVerified: session.user.emailVerified,
  });

  const refreshToken = tokenUtils.getRefreshToken({
    userId: session.user.id,
    role: session.user.role,
    email: session.user.email,
    name: session.user.name,
    status: session.user.status,
    isDeleted: session.user.isDeleted,
    emailVerified: session.user.emailVerified,
  });

  return { ...result, accessToken, refreshToken };
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
      bookmarks: true,
      favorites: true,
      watchlists: true,
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

  const verifiedRefreshToken = jwtUtils.verifyToken(
    refreshToken,
    envVars.REFRESH_TOKEN_SECRET,
  );

  if (!verifiedRefreshToken.success && verifiedRefreshToken.err) {
    throw new AppError(status.UNAUTHORIZED, "Invalid refresh token");
  }

  const data = verifiedRefreshToken.data as JwtPayload;

  const newAccessToken = tokenUtils.getAccessToken({
    userId: data.userId,
    role: data.role,
    name: data.name,
    email: data.email,
    status: data.status,
    isDeleted: data.isDeleted,
    emailVerified: data.emailVerified,
  });

  const newRefreshToken = tokenUtils.getRefreshToken({
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

  const accessToken = tokenUtils.getAccessToken({
    userId: user.id,
    role: user.role,
    name: user.name,
    email: user.email,
    status: user.status,
    isDeleted: user.isDeleted,
    emailVerified: user.emailVerified,
  });

  const refreshToken = tokenUtils.getRefreshToken({
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
};
