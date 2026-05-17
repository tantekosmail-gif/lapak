export class Paginations {
    static getPaging(page: number = 1, limit: number = 10): { skip: number; take: number } {
        const skip = (page - 1) * limit;
        return { skip, take: limit };
    }

}