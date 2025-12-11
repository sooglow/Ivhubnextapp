import { useQuery } from "@tanstack/react-query";
import { getInfoView } from "@/app/api/info/info";
import { InfoViewResponse } from "@/app/info/info/types/View";

export function useInfoView(serial: string, userid: string = "GUEST") {
  return useQuery<InfoViewResponse>({
    queryKey: ["infoView", serial, userid],
    queryFn: () => getInfoView(serial, userid),
    enabled: !!serial,
  });
}
