declare namespace API {
    interface ResultPage<T> {
        current?: number;
        pageSize?: number;
        total?: number;
        list?: Array<T>;
    }

    interface Pages {
        current?: number;
        pageSize?: number;
    }

    interface PageInfo<T> {
        success?: boolean;
        errorMessage?: string;
        data?: ResultPage<T>;
    }


    interface Result<T> {
        success?: boolean;
        errorMessage?: string;
        data?: T;
    }

    interface Options {
        [key: string]: any
    }

    interface OptionsPages extends Pages, Options {

    }

}
