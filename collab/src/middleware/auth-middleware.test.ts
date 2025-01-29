import type { User } from "@guardian/pan-domain-node";
import type { Request, Response } from "express";
import { mocked } from "jest-mock";
import { getVerifiedUser } from "../panDomainAuth";
import { authMiddleware } from "./auth-middleware";

interface MockResponse extends Response {
    locals: {
        user?: User;
    };
    status: jest.Mock;
}

jest.mock("../panDomainAuth");
jest.mock("@guardian/pan-domain-node")
const mockGetVerifiedUserFunction = mocked(getVerifiedUser);
const mockNextFunction = jest.fn();

const getMockRequest = (header: string | undefined) => {
    return {
        header: jest.fn().mockReturnValue(header),
    } as unknown as Request;
}

const getMockResponse = () => {
    return {
        locals: {},
        status: jest.fn().mockReturnValue({
            send: jest.fn(),
        }),
    } as unknown as MockResponse;
}

describe("auth-middleware", () => {
    beforeAll(() => {
        jest.resetAllMocks();
    });

    test("should return a 403 response where no cookie provided", async () => {
        const mockRequest = getMockRequest(undefined);
        const mockResponse = getMockResponse();

        await authMiddleware(mockRequest, mockResponse, mockNextFunction);

        expect(mockResponse.status).toHaveBeenCalledWith(403);
        expect(mockNextFunction).not.toHaveBeenCalled();
    });

    test("should return a 403 response where user is not authenticated", async () => {
        const mockRequest = getMockRequest("mock-panda-cookie");
        const mockResponse = getMockResponse();

        mockGetVerifiedUserFunction.mockResolvedValueOnce(null);
        await authMiddleware(mockRequest, mockResponse, mockNextFunction);

        expect(mockResponse.status).toHaveBeenCalledWith(403);
        expect(mockNextFunction).not.toHaveBeenCalled();
    });


    test("calls next where user authenticated", async () => {
        const mockRequest = getMockRequest("mock-panda-cookie");
        const mockResponse = getMockResponse();

        mockGetVerifiedUserFunction.mockResolvedValueOnce({ email: "jane.doe@guardian.co.uk" } as User);
        await authMiddleware(mockRequest, mockResponse, mockNextFunction);

        expect(mockResponse.status).not.toHaveBeenCalled();
        expect(mockResponse.locals["user"]).toStrictEqual({ email: "jane.doe@guardian.co.uk" });
        expect(mockNextFunction).toHaveBeenCalledTimes(1);
    });
});