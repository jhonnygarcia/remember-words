export interface PagedListDto<T> {
    meta: MetaObject;
    data: T[];
}

export interface MetaObject {
    totalCount?: number;
    offset?: number;
    limit?: number;
}