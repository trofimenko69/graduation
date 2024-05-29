import errorCodes from '../config/errorCodes.json' assert { type: "json" }
import { toSnakeCase } from 'js-convert-case';

const errorStatuses = {
    [errorCodes.NotExist.errNum]: 404,
    [errorCodes.AlreadyExists.errNum]: 409,
    [errorCodes.Missing.errNum]: 400,
    [errorCodes.Invalid.errNum]: 400,
    [errorCodes.Duplicate.errNum]: 409,
    [errorCodes.NoFileUploaded.errNum]: 400,
};

// errors for application ui
export class AppError extends Error {
    constructor(obj, status = null) {
        super(obj.message);

        this.errNum = obj.errNum;
        this.errCode = obj.errCode;
        this.field = obj.field;

        this.key = obj.key ?? 'APP_ERROR';

        this.status = status ?? errorStatuses[obj.errNum] ?? 400;
    }

    toJSON() {
        return {
            errNum: this.errNum,
            errCode: this.errCode,
            message: this.message,
            field: this.field,
            key: this.key,
        };
    }
}

// Отсутствует параметр
export class AppErrorMissing extends AppError {
    constructor(parameter = 'Some', status, key) {
        super(
            {
                ...errorCodes.Missing,
                message: `${parameter} parameter is missing`,

                key: key ?? `MISSING_${toSnakeCase(parameter).toUpperCase()}`,
            },
            status
        );
    }
}

// Неправильный параметр (несоответствует проверке)
export class AppErrorInvalid extends AppError {
    constructor(parameter = 'Some', status, key) {
        super(
            {
                ...errorCodes.Invalid,
                message: `${parameter} parameter is invalid`,

                key: key ?? `INVALID_${toSnakeCase(parameter).toUpperCase()}`,
            },
            status
        );
    }
}

export class AppErrorInvalidReplaceMessage extends AppError {
    constructor(message = errorCodes.Invalid.message, status, key) {
        super(
            {
                ...errorCodes.Invalid,
                message,

                key: key ?? toSnakeCase(message).toUpperCase(),
            },
            status
        );
    }
}

// Объект уже существует (обычно при создании новых сущностей в БД)
export class AppErrorAlreadyExists extends AppError {
    constructor(parameter = 'Some', status, key) {
        super(
            {
                ...errorCodes.AlreadyExists,
                message: `${parameter} entity already exists`,

                key: key ?? `EXISTS_${toSnakeCase(parameter).toUpperCase()}`,
            },
            status
        );
    }
}

// Объект не существует (обычно при запросах к объекту)
export class AppErrorNotExist extends AppError {
    constructor(parameter = 'Some', status, key) {
        super(
            {
                ...errorCodes.NotExist,
                message: `${parameter} entity not exist`,

                key: key ?? `DOES_NOT_EXIST_${toSnakeCase(parameter).toUpperCase()}`,
            },
            status
        );
    }
}

export class AppErrorDuplicate extends AppError {
    constructor(field = null, status, key) {
        super(
            {
                ...errorCodes.Duplicate,
                field,

                key: key ?? `DUPLICATE_${toSnakeCase(field ?? 'some').toUpperCase()}`,
            },
            status
        );
    }
}

// Запрещенное действие, нет прав на выполнение
export class AppErrorForbiddenAction extends AppError {
    constructor(status, key) {
        super(
            {
                errCode: 'Forbidden',
                message: 'You do not have access to this action',
                key: key ?? 'FORBIDDEN_ACTION',
            },
            status ?? 403
        );
    }
}

    export class MultipleError {
    constructor(name, status, key) {
        this.name = name;
        this.status = status ?? 400;
        this.key = key ?? 'MULTIPLE_APP_ERROR';
        this.errors = [];
    }

    add(error) {
        this.errors.push(error);
    }
    toJSON() {
        return {
            name: this.name,
            status: this.status,
            key: this.key,
            errors: this.errors,
        };
    }
}

// error for developer
export class SystemError extends Error {
    constructor(status, err) {
        super(err);

        this.status = status ?? 400;
    }

    toJSON() {
        return {
            message: this.message,

            key: 'SYSTEM_ERROR',
        };
    }
}

// Позволяет не падать приложению при выбрасывании ошибок
export function asyncRoute(route) {
    return (req, res, next = console.error) => {
        return Promise.resolve(route(req, res, next)).catch(e => next(e));
    };
}