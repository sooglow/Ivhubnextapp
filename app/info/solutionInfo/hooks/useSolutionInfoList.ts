import { useQuery } from "@tanstack/react-query";
import { getSolutionInfoList } from "@/app/api/solutionInfo/solutionInfo";

interface useSolutionListParams {
  keyword: string;
  currentPage: number;
  pageSize: number;
  enabled?: boolean;
}

export function useSolutionInfoList({
  keyword,
  currentPage,
  pageSize,
  enabled = true,
}: useSolutionListParams) {
  return useQuery({
    queryKey: ["solutionInfoList", keyword, currentPage, pageSize],
    queryFn: () => getSolutionInfoList(keyword, currentPage, pageSize),
    enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });
}
