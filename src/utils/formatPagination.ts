/**
 * Format pagination response
 * @param dataKey Key for the data array
 * @param data Data array
 * @param total Total number of items
 * @param page Current page number
 * @param limit Items per page
 * @returns Formatted pagination object
 */
export function formatPagination({
    dataKey,
    data,
    total,
    page,
    limit,
}: {
    dataKey: string;
    data: any[];
    total: number;
    page: number;
    limit: number;
}) {
    const totalPages = Math.ceil(total / limit);

    return {
        [dataKey]: data,
        pagination: {
            total,
            totalPages,
            currentPage: page,
            perPage: limit,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
            nextPage: page < totalPages ? page + 1 : null,
            prevPage: page > 1 ? page - 1 : null,
        },
    };
}
