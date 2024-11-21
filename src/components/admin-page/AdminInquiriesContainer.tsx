import { UserInquiry } from "@/models/user.models";
import { useEffect, useState } from "react";
import { Centrifuge } from "centrifuge";
import { 
  getConnectionToken, 
  getSubscriptionTokenForLiveAdminInquiriesAssignedUpdate, 
  getSubscriptionTokenForLiveAdminInquiriesMineUpdate, 
  getSubscriptionTokenForLiveAdminInquiriesSolvedUpdate, 
  getSubscriptionTokenForLiveAdminInquiriesUnassignedUpdate, 
  getSubscriptionTokenForLiveAdminInquiriesUnsolvedUpdate, 
  getSubscriptionTokenForLiveAdminInquiriesUpdate 
} from "@/api/webSocket.api";
import { useAuthStore } from "@/stores/auth.stores";
import { sortUserInquiriesByLastMessageDate } from "@/utils/user.utils";
import { useQueryClient } from "@tanstack/react-query";
import AdminInquiriesContainerItem from "./AdminInquiriesContainerItem";
import { TInquiryChannelType } from "@/models/admin.models";
import { determineAdminInquirySubscriptionChannelName } from "@/utils/admin.utils";


interface IAdminInquiriesContainerProps {
  inquiries: UserInquiry[];
  inquiryType: TInquiryChannelType;
}

const AdminInquiriesContainer = ({ inquiries, inquiryType }: IAdminInquiriesContainerProps) => {
  const [realInquiries, setRealInquiries] = useState<UserInquiry[]>(inquiries);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [connected, setConnected] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const {
    userId
  } = useAuthStore();

  const queryClient = useQueryClient();
  const subscriptionChannelName = determineAdminInquirySubscriptionChannelName(
    inquiryType, 
    userId as number
  );

  useEffect(() => {
    setRealInquiries(inquiries);
  }, [inquiries]);

  useEffect(() => {
    const client = new Centrifuge("ws://127.0.0.1:8000/connection/websocket", {
      getToken: async () => {
        const data = await getConnectionToken();
        return data.token;
      }
    });
    client.on('connecting', (ctx) => {
      setIsLoading(true);
      setConnected(false);
      setError(null);
    });
    client.on("error", (ctx) => {
      setIsLoading(false);
      setError("웹소켓 연결 중 오류가 발생했습니다.");
    });

    const subscription = client.newSubscription(subscriptionChannelName, {
      getToken: async () => {
        if (inquiryType === "unassigned") {
          const data = await getSubscriptionTokenForLiveAdminInquiriesUnassignedUpdate();
          return data.token;
        } else if (inquiryType === "assigned") {
          const data = await getSubscriptionTokenForLiveAdminInquiriesAssignedUpdate();
          return data.token;
        } else if (inquiryType === "solved") {
          const data = await getSubscriptionTokenForLiveAdminInquiriesSolvedUpdate();
          return data.token;
        } else if (inquiryType === "unsolved") {
          const data = await getSubscriptionTokenForLiveAdminInquiriesUnsolvedUpdate();
          return data.token;
        } else if (inquiryType === "mine") {
          const data = await getSubscriptionTokenForLiveAdminInquiriesMineUpdate();
          return data.token;
        } else {
          const data = await getSubscriptionTokenForLiveAdminInquiriesUpdate();
          return data.token;
        }
      }
    });
    subscription.on("subscribed", (ctx) => {
      setIsLoading(false);
      setConnected(true);
    });
    subscription.on("error", (ctx) => {
      setIsLoading(false);
      setError("해당 채널에 접속할 수 없습니다.");
    });
    subscription.on("join", (ctx) => {
      console.log(ctx);
    });
    subscription.on("leave", (ctx) => {
      console.log(ctx);
    });
    subscription.on("publication", (ctx) => {
      console.log(ctx);
      queryClient.removeQueries({
        queryKey: ['admin', "inquiries", "pagination"],
      });
      const sortedChatList = sortUserInquiriesByLastMessageDate(
        realInquiries,
        ctx.data, 
      );
      setRealInquiries(prevInquiries => [...sortedChatList]);
    });

    subscription.subscribe();
    client.connect();

    return () => {
      subscription.unsubscribe();
      client.disconnect();
    }
  }, [inquiryType]);

  if (realInquiries.length === 0) {
    return (
      <div className="h-[200px] flex flex-col items-center justify-center gap-[16px]">
        <p className="font-bold text-[32px]">
          (つ╥﹏╥)つ
        </p>
        <p className="font-bold text-[24px]">
          포스트가 없습니다.
        </p>
      </div>
    );
  }

  return (
    <div className="gap-[24px] items-stretch flex flex-col">
      {realInquiries.map((inquiry) => (
        <AdminInquiriesContainerItem key={inquiry.id} inquiry={inquiry} />
      ))}
    </div>
  );
}

export default AdminInquiriesContainer;