
export enum StatusCode {
    SUCCESS = '10000',
    FAILURE = '10001',
    RETRY = '10002',
    INVALID_ACCESS_TOKEN = '10003',
    WE_MOVE = '10004',
}

export enum ResponseStatus {
    SUCCESS = 200,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    CONFLICT = 409,
    INTERNAL_ERROR = 500,
    SERVICE_UNAVAILABLE = 503,
}