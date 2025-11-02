import { isAuthenticated } from "../../middlewares/isAuthenticated";
import { Request, Response } from "express";

function makeReq(overrides = {}): Partial<Request> {
  return { ...overrides } as Partial<Request>;
}

function makeRes() {
  const json = jest.fn();
  const status = jest.fn(() => ({ json }));
  return { status, json } as unknown as Response;
}

describe("isAuthenticated middleware", () => {
  test("responds 401 when req.isAuthenticated is missing or false", () => {
    const req = makeReq({ isAuthenticated: () => false });
    const res = makeRes();
    const next = jest.fn();

    (isAuthenticated as any)(req as Request, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Not authenticated" });
    expect(next).not.toHaveBeenCalled();
  });

  test("responds 401 when req.user is missing", () => {
    const req = makeReq({ isAuthenticated: () => true, user: null });
    const res = makeRes();
    const next = jest.fn();

    (isAuthenticated as any)(req as Request, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Unauthorized: User not found",
    });
    expect(next).not.toHaveBeenCalled();
  });

  test("calls next when authenticated and user exists", () => {
    const req = makeReq({ isAuthenticated: () => true, user: { _id: "123" } });
    const res = makeRes();
    const next = jest.fn();

    (isAuthenticated as any)(req as Request, res, next);

    expect(next).toHaveBeenCalled();
  });
});
