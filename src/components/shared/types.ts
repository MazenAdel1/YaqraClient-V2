export type InfiniteQueryResponse<D> = {
  data: D[];
  pageNumber: number;
  totalPages: number;
};
