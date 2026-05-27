import type { Session } from "next-auth";

export type MockGoogleProfile = {
  email: string;
  name?: string | null;
  image?: string | null;
};

export const mockGoogleProfile: MockGoogleProfile = {
  email: "jane.doe@example.com",
  name: "Jane Doe",
  image: "https://lh3.googleusercontent.com/a/jane.doe",
};

export const buildMockSession = (
  overrides: Partial<Session> = {},
): Session => ({
  user: {
    id: 1,
    email: mockGoogleProfile.email,
    name: mockGoogleProfile.name ?? null,
    image: mockGoogleProfile.image ?? null,
    ...(overrides.user ?? {}),
  },
  expires: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
  ...overrides,
});

export const getServerSessionMock = jest.fn();
export const getTokenMock = jest.fn();

jest.mock("next-auth", () => {
  const actual = jest.requireActual("next-auth");
  return {
    __esModule: true,
    ...actual,
    default: jest.fn(() => jest.fn()),
    getServerSession: (...args: unknown[]) => getServerSessionMock(...args),
  };
});

jest.mock("next-auth/jwt", () => ({
  __esModule: true,
  getToken: (...args: unknown[]) => getTokenMock(...args),
}));

jest.mock("next-auth/providers/google", () => ({
  __esModule: true,
  default: (config: Record<string, unknown>) => ({
    id: "google",
    name: "Google",
    type: "oauth",
    ...config,
  }),
}));

export const signedInAs = (overrides: Partial<Session> = {}) => {
  const session = buildMockSession(overrides);
  getServerSessionMock.mockResolvedValue(session);
  getTokenMock.mockResolvedValue({
    id: session.user?.id,
    email: session.user?.email,
    name: session.user?.name,
    picture: session.user?.image,
    userType: session.user?.userType,
  });
};

export const signedOut = () => {
  getServerSessionMock.mockResolvedValue(null);
  getTokenMock.mockResolvedValue(null);
};
