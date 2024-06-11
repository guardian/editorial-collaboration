import type { Request, Response } from "express";
import { mocked } from "jest-mock";
import { verify } from "../panDomainAuth";
import { authMiddleware } from "./auth-middleware";

interface MockResponse extends Response {
    status: jest.Mock;
}

jest.mock("../panDomainAuth");
const mockVerifyFunction = mocked(verify);

const mockNextFunction = jest.fn();

describe("auth-middleware", () => {
    beforeAll(() => {
        jest.resetAllMocks();
    });

    test("should return a 403 response where no cookie provided", async () => {
        const mockRequest = {
            header: jest.fn().mockReturnValue(undefined),
        } as unknown as Request;
        const mockResponse = {
            status: jest.fn().mockReturnValue({
                send: jest.fn(),
            }),
        } as unknown as MockResponse;

        await authMiddleware(mockRequest, mockResponse, mockNextFunction);
        expect(mockResponse.status).toHaveBeenCalledWith(403);
        expect(mockNextFunction).not.toHaveBeenCalled();
    });

    test("should return a 403 response where user is not authenticated", async () => {
        const mockRequest = {
            header: jest.fn().mockReturnValue({ Cookie: "wrong-cookie" }),
        } as unknown as Request;
        const mockResponse = {
            status: jest.fn().mockReturnValue({
                send: jest.fn(),
            }),
        } as unknown as MockResponse;

        mockVerifyFunction.mockResolvedValueOnce(false);
        await authMiddleware(mockRequest, mockResponse, mockNextFunction);
        expect(mockResponse.status).toHaveBeenCalledWith(403);
        expect(mockNextFunction).not.toHaveBeenCalled();
    });


    test("calls next where user authenticated", async () => {
        const mockRequest = {
            header: jest.fn().mockReturnValue({ Cookie: "mock-panda-cookie" }),
        } as unknown as Request;
        const mockResponse = {
            status: jest.fn().mockReturnValue({
                send: jest.fn(),
            }),
        } as unknown as MockResponse;

        mockVerifyFunction.mockResolvedValueOnce(true);
        await authMiddleware(mockRequest, mockResponse, mockNextFunction);
        expect(mockResponse.status).not.toHaveBeenCalled();
        expect(mockNextFunction).toHaveBeenCalledTimes(1);
    });
});